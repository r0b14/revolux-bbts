import Papa, { ParseResult } from "papaparse";
import { useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Row = Record<string, any>;

export default function CsvTable({ file }: { file: File }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [cols, setCols] = useState<string[]>([]);

  useMemo(() => {
    Papa.parse(file as any, {
      header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: (res: any) => {
        const data = res.data as Row[];
        setRows(data);
        setCols(Object.keys(data[0] ?? {}));
      }
    });
  }, [file]);

  const columns = useMemo<ColumnDef<Row>[]>(() =>
    cols.map((k) => ({ header: k, accessorKey: k })), [cols]);

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  if (!rows.length) return <div className="text-sm text-slate-500">Processando CSV…</div>;

  return (
    <div className="overflow-auto border rounded-lg bg-white">
      <table className="min-w-[640px] w-full text-sm">
        <thead className="bg-slate-100">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="px-3 py-2 text-left">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.slice(0, 100).map(r => (
            <tr key={r.id} className="odd:bg-white even:bg-slate-50">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-3 py-2">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 text-xs text-slate-500">Mostrando {Math.min(rows.length,100)} de {rows.length} linhas.</div>
    </div>
  );
}
