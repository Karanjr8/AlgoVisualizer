import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const WordDictionaryVisualizer: React.FC<Props> = () => {
  const dictionary = ['bad', 'dad', 'mad', 'cat', 'car'];
  const [pattern, setPattern] = useState<string>('c.t');
  const [searchResult, setSearchResult] = useState<boolean | null>(null);
  const [matchingWord, setMatchingWord] = useState<string | null>(null);
  const [actionText, setActionText] = useState<string>('Word Dictionary (Wildcard Match): "." matches any single character (a-z)');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const runWildcardSearch = async () => {
    if (!pattern) return;
    setIsSearching(true);
    setSearchResult(null);
    setMatchingWord(null);
    setActionText(`Searching pattern "${pattern}" across dictionary words [${dictionary.join(', ')}]...`);
    await new Promise(r => setTimeout(r, 600));

    const regex = new RegExp(`^${pattern.replace(/\./g, '[a-z]')}$`);
    let foundWord: string | null = null;

    for (const word of dictionary) {
      setActionText(`Evaluating pattern "${pattern}" against word "${word}"...`);
      await new Promise(r => setTimeout(r, 600));
      if (regex.test(word)) {
        foundWord = word;
        break;
      }
    }

    if (foundWord) {
      setSearchResult(true);
      setMatchingWord(foundWord);
      setActionText(`Match Found! Pattern "${pattern}" matches dictionary word "${foundWord}"!`);
    } else {
      setSearchResult(false);
      setActionText(`No match found in dictionary for pattern "${pattern}".`);
    }
    setIsSearching(false);
  };

  const handleReset = () => {
    setSearchResult(null);
    setMatchingWord(null);
    setActionText('Ready to test wildcard matching');
    setIsSearching(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="Search e.g. c.t"
            className="w-36 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={runWildcardSearch}
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Search className="w-4 h-4" /> {isSearching ? 'Matching...' : 'Wildcard Search'}
          </button>
          <button
            onClick={handleReset}
            disabled={isSearching}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Wildcard Syntax: <strong className="text-amber-400 font-bold font-mono">.</strong> = Any 1 Character
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs shadow-inner">
        <span className="text-amber-400 font-semibold">{actionText}</span>
        {searchResult !== null && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            searchResult ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {searchResult ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {searchResult ? `MATCH: ${matchingWord}` : 'NO MATCH'}
          </span>
        )}
      </div>

      {/* DICTIONARY WORDS CARDS */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-5 space-y-4 shadow-inner">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
          Stored Dictionary Words
        </span>

        <div className="flex flex-wrap gap-3 py-2 justify-center">
          {dictionary.map(word => {
            const isMatched = matchingWord === word;

            return (
              <motion.div
                key={word}
                animate={{ scale: isMatched ? 1.1 : 1 }}
                className={`px-5 py-3 rounded-2xl border-2 font-mono font-bold text-sm shadow transition-all ${
                  isMatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-4 ring-emerald-500/20' : 'bg-background border-border text-foreground'
                }`}
              >
                {word}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
