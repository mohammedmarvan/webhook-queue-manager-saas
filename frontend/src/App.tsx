import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
// import Sidebar from "./components/Layout/Sidebar";
import Dashboard from './pages/Dashboard';
import Projects from './pages/project';
// import Sources from "./pages/Sources";
// import Destinations from "./pages/Destinations";
// import Events from "./pages/Events";
// import Logs from "./pages/Logs";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project" element={<Projects />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
