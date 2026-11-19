import React from 'react';
import { cn } from '../../lib/utils';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

interface TimePressureSelectorProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  seconds: number;
  onSelectSeconds: (seconds: number) => void;
}

export const TimePressureSelector: React.FC<TimePressureSelectorProps> = ({
  enabled,
  onToggle,
  seconds,
  onSelectSeconds,
}) => {
  const presets = [
    { label: '30s', val: 30, desc: 'Rapid-fire lightning answers' },
    { label: '60s', val: 60, desc: 'Quick concise technical summary' },
    { label: '90s', val: 90, desc: 'Balanced reasoning with complexity' },
    { label: '120s', val: 120, desc: 'Deep thorough architectural explanation' },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Time Pressure Mode
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {enabled ? `${seconds}s Active` : 'Untimed'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Simulate high-pressure live technical screening. When active, each question has an individual countdown timer that auto-submits upon expiration.
        </p>
      </div>

      <div
        className={cn(
          'p-4 rounded-2xl border transition-all duration-150 flex flex-col gap-4',
          enabled
            ? 'bg-card border-primary/40 shadow-xs'
            : 'bg-card/60 border-border/70 hover:border-border'
        )}
      >
        {/* Toggle header */}
        <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => onToggle(!enabled)}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'p-2.5 rounded-xl shrink-0 transition-colors',
                enabled
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Enable Time Pressure Mode
              </h3>
              <p className="text-xs text-muted-foreground">
                {enabled
                  ? `Candidates must submit within ${seconds} seconds per question.`
                  : 'Untimed mode: answer comfortably without a countdown pressure.'}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 flex items-center cursor-pointer',
              enabled ? 'bg-primary' : 'bg-secondary border border-border/80'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full bg-white shadow-xs transition-transform',
                enabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </div>
        </div>

        {/* Preset Buttons (visible when enabled) */}
        {enabled && (
          <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Select Time Limit Per Question:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map((p) => {
                const isSelected = seconds === p.val;
                return (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => onSelectSeconds(p.val)}
                    className={cn(
                      'p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs font-black'
                        : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/80 font-bold'
                    )}
                  >
                    <span className="text-sm font-mono">{p.label}</span>
                    <span className="text-[10px] opacity-80 truncate max-w-full">
                      {p.desc.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-500 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Timer will automatically start when each question is presented. On timeout, unsubmitted answers will be submitted automatically.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

