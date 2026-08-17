import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, Compass, BookOpen, Target, FileText, Layers, Hash, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../store/useSearchStore';
import { searchContent, SearchItem } from '../../lib/searchRegistry';

const POPULAR_SEARCHES = ['Binary Search', 'Dynamic Programming', 'Two Pointers', 'Graph Traversal', 'Sorting'];

export const GlobalSearch = () => {
  const { isOpen, setIsOpen } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
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

  // Handle Cmd+K / Ctrl+K and Global Keyboard Nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim() && results.length === 0) {
          // Fallback behavior if no results but hit enter
          setIsOpen(false);
          navigate('/explore');
          window.scrollTo(0, 0);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen, results, selectedIndex, query, navigate]);

  // Focus input when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // Reset only slightly delayed so exit animation doesn't snap
      setTimeout(() => {
        setQuery('');
        setResults([]);
        setSelectedIndex(0);
      }, 200);
    }
  }, [isOpen]);

  // Local Search Execution (Immediate, no debounce needed for local data)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    
    const searchRes = searchContent(query);
    setResults(searchRes);
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    // Save to recent searches
    const newRecent = [item.title, ...recentSearches.filter(s => s !== item.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    setIsOpen(false);
    navigate(item.route);
    window.scrollTo(0, 0);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Algorithm': return <BookOpen className="w-5 h-5 text-primary" />;
      case 'Category': return <Layers className="w-5 h-5 text-secondary" />;
      case 'Pattern': return <Hash className="w-5 h-5 text-accent" />;
      case 'Data Structure': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'Lesson': return <Target className="w-5 h-5 text-green-400" />;
      default: return <Compass className="w-5 h-5 text-muted-foreground" />;
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
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[70vh]"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 border-b border-border relative bg-card">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn? (e.g. 'binary search', 'dp')"
                  className="flex-1 bg-transparent border-none outline-none text-lg py-5 px-4 text-foreground placeholder:text-muted-foreground/50"
                  autoComplete="off"
                  spellCheck="false"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-2">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-muted rounded border border-border text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  ESC
                </div>
              </div>

              {/* Search Body */}
              <div className="flex-1 overflow-y-auto bg-card/50" ref={listRef}>
                
                {/* Empty State / Suggestions (When no query) */}
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
                              className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-2 px-2">
                        <TrendingUp className="w-4 h-4" /> Popular
                      </h3>
                      <div className="flex flex-col gap-1">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleQuickSearch(term)}
                            className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent text-left group transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="text-muted-foreground group-hover:text-foreground font-medium">{term}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Results State */}
                {query.trim() && results.length > 0 && (
                  <div className="p-2 py-3">
                    {results.map((item, index) => {
                      const isActive = index === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          data-active={isActive}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left p-3 rounded-xl mb-1 cursor-pointer transition-colors flex gap-4 items-center group ${
                            isActive ? 'bg-primary/10 border border-primary/20 shadow-sm' : 'hover:bg-accent border border-transparent'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-background'}`}>
                            {getIconForType(item.type)}
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-bold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {item.title}
                              </h4>
                              {item.difficulty && (
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                                  item.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  item.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                  'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                  {item.difficulty}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <span className="font-semibold text-foreground/60">{item.category}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="truncate">{item.type}</span>
                              {item.complexity && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="truncate font-mono">{item.complexity}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 opacity-0 group-hover:opacity-100 data-[active=true]:opacity-100 transition-opacity">
                             <ArrowRight className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No Results State */}
                {query.trim() && results.length === 0 && (
                  <div className="py-16 px-4 text-center">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Compass className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No matching topic found.</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      We couldn't find anything matching "{query}". Check for typos or explore all algorithms instead.
                    </p>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/explore');
                      }}
                      className="btn btn-outline border-border hover:bg-muted font-bold px-6 py-2 rounded-xl"
                    >
                      Explore All Algorithms
                    </button>
                  </div>
                )}
              </div>

              {/* Search Footer (Keyboard hints) */}
              <div className="bg-muted px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↓</kbd> to navigate</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd> to select</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" /> Local Registry
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
