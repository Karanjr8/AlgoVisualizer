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


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

import { Profile } from './pages/Profile';
import { Placeholder } from './pages/Placeholder';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
        <Route path="/explore/:categoryId" element={<PageTransition><CategoryDetail /></PageTransition>} />
        <Route path="/explore/sorting-algorithms/intro" element={<PageTransition><SortingIntro /></PageTransition>} />
        <Route path="/explore/searching-algorithms/intro" element={<PageTransition><SearchingIntro /></PageTransition>} />
        <Route path="/explore/sliding-window/intro" element={<PageTransition><SlidingWindowIntro /></PageTransition>} />
        <Route path="/explore/two-pointers/intro" element={<PageTransition><TwoPointersIntro /></PageTransition>} />
        <Route path="/explore/recursion/intro" element={<PageTransition><RecursionIntro /></PageTransition>} />
        <Route path="/explore/backtracking/intro" element={<PageTransition><BacktrackingIntro /></PageTransition>} />
        <Route path="/algorithms/:algorithmId" element={<PageTransition><Visualizer /></PageTransition>} />
        <Route path="/algorithms/:categoryId/:algorithmId" element={<PageTransition><Visualizer /></PageTransition>} />
        <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        
        {/* Practice Routes */}
        <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
        <Route path="/practice/timed-challenges" element={<PageTransition><TimedChallenges /></PageTransition>} />
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
