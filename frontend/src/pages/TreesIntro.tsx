import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, 
  Zap, LayoutList, Network, FolderTree
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const TreesIntro: React.FC = () => {
  const navLinks = [
    { id: 'what-is-tree', label: '1. What is a Tree?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-trees', label: '2. Why Do We Need Trees?', icon: <Zap className="w-4 h-4" /> },
    { id: 'tree-types', label: '3. Binary Tree Types', icon: <Network className="w-4 h-4" /> },
    { id: 'curriculum', label: '4. Curriculum Roadmap', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const topics = [
    { id: 'binary-tree', title: 'Binary Tree', difficulty: 'Easy', time: 'O(N)', desc: 'Basic hierarchical structure where each node has at most two children.' },
    { id: 'tree-types', title: 'Types of Binary Trees', difficulty: 'Easy', time: 'O(1)', desc: 'Full, Complete, Perfect, and Degenerate structural tree classifications.' },
    { id: 'bst-search', title: 'BST Search', difficulty: 'Easy', time: 'O(log N)', desc: 'Locating targets in Binary Search Trees by comparison branching.' },
    { id: 'bst-insert', title: 'BST Insert', difficulty: 'Medium', time: 'O(log N)', desc: 'Inserting new values maintaining left < parent < right invariant.' },
    { id: 'bst-delete', title: 'BST Delete', difficulty: 'Hard', time: 'O(log N)', desc: 'Deleting nodes and swapping with in-order successor or predecessor.' },
    { id: 'avl-tree', title: 'AVL Tree', difficulty: 'Hard', time: 'O(log N)', desc: 'Self-balancing BST using single and double rotation operations.' },
    { id: 'morris-traversal', title: 'Morris Traversal', difficulty: 'Hard', time: 'O(N)', desc: 'O(1) auxiliary space tree traversal using threaded pointers.' },
    { id: 'lca', title: 'Lowest Common Ancestor', difficulty: 'Medium', time: 'O(N)', desc: 'Finding the deepest shared parent node of two tree target nodes.' },
    { id: 'tree-diameter', title: 'Diameter of Tree', difficulty: 'Easy', time: 'O(N)', desc: 'Finding the longest path length between any two leaf nodes.' },
    { id: 'balanced-tree', title: 'Balanced Trees', difficulty: 'Easy', time: 'O(N)', desc: 'Verifying if height difference between subtrees is at most 1.' },
    { id: 'tree-views', title: 'Binary Tree Views', difficulty: 'Medium', time: 'O(N)', desc: 'Top, Bottom, Left, and Right perspective projections of binary trees.' },
    { id: 'serialize-tree', title: 'Serialization', difficulty: 'Hard', time: 'O(N)', desc: 'Flattening a binary tree into a string representation for network storage.' },
    { id: 'deserialize-tree', title: 'Deserialization', difficulty: 'Hard', time: 'O(N)', desc: 'Rebuilding the full binary tree structure from serialized string data.' }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-green-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Hierarchical Data Structure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Trees & BST
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master hierarchical node branching, DFS/BFS traversals, Binary Search Tree properties, and self-balancing AVL trees.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-tree');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-green-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-green-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-green-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">BST Search</span>
                <span className="font-bold text-emerald-400">O(log N) Logarithmic</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Traversals</span>
                <span className="font-bold text-green-400">Inorder / Pre / Post / BFS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Tree Height</span>
                <span className="font-bold text-purple-400">H = log₂N (Balanced)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS A TREE? */}
        <section id="what-is-tree" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is a Tree?</h2>
              <p className="text-xs text-muted-foreground">Non-linear hierarchical collection of connected nodes</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A <strong>Tree</strong> is a hierarchical data structure consisting of nodes connected by directed or undirected edges. It starts from a single <strong>Root node</strong> and branches downward into child subtrees without containing any cycles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-green-400">Binary Search Tree (BST) Rule</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                For every node: all values in its <code className="font-mono text-emerald-400">left subtree</code> must be strictly smaller, and all values in its <code className="font-mono text-emerald-400">right subtree</code> must be strictly larger.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-green-400">Depth-First Traversals</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>Inorder</strong> (Left-Root-Right $\rightarrow$ yields sorted BST output), <strong>Preorder</strong> (Root-Left-Right), and <strong>Postorder</strong> (Left-Right-Root).
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM ROADMAP */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Trees Curriculum</h2>
            <span className="text-xs font-mono text-muted-foreground">{topics.length} Interactive Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-green-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Trees
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-green-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
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
