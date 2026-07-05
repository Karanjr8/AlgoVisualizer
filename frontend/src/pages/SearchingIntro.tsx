import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Zap, Clock, Database, Globe, Package, Contact } from 'lucide-react';
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
    { id: 'what-is-searching', label: 'What is Searching?', icon: <Search className="w-4 h-4" /> },
    { id: 'demo', label: 'Visual Demonstration', icon: <Zap className="w-4 h-4" /> },
    { id: 'complexity', label: 'Searching Complexity', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* Header */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 opacity-5 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore/searching-algorithms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Searching Algorithms
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            Educational Foundation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Introduction to Searching</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Before diving into complex search strategies, let's establish the mental model of what searching actually is, why it matters, and how to measure its efficiency.
          </p>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* Section 1: What is Searching? */}
        <section id="what-is-searching" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Searching?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In computer science, searching is the algorithmic process of finding a particular item (or a specific target) within a collection of items. A search algorithm typically answers: <strong>"Does this item exist?"</strong> or <strong>"Where is this item located?"</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <Contact className="w-6 h-6 text-emerald-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Searching a Contact</h4>
                <p className="text-sm text-muted-foreground">Looking up "Mom" in your phone's address book.</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <Database className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Searching a File</h4>
                <p className="text-sm text-muted-foreground">Finding an exact row in a massive SQL database.</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <Globe className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Searching a Word</h4>
                <p className="text-sm text-muted-foreground">Using Ctrl+F to find a keyword on a web page.</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <Package className="w-6 h-6 text-orange-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Searching a Product</h4>
                <p className="text-sm text-muted-foreground">Finding the exact SKU match in an e-commerce catalog.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Visual Demonstration */}
        <section id="demo" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">How Searching Works</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At its core, a search algorithm is a structured way of inspecting elements until you find the target. Let's look at the most basic approach: checking every element one by one (Linear Search).
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-bold text-lg mb-1">Visualizing a Search</h3>
                <p className="text-sm text-muted-foreground">Target: <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-400/10 rounded">{target}</span></p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleResetDemo}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-card border border-border hover:bg-accent transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handlePlayDemo}
                  disabled={isPlaying}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isPlaying ? 'Searching...' : 'Play Demo'}
                </button>
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 justify-center py-12">
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
                        w-12 h-16 md:w-20 md:h-24 rounded-xl flex items-center justify-center font-mono text-xl md:text-3xl font-bold shadow-lg border-2 transition-colors duration-300
                        ${isFound ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                          isCurrent ? 'bg-primary/20 border-primary text-primary scale-110 z-10' : 
                          isChecked ? 'bg-card border-border text-muted-foreground/50 opacity-50' : 
                          'bg-card border-border text-foreground'}
                      `}
                    >
                      {num}
                      
                      {/* Scanner indicator */}
                      {isCurrent && !isFound && (
                        <motion.div 
                          layoutId="scanner"
                          className="absolute -top-8 text-xs text-primary font-bold tracking-wider"
                        >
                          CHECK
                        </motion.div>
                      )}
                      {isFound && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 text-xs text-emerald-400 font-bold tracking-wider"
                        >
                          FOUND!
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className="text-center h-8">
              {searchStep >= 0 && searchStep < array.length && array[searchStep] !== target && (
                 <p className="text-sm text-muted-foreground animate-pulse">Is {array[searchStep]} == {target}? No. Moving to next...</p>
              )}
              {searchStep >= array.findIndex(n => n === target) && searchStep !== -1 && (
                 <p className="text-sm text-emerald-400 font-bold">Match found at index {array.findIndex(n => n === target)}!</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Why it matters & Complexity */}
        <section id="complexity" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Searching Complexity</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Why do we need multiple search algorithms? Because of <strong>scale</strong>. Searching through 10 items is instant. Searching through 10 billion items requires strategy. The efficiency of a search algorithm is measured in Time Complexity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden group hover:bg-card/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-[100%] transition-transform group-hover:scale-110" />
              <div className="text-green-400 font-mono text-3xl font-black mb-4">O(1)</div>
              <h4 className="font-bold text-lg mb-2">Instantaneous</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Holy Grail of searching. No matter how large the data gets, the search takes the exact same amount of time. Achieved using Hash Maps and direct index access.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden group hover:bg-card/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-[100%] transition-transform group-hover:scale-110" />
              <div className="text-yellow-400 font-mono text-3xl font-black mb-4">O(log N)</div>
              <h4 className="font-bold text-lg mb-2">Logarithmic</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Extremely efficient. By halving the search space every step (like looking through a phone book), searching 1 billion items takes at most 30 steps. Achieved via Binary Search.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden group hover:bg-card/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[100%] transition-transform group-hover:scale-110" />
              <div className="text-red-400 font-mono text-3xl font-black mb-4">O(N)</div>
              <h4 className="font-bold text-lg mb-2">Linear</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Slow at scale. The time taken scales 1:1 with the data. If you have 1 million items, it might take 1 million checks. Achieved via Linear Search on unsorted data.
              </p>
            </div>

          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
