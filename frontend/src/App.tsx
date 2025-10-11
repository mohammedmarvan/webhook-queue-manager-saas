import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
// import Sidebar from "./components/Layout/Sidebar";
import Dashboard from './pages/Dashboard';
import Projects from './pages/project';
import ProjectEdit from './pages/project/[id]';
import Sources from './pages/source';
import Destinations from './pages/destination';
import Events from './pages/event';
// import Logs from "./pages/Logs";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/project/:id/edit" element={<ProjectEdit />} />
          <Route path="/source" element={<Sources />} />
          <Route path="/destination" element={<Destinations />} />
          <Route path="/event" element={<Events />} />

          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
