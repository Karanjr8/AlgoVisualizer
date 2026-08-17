import { useState, useRef, MouseEvent } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Network, Plus, Trash2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  id: string;
  value: number;
  x: number;
  y: number;
}

export const DataStructureBuilder = () => {
  const [nodes, setNodes] = useState<(TreeNode | null)[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  // Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Recalculate tree layout based on current nodes
  const calculateLayout = (currentNodes: (TreeNode | null)[]) => {
    if (currentNodes.length === 0) return [];

    const horizontalSpacing = 60;
    const verticalSpacing = 100;
    const newNodes = [...currentNodes];

    // Simple complete binary tree layout: 
    // Inorder traversal to assign X coordinates avoids overlaps.
    let currentX = 0;
    
    const inorder = (index: number) => {
      if (index >= newNodes.length || !newNodes[index]) return;
      
      // left child
      inorder(2 * index + 1);
      
      // self
      const level = Math.floor(Math.log2(index + 1));
      newNodes[index]!.x = currentX;
      newNodes[index]!.y = level * verticalSpacing;
      currentX += horizontalSpacing;
      
      // right child
      inorder(2 * index + 2);
    };

    inorder(0);

    // Center the tree around x=0
    if (newNodes[0]) {
      const rootX = newNodes[0].x;
      newNodes.forEach(n => {
        if (n) {
          n.x -= rootX;
        }
      });
    }

    return newNodes;
  };

  const insertNode = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    
    let newNodes = [...nodes];
    let insertIdx = newNodes.findIndex(n => n === null);
    if (insertIdx === -1) insertIdx = newNodes.length;

    newNodes[insertIdx] = {
      id: Math.random().toString(36).substr(2, 9),
      value: val,
      x: 0, 
      y: 0
    };
    
    newNodes = calculateLayout(newNodes);
    setNodes(newNodes);
    setInputValue('');
  };

  const resetTree = () => {
    setNodes([]);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Pan logic
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const centerView = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const navLinks = [
    { id: 'builder', label: 'Data Structure Builder', icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">Data Structure Builder</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Construct and visualize data structures interactively in real-time with an intelligent layout engine.</p>
      </header>

      <div className="flex flex-col gap-8">
        
        {/* Top Control Bar */}
        <div className="w-full bg-card border border-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full md:w-auto flex flex-col gap-2">
             <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Structure Type</label>
             <select disabled className="bg-background border border-border rounded-xl p-3 outline-none opacity-70 cursor-not-allowed font-bold">
               <option>Complete Binary Tree (Min-Heap Array Layout)</option>
             </select>
          </div>

          <div className="flex-1 w-full md:w-auto flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Insert Node</label>
            <div className="flex gap-2">
              <input 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyDown={(e) => e.key === 'Enter' && insertNode()}
                className="flex-1 bg-background border border-border rounded-xl p-3 outline-none focus:border-primary font-bold"
              />
              <button 
                onClick={insertNode}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black hover:bg-primary/90 shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</label>
            <button 
              onClick={resetTree}
              className="w-full md:w-auto px-6 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-bold hover:bg-destructive/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Interactive Visualization Area */}
        <div className="w-full bg-card rounded-3xl border border-border shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
          
          {/* Canvas Controls overlay */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-background/80 backdrop-blur border border-border p-2 rounded-2xl shadow-sm">
            <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 hover:bg-muted rounded-xl text-foreground transition-colors"><ZoomIn className="w-5 h-5"/></button>
            <button onClick={() => setScale(s => Math.max(s - 0.2, 0.2))} className="p-2 hover:bg-muted rounded-xl text-foreground transition-colors"><ZoomOut className="w-5 h-5"/></button>
            <div className="w-full h-px bg-border my-1"></div>
            <button onClick={centerView} className="p-2 hover:bg-muted rounded-xl text-foreground transition-colors" title="Center View"><Maximize className="w-5 h-5"/></button>
          </div>

          {/* Draggable Viewport */}
          <div 
            ref={containerRef}
            className={`flex-1 w-full h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background/80 to-background ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="absolute top-1/4 left-1/2 origin-top"
              style={{
                transform: `translate(calc(-50% + ${position.x}px), ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                <AnimatePresence>
                  {nodes.map((node, i) => {
                    if (!node) return null;
                    const parentIdx = Math.floor((i - 1) / 2);
                    const parent = nodes[parentIdx];
                    if (!parent) return null;
                    return (
                      <motion.line 
                        key={`edge-${i}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1, x1: parent.x, y1: parent.y, x2: node.x, y2: node.y }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        stroke="currentColor" 
                        className="text-border drop-shadow-sm" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </AnimatePresence>
              </svg>

              <AnimatePresence>
                {nodes.map((node, i) => {
                  if (!node) return null;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0, opacity: 0, y: node.y - 20 }}
                      animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute w-14 h-14 -ml-7 -mt-7 bg-background border-4 border-primary rounded-full flex items-center justify-center font-black text-lg text-foreground shadow-xl pointer-events-auto cursor-pointer hover:scale-110 hover:border-primary/80 hover:shadow-primary/20 transition-all z-10"
                    >
                      {node.value}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium text-lg pointer-events-none">
                Add nodes to start building your complete binary tree
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
