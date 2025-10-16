import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StrategyApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (withObservation: boolean, observation?: string) => void;
  onReject: (reason: string) => void;
  orderId: string;
}

export function StrategyApprovalDialog({
  open,
  onOpenChange,
  onApprove,
  onReject,
  orderId
}: StrategyApprovalDialogProps) {
  const [action, setAction] = useState<'approve' | 'approve-obs' | 'reject' | null>(null);
  const [text, setText] = useState('');

  const handleConfirm = () => {
    if (action === 'approve') {
      onApprove(false);
      handleClose();
    } else if (action === 'approve-obs') {
      if (text.trim()) {
        onApprove(true, text.trim());
        handleClose();
      }
    } else if (action === 'reject') {
      if (text.trim()) {
        onReject(text.trim());
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setAction(null);
    setText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Análise Estratégica do Pedido</DialogTitle>
          <DialogDescription>
            Pedido {orderId} - Selecione uma ação
          </DialogDescription>
        </DialogHeader>

        {!action ? (
          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => setAction('approve')}
            >
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Aprovar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Aprovar pedido sem observações e enviar para processo de compra
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => setAction('approve-obs')}
            >
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Aprovar com Observação</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Aprovar com ressalvas ou orientações para o processo de compra
                  </p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => setAction('reject')}
            >
              <div className="flex items-start gap-3 text-left">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Reprovar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Reprovar pedido com justificativa obrigatória
                  </p>
                </div>
              </div>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{
              backgroundColor: action === 'approve' ? '#f0fdf4' : 
                             action === 'approve-obs' ? '#eff6ff' : '#fef2f2'
            }}>
              {action === 'approve' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {action === 'approve-obs' && <AlertCircle className="w-5 h-5 text-blue-600" />}
              {action === 'reject' && <XCircle className="w-5 h-5 text-red-600" />}
              <span className="text-sm font-medium">
                {action === 'approve' && 'Aprovar Pedido'}
                {action === 'approve-obs' && 'Aprovar com Observação'}
                {action === 'reject' && 'Reprovar Pedido'}
              </span>
            </div>

            {action === 'approve' ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Confirme a aprovação do pedido. Ele será enviado automaticamente para o processo de compra.
              </p>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="text">
                  {action === 'approve-obs' ? 'Observação' : 'Justificativa'} 
                  <span className="text-red-500"> *</span>
                </Label>
                <Textarea
                  id="text"
                  placeholder={
                    action === 'approve-obs' 
                      ? 'Descreva as observações ou orientações para o processo de compra...'
                      : 'Descreva o motivo da reprovação...'
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {action && action !== 'approve-obs' && (
            <Button variant="outline" onClick={() => setAction(null)}>
              Voltar
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          {action && (
            <Button
              onClick={handleConfirm}
              disabled={action !== 'approve' && !text.trim()}
              style={{ 
                backgroundColor: action === 'reject' ? '#ef4444' : '#465EFF',
                color: 'white'
              }}
            >
              Confirmar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
