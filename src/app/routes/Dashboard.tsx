import { Protected } from "../components/Protected";
import Navbar from "../components/Navbar";
import { Role } from "../services/roles";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { mes: "Mai", cmm: 120 },
  { mes: "Jun", cmm: 140 },
  { mes: "Jul", cmm: 110 },
  { mes: "Ago", cmm: 150 },
  { mes: "Set", cmm: 170 },
  { mes: "Out", cmm: 160 },
];

export default function Dashboard() {
  return (
    <Protected allow={["admin","gestor"] as Role[]}>
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-white rounded-2xl p-4 border">
          <h2 className="font-medium mb-3">CMM (exemplo)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cmm" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </Protected>
  );
}
