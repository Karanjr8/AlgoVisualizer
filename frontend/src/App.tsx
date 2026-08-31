import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './components/layout/PageTransition';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { useAuthStore } from './store/useAuthStore';
import { ThemeProvider } from './components/theme/ThemeProvider';

// Lazy load pages for dynamic chunk splitting and fast initial page load
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail').then(m => ({ default: m.CategoryDetail })));
const SortingIntro = lazy(() => import('./pages/SortingIntro').then(m => ({ default: m.SortingIntro })));
const SearchingIntro = lazy(() => import('./pages/SearchingIntro').then(m => ({ default: m.SearchingIntro })));
const SlidingWindowIntro = lazy(() => import('./pages/SlidingWindowIntro').then(m => ({ default: m.SlidingWindowIntro })));
const TwoPointersIntro = lazy(() => import('./pages/TwoPointersIntro').then(m => ({ default: m.TwoPointersIntro })));
const RecursionIntro = lazy(() => import('./pages/RecursionIntro').then(m => ({ default: m.RecursionIntro })));
const BacktrackingIntro = lazy(() => import('./pages/BacktrackingIntro').then(m => ({ default: m.BacktrackingIntro })));
const HeapIntro = lazy(() => import('./pages/HeapIntro').then(m => ({ default: m.HeapIntro })));
const TrieIntro = lazy(() => import('./pages/TrieIntro').then(m => ({ default: m.TrieIntro })));
const GreedyIntro = lazy(() => import('./pages/GreedyIntro').then(m => ({ default: m.GreedyIntro })));
const SegmentTreeIntro = lazy(() => import('./pages/SegmentTreeIntro').then(m => ({ default: m.SegmentTreeIntro })));
const BinaryIndexedTreeIntro = lazy(() => import('./pages/BinaryIndexedTreeIntro').then(m => ({ default: m.BinaryIndexedTreeIntro })));
const AdvancedPatternsIntro = lazy(() => import('./pages/AdvancedPatternsIntro').then(m => ({ default: m.AdvancedPatternsIntro })));
const LinkedListsIntro = lazy(() => import('./pages/LinkedListsIntro').then(m => ({ default: m.LinkedListsIntro })));
const TreesIntro = lazy(() => import('./pages/TreesIntro').then(m => ({ default: m.TreesIntro })));
const GraphsIntro = lazy(() => import('./pages/GraphsIntro').then(m => ({ default: m.GraphsIntro })));
const DPIntro = lazy(() => import('./pages/DPIntro').then(m => ({ default: m.DPIntro })));
const Visualizer = lazy(() => import('./pages/Visualizer').then(m => ({ default: m.Visualizer })));
const Playground = lazy(() => import('./pages/Playground').then(m => ({ default: m.Playground })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Roadmap = lazy(() => import('./pages/Roadmap').then(m => ({ default: m.Roadmap })));
const Practice = lazy(() => import('./pages/Practice').then(m => ({ default: m.Practice })));
const TimedChallenges = lazy(() => import('./pages/practice/TimedChallenges').then(m => ({ default: m.TimedChallenges })));
const AlgorithmLab = lazy(() => import('./pages/playground/AlgorithmLab').then(m => ({ default: m.AlgorithmLab })));
const DataStructureBuilder = lazy(() => import('./pages/playground/DataStructureBuilder').then(m => ({ default: m.DataStructureBuilder })));
const AlgorithmArena = lazy(() => import('./pages/playground/AlgorithmArena').then(m => ({ default: m.AlgorithmArena })));
const ComplexityLab = lazy(() => import('./pages/playground/ComplexityLab').then(m => ({ default: m.ComplexityLab })));
const InputStudio = lazy(() => import('./pages/playground/InputStudio').then(m => ({ default: m.InputStudio })));
const WhatIfSimulator = lazy(() => import('./pages/playground/WhatIfSimulator').then(m => ({ default: m.WhatIfSimulator })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Placeholder = lazy(() => import('./pages/Placeholder').then(m => ({ default: m.Placeholder })));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup').then(m => ({ default: m.InterviewSetup })));
const InterviewSession = lazy(() => import('./pages/InterviewSession').then(m => ({ default: m.InterviewSession })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={null}>
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
    </Suspense>
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

