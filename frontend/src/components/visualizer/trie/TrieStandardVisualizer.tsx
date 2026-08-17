import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

export interface TrieNodeData {
  id: string;
  char: string;
  isEnd: boolean;
  children: Record<string, TrieNodeData>;
}

interface Props {
  frame?: VisualizationFrame;
}

export const TrieStandardVisualizer: React.FC<Props> = () => {
  // Demo Initial Trie Data Structure
  const [root, setRoot] = useState<TrieNodeData>({
    id: 'root',
    char: 'root',
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
  const [searchWord, setSearchWord] = useState<string>('cat');
  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<{ found: boolean; type: 'exact' | 'prefix' } | null>(null);
  const [actionText, setActionText] = useState<string>('Trie (Prefix Tree) Interactive Character Engine Ready');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Flatten Trie tree into 2D layout nodes for SVG rendering
  const flattenTree = (node: TrieNodeData, depth: number = 0, xOffset: number = 300, span: number = 240): any[] => {
    const keys = Object.keys(node.children);
    const childNodes: any[] = [];
    const numChildren = keys.length;

    keys.forEach((key, idx) => {
      const childSpan = span / Math.max(1, numChildren);
      const childX = xOffset - span / 2 + childSpan * (idx + 0.5);

      childNodes.push(...flattenTree(node.children[key], depth + 1, childX, childSpan));
    });

    const y = 40 + depth * 60;
    return [{ node, x: xOffset, y, depth }, ...childNodes];
  };

  const layoutNodes = flattenTree(root);

  const handleInsert = async () => {
    if (!inputWord) return;
    const word = inputWord.toLowerCase().trim();
    setIsAnimating(true);
    setActionText(`Inserting word "${word}" character-by-character into Trie...`);
    setSearchResult(null);

    const path: string[] = ['root'];
    setActivePath([...path]);
    await new Promise(r => setTimeout(r, 500));

    // Deep clone helper
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
        setActionText(`Created new Trie Node for character '${char}'`);
      } else {
        if (i === word.length - 1) currNode.children[char].isEnd = true;
        setActionText(`Traversed existing shared prefix character '${char}'`);
      }

      currNode = currNode.children[char];
      path.push(currNode.id);
      setActivePath([...path]);
      setRoot(cloneTrie(newRoot));
      await new Promise(r => setTimeout(r, 600));
    }

    setActionText(`Successfully inserted "${word}"! Marked node '${word[word.length - 1]}' as isEndOfWord = true.`);
    setIsAnimating(false);
  };

  const handleSearch = async (isPrefix: boolean = false) => {
    if (!searchWord) return;
    const word = searchWord.toLowerCase().trim();
    setIsAnimating(true);
    setSearchResult(null);
    setActionText(`Searching ${isPrefix ? 'Prefix' : 'Exact Word'} "${word}" in Trie...`);

    let currNode = root;
    const path: string[] = ['root'];
    setActivePath([...path]);
    await new Promise(r => setTimeout(r, 500));

    let found = true;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (currNode.children[char]) {
        currNode = currNode.children[char];
        path.push(currNode.id);
        setActivePath([...path]);
        setActionText(`Found character '${char}' in Trie.`);
        await new Promise(r => setTimeout(r, 600));
      } else {
        found = false;
        setActionText(`Character '${char}' missing in Trie! Search terminated.`);
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
          setActionText(`Exact Word Match! "${word}" exists in Trie with isEndOfWord = true.`);
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

  const handleReset = () => {
    setActivePath([]);
    setSearchResult(null);
    setActionText('Reset active search path');
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        {/* Insert Word Form */}
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

        {/* Search Form */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
            placeholder="Search word..."
            className="w-32 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleSearch(false)}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Exact Search
          </button>
          <button
            onClick={() => handleSearch(true)}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Prefix Search
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

      {/* Action Text & Result Status Banner */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs shadow-inner">
        <span className="text-amber-400 font-semibold">{actionText}</span>
        {searchResult && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            searchResult.found ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {searchResult.found ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {searchResult.found ? 'FOUND' : 'NOT FOUND'}
          </span>
        )}
      </div>

      {/* DUAL DISPLAY CANVAS (CHARACTER TRIE CANVAS + STORED WORDS LIST) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CHARACTER TRIE TREE CANVAS */}
        <div className="lg:col-span-8 bg-card/60 border border-border/80 rounded-3xl p-4 min-h-[340px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg border border-border/60">
              Dedicated Trie Character Tree View
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Green Badge = isEndOfWord</span>
          </div>

          <div className="relative w-full h-[280px] flex items-center justify-center">
            {/* SVG Edge Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {layoutNodes.map(item => {
                const parentNode = layoutNodes.find(p => p.node.children[item.node.char]?.id === item.node.id);
                if (!parentNode) return null;

                const isActiveEdge = activePath.includes(parentNode.node.id) && activePath.includes(item.node.id);

                return (
                  <line
                    key={`edge-${parentNode.node.id}-${item.node.id}`}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={item.x}
                    y2={item.y}
                    stroke={isActiveEdge ? '#10b981' : '#3f3f46'}
                    strokeWidth={isActiveEdge ? 3 : 1.5}
                    strokeDasharray={isActiveEdge ? 'none' : '2'}
                  />
                );
              })}
            </svg>

            {/* Character Nodes */}
            {layoutNodes.map(item => {
              const isActive = activePath.includes(item.node.id);
              const isRootNode = item.node.id === 'root';

              return (
                <motion.div
                  key={item.node.id}
                  layout
                  style={{ left: `${item.x - 18}px`, top: `${item.y - 18}px` }}
                  className={`
                    absolute w-9 h-9 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs shadow-md border-2 z-10 transition-all cursor-default
                    ${isRootNode ? 'bg-muted border-border text-muted-foreground' :
                      isActive ? 'bg-emerald-500 border-emerald-400 text-black scale-110 shadow-emerald-500/40' :
                      item.node.isEnd ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30' :
                      'bg-background border-border text-foreground'}
                  `}
                >
                  <span>{item.node.char}</span>
                  {item.node.isEnd && !isRootNode && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 shadow-sm" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TRIE CONCEPT HIGHLIGHTS & WORDS SUMMARY */}
        <div className="lg:col-span-4 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
              Why Trie Saves Memory
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Words like <code className="text-emerald-400 font-mono">cat</code>, <code className="text-emerald-400 font-mono">car</code>, and <code className="text-emerald-400 font-mono">care</code> share the common prefix <code className="text-amber-400 font-mono">"ca"</code>. They share the same parent nodes in the tree instead of duplicating characters!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-xs font-mono space-y-2">
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
              <span>Prefix Match:</span>
              <span className="text-blue-400 font-bold">O(L)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
