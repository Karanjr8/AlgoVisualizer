import { Link } from 'react-router-dom';
import { 
  FlaskConical, 
  Network, 
  Swords, 
  Activity, 
  PenTool, 
  GitBranch, 
  Gamepad2, 
  Code2 
} from 'lucide-react';

export const Playground = () => {
  const tools = [
    {
      title: "Algorithm Lab",
      description: "Free experimentation with every algorithm.",
      icon: <FlaskConical className="w-8 h-8 text-blue-500" />,
      color: "blue",
      to: "/playground/algorithm-lab",
    },
    {
      title: "Data Structure Builder",
      description: "Construct trees, graphs, heaps, tries and lists.",
      icon: <Network className="w-8 h-8 text-purple-500" />,
      color: "purple",
      to: "/playground/structure-builder",
    },
    {
      title: "Algorithm Arena",
      description: "Race multiple algorithms side by side.",
      icon: <Swords className="w-8 h-8 text-rose-500" />,
      color: "rose",
      to: "/playground/algorithm-arena",
    },
    {
      title: "Complexity Laboratory",
      description: "Visualize time and space complexity live.",
      icon: <Activity className="w-8 h-8 text-amber-500" />,
      color: "amber",
      to: "/playground/complexity-lab",
    },
    {
      title: "Input Studio",
      description: "Create custom arrays, graphs and trees.",
      icon: <PenTool className="w-8 h-8 text-emerald-500" />,
      color: "emerald",
      to: "/playground/input-studio",
    },
    {
      title: "What-If Simulator",
      description: "Change inputs and algorithm rules.",
      icon: <GitBranch className="w-8 h-8 text-cyan-500" />,
      color: "cyan",
      to: "/playground/what-if",
    },
    {
      title: "Become the Algorithm",
      description: "Control every pointer and operation manually.",
      icon: <Gamepad2 className="w-8 h-8 text-orange-500" />,
      color: "orange",
      to: "/playground/become-the-algorithm",
    },
    {
      title: "Code Explorer",
      description: "Watch code execute line by line with visualization.",
      icon: <Code2 className="w-8 h-8 text-zinc-400" />,
      color: "zinc",
      to: "/playground/code-explorer",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10",
    purple: "bg-purple-500/10",
    rose: "bg-rose-500/10",
    amber: "bg-amber-500/10",
    emerald: "bg-emerald-500/10",
    cyan: "bg-cyan-500/10",
    orange: "bg-orange-500/10",
    zinc: "bg-zinc-500/10",
  };

  return (
    <div className="w-full bg-background text-foreground min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase mb-2">
            <FlaskConical className="w-4 h-4" /> The Lab
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            PLAYGROUND
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-wide">
            Experiment. Build. Discover.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tools.map((tool, index) => (
            <Link 
              key={index} 
              to={tool.to}
              className="group relative p-8 bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/5 flex flex-col items-start gap-4"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[tool.color]} rounded-bl-[100px] transition-transform duration-500 group-hover:scale-150`} />
              
              <div className="p-4 bg-background rounded-2xl border border-border shadow-inner group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>
              
              <div className="space-y-2 mt-2 z-10">
                <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {tool.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
