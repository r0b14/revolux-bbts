import { Order } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Clock, 
  AlertCircle, 
  Calendar,
  Package,
  ArrowRight,
  Flame
} from 'lucide-react';

interface CriticalOrderCardProps {
  order: Order;
  onClick: () => void;
  urgencyLevel: 'critical' | 'high' | 'medium';
}

const urgencyConfig = {
  critical: {
    label: 'Crítico',
    color: 'border-red-500 bg-red-50',
    badgeColor: 'bg-red-500 text-white',
    iconColor: 'text-red-600',
    progressColor: 'bg-red-500',
    icon: Flame
  },
  high: {
    label: 'Urgente',
    color: 'border-orange-500 bg-orange-50',
    badgeColor: 'bg-orange-500 text-white',
    iconColor: 'text-orange-600',
    progressColor: 'bg-orange-500',
    icon: AlertCircle
  },
  medium: {
    label: 'Atenção',
    color: 'border-yellow-500 bg-yellow-50',
    badgeColor: 'bg-yellow-500 text-white',
    iconColor: 'text-yellow-600',
    progressColor: 'bg-yellow-500',
    icon: Clock
  }
};

export function CriticalOrderCard({ order, onClick, urgencyLevel }: CriticalOrderCardProps) {
  const config = urgencyConfig[urgencyLevel];
  const Icon = config.icon;
  
  // Calcular dias até o prazo
  const daysUntilDeadline = order.deadline 
    ? Math.ceil((new Date(order.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calcular porcentagem de urgência (inversa dos dias)
  const urgencyPercentage = daysUntilDeadline 
    ? Math.max(0, Math.min(100, 100 - (daysUntilDeadline * 10)))
    : 0;

  const totalValue = order.quantity * order.estimatedValue;

  return (
    <Card 
      className={`border-l-4 ${config.color} hover:shadow-lg transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.badgeColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{order.id}</span>
                  <Badge className={config.badgeColor}>
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm mt-0.5 text-gray-500 font-mono">{order.sku}</p>
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <h4 className="line-clamp-2">{order.item}</h4>
            {order.supplier && (
              <p className="text-xs text-gray-500 mt-1">{order.supplier}</p>
            )}
          </div>

          {/* Deadline Progress */}
          {daysUntilDeadline !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-gray-600">
                    {daysUntilDeadline <= 0 
                      ? 'Prazo vencido!' 
                      : `${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'dia' : 'dias'} restantes`
                    }
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(order.deadline!).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${config.progressColor} transition-all`}
                  style={{ width: `${urgencyPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-gray-500">Quantidade</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Package className="w-3 h-3 text-gray-400" />
                <p className="text-sm">{order.quantity.toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Valor Total</p>
              <p className="text-sm mt-0.5">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  notation: 'compact'
                }).format(totalValue)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full transition-colors" 
            style={{ backgroundColor: '#465EFF' }}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Analisar agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
