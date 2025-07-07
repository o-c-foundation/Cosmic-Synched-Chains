import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NetworkCreation from './pages/NetworkCreation';
import NetworksList from './pages/NetworksList';
import NetworkDetails from './pages/NetworkDetails';
import Monitoring from './pages/Monitoring';
import Governance from './pages/Governance';
import Settings from './pages/Settings';
import { NetworkProvider } from './context/NetworkContext';

const App = () => {
  return (
    <NetworkProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-network" element={<NetworkCreation />} />
            <Route path="/networks" element={<NetworksList />} />
            <Route path="/networks/:id" element={<NetworkDetails />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </NetworkProvider>
  );
};

export default App;