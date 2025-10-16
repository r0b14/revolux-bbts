// Em src/app/routes/UploadCsv.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/context/AuthContext'; // Para pegar o ID do usuário

export function UploadCsv() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setStatusMessage('Por favor, selecione um arquivo e esteja logado.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Iniciando upload...');

    try {
      // 1. Pedir a URL de upload para a nossa Azure Function
      setStatusMessage('Solicitando URL de upload segura...');
      
      // Constrói um caminho único para o arquivo do usuário
      const filePath = `csvs/${user.uid}/${Date.now()}-${selectedFile.name}`;
      
      const funcUrl = `https://${process.env.VITE_FUNC_APP_NAME}.azurewebsites.net/api/get-upload-url?path=${filePath}`;
      
      const response = await fetch(funcUrl);

      if (!response.ok) {
        throw new Error('Falha ao obter a URL de upload.');
      }

      const uploadUrl = await response.text();
      setStatusMessage('URL recebida. Enviando arquivo...');

      // 2. Enviar o arquivo CSV diretamente para o Azure Blob Storage usando a URL recebida
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob', // Header necessário para o Azure Blob Storage
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error('Falha ao enviar o arquivo para o Azure Storage.');
      }

      setStatusMessage('Upload concluído com sucesso! O arquivo será processado em breve.');
      
      // Aqui você pode, por exemplo, registrar no Firestore que um novo arquivo foi enviado.
      // Isso será útil para o dashboard saber que há novos dados para buscar.

    } catch (error) {
      console.error(error);
      setStatusMessage(`Erro durante o upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload de Arquivo CSV</h2>
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
        {isUploading ? 'Enviando...' : 'Enviar para Análise'}
      </Button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}