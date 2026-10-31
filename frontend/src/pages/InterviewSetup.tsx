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
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const InterviewSetup = () => {
  const navigate = useNavigate();

  // Selection States
  const [selectedRole, setSelectedRole] = useState<string>('sde-1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Arrays', 'Trees', 'Graphs', 'DP', 'System Design'
  ]);
  const [selectedStyle, setSelectedStyle] = useState<string>('mock-company');
  const [features, setFeatures] = useState(INITIAL_FEATURES);

  // Handlers for Topic Selection
  const handleToggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSelectAllTopics = () => setSelectedTopics([...ALL_TOPICS]);
  const handleClearAllTopics = () => setSelectedTopics([]);
  const handleSelectMixedTopics = () =>
    setSelectedTopics(['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Recursion']);

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
    setIsStarting(true);
    setStartError(null);
    try {
      const roleObj = ROLES.find((r) => r.id === selectedRole);
      const enabledFeaturesList = features.filter((f) => f.enabled).map((f) => f.name);

      const payload = {
        role: roleObj?.name || 'SDE 1',
        difficulty: selectedDifficulty,
        topics: selectedTopics.length > 0 ? selectedTopics : ['Arrays'],
        style: selectedStyle,
        features: enabledFeaturesList,
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
      setStartError('Unable to connect to interview service. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-6 text-left">
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
              onSelectMixed={handleSelectMixedTopics}
            />

            {/* 4. INTERVIEW STYLE */}
            <InterviewStyleCardGroup
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />

            {/* 5. AI EVALUATION FEATURES */}
            <FeatureToggleGroup
              features={features}
              onToggleFeature={handleToggleFeature}
            />
          </div>

          {/* RIGHT: STICKY COMPACT SUMMARY & LAUNCH CTA (4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
            {/* COMPACT SUMMARY PREVIEW CARD */}
            <InterviewPreviewCard
              selectedRole={selectedRole}
              selectedDifficulty={selectedDifficulty}
              selectedTopics={selectedTopics}
              selectedStyle={selectedStyle}
              enabledFeaturesCount={enabledFeaturesCount}
            />

            {/* COMPACT SESSION FLOW TIMELINE */}
            <InterviewTimeline />

            {startError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{startError}</span>
              </div>
            )}

            {/* START INTERVIEW CTA */}
            <button
              type="button"
              disabled={isStarting}
              onClick={handleStartInterview}
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing AI Session...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Interview Session</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-muted-foreground font-medium">
              Real-time evaluation with instant post-session feedback.
            </p>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
