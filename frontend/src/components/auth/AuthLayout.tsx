import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthLayoutProps {
  initialMode?: 'login' | 'register';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden bg-background/95">
      {/* Dynamic Ambient Background Elements - Visible through glass card */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 via-purple-500/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Low-Opacity Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      {/* FLOATING FROSTED GLASS CARD HERO */}
      <div className="w-full max-w-[420px] mx-auto relative z-10 my-auto">
        {/* Glow halo behind glass card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/20 to-blue-500/30 rounded-[32px] blur-xl opacity-50 transition-all duration-300" />

        <div className="relative bg-white/[0.03] dark:bg-black/30 backdrop-blur-2xl border border-white/10 dark:border-white/10 rounded-[28px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden">
          
          {/* CARD HEADER */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-foreground/90 backdrop-blur-md shadow-inner mx-auto mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="tracking-wide">AlgoVis Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {mode === 'login' 
                ? 'Sign in to access your interactive learning environment' 
                : 'Join AlgoVis to start tracking your algorithm progress'}
            </p>
          </div>

          {/* MODE SWITCHER TABS */}
          <div className="grid grid-cols-2 bg-white/[0.03] dark:bg-white/[0.04] p-1 rounded-2xl border border-white/10 backdrop-blur-md mb-6">
            <button
              onClick={() => setMode('login')}
              className={`py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                mode === 'register'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* FAST & SMOOTH FORM TRANSITION (150ms) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
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
