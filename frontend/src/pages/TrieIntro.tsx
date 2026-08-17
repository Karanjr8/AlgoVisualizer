import React from 'react';
import { Link } from 'react-router-dom';
import {
  GitBranch, Lightbulb, ArrowRight, FolderTree, Sparkles
} from 'lucide-react';
import { TrieStandardVisualizer } from '../components/visualizer/trie/TrieStandardVisualizer';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const TrieIntro: React.FC = () => {
  const navLinks = [
    { id: 'intuition', label: '1. Core Intuition', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'engine', label: '2. Interactive Trie Engine', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'curriculum', label: '3. 15 Subtopics & Problems', icon: <FolderTree className="w-4 h-4" /> },
  ];

  const topics = [
    { id: 'trie-intro', title: 'Introduction to Trie', difficulty: 'Easy', time: 'O(L)', desc: 'Shared prefix tree structure eliminating redundant character storage.' },
    { id: 'trie-node-structure', title: 'Trie Node Structure', difficulty: 'Easy', time: 'O(1)', desc: 'Memory layout with child pointers array[26] and isEndOfWord flag.' },
    { id: 'trie-insert', title: 'Insert Word', difficulty: 'Easy', time: 'O(L)', desc: 'Character-by-character node creation and path traversal.' },
    { id: 'trie-search', title: 'Search Word', difficulty: 'Easy', time: 'O(L)', desc: 'Exact word search verifying isEndOfWord terminal flag.' },
    { id: 'trie-prefix-search', title: 'Starts With / Prefix Search', difficulty: 'Easy', time: 'O(L)', desc: 'Prefix subtree matching without requiring terminal flag.' },

    { id: 'word-dictionary', title: 'Word Dictionary (Wildcard Search)', difficulty: 'Medium', time: 'O(26^L)', desc: 'Search supporting "." wildcard character via multi-branch DFS.' },
    { id: 'longest-common-prefix', title: 'Longest Common Prefix', difficulty: 'Easy', time: 'O(N*L)', desc: 'Traverse unbranched single-child path until first branching node.' },
    { id: 'replace-words', title: 'Replace Words', difficulty: 'Medium', time: 'O(N*L)', desc: 'Replace sentence words with shortest matching Trie root.' },
    { id: 'search-suggestions-system', title: 'Search Suggestions System', time: 'O(L+M)', difficulty: 'Medium', desc: 'Product search dynamic suggestions updating per key press.' },
    { id: 'word-search-ii', title: 'Word Search II', difficulty: 'Hard', time: 'O(M*N*3^L)', desc: 'Find all dictionary words in 2D matrix board using Trie + DFS.' },

    { id: 'autocomplete-system', title: 'Auto Complete System', difficulty: 'Hard', time: 'O(L+K)', desc: 'Real-time search bar autocomplete with candidate ranking.' },
    { id: 'design-search-engine', title: 'Design Search Engine Prefix Matching', difficulty: 'Hard', time: 'O(L)', desc: 'Web search query indexer with hit frequency counting.' },
    { id: 'top-k-frequent-words', title: 'Top K Frequent Words', difficulty: 'Medium', time: 'O(N log K)', desc: 'Trie frequency counter paired with Min-Heap ranking.' },
    { id: 'contacts-app', title: 'Contacts Application', difficulty: 'Medium', time: 'O(L+K)', desc: 'Phonebook contact search by name prefix.' },
    { id: 'file-system-trie', title: 'File System Path Trie', difficulty: 'Hard', time: 'O(L)', desc: 'Directory hierarchy tree splitting on path slashes.' }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-teal-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  ← Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> String Optimization Pattern
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Trie (Prefix Tree)
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master character tree structures designed for ultra-fast string matching, autocomplete engines, wildcard dictionary lookups, and directory path tries in O(L) time.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('intuition');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-teal-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-teal-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-teal-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Lookup Time</span>
                <span className="font-bold text-emerald-400">O(L) Length</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Prefix Storage</span>
                <span className="font-bold text-teal-400">Shared Nodes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Branching Factor</span>
                <span className="font-bold text-purple-400">Alphabet Size K</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTUITION CARDS GRID */}
        <section id="intuition" className="space-y-6 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-card/60 border border-border/80 rounded-3xl p-6 space-y-3 shadow-sm hover:border-teal-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">1. Why Trie Exists</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Comparing a search string against N array words requires O(N * L) string comparisons. A Trie locates strings in O(L) time by walking character tree edges directly!
              </p>
            </div>

            <div className="bg-card/60 border border-border/80 rounded-3xl p-6 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">2. Shared Prefix Compression</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Words sharing prefixes (e.g. "cat", "car", "cart") share identical root-to-child node paths. Redundant character storage is completely eliminated.
              </p>
            </div>

            <div className="bg-card/60 border border-border/80 rounded-3xl p-6 space-y-3 shadow-sm hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">3. Real-World Applications</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Powers real-time search engine query suggestions, phonebook contact lookup, spell checkers, IP routing tables, and file system directory trees.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMONSTRATION ENGINE */}
        <section id="engine" className="bg-card/60 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" /> Interactive Trie Engine
              </h2>
              <p className="text-xs text-muted-foreground">Type words, insert into prefix tree, search prefixes, and visualize node branching.</p>
            </div>
          </div>

          <TrieStandardVisualizer />
        </section>

        {/* CURRICULUM TOPICS GRID */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Trie Track Curriculum</h2>
            <span className="text-xs font-mono text-muted-foreground">{topics.length} Interactive Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/${t.id}`}
                className="group bg-card/60 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      Prefix Tree
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-teal-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
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
