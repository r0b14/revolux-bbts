import { useAuth } from './app/context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { useOrders } from './app/context/OrdersContext';
import { AnalystOrdersHome } from './components/AnalystOrdersHome';

export function AppRoot() {
  const { user, logout } = useAuth() as any;
  const { orders } = useOrders();
  const navigate = useNavigate();

  function handleLogout() {
    logout?.();
    navigate('/login');
  }

  const userEmail = user?.email ?? '';

  return (
    <AnalystOrdersHome orders={orders} onLogout={handleLogout} userEmail={userEmail}>
      <Outlet />
    </AnalystOrdersHome>
  );
}
