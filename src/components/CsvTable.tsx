import { useEffect, useState } from "react";

export default function CsvTable({ file }: { file: File }) {
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const r = new FileReader();
    r.onload = () => {
      const text = String(r.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean).slice(0, 10);
      setRows(lines.map((l) => l.split(",")));
    };
    r.readAsText(file);
  }, [file]);

  if (!rows.length) return <div className="text-sm text-slate-500">Arquivo vazio ou carregando...</div>;

  return (
    <div className="overflow-auto border rounded">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i === 0 ? "font-semibold bg-slate-50" : ""}>
              {r.map((c, j) => (
                <td key={j} className="px-2 py-1 border-b">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
