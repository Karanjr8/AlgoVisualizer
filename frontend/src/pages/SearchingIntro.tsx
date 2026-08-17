import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Zap, Clock, Database, Globe, Package, Contact, Sparkles, BookOpen } from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const SearchingIntro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchStep, setSearchStep] = useState(-1);
  const array = [5, 7, 11, 15, 20];
  const target = 15;

  useEffect(() => {
    if (isPlaying) {
      if (searchStep < array.length) {
        const timer = setTimeout(() => {
          setSearchStep(prev => prev + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, searchStep, array.length]);

  const handlePlayDemo = () => {
    setSearchStep(0);
    setIsPlaying(true);
  };

  const handleResetDemo = () => {
    setSearchStep(-1);
    setIsPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-searching', label: '1. What is Searching?', icon: <Search className="w-4 h-4" /> },
    { id: 'demo', label: '2. Visual Demonstration', icon: <Zap className="w-4 h-4" /> },
    { id: 'complexity', label: '3. Searching Complexity', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-blue-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Educational Foundation Module
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Introduction to Searching
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Searching is the fundamental algorithmic operation of retrieving an item from a collection. Understand linear vs logarithmic strategies, search spaces, and time complexities.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-searching');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-blue-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('algorithms-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-blue-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Binary Search</span>
                <span className="font-bold text-emerald-400">O(log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Linear Search</span>
                <span className="font-bold text-amber-400">O(N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Hash Search</span>
                <span className="font-bold text-blue-400">O(1) Avg</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS SEARCHING? */}
        <section id="what-is-searching" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Searching?</h2>
              <p className="text-xs text-muted-foreground">Finding specific targets within structured or unstructured data</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            In computer science, searching is the algorithmic process of finding a particular item (or a specific target) within a collection. A search algorithm answers: <strong>"Does this item exist?"</strong> or <strong>"Where is this item located?"</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-emerald-500/40 transition-colors group space-y-2">
              <Contact className="w-7 h-7 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Contact Search</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Looking up a name in an address book index.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-purple-500/40 transition-colors group space-y-2">
              <Database className="w-7 h-7 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground font-mono">SQL Queries</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Retrieving records matching criteria from a database table.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-blue-500/40 transition-colors group space-y-2">
              <Globe className="w-7 h-7 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Web Keyword Search</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Using Ctrl+F or inverted indices to locate matches.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-orange-500/40 transition-colors group space-y-2">
              <Package className="w-7 h-7 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground font-mono">E-Commerce SKU</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Locating an item in an inventory catalog instantly.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE DEMONSTRATION */}
        <section id="demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Visual Demonstration</h2>
              <p className="text-xs text-muted-foreground">Step-by-step element inspection in Linear Search</p>
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-base text-foreground">Linear Inspection Step-by-Step</h3>
                <p className="text-xs text-muted-foreground">Searching for Target: <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-400/10 rounded font-mono">{target}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleResetDemo} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={handlePlayDemo} disabled={isPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Searching...' : 'Play Demo'}
                </button>
              </div>
            </div>

            <div className="flex gap-3 md:gap-6 justify-center py-10">
              <AnimatePresence>
                {array.map((num, i) => {
                  const isCurrent = searchStep === i;
                  const isFound = searchStep >= i && num === target;
                  const isChecked = searchStep > i && num !== target;

                  return (
                    <motion.div
                      key={i}
                      layout
                      className={`
                        w-14 h-20 md:w-20 md:h-24 rounded-2xl flex items-center justify-center font-mono text-xl md:text-3xl font-bold shadow-md border-2 transition-colors duration-300 relative
                        ${isFound ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                          isCurrent ? 'bg-primary/20 border-primary text-primary scale-110 z-10' : 
                          isChecked ? 'bg-card border-border text-muted-foreground/50 opacity-50' : 
                          'bg-card border-border text-foreground'}
                      `}
                    >
                      {num}
                      
                      {isCurrent && !isFound && (
                        <motion.div 
                          layoutId="scanner"
                          className="absolute -top-8 text-[11px] text-primary font-bold tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20"
                        >
                          CHECK
                        </motion.div>
                      )}
                      {isFound && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 text-[11px] text-emerald-400 font-bold tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                        >
                          MATCH!
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="text-center h-6 text-xs font-semibold">
              {searchStep >= 0 && searchStep < array.length && array[searchStep] !== target && (
                <span className="text-muted-foreground">Checking index {searchStep} ({array[searchStep]} ≠ {target}). Moving forward...</span>
              )}
              {searchStep >= array.findIndex(n => n === target) && searchStep !== -1 && (
                <span className="text-emerald-400 font-bold">Target element {target} found at index {array.findIndex(n => n === target)}!</span>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: SEARCHING COMPLEXITY */}
        <section id="complexity" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Searching Complexity Classes</h2>
              <p className="text-xs text-muted-foreground">Comparing O(1) Constant, O(log N) Logarithmic, and O(N) Linear</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors shadow-sm">
              <div className="text-emerald-400 font-mono text-3xl font-black">O(1)</div>
              <h4 className="font-bold text-lg text-foreground">Constant Time</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Direct lookup regardless of dataset size. Achieved using Hash Maps, Hash Sets, or direct array indexing.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-3 hover:border-amber-500/40 transition-colors shadow-sm">
              <div className="text-amber-400 font-mono text-3xl font-black">O(log N)</div>
              <h4 className="font-bold text-lg text-foreground">Logarithmic Time</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Halves the search space every step. Searching 1 billion items takes at most 30 comparisons via Binary Search.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-3 hover:border-rose-500/40 transition-colors shadow-sm">
              <div className="text-rose-400 font-mono text-3xl font-black">O(N)</div>
              <h4 className="font-bold text-lg text-foreground">Linear Time</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Inspects every item sequentially. Required when searching unsorted or unindexed raw lists.
              </p>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
