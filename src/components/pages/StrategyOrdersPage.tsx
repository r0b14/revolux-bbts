import { useState } from 'react';
import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  Package,
  ShoppingCart,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface StrategyOrdersPageProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export function StrategyOrdersPage({ orders, onOrderClick }: StrategyOrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtrar pedidos relevantes para análise estratégica
  const relevantOrders = orders.filter(o => 
    o.status === 'approved' || 
    o.status === 'strategy-review' ||
    o.status === 'strategy-approved' ||
    o.status === 'strategy-approved-with-obs' ||
    o.status === 'strategy-rejected' ||
    o.status === 'purchase-request' ||
    o.status?.includes('quotation') ||
    o.status?.includes('payment') ||
    o.status?.includes('delivery') ||
    o.status === 'delivered'
  );

  // Filtrar pedidos
  const filteredOrders = relevantOrders.filter(order => {
    const matchesSearch = 
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.costCenter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    forApproval: relevantOrders.filter(o => o.status === 'approved' || o.status === 'strategy-review').length,
    inPurchase: relevantOrders.filter(o => 
      o.status === 'purchase-request' ||
      o.status?.includes('quotation') || 
      o.status?.includes('payment') || 
      o.status?.includes('delivery')
    ).length,
    approvedWithObs: relevantOrders.filter(o => o.status === 'strategy-approved-with-obs').length,
    total: relevantOrders.length,
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      'approved': { label: 'Aguardando Análise', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
      'strategy-review': { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertCircle },
      'strategy-approved': { label: 'Aprovado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'strategy-approved-with-obs': { label: 'Aprovado c/ Obs', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'strategy-rejected': { label: 'Reprovado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
      'purchase-request': { label: 'Solicitação de Compra', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: ShoppingCart },
      'quotation-pending': { label: 'Aguardando Cotação', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: Clock },
      'quotation-approved': { label: 'Cotação Aprovada', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'payment-pending': { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      'payment-done': { label: 'Pagamento Realizado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'delivery-pending': { label: 'Aguardando Entrega', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Package },
      'delivered': { label: 'Entregue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  // Calcular urgência baseada no prazo
  const getUrgencyLevel = (deadline?: string) => {
    if (!deadline) return 'normal';
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return 'overdue';
    if (daysUntilDeadline <= 3) return 'critical';
    if (daysUntilDeadline <= 7) return 'urgent';
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue':
        return 'bg-red-50 dark:bg-red-950 border-l-4 border-red-500';
      case 'critical':
        return 'bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500';
      case 'urgent':
        return 'bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500';
      default:
        return '';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="dark:text-white">Listagem de Pedidos</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Acompanhamento e gestão estratégica de pedidos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: '#465EFF' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Para Aprovação</CardTitle>
              <AlertCircle className="w-5 h-5" style={{ color: '#465EFF' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl dark:text-white" style={{ color: '#465EFF' }}>
              {stats.forApproval}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aguardando análise
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Em Processo de Compra</CardTitle>
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-purple-600 dark:text-purple-400">
              {stats.inPurchase}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Aprovados c/ Obs</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-600 dark:text-green-400">
              {stats.approvedWithObs}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Com observações
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Total de Pedidos</CardTitle>
              <Package className="w-5 h-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-600 dark:text-gray-400">
              {stats.total}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              No sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por item, ID ou centro de custo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
          
          <div className="w-full sm:w-[240px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="approved">Aguardando Análise</SelectItem>
                <SelectItem value="strategy-review">Em Análise</SelectItem>
                <SelectItem value="strategy-approved">Aprovado</SelectItem>
                <SelectItem value="strategy-approved-with-obs">Aprovado c/ Obs</SelectItem>
                <SelectItem value="strategy-rejected">Reprovado</SelectItem>
                <SelectItem value="purchase-request">Solicitação de Compra</SelectItem>
                <SelectItem value="quotation-pending">Aguardando Cotação</SelectItem>
                <SelectItem value="quotation-approved">Cotação Aprovada</SelectItem>
                <SelectItem value="payment-pending">Aguardando Pagamento</SelectItem>
                <SelectItem value="payment-done">Pagamento Realizado</SelectItem>
                <SelectItem value="delivery-pending">Aguardando Entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
            {filteredOrders.some(o => getUrgencyLevel(o.deadline) !== 'normal') && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Pedidos com urgência destacados</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Centro de Custo</TableHead>
                    <TableHead className="text-center">Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    const totalValue = order.quantity * order.estimatedValue;
                    const urgency = getUrgencyLevel(order.deadline);
                    const urgencyColor = getUrgencyColor(urgency);

                    return (
                      <TableRow 
                        key={order.id} 
                        className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${urgencyColor}`}
                        onClick={() => onOrderClick(order)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {urgency !== 'normal' && (
                              <AlertTriangle 
                                className={`w-4 h-4 ${
                                  urgency === 'overdue' ? 'text-red-500' :
                                  urgency === 'critical' ? 'text-orange-500' :
                                  'text-yellow-500'
                                }`} 
                              />
                            )}
                            <span className="text-sm dark:text-gray-200">{order.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm dark:text-gray-200 max-w-[250px] truncate">
                              {order.item}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SKU: {order.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm dark:text-gray-200">{order.quantity}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm dark:text-gray-200">
                            {formatCurrency(order.estimatedValue)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm dark:text-gray-200">
                            {formatCurrency(totalValue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {order.costCenter}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {order.deadline ? (
                            <div className="flex flex-col items-center">
                              <span className={`text-sm ${
                                urgency === 'overdue' ? 'text-red-600 dark:text-red-400' :
                                urgency === 'critical' ? 'text-orange-600 dark:text-orange-400' :
                                urgency === 'urgent' ? 'text-yellow-600 dark:text-yellow-400' :
                                'dark:text-gray-200'
                              }`}>
                                {formatDate(order.deadline)}
                              </span>
                              {urgency === 'overdue' && (
                                <span className="text-xs text-red-500 dark:text-red-400">Atrasado</span>
                              )}
                              {urgency === 'critical' && (
                                <span className="text-xs text-orange-500 dark:text-orange-400">Crítico</span>
                              )}
                              {urgency === 'urgent' && (
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">Urgente</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="icon"
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
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      {filteredOrders.some(o => getUrgencyLevel(o.deadline) !== 'normal') && (
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Atrasado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Crítico (≤3 dias)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Urgente (≤7 dias)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
