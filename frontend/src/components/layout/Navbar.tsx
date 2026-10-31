import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Moon, Sun, Menu, X, Search, User,
  LayoutDashboard, LogOut, Home, Compass,
  Map, Dumbbell, TrendingUp, Play, Sparkles, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSearchStore } from '../../store/useSearchStore';
import { useTheme } from '../theme/ThemeProvider';

const NAV_LINKS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Explore', path: '/explore', icon: Compass },
  { name: 'Playground', path: '/playground', icon: Play },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'Practice', path: '/practice', icon: Dumbbell },
  { name: 'Progress', path: '/progress', icon: TrendingUp },
];

// Deterministic route matching helper function
const isRouteActive = (linkPath: string, currentPathname: string): boolean => {
  const path = currentPathname.toLowerCase();

  if (linkPath === '/') {
    return path === '/' || path === '';
  }
  if (linkPath === '/explore') {
    return (
      path.startsWith('/explore') ||
      path.startsWith('/algorithms') ||
      path.startsWith('/visualizer')
    );
  }
  if (linkPath === '/playground') {
    return path.startsWith('/playground');
  }
  if (linkPath === '/roadmap') {
    return path.startsWith('/roadmap');
  }
  if (linkPath === '/practice') {
    return path.startsWith('/practice') || path.startsWith('/interview');
  }
  if (linkPath === '/progress') {
    return (
      path.startsWith('/progress') ||
      path.startsWith('/dashboard') ||
      path.startsWith('/profile') ||
      path.startsWith('/settings')
    );
  }
  return path.startsWith(linkPath);
};

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { setIsOpen: setGlobalSearchOpen } = useSearchStore();

  // Scroll listener for density transition
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

  // Track location pathname to reset open menus during render transition
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }

  // Active route detection memoized
  const activeLinkPath = useMemo(() => {
    const matched = NAV_LINKS.find(link => isRouteActive(link.path, location.pathname));
    return matched ? matched.path : null;
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* FLOATING GLASS DOCK CONTAINER */}
      <header className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 z-50 pointer-events-none">
        <div className="max-w-[1600px] mx-auto pointer-events-auto">
          <nav
            className={`w-full rounded-2xl sm:rounded-3xl transition-all duration-300 transform-gpu ${
              isScrolled
                ? 'true-frosted-glass-scrolled py-2.5 px-4 sm:px-6'
                : 'true-frosted-glass py-3 px-4 sm:px-6'
            }`}
          >
            <div className="flex items-center justify-between gap-4 lg:gap-8">
              
              {/* LEFT: BRAND LOGO */}
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-purple-500 to-cyan-400 flex items-center justify-center text-black font-black text-lg group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-tight text-foreground leading-none flex items-center gap-1">
                      AlgoVis <Sparkles className="w-3 h-3 text-primary" />
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Visualizer</span>
                  </div>
                </Link>

                {/* DESKTOP NAV LINKS (SPRING GLASS SLIDING PILL) */}
                <LayoutGroup id="navbar">
                  <div className="hidden lg:flex items-center gap-1.5 bg-background/40 backdrop-blur-md p-1.5 rounded-full border border-white/5 relative">
                    {NAV_LINKS.map((link) => {
                      const isActive = activeLinkPath === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`relative px-4 py-1.5 text-xs font-extrabold rounded-full transition-colors duration-150 select-none ${
                            isActive
                              ? 'text-foreground font-black'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="navbar-active-pill"
                              className="absolute inset-0 bg-primary/20 rounded-full border border-primary/40 shadow-[0_0_15px_rgba(168,85,247,0.35)] -z-10"
                              transition={{
                                type: 'spring',
                                stiffness: 450,
                                damping: 32,
                                mass: 0.5
                              }}
                            />
                          )}
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>

              {/* CENTER: GLASS SEARCH BAR BUTTON (DESKTOP/TABLET) */}
              <div className="hidden md:flex flex-1 max-w-sm">
                <button
                  onClick={() => setGlobalSearchOpen(true)}
                  className="w-full bg-background/50 hover:bg-background/80 border border-white/10 hover:border-primary/40 rounded-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-inner transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                    <span>Search algorithms or topics...</span>
                  </div>
                  <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 rounded bg-muted/80 text-[10px] font-mono font-bold text-muted-foreground border border-border">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* RIGHT: ACTIONS (THEME, PROFILE, MOBILE MENU) */}
              <div className="flex items-center gap-3">
                {/* Theme Switcher Button */}
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full bg-background/40 hover:bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm cursor-pointer"
                  aria-label="Toggle theme"
                >
                  <Moon className="w-4 h-4 hidden dark:block text-purple-400" />
                  <Sun className="w-4 h-4 block dark:hidden text-amber-500" />
                </button>

                {/* Search Button for Mobile */}
                <button
                  onClick={() => setGlobalSearchOpen(true)}
                  className="md:hidden w-9 h-9 rounded-full bg-background/40 hover:bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-primary" />
                </button>

                {/* USER PROFILE & AUTH */}
                <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-3">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 rounded-full bg-background/40 hover:bg-background/80 border border-white/10 transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[1.5px] shadow-sm">
                          <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <User className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Animated Glass Profile Dropdown */}
                      <AnimatePresence>
                        {isProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute right-0 top-full mt-3 w-56 p-2 rounded-2xl bg-card/90 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 space-y-1"
                          >
                            <div className="px-3 py-2.5 border-b border-border/50 mb-1">
                              <p className="text-xs font-black text-foreground truncate">{user.username}</p>
                              <p className="text-[10px] font-bold text-muted-foreground truncate mt-0.5">{user.email}</p>
                            </div>
                            
                            <Link
                              to="/dashboard"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
                            </Link>

                            {user.role === 'ADMIN' && (
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <ShieldCheck className="w-4 h-4 text-red-400" /> Admin Portal
                              </Link>
                            )}

                            <Link
                              to="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                              <User className="w-4 h-4 text-purple-400" /> Profile
                            </Link>

                            <button
                              onClick={() => {
                                logout();
                                setIsProfileOpen(false);
                              }}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        to="/login"
                        className="px-4 py-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        className="px-4 py-1.5 text-xs font-black text-black bg-gradient-to-r from-primary via-purple-400 to-cyan-400 hover:brightness-110 rounded-full transition-all shadow-md"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Drawer Trigger */}
                <button
                  className="lg:hidden w-9 h-9 rounded-full bg-background/40 hover:bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

            </div>
          </nav>
        </div>
      </header>

      {/* MOBILE FLOATING GLASS DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed top-4 right-4 bottom-4 w-[310px] bg-card/90 backdrop-blur-2xl border border-white/15 z-50 p-6 rounded-3xl flex flex-col shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <span className="text-sm font-black text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Navigation
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-background/50 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1.5 flex-1">
                {NAV_LINKS.map((link) => {
                  const isActive = isRouteActive(link.path, location.pathname);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}

                <div className="my-4 border-t border-border" />

                {user ? (
                  <>
                    <div className="px-3 py-2 bg-background/50 rounded-2xl border border-white/10 mb-2">
                      <p className="text-xs font-black text-foreground truncate">{user.username}</p>
                      <p className="text-[10px] font-bold text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <User className="w-4 h-4 text-purple-400" /> Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-rose-400 hover:bg-rose-500/10 w-full text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-2 pt-4">
                    <Link
                      to="/login"
                      className="w-full py-3 rounded-2xl border border-border text-center font-bold text-xs hover:bg-accent transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-black font-black text-xs text-center shadow-lg"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
