import type { Metrics } from "./types";
import Papa from "papaparse";

/**
 * Tenta enviar para Azure Function se a variável VITE_AZURE_FN_URL estiver definida.
 * Caso contrário, faz uma análise local simples do CSV usando PapaParse e retorna Metrics.
 */
export async function analyzeOnAzure(file: File): Promise<Metrics> {
  const azureUrl = import.meta.env.VITE_AZURE_FN_URL as string | undefined;
  if (azureUrl) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${azureUrl.replace(/\/$/, "")}/analyze-csv`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Falha na análise (${res.status}) ${txt || ""}`.trim());
    }
    return res.json();
  }

  // Fallback local: parse CSV e computa métricas simples
  const text = await file.text();
  return new Promise<Metrics>((resolve, reject) => {
  Papa.parse(text, {
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (res: any) => {
        const data = (res.data as unknown) as string[][];
        if (!data || data.length === 0) {
          resolve({ rows: 0, columns: 0, missingCells: 0, missingRatio: 0, sampleRows: [] });
          return;
        }
        const columns = Math.max(...data.map(r => r.length));
        const rows = data.length - 1; // assume primeira linha cabeçalho
        const headers = data[0] as string[];
        let missingCells = 0;
        const columnStats: Record<string, { nonEmpty: number; empty: number; uniqueValues: number }> = {};
        const uniques: Record<string, Set<string>> = {};
        for (let c = 0; c < columns; c++) {
          columnStats[headers[c] || `col_${c}`] = { nonEmpty: 0, empty: 0, uniqueValues: 0 };
          uniques[headers[c] || `col_${c}`] = new Set();
        }
        const sampleRows: Array<Record<string, string | null>> = [];
        for (let r = 1; r < data.length; r++) {
          const row = data[r];
          const sampleRow: Record<string, string | null> = {};
          for (let c = 0; c < columns; c++) {
            const h = headers[c] || `col_${c}`;
            const val = row[c] ?? null;
            if (val === null || val === "") {
              missingCells++;
              columnStats[h].empty++;
            } else {
              columnStats[h].nonEmpty++;
              uniques[h].add(String(val));
            }
            sampleRow[h] = val;
          }
          if (sampleRows.length < 10) sampleRows.push(sampleRow);
        }
        for (const k of Object.keys(columnStats)) {
          columnStats[k].uniqueValues = uniques[k].size;
        }
        const totalCells = rows * columns || 1;
        const missingRatio = missingCells / totalCells;
        resolve({ rows, columns, missingCells, missingRatio, columnStats, sampleRows });
      },
      error: (err: any) => reject(err),
    });
  });
}
