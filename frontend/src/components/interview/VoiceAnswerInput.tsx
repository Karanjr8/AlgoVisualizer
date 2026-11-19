import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Edit3,
  Keyboard,
  RefreshCw,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../../lib/api';

interface VoiceAnswerInputProps {
  sessionId: string;
  isSubmitting: boolean;
  disabled?: boolean;
  onSubmit: (answerText: string, modality: 'text' | 'voice', timeSpentSeconds?: number) => Promise<void>;
  timeRemaining?: number | null;
  placeholderText?: string;
}

type InputMode = 'text' | 'voice';

/**
 * Explicit 7-state machine for voice response flow:
 * IDLE -> RECORDING -> RECORDED -> UPLOADING -> TRANSCRIBING -> TRANSCRIBED -> (ERROR / SUBMIT)
 */
export type VoiceState =
  | 'IDLE'
  | 'RECORDING'
  | 'RECORDED'
  | 'UPLOADING'
  | 'TRANSCRIBING'
  | 'TRANSCRIBED'
  | 'ERROR';

export const VoiceAnswerInput: React.FC<VoiceAnswerInputProps> = ({
  sessionId,
  isSubmitting,
  disabled = false,
  onSubmit,
  timeRemaining,
  placeholderText,
}) => {
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');

  // Voice recording state machine
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm');
  const [transcript, setTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 40, 20, 35, 50, 30, 20, 45, 60, 30, 15]);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clean up visualization animation and timer
  const cleanupVisualizerAndTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
  }, []);

  // Stop hardware mic tracks safely
  const stopMediaTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }
  }, []);

  // Clean up all resources
  const cleanupAllMedia = useCallback(() => {
    cleanupVisualizerAndTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    stopMediaTracks();
  }, [cleanupVisualizerAndTimer, stopMediaTracks]);

  useEffect(() => {
    return () => {
      cleanupAllMedia();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [cleanupAllMedia, audioUrl]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Check supported mime types
  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c)) return c;
    }
    return '';
  };

  // Start Voice Recording
  const handleStartRecording = async () => {
    setVoiceError(null);
    audioChunksRef.current = [];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBase64(null);
    setTranscript('');
    setIsEditingTranscript(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceError('Audio recording is not supported on this browser. Please type your answer.');
      setVoiceState('ERROR');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const mimeType = getSupportedMimeType() || 'audio/webm';
      setAudioMimeType(mimeType);

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording actually finishes and produces container audio chunks
      recorder.onstop = async () => {
        // Stop the mic tracks only now so the audio container trailer is properly flushed
        stopMediaTracks();

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setVoiceError('Recording was empty. Please check your microphone and speak clearly.');
          setVoiceState('ERROR');
          return;
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setVoiceState('UPLOADING');

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const base64Clean = rawBase64.includes(',') ? rawBase64.split(',')[1] : rawBase64;
          setAudioBase64(base64Clean);

          // Automatically trigger Gemini transcription
          await transcribeWithGemini(base64Clean, mimeType);
        };
      };

      // Set up AudioContext Analyser for live animated waveform
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevels = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              // Pick 12 representative bins
              const sampled: number[] = [];
              const step = Math.floor(dataArray.length / 12);
              for (let i = 0; i < 12; i++) {
                const val = dataArray[i * step] || 0;
                // Scale value between 15% and 100% height
                const heightPercent = Math.max(15, Math.min(100, Math.round((val / 255) * 100)));
                sampled.push(heightPercent);
              }
              setAudioLevels(sampled);
              animationFrameRef.current = requestAnimationFrame(updateLevels);
            }
          };
          updateLevels();
        }
      } catch (audioCtxErr) {
        console.warn('AudioContext visualization setup failed, falling back to static animation:', audioCtxErr);
      }

      recorder.start(250); // Slice data every 250ms
      setVoiceState('RECORDING');
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          // Cap recording at 180 seconds (3 minutes)
          if (prev >= 180) {
            handleStopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceError('Microphone permission was denied. Please allow microphone access in your browser or type your answer.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setVoiceError('No microphone detected. Please connect an audio input device or type your answer.');
      } else {
        setVoiceError(`Failed to access microphone: ${err.message || 'Unknown error'}`);
      }
      setVoiceState('ERROR');
      cleanupAllMedia();
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    cleanupVisualizerAndTimer();
    setVoiceState('RECORDED');

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  // Cancel Recording
  const handleCancelRecording = () => {
    cleanupAllMedia();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBase64(null);
    setTranscript('');
    setVoiceState('IDLE');
    setRecordingSeconds(0);
    setVoiceError(null);
  };

  // Transcribe recorded audio with Gemini
  const transcribeWithGemini = async (base64Data: string, mime: string) => {
    setVoiceState('TRANSCRIBING');
    setVoiceError(null);

    try {
      const res = await api.post(`/interviews/${sessionId}/transcribe-audio`, {
        audioBase64: base64Data,
        mimeType: mime,
      });

      if (res.data?.emptySpeech || !res.data?.transcript?.trim()) {
        setVoiceError('No audible speech was detected in your recording. Please check your mic volume and record again.');
        setTranscript('');
        setVoiceState('ERROR');
      } else {
        setTranscript(res.data.transcript);
        setVoiceState('TRANSCRIBED');
      }
    } catch (err: any) {
      console.error('Gemini transcription failed:', err);
      const errMsg =
        err?.response?.data?.error ||
        'Failed to transcribe voice response with Gemini AI. You can retry or type your answer.';
      setVoiceError(errMsg);
      setVoiceState('ERROR');
    }
  };

  // Submit Text Answer
  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const answer = textInput.trim();
    if (!answer || isSubmitting) return;

    await onSubmit(answer, 'text');
    setTextInput('');
  };

  // Submit Voice Answer
  const handleVoiceSubmit = async () => {
    const finalAnswer = transcript.trim();
    if (!finalAnswer && !audioBase64) {
      setVoiceError('Cannot submit empty answer. Please record your explanation or type a response.');
      return;
    }

    await onSubmit(finalAnswer, 'voice', recordingSeconds);
    handleCancelRecording();
    setMode('text'); // reset back to text mode after submitting
  };

  // Textarea key handling (Ctrl + Enter to submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const isVoiceProcessing = voiceState === 'UPLOADING' || voiceState === 'TRANSCRIBING';

  return (
    <div className="flex flex-col gap-3">
      {/* MODE SWITCHER TABS */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/70 text-xs font-semibold shadow-2xs">
          <button
            type="button"
            onClick={() => {
              if (voiceState === 'RECORDING') handleCancelRecording();
              setMode('text');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'text'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-primary" />
            <span>Type Answer</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'voice'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-500" />
            <span className="flex items-center gap-1">
              Voice Answer
              <span className="px-1 py-0.2 rounded-full bg-purple-500/15 text-[9px] font-extrabold text-purple-500 uppercase tracking-wider">
                Gemini Audio
              </span>
            </span>
          </button>
        </div>

        {timeRemaining !== null && timeRemaining !== undefined && timeRemaining > 0 && (
          <div className="text-xs font-semibold text-amber-500 flex items-center gap-1">
            <span>⏱️ Time: {timeRemaining}s</span>
          </div>
        )}
      </div>

      {/* ERROR BANNER */}
      {voiceError && (
        <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-medium flex items-start gap-2 shadow-xs animate-in fade-in-0 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{voiceError}</p>
          </div>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="hover:opacity-80 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: TEXT ANSWER INPUT                                */}
      {/* ======================================================== */}
      {mode === 'text' && (
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting || disabled}
              placeholder={
                placeholderText ||
                (isSubmitting
                  ? 'Gemini AI is currently evaluating your answer...'
                  : 'Type your technical response here. Walk through your approach, key concepts, trade-offs, and complexity... (Ctrl + Enter to submit)')
              }
              className="w-full p-4 rounded-2xl bg-card border border-border/80 text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60 resize-y shadow-xs disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Enter</kbd> to submit
              </span>
              <span>{textInput.length} characters</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('voice')}
                title="Switch to Voice Mode"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 hover:bg-muted text-foreground font-semibold text-xs transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">Record Audio</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || disabled || !textInput.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Answer</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* MODE 2: VOICE ANSWER INPUT                               */}
      {/* ======================================================== */}
      {mode === 'voice' && (
        <div className="rounded-2xl border border-purple-500/30 bg-card p-4 sm:p-5 shadow-sm space-y-4">
          {/* 1. STATE: IDLE */}
          {voiceState === 'IDLE' && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 ring-4 ring-purple-500/20 group hover:scale-105 transition-transform">
                  <Mic className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-foreground">Speak Your Answer</h4>
                <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                  Explain your approach verbally just like in an actual technical interview. Gemini AI will listen, transcribe, and contextually evaluate your reasoning.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isSubmitting || disabled}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Recording Answer</span>
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground/70">
                You will be able to review, edit, or re-record before final submission.
              </span>
            </div>
          )}

          {/* 2. STATE: RECORDING */}
          {voiceState === 'RECORDING' && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in-0 duration-200">
              {/* Header Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-bold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span>Recording in progress: {formatTime(recordingSeconds)}</span>
              </div>

              {/* LIVE AUDIO WAVEFORM VISUALIZER */}
              <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-xs px-4">
                {audioLevels.map((lvl, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${lvl}%` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-indigo-400 transition-all duration-75 ease-out shadow-xs"
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Discuss algorithms, time/space complexity, data structures, and edge cases clearly.
              </p>

              {/* Recording Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop & Transcribe Response</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. STATE: UPLOADING or TRANSCRIBING */}
          {isVoiceProcessing && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-in fade-in-0 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-sm">
                <Sparkles className="w-6 h-6 animate-spin [animation-duration:3s]" />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                {voiceState === 'UPLOADING'
                  ? 'Processing Recorded Audio...'
                  : 'Gemini AI is Transcribing Your Speech...'}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Recognizing technical terms, complexity equations, and algorithm design reasoning.
              </p>
              <div className="w-36 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* 4. STATE: TRANSCRIBED or ERROR (with recorded audio retained) */}
          {(voiceState === 'TRANSCRIBED' || voiceState === 'RECORDED' || voiceState === 'ERROR') && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              {/* Audio Playback & Status bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>Audio Recording</span>
                      {recordingSeconds > 0 && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          ({formatTime(recordingSeconds)})
                        </span>
                      )}
                    </div>

                    {/* ONLY display success badge when transcription actually succeeded */}
                    {voiceState === 'TRANSCRIBED' && transcript.trim().length > 0 && (
                      <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Transcribed by Gemini
                      </div>
                    )}

                    {voiceState === 'ERROR' && (
                      <div className="text-[11px] text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Transcription needs attention
                      </div>
                    )}
                  </div>
                </div>

                {audioUrl && (
                  <audio
                    src={audioUrl}
                    controls
                    className="h-8 max-w-xs w-full sm:w-auto text-xs"
                  />
                )}
              </div>

              {/* TRANSCRIPT PREVIEW & EDIT BOX */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-primary" /> Transcript Preview & Edit
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Review or correct any algorithm names / equations before submitting
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={transcript}
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      setIsEditingTranscript(true);
                    }}
                    placeholder={
                      voiceState === 'ERROR'
                        ? 'Transcription did not succeed. You can retry AI transcription above or type/edit your response here directly.'
                        : 'Transcription text will appear here. You can edit it if needed.'
                    }
                    className="w-full p-3.5 rounded-xl bg-background border border-border text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-y shadow-2xs"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>{transcript.length} characters</span>
                  {isEditingTranscript && (
                    <span className="text-primary font-medium">Edited by candidate</span>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                    <span>Re-record</span>
                  </button>

                  {audioBase64 && (!transcript.trim() || voiceState === 'ERROR') && (
                    <button
                      type="button"
                      onClick={() => transcribeWithGemini(audioBase64, audioMimeType)}
                      disabled={isSubmitting || isVoiceProcessing}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-500/40 hover:bg-purple-500/10 text-xs font-semibold text-purple-600 dark:text-purple-400 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry AI Transcription</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCancelRecording}
                    disabled={isSubmitting}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Discard
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {voiceState === 'ERROR' && !transcript.trim() && (
                    <button
                      type="button"
                      onClick={() => setMode('text')}
                      className="px-3 py-2 rounded-xl border border-border/80 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                    >
                      Switch to Typing
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleVoiceSubmit}
                    disabled={isSubmitting || disabled || !transcript.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm & Submit Voice Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
