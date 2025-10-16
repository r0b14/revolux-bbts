import { Order } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
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

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pedido</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fonte</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                Nenhum pedido encontrado
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const status = statusConfig[order.status] || { 
                label: order.status, 
                className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' 
              };
              const totalValue = order.quantity * order.estimatedValue;
              
              return (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => onOrderClick(order)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm dark:text-white">{order.id}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{order.sku}</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate dark:text-white">{order.item}</p>
                      {order.supplier && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{order.supplier}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm dark:text-white">
                      {order.quantity.toLocaleString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm dark:text-white">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(totalValue)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.source}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderClick(order);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
