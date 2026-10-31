import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryCard } from '../components/explore/CategoryCard';
import { CATEGORIES } from '../data/categories';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (searchTerm !== currentQ) {
        if (searchTerm) {
          setSearchParams({ q: searchTerm }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);

  const filteredCategories = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();
    if (!lowerTerm) return CATEGORIES;

    return CATEGORIES.filter(c =>
      c.title.toLowerCase().includes(lowerTerm) ||
      c.desc.toLowerCase().includes(lowerTerm) ||
      c.algorithms.some(a => a.title.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-6 sm:pt-8 pb-32 space-y-10">
      
      {/* HERO HEADER */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
          <Compass className="w-5 h-5" /> Explore Library
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-3">
              Master Every Algorithm.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl font-medium">
              Comprehensive visualizers and interactive guides across all core data structures and algorithmic paradigms.
            </p>
          </div>

          <div className="px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 self-start md:self-auto">
            {filteredCategories.length} Categories
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search algorithms, patterns, or data structures (e.g., Dijkstra, Binary Search, Graphs)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-card/80 backdrop-blur-md border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
          />
        </div>
      </section>

      {/* UNIFIED CATEGORIES GRID (Wide Screen Layout) */}
      <section>
        {filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-muted-foreground bg-card rounded-3xl border border-border border-dashed p-8"
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No categories found</h3>
            <p className="text-sm">Try adjusting your search query.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  title={cat.title}
                  count={cat.count}
                  description={cat.desc}
                  IconComponent={cat.Icon}
                  colorClass={cat.color}
                  delay={0}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

    </div>
  );
};
