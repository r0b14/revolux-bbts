import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { useAuth } from '../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginWrapper() {
  const { login } = useAuth() as any;
  const navigate = useNavigate();

  async function handleLogin(email: string, password: string) {
    const role = await login(email, password);
    if (role === 'gestor' || role === 'admin') {
      navigate('/strategy');
    } else {
      navigate('/dashboard');
    }
  }

  return <LoginPage onLogin={handleLogin} />;
}

export function RegisterWrapper() {
  const navigate = useNavigate();

  return <RegisterPage onRegistered={async () => navigate('/login')} onCancel={() => navigate('/login')} />;
}
