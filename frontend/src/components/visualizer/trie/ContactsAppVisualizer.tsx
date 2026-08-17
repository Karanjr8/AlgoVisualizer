import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const ContactsAppVisualizer: React.FC<Props> = () => {
  const contacts = [
    { name: 'Karan', phone: '+1 555-0192' },
    { name: 'Karthik', phone: '+1 555-0184' },
    { name: 'Karina', phone: '+1 555-0177' },
    { name: 'Kavya', phone: '+1 555-0165' },
    { name: 'Rahul', phone: '+1 555-0143' }
  ];

  const [prefix, setPrefix] = useState<string>('kar');

  const matches = contacts.filter(c => c.name.toLowerCase().startsWith(prefix.toLowerCase()));

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
              placeholder="Search contacts by prefix..."
              className="pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary w-64"
            />
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Phonebook Contacts Application Trie Search
        </div>
      </div>

      {/* CONTACTS LIST */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-5 space-y-4 shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Contacts Phonebook ({matches.length} Matches for "{prefix}")
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <AnimatePresence>
            {contacts.map(c => {
              const isMatched = prefix && c.name.toLowerCase().startsWith(prefix.toLowerCase());

              return (
                <motion.div
                  key={c.name}
                  animate={{ scale: isMatched ? 1.05 : 0.95 }}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    isMatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md ring-2 ring-emerald-500/20' : 'bg-background border-border text-muted-foreground opacity-40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                    <span className="text-xs font-mono text-muted-foreground">{c.phone}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
