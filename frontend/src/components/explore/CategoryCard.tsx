import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryProps {
  id: string;
  title: string;
  count: number;
  description: string;
  IconComponent: React.FC<{ isHovered: boolean }>;
  colorClass: string;
  delay?: number;
}

export const CategoryCard = ({ id, title, count, description, IconComponent, colorClass, delay = 0 }: CategoryProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Link 
        to={`/explore/${id}`}
        className="card-interactive block h-full bg-card backdrop-blur-md border border-border rounded-3xl p-6 relative overflow-hidden group"
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClass} opacity-20 group-hover:opacity-100 transition-opacity`} />
        
        <div className={`absolute -top-20 -right-20 w-40 h-40 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-in-out rounded-full`} style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)' }} />
        
        <div className="w-14 h-14 mb-6 p-2 rounded-2xl bg-background border border-border shadow-inner relative z-10 flex items-center justify-center">
          <IconComponent isHovered={isHovered} />
        </div>
        
        <h3 className="text-xl font-bold mb-1 relative z-10">{title}</h3>
        <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 mb-3 relative z-10 uppercase tracking-wider">{count} Topics</p>
        <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{description}</p>
      </Link>
    </motion.div>
  );
};
