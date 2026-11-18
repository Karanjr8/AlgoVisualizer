import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface ComplexitySliderProps {
  nVal: number;
  onChange: (val: number) => void;
  maxNRange: number;
  onMaxNRangeChange: (max: number) => void;
  minN?: number;
}

export const ComplexitySlider: React.FC<ComplexitySliderProps> = React.memo(({
  nVal,
  onChange,
  maxNRange,
  onMaxNRangeChange,
  minN = 1,
}) => {
  const [inputValue, setInputValue] = useState<string>(nVal.toString());

  // Synchronize internal input text when external nVal updates
  useEffect(() => {
    setInputValue(nVal.toString());
  }, [nVal]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= minN && parsed <= maxNRange) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    let parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < minN) {
      parsed = minN;
    } else if (parsed > maxNRange) {
      parsed = maxNRange;
    }
    setInputValue(parsed.toString());
    onChange(parsed);
  };

  const handlePresetClick = (presetVal: number) => {
    if (presetVal > maxNRange) {
      // automatically expand range if preset exceeds current max
      const newMax = presetVal > 1000 ? 10000 : presetVal > 100 ? 1000 : 100;
      onMaxNRangeChange(newMax);
    }
    onChange(presetVal);
  };

  // Slider progress percentage for CSS gradient fill
  const progressPercent = Math.min(
    100,
    Math.max(0, ((nVal - minN) / (maxNRange - minN)) * 100)
  );

  const presets = [
    { label: 'n = 5', val: 5 },
    { label: 'n = 10', val: 10 },
    { label: 'n = 20', val: 20 },
    { label: 'n = 50', val: 50 },
    { label: 'n = 100', val: 100 },
    { label: 'n = 500', val: 500 },
    { label: 'n = 1,000', val: 1000 },
  ];

  const ranges = [
    { label: '1 → 100', val: 100, desc: 'Ideal for Exponentials & Factorials' },
    { label: '1 → 1,000', val: 1000, desc: 'Polynomial & Logarithmic' },
    { label: '1 → 10,000', val: 10000, desc: 'Massive Dataset Scaling' },
  ];

  return (
    <div className="w-full bg-card/90 border border-border/80 p-5 sm:p-7 rounded-3xl shadow-lg space-y-6 text-foreground backdrop-blur-md">
      {/* HEADER & CURRENT N READOUT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="font-black text-base sm:text-lg text-foreground tracking-tight">
              Interactive Input Size Controller (n)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Drag the slider or enter an exact integer to observe real-time growth across all complexity curves.
          </p>
        </div>

        {/* CURRENT N BADGE & SYNCED NUMBER INPUT */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 bg-background/80 border border-border/80 px-3.5 py-2 rounded-2xl shadow-inner">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
              n =
            </span>
            <input
              type="number"
              min={minN}
              max={maxNRange}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-20 sm:w-24 bg-transparent font-mono font-black text-base sm:text-lg text-primary text-right focus:outline-none focus:ring-1 focus:ring-primary/40 rounded px-1"
            />
            <span className="text-xs font-semibold text-muted-foreground">items</span>
          </div>

          <button
            onClick={() => {
              onChange(10);
              onMaxNRangeChange(100);
            }}
            className="p-2.5 rounded-xl border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Reset to default n = 10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODERN DUAL-TRACK RANGE SLIDER */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <input
            type="range"
            min={minN}
            max={maxNRange}
            step="1"
            value={nVal}
            onChange={handleSliderChange}
            aria-label="Input Size Slider"
            className="w-full h-3 rounded-full appearance-none cursor-pointer bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercent}%, hsl(var(--muted)) ${progressPercent}%, hsl(var(--muted)) 100%)`,
            }}
          />
        </div>

        {/* MIN / MAX / INTERMEDIATE TICK MARKS */}
        <div className="flex justify-between items-center text-[11px] font-mono font-medium text-muted-foreground">
          <span>Min: {minN}</span>
          <span className="hidden sm:inline">Quarter: {Math.round(minN + 0.25 * (maxNRange - minN))}</span>
          <span>Mid: {Math.round(minN + 0.5 * (maxNRange - minN))}</span>
          <span className="hidden sm:inline">Three-Quarter: {Math.round(minN + 0.75 * (maxNRange - minN))}</span>
          <span>Max: {maxNRange.toLocaleString()}</span>
        </div>
      </div>

      {/* PRESETS & RANGE BOUND SELECTOR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-border/60">
        {/* QUICK PRESET BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Presets:
          </span>
          {presets.map((p) => {
            const isActive = nVal === p.val;
            return (
              <button
                key={p.val}
                onClick={() => handlePresetClick(p.val)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm font-bold'
                    : 'bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* MAX RANGE EXTENDER */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end text-xs">
          <span className="text-muted-foreground font-semibold">Slider Max:</span>
          <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/80">
            {ranges.map((r) => (
              <button
                key={r.val}
                onClick={() => {
                  onMaxNRangeChange(r.val);
                  if (nVal > r.val) onChange(r.val);
                }}
                title={r.desc}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  maxNRange === r.val
                    ? 'bg-card text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ComplexitySlider.displayName = 'ComplexitySlider';

