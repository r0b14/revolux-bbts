import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">revolux</Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/upload-csv">Upload CSV</NavLink>
          <NavLink to="/relatorios">Relatórios</NavLink>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-500">{user.email} ({role})</span>
              <button onClick={() => logout()} className="px-3 py-1 rounded bg-slate-900 text-white">Sair</button>
            </>
          ) : <NavLink to="/login">Entrar</NavLink>}
        </div>
      </div>
    </header>
  );
}
