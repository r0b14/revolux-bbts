import { useState } from 'react';
import { Order } from '../types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  CheckCircle, 
  Edit, 
  Clock, 
  Package, 
  DollarSign, 
  Building2, 
  Calendar,
  User,
  Database
} from 'lucide-react';
import { EditOrderDialog } from './EditOrderDialog';
import { DeferDialog } from './DeferDialog';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (orderId: string) => void;
  onEdit: (orderId: string, updates: Partial<Order>) => void;
  onDefer: (orderId: string, justification: string, reminderDays?: number) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300' },
  deferred: { label: 'Adiado', className: 'bg-gray-100 text-gray-800 border-gray-300' },
  edited: { label: 'Editado', className: 'bg-blue-100 text-blue-800 border-blue-300' }
};

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
  onApprove,
  onEdit,
  onDefer,
}: OrderDetailsSheetProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deferDialogOpen, setDeferDialogOpen] = useState(false);

  if (!order) return null;

  const status = statusConfig[order.status];

  const handleApprove = () => {
    onApprove(order.id);
    onOpenChange(false);
  };

  const handleEdit = (updates: Partial<Order>) => {
    onEdit(order.id, updates);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="px-[24px] py-[16px]">
            <div className="flex items-center gap-2">
              <SheetTitle>{order.id}</SheetTitle>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <SheetDescription>
              Detalhes e ações disponíveis para este pedido
            </SheetDescription>
          </SheetHeader>

          <div className="mt-[24px] space-y-6 px-[41px] py-[0px] mr-[0px] mb-[-10px] ml-[0px]">
            {/* Informações do Item */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-500 px-[24px] py-[0px]">
                <Package className="w-4 h-4" />
                Informações do Item
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Item</p>
                  <p className="mt-1">{order.item}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Quantidade</p>
                    <p className="mt-1">{order.quantity.toLocaleString('pt-BR')} unidades</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valor Estimado</p>
                    <p className="mt-1">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(order.estimatedValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados Logísticos */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-500 px-[24px] py-[0px]">
                <Building2 className="w-4 h-4" />
                Dados Logísticos
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 px-[24px] py-[0px]">
                  <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Centro de Custo</p>
                    <p className="text-sm mt-1">{order.costCenter}</p>
                  </div>
                </div>
                {order.supplier && (
                  <div className="flex items-start gap-3 px-[24px] py-[0px]">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Fornecedor Sugerido</p>
                      <p className="text-sm mt-1">{order.supplier}</p>
                    </div>
                  </div>
                )}
                {order.deadline && (
                  <div className="flex items-start gap-3 px-[24px] py-[0px]">
                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Prazo de Entrega</p>
                      <p className="text-sm mt-1">
                        {new Date(order.deadline).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Informações de Rastreamento */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-500 px-[24px] py-[0px]">
                <Database className="w-4 h-4" />
                Rastreamento
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 px-[32px] px-[24px] py-[0px]">
                  <Database className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Fonte de Dados</p>
                    <p className="text-sm mt-1">{order.source}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-[24px] py-[0px]">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Data de Criação</p>
                    <p className="text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            {order.status === 'pending' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-gray-500 px-[24px] py-[0px]">Ações Disponíveis</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full px-[61px] py-[8px]" 
                      onClick={handleApprove}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar Pedido
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Dados
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full bg-[rgb(255,246,123)]"
                      onClick={() => setDeferDialogOpen(true)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Adiar Solicitação
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <EditOrderDialog
        order={order}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEdit}
      />

      <DeferDialog
        open={deferDialogOpen}
        onOpenChange={setDeferDialogOpen}
        onDefer={(justification, reminderDays) => {
          onDefer(order.id, justification, reminderDays);
          setDeferDialogOpen(false);
        }}
      />
    </>
  );
}
