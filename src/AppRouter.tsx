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

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route path="/login" element={<LoginWrapper />} />
  <Route path="/register" element={<RegisterWrapper />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <OrdersProvider>
                <AppRoot />
              </OrdersProvider>
            </RequireAuth>
          }
        />

        <Route
          path="/strategy"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["admin", "gestor"]}>
                <StrategyAnalystHome onLogout={() => {}} userEmail={""} />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/orders"
          element={
            <RequireAuth>
              <OrdersProvider>
                <OrdersListWrapper />
              </OrdersProvider>
            </RequireAuth>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <OrdersProvider>
                <OrderDetailsWrapper />
              </OrdersProvider>
            </RequireAuth>
          }
        />

        <Route
          path="/forecasts"
          element={
            <RequireAuth>
              <OrdersProvider>
                <ForecastsPage orders={[]} />
              </OrdersProvider>
            </RequireAuth>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
