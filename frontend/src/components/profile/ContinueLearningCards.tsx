import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2 } from 'lucide-react';

export interface ContinueLearningItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  actionText: string;
  link: string;
}

interface ContinueLearningCardsProps {
  items?: ContinueLearningItem[];
}

export const ContinueLearningCards = ({ items = [] }: ContinueLearningCardsProps) => {
  const navigate = useNavigate();

  const defaultItems: ContinueLearningItem[] = [
    {
      id: '1',
      title: 'Continue Graph Traversal',
      subtitle: 'Most Recently Viewed Topic',
      category: 'Graphs',
      actionText: 'Resume Visualizer',
      link: '/explore',
    },
    {
      id: '2',
      title: 'Resume Dijkstra Algorithm',
      subtitle: 'Last Unfinished Problem',
      category: 'Shortest Path',
      actionText: 'Resume Problem',
      link: '/practice',
    },
    {
      id: '3',
      title: 'Start Dynamic Programming',
      subtitle: 'Suggested Next Topic',
      category: 'DP & Tabulation',
      actionText: 'Start Lesson',
      link: '/explore',
    },
  ];

  const displayList = items.length >= 3 ? items.slice(0, 3) : defaultItems;

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('problem') || category.toLowerCase().includes('path')) {
      return Code2;
    }
    return BookOpen;
  };

  return (
    <div className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-foreground">Continue Learning</h2>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Up Next
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {displayList.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className="bg-background/60 border border-white/5 hover:border-purple-500/40 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {item.subtitle}
                  </span>
                  <span className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
