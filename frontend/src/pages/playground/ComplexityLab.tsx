import { useState } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Activity, BarChart2, Calculator } from 'lucide-react';

interface ComplexityCurve {
  id: string;
  name: string;
  color: string;
  fn: (n: number) => number;
}

export const ComplexityLab = () => {
  // Slider N ranges from 10 to 10,000
  const [nVal, setNVal] = useState<number>(1000);
  const [selectedCurves, setSelectedCurves] = useState<string[]>(['o_1', 'o_log_n', 'o_n', 'o_n_log_n', 'o_n_2']);

  const curves: ComplexityCurve[] = [
    { id: 'o_1', name: 'O(1) Constant', color: '#10b981', fn: () => 1 },
    { id: 'o_log_n', name: 'O(log N) Logarithmic', color: '#06b6d4', fn: (n) => Math.log2(n || 1) },
    { id: 'o_n', name: 'O(N) Linear', color: '#3b82f6', fn: (n) => n },
    { id: 'o_n_log_n', name: 'O(N log N) Log-Linear', color: '#8b5cf6', fn: (n) => n * Math.log2(n || 1) },
    { id: 'o_n_2', name: 'O(N²) Quadratic', color: '#f43f5e', fn: (n) => n * n },
    { id: 'o_2_n', name: 'O(2ⁿ) Exponential', color: '#f59e0b', fn: (n) => Math.pow(2, Math.min(n, 30)) },
  ];

  const toggleCurve = (id: string) => {
    if (selectedCurves.includes(id)) {
      setSelectedCurves(selectedCurves.filter(c => c !== id));
    } else {
      setSelectedCurves([...selectedCurves, id]);
    }
  };

  const navLinks = [
    { id: 'complexity-lab', label: 'Complexity Laboratory', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-amber-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" /> Asymptotic Growth (N = 10 → 10,000)
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Complexity Laboratory
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Visualize how operation counts scale as dataset N grows from 10 to 10,000 elements. See why logarithmic and log-linear algorithms dramatically outperform quadratic growth.
              </p>
            </div>
          </div>
        </section>

        {/* CONTROLS SECTION */}
        <section className="w-full bg-card/80 border border-border/80 p-6 rounded-3xl shadow-lg space-y-6">
          
          {/* Input Size Slider (N = 10 to 10,000) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-2 text-foreground font-black text-sm">
                <Calculator className="w-4 h-4 text-amber-400" /> Input Size N
              </span>
              <span className="text-amber-400 font-black text-lg font-mono">N = {nVal.toLocaleString()} elements</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="10000" 
              step="10"
              value={nVal} 
              onChange={(e) => setNVal(parseInt(e.target.value))}
              className="w-full cursor-pointer accent-amber-400 h-2.5 bg-muted rounded-full appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>N = 10</span>
              <span>N = 1,000</span>
              <span>N = 5,000</span>
              <span>N = 10,000</span>
            </div>
          </div>

          {/* Curve Overlay Toggles */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-bold text-muted-foreground uppercase">Theoretical Curves Overlay</label>
            <div className="flex flex-wrap gap-2">
              {curves.map(curve => (
                <button
                  key={curve.id}
                  onClick={() => toggleCurve(curve.id)}
                  style={{ borderColor: selectedCurves.includes(curve.id) ? curve.color : 'transparent' }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedCurves.includes(curve.id) ? 'bg-card text-foreground shadow-sm' : 'bg-background/50 text-muted-foreground opacity-60'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full inline-block mr-1.5" style={{ backgroundColor: curve.color }} />
                  {curve.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRAPHING CANVAS & REAL-TIME OPERATION COUNTER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SVG Growth Plotter Canvas */}
          <div className="lg:col-span-8 bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-base text-foreground">Asymptotic Growth Plot (N = {nVal.toLocaleString()})</h3>
              </div>
            </div>

            {/* SVG Plot Area */}
            <div className="w-full h-[320px] relative bg-background/50 border border-border/60 rounded-2xl p-4 overflow-hidden flex items-end">
              <svg className="w-full h-full overflow-visible">
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

                {/* Plot curves */}
                {curves.filter(c => selectedCurves.includes(c.id)).map(curve => {
                  const points = Array.from({ length: 50 }, (_, i) => Math.max(10, Math.floor(((i + 1) / 50) * nVal))).map(n => {
                    const val = curve.fn(n);
                    const maxValCalculated = curve.fn(nVal) || 1;
                    const xPct = (n / nVal) * 100;
                    const yPct = 100 - Math.min(100, (val / (maxValCalculated || 1)) * 90);
                    return `${xPct}%,${yPct}%`;
                  }).join(' ');

                  return (
                    <polyline
                      key={curve.id}
                      fill="none"
                      stroke={curve.color}
                      strokeWidth="3"
                      points={points}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* REAL-TIME OPERATION COUNTER TABLE */}
          <div className="lg:col-span-4 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Calculator className="w-4 h-4 text-amber-400" />
              <h3 className="font-black text-base text-foreground">Estimated Ops for N = {nVal.toLocaleString()}</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {curves.map(c => {
                const ops = Math.round(c.fn(nVal));
                return (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-background/80 border border-border/60 rounded-xl">
                    <span className="font-bold text-xs" style={{ color: c.color }}>{c.name.split(' ')[0]}</span>
                    <span className="font-black text-foreground text-sm">
                      {ops > 100000000 ? '∞ (Overflow)' : ops.toLocaleString()} ops
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </div>
    </WorkspaceLayout>
  );
};
