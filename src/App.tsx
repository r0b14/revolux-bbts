import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AnalystOrdersHome } from './components/AnalystOrdersHome';
import { StrategyAnalystHome } from './components/StrategyAnalystHome';
import { Toaster } from './components/ui/sonner';
import { UserProfile, Order } from './types';
import { mockOrders } from './data/mockData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleLogin = (email: string, password: string) => {
    // Determine user profile based on email
    let profile: UserProfile;
    
    if (email.includes('analista.pedidos') || email.includes('orders')) {
      profile = 'orders-analyst';
    } else if (email.includes('analista.estrategia') || email.includes('strategy')) {
      profile = 'strategy-analyst';
    } else {
      // Default to orders analyst for demo purposes
      profile = 'orders-analyst';
    }

    setUserEmail(email);
    setUserProfile(profile);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserEmail('');
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, ...updates }
          : order
      )
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {userProfile === 'orders-analyst' ? (
        <AnalystOrdersHome
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onLogout={handleLogout}
          userEmail={userEmail}
        />
      ) : (
        <StrategyAnalystHome
          onLogout={handleLogout}
          userEmail={userEmail}
          orders={orders}
        />
      )}
      <Toaster />
    </>
  );
}
