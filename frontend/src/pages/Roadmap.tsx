import * as React from 'react';
import { motion } from 'framer-motion';
import { RoadmapNode, RoadmapNodeData } from '../components/roadmap/RoadmapNode';
import { RoadmapPath } from '../components/roadmap/RoadmapPath';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { Sparkles } from 'lucide-react';

export const Roadmap = () => {
  const getMockState = (categoryId: string): RoadmapNodeData['state'] => {
    switch(categoryId) {
      case 'sorting-algorithms': return 'completed';
      case 'searching-algorithms': return 'completed';
      case 'sliding-window': return 'current';
      case 'two-pointers': return 'recommended';
      default: return 'future';
    }
  };

  const getDifficulty = (categoryId: string): RoadmapNodeData['difficulty'] => {
    const hardTopics = ['graphs', 'dynamic-programming', 'segment-tree', 'binary-indexed-tree', 'advanced-patterns'];
    const mediumTopics = ['backtracking', 'trees', 'trie', 'heap', 'two-pointers', 'greedy-algorithms'];
    if (hardTopics.includes(categoryId)) return 'Advanced';
    if (mediumTopics.includes(categoryId)) return 'Intermediate';
    return 'Beginner';
  };

  const getPrerequisites = (categoryId: string): string[] => {
    switch(categoryId) {
      case 'searching-algorithms': return ['Sorting Algorithms'];
      case 'sliding-window': return ['Searching Algorithms'];
      case 'two-pointers': return ['Searching Algorithms'];
      case 'recursion': return ['Two Pointers'];
      case 'backtracking': return ['Recursion'];
      case 'linked-lists': return ['Two Pointers'];
      case 'trees': return ['Recursion', 'Linked Lists'];
      case 'graphs': return ['Trees'];
      case 'dynamic-programming': return ['Recursion', 'Graphs'];
      case 'heap': return ['Trees'];
      case 'trie': return ['Trees'];
      case 'greedy-algorithms': return ['Sorting Algorithms'];
      default: return [];
    }
  };

  const getWhyLater = (categoryId: string): string | undefined => {
    const prereqs = getPrerequisites(categoryId);
    if (prereqs.length > 0) {
      return `This topic builds heavily on the concepts learned in ${prereqs.join(' and ')}. Mastering those first will make this much easier to understand!`;
    }
    return undefined;
  };

  const nodesData: RoadmapNodeData[] = CATEGORIES.map(cat => ({
    id: cat.id,
    title: cat.title,
    icon: cat.Icon,
    state: getMockState(cat.id),
    difficulty: getDifficulty(cat.id),
    prerequisites: getPrerequisites(cat.id),
    estimatedTime: `${Math.max(2, cat.count * 1.5)} Hours`,
    whyLater: getWhyLater(cat.id)
  }));

  // Group nodes into a Diamond pattern: 1, 2, 1, 2, 1...
  const rows: RoadmapNodeData[][] = [];
  let currentIndex = 0;
  let useTwo = false;
  
  while (currentIndex < nodesData.length) {
    if (useTwo && currentIndex + 1 < nodesData.length) {
      rows.push([nodesData[currentIndex], nodesData[currentIndex + 1]]);
      currentIndex += 2;
    } else {
      rows.push([nodesData[currentIndex]]);
      currentIndex += 1;
    }
    useTwo = !useTwo;
  }

  const svgRef = React.useRef<SVGSVGElement>(null);

  return (
    <WorkspaceLayout>
      <div className="w-full relative text-left flex flex-col gap-6">
        {/* Left-Aligned Widescreen Header Banner */}
        <div className="relative bg-card border border-border/80 p-8 sm:p-10 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col items-start gap-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Learning Map
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Computer Science <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Roadmap</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              A guided adventure through Computer Science. Follow the path to master algorithms step-by-step or jump ahead to any topic.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 bg-background/80 border border-border/70 p-4 rounded-2xl shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Recommended</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-border" />
              <span>Future</span>
            </div>
          </div>
        </div>

        {/* Widescreen Node Map Area */}
        <div className="relative w-full py-8">
          <svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: 'visible' }}
          >
            {rows.map((row, rowIndex) => {
              if (rowIndex === rows.length - 1) return null;
              const nextRow = rows[rowIndex + 1];
              
              const connections: React.ReactNode[] = [];
              
              if (row.length === 1) {
                const fromNode = row[0];
                nextRow.forEach(toNode => {
                  connections.push(
                    <RoadmapPath 
                      key={`path-${fromNode.id}-${toNode.id}`}
                      fromId={fromNode.id} 
                      toId={toNode.id}
                      fromAnchor="bottom"
                      toAnchor="top"
                      isGlowing={fromNode.state === 'completed' || fromNode.state === 'current'}
                      isFaded={fromNode.state === 'future' && toNode.state === 'future'}
                      svgRef={svgRef}
                    />
                  );
                });
              } 
              else if (row.length === 2 && nextRow.length === 1) {
                const toNode = nextRow[0];
                row.forEach(fromNode => {
                  connections.push(
                    <RoadmapPath 
                      key={`path-${fromNode.id}-${toNode.id}`}
                      fromId={fromNode.id} 
                      toId={toNode.id}
                      fromAnchor="bottom"
                      toAnchor="top"
                      isGlowing={fromNode.state === 'completed' || fromNode.state === 'current'}
                      isFaded={fromNode.state === 'future' && toNode.state === 'future'}
                      svgRef={svgRef}
                    />
                  );
                });
              }

              return connections;
            })}
          </svg>

          {/* Render Nodes in a Diamond Pattern */}
          <div className="flex flex-col items-center gap-16 relative z-20">
            {rows.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="flex justify-center items-center w-full gap-24 md:gap-40">
                  {row.map((node, colIndex) => {
                    const tooltipPosition = row.length === 1 ? 'right' : colIndex === 0 ? 'left' : 'right';

                    return (
                      <motion.div 
                        key={node.id} 
                        className="relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: colIndex * 0.1 }}
                      >
                        <RoadmapNode 
                          data={node} 
                          position={tooltipPosition}
                          index={rowIndex * 2 + colIndex}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
};
