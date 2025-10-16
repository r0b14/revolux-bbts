import { Order } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Package, DollarSign, Building2, Clock } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300' },
  deferred: { label: 'Adiado', className: 'bg-gray-100 text-gray-800 border-gray-300' },
  edited: { label: 'Editado', className: 'bg-blue-100 text-blue-800 border-blue-300' }
};

export function OrderCard({ order, onClick }: OrderCardProps) {
  const status = statusConfig[order.status];

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
              <span className="text-xs text-gray-500">{order.id}</span>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <CardTitle className="text-lg">{order.item}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Quantidade</p>
              <p className="text-sm">{order.quantity.toLocaleString('pt-BR')} un</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Valor Estimado</p>
              <p className="text-sm">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(order.estimatedValue)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Centro de Custo</p>
            <p className="text-sm">{order.costCenter}</p>
          </div>
        </div>

        {order.deadline && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Prazo</p>
              <p className="text-sm">
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
