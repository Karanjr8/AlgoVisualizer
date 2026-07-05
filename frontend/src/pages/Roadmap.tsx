import * as React from 'react';
import { motion } from 'framer-motion';
import { RoadmapNode, RoadmapNodeData } from '../components/roadmap/RoadmapNode';
import { RoadmapPath } from '../components/roadmap/RoadmapPath';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const Roadmap = () => {
  // Mock Progress Logic:
  // Let's pretend the user has finished Sorting and Searching.
  // Their current focus is Sliding Window.
  // Recommended next is Two Pointers.
  // Everything else is future.

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
    const mediumTopics = ['backtracking', 'trees', 'trie', 'heap', 'two-pointers'];
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
      <div className="pt-4 w-full relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Learning Journey</h1>
          <p className="text-muted-foreground text-lg">
            A guided adventure through Computer Science. Follow the path to master algorithms, 
            or jump ahead to any topic you want. You set the pace!
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-16 bg-card/50 backdrop-blur-sm p-4 rounded-full border border-border w-max mx-auto shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <span className="text-sm font-medium">Current Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Future</span>
          </div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto py-12">
          {/* Single SVG Container for all edges */}
          <svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: 'visible' }}
          >
            {rows.map((row, rowIndex) => {
              if (rowIndex === rows.length - 1) return null;
              const nextRow = rows[rowIndex + 1];
              
              const connections: React.ReactNode[] = [];
              
              // If current row has 1 node, it splits to the next row (which has 2 nodes, or 1 if end of array)
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
              // If current row has 2 nodes, they both merge into the next row's center node
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
                    // Tooltip goes outside: left node -> tooltip left, right node -> tooltip right, center node -> tooltip right
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
