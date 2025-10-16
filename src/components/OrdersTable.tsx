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

const statusConfig = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800 border-green-300' },
  deferred: { label: 'Adiado', className: 'bg-gray-100 text-gray-800 border-gray-300' },
  edited: { label: 'Editado', className: 'bg-blue-100 text-blue-800 border-blue-300' }
};

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
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
              const status = statusConfig[order.status];
              const totalValue = order.quantity * order.estimatedValue;
              
              return (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onOrderClick(order)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{order.id}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600">{order.sku}</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{order.item}</p>
                      {order.supplier && (
                        <p className="text-xs text-gray-500 truncate">{order.supplier}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm">
                      {order.quantity.toLocaleString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm">
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
                    <span className="text-xs text-gray-500">{order.source}</span>
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
