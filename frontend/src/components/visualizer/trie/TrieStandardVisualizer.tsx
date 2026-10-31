import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import type { VisualizationFrame, TrieVisualNode, TrieVisualEdge } from '../../../types/visualizer';
import { cn } from '../../../lib/utils';

export interface TrieNodeData {
  id: string;
  char: string;
  isEnd: boolean;
  children: Record<string, TrieNodeData>;
}

interface Props {
  frame?: VisualizationFrame;
}

export const TrieStandardVisualizer: React.FC<Props> = memo(({ frame }) => {
  // Demo Initial Trie Data Structure
  const [root, setRoot] = useState<TrieNodeData>({
    id: 'root',
    char: 'ROOT',
    isEnd: false,
    children: {
      c: {
        id: 'c-1',
        char: 'c',
        isEnd: false,
        children: {
          a: {
            id: 'a-1',
            char: 'a',
            isEnd: false,
            children: {
              t: { id: 't-1', char: 't', isEnd: true, children: {} },
              r: {
                id: 'r-1',
                char: 'r',
                isEnd: true,
                children: {
                  e: { id: 'e-1', char: 'e', isEnd: true, children: {} }
                }
              }
            }
          }
        }
      },
      d: {
        id: 'd-1',
        char: 'd',
        isEnd: false,
        children: {
          o: {
            id: 'o-1',
            char: 'o',
            isEnd: false,
            children: {
              g: { id: 'g-1', char: 'g', isEnd: true, children: {} }
            }
          }
        }
      }
    }
  });

  const [inputWord, setInputWord] = useState<string>('code');
  const [searchWord, setSearchWord] = useState<string>('car');
  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<{ found: boolean; type: 'exact' | 'prefix' } | null>(null);
  const [actionText, setActionText] = useState<string>('Trie (Prefix Tree) Character Engine Ready');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Sync state with incoming simulation frame if available!
  const frameState = frame?.trieState;

  // Flatten Trie tree into 2D layout nodes for SVG rendering if using local state
  const flattenTree = (node: TrieNodeData, depth: number = 0, xOffset: number = 340, span: number = 440): { node: TrieNodeData; x: number; y: number; parentId?: string }[] => {
    const keys = Object.keys(node.children);
    const childNodes: any[] = [];
    const numChildren = keys.length;

    keys.forEach((key, idx) => {
      const childSpan = span / Math.max(1, numChildren);
      const childX = xOffset - span / 2 + childSpan * (idx + 0.5);
      childNodes.push(...flattenTree(node.children[key], depth + 1, childX, childSpan));
    });

    const y = 50 + depth * 65;
    return [{ node, x: xOffset, y, parentId: node.id === 'root' ? undefined : undefined }, ...childNodes];
  };

  const localNodes = flattenTree(root);

  // Map display nodes from frameState or local fallback
  const displayNodes: TrieVisualNode[] = frameState ? frameState.nodes : localNodes.map(item => {
    const isActive = activePath.includes(item.node.id);
    const isRootNode = item.node.id === 'root';
    return {
      id: item.node.id,
      char: item.node.char,
      isEnd: item.node.isEnd,
      state: isRootNode ? 'normal' : isActive ? 'current' : item.node.isEnd ? 'terminal' : 'normal',
      depth: 0,
      x: item.x,
      y: item.y
    };
  });

  const displayEdges: TrieVisualEdge[] = frameState ? frameState.edges : localNodes.flatMap(item => {
    return Object.values(item.node.children).map(child => {
      const isActive = activePath.includes(item.node.id) && activePath.includes(child.id);
      return {
        from: item.node.id,
        to: child.id,
        char: child.char,
        state: isActive ? 'active' : 'normal'
      };
    });
  });

  const currentActionText = frameState?.actionText || frame?.event?.explanation || actionText;
  const currentSearchResult = frameState?.searchResult !== undefined ? frameState.searchResult : searchResult;

  const handleInsert = async () => {
    if (!inputWord) return;
    const word = inputWord.toLowerCase().trim();
    setIsAnimating(true);
    setActionText(`Inserting word "${word}" character-by-character...`);
    setSearchResult(null);

    const path: string[] = ['root'];
    setActivePath([...path]);
    await new Promise(r => setTimeout(r, 400));

    const cloneTrie = (n: TrieNodeData): TrieNodeData => ({
      ...n,
      children: Object.keys(n.children).reduce((acc, k) => {
        acc[k] = cloneTrie(n.children[k]);
        return acc;
      }, {} as Record<string, TrieNodeData>)
    });

    const newRoot = cloneTrie(root);
    let currNode = newRoot;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!currNode.children[char]) {
        currNode.children[char] = {
          id: `${char}-${Math.random().toString(36).substr(2, 5)}`,
          char,
          isEnd: i === word.length - 1,
          children: {}
        };
        setActionText(`Created new node '${char}' at depth ${i + 1}`);
      } else {
        if (i === word.length - 1) currNode.children[char].isEnd = true;
        setActionText(`Reusing existing shared prefix character '${char}'`);
      }

      currNode = currNode.children[char];
      path.push(currNode.id);
      setActivePath([...path]);
      setRoot(cloneTrie(newRoot));
      await new Promise(r => setTimeout(r, 500));
    }

    setActionText(`Inserted "${word}"! Marked '${word[word.length - 1]}' as isEndOfWord = true.`);
    setIsAnimating(false);
  };

  const handleSearch = async (isPrefix: boolean = false) => {
    if (!searchWord) return;
    const word = searchWord.toLowerCase().trim();
    setIsAnimating(true);
    setSearchResult(null);
    setActionText(`Searching ${isPrefix ? 'Prefix' : 'Exact Word'} "${word}"...`);

    let currNode = root;
    const path: string[] = ['root'];
    setActivePath([...path]);
    await new Promise(r => setTimeout(r, 400));

    let found = true;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (currNode.children[char]) {
        currNode = currNode.children[char];
        path.push(currNode.id);
        setActivePath([...path]);
        setActionText(`Matched character '${char}' at depth ${i + 1}.`);
        await new Promise(r => setTimeout(r, 500));
      } else {
        found = false;
        setActionText(`Character '${char}' missing! Search terminated.`);
        break;
      }
    }

    if (found) {
      if (isPrefix) {
        setSearchResult({ found: true, type: 'prefix' });
        setActionText(`Prefix Match! Subtree exists for prefix "${word}".`);
      } else {
        if (currNode.isEnd) {
          setSearchResult({ found: true, type: 'exact' });
          setActionText(`Exact Word Match! "${word}" exists with isEndOfWord = true.`);
        } else {
          setSearchResult({ found: false, type: 'exact' });
          setActionText(`Prefix exists, but "${word}" is NOT marked as endOfWord!`);
        }
      }
    } else {
      setSearchResult({ found: false, type: isPrefix ? 'prefix' : 'exact' });
    }

    setIsAnimating(false);
  };

  const handleDelete = async () => {
    if (!searchWord) return;
    const word = searchWord.toLowerCase().trim();
    setIsAnimating(true);
    setSearchResult(null);
    setActionText(`Deleting word "${word}"...`);

    const path: string[] = ['root'];
    setActivePath([...path]);
    await new Promise(r => setTimeout(r, 400));

    const cloneTrie = (n: TrieNodeData): TrieNodeData => ({
      ...n,
      children: Object.keys(n.children).reduce((acc, k) => {
        acc[k] = cloneTrie(n.children[k]);
        return acc;
      }, {} as Record<string, TrieNodeData>)
    });

    const newRoot = cloneTrie(root);
    
    // Recursive delete helper
    const removeWord = (node: TrieNodeData, depth: number): boolean => {
      if (depth === word.length) {
        if (!node.isEnd) return false;
        node.isEnd = false;
        return Object.keys(node.children).length === 0;
      }

      const char = word[depth];
      if (!node.children[char]) return false;

      const shouldDeleteChild = removeWord(node.children[char], depth + 1);
      if (shouldDeleteChild) {
        delete node.children[char];
        return !node.isEnd && Object.keys(node.children).length === 0;
      }
      return false;
    };

    removeWord(newRoot, 0);
    setRoot(newRoot);
    setActionText(`Deleted "${word}"! Pruned unneeded leaf nodes while preserving shared prefixes.`);
    setIsAnimating(false);
  };

  const handleReset = () => {
    setActivePath([]);
    setSearchResult(null);
    setActionText('Reset active search path');
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        
        {/* Insert Word Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputWord}
            onChange={e => setInputWord(e.target.value)}
            placeholder="Insert word..."
            className="w-32 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleInsert}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Insert Word
          </button>
        </div>

        {/* Search & Delete Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
            placeholder="Word / Prefix..."
            className="w-32 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleSearch(false)}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Exact
          </button>
          <button
            onClick={() => handleSearch(true)}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Prefix
          </button>
          <button
            onClick={handleDelete}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Live Action Banner */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-background/90 border border-border/80 font-mono text-xs shadow-inner">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-amber-400 font-semibold">{currentActionText}</span>
        </div>
        {currentSearchResult && (
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm',
            currentSearchResult.found ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          )}>
            {currentSearchResult.found ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {currentSearchResult.found ? 'MATCH FOUND' : 'NOT FOUND'}
          </span>
        )}
      </div>

      {/* DUAL DISPLAY CANVAS (SVG TRIE GRAPH + LEGEND & METRICS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CHARACTER TRIE HIERARCHICAL GRAPH CANVAS */}
        <div className="lg:col-span-8 bg-card/60 border border-border/80 rounded-3xl p-4 min-h-[380px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2.5 py-1 bg-background/60 rounded-lg border border-border/60">
              Interactive Hierarchical Trie Structure
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 inline-block" /> Terminal (isEnd)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Active Path
              </span>
            </div>
          </div>

          <div className="relative w-full h-[320px] flex items-center justify-center">
            {/* SVG Edges Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              {displayEdges.map(edge => {
                const fromNode = displayNodes.find(n => n.id === edge.from);
                const toNode = displayNodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode || fromNode.x === undefined || fromNode.y === undefined || toNode.x === undefined || toNode.y === undefined) return null;

                const isActive = edge.state === 'active';

                return (
                  <motion.line
                    key={`edge-${edge.from}-${edge.to}`}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isActive ? '#f59e0b' : 'hsl(var(--border))'}
                    strokeWidth={isActive ? 3.5 : 2}
                    strokeDasharray={isActive ? 'none' : '3 3'}
                  />
                );
              })}
            </svg>

            {/* Character Nodes */}
            <AnimatePresence>
              {displayNodes.map(node => {
                if (node.x === undefined || node.y === undefined) return null;
                const isRoot = node.id === 'root';
                const isCurrent = node.state === 'current';
                const isFailed = node.state === 'failed';
                const isTerminal = node.isEnd;

                return (
                  <motion.div
                    key={node.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ left: `${node.x - 20}px`, top: `${node.y - 20}px` }}
                    className={cn(
                      'absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-mono font-black text-xs shadow-lg border-2 z-10 cursor-default transition-all duration-200',
                      isRoot && 'bg-muted border-border text-muted-foreground shadow-none',
                      !isRoot && isCurrent && 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 scale-110',
                      !isRoot && isFailed && 'bg-rose-500 text-white border-rose-400 ring-4 ring-rose-500/40 scale-110',
                      !isRoot && !isCurrent && !isFailed && isTerminal && 'bg-emerald-500/20 border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/30',
                      !isRoot && !isCurrent && !isFailed && !isTerminal && 'bg-card border-border text-foreground'
                    )}
                  >
                    <span>{node.char}</span>

                    {/* End of Word Terminal Ring Indicator */}
                    {isTerminal && !isRoot && (
                      <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -top-1 -right-1 shadow-sm" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* TRIE CONCEPT & COMPLEXITY SUMMARY */}
        <div className="lg:col-span-4 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2.5 py-1 bg-background/60 rounded-lg w-max border border-border/60">
              Prefix Path Sharing
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Words sharing common prefixes (e.g. <code className="text-emerald-400 font-mono">cat</code>, <code className="text-emerald-400 font-mono">car</code>, <code className="text-emerald-400 font-mono">care</code>) reuse the same ancestor nodes <code className="text-amber-400 font-mono">"ca"</code> instead of duplicating characters!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/80 border border-border/60 text-xs font-mono space-y-2.5">
            <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Trie Guarantees</span>
            <div className="flex justify-between">
              <span>Insert Time:</span>
              <span className="text-emerald-400 font-bold">O(L)</span>
            </div>
            <div className="flex justify-between">
              <span>Search Time:</span>
              <span className="text-emerald-400 font-bold">O(L)</span>
            </div>
            <div className="flex justify-between">
              <span>Prefix Search:</span>
              <span className="text-blue-400 font-bold">O(L)</span>
            </div>
            <div className="flex justify-between">
              <span>Delete Time:</span>
              <span className="text-rose-400 font-bold">O(L)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

TrieStandardVisualizer.displayName = 'TrieStandardVisualizer';
