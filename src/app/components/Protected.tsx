import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../services/roles";

export function Protected({ allow, children }: { allow?: Role[]; children: React.ReactNode; }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="p-6">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allow && role && !allow.includes(role)) return <div className="p-6 text-red-600">Acesso negado.</div>;
  return <>{children}</>;
}
