import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { AlgorithmCard } from '../components/explore/AlgorithmCard';

export const CategoryDetail = () => {
  const { categoryId } = useParams();
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <Link to="/explore" className="text-primary hover:underline">Back to Explore</Link>
      </div>
    );
  }

  const { Icon, color } = category;

  return (
    <div className="w-full pb-16">
      {/* Top Section */}
      <section className="w-full border-b border-border bg-card/50 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${color} opacity-5 pointer-events-none`} />
        
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
            <Link to="/explore" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Explore
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{category.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">{category.title}</h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                  {category.overview}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-2xl font-bold mb-4">Learning Objectives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.objectives.map((obj, i) => (
                    <div key={i} className="flex gap-3 bg-card p-4 rounded-xl border border-border items-start shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium leading-tight">{obj}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.3 }}
              className="w-full md:w-[350px] aspect-square bg-card rounded-3xl border border-border shadow-lg flex items-center justify-center p-10 relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 rounded-3xl`} />
              <Icon isHovered={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Middle Section: Algorithm Grid */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Algorithms</h2>
          <span className="px-4 py-1.5 bg-card border border-border rounded-full text-sm font-bold text-muted-foreground tracking-wider uppercase">
            {category.algorithms.length} Available
          </span>
        </div>

        {category.hasIntro && (
          <Link 
            to={`/explore/${category.id}/intro`}
            className="block w-full mb-8 bg-gradient-to-r from-card to-card/50 border border-primary/20 p-8 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${color} opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity`} />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  Start Here
                </div>
                <h3 className="text-2xl font-bold mb-2">Introduction to {category.title.split(' ')[0]}</h3>
                <p className="text-muted-foreground">Master the theoretical foundation before jumping into specific algorithms.</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        )}

        {category.algorithms.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-3xl border border-border border-dashed">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">We are actively building the visualizers for this category.</p>
          </div>
        ) : (
          (() => {
            const sections = category.algorithms.reduce((acc, algo) => {
              const sec = algo.section || 'Algorithms';
              if (!acc[sec]) acc[sec] = [];
              acc[sec].push(algo);
              return acc;
            }, {} as Record<string, typeof category.algorithms>);

            // We explicitly define order if "Algorithms" exists, else just keys
            const sectionKeys = Object.keys(sections).sort((a, b) => {
              if (a === 'Algorithms') return -1;
              if (b === 'Algorithms') return 1;
              return 0;
            });

            return (
              <div className="flex flex-col gap-12">
                {sectionKeys.map((sec) => (
                  <div key={sec}>
                    {sectionKeys.length > 1 && (
                      <h3 className="text-2xl font-bold mb-6 tracking-tight text-foreground/90 border-b border-border pb-2">
                        {sec}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sections[sec].map((algo, i) => (
                        <motion.div 
                          key={algo.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
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
  );
};
