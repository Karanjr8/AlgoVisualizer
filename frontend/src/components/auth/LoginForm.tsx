import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Compass } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';
import axios from 'axios';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPasswordClick, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      
      // Redirect based on role if admin
      if (response.data.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string } | undefined)?.error
        : undefined;
      setError(message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Quick demonstration login simulation for dev testing
    setEmail('dev@test.com');
    setPassword('password123');
  };

  return (
    <div className="space-y-4 text-left pt-1">
      {error && (
        <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold leading-relaxed backdrop-blur-md animate-in fade-in duration-150">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Email Glass Input Field */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ml-0.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoFocus
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

        {/* Password Glass Input Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-0.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-[11px] font-semibold text-primary hover:underline transition-all cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 hover:scale-[1.005] active:scale-[0.995] transition-all duration-150 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-1"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-background/80 backdrop-blur-sm px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground absolute rounded-full border border-white/5">
          Or
        </span>
      </div>

      {/* Social Login & Guest Option */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-foreground font-semibold text-xs flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
          </svg>
          Continue with Demo Account
        </button>

        <Link
          to="/explore"
          className="w-full py-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-muted-foreground hover:text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-150"
        >
          <Compass className="w-3.5 h-3.5 text-primary" /> Explore as Guest
        </Link>
      </div>

      {/* Switch to Register link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="font-bold text-primary hover:underline transition-all cursor-pointer"
        >
          Create account
        </button>
      </p>
    </div>
  );
};
