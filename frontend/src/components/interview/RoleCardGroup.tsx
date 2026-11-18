import { cn } from '../../lib/utils';
import {
  GraduationCap,
  Code,
  Layout,
  Server,
  Layers,
  Cpu,
  Database,
  Terminal,
  Check,
} from 'lucide-react';

export interface RoleOption {
  id: string;
  name: string;
  tagline: string;
  icon: any;
}

export const ROLES: RoleOption[] = [
  {
    id: 'sde',
    name: 'Software Development Engineer',
    tagline: 'Algorithms • OOP • Problem Solving • System Design',
    icon: Code,
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    tagline: 'Full Engineering Lifecycle • Clean Architecture',
    icon: Terminal,
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    tagline: 'JavaScript • React.js • Browser Internals • CSS/UI',
    icon: Layout,
  },
  {
    id: 'backend-dev',
    name: 'Backend Developer',
    tagline: 'APIs • Node.js • DBMS • Concurrency • Distributed Systems',
    icon: Server,
  },
  {
    id: 'fullstack-dev',
    name: 'Full Stack Developer',
    tagline: 'End-to-End Client & Server • Database Architecture',
    icon: Layers,
  },
  {
    id: 'database-dev',
    name: 'Database Developer',
    tagline: 'SQL • Indexing • ACID • Query Optimization • NoSQL',
    icon: Database,
  },
  {
    id: 'dsa-specialist',
    name: 'Data Structures and Algorithms',
    tagline: 'Trees • Graphs • Dynamic Programming • Asymptotic Proofs',
    icon: Cpu,
  },
  {
    id: 'sde-intern',
    name: 'SDE Intern',
    tagline: 'CS Fundamentals • Arrays • Strings • Problem Solving',
    icon: GraduationCap,
  },
];

interface RoleCardGroupProps {
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
}

export const RoleCardGroup = ({ selectedRole, onSelectRole }: RoleCardGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          Target Role
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Select your target engineering profile. Questions will strictly align with this technical domain.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={cn(
                'relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer outline-none group transform-gpu hover:-translate-y-[1px]',
                isSelected
                  ? 'bg-primary/5 border-primary/60 shadow-xs ring-1 ring-primary/40'
                  : 'bg-card border-border/80 hover:border-primary/40 hover:bg-card/90'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-xl shrink-0 transition-colors mt-0.5',
                  isSelected
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary text-muted-foreground group-hover:text-primary transition-colors'
                )}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {role.name}
                  </h3>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                  {role.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
