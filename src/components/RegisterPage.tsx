import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { createAccount } from '../app/services/authService';
import { auth } from '../app/services/firebase';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import AccountCreatedModal from './AccountCreatedModal';

interface RegisterPageProps {
  onRegistered?: (email?: string) => Promise<void> | void;
  onCancel?: () => void;
}

export function RegisterPage({ onRegistered, onCancel }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  async function handleRegister() {
    setErr(null);
    setLoading(true);
    try {
      // se o Firebase estiver disponível, checar se o email já possui método de login
      if (auth) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods && methods.length > 0) {
          setErr('Email já cadastrado. Provedor: ' + methods.join(', '));
          setLoading(false);
          return;
        }
      }

      await createAccount(email, password, name);
      setCreated(true);
    } catch (e: any) {
      setErr(e?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReset() {
    if (!auth) {
      setErr('Firebase não está configurado. Não é possível enviar email de redefinição.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setErr('Email de redefinição enviado (verifique sua caixa).');
    } catch (err: any) {
      setErr(err?.message || 'Erro ao enviar email de redefinição');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #C2D6FF, #f3f4f6)' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <div className="flex gap-2">
              <Button onClick={handleRegister} disabled={loading} className="flex-1">{loading ? 'Criando...' : 'Criar conta'}</Button>
              <Button variant="ghost" onClick={() => onCancel?.()} disabled={loading}>Cancelar</Button>
            </div>

            {err && err.includes('Email já cadastrado') && (
              <div className="mt-3">
                <p className="text-sm text-slate-700">Se este email for seu, você pode redefinir a senha:</p>
                <div className="mt-2 flex gap-2">
                  <Button onClick={handleSendReset}>Enviar redefinição de senha</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {created && (
        <AccountCreatedModal name={name || email} onClose={() => {
          setCreated(false);
          onRegistered?.(email);
        }} />
      )}
    </div>
  );
}
