import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GraduationCap, Code, Layout, Server, Layers, Cpu, Check } from 'lucide-react';

export interface RoleOption {
  id: string;
  name: string;
  tagline: string;
  icon: any;
}

export const ROLES: RoleOption[] = [
  {
    id: 'sde-intern',
    name: 'SDE Intern',
    tagline: 'Algorithms • Data Structures • CS Basics',
    icon: GraduationCap,
  },
  {
    id: 'sde-1',
    name: 'SDE 1',
    tagline: 'Core Coding • Problem Solving • Edge Cases',
    icon: Code,
  },
  {
    id: 'frontend-engineer',
    name: 'Frontend Engineer',
    tagline: 'React • JavaScript • UI Architecture',
    icon: Layout,
  },
  {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    tagline: 'APIs • Databases • Scalability',
    icon: Server,
  },
  {
    id: 'fullstack-engineer',
    name: 'Full Stack Engineer',
    tagline: 'Frontend + Backend Systems',
    icon: Layers,
  },
  {
    id: 'ds-specialist',
    name: 'Data Structures Specialist',
    tagline: 'Trees • Graphs • Dynamic Programming',
    icon: Cpu,
  },
];

interface RoleCardGroupProps {
  selectedRole: string;
  onSelectRole: (roleId: string) => void;
}

export const RoleCardGroup = ({ selectedRole, onSelectRole }: RoleCardGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          1. Select Target Role
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          Customizes question domain and interviewer focus area.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <motion.button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'relative p-4.5 rounded-2xl border text-left transition-all duration-150 flex items-center gap-4 cursor-pointer outline-none group',
                isSelected
                  ? 'bg-card border-primary shadow-md shadow-primary/10 ring-2 ring-primary/30'
                  : 'bg-card/60 border-border/70 hover:border-primary/40 hover:bg-card'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-xl shrink-0 transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                )}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {role.name}
                  </h3>
                  {isSelected && (
                    <span className="w-4.5 h-4.5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-semibold truncate">
                  {role.tagline}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
