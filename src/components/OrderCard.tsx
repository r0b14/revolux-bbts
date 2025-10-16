import { Order } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package, DollarSign, Building2, Clock } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
  approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  deferred: { label: 'Adiado', className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' },
  edited: { label: 'Editado', className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  'strategy-review': { label: 'Em Análise', className: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
  'strategy-approved': { label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  'strategy-approved-with-obs': { label: 'Aprovado c/ Obs', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  'strategy-rejected': { label: 'Reprovado', className: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
  'purchase-request': { label: 'Solicitação de Compra', className: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' },
  'quotation-pending': { label: 'Aguardando Cotação', className: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' },
  'quotation-approved': { label: 'Cotação Aprovada', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  'payment-pending': { label: 'Aguardando Pagamento', className: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
  'payment-done': { label: 'Pagamento Realizado', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  'delivery-pending': { label: 'Aguardando Entrega', className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  'delivered': { label: 'Entregue', className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' }
};

export function OrderCard({ order, onClick }: OrderCardProps) {
  const status = statusConfig[order.status] || {
    label: order.status,
    className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow border-l-4"
      style={{ borderLeftColor: '#465EFF' }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{order.id}</span>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <CardTitle className="text-lg dark:text-white">{order.item}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quantidade</p>
              <p className="text-sm dark:text-gray-200">{order.quantity.toLocaleString('pt-BR')} un</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Valor Estimado</p>
              <p className="text-sm dark:text-gray-200">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(order.estimatedValue)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Centro de Custo</p>
            <p className="text-sm dark:text-gray-200">{order.costCenter}</p>
          </div>
        </div>

        {order.deadline && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Prazo</p>
              <p className="text-sm dark:text-gray-200">
                {new Date(order.deadline).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">Fonte de dados</p>
          <p className="text-xs mt-1" style={{ color: '#465EFF' }}>{order.source}</p>
        </div>
      </CardContent>
    </Card>
  );
}
