import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const FileSystemTrieVisualizer: React.FC<Props> = () => {
  const paths = [
    '/home/user/docs',
    '/home/user/images',
    '/var/log/syslog'
  ];

  const [activePathIdx, setActivePathIdx] = useState<number>(0);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="font-mono text-xs text-muted-foreground">
          File System Path Trie (Hierarchy split on path delimiter <strong className="text-amber-400 font-mono">"/"</strong>)
        </div>
      </div>

      {/* DIRECTORY TREE PATH HIERARCHY */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-5 space-y-4 shadow-inner">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
          File System Directory Path Trie Nodes
        </span>

        <div className="space-y-3 py-2">
          {paths.map((p, idx) => (
            <motion.div
              key={p}
              onClick={() => setActivePathIdx(idx)}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                activePathIdx === idx ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow' : 'bg-background border-border text-foreground'
              }`}
            >
              <Folder className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                {p.split('/').filter(Boolean).map((seg, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="px-2.5 py-1 rounded-lg bg-card border border-border font-bold">
                      {i === arr.length - 1 ? <FileText className="w-3.5 h-3.5 inline mr-1 text-emerald-400" /> : <Folder className="w-3.5 h-3.5 inline mr-1 text-amber-400" />}
                      {seg}
                    </span>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
