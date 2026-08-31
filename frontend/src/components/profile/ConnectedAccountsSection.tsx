import { motion } from 'framer-motion';
import {
  Globe,
  Code2,
  ExternalLink,
  Link2,
  Edit3,
  CheckCircle2,
  XCircle,
  Terminal,
} from 'lucide-react';

// Custom inline SVG icons for GitHub & LinkedIn
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ConnectedAccountsSectionProps {
  profile: any;
  onOpenEditModal: () => void;
}

export const ConnectedAccountsSection = ({ profile, onOpenEditModal }: ConnectedAccountsSectionProps) => {
  const platforms = [
    {
      name: 'GitHub',
      key: 'githubUrl',
      url: profile?.githubUrl,
      icon: GithubIcon,
      color: 'hover:text-purple-400 border-purple-500/20',
      description: 'Public code repositories & open source algorithm commits',
    },
    {
      name: 'LinkedIn',
      key: 'linkedinUrl',
      url: profile?.linkedinUrl,
      icon: LinkedinIcon,
      color: 'hover:text-blue-400 border-blue-500/20',
      description: 'Professional engineering network & career profile',
    },
    {
      name: 'LeetCode',
      key: 'leetcodeUrl',
      url: profile?.leetcodeUrl,
      icon: Code2,
      color: 'hover:text-amber-400 border-amber-500/20',
      description: 'Competitive programming & LeetCode rating sync',
    },
    {
      name: 'Codeforces',
      key: 'codeforcesUrl',
      url: profile?.codeforcesUrl,
      icon: Terminal,
      color: 'hover:text-rose-400 border-rose-500/20',
      description: 'Codeforces contest rating, rank & solved problems',
    },
    {
      name: 'CodeChef',
      key: 'codechefUrl',
      url: profile?.codechefUrl,
      icon: Terminal,
      color: 'hover:text-orange-400 border-orange-500/20',
      description: 'CodeChef star rating & division contest history',
    },
    {
      name: 'GeeksForGeeks',
      key: 'gfgUrl',
      url: profile?.gfgUrl,
      icon: Code2,
      color: 'hover:text-emerald-400 border-emerald-500/20',
      description: 'GeeksforGeeks practice score & coding streak',
    },
    {
      name: 'Portfolio Website',
      key: 'portfolioUrl',
      url: profile?.portfolioUrl,
      icon: Globe,
      color: 'hover:text-cyan-400 border-cyan-500/20',
      description: 'Personal software portfolio & project showcase',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <Link2 className="w-7 h-7 text-blue-400" />
            Connected Accounts & Coding Profiles
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Link your competitive programming handles, developer accounts, and personal portfolio
          </p>
        </div>

        <button
          onClick={onOpenEditModal}
          className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-purple-400" /> Manage Connections
        </button>
      </div>

      {/* Grid of 7 Connected Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map((platform, idx) => {
          const Icon = platform.icon;
          const isConnected = Boolean(platform.url);

          return (
            <motion.div
              key={platform.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`bg-background/60 backdrop-blur-md border rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 ${
                isConnected
                  ? 'border-white/15 hover:border-purple-500/50 shadow-lg'
                  : 'border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isConnected
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        : 'bg-white/5 border-white/10 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground">{platform.name}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
                      {isConnected ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-muted-foreground" /> Not Linked
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-muted-foreground line-clamp-2">
                {platform.description}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                {isConnected ? (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-primary hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    View Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={onOpenEditModal}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    + Add Link
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
