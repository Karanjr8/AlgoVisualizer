import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';
import axios from 'axios';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : undefined;
      setError(message || 'Failed to create account. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5 text-left pt-1">
      {error && (
        <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold leading-relaxed backdrop-blur-md animate-in fade-in duration-150">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name Glass Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-0.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Alex Johnson"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06] text-sm font-medium transition-all duration-150"
            />
          </div>
        </div>

        {/* Email Address Glass Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-0.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06] text-sm font-medium transition-all duration-150"
            />
          </div>
        </div>

        {/* Password Glass Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-0.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06] text-sm font-medium transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Glass Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 ml-0.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] backdrop-blur-md border text-foreground placeholder:text-muted-foreground/50 text-sm font-medium transition-all duration-150 focus:outline-none ${
                !passwordsMatch ? 'border-destructive focus:border-destructive' : 'border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06]'
              }`}
            />
          </div>
          {!passwordsMatch && (
            <p className="text-[10px] text-destructive font-semibold mt-1 flex items-center gap-1 ml-1">
              <ShieldAlert className="w-3 h-3" /> Passwords do not match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !passwordsMatch}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 hover:scale-[1.005] active:scale-[0.995] transition-all duration-150 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-bold text-primary hover:underline transition-all cursor-pointer"
        >
          Sign in instead
        </button>
      </p>
    </div>
  );
};
