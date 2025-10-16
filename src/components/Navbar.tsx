import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold">Revolux</Link>
          <Link to="/dashboard" className="text-sm text-slate-600">Dashboard</Link>
          <Link to="/relatorios" className="text-sm text-slate-600">Relatórios</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700">{user.email}</span>
              <span className="text-xs text-slate-500">{role}</span>
              <button className="text-sm text-red-600" onClick={onLogout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-slate-600">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
