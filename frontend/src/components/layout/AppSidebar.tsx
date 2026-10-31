import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Map, Dumbbell, Play, FolderTree, Cpu, FlaskConical,
  Swords, LayoutDashboard, TrendingUp, Settings, ChevronRight, ChevronLeft,
  Sparkles, ArrowRight, ArrowLeft, FileText, Menu, X, BookOpen, CheckCircle2,
  ListFilter, Target, Home as HomeIcon, Award, Shield, Code, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { CATEGORIES, CategoryData } from '../../data/categories';

export interface NavLinkItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AppSidebarProps {
  navLinks?: NavLinkItem[];
  activeSection?: string;
  onSectionClick?: (id: string) => void;
}

type ContextType = 'HOME' | 'EXPLORE' | 'TOPIC' | 'PROBLEM' | 'PLAYGROUND' | 'INTERVIEW' | 'PROFILE' | 'ROADMAP';

interface SidebarContextResult {
  context: ContextType;
  category?: CategoryData;
  activeAlgoId?: string;
  prevAlgo?: { id: string; title: string };
  nextAlgo?: { id: string; title: string };
  breadcrumb: Array<{ label: string; path?: string }>;
}

// Route-Aware Classifier
function getSidebarContext(pathname: string): SidebarContextResult {
  const path = pathname.toLowerCase();
  const segments = path.split('/').filter(Boolean);

  // 1. HOME ROUTE
  if (path === '/' || path === '') {
    return {
      context: 'HOME',
      breadcrumb: [{ label: 'Home' }]
    };
  }

  // 2. EXPLORE OVERVIEW ROUTE
  if (path === '/explore' || path === '/explore/') {
    return {
      context: 'EXPLORE',
      breadcrumb: [{ label: 'Home', path: '/' }, { label: 'Explore Categories' }]
    };
  }

  // 3. PLAYGROUND SECTION
  if (path.startsWith('/playground')) {
    let toolName = 'Algorithm Lab';
    if (path.includes('/builder')) toolName = 'DS Builder';
    else if (path.includes('/complexity')) toolName = 'Complexity Lab';
    else if (path.includes('/simulator')) toolName = 'What-If Simulator';
    else if (path.includes('/studio')) toolName = 'Input Studio';
    else if (path.includes('/arena')) toolName = 'Algorithm Arena';

    return {
      context: 'PLAYGROUND',
      breadcrumb: [
        { label: 'Home', path: '/' },
        { label: 'Playground', path: '/playground' },
        { label: toolName }
      ]
    };
  }

  // 4. INTERVIEW PREP SECTION
  if (path.startsWith('/interview')) {
    let sub = 'Interview Setup';
    if (path.includes('/session')) sub = 'Mock Interview';
    else if (path.includes('/timed')) sub = 'Timed Challenges';
    else if (path.includes('/practice')) sub = 'Question Bank';
    else if (path.includes('/analytics') || path.includes('/reports')) sub = 'Performance Reports';

    return {
      context: 'INTERVIEW',
      breadcrumb: [
        { label: 'Home', path: '/' },
        { label: 'Interview Prep', path: '/interview/setup' },
        { label: sub }
      ]
    };
  }

  // 5. ROADMAP & PRACTICE SECTION
  if (path.startsWith('/roadmap') || path.startsWith('/practice')) {
    const isPractice = path.startsWith('/practice');
    return {
      context: 'ROADMAP',
      breadcrumb: [
        { label: 'Home', path: '/' },
        { label: isPractice ? 'Practice Arena' : 'Curriculum Roadmap' }
      ]
    };
  }

  // 6. PROFILE / DASHBOARD SECTION
  if (path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/settings') || path.startsWith('/progress')) {
    let name = 'Dashboard';
    if (path.includes('/profile') || path.includes('/progress')) name = 'Progress & Mastery';
    else if (path.includes('/settings')) name = 'Settings';

    return {
      context: 'PROFILE',
      breadcrumb: [
        { label: 'Home', path: '/' },
        { label: name }
      ]
    };
  }

  // 7. ALGORITHM PROBLEM / VISUALIZER OR TOPIC PAGE
  let matchedCategory: CategoryData | undefined;
  let activeAlgoId: string | undefined;

  for (const cat of CATEGORIES) {
    const catSlug = cat.id.toLowerCase();
    const catShort = catSlug.replace('-algorithms', '');

    if (segments.includes(catSlug) || segments.includes(catShort) || path.includes(catSlug) || path.includes(`${catShort}-intro`)) {
      matchedCategory = cat;
    }

    for (const algo of cat.algorithms) {
      const algoId = algo.id.toLowerCase();
      if (segments.includes(algoId) || path.includes(`/visualizer/${algoId}`) || path.endsWith(`/${algoId}`)) {
        matchedCategory = cat;
        activeAlgoId = algo.id;
        break;
      }
    }
    if (activeAlgoId) break;
  }

  if (matchedCategory) {
    const isProblem = Boolean(activeAlgoId || path.startsWith('/algorithms/') || path.startsWith('/visualizer/'));
    const algoList = matchedCategory.algorithms;
    let prevAlgo: { id: string; title: string } | undefined;
    let nextAlgo: { id: string; title: string } | undefined;

    if (activeAlgoId) {
      const currIdx = algoList.findIndex(a => a.id.toLowerCase() === activeAlgoId?.toLowerCase());
      if (currIdx > 0) prevAlgo = { id: algoList[currIdx - 1].id, title: algoList[currIdx - 1].title };
      if (currIdx >= 0 && currIdx < algoList.length - 1) nextAlgo = { id: algoList[currIdx + 1].id, title: algoList[currIdx + 1].title };
    }

    const activeAlgo = algoList.find(a => a.id.toLowerCase() === activeAlgoId?.toLowerCase());

    return {
      context: isProblem ? 'PROBLEM' : 'TOPIC',
      category: matchedCategory,
      activeAlgoId,
      prevAlgo,
      nextAlgo,
      breadcrumb: [
        { label: 'Home', path: '/' },
        { label: matchedCategory.title.replace(' Algorithms', ''), path: `/explore/${matchedCategory.id}` },
        ...(activeAlgo ? [{ label: activeAlgo.title }] : [])
      ]
    };
  }

  // FALLBACK TO GLOBAL HOME
  return {
    context: 'HOME',
    breadcrumb: [{ label: 'Home', path: '/' }]
  };
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  navLinks,
  activeSection,
  onSectionClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 20;
          setIsScrolled(prev => (prev !== nextScrolled ? nextScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOpen = isExpanded || isHovered;
  const contextData = getSidebarContext(location.pathname);
  const { context, category, activeAlgoId, prevAlgo, nextAlgo, breadcrumb } = contextData;

  return (
    <>
      {/* MOBILE TRIGGER BUTTON */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed left-4 top-20 z-40 p-2.5 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 text-foreground shadow-lg hover:border-primary/50 transition-all"
        aria-label="Open Mobile Sidebar"
      >
        <Menu className="w-5 h-5 text-primary" />
      </button>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-3 bottom-3 left-3 w-[290px] bg-card/95 backdrop-blur-2xl border border-white/10 rounded-3xl z-50 p-5 flex flex-col justify-between shadow-2xl lg:hidden sidebar-scrollbar overflow-y-auto"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">
                      A
                    </div>
                    <span className="font-extrabold text-foreground text-lg tracking-tight">AlgoVis</span>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <MobileDrawerContent
                  contextData={contextData}
                  onClose={() => setIsMobileOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP FLOATING SIDEBAR CONTAINER */}
      <aside className="hidden lg:block w-16 shrink-0 relative z-40">
        
        {/* FLOATING GLASS SIDEBAR PANEL */}
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ width: isOpen ? 275 : 64 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ top: isScrolled ? 84 : 100 }}
          className={cn(
            'fixed left-4 bottom-6 z-40 flex flex-col justify-between py-3 select-none rounded-3xl transform-gpu',
            'true-frosted-glass group',
            isOpen ? 'px-3 overflow-hidden' : 'px-2 overflow-visible'
          )}
        >
          {/* TOP HEADER: LOGO & EXPAND TOGGLE */}
          <div className="flex items-center justify-between py-1 shrink-0 pb-3 border-b border-border/40">
            {isOpen ? (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary via-purple-500 to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                    A
                  </div>
                  <span className="font-black text-base text-foreground tracking-tight whitespace-nowrap">
                    AlgoVis
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-tr from-primary via-purple-500 to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md hover:scale-105 transition-all shrink-0 relative group"
                title="Expand Sidebar"
              >
                <span>A</span>
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </button>
            )}
          </div>

          {/* DYNAMIC BREADCRUMB TRAIL */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-2 pt-2.5 pb-1 flex items-center gap-1 text-[10px] font-bold text-muted-foreground truncate border-b border-border/30 shrink-0"
            >
              {breadcrumb.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                  {b.path ? (
                    <Link to={b.path} className="hover:text-primary transition-colors truncate">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-black truncate">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          )}

          {/* MIDDLE SCROLLABLE BODY */}
          <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar py-3 space-y-4 px-0">
            
            {/* 1. HOME CONTEXT */}
            {context === 'HOME' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 px-3 block mb-1">
                    Main Navigation
                  </span>
                )}
                {[
                  { name: 'Home', path: '/', icon: HomeIcon },
                  { name: 'Explore Algorithms', path: '/explore', icon: Compass },
                  { name: 'Practice Arena', path: '/practice', icon: Dumbbell },
                  { name: 'Playground', path: '/playground', icon: Play },
                  { name: 'Interview Prep', path: '/interview/setup', icon: Swords },
                  { name: 'Curriculum Roadmap', path: '/roadmap', icon: Map },
                  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                  { name: 'Settings', path: '/settings', icon: Settings },
                ].map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isOpen={isOpen}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </div>
            )}

            {/* 2. EXPLORE CONTEXT */}
            {context === 'EXPLORE' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 block mb-1">
                    Algorithm Categories
                  </span>
                )}
                {CATEGORIES.map((cat) => (
                  <SidebarItem
                    key={cat.id}
                    item={{
                      name: cat.title.replace(' Algorithms', ''),
                      path: `/explore/${cat.id}`,
                      icon: cat.Icon,
                      badge: `${cat.count}`
                    }}
                    isOpen={isOpen}
                    isActive={location.pathname.includes(cat.id)}
                  />
                ))}
              </div>
            )}

            {/* 3. TOPIC & PROBLEM CONTEXT */}
            {(context === 'TOPIC' || context === 'PROBLEM') && category && (
              <div className="space-y-4">
                {/* Category Header */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mx-auto lg:mx-0">
                      <category.Icon className="w-4 h-4" />
                    </div>
                    {isOpen && (
                      <span className="text-xs font-black uppercase tracking-wider text-primary truncate">
                        {category.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtopic Algorithm Tree */}
                <div className="space-y-1">
                  {category.algorithms.map((algo) => {
                    const isAlgoActive = activeAlgoId?.toLowerCase() === algo.id.toLowerCase() || location.pathname.includes(algo.id.toLowerCase());

                    if (!isOpen) {
                      return (
                        <Link
                          key={algo.id}
                          to={`/algorithms/${category.id.replace('-algorithms', '')}/${algo.id}`}
                          className={cn(
                            'w-10 h-10 mx-auto rounded-2xl flex items-center justify-center relative shrink-0 transition-all select-none group/algo',
                            !isAlgoActive && 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
                          )}
                          title={algo.title}
                        >
                          {isAlgoActive && (
                            <motion.div
                              layoutId="sidebar-algo-pill-collapsed"
                              className="absolute inset-0 rounded-2xl bg-primary/20 border border-primary/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] z-0 pointer-events-none overflow-hidden"
                              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                            >
                              <div className="absolute left-0.5 top-2 bottom-2 w-1 bg-gradient-to-b from-primary via-purple-400 to-primary rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                            </motion.div>
                          )}
                          {isAlgoActive ? (
                            <CheckCircle2 className="w-4 h-4 text-primary relative z-10" />
                          ) : (
                            <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover/algo:text-foreground relative z-10" />
                          )}
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={algo.id}
                        to={`/algorithms/${category.id.replace('-algorithms', '')}/${algo.id}`}
                        className={cn(
                          'w-full h-10 px-3 rounded-2xl flex items-center justify-between gap-2.5 relative shrink-0 text-xs font-bold transition-all select-none group/algo',
                          !isAlgoActive && 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                        )}
                        title={algo.title}
                      >
                        {isAlgoActive && (
                          <motion.div
                            layoutId="sidebar-algo-pill-expanded"
                            className="absolute inset-0 rounded-2xl bg-primary/15 border border-primary/30 shadow-[0_0_16px_rgba(168,85,247,0.2)] z-0 pointer-events-none overflow-hidden"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          >
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary via-purple-400 to-primary rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                          </motion.div>
                        )}
                        <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                            {isAlgoActive ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover/algo:text-foreground" />
                            )}
                          </div>
                          <span className={cn('truncate', isAlgoActive ? 'text-foreground font-black' : '')}>
                            {algo.title}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0 relative z-10',
                            algo.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-400' :
                            algo.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                            'bg-rose-500/15 text-rose-400'
                          )}
                        >
                          {algo.difficulty}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Previous & Next Navigation Buttons for Problem View */}
                {context === 'PROBLEM' && (prevAlgo || nextAlgo) && (
                  <div className="pt-2 border-t border-border/40 space-y-1.5 px-1">
                    {isOpen && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 block">
                        Problem Navigation
                      </span>
                    )}
                    <div className="grid grid-cols-2 gap-1.5">
                      {prevAlgo ? (
                        <Link
                          to={`/algorithms/${category.id.replace('-algorithms', '')}/${prevAlgo.id}`}
                          className="flex items-center gap-1 p-2 rounded-xl bg-card border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors truncate"
                          title={`Previous: ${prevAlgo.title}`}
                        >
                          <ArrowLeft className="w-3 h-3 shrink-0 text-primary" />
                          {isOpen && <span className="truncate">{prevAlgo.title}</span>}
                        </Link>
                      ) : <div />}
                      {nextAlgo ? (
                        <Link
                          to={`/algorithms/${category.id.replace('-algorithms', '')}/${nextAlgo.id}`}
                          className="flex items-center justify-end gap-1 p-2 rounded-xl bg-card border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors truncate"
                          title={`Next: ${nextAlgo.title}`}
                        >
                          {isOpen && <span className="truncate">{nextAlgo.title}</span>}
                          <ArrowRight className="w-3 h-3 shrink-0 text-primary" />
                        </Link>
                      ) : <div />}
                    </div>
                  </div>
                )}

                {/* On-Page Table of Contents Anchors */}
                {navLinks && navLinks.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border/40">
                    {isOpen && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 px-3 block mb-1">
                        On-Page Contents
                      </span>
                    )}
                    {navLinks.map((link) => {
                      const isSecActive = activeSection === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => onSectionClick?.(link.id)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-2xl text-xs font-semibold transition-all text-left group/toc',
                            isSecActive
                              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                          )}
                          title={link.label}
                        >
                          <div className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground group-hover/toc:text-orange-400">
                            {link.icon || <FileText className="w-3.5 h-3.5" />}
                          </div>
                          {isOpen && <span className="truncate">{link.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. PLAYGROUND CONTEXT */}
            {context === 'PLAYGROUND' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 block mb-1">
                    Playground Tools
                  </span>
                )}
                {[
                  { name: 'Algorithm Lab', path: '/playground', icon: Play },
                  { name: 'DS Builder', path: '/playground/builder', icon: FolderTree },
                  { name: 'Complexity Lab', path: '/playground/complexity', icon: Cpu },
                  { name: 'Input Studio', path: '/playground/studio', icon: ListFilter },
                  { name: 'What-If Simulator', path: '/playground/simulator', icon: FlaskConical },
                  { name: 'Algorithm Arena', path: '/playground/arena', icon: Target },
                  { name: 'Code Explorer', path: '/playground/explorer', icon: Code },
                ].map((tool) => (
                  <SidebarItem
                    key={tool.path}
                    item={tool}
                    isOpen={isOpen}
                    isActive={location.pathname === tool.path}
                  />
                ))}
              </div>
            )}

            {/* 5. INTERVIEW CONTEXT */}
            {context === 'INTERVIEW' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 block mb-1">
                    Interview Prep
                  </span>
                )}
                {[
                  { name: 'Interview Setup', path: '/interview/setup', icon: Swords },
                  { name: 'Mock Interview', path: '/interview/session', icon: Target },
                  { name: 'Timed Challenges', path: '/interview/timed', icon: Zap },
                  { name: 'Question Bank', path: '/interview/practice', icon: BookOpen },
                  { name: 'Analytics & Reports', path: '/interview/analytics', icon: TrendingUp },
                ].map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isOpen={isOpen}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </div>
            )}

            {/* 6. PROFILE / DASHBOARD CONTEXT */}
            {context === 'PROFILE' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 block mb-1">
                    Dashboard & Account
                  </span>
                )}
                {[
                  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                  { name: 'Progress', path: '/profile', icon: TrendingUp },
                  { name: 'Streaks & Stats', path: '/progress', icon: Award },
                  { name: 'Achievements', path: '/profile/achievements', icon: Shield },
                  { name: 'Curriculum Roadmap', path: '/roadmap', icon: Map },
                  { name: 'Settings', path: '/settings', icon: Settings },
                ].map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isOpen={isOpen}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </div>
            )}

            {/* 7. ROADMAP & PRACTICE CONTEXT */}
            {context === 'ROADMAP' && (
              <div className="space-y-1">
                {isOpen && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 block mb-1">
                    Curriculum & Practice
                  </span>
                )}
                {[
                  { name: 'Curriculum Roadmap', path: '/roadmap', icon: Map },
                  { name: 'Practice Arena', path: '/practice', icon: Dumbbell },
                  { name: 'Explore Categories', path: '/explore', icon: Compass },
                ].map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isOpen={isOpen}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </div>
            )}

          </div>

          {/* DYNAMIC LEARNING COMPANION WIDGET */}
          {(context === 'TOPIC' || context === 'PROBLEM') && category && (
            <div className="pt-2 border-t border-border/60 shrink-0 bg-card/40 backdrop-blur-sm z-10">
              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 via-card to-card border border-orange-500/25 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Learning Companion
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-foreground truncate">
                    {category.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span>Completed: <strong className="text-emerald-400">2 / {category.count}</strong></span>
                    <span>Next: <strong className="text-orange-400">{category.algorithms[1]?.title || 'BFS'}</strong></span>
                  </div>

                  <Link
                    to={`/algorithms/${category.id.replace('-algorithms', '')}/${category.algorithms[0]?.id || 'bfs'}`}
                    className="w-full py-1.5 rounded-xl bg-orange-500 text-black font-extrabold text-[11px] hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-sm mt-1"
                  >
                    Resume Path <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              ) : (
                <Link
                  to={`/algorithms/${category.id.replace('-algorithms', '')}/${category.algorithms[0]?.id || 'bfs'}`}
                  className="w-10 h-10 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center hover:scale-105 transition-all shadow-sm"
                  title="Learning Companion"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

        </motion.div>
      </aside>
    </>
  );
};

// Reusable Sidebar Item Component with dedicated Collapsed Mode vs Expanded Mode rendering
function SidebarItem({
  item,
  isOpen,
  isActive
}: {
  item: { name: string; path: string; icon: React.ElementType; badge?: string };
  isOpen: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;

  if (!isOpen) {
    // DEDICATED COLLAPSED STATE COMPONENT (Zero Clipping, 100% Centered Capsule)
    return (
      <Link
        to={item.path}
        className={cn(
          'w-10 h-10 mx-auto rounded-2xl flex items-center justify-center relative shrink-0 transition-all select-none group/item',
          !isActive && 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
        )}
        title={item.name}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill-collapsed"
            className="absolute inset-0 rounded-2xl bg-primary/20 border border-primary/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] z-0 pointer-events-none overflow-hidden"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          >
            <div className="absolute left-0.5 top-2 bottom-2 w-1 bg-gradient-to-b from-primary via-purple-400 to-primary rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </motion.div>
        )}

        <Icon className={cn('w-4 h-4 transition-transform duration-150 group-hover/item:scale-110 relative z-10', isActive ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground')} />
      </Link>
    );
  }

  // DEDICATED EXPANDED STATE COMPONENT
  return (
    <Link
      to={item.path}
      className={cn(
        'w-full h-10 px-3 rounded-2xl flex items-center gap-3 relative shrink-0 text-xs font-extrabold transition-colors select-none group/item',
        !isActive && 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
      )}
      title={item.name}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill-expanded"
          className="absolute inset-0 rounded-2xl bg-primary/15 border border-primary/30 shadow-[0_0_16px_rgba(168,85,247,0.2)] z-0 pointer-events-none overflow-hidden"
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        >
          <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary via-purple-400 to-primary rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </motion.div>
      )}

      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative z-10">
        <Icon className={cn('w-4 h-4 transition-transform duration-150 group-hover/item:scale-110', isActive ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground')} />
      </div>

      <span className={cn('truncate flex-1 relative z-10', isActive ? 'text-foreground font-black' : '')}>
        {item.name}
      </span>

      {item.badge && (
        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-wider shrink-0 relative z-10">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// Mobile Drawer Content Helper
function MobileDrawerContent({
  contextData,
  onClose
}: {
  contextData: SidebarContextResult;
  onClose: () => void;
}) {
  const { context, category, activeAlgoId, breadcrumb } = contextData;
  const location = useLocation();

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
        {breadcrumb.map((b, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            <span className={idx === breadcrumb.length - 1 ? 'text-primary font-extrabold' : ''}>{b.label}</span>
          </React.Fragment>
        ))}
      </div>

      {/* 1. HOME CONTEXT MOBILE */}
      {context === 'HOME' && (
        <div className="space-y-1">
          <div className="text-xs font-black uppercase text-primary px-1 tracking-wider mb-2">Navigation</div>
          {[
            { name: 'Home', path: '/', icon: HomeIcon },
            { name: 'Explore Algorithms', path: '/explore', icon: Compass },
            { name: 'Practice Arena', path: '/practice', icon: Dumbbell },
            { name: 'Playground', path: '/playground', icon: Play },
            { name: 'Interview Prep', path: '/interview/setup', icon: Swords },
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          ].map((item) => (
            <Link key={item.path} to={item.path} onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold hover:bg-card/80">
              <item.icon className="w-4 h-4 text-primary" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* 2. EXPLORE CONTEXT MOBILE */}
      {context === 'EXPLORE' && (
        <div className="space-y-1">
          <div className="text-xs font-black uppercase text-primary px-1 tracking-wider mb-2">Algorithm Categories</div>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/explore/${cat.id}`} onClick={onClose} className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold hover:bg-card/80">
              <span>{cat.title.replace(' Algorithms', '')}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-muted">{cat.count}</span>
            </Link>
          ))}
        </div>
      )}

      {/* 3. TOPIC & PROBLEM CONTEXT MOBILE */}
      {(context === 'TOPIC' || context === 'PROBLEM') && category && (
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-primary px-1 tracking-wider">
            {category.title}
          </div>
          <div className="space-y-1">
            {category.algorithms.map((algo) => {
              const isAlgoActive = activeAlgoId?.toLowerCase() === algo.id.toLowerCase() || location.pathname.includes(algo.id.toLowerCase());
              return (
                <Link
                  key={algo.id}
                  to={`/algorithms/${category.id.replace('-algorithms', '')}/${algo.id}`}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all',
                    isAlgoActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/80'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {isAlgoActive ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span>{algo.title}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-muted">{algo.difficulty}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
