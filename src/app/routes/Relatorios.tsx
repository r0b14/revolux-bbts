import { Protected } from "../components/Protected";
import Navbar from "../components/Navbar";

export default function Relatorios() {
  return (
    <Protected>
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <h1 className="text-2xl font-semibold mb-2">Relatórios</h1>
        <p className="text-sm text-slate-600">Em breve: filtros, exportação e histórico de uploads.</p>
      </main>
    </Protected>
  );
}
