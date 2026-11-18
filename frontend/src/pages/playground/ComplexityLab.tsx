import React, { useState, useCallback } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Activity, BarChart2, Sliders, Table, Cpu, BookOpen } from 'lucide-react';
import {
  ComplexityId,
  AlgorithmComplexityInfo,
  ALGORITHM_COMPLEXITY_DATA,
} from '../../lib/complexityMath';
import { ComplexityGraph } from '../../components/playground/complexity/ComplexityGraph';
import { ComplexitySlider } from '../../components/playground/complexity/ComplexitySlider';
import { ComplexityComparisonTable } from '../../components/playground/complexity/ComplexityComparisonTable';
import { AlgorithmComplexityCard } from '../../components/playground/complexity/AlgorithmComplexityCard';
import { ComplexityExplainer } from '../../components/playground/complexity/ComplexityExplainer';

export const ComplexityLab: React.FC = () => {
  // Input size state (default n = 20: allows visualizing O(1) through O(n!) nicely)
  const [nVal, setNVal] = useState<number>(20);
  const [maxNRange, setMaxNRange] = useState<number>(100);

  // Selected curves to display on graph (all 8 available by default or customized)
  const [selectedCurves, setSelectedCurves] = useState<ComplexityId[]>([
    'o_1',
    'o_log_n',
    'o_n',
    'o_n_log_n',
    'o_n_2',
    'o_n_3',
    'o_2_n',
    'o_n_fact',
  ]);

  // Focused / highlighted complexity curve
  const [highlightedComplexity, setHighlightedComplexity] = useState<ComplexityId | null>(
    'o_n_log_n'
  );

  // Selected algorithm for deep-dive analysis
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmComplexityInfo>(
    ALGORITHM_COMPLEXITY_DATA[6] // Default to Merge Sort (O(n log n))
  );

  const toggleCurve = useCallback((id: ComplexityId) => {
    setSelectedCurves((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((c) => c !== id) : prev;
      }
      return [...prev, id];
    });
  }, []);

  const handleSelectAlgo = useCallback((algo: AlgorithmComplexityInfo) => {
    setSelectedAlgo(algo);
    setHighlightedComplexity(algo.primaryComplexityId);
    setSelectedCurves((prev) =>
      prev.includes(algo.primaryComplexityId) ? prev : [...prev, algo.primaryComplexityId]
    );
  }, []);

  const handleSelectComplexity = useCallback((id: ComplexityId) => {
    setHighlightedComplexity(id);
    setSelectedCurves((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const navLinks = [
    { id: 'graph-section', label: 'Complexity Graph', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'controller-section', label: 'Input Controller', icon: <Sliders className="w-4 h-4" /> },
    { id: 'comparison-section', label: 'Comparison Matrix', icon: <Table className="w-4 h-4" /> },
    { id: 'algorithm-section', label: 'Algorithm Inspector', icon: <Cpu className="w-4 h-4" /> },
    { id: 'learning-section', label: 'Learning Lab', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-20 max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/60 to-primary/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" /> Interactive Time Complexity Laboratory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Complexity Laboratory
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-3xl font-medium leading-relaxed">
                Explore how computational operations scale as input size $n$ grows. Compare all fundamental asymptotic Big-O growth orders from $O(1)$ constant time to $O(n!)$ factorial explosion with real mathematical functions, interactive scaling, and live algorithm instrumentation.
              </p>
            </div>
          </div>
        </section>

        {/* 1. TIME COMPLEXITY GRAPH (CENTRAL FOCUS) */}
        <section id="graph-section" className="w-full">
          <ComplexityGraph
            nVal={nVal}
            onNValChange={setNVal}
            selectedCurves={selectedCurves}
            onToggleCurve={toggleCurve}
            highlightedComplexity={highlightedComplexity}
            onSelectComplexity={handleSelectComplexity}
            maxNRange={maxNRange}
          />
        </section>

        {/* 2. INTERACTIVE SLIDER CONTROLLER */}
        <section id="controller-section" className="w-full">
          <ComplexitySlider
            nVal={nVal}
            onChange={setNVal}
            maxNRange={maxNRange}
            onMaxNRangeChange={setMaxNRange}
            minN={1}
          />
        </section>

        {/* 3. DYNAMIC COMPLEXITY COMPARISON TABLE */}
        <section id="comparison-section" className="w-full">
          <ComplexityComparisonTable
            nVal={nVal}
            selectedComplexity={highlightedComplexity}
            onSelectComplexity={handleSelectComplexity}
            selectedCurves={selectedCurves}
          />
        </section>

        {/* 4. ALGORITHM COMPLEXITY ANALYSIS */}
        <section id="algorithm-section" className="w-full">
          <AlgorithmComplexityCard
            selectedAlgoId={selectedAlgo.id}
            onSelectAlgo={handleSelectAlgo}
            nVal={nVal}
            onHighlightCurve={handleSelectComplexity}
          />
        </section>

        {/* 5. DYNAMIC LEARNING & EXPLANATION LAB */}
        <section id="learning-section" className="w-full">
          <ComplexityExplainer
            complexityId={highlightedComplexity || 'o_n_log_n'}
            nVal={nVal}
          />
        </section>

      </div>
    </WorkspaceLayout>
  );
};
