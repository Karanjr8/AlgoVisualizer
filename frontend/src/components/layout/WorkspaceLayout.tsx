import { ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavLink {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface WorkspaceLayoutProps {
  leftPanel?: ReactNode;
  children: ReactNode;
  
  // Optional helper to automatically generate a table of contents on the left
  navLinks?: NavLink[];
}

export const WorkspaceLayout = ({ leftPanel, children, navLinks }: WorkspaceLayoutProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  // Auto-scroll tracking if navLinks are provided
  useEffect(() => {
    if (!navLinks || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting);
        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto bg-background text-foreground flex relative min-h-screen">
      
      {/* LEFT COLUMN - Sticky & Collapsable */}
      <aside 
        className={`hidden lg:flex flex-col border-border bg-card/10 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden custom-scrollbar transition-all duration-300 ease-in-out shrink-0
        ${isLeftCollapsed ? 'w-0 border-r-0 opacity-0' : 'w-[280px] xl:w-[320px] border-r opacity-100'}`}
      >
        <div className="w-[280px] xl:w-[320px]">
          <div className="flex justify-end p-4 pb-0">
            <button 
              onClick={() => setIsLeftCollapsed(true)} 
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {leftPanel ? leftPanel : navLinks ? (
              <>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6 px-3">Page Contents</h3>
                <nav className="flex flex-col gap-1.5">
                  {navLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className={`flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeSection === link.id 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {link.icon && (
                        <div className={`transition-colors ${activeSection === link.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                          {link.icon}
                        </div>
                      )}
                      {link.label}
                    </button>
                  ))}
                </nav>
              </>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Floating Expand Left Button */}
      {isLeftCollapsed && (
        <button 
          onClick={() => setIsLeftCollapsed(false)} 
          className="hidden lg:flex fixed left-0 top-24 z-40 p-2 bg-card border border-l-0 border-border rounded-r-xl shadow-md text-muted-foreground hover:text-primary hover:bg-accent transition-all"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* CENTER COLUMN (Flex-1) */}
      <main className="flex-1 w-full min-w-0 px-4 sm:px-6 md:px-10 lg:px-12 py-8 pb-32 overflow-x-hidden transition-all duration-300">
        <div className="max-w-6xl mx-auto w-full space-y-16">
          {children}
        </div>
      </main>

    </div>
  );
};
