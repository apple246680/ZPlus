
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { MainLayout } from './components/layout/MainLayout';
import { CreateOrderWizard } from './components/order/CreateOrderWizard';
import { OrderManagementPage } from './components/order/OrderManagementPage';
import { FinancialApprovalPage } from './components/financial/FinancialApprovalPage';
import { VehicleDeliveryPage } from './components/delivery/VehicleDeliveryPage';

const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Renders the matched child route
};

const AppContent: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes are now nested under a ProtectedRoute element */}
        <Route element={<ProtectedRoute />}>
          {/* Routes that use MainLayout are nested under a MainLayout element */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/create-order" replace />} /> {/* Default authenticated route */}
            <Route path="/create-order" element={<CreateOrderWizard />} />
            <Route path="/order-management" element={<OrderManagementPage />} />
            <Route path="/financial-approval" element={<FinancialApprovalPage />} />
            <Route path="/vehicle-delivery" element={<VehicleDeliveryPage />} />
            <Route path="*" element={<Navigate to="/create-order" replace />} /> {/* Fallback for any other authenticated route */}
          </Route>
        </Route>
        
        {/* Fallback for any routes not matched above (e.g. if user is not logged in and tries non-login path)
            This is implicitly handled by ProtectedRoute navigating to /login.
            If a truly global non-authenticated fallback is needed, it could be added here.
            For now, this structure should cover the main cases.
        */}
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
