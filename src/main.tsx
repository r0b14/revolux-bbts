
import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";
import { AnalystOrdersHome } from "./components/AnalystOrdersHome";
import { mockOrders } from "./data/mockData";
import type { Order } from "./types";
import { LoginPage } from "./components/LoginPage";
import { auth } from "./app/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ensureUserDoc } from "./app/services/ensureUser";

function AppRoot() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  function handleUpdateOrder(orderId: string, updates: Partial<Order>) {
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserEmail('');
  }

  async function handleLogin(email: string, _password: string) {
    // se o Firebase estiver inicializado, usa autenticação real
    if (auth) {
      await signInWithEmailAndPassword(auth, email, _password);
      const u = auth.currentUser!;
      await ensureUserDoc(u);
      setUserEmail(u.email ?? email);
      setIsLoggedIn(true);
      return;
    }
    // fallback local (mock)
    setUserEmail(email);
    setIsLoggedIn(true);
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AnalystOrdersHome
      orders={orders}
      onUpdateOrder={handleUpdateOrder}
      onLogout={handleLogout}
      userEmail={userEmail}
    />
  );
}

createRoot(document.getElementById("root")!).render(<AppRoot />);
  