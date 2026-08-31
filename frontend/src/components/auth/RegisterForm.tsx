import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';
import axios from 'axios';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Password requirements calculation
  const requirements = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
  }, [password]);

  // Password strength calculation
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (requirements.length) score += 1;
    if (requirements.uppercase) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.number) score += 1;
    if (password.length >= 12) score += 1;
    return score;
  }, [password, requirements]);

  const strengthLabel = useMemo(() => {
    if (!password) return '';
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 4) return 'Medium';
    return 'Strong';
  }, [password, strengthScore]);

  const strengthColor = useMemo(() => {
    if (strengthLabel === 'Weak') return 'bg-rose-500 text-rose-400';
    if (strengthLabel === 'Medium') return 'bg-amber-500 text-amber-400';
    if (strengthLabel === 'Strong') return 'bg-emerald-500 text-emerald-400';
    return 'bg-muted text-muted-foreground';
  }, [strengthLabel]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    if (strengthScore < 3) {
      setError('Please choose a stronger password matching requirements.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const username = name.toLowerCase().replace(/\s+/g, '_');
      const response = await api.post('/auth/register', { username, email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setError(message || 'Failed to create account. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google Single Sign-On simulation. Sign up with standard email/password.');
  };

  return (
    <div className="space-y-4 text-left pt-2">
      {error && (
        <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold leading-relaxed">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Karan Sharma"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-medium transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Strength</span>
                <span className={`font-bold ${strengthColor.split(' ')[1]}`}>{strengthLabel}</span>
              </div>
              <div className="h-1 w-full bg-muted/60 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all duration-300 ${strengthScore >= 1 ? strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                <div className={`h-full flex-1 transition-all duration-300 ${strengthScore >= 3 ? strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                <div className={`h-full flex-1 transition-all duration-300 ${strengthScore >= 5 ? strengthColor.split(' ')[0] : 'bg-transparent'}`} />
              </div>

              <div className="grid grid-cols-2 gap-1 text-[10px] font-medium pt-0.5">
                <div className={`flex items-center gap-1 ${requirements.length ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                  {requirements.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${requirements.uppercase ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                  {requirements.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
                  <span>Uppercase</span>
                </div>
                <div className={`flex items-center gap-1 ${requirements.lowercase ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                  {requirements.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
                  <span>Lowercase</span>
                </div>
                <div className={`flex items-center gap-1 ${requirements.number ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                  {requirements.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-50" />}
                  <span>Number (0-9)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-background border text-sm font-medium transition-all focus:outline-none ${
                !passwordsMatch ? 'border-destructive focus:border-destructive' : 'border-border focus:ring-2 focus:ring-primary/40 focus:border-primary'
              }`}
            />
          </div>
          {!passwordsMatch && (
            <p className="text-[11px] text-destructive font-bold mt-1 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Passwords do not match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !passwordsMatch}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
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

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-border w-full" />
        <span className="bg-card px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground absolute">
          Or
        </span>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2.5 rounded-2xl bg-background hover:bg-muted/80 border border-border text-foreground font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
        </svg>
        Sign up with Google
      </button>

      {/* Switch to Login link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-bold text-primary hover:underline transition-all"
        >
          Sign in instead
        </button>
      </p>
    </div>
  );
};
