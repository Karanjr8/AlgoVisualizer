import { useState } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { 
  PenTool, 
  Copy, 
  Send, 
  Network, 
  FolderTree, 
  Layers, 
  Check
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useNavigate } from 'react-router-dom';
import { generateElements } from '../../lib/utils';

type GeneratorType = 'array' | 'tree' | 'graph';

export const InputStudio = () => {
  const [genType, setGenType] = useState<GeneratorType>('array');
  const [copied, setCopied] = useState(false);
  
  // Array Generator State (Default 10 elements)
  const [arrayPreset, setArrayPreset] = useState<string>('random');
  const [arraySize, setArraySize] = useState<number>(10);
  const [array, setArray] = useState<number[]>([42, 18, 85, 29, 63, 37, 91, 14, 76, 52]);

  // Tree Generator State
  const [treeType, setTreeType] = useState<string>('balanced');
  const [treeNodes, setTreeNodes] = useState<number[]>([50, 25, 75, 12, 37, 62, 87]);

  // Graph Generator State
  const [graphType, setGraphType] = useState<string>('sparse');

  const setInitialElements = useVisualizerStore(state => state.setInitialElements);
  const navigate = useNavigate();

  const generateNewArray = (type: string, size: number) => {
    setArrayPreset(type);
    let arr: number[] = [];
    if (type === 'sorted') {
      arr = Array.from({ length: size }, (_, i) => (i + 1) * 8);
    } else if (type === 'reverse') {
      arr = Array.from({ length: size }, (_, i) => (size - i) * 8);
    } else if (type === 'nearly-sorted') {
      arr = Array.from({ length: size }, (_, i) => (i + 1) * 8);
      if (arr.length > 3) {
        const temp = arr[1];
        arr[1] = arr[arr.length - 2];
        arr[arr.length - 2] = temp;
      }
    } else if (type === 'duplicate-heavy') {
      const bases = [12, 28, 55, 80];
      arr = Array.from({ length: size }, () => bases[Math.floor(Math.random() * bases.length)]);
    } else {
      arr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    }
    setArray(arr);
  };

  const generateNewTree = (type: string) => {
    setTreeType(type);
    if (type === 'skewed') {
      setTreeNodes([10, 20, 30, 40, 50, 60, 70]);
    } else if (type === 'random') {
      setTreeNodes(Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10));
    } else {
      setTreeNodes([50, 25, 75, 12, 37, 62, 87]);
    }
  };

  const handleCopyJSON = () => {
    const payload = genType === 'array' ? array : genType === 'tree' ? treeNodes : { type: graphType, nodes: 6 };
    navigator.clipboard.writeText(JSON.stringify(payload));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportToLab = () => {
    const payload = genType === 'array' ? array : treeNodes;
    setInitialElements(generateElements(payload.length, 'custom', payload));
    navigate('/playground/algorithm-lab');
  };

  const maxVal = Math.max(...array, 100);

  const navLinks = [
    { id: 'input-studio', label: 'Input Studio', icon: <PenTool className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-emerald-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                <PenTool className="w-3.5 h-3.5" /> Tailored Data Generation Factory
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Input Studio
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Generate custom test cases for Arrays, Trees, and Graphs. Visual preview canvas allows inspecting dataset distributions before exporting directly to visualizers.
              </p>
            </div>
          </div>
        </section>

        {/* GENERATOR TYPE TABS */}
        <section className="w-full bg-card/80 border border-border/80 p-1.5 rounded-2xl shadow-md grid grid-cols-3 gap-2">
          {[
            { id: 'array', name: 'Array Generator', icon: <Layers className="w-4 h-4" /> },
            { id: 'tree', name: 'Tree Generator', icon: <FolderTree className="w-4 h-4" /> },
            { id: 'graph', name: 'Graph Generator', icon: <Network className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setGenType(tab.id as GeneratorType)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${genType === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </section>

        {/* CONTROLS & PREVIEW WORKSPACE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-4 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-6">
            
            {/* ARRAY GENERATOR */}
            {genType === 'array' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Array Distribution</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'random', name: 'Random' },
                      { id: 'sorted', name: 'Sorted' },
                      { id: 'reverse', name: 'Reverse' },
                      { id: 'nearly-sorted', name: 'Nearly Sorted' },
                      { id: 'duplicate-heavy', name: 'Duplicates' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => generateNewArray(p.id, arraySize)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${arrayPreset === p.id ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
                    <span>Array Size N</span>
                    <span className="text-emerald-400 font-black">{arraySize}</span>
                  </div>
                  <input
                    type="range"
                    min="8" max="12"
                    value={arraySize}
                    onChange={(e) => { const s = parseInt(e.target.value); setArraySize(s); generateNewArray(arrayPreset, s); }}
                    className="w-full cursor-pointer accent-emerald-400 h-2 bg-muted rounded-full appearance-none"
                  />
                </div>
              </div>
            )}

            {/* TREE GENERATOR */}
            {genType === 'tree' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Tree Topology</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'balanced', name: 'Balanced BST' },
                      { id: 'skewed', name: 'Skewed Tree (Worst Case)' },
                      { id: 'random', name: 'Random BST' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => generateNewTree(t.id)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${treeType === t.id ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GRAPH GENERATOR */}
            {genType === 'graph' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Graph Topology</label>
                  <select value={graphType} onChange={(e) => setGraphType(e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 text-xs font-bold">
                    <option value="sparse">Sparse Graph (Low Edge Density)</option>
                    <option value="dense">Dense Graph (High Edge Count)</option>
                    <option value="dag">DAG (Directed Acyclic Graph)</option>
                    <option value="weighted">Weighted Network Graph</option>
                  </select>
                </div>
              </div>
            )}

            {/* Export Actions */}
            <div className="pt-4 border-t border-border/60 space-y-2">
              <button onClick={handleExportToLab} className="w-full p-3.5 bg-primary text-primary-foreground font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer">
                <Send className="w-4 h-4" /> Send to Algorithm Lab
              </button>
              <button onClick={handleCopyJSON} className="w-full p-3 bg-secondary text-secondary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-secondary/80 cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied JSON!' : 'Copy Raw Data JSON'}
              </button>
            </div>

          </div>

          {/* Live Preview Canvas */}
          <div className="lg:col-span-8 bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[420px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">Visual Data Distribution Preview</label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {genType === 'array' ? `Length: ${array.length}` : genType === 'tree' ? `Nodes: ${treeNodes.length}` : `Topology: ${graphType}`}
              </span>
            </div>

            <div className="flex-1 w-full flex items-end justify-center gap-2.5 p-6 min-h-[300px]">
              {genType === 'array' && array.map((val, idx) => {
                const heightPct = (val / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[11px] font-mono font-bold text-foreground">
                      {val}
                    </span>
                    <div 
                      style={{ height: `${Math.max(heightPct, 15)}%` }} 
                      className="w-full bg-gradient-to-t from-emerald-500/80 to-teal-400 rounded-t-xl transition-all duration-300 shadow-md group-hover:brightness-125" 
                    />
                    <span className="text-[10px] font-mono text-muted-foreground">[{idx}]</span>
                  </div>
                );
              })}

              {genType === 'tree' && (
                <div className="w-full flex flex-wrap items-center justify-center gap-3 my-auto">
                  {treeNodes.map((val, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-foreground font-black text-sm flex items-center justify-center shadow-md">
                      {val}
                    </div>
                  ))}
                </div>
              )}

              {genType === 'graph' && (
                <div className="w-full flex flex-col items-center justify-center text-center my-auto space-y-2">
                  <Network className="w-12 h-12 text-emerald-400 animate-pulse" />
                  <div className="text-xs font-bold text-foreground uppercase">{graphType} Adjacency Matrix Generated</div>
                </div>
              )}
            </div>
          </div>

        </section>

      </div>
    </WorkspaceLayout>
  );
};
