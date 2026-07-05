import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: ReactNode;
  icon: ReactNode;
  colorClass: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-card backdrop-blur-md border border-border p-6 rounded-3xl relative overflow-hidden group hover:border-border transition-all hover:-translate-y-1 shadow-lg"
    >
      <div 
        className={`absolute -top-10 -right-10 w-32 h-32 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-500 ease-in-out`}
        style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)', color: colorClass.includes('yellow') ? '#eab308' : colorClass.includes('orange') ? '#f97316' : colorClass.includes('blue') ? '#3b82f6' : '#a855f7' }}
      />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 rounded-2xl bg-background/50 border border-border shadow-inner">
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-black tracking-tighter mb-1 text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
          {value}
        </h3>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
        <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-accent border border-border">
          {subtitle}
        </div>
      </div>
    </motion.div>
  );
};

interface AnimatedProgressRingProps {
  percentage: number;
  label: string;
  colorClass: string;
}

export const AnimatedProgressRing = ({
  percentage,
  label,
  colorClass,
}: AnimatedProgressRingProps) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <div 
          className={`absolute inset-0 opacity-10 rounded-full`} 
          style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)', color: colorClass.includes('yellow') ? '#eab308' : colorClass.includes('orange') ? '#f97316' : colorClass.includes('blue') ? '#3b82f6' : '#a855f7' }} 
        />
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] relative z-10">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-muted/20 dark:text-white/5"
          />
          <motion.circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export const ActivityHeatmap = () => {
  const weeks = 12;
  const days = 7;
  const grid = Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => (Math.random() > 0.4 ? Math.floor(Math.random() * 4) : 0)),
  );

  const colors = [
    'bg-accent border-border',
    'bg-primary/40 border-primary/20',
    'bg-primary/60 border-primary/30',
    'bg-primary border-primary/50',
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-4">
      <div className="flex gap-2 min-w-max">
        {grid.map((week, i) => (
          <div key={i} className="flex flex-col gap-2">
            {week.map((level, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 + j * 0.02, type: 'spring' }}
                className={`w-4 h-4 rounded-sm border ${colors[level]}`}
                title={`${level} activity`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground font-medium">
        <span>3 Months Ago</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            {colors.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm border ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
