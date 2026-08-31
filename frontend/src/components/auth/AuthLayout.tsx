import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Bot, Layers } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthLayoutProps {
  initialMode?: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const badges = [
    { label: '50+ Algorithms', icon: <Layers className="w-3 h-3 text-purple-400" /> },
    { label: 'Interactive Visualizers', icon: <BrainCircuit className="w-3 h-3 text-blue-400" /> },
    { label: 'AI Simulator', icon: <Bot className="w-3 h-3 text-emerald-400" /> },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden bg-background">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle Low-Opacity Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* SINGLE CENTERED AUTHENTICATION CARD */}
      <div className="w-full max-w-md mx-auto relative z-10 my-auto">
        <div className="bg-card/90 backdrop-blur-2xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* CARD HEADER: LOGO, HEADLINE, SUBHEADING */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary type-badge mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AlgoVis Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Master Algorithms{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
                Visually
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Continue your learning journey.
            </p>

            {/* COMPACT BADGES */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/60 text-[10px] font-bold text-foreground"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* MODE SWITCHER TABS */}
          <div className="flex bg-muted/60 p-1.5 rounded-2xl border border-border/60 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-card text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-card text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* MODE CONTENT WITH INSTANT ANIMATION */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {mode === 'login' ? (
                <LoginForm
                  onForgotPasswordClick={() => setIsForgotModalOpen(true)}
                  onSwitchToRegister={() => setMode('register')}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setMode('login')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
