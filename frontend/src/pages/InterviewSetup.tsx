import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { InterviewHero } from '../components/interview/InterviewHero';
import { RoleCardGroup, ROLES } from '../components/interview/RoleCardGroup';
import { DifficultySelector } from '../components/interview/DifficultySelector';
import { TopicChipGroup, ALL_TOPICS } from '../components/interview/TopicChipGroup';
import { InterviewStyleCardGroup, STYLES } from '../components/interview/InterviewStyleCardGroup';
import { FeatureToggleGroup, INITIAL_FEATURES } from '../components/interview/FeatureToggleGroup';
import { InterviewPreviewCard } from '../components/interview/InterviewPreviewCard';
import { InterviewTimeline } from '../components/interview/InterviewTimeline';
import { Play, Sparkles } from 'lucide-react';

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

  // Handle CTA Click -> Navigate to Session
  const handleStartInterview = () => {
    const config = {
      role: ROLES.find((r) => r.id === selectedRole),
      difficulty: selectedDifficulty,
      topics: selectedTopics,
      style: STYLES.find((s) => s.id === selectedStyle),
      features: features.filter((f) => f.enabled).map((f) => f.name),
      startedAt: new Date().toISOString(),
    };

    navigate('/practice/interview/session', { state: config });
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Expanded Container matching AlgoVis 1600px Layout */}
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-8">
        {/* DASHBOARD HERO BANNER */}
        <InterviewHero />

        {/* DASHBOARD MAIN 2-COLUMN GRID (70% LEFT / 30% RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT WORKSPACE PANEL (~70% width) */}
          <div className="lg:col-span-8 flex flex-col gap-8 text-left">
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

          {/* RIGHT STICKY SIDEBAR PANEL (~30% width) */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24 text-left">
            {/* LIVE SUMMARY PREVIEW CARD */}
            <InterviewPreviewCard
              selectedRole={selectedRole}
              selectedDifficulty={selectedDifficulty}
              selectedTopics={selectedTopics}
              selectedStyle={selectedStyle}
              enabledFeaturesCount={enabledFeaturesCount}
            />

            {/* FLOW TIMELINE */}
            <InterviewTimeline />

            {/* START INTERVIEW CTA */}
            <motion.button
              onClick={handleStartInterview}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white font-black text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Play className="w-5 h-5 fill-current" />
              <span>Start AI Interview</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
