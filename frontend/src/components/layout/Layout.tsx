import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatbotWidget } from './ChatbotWidget';
import { BackgroundParticles } from '../ui/BackgroundParticles';
import { GlobalSearch } from '../ui/GlobalSearch';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col text-foreground relative z-0 selection:bg-primary/30 transition-colors duration-300 bg-background font-sans">
      <BackgroundParticles />
      <Navbar />
      <GlobalSearch />
      <main className="flex-grow pt-16 relative z-10">
        {children}
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};
