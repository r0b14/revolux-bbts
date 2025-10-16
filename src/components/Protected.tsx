import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/context/AuthContext";
import type { Role } from "../app/services/roles";

export function Protected({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allow && role && !allow.includes(role)) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-semibold">Acesso negado</h1>
        <p className="mt-2 text-sm text-slate-600">Seu usuário não tem permissão para acessar esta página.</p>
      </main>
    );
  }

  return <>{children}</>;
}

export default Protected;
