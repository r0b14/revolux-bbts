export type Metrics = {
  // Básicos
  rows: number;
  columns: number;
  // número absoluto de células vazias
  missingCells: number;
  // razão de células faltantes (0..1)
  missingRatio: number;

  // Estatísticas por coluna (opcional)
  columnStats?: Record<string, {
    nonEmpty: number;
    empty: number;
    uniqueValues: number;
  }>;

  // Amostra das primeiras linhas (até 10)
  sampleRows?: Array<Record<string, string | null>>;

  // Campos opcionais para evolução (MVP não depende deles)
  cmmBySku?: Record<string, number>;
  leadTimeDaysAvg?: number;
  anomalies?: string[];
};

export type AzureAnalysisResult = {
  metrics: Metrics;
  insights?: string[];
};

export type UploadStatus = "pending" | "processed" | "error";

export type UploadDoc = {
  ownerUid: string;
  fileName: string;
  fileSize: number;
  status: UploadStatus;
  createdAt: any;          // firestore Timestamp
  processedAt?: any;
  errorMessage?: string | null;
  metrics?: Metrics | null;
  insights?: string | null;
  storagePath?: string | null; // ficará null no MVP (sem Storage)
};
