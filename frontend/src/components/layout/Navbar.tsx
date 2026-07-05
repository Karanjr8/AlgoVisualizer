import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Menu, X, Search, User, 
  LayoutDashboard, LogOut, Home, Compass, 
  Map, Dumbbell, TrendingUp, Play
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

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsOpen: setGlobalSearchOpen } = useSearchStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle scroll for transparent -> blur background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearchOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between gap-8">
            
            {/* Left: Logo & Nav Links */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
                  A
                </div>
                <span className="text-xl font-bold tracking-tight">AlgoVis</span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20 -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Center: Global Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className={`absolute inset-0 bg-primary/20 rounded-full blur-md transition-opacity duration-300 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative bg-background border border-border rounded-full flex items-center px-4 py-2 focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.3)] focus-within:bg-card transition-all shadow-sm">
                  <Search className="w-4 h-4 text-muted-foreground mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search algorithms..." 
                    onClick={() => setGlobalSearchOpen(true)}
                    readOnly
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 cursor-pointer"
                  />
                  <div className="hidden lg:flex items-center justify-center px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border ml-2">
                    ⌘K
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                <Moon className="w-5 h-5 hidden dark:block" />
                <Sun className="w-5 h-5 block dark:hidden" />
              </button>

              <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-border pl-5">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${location.pathname === '/dashboard' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                    >
                      Dashboard
                    </Link>
                    <div className="relative group cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-secondary to-primary p-[2px]">
                        <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Dropdown menu */}
                      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                        <div className="bg-card border border-border shadow-2xl rounded-2xl p-2 w-48 flex flex-col gap-1">
                          <div className="px-3 py-2 border-b border-border mb-1">
                            <p className="text-sm font-bold truncate">{user.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-accent transition-colors">
                            <User className="w-4 h-4 text-muted-foreground" /> Profile
                          </Link>
                          <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-accent transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Settings
                          </Link>
                          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-destructive/10 text-destructive transition-colors w-full text-left">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-ghost px-5 py-2 text-sm font-semibold rounded-full">
                      Log in
                    </Link>
                    <Link to="/register" className="btn btn-primary px-5 py-2 text-sm font-semibold rounded-full">
                      Sign up
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-card border-l border-border z-50 p-6 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-accent rounded-full text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search algorithms..." 
                  onClick={() => setGlobalSearchOpen(true)}
                  readOnly
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
                />
              </form>

              <div className="flex flex-col gap-2 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Menu</div>
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}

                <div className="my-6 border-t border-border" />

                {user ? (
                  <>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">Account</div>
                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'}`}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-destructive hover:bg-destructive/10 border border-transparent w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-3">
                    <Link to="/login" className="w-full py-3 rounded-xl border border-border text-center font-semibold hover:bg-accent transition-colors">
                      Log in
                    </Link>
                    <Link to="/register" className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-center font-bold hover:bg-primary/90 transition-colors">
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
