import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// LoginPage/RegisterPage are used via wrappers
import { AppRoot } from './AppRoot';
import { OrdersProvider } from './app/context/OrdersContext';
import { OrdersListWrapper, OrderDetailsWrapper } from './components/pages/OrdersRouteWrappers';
import { StrategyAnalystHome } from './components/StrategyAnalystHome';
// OrderListingPage and OrderDetailsPage are used via wrapper components
import { ForecastsPage } from './components/pages/ForecastsPage';
import { useAuth } from './app/context/AuthContext';
import { LoginWrapper, RegisterWrapper } from './components/AuthRouteWrappers';
import { useNavigate } from 'react-router-dom';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth() as any;
  if (loading) return <div />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { role, loading } = useAuth() as any;
  if (loading) return <div />;
  if (!role || !allowedRoles.includes(role)) {
    // redirect to dashboard if role not allowed
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function StrategyWrapper() {
  const { user, logout } = useAuth() as any;
  const navigate = useNavigate();

  function handleLogout() {
    logout?.();
    navigate('/login');
  }

  return <StrategyAnalystHome onLogout={handleLogout} userEmail={user?.email ?? ''} />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={<LoginWrapper />} />
  <Route path="/register" element={<RegisterWrapper />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <OrdersProvider>
                <AppRoot />
              </OrdersProvider>
            </RequireAuth>
          }
        >
          <Route index element={<div />} />
          <Route path="dashboard" element={<OrdersListWrapper />} />
          <Route path="orders" element={<OrdersListWrapper />} />
          <Route path="orders/:id" element={<OrderDetailsWrapper />} />
          <Route path="forecasts" element={<ForecastsPage orders={[]} />} />
        </Route>

        <Route
          path="/strategy"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["admin", "gestor"]}>
                <StrategyWrapper />
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
