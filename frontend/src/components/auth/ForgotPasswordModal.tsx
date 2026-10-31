import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setSubmitted(false);
    setError('');
    setResetToken('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-md bg-white/[0.04] dark:bg-black/40 border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                onClick={handleReset}
                className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <div className="space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Reset Password</h3>
                      <p className="text-xs text-muted-foreground">Enter your email to receive recovery instructions</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-0.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Reset Link <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-5 text-center py-2">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-foreground">Check Your Inbox</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      We've generated recovery instructions for <strong className="text-foreground">{email}</strong>.
                    </p>
                    {resetToken && (
                      <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Dev Simulation Token:</p>
                        <p className="text-xs font-mono text-primary break-all">{resetToken}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-foreground font-bold text-sm transition-colors cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
