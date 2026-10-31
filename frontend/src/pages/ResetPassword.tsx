import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [tokenInput, setTokenInput] = useState(token);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) {
      setError('Password reset token is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        token: tokenInput,
        newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-10 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/[0.03] dark:bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl overflow-hidden">
          
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Set New Password</h1>
            <p className="text-xs text-muted-foreground">
              Please enter your reset token and new password
            </p>
          </div>

          {success ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Password Reset Complete</h3>
                <p className="text-xs text-muted-foreground">
                  Your password has been updated. You can now log in with your new credentials.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-0.5">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste reset token here"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-0.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-0.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground pt-1">
                Remember your password?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
