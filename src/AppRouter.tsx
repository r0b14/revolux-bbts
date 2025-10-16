import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// LoginPage/RegisterPage are used via wrappers
import { AppRoot } from './AppRoot';
import { OrdersProvider } from './app/context/OrdersContext';
import { OrdersListWrapper, OrderDetailsWrapper, HomeWrapper } from './components/pages/OrdersRouteWrappers';
import { StrategyAnalystHome } from './components/StrategyAnalystHome';
// OrderListingPage and OrderDetailsPage are used via wrapper components
import { ForecastsPage } from './components/pages/ForecastsPage';
import { useAuth } from './app/context/AuthContext';
import { useOrders } from './app/context/OrdersContext';
import { LoginWrapper, RegisterWrapper } from './components/AuthRouteWrappers';
import { useNavigate } from 'react-router-dom';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth() as any;
  // diagnostic log
  // eslint-disable-next-line no-console
  console.info('RequireAuth: user=', user, 'loading=', loading);
  if (loading) return <div />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireRole({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { role, loading } = useAuth() as any;
  // diagnostic
  // eslint-disable-next-line no-console
  console.info('RequireRole: role=', role, 'allowed=', allowedRoles, 'loading=', loading);
  if (loading) return <div />;
  if (!role || !allowedRoles.includes(role)) {
    // redirect to dashboard if role not allowed
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function StrategyWrapper() {
  const { user, logout } = useAuth() as any;
  const { orders, updateOrder } = useOrders() as any;
  const navigate = useNavigate();

  function handleLogout() {
    logout?.();
    navigate('/login');
  }

  function handleAddHistory(_history: any) {
    // placeholder: in-memory app doesn't persist history globally
    return;
  }

  return (
    <StrategyAnalystHome 
      onLogout={handleLogout} 
      userEmail={user?.email ?? ''}
      orders={orders}
      onUpdateOrder={(id: string, updates: any) => updateOrder(id, updates)}
      orderHistory={[]}
      onAddHistory={handleAddHistory}
    />
  );
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
          <Route path="dashboard" element={<HomeWrapper />} />
          <Route path="orders" element={<OrdersListWrapper />} />
          <Route path="orders/:id" element={<OrderDetailsWrapper />} />
          <Route path="forecasts" element={<ForecastsPage orders={[]} />} />
        </Route>

        <Route
          path="/strategy"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["admin", "gestor"]}>
                  <OrdersProvider>
                <StrategyWrapper />
                  </OrdersProvider>
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
