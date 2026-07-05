import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';



interface Props {
  fromId: string;
  toId: string;
  fromAnchor?: 'top' | 'right' | 'bottom' | 'left';
  toAnchor?: 'top' | 'right' | 'bottom' | 'left';
  isGlowing?: boolean;
  isFaded?: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const RoadmapPath = ({ 
  fromId, 
  toId, 
  fromAnchor = 'right', 
  toAnchor = 'left',
  isGlowing = false,
  isFaded = false,
  svgRef
}: Props) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    const updatePath = () => {
      const fromEl = document.getElementById(`anchor-${fromAnchor}-${fromId}`);
      const toEl = document.getElementById(`anchor-${toAnchor}-${toId}`);
      const container = svgRef.current;

      if (!fromEl || !toEl || !container) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      // Calculate relative positions
      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;

      // Draw bezier curve
      // Adjust control points based on anchors
      let ctrl1X = startX;
      let ctrl1Y = startY;
      let ctrl2X = endX;
      let ctrl2Y = endY;

      const curveDistance = Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) * 0.5;

      if (fromAnchor === 'right') ctrl1X += curveDistance;
      if (fromAnchor === 'left') ctrl1X -= curveDistance;
      if (fromAnchor === 'bottom') ctrl1Y += curveDistance;
      if (fromAnchor === 'top') ctrl1Y -= curveDistance;

      if (toAnchor === 'left') ctrl2X -= curveDistance;
      if (toAnchor === 'right') ctrl2X += curveDistance;
      if (toAnchor === 'top') ctrl2Y -= curveDistance;
      if (toAnchor === 'bottom') ctrl2Y += curveDistance;

      setPath(`M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}`);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    // Slight delay to ensure DOM is ready and layout is stable
    const timeoutId = setTimeout(updatePath, 100);

    return () => {
      window.removeEventListener('resize', updatePath);
      clearTimeout(timeoutId);
    };
  }, [fromId, toId, fromAnchor, toAnchor, svgRef]);

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={
          isGlowing ? 'stroke-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' :
          isFaded ? 'stroke-border opacity-50 stroke-dasharray-[6,6]' :
          'stroke-border'
        }
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      {isGlowing && (
        <motion.path
          d={path}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-primary/30 blur-sm"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      )}
    </g>
  );
};
