import { useNavigate } from 'react-router-dom';
import type { AlgorithmMeta } from '../../data/categories';
import { Play, Clock, HardDrive } from 'lucide-react';

interface Props {
  algorithm: AlgorithmMeta;
  colorClass: string;
  categoryId?: string;
}

export const AlgorithmCard = ({ algorithm, colorClass, categoryId }: Props) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (categoryId) {
      navigate(`/algorithms/${categoryId}/${algorithm.id}`);
    } else {
      navigate(`/algorithms/${algorithm.id}`);
    }
  };

  const difficultyColor = 
    algorithm.difficulty === 'Easy' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    algorithm.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
    'text-red-400 bg-red-400/10 border-red-400/20';

  return (
    <div 
      className="card-interactive bg-card border border-border backdrop-blur-md rounded-3xl p-6 flex flex-col group relative overflow-hidden h-full"
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-500 ease-in-out`} style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)' }} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-2xl font-bold tracking-tight">{algorithm.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${difficultyColor}`}>
          {algorithm.difficulty}
        </span>
      </div>

      <p className="text-muted-foreground mb-8 flex-1 relative z-10 leading-relaxed">
        {algorithm.description}
      </p>

      <div className="flex gap-3 mb-8 relative z-10 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-foreground bg-background/80 px-3 py-2 rounded-xl border border-border shadow-inner backdrop-blur-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-mono font-semibold">{algorithm.timeComplexity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground bg-background/80 px-3 py-2 rounded-xl border border-border shadow-inner backdrop-blur-sm">
          <HardDrive className="w-4 h-4 text-secondary" />
          <span className="font-mono font-semibold">{algorithm.spaceComplexity}</span>
        </div>
      </div>

      <button 
        onClick={handleStartLearning}
        className="btn btn-secondary w-full py-4 rounded-xl font-bold relative z-10"
      >
        <Play className="w-5 h-5 fill-current" /> Start Learning
      </button>
    </div>
  );
};
