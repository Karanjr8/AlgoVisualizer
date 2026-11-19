import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  COMPLEXITY_DEFINITIONS,
  ComplexityId,
  formatOperations,
  formatFromLog10,
  toSuperscript,
} from '../../../lib/complexityMath';
import { Layers, Eye, EyeOff, ZoomIn } from 'lucide-react';

interface ComplexityGraphProps {
  nVal: number;
  onNValChange?: (n: number) => void;
  selectedCurves: ComplexityId[];
  onToggleCurve: (id: ComplexityId) => void;
  highlightedComplexity?: ComplexityId | null;
  onSelectComplexity?: (id: ComplexityId) => void;
  maxNRange: number;
}

export type ScaleType = 'logarithmic' | 'linear';

export const ComplexityGraph: React.FC<ComplexityGraphProps> = React.memo(({
  nVal,
  onNValChange,
  selectedCurves,
  onToggleCurve,
  highlightedComplexity,
  onSelectComplexity,
  maxNRange,
}) => {
  const [scale, setScale] = useState<ScaleType>('logarithmic');
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafId = useRef<number | null>(null);

  // SVG viewBox coordinates
  const width = 940;
  const height = 480;
  const margin = { top: 35, right: 45, bottom: 55, left: 85 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // STABLE X DOMAIN: decoupled from nVal so moving slider does NOT re-scale axes or re-compute paths
  const minDomainX = 1;
  const maxDomainX = maxNRange;

  // STABLE Y DOMAINS: computed based on maxDomainX and scale, NOT fluctuating with nVal
  const { maxLogY, linearMaxY } = useMemo(() => {
    const activeDefs = COMPLEXITY_DEFINITIONS.filter((c) => selectedCurves.includes(c.id));
    if (activeDefs.length === 0) {
      return { maxLogY: 10, linearMaxY: 1000 };
    }

    let calculatedMaxLog = 2;
    activeDefs.forEach((c) => {
      const logVal = c.log10Calc(maxDomainX);
      if (logVal > calculatedMaxLog) calculatedMaxLog = logVal;
    });

    const clampedMaxLog = Math.min(30, Math.max(4, Math.ceil(calculatedMaxLog * 1.05)));

    // Stable linear anchor based on maxDomainX
    let linAnchor = 100;
    activeDefs.forEach((c) => {
      if (c.id === 'o_2_n' || c.id === 'o_n_fact') {
        // Capped anchor for exponentials in linear mode so it doesn't break canvas
        linAnchor = Math.max(linAnchor, c.calc(Math.min(maxDomainX, 16)));
      } else if (c.id === 'o_n_3') {
        linAnchor = Math.max(linAnchor, c.calc(Math.min(maxDomainX, 40)));
      } else {
        linAnchor = Math.max(linAnchor, c.calc(Math.min(maxDomainX, 100)));
      }
    });

    const clampedMaxLin = Math.max(100, Math.min(2e6, linAnchor * 1.15));

    return { maxLogY: clampedMaxLog, linearMaxY: clampedMaxLin };
  }, [selectedCurves, maxDomainX]);

  // Coordinate transforms (lightweight pure math)
  const getXCoord = useCallback((n: number) => {
    const fraction = (n - minDomainX) / (maxDomainX - minDomainX || 1);
    return margin.left + Math.max(0, Math.min(1, fraction)) * innerWidth;
  }, [minDomainX, maxDomainX, innerWidth, margin.left]);

  const getYCoord = useCallback((val: number, logVal: number) => {
    if (scale === 'logarithmic') {
      const clampedLog = Math.max(0, Math.min(maxLogY, logVal));
      const fraction = clampedLog / (maxLogY || 1);
      return margin.top + innerHeight - fraction * innerHeight;
    } else {
      const clampedVal = Math.max(0, Math.min(linearMaxY, val));
      const fraction = clampedVal / (linearMaxY || 1);
      return margin.top + innerHeight - fraction * innerHeight;
    }
  }, [scale, maxLogY, linearMaxY, innerHeight, margin.top]);

  // Cache rect on mouse enter or scroll to avoid getBoundingClientRect layout thrashing
  const updateRect = () => {
    if (svgRef.current) {
      rectRef.current = svgRef.current.getBoundingClientRect();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseEnter = () => {
    updateRect();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!rectRef.current) {
      updateRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (svgX >= margin.left && svgX <= width - margin.right) {
        const fraction = (svgX - margin.left) / innerWidth;
        const computedN = Math.round(minDomainX + fraction * (maxDomainX - minDomainX));
        setHoverX(Math.max(minDomainX, Math.min(maxDomainX, computedN)));
      } else {
        setHoverX(null);
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setHoverX(null);
    rectRef.current = null;
  };

  const handleSvgClick = () => {
    if (hoverX !== null && onNValChange) {
      onNValChange(hoverX);
    }
  };

  const currentInspectedN = hoverX !== null ? hoverX : nVal;

  // STABLE CURVE PATHS: Computed ONCE for the domain and scale
  // ZERO recalculations when scrubbing or moving slider!
  const curvePaths = useMemo(() => {
    const sampleCount = 75;
    const steps: number[] = [];
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      const n = Math.round(minDomainX + t * (maxDomainX - minDomainX));
      if (steps.length === 0 || steps[steps.length - 1] !== n) {
        steps.push(n);
      }
    }

    return COMPLEXITY_DEFINITIONS.map((curve) => {
      let pathD = '';
      let hasStarted = false;

      for (let i = 0; i < steps.length; i++) {
        const n = steps[i];
        const val = curve.calc(n);
        const logVal = curve.log10Calc(n);
        const x = getXCoord(n);
        const y = getYCoord(val, logVal);

        if (!hasStarted) {
          pathD += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
          hasStarted = true;
        } else {
          pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
      }

      return {
        id: curve.id,
        notation: curve.notation,
        name: curve.name,
        growthType: curve.growthType,
        color: curve.color,
        calc: curve.calc,
        log10Calc: curve.log10Calc,
        pathD,
      };
    });
  }, [minDomainX, maxDomainX, getXCoord, getYCoord]);

  // STABLE X-AXIS TICKS
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    const count = 6;
    for (let i = 0; i <= count; i++) {
      const val = Math.round(minDomainX + (i / count) * (maxDomainX - minDomainX));
      if (!ticks.includes(val)) {
        ticks.push(val);
      }
    }
    return ticks;
  }, [minDomainX, maxDomainX]);

  // STABLE Y-AXIS TICKS
  const yTicks = useMemo(() => {
    if (scale === 'logarithmic') {
      const ticks: { val: number; label: string; y: number }[] = [];
      const step = Math.max(1, Math.floor(maxLogY / 6));
      for (let exp = 0; exp <= maxLogY; exp += step) {
        const y = margin.top + innerHeight - (exp / (maxLogY || 1)) * innerHeight;
        let label = `10${toSuperscript(exp)}`;
        if (exp === 0) label = '1';
        if (exp === 1) label = '10';
        if (exp === 2) label = '100';
        if (exp === 3) label = '1K';
        if (exp === 6) label = '1M';
        if (exp === 9) label = '1B';
        ticks.push({ val: exp, label, y });
      }
      return ticks;
    } else {
      const ticks: { val: number; label: string; y: number }[] = [];
      const count = 5;
      for (let i = 0; i <= count; i++) {
        const val = Math.round((i / count) * linearMaxY);
        const y = margin.top + innerHeight - (i / count) * innerHeight;
        ticks.push({ val, label: formatOperations(val), y });
      }
      return ticks;
    }
  }, [scale, maxLogY, linearMaxY, innerHeight, margin.top]);

  // Current marker X position (instant math: 1 arithmetic line)
  const markerX = getXCoord(currentInspectedN);

  return (
    <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 text-foreground relative overflow-hidden backdrop-blur-md">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="font-black text-lg sm:text-xl text-foreground tracking-tight">
              Theoretical Time Complexity Curves
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Asymptotic mathematical growth comparison. Selected input size{' '}
            <span className="font-mono font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
              n = {currentInspectedN}
            </span>
          </p>
        </div>

        {/* SCALE SWITCHER */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="inline-flex items-center p-1 bg-muted/60 rounded-xl border border-border/80 text-xs font-semibold">
            <button
              onClick={() => setScale('logarithmic')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                scale === 'logarithmic'
                  ? 'bg-card text-foreground shadow-sm font-bold border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Logarithmic scale permits viewing O(1) through O(n!) together without distortion"
            >
              <ZoomIn className="w-3.5 h-3.5 text-primary" />
              <span>Log Scale (log₁₀)</span>
            </button>
            <button
              onClick={() => setScale('linear')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                scale === 'linear'
                  ? 'bg-card text-foreground shadow-sm font-bold border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Linear scale shows direct proportional steepness"
            >
              <Layers className="w-3.5 h-3.5 text-secondary" />
              <span>Linear Scale</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG INTERACTIVE GRAPH CANVAS */}
      <div className="w-full relative bg-background/60 border border-border/70 rounded-2xl p-2 sm:p-4 overflow-hidden select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleSvgClick}
        >
          {/* Plot Background Area */}
          <rect
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="currentColor"
            fillOpacity="0.02"
            rx="8"
            className="text-foreground"
          />

          {/* HORIZONTAL Y-GRID LINES & LABELS */}
          {yTicks.map((tick, idx) => (
            <g key={`y-tick-${idx}`}>
              <line
                x1={margin.left}
                y1={tick.y}
                x2={margin.left + innerWidth}
                y2={tick.y}
                stroke="currentColor"
                strokeOpacity={idx === 0 ? '0.2' : '0.07'}
                strokeDasharray={idx === 0 ? undefined : '4 4'}
                className="text-foreground"
              />
              <text
                x={margin.left - 12}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[11px] font-mono font-medium"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* VERTICAL X-GRID LINES & LABELS */}
          {xTicks.map((val, idx) => {
            const x = getXCoord(val);
            return (
              <g key={`x-tick-${idx}`}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + innerHeight}
                  stroke="currentColor"
                  strokeOpacity="0.07"
                  strokeDasharray="4 4"
                  className="text-foreground"
                />
                <text
                  x={x}
                  y={margin.top + innerHeight + 20}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px] font-mono font-medium"
                >
                  n = {val}
                </text>
              </g>
            );
          })}

          {/* AXIS LABELS */}
          <text
            x={margin.left + innerWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="fill-foreground text-xs font-bold tracking-wider uppercase opacity-80"
          >
            Input Size (n) →
          </text>
          <text
            x={-(margin.top + innerHeight / 2)}
            y={22}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-foreground text-xs font-bold tracking-wider uppercase opacity-80"
          >
            {scale === 'logarithmic' ? 'Log₁₀ Operations (Orders of Magnitude)' : 'Estimated Operations'}
          </text>

          {/* RENDER COMPLEXITY CURVES */}
          {curvePaths.map((curve) => {
            const isSelected = selectedCurves.includes(curve.id);
            if (!isSelected) return null;

            const isHighlighted = highlightedComplexity === curve.id;
            const isFaded = highlightedComplexity !== null && !isHighlighted;

            // Point on curve at currentInspectedN (lightweight calculation)
            const rawVal = curve.calc(currentInspectedN);
            const logVal = curve.log10Calc(currentInspectedN);
            const ptY = getYCoord(rawVal, logVal);
            const isOverflow = scale === 'linear' && rawVal > linearMaxY;

            return (
              <g
                key={curve.id}
                style={{ opacity: isFaded ? 0.28 : 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComplexity?.(curve.id);
                }}
              >
                {/* Backing highlight stroke (hardware accelerated, no expensive SVG blur filters) */}
                {isHighlighted && (
                  <path
                    d={curve.pathD}
                    fill="none"
                    stroke={curve.color}
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Main Curve Line */}
                <path
                  d={curve.pathD}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={isHighlighted ? 3.5 : 2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                />

                {/* Point on curve at currentInspectedN */}
                {!isOverflow && (
                  <g>
                    <circle
                      cx={markerX}
                      cy={ptY}
                      r={isHighlighted ? 6.5 : 4.5}
                      fill={curve.color}
                      stroke="#ffffff"
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                    />
                    {isHighlighted && (
                      <circle
                        cx={markerX}
                        cy={ptY}
                        r="11"
                        fill="none"
                        stroke={curve.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* VERTICAL MARKER LINE AT SELECTED INPUT SIZE */}
          <g>
            <line
              x1={markerX}
              y1={margin.top}
              x2={markerX}
              y2={margin.top + innerHeight}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <rect
              x={markerX - 34}
              y={margin.top + innerHeight + 6}
              width="68"
              height="22"
              rx="6"
              fill="hsl(var(--primary))"
            />
            <text
              x={markerX}
              y={margin.top + innerHeight + 21}
              textAnchor="middle"
              className="fill-primary-foreground font-mono font-black text-[11px]"
            >
              n = {currentInspectedN}
            </text>
          </g>
        </svg>

        {/* FLOATING SCRUB TOOLTIP */}
        {hoverX !== null && (
          <div className="absolute top-4 right-4 pointer-events-none bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-3 z-20 min-w-[190px] text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-1 font-sans">
              <span className="font-bold text-foreground">Scrub Inspector</span>
              <span className="font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                n = {hoverX}
              </span>
            </div>
            <div className="space-y-1">
              {COMPLEXITY_DEFINITIONS.filter((c) => selectedCurves.includes(c.id)).map((c) => {
                const ops = scale === 'logarithmic'
                  ? formatFromLog10(c.log10Calc(hoverX))
                  : formatOperations(c.calc(hoverX));

                return (
                  <div key={c.id} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold" style={{ color: c.color }}>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                      {c.notation}
                    </span>
                    <span className="font-bold text-foreground">{ops} ops</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE LEGEND */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> Active Complexity Curves
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                COMPLEXITY_DEFINITIONS.forEach((c) => {
                  if (!selectedCurves.includes(c.id)) onToggleCurve(c.id);
                });
              }}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-muted-foreground text-xs">•</span>
            <button
              onClick={() => {
                const standard = ['o_1', 'o_log_n', 'o_n', 'o_n_log_n', 'o_n_2'];
                COMPLEXITY_DEFINITIONS.forEach((c) => {
                  const shouldHave = standard.includes(c.id);
                  const currentlyHas = selectedCurves.includes(c.id);
                  if (shouldHave !== currentlyHas) onToggleCurve(c.id);
                });
              }}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {COMPLEXITY_DEFINITIONS.map((curve) => {
            const isSelected = selectedCurves.includes(curve.id);
            const isHighlighted = highlightedComplexity === curve.id;

            return (
              <div
                key={curve.id}
                className={`group relative flex flex-col p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? isHighlighted
                      ? 'bg-card border-2 shadow-md ring-2 ring-primary/30'
                      : 'bg-card/80 border-border hover:border-border/90 hover:bg-card shadow-sm'
                    : 'bg-muted/30 border-transparent opacity-50 hover:opacity-75'
                }`}
                style={{
                  borderColor: isHighlighted ? curve.color : undefined,
                }}
                onClick={() => {
                  if (!isSelected) {
                    onToggleCurve(curve.id);
                  }
                  onSelectComplexity?.(curve.id);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-3 h-3 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: curve.color }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCurve(curve.id);
                    }}
                    className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                    title={isSelected ? 'Hide curve' : 'Show curve'}
                  >
                    {isSelected ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span className="font-mono font-black text-xs text-foreground tracking-tight">
                  {curve.notation}
                </span>
                <span className="text-[10px] text-muted-foreground truncate font-medium">
                  {curve.growthType}
                </span>

                <div className="mt-1 pt-1 border-t border-border/40 text-[10px] font-mono font-bold truncate text-foreground/90">
                  {scale === 'logarithmic'
                    ? formatFromLog10(curve.log10Calc(currentInspectedN))
                    : formatOperations(curve.calc(currentInspectedN))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ComplexityGraph.displayName = 'ComplexityGraph';
