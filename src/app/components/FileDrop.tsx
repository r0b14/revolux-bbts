import { useRef } from "react";

export default function FileDrop({ onFile }: { onFile: (f: File) => void; }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className="border-2 border-dashed rounded-2xl p-8 text-center bg-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
    >
      <p className="mb-3">Arraste e solte um CSV aqui</p>
      <p className="mb-4 text-sm text-slate-500">ou</p>
      <button
        className="px-4 py-2 rounded bg-slate-900 text-white"
        onClick={() => ref.current?.click()}
      >Escolher arquivo</button>
      <input
        ref={ref} type="file" accept=".csv,text/csv" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}
