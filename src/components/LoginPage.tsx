import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Package, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void> | void;
  onSwitchToRegister?: () => void;
  infoMessage?: string | null;
}

export function LoginPage({ onLogin, onSwitchToRegister, infoMessage }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (error: any) {
      const code = error?.code ? `${error.code} — ` : '';
      setErr(code + (error?.message || 'Erro ao autenticar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #C2D6FF, #f3f4f6)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#465EFF' }}>
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Revolux</CardTitle>
            <CardDescription className="mt-2">
              Sistema Inteligente de Gestão de Aquisições Logísticas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@revolux.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="w-4 h-4 mr-2" />
              {loading ? 'Entrando...' : 'Entrar no sistema'}
            </Button>
          </form>
          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
          {infoMessage && <div className="mt-3 text-sm text-green-700">{infoMessage}</div>}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 mb-2">Usuários de demonstração:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>• <strong>analista.pedidos@revolux.com</strong> - Analista de Pedidos</p>
              <p>• <strong>analista.estrategia@revolux.com</strong> - Analista de Estratégia</p>
            </div>
          </div>
        </CardContent>
          <div className="px-6 pb-6 text-center">
            <span className="text-sm text-slate-600 mr-2">Ainda não tem conta?</span>
            <button
              type="button"
              className="text-sky-600 underline text-sm hover:text-sky-800 hover:underline-offset-2 transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => onSwitchToRegister?.()}
              aria-label="Cadastre-se"
            >
              Cadastre-se
            </button>
          </div>
      </Card>
    </div>
  );
}
