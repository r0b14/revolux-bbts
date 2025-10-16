import { Protected } from "../../components/Protected";
import Navbar from "../../components/Navbar";
import FileDrop from "../../components/FileDrop";
import CsvTable from "../../components/CsvTable";
import { useState } from "react";
import type { Role } from "../services/roles";
import { createUploadMeta, finalizeUpload, failUpload } from "../services/firestoreUploads";
import { analyzeOnAzure } from "../services/azure";
import type { Metrics } from "../services/types";

export default function UploadCsv() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(f: File) {
    setFile(f);
    setMetrics(null);
    setError(null);
    // cria o doc em Firestore com status=pending
    try {
      const id = await createUploadMeta(f);
      setUploadId(id);
    } catch (e: any) {
      setError(e.message || "Erro ao criar metadados do upload");
    }
  }

  async function handleProcess() {
    if (!file || !uploadId) return;
    setProcessing(true);
    setError(null);
    try {
      const m = await analyzeOnAzure(file); // chama a Azure Function
      setMetrics(m);
      await finalizeUpload(uploadId, m);    // grava métricas no Firestore
    } catch (e: any) {
      const msg = e.message || "Falha ao processar CSV";
      setError(msg);
      if (uploadId) await failUpload(uploadId, msg);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Protected allow={["admin","gestor"] as Role[]}>
      <Navbar />
      <main className="mx-auto max-w-6xl p-4 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upload de CSV</h1>
          <div className="text-sm text-slate-500">
            {uploadId ? <>Upload ID: <span className="font-mono">{uploadId}</span></> : null}
          </div>
        </header>

        <FileDrop onFile={handleSelect} />

        {file && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
                onClick={handleProcess}
                disabled={processing}
              >
                {processing ? "Processando na Azure…" : "Processar no servidor (Azure)"}
              </button>
              <span className="text-sm text-slate-600">{file.name} • {(file.size/1024).toFixed(0)} KB</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-medium">Preview</h2>
              <CsvTable file={file} />
            </div>

            {metrics && (
              <div className="border rounded-xl bg-white p-4">
                <h3 className="font-semibold mb-2">Métricas</h3>
                <ul className="text-sm grid grid-cols-2 gap-2">
                  <li><b>Linhas:</b> {metrics.rows}</li>
                  <li><b>Colunas:</b> {metrics.columns}</li>
                  <li className="col-span-2">
                    <b>% faltantes:</b> {(metrics.missingRatio * 100).toFixed(2)}%
                  </li>
                </ul>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}
          </section>
        )}
      </main>
    </Protected>
  );
}
