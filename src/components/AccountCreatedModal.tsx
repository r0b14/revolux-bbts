import { Button } from './ui/button';

export default function AccountCreatedModal({ name, onClose }: { name: string; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold">Conta criada com sucesso</h3>
        <p className="mt-3 text-sm text-slate-700">Olá <strong>{name}</strong>, sua conta foi criada com sucesso.</p>
        <p className="mt-2 text-sm text-slate-600">Agora você pode entrar usando seu e-mail e senha.</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
}
