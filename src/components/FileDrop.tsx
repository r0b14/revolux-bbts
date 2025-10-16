import React from "react";

export default function FileDrop({ onFile }: { onFile: (f: File) => void }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div className="border rounded p-4">
      <label className="block text-sm text-slate-600">Selecione um arquivo CSV</label>
      <input type="file" accept=".csv" onChange={handleChange} />
    </div>
  );
}
