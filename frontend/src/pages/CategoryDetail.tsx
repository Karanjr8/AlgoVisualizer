import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, CheckCircle2, BookOpen, Target, BarChart2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { AlgorithmCard } from '../components/explore/AlgorithmCard';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const CategoryDetail = () => {
  const { categoryId } = useParams();
  const category = CATEGORIES.find(c => c.id === categoryId || c.id.replace('-algorithms', '') === categoryId);

  if (!category) {
    return (
      <WorkspaceLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested algorithm category could not be located.</p>
          <Link to="/explore" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all">
            Back to Explore
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const { Icon, color } = category;

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'objectives', label: 'Learning Objectives', icon: <Target className="w-4 h-4" /> },
    { id: 'algorithms-grid', label: 'Algorithms Grid', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full pb-16 space-y-12">
        {/* Top Section / Overview */}
        <section id="overview" className="w-full border border-border/80 bg-card/60 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${color} opacity-10 pointer-events-none`} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-bold">
              <Link to="/explore" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Explore
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground">{category.title}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="flex-1 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">{category.title}</h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {category.overview}
                  </p>
                </motion.div>

                <motion.div id="objectives" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pt-2">
                  <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Learning Objectives
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.objectives.map((obj, i) => (
                      <div key={i} className="flex gap-3 bg-card/80 p-3.5 rounded-2xl border border-border/70 items-start shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold leading-relaxed text-foreground/90">{obj}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right: Category Icon Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.3 }}
                className="w-full md:w-[320px] aspect-square bg-card/80 rounded-3xl border border-border shadow-xl flex items-center justify-center p-8 relative group shrink-0"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-15 rounded-3xl`} />
                <Icon isHovered={true} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Middle Section: Algorithm Grid */}
        <section id="algorithms-grid" className="w-full pt-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <BarChart2 className="w-6 h-6 text-primary" /> Available Algorithms
            </h2>
            <span className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase">
              {category.algorithms.length} Algorithms
            </span>
          </div>

          {category.hasIntro && (
            <Link 
              to={`/explore/${category.id}/intro`}
              className="block w-full mb-8 bg-gradient-to-r from-card to-primary/5 border border-primary/25 p-6 sm:p-8 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1 group relative overflow-hidden shadow-md"
            >
              <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${color} opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity`} />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                    Start Learning Path
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">Introduction to {category.title.replace(' Algorithms', '')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Master core theory, code structures, and intuition before diving into visualizers.</p>
                </div>
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary text-primary-foreground group-hover:scale-110 transition-all shadow-md shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          )}

          {category.algorithms.length === 0 ? (
            <div className="text-center py-12 bg-card/60 rounded-3xl border border-border border-dashed">
              <h3 className="text-lg font-bold mb-2">Modules Coming Soon</h3>
              <p className="text-xs text-muted-foreground">We are actively building the interactive visualizers for this topic.</p>
            </div>
          ) : (
            (() => {
              const sections = category.algorithms.reduce((acc, algo) => {
                const sec = algo.section || 'Core Algorithms';
                if (!acc[sec]) acc[sec] = [];
                acc[sec].push(algo);
                return acc;
              }, {} as Record<string, typeof category.algorithms>);

              const sectionKeys = Object.keys(sections).sort((a, b) => {
                if (a === 'Core Algorithms' || a === 'Algorithms') return -1;
                if (b === 'Core Algorithms' || b === 'Algorithms') return 1;
                return 0;
              });

              return (
                <div className="flex flex-col gap-10">
                  {sectionKeys.map((sec) => (
                    <div key={sec}>
                      {sectionKeys.length > 1 && (
                        <h3 className="text-xl font-bold mb-6 tracking-tight text-foreground/90 border-b border-border/60 pb-2">
                          {sec}
                        </h3>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections[sec].map((algo, i) => (
                          <motion.div 
                            key={algo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="h-full"
                          >
                            <AlgorithmCard algorithm={algo} colorClass={color} categoryId={category.id} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </section>
      </div>
    </WorkspaceLayout>
  );
};
