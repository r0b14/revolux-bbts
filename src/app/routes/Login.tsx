import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("user+gestor@revolux.dev");
  const [pass, setPass] = useState("senha123");
  const [err, setErr] = useState<string | null>(null);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="mx-auto max-w-sm mt-16 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">Entrar</h1>
      <input className="border rounded w-full p-2 mb-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="border rounded w-full p-2 mb-2" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" type="password" />
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <button className="w-full bg-slate-900 text-white rounded py-2"
        onClick={async ()=>{ try { await login(email, pass); } catch(e:any){ setErr(e.message);} }}>
        Entrar
      </button>
      <div className="mt-3 text-center text-sm">
        <span className="text-slate-600 mr-1">Não tem conta?</span>
        <Link to="/register" className="text-sky-600 underline">Cadastre-se</Link>
      </div>
      <p className="text-xs text-slate-500 mt-3">Dica: use +admin, +gestor ou +operador no email para simular papéis.</p>
    </div>
  );
}
