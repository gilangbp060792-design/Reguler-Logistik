import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrderBaru from './pages/OrderBaru';
import STT from './pages/STT';
import StatusOrderan from './pages/StatusOrderan';
import Tracking from './pages/Tracking';
import Shipments from './pages/Shipments';
import Customers from './pages/Customers';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import CustomerAnalysis from './pages/CustomerAnalysis';
import CustomerRanking from './pages/CustomerRanking';
import Invoice from './pages/Invoice';
import Revenue from './pages/Revenue';
import Budget from './pages/Budget';

// Driver Portal Pages
import DriverLayout from './pages/driver/DriverLayout';
import DriverLogin from './pages/driver/DriverLogin';
import DriverHome from './pages/driver/DriverHome';
import DriverScanner from './pages/driver/DriverScanner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useContext(AppContext);
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Driver Portal Routes */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route path="login" element={<DriverLogin />} />
          <Route path="home" element={<DriverHome />} />
          <Route path="scanner" element={<DriverScanner />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout onNewShipment={() => setShowNewShipmentModal(true)}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/order-baru" element={<OrderBaru />} />
                <Route path="/stt" element={<STT />} />
                <Route path="/status-orderan" element={<StatusOrderan />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/shipments" element={
                  <Shipments
                    showNewModal={showNewShipmentModal}
                    onCloseNewModal={() => setShowNewShipmentModal(false)}
                  />
                } />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/customer-analysis" element={<CustomerAnalysis />} />
                <Route path="/customer-ranking" element={<CustomerRanking />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/budget" element={<Budget />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
