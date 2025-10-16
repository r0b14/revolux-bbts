import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { useAuth } from '../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginWrapper() {
  const { login } = useAuth() as any;
  const navigate = useNavigate();

  async function handleLogin(email: string, password: string) {
    await login(email, password);
    navigate('/dashboard');
  }

  return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />;
}

export function RegisterWrapper() {
  const navigate = useNavigate();

  return <RegisterPage onRegistered={async () => navigate('/login')} onCancel={() => navigate('/login')} />;
}
