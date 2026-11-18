import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { InterviewHero } from '../components/interview/InterviewHero';
import { RoleCardGroup, ROLES } from '../components/interview/RoleCardGroup';
import { DifficultySelector } from '../components/interview/DifficultySelector';
import { TopicChipGroup, ALL_TOPICS } from '../components/interview/TopicChipGroup';
import { InterviewStyleCardGroup } from '../components/interview/InterviewStyleCardGroup';
import { FeatureToggleGroup, INITIAL_FEATURES } from '../components/interview/FeatureToggleGroup';
import { InterviewPreviewCard } from '../components/interview/InterviewPreviewCard';
import { InterviewTimeline } from '../components/interview/InterviewTimeline';
import { TimePressureSelector } from '../components/interview/TimePressureSelector';
import { InterviewHistorySection } from '../components/interview/InterviewHistorySection';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const InterviewSetup = () => {
  const navigate = useNavigate();

  // Selection States
  const [selectedRole, setSelectedRole] = useState<string>('sde');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Data Structures and Algorithms',
    'Object-Oriented Programming',
    'DBMS and SQL',
    'Operating Systems',
  ]);
  const [selectedStyle, setSelectedStyle] = useState<string>('mock-company');
  const [features, setFeatures] = useState(INITIAL_FEATURES);

  // Time Pressure Mode State
  const [timePressureEnabled, setTimePressureEnabled] = useState<boolean>(false);
  const [timePressureSeconds, setTimePressureSeconds] = useState<number>(60);

  // Handlers for Topic Selection
  const handleToggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSelectAllTopics = () => setSelectedTopics([...ALL_TOPICS]);
  const handleClearAllTopics = () => setSelectedTopics([]);
  const handleSelectPreset = (preset: string[]) => setSelectedTopics([...preset]);

  // Handler for Feature Toggles
  const handleToggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const enabledFeaturesCount = features.filter((f) => f.enabled).length;

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Handle CTA Click -> Call API and Navigate to Session
  const handleStartInterview = async () => {
    if (selectedTopics.length === 0) {
      setStartError('Please select at least one topic for your interview.');
      return;
    }

    setIsStarting(true);
    setStartError(null);
    try {
      const roleObj = ROLES.find((r) => r.id === selectedRole);
      const enabledFeaturesList = features.filter((f) => f.enabled).map((f) => f.name);

      const payload = {
        role: roleObj?.name || 'Software Engineer',
        difficulty: selectedDifficulty,
        topics: selectedTopics,
        style: selectedStyle,
        features: enabledFeaturesList,
        timeLimitPerQuestion: timePressureEnabled ? timePressureSeconds : 0,
      };

      const res = await api.post('/interviews', payload);
      const session = res.data.session;

      navigate(`/practice/interview/session/${session.id}`, {
        state: {
          session,
          firstMessage: res.data.firstMessage,
          aiProvider: res.data.aiProvider,
          missingConfigNotice: res.data.missingConfigNotice,
          voiceNotice: res.data.voiceNotice,
        },
      });
    } catch (err: any) {
      console.error('Failed to start interview session:', err);
      setStartError(err?.response?.data?.error || 'Unable to connect to interview service. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-6 text-left pb-16 max-w-7xl mx-auto">
        {/* COMPACT PAGE HEADER */}
        <InterviewHero />

        {/* 2-COLUMN CONFIGURATION & SUMMARY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: MAIN CONFIGURATION PANELS (8 of 12 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. TARGET ROLE */}
            <RoleCardGroup
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />

            {/* 2. DIFFICULTY LEVEL */}
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
            />

            {/* 3. INTERVIEW TOPICS */}
            <TopicChipGroup
              selectedTopics={selectedTopics}
              onToggleTopic={handleToggleTopic}
              onSelectAll={handleSelectAllTopics}
              onClearAll={handleClearAllTopics}
              onSelectPreset={handleSelectPreset}
            />

            {/* 4. OPTIONAL TIMED INTERVIEW MODE */}
            <TimePressureSelector
              enabled={timePressureEnabled}
              onToggle={setTimePressureEnabled}
              seconds={timePressureSeconds}
              onSelectSeconds={setTimePressureSeconds}
            />

            {/* 5. INTERVIEW FORMAT / STYLE */}
            <InterviewStyleCardGroup
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />

            {/* 6. AI EVALUATION MODULES */}
            <FeatureToggleGroup
              features={features}
              onToggleFeature={handleToggleFeature}
            />
          </div>

          {/* RIGHT: FLOATING PREVIEW & ACTIONS (4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">
            {/* Real-time Summary Card */}
            <InterviewPreviewCard
              selectedRole={selectedRole}
              selectedDifficulty={selectedDifficulty}
              selectedTopics={selectedTopics}
              selectedStyle={selectedStyle}
              enabledFeaturesCount={enabledFeaturesCount}
              timeLimitPerQuestion={timePressureEnabled ? timePressureSeconds : 0}
            />

            {/* Error Message if API fails */}
            {startError && (
              <div className="p-3.5 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-start gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{startError}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleStartInterview}
              disabled={isStarting}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer transform-gpu hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing AI Session...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Interview</span>
                </>
              )}
            </button>

            {/* Interview Process Timeline */}
            <InterviewTimeline />
          </div>
        </div>

        {/* RECENT INTERVIEW HISTORY SECTION */}
        <InterviewHistorySection />
      </div>
    </WorkspaceLayout>
  );
};
