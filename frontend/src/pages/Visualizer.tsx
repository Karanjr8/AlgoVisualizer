import { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { useSimulation } from '../hooks/useSimulation';
import { generateElements } from '../lib/utils';
import { generateFrames } from '../lib/algorithms';
import type { AlgorithmType } from '../types/visualizer';
import { EngineRenderer } from '../components/visualizer/EngineRenderer';
import { SideControls } from '../components/visualizer/SideControls';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodeTabs } from '../components/visualizer/CodeTabs';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { algorithmContent } from '../data/algorithmContent';
import { CATEGORIES } from '../data/categories';
import { 
  Clock, HardDrive, AlertCircle, PlayCircle, BookOpen, Search, 
  CheckCircle2, Code2, Link as LinkIcon, Sparkles, AlertTriangle, Lightbulb, Map,
  ChevronLeft, ChevronRight, FileText
} from 'lucide-react';

export const Visualizer = () => {
  const { categoryId, algorithmId } = useParams();
  const { initialElements, setInitialElements, speed, searchTarget, mode } = useVisualizerStore();

  const algorithm = (algorithmId as AlgorithmType) || 'bubble';

  useEffect(() => {
    if (initialElements.length === 0) {
      setInitialElements(generateElements(15));
    }
  }, [initialElements, setInitialElements]);

  const frames = useMemo(
    () => generateFrames(algorithm, initialElements, { searchTarget: searchTarget ?? undefined }),
    [initialElements, algorithm, searchTarget],
  );

  const simulation = useSimulation(frames, speed, mode);

  const content = algorithmContent[algorithm];
  const category = categoryId 
    ? CATEGORIES.find(c => c.id === categoryId) 
    : CATEGORIES.find(c => c.algorithms.some(a => a.id === algorithm));
  const algoMeta = category?.algorithms.find(a => a.id === algorithm);

  if (!content || !category || !algoMeta) {
    return <Navigate to="/explore" replace />;
  }

  const currentIdx = category.algorithms.findIndex(a => a.id === algorithm);
  const prevTopic = currentIdx > 0 ? category.algorithms[currentIdx - 1] : null;
  const nextTopic = currentIdx < category.algorithms.length - 1 ? category.algorithms[currentIdx + 1] : null;


  const navLinks = [
    { id: 'problem-description', label: 'Problem Description', icon: <FileText className="w-4 h-4" /> },
    { id: 'visualization', label: 'Interactive Visualization', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'overview', label: 'Overview & Intuition', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'walkthrough', label: 'Step-by-Step Walkthrough', icon: <Map className="w-4 h-4" /> },
    { id: 'dry-run', label: 'Dry Run', icon: <Search className="w-4 h-4" /> },
    { id: 'complexities', label: 'Complexity Analysis', icon: <Clock className="w-4 h-4" /> },
    { id: 'code', label: 'Code Implementation', icon: <Code2 className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Notes', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice Problems', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout
      navLinks={navLinks}
    >
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/explore/${category?.id}`} className="text-primary hover:underline text-sm font-semibold tracking-wide">{category?.title || 'Algorithms'}</Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-muted-foreground text-sm font-semibold capitalize">{algoMeta?.title || algorithm}</span>
            </div>
            
            <h1 className="type-page-title mb-6">{algoMeta?.title || 'Algorithm'}</h1>
            
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold border border-green-500/30 text-green-400 bg-green-500/10 uppercase tracking-wider shadow-sm">
                {algoMeta?.difficulty || 'Easy'}
              </span>
              <div className="flex items-center gap-2 text-sm text-foreground bg-card px-4 py-1.5 rounded-full border border-border shadow-sm backdrop-blur-sm">
                <Clock className="w-4 h-4 text-primary" /> 
                <span className="font-mono font-bold tracking-wide">{algoMeta?.timeComplexity || 'O(N)'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground bg-card px-4 py-1.5 rounded-full border border-border shadow-sm backdrop-blur-sm">
                <HardDrive className="w-4 h-4 text-secondary" /> 
                <span className="font-mono font-bold tracking-wide">{algoMeta?.spaceComplexity || 'O(1)'}</span>
              </div>
            </div>
          </header>

          {/* Problem Description Section (First under Header) */}
          <section id="problem-description" className="w-full scroll-mt-24 mb-12 text-left">
            <div className="bg-card/80 border border-border/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Problem Description</h2>
                  <p className="text-xs text-muted-foreground">{algoMeta?.description || 'Problem statement and requirements'}</p>
                </div>
              </div>

              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p className="text-foreground font-medium">{content.introduction}</p>
              </div>

              {content.dryRun && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/80 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Sample Input</span>
                    <span className="text-xs font-bold text-foreground">{content.dryRun.input}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-background/60 border border-border/80 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Expected Output</span>
                    <span className="text-xs font-bold text-foreground">{content.dryRun.output}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Visualization Anchor (Centerpiece) */}
          <section id="visualization" className="w-full scroll-mt-24 mb-16 text-left">
            <div className="w-full bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative min-h-[500px] md:min-h-[600px]">
              <div className="flex-1 w-full flex flex-col items-center justify-center p-4 md:p-8 relative bg-gradient-to-b from-transparent to-background/50">
                
                {/* The Animation */}
                <div className="flex-1 w-full flex items-center justify-center min-h-[300px] z-10">
                  <EngineRenderer algorithm={algorithm} frame={simulation.currentFrame} initialElements={initialElements} />
                </div>

                {/* Embedded Controls */}
                <div className="w-full mb-4 z-20">
                  <SideControls simulation={simulation} algorithm={algorithm} />
                </div>

                {/* Overlaid Live Explanation Panel */}
                <div className="w-full bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl p-4 md:p-6 shadow-xl z-20">
                  <ExplanationPanel
                    frame={simulation.currentFrame}
                    currentIndex={simulation.currentIndex}
                    totalFrames={simulation.totalFrames}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Overview & Intuition */}
          <section id="overview" className="scroll-mt-24 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 hover:bg-card transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold">Introduction</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{content.introduction}</p>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-6 hover:bg-card transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold">Intuition</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{content.intuition}</p>
              </div>
            </div>

            {content.whyGreedyWorks && (
              <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-amber-400">Why Greedy Works Here</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{content.whyGreedyWorks}</p>
              </div>
            )}

            {content.patternRecognition && content.patternRecognition.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Search className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-400">How to Recognize This Pattern</h2>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.patternRecognition.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-300 bg-background/50 border border-border/60 p-3 rounded-xl">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Walkthrough */}
          <section id="walkthrough" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Step-by-Step Walkthrough</h2>
            <div className="space-y-4">
              {content.walkthrough?.map((step, i) => (
                <div key={i} className="flex gap-4 md:gap-6 bg-card/10 border border-border p-4 md:p-6 rounded-2xl relative overflow-hidden group hover:border-border transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border border-border font-bold text-sm md:text-lg shadow-inner">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-1">{step.phase}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dry Run */}
          <section id="dry-run" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Dry Run</h2>
            <div className="bg-[#0d1117] rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="grid grid-cols-2 border-b border-border bg-[#161b22]">
                <div className="p-3 border-r border-border text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Input</span>
                  <code className="text-red-400 font-mono text-xs md:text-sm">{content.dryRun?.input}</code>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Output</span>
                  <code className="text-green-400 font-mono text-xs md:text-sm">{content.dryRun?.output}</code>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <ol className="space-y-2 md:space-y-3 font-mono text-xs md:text-sm text-gray-300">
                  {content.dryRun?.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 md:gap-4">
                      <span className="text-primary/50 mt-0.5">{(i+1).toString().padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Complexity Analysis */}
          <section id="complexities" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Complexity Analysis</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl text-center relative overflow-hidden group hover:bg-green-500/10 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-[100%] transition-transform group-hover:scale-110" />
                <div className="text-green-500 font-bold mb-1 text-[10px] md:text-xs uppercase tracking-wider">Best Case</div>
                <div className="font-mono text-xl md:text-2xl text-foreground font-black tracking-tight">{content.complexities.time.best}</div>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/10 p-5 rounded-2xl text-center relative overflow-hidden group hover:bg-yellow-500/10 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-[100%] transition-transform group-hover:scale-110" />
                <div className="text-yellow-500 font-bold mb-1 text-[10px] md:text-xs uppercase tracking-wider">Average Case</div>
                <div className="font-mono text-xl md:text-2xl text-foreground font-black tracking-tight">{content.complexities.time.average}</div>
              </div>
              <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl text-center relative overflow-hidden group hover:bg-red-500/10 transition-colors">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-[100%] transition-transform group-hover:scale-110" />
                <div className="text-red-500 font-bold mb-1 text-[10px] md:text-xs uppercase tracking-wider">Worst Case</div>
                <div className="font-mono text-xl md:text-2xl text-foreground font-black tracking-tight">{content.complexities.time.worst}</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 text-sm md:text-base leading-relaxed text-muted-foreground">
              {content.complexities.analysis}
            </div>
          </section>

          {/* Code */}
          <section id="code" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Code Implementation</h2>
            <CodeTabs codeData={content.code} />
          </section>

          {/* Interview Notes */}
          <section id="interview" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Interview Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                  <h3 className="font-bold text-orange-400 text-sm md:text-base">Common Mistakes</h3>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  {content.interviewNotes?.mistakes.map((note, i) => (
                    <li key={i} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-orange-400/50 mt-0.5 md:mt-1">•</span> {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-border/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <h3 className="font-bold text-blue-500 text-sm md:text-base">Edge Cases</h3>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  {content.interviewNotes?.edgeCases.map((note, i) => (
                    <li key={i} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500/50 mt-0.5 md:mt-1">•</span> {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                  <h3 className="font-bold text-emerald-500 text-sm md:text-base">Pro Tips</h3>
                </div>
                <ul className="space-y-2 md:space-y-3">
                  {content.interviewNotes?.tips.map((note, i) => (
                    <li key={i} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-emerald-500/50 mt-0.5 md:mt-1">•</span> {note}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* Practice Problems */}
          <section id="practice" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Practice Problems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.practiceProblems?.map((prob, i) => (
                <a key={i} href={prob.url} className="flex items-center justify-between p-4 md:p-5 bg-card hover:bg-muted border border-border hover:border-border transition-all rounded-2xl group shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Code2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">{prob.title}</span>
                  </div>
                  <span className={`px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider
                    ${prob.difficulty === 'Easy' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 
                      prob.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : 
                      'text-destructive border-destructive/20 bg-destructive/10'}`}>
                    {prob.difficulty}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Educational Navigation & Related Topics */}
          <section className="pt-12 mt-12 border-t border-border space-y-8">
            {/* Related Topics */}
            {content.relatedTopics && content.relatedTopics.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Related Topics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {content.relatedTopics.map((topic, i) => (
                    <Link 
                      key={i}
                      to={`/explore/sorting-algorithms`} 
                      className="p-4 bg-card border border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all group flex items-center justify-between shadow-sm"
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{topic.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Next/Prev Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
              {prevTopic ? (
                <Link to={categoryId ? `/algorithms/${categoryId}/${prevTopic.id}` : `/algorithms/${prevTopic.id}`} className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card hover:bg-muted transition-all w-full md:w-auto group shadow-sm">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:-translate-x-1" />
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Previous Topic</span>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{prevTopic.title}</span>
                  </div>
                </Link>
              ) : <div className="hidden md:block w-full md:w-auto" />}

              {nextTopic ? (
                <Link to={categoryId ? `/algorithms/${categoryId}/${nextTopic.id}` : `/algorithms/${nextTopic.id}`} className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card hover:bg-muted transition-all w-full md:w-auto group text-right shadow-sm">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Next Topic</span>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{nextTopic.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link to={`/explore/${category.id}`} className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all w-full md:w-auto group text-right shadow-sm">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">Category Completed</span>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">Return to {category.title}</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </div>
          </section>

    </WorkspaceLayout>
  );
};


