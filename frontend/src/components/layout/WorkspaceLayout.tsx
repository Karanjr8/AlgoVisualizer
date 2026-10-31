import { ReactNode, useEffect, useState } from 'react';
import { AppSidebar, NavLinkItem } from './AppSidebar';

interface WorkspaceLayoutProps {
  leftPanel?: ReactNode;
  children: ReactNode;
  navLinks?: NavLinkItem[];
}

export const WorkspaceLayout = ({ children, navLinks }: WorkspaceLayoutProps) => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Auto-scroll tracking if navLinks are provided
  useEffect(() => {
    if (!navLinks || navLinks.length === 0) return;

    let rafId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting);
        if (visibleSections.length > 0) {
          const targetId = visibleSections[0].target.id;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            setActiveSection((prev) => (prev !== targetId ? targetId : prev));
          });
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: 0.1 }
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [navLinks]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto bg-background text-foreground flex relative min-h-screen">
      
      {/* FLOATING GLASSMOPHIC APP SIDEBAR (Fixed 64px layout slot, overlay expansion guarantees 0 content shift) */}
      <AppSidebar
        navLinks={navLinks}
        activeSection={activeSection}
        onSectionClick={scrollTo}
      />

      {/* CENTER MAIN COLUMN (Flex-1, Constant width and location) */}
      <main className="flex-1 w-full min-w-0 px-4 sm:px-6 md:px-10 lg:px-12 pt-6 sm:pt-8 pb-32 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto w-full space-y-16">
          {children}
        </div>
      </main>

    </div>
  );
};
