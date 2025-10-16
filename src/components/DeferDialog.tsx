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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Clock, Calendar } from 'lucide-react';

interface DeferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDefer: (justification: string, reminderDays: number) => void;
}

const reminderOptions = [
  { value: '1', label: '1 dia', days: 1 },
  { value: '3', label: '3 dias', days: 3 },
  { value: '7', label: '1 semana', days: 7 },
  { value: '14', label: '2 semanas', days: 14 },
  { value: '30', label: '1 mês', days: 30 },
  { value: '60', label: '2 meses', days: 60 },
  { value: '90', label: '3 meses', days: 90 },
];

export function DeferDialog({ open, onOpenChange, onDefer }: DeferDialogProps) {
  const [justification, setJustification] = useState('');
  const [reminderDays, setReminderDays] = useState('7'); // Default: 1 semana

  const handleDefer = () => {
    if (justification.trim()) {
      const selectedOption = reminderOptions.find(opt => opt.value === reminderDays);
      onDefer(justification, selectedOption?.days || 7);
      setJustification('');
      setReminderDays('7');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setJustification('');
    setReminderDays('7');
    onOpenChange(false);
  };

  const getFormattedReminderDate = () => {
    const selectedOption = reminderOptions.find(opt => opt.value === reminderDays);
    if (!selectedOption) return '';
    
    const date = new Date();
    date.setDate(date.getDate() + selectedOption.days);
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Adiar Pedido
          </DialogTitle>
          <DialogDescription>
            Informe o motivo do adiamento e quando deseja ser lembrado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="justification">
              Justificativa <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Descreva o motivo do adiamento..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Lembrar em
            </Label>
            <Select value={reminderDays} onValueChange={setReminderDays}>
              <SelectTrigger id="reminder">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {reminderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reminderDays && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                Você será lembrado em <span className="font-medium">{getFormattedReminderDate()}</span>
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Atenção:</strong> O pedido ficará com status "Adiado" até a data do lembrete.
              Você receberá uma notificação quando chegar o momento de revisá-lo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleDefer}
            disabled={!justification.trim()}
            style={{ backgroundColor: '#465EFF' }}
          >
            Confirmar Adiamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
