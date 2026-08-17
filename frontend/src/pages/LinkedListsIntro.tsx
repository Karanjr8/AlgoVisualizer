import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Layers, Link as LinkIcon, 
  Sparkles, BookOpen, 
  Zap, LayoutList, Network
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const LinkedListsIntro: React.FC = () => {
  const navLinks = [
    { id: 'what-is-linked-list', label: '1. What is a Linked List?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-linked-list', label: '2. Why Use Linked Lists?', icon: <Zap className="w-4 h-4" /> },
    { id: 'variations', label: '3. List Variations', icon: <Network className="w-4 h-4" /> },
    { id: 'patterns', label: '4. Common Interview Patterns', icon: <Layers className="w-4 h-4" /> },
    { id: 'curriculum', label: '5. Curriculum Roadmap', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const topics = [
    { id: 'singly-linked-list', title: 'Singly Linked List', difficulty: 'Easy', time: 'O(N)', desc: 'Basic linked list with single forward node pointers.' },
    { id: 'doubly-linked-list', title: 'Doubly Linked List', difficulty: 'Easy', time: 'O(N)', desc: 'Linked list with both forward (next) and backward (prev) pointers.' },
    { id: 'circular-linked-list', title: 'Circular Linked List', difficulty: 'Easy', time: 'O(N)', desc: 'Linked list where the tail node points back to the head node.' },
    { id: 'll-insertions', title: 'Insertions', difficulty: 'Easy', time: 'O(1)', desc: 'Inserting nodes at the head, tail, or specified index.' },
    { id: 'll-deletions', title: 'Deletions', difficulty: 'Easy', time: 'O(1)', desc: 'Deleting nodes safely without severing pointer references.' },
    { id: 'll-reversal', title: 'Reverse Linked List', difficulty: 'Easy', time: 'O(N)', desc: 'Reversing the direction of all next pointers in place.' },
    { id: 'll-detect-cycle', title: 'Detect Cycle', difficulty: 'Medium', time: 'O(N)', desc: 'Floyd\'s Tortoise and Hare fast & slow pointer algorithm.' },
    { id: 'll-middle-node', title: 'Middle Node', difficulty: 'Easy', time: 'O(N)', desc: 'Finding the middle node using 2x speed pointer traversal.' },
    { id: 'll-merge-two-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', time: 'O(N+M)', desc: 'Splicing two pre-sorted lists into a single sorted list.' },
    { id: 'll-reverse-k-groups', title: 'Reverse in K Groups', difficulty: 'Hard', time: 'O(N)', desc: 'Reversing chunks of k nodes iteratively in place.' },
    { id: 'lru-cache', title: 'LRU Cache Concept', difficulty: 'Hard', time: 'O(1)', desc: 'Combining Hash Map lookup with Doubly Linked List node eviction.' }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-emerald-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Linear Data Structure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Linked Lists
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master pointer manipulation, dynamic node allocation, fast/slow pointer cycles, and in-place list reversals without losing memory references.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-linked-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-emerald-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Head Insertion</span>
                <span className="font-bold text-emerald-400">O(1) Instant</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Random Access</span>
                <span className="font-bold text-rose-400">O(N) Sequential</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Memory Layout</span>
                <span className="font-bold text-purple-400">Dynamic Non-Contiguous</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS A LINKED LIST? */}
        <section id="what-is-linked-list" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is a Linked List?</h2>
              <p className="text-xs text-muted-foreground">Dynamic chain of nodes connected by memory pointers</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A <strong>Linked List</strong> is a linear data structure where elements (called <strong>nodes</strong>) are stored dynamically across heap memory rather than in contiguous memory blocks. Each node contains data and a pointer reference to the next node.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-emerald-400">Array vs Linked List</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Arrays allow <code className="font-mono text-primary font-bold">O(1)</code> index lookup but require costly <code className="font-mono text-rose-400 font-bold">O(N)</code> resizing/shifting. Linked lists allow instant <code className="font-mono text-emerald-400 font-bold">O(1)</code> insertion/deletion at the head without memory allocation overhead.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-emerald-400">Node Component Anatomy</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every node holds two fields: <code className="font-mono text-foreground font-bold">data</code> (the value) and <code className="font-mono text-foreground font-bold">next</code> (memory address of subsequent node). The final node points to <code className="font-mono text-purple-400 font-bold">null</code>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY USE LINKED LISTS? */}
        <section id="why-linked-list" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Why Use Linked Lists?</h2>
              <p className="text-xs text-muted-foreground">Dynamic memory growth and instant head/tail modifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-emerald-400 font-bold text-sm font-sans block mb-1">⚡ O(1) Prepend</span>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed">Insert at head instantly without shifting array items.</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-blue-400 font-bold text-sm font-sans block mb-1">📈 Dynamic Allocation</span>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed">Grows and shrinks on demand without pre-allocated capacity.</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-1">
              <span className="text-purple-400 font-bold text-sm font-sans block mb-1">🔄 LRU & Queues</span>
              <p className="text-muted-foreground text-xs font-sans leading-relaxed">Powers OS memory cache eviction and queue data structures.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CURRICULUM ROADMAP */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Linked Lists Curriculum</h2>
            <span className="text-xs font-mono text-muted-foreground">{topics.length} Interactive Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Linked List
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground mt-4">
                  <span>Time Complexity:</span>
                  <strong className="text-foreground">{t.time}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
