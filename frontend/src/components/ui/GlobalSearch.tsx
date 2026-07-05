import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, TrendingUp, Compass, BookOpen, Target, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../store/useSearchStore';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  url: string;
  score: number;
}

interface SearchGroup {
  label: string;
  items: SearchResult[];
}

const POPULAR_SEARCHES = ['Binary Search', 'Dynamic Programming', 'Two Pointers', 'Graph Traversal', 'Sorting'];

export const GlobalSearch = () => {
  const { isOpen, setIsOpen } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Flattened items for keyboard navigation
  const [flatItems, setFlatItems] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) { }
  }, []);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setFlatItems([]);
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: SearchGroup[] = await res.json();
          setResults(data);
          
          const flattened = data.flatMap(g => g.items);
          setFlatItems(flattened);
          setSelectedIndex(0);
        }
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard Navigation
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen || flatItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex]);
        }
      }
    };
    
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, flatItems, selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    // Save to recent searches
    const newRecent = [item.title, ...recentSearches.filter(s => s !== item.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    setIsOpen(false);
    navigate(item.url);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Algorithm': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Practice Question': return <Target className="w-4 h-4 text-red-400" />;
      case 'Roadmap Topic': return <Compass className="w-4 h-4 text-green-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-[#141517] border border-[#2a2b2f] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[70vh]"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 border-b border-[#2a2b2f] relative">
                <Search className={`w-5 h-5 ${loading ? 'text-[#00f0ff] animate-pulse' : 'text-muted-foreground'} shrink-0`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn? (e.g. 'binary search', 'dp')"
                  className="flex-1 bg-transparent border-none outline-none text-lg py-5 px-4 text-white placeholder:text-muted-foreground/50"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-1 ml-4 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  ESC
                </div>
              </div>

              {/* Search Body */}
              <div className="flex-1 overflow-y-auto" ref={listRef}>
                
                {/* Empty State / Suggestions */}
                {!query.trim() && (
                  <div className="p-4 space-y-6">
                    {recentSearches.length > 0 && (
                      <div>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2 px-2">
                          <Clock className="w-4 h-4" /> Recent
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map(term => (
                            <button
                              key={term}
                              onClick={() => handleQuickSearch(term)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2 px-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" /> Popular
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map(term => (
                          <button
                            key={term}
                            onClick={() => handleQuickSearch(term)}
                            className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-lg text-sm text-purple-200 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {query.trim() && results.length === 0 && !loading && (
                  <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold text-white mb-2">No results found for "{query}"</p>
                    <p className="text-muted-foreground text-sm max-w-sm mb-6">
                      We couldn't find anything matching your query. Try using synonyms or broader terms.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => handleQuickSearch('Dynamic Programming')} className="text-xs text-[#00f0ff] hover:underline">Dynamic Programming</button>
                      <span className="text-muted-foreground text-xs">•</span>
                      <button onClick={() => handleQuickSearch('Sorting')} className="text-xs text-[#00f0ff] hover:underline">Sorting</button>
                      <span className="text-muted-foreground text-xs">•</span>
                      <button onClick={() => handleQuickSearch('Graphs')} className="text-xs text-[#00f0ff] hover:underline">Graphs</button>
                    </div>
                  </div>
                )}

                {/* Results List */}
                {results.length > 0 && (
                  <div className="p-2 space-y-4">
                    {results.map((group) => (
                      <div key={group.label}>
                        <div className="px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                          {group.label}
                        </div>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const isSelected = flatItems[selectedIndex]?.id === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(flatItems.findIndex(i => i.id === item.id))}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                                  isSelected 
                                    ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30' 
                                    : 'border border-transparent hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/10' : 'bg-[#0d0e10] border border-[#2a2b2f]'}`}>
                                    {getIconForType(item.type)}
                                  </div>
                                  <div>
                                    <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                      {item.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {item.subtitle}
                                    </div>
                                  </div>
                                </div>
                                
                                {isSelected && (
                                  <ArrowRight className="w-4 h-4 text-[#00f0ff]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-[#0d0e10] border-t border-[#2a2b2f] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                  <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5">↑↓</span> to navigate</div>
                  <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5">↵</span> to select</div>
                  <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5">ESC</span> to close</div>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#00f0ff]/50">
                  Intelligent Discovery
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
