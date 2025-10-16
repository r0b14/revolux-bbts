import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Upload, FileSpreadsheet, FileText, File, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UploadAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadAssistantSheet({ open, onOpenChange }: UploadAssistantSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const validExtensions = ['.pdf', '.xlsx', '.xls', '.csv', '.xml'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Formato não suportado', {
        description: 'Por favor, envie arquivos PDF, XLSX, CSV ou XML.'
      });
      return;
    }

    setUploadedFile(file);
    toast.success('Arquivo carregado!', {
      description: `${file.name} está pronto para ser processado.`
    });
  };

  const handleProcess = () => {
    if (!uploadedFile) return;
    
    // Simular processamento
    toast.success('Processamento iniciado!', {
      description: 'O sistema está analisando seus dados e gerará pedidos automaticamente.'
    });
    
    setUploadedFile(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Me ajude a pensar</SheetTitle>
          <SheetDescription>
            Envie seus arquivos e deixe a IA do Revolux analisar e gerar pedidos automaticamente
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Explicação */}
          <div className="rounded-lg px-[32px] py-[16px]" style={{ backgroundColor: '#C2D6FF', borderColor: '#465EFF', borderWidth: '1px' }}>
            <h3 className="text-sm mb-2" style={{ color: '#1e3a8a' }}>Como funciona?</h3>
            <p className="text-sm" style={{ color: '#1e40af' }}>
              Nosso assistente inteligente analisa seus arquivos e identifica automaticamente 
              necessidades de materiais, equipamentos ou recursos. O sistema gera pedidos 
              otimizados com base em padrões históricos e previsões de demanda.
            </p>
          </div>

          {/* Formatos Aceitos */}
          <div>
            <h3 className="text-sm mb-3">Formatos aceitos</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm">PDF</p>
                  <p className="text-xs text-gray-500">Documentos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm">Excel</p>
                  <p className="text-xs text-gray-500">.xlsx, .xls</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm">CSV</p>
                  <p className="text-xs text-gray-500">Planilhas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <File className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm">XML</p>
                  <p className="text-xs text-gray-500">Dados estruturados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <h3 className="text-sm mb-3">Enviar arquivo</h3>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-lg p-8 transition-colors text-center border-gray-300 hover:border-gray-400"
              style={isDragging ? { 
                borderColor: '#465EFF', 
                backgroundColor: '#C2D6FF' 
              } : {}}
            >
              {uploadedFile ? (
                <div className="space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arraste seu arquivo aqui ou
                  </p>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.csv,.xml"
                      onChange={handleFileInput}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>Selecionar arquivo</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Exemplos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm mb-2">Exemplos de arquivos</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Planilhas de inventário e níveis de estoque</li>
              <li>• Relatórios de consumo de materiais</li>
              <li>• Previsões de demanda por período</li>
              <li>• Listas de equipamentos com necessidade de manutenção</li>
              <li>• Requisições consolidadas de múltiplos setores</li>
            </ul>
          </div>

          {/* Action Button */}
          {uploadedFile && (
            <Button className="w-full" onClick={handleProcess}>
              <Upload className="w-4 h-4 mr-2" />
              Processar e Gerar Pedidos
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
