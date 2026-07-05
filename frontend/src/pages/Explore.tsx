import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Compass, Layers, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryCard } from '../components/explore/CategoryCard';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update URL when search term changes, or update state if URL changes externally
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filteredCategories = CATEGORIES.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, our dummy data filters. In reality, you'd map category properties.
    const matchesFilter = activeFilter === 'All' ? true : 
                          activeFilter === 'Basics' ? ['sorting', 'searching'].includes(c.id) :
                          activeFilter === 'Trees & Graphs' ? ['trees', 'graphs'].includes(c.id) :
                          activeFilter === 'Dynamic Programming' ? ['dp'].includes(c.id) : true;

    return matchesSearch && matchesFilter;
  });

  const filterOptions = ['All', 'Basics', 'Trees & Graphs', 'Dynamic Programming', 'Advanced'];

  const leftPanel = (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-primary font-semibold mb-2">
        <Compass className="w-5 h-5" /> Explore Library
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-black tracking-tight mb-8">
        Master every algorithm.
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search patterns..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-shadow shadow-sm"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card backdrop-blur-md border border-border p-5 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Categories
        </h3>
        <div className="flex flex-col gap-1">
          {filterOptions.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === filter 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <span>{filter}</span>
              {activeFilter === filter && <CheckCircle2 className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <WorkspaceLayout leftPanel={leftPanel}>
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-shadow shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center justify-center gap-2 px-6 bg-card border border-border rounded-2xl hover:bg-accent transition-colors font-semibold"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-8 mt-4">
            <h2 className="text-2xl font-bold">
              {activeFilter === 'All' ? 'All Algorithms' : activeFilter}
            </h2>
            <span className="px-3 py-1 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground tracking-wider uppercase">
              {filteredCategories.length} Results
            </span>
          </div>

          {filteredCategories.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-muted-foreground bg-card rounded-3xl border border-border border-dashed">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CategoryCard 
                      id={cat.id}
                      title={cat.title}
                      count={cat.count}
                      description={cat.desc}
                      IconComponent={cat.Icon}
                      colorClass={cat.color}
                      delay={0} // Stagger removed because AnimatePresence handles dynamic lists better without forced hard delays
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
    </WorkspaceLayout>
  );
};
