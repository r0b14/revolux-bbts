import { useState } from "react";
import { createAccount } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    setErr(null);
    setLoading(true);
    try {
      await createAccount(email, pass, name);
      // após criar conta, redireciona para login
      navigate('/login');
    } catch (e: any) {
      setErr(e.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm mt-16 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">Cadastrar</h1>
      <input className="border rounded w-full p-2 mb-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" />
      <input className="border rounded w-full p-2 mb-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="border rounded w-full p-2 mb-2" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" type="password" />
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      <button className="w-full bg-slate-900 text-white rounded py-2" disabled={loading}
        onClick={handleRegister}>
        {loading ? 'Criando...' : 'Criar conta'}
      </button>
    </div>
  );
}
