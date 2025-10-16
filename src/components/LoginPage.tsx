import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Bot } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister?: () => void;
}

export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #C2D6FF, #f3f4f6)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#465EFF' }}>
              <Bot className="w-10 h-10" style={{ color: '#FCFC30' }} />
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
            <Button type="submit" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Entrar no sistema
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 mb-2">Usuários de demonstração:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>• <strong>analista.pedidos@revolux.com</strong> - Analista de Pedidos</p>
              <p>• <strong>analista.estrategia@revolux.com</strong> - Analista de Estratégia</p>
            </div>
          </div>
        </CardContent>
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ainda não tem conta?</p>
          <button
            onClick={() => onSwitchToRegister?.()}
            className="mt-2 text-sm font-medium hover:underline"
            style={{ color: '#465EFF' }}
          >
            Criar conta
          </button>
        </div>
      </Card>
    </div>
  );
}
