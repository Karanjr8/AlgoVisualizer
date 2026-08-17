import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { CategoryDetail } from './pages/CategoryDetail';
import { SortingIntro } from './pages/SortingIntro';
import { SearchingIntro } from './pages/SearchingIntro';
import { SlidingWindowIntro } from './pages/SlidingWindowIntro';
import { TwoPointersIntro } from './pages/TwoPointersIntro';
import { RecursionIntro } from './pages/RecursionIntro';
import { BacktrackingIntro } from './pages/BacktrackingIntro';
import { HeapIntro } from './pages/HeapIntro';
import { TrieIntro } from './pages/TrieIntro';
import { GreedyIntro } from './pages/GreedyIntro';
import { SegmentTreeIntro } from './pages/SegmentTreeIntro';
import { BinaryIndexedTreeIntro } from './pages/BinaryIndexedTreeIntro';
import { AdvancedPatternsIntro } from './pages/AdvancedPatternsIntro';
import { LinkedListsIntro } from './pages/LinkedListsIntro';
import { TreesIntro } from './pages/TreesIntro';
import { GraphsIntro } from './pages/GraphsIntro';
import { DPIntro } from './pages/DPIntro';
import { Visualizer } from './pages/Visualizer';
import { Playground } from './pages/Playground';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { Practice } from './pages/Practice';
import { TimedChallenges } from './pages/practice/TimedChallenges';
import { useAuthStore } from './store/useAuthStore';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AlgorithmLab } from './pages/playground/AlgorithmLab';
import { DataStructureBuilder } from './pages/playground/DataStructureBuilder';
import { AlgorithmArena } from './pages/playground/AlgorithmArena';
import { ComplexityLab } from './pages/playground/ComplexityLab';
import { InputStudio } from './pages/playground/InputStudio';
import { WhatIfSimulator } from './pages/playground/WhatIfSimulator';
import { BecomeTheAlgorithm } from './pages/playground/BecomeTheAlgorithm';
import { CodeExplorer } from './pages/playground/CodeExplorer';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { Profile } from './pages/Profile';
import { Placeholder } from './pages/Placeholder';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewSession } from './pages/InterviewSession';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
        <Route path="/explore/sorting-algorithms" element={<PageTransition><SortingIntro /></PageTransition>} />
        <Route path="/explore/sorting-algorithms/intro" element={<PageTransition><SortingIntro /></PageTransition>} />
        <Route path="/explore/searching-algorithms" element={<PageTransition><SearchingIntro /></PageTransition>} />
        <Route path="/explore/searching-algorithms/intro" element={<PageTransition><SearchingIntro /></PageTransition>} />
        <Route path="/explore/sliding-window" element={<PageTransition><SlidingWindowIntro /></PageTransition>} />
        <Route path="/explore/sliding-window/intro" element={<PageTransition><SlidingWindowIntro /></PageTransition>} />
        <Route path="/explore/two-pointers" element={<PageTransition><TwoPointersIntro /></PageTransition>} />
        <Route path="/explore/two-pointers/intro" element={<PageTransition><TwoPointersIntro /></PageTransition>} />
        <Route path="/explore/recursion" element={<PageTransition><RecursionIntro /></PageTransition>} />
        <Route path="/explore/recursion/intro" element={<PageTransition><RecursionIntro /></PageTransition>} />
        <Route path="/explore/backtracking" element={<PageTransition><BacktrackingIntro /></PageTransition>} />
        <Route path="/explore/backtracking/intro" element={<PageTransition><BacktrackingIntro /></PageTransition>} />
        <Route path="/explore/heap" element={<PageTransition><HeapIntro /></PageTransition>} />
        <Route path="/explore/heap/intro" element={<PageTransition><HeapIntro /></PageTransition>} />
        <Route path="/explore/heap-intro" element={<PageTransition><HeapIntro /></PageTransition>} />
        <Route path="/explore/trie" element={<PageTransition><TrieIntro /></PageTransition>} />
        <Route path="/explore/trie/intro" element={<PageTransition><TrieIntro /></PageTransition>} />
        <Route path="/explore/trie-intro" element={<PageTransition><TrieIntro /></PageTransition>} />
        <Route path="/explore/greedy-algorithms" element={<PageTransition><GreedyIntro /></PageTransition>} />
        <Route path="/explore/greedy" element={<PageTransition><GreedyIntro /></PageTransition>} />
        <Route path="/explore/greedy-algorithms/intro" element={<PageTransition><GreedyIntro /></PageTransition>} />
        <Route path="/explore/greedy/intro" element={<PageTransition><GreedyIntro /></PageTransition>} />
        <Route path="/explore/greedy-intro" element={<PageTransition><GreedyIntro /></PageTransition>} />
        <Route path="/explore/segment-tree" element={<PageTransition><SegmentTreeIntro /></PageTransition>} />
        <Route path="/explore/segment-tree/intro" element={<PageTransition><SegmentTreeIntro /></PageTransition>} />
        <Route path="/explore/segment-tree-intro" element={<PageTransition><SegmentTreeIntro /></PageTransition>} />
        <Route path="/explore/binary-indexed-tree" element={<PageTransition><BinaryIndexedTreeIntro /></PageTransition>} />
        <Route path="/explore/binary-indexed-tree/intro" element={<PageTransition><BinaryIndexedTreeIntro /></PageTransition>} />
        <Route path="/explore/fenwick-tree" element={<PageTransition><BinaryIndexedTreeIntro /></PageTransition>} />
        <Route path="/explore/fenwick-tree/intro" element={<PageTransition><BinaryIndexedTreeIntro /></PageTransition>} />
        <Route path="/explore/advanced-patterns" element={<PageTransition><AdvancedPatternsIntro /></PageTransition>} />
        <Route path="/explore/advanced-patterns/intro" element={<PageTransition><AdvancedPatternsIntro /></PageTransition>} />
        <Route path="/explore/patterns" element={<PageTransition><AdvancedPatternsIntro /></PageTransition>} />
        <Route path="/explore/patterns/intro" element={<PageTransition><AdvancedPatternsIntro /></PageTransition>} />
        <Route path="/explore/linked-lists" element={<PageTransition><LinkedListsIntro /></PageTransition>} />
        <Route path="/explore/linked-lists/intro" element={<PageTransition><LinkedListsIntro /></PageTransition>} />
        <Route path="/explore/trees" element={<PageTransition><TreesIntro /></PageTransition>} />
        <Route path="/explore/trees/intro" element={<PageTransition><TreesIntro /></PageTransition>} />
        <Route path="/explore/graphs" element={<PageTransition><GraphsIntro /></PageTransition>} />
        <Route path="/explore/graphs/intro" element={<PageTransition><GraphsIntro /></PageTransition>} />
        <Route path="/explore/dynamic-programming" element={<PageTransition><DPIntro /></PageTransition>} />
        <Route path="/explore/dynamic-programming/intro" element={<PageTransition><DPIntro /></PageTransition>} />
        <Route path="/explore/:categoryId" element={<PageTransition><CategoryDetail /></PageTransition>} />
        <Route path="/algorithms/:algorithmId" element={<PageTransition><Visualizer /></PageTransition>} />
        <Route path="/algorithms/:categoryId/:algorithmId" element={<PageTransition><Visualizer /></PageTransition>} />
        
        {/* Playground Hub & Modules */}
        <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
        <Route path="/playground/algorithm-lab" element={<PageTransition><AlgorithmLab /></PageTransition>} />
        <Route path="/playground/structure-builder" element={<PageTransition><DataStructureBuilder /></PageTransition>} />
        <Route path="/playground/algorithm-arena" element={<PageTransition><AlgorithmArena /></PageTransition>} />
        <Route path="/playground/complexity-lab" element={<PageTransition><ComplexityLab /></PageTransition>} />
        <Route path="/playground/input-studio" element={<PageTransition><InputStudio /></PageTransition>} />
        <Route path="/playground/what-if" element={<PageTransition><WhatIfSimulator /></PageTransition>} />
        <Route path="/playground/become-the-algorithm" element={<PageTransition><BecomeTheAlgorithm /></PageTransition>} />
        <Route path="/playground/code-explorer" element={<PageTransition><CodeExplorer /></PageTransition>} />

        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        
        {/* Practice & Interview Simulator Routes */}
        <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
        <Route path="/practice/timed-challenges" element={<PageTransition><TimedChallenges /></PageTransition>} />
        <Route path="/practice/interview" element={<PageTransition><InterviewSetup /></PageTransition>} />
        <Route path="/practice/interview/session" element={<PageTransition><InterviewSession /></PageTransition>} />
        <Route path="/interview" element={<PageTransition><InterviewSetup /></PageTransition>} />
        <Route path="/interview/session" element={<PageTransition><InterviewSession /></PageTransition>} />
        <Route path="/practice/:modeId" element={<PageTransition><Placeholder title="Practice Mode" description="This practice mode is currently under construction. Check back soon to start training!" /></PageTransition>} />
        <Route path="/progress" element={<PageTransition><Placeholder title="Your Progress" description="Track your learning journey, review past performance, and earn mastery badges." /></PageTransition>} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookmarks" 
          element={
            <ProtectedRoute>
              <PageTransition><Placeholder title="Bookmarks" description="Quickly access your saved algorithms and practice problems." /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <PageTransition><Placeholder title="Settings" description="Configure your learning experience and application preferences." /></PageTransition>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
