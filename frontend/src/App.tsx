import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/project'));
const ProjectEdit = lazy(() => import('./pages/project/[id]'));
const Sources = lazy(() => import('./pages/source'));
const Destinations = lazy(() => import('./pages/destination'));
const Events = lazy(() => import('./pages/event'));
const LoginPage = lazy(() => import('./pages/auth/Login'));
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SessionExpiredModal } from '@/components/auth/SessionExpiredModal';
import { PageLoader } from './components/layout/PageLoader';

// import Logs from "./pages/Logs";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />} >
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="project" element={<Projects />} />
            <Route path="project/:id/edit" element={<ProjectEdit />} />
            <Route path="source" element={<Sources />} />
            <Route path="destination" element={<Destinations />} />
            <Route path="event" element={<Events />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
        <SessionExpiredModal />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
