import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, 
  Zap, LayoutList, Network, Share2
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const GraphsIntro: React.FC = () => {
  const navLinks = [
    { id: 'what-is-graph', label: '1. What is a Graph?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'representation', label: '2. Representations', icon: <Network className="w-4 h-4" /> },
    { id: 'traversal-shortest-path', label: '3. Shortest Paths & MST', icon: <Zap className="w-4 h-4" /> },
    { id: 'curriculum', label: '4. Curriculum Roadmap', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const topics = [
    { id: 'graph-representation', title: 'Graph Representation', difficulty: 'Easy', time: 'O(V+E)', desc: 'Adjacency Matrix vs Adjacency List tradeoffs and memory analysis.' },
    { id: 'bfs', title: 'Breadth-First Search', difficulty: 'Easy', time: 'O(V+E)', desc: 'Shortest path search on unweighted graphs using a Queue.' },
    { id: 'dfs', title: 'Depth-First Search', difficulty: 'Easy', time: 'O(V+E)', desc: 'Exhaustive path traversal using recursion stack and backtracking.' },
    { id: 'topological-sort', title: 'Topological Sort', difficulty: 'Medium', time: 'O(V+E)', desc: 'Linear dependency ordering of vertices in a DAG (Kahn\'s BFS / DFS).' },
    { id: 'cycle-detection', title: 'Cycle Detection', difficulty: 'Medium', time: 'O(V+E)', desc: 'Detecting loops in directed (3-color DFS) and undirected graphs (Union-Find).' },
    { id: 'dijkstra', title: 'Dijkstra\'s Algorithm', difficulty: 'Medium', time: 'O((V+E) log V)', desc: 'Single-source shortest path for non-negative weighted graphs using Min-Heap.' },
    { id: 'bellman-ford', title: 'Bellman-Ford Algorithm', difficulty: 'Medium', time: 'O(V*E)', desc: 'Shortest path handling negative edge weights and detecting negative cycles.' },
    { id: 'floyd-warshall', title: 'Floyd-Warshall Algorithm', difficulty: 'Medium', time: 'O(V^3)', desc: 'All-pairs shortest path matrix relaxation dynamic programming.' },
    { id: 'prim', title: 'Prim\'s Algorithm', difficulty: 'Medium', time: 'O((V+E) log V)', desc: 'Minimum Spanning Tree construction growing greedy node cuts.' },
    { id: 'kruskal', title: 'Kruskal\'s Algorithm', difficulty: 'Medium', time: 'O(E log E)', desc: 'MST construction by sorting edges and joining Disjoint Sets.' },
    { id: 'disjoint-set', title: 'Disjoint Set (Union-Find)', difficulty: 'Medium', time: 'O(α(V))', desc: 'Path compression and union-by-rank data structure.' },
    { id: 'bridges-articulation', title: 'Bridges & Articulation Points', difficulty: 'Hard', time: 'O(V+E)', desc: 'Tarjan\'s low-link algorithm identifying single-point network failure nodes.' },
    { id: 'kosaraju', title: 'Strongly Connected Components', difficulty: 'Hard', time: 'O(V+E)', desc: 'Kosaraju\'s 2-pass DFS algorithm for finding SCCs in directed graphs.' }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-orange-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Network Graph Theory
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Graph Algorithms
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master network relationships, BFS/DFS traversals, shortest path algorithms (Dijkstra, Bellman-Ford), and Minimum Spanning Trees (Prim, Kruskal).
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-graph');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-orange-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-orange-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-orange-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">BFS / DFS</span>
                <span className="font-bold text-emerald-400">O(V + E) Linear</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Dijkstra Shortest</span>
                <span className="font-bold text-orange-400">O((V+E) log V)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Union-Find Time</span>
                <span className="font-bold text-purple-400">O(α(V)) Nearly O(1)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS A GRAPH? */}
        <section id="what-is-graph" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is a Graph?</h2>
              <p className="text-xs text-muted-foreground">Collection of vertices (V) connected by edges (E)</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A <strong>Graph</strong> is a non-linear data structure modeling relationships between objects. Vertices (nodes) represent entities, while edges represent connections (directed/undirected, weighted/unweighted).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-orange-400">Adjacency List Representation</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Stores neighbors for each node in a list. Uses optimal <code className="font-mono text-emerald-400">O(V + E)</code> memory space, making it ideal for sparse real-world networks.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-orange-400">BFS vs DFS Traversal</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong>BFS</strong> explores level-by-level using a Queue (ideal for shortest unweighted paths). <strong>DFS</strong> explores deeply along branches using a Stack/recursion (ideal for cycle detection and topological sorting).
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM ROADMAP */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Graph Curriculum</h2>
            <span className="text-xs font-mono text-muted-foreground">{topics.length} Interactive Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Graph
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
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
