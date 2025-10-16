import { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { OrdersTable } from '../OrdersTable';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, Filter, Download, Package, Database, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface OrderListingPageProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export function OrderListingPage({ orders, onOrderClick }: OrderListingPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Get unique sources
  const sources = Array.from(new Set(orders.map(o => o.source)));

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.costCenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || order.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Statistics
  const stats = {
    total: filteredOrders.length,
    needAnalysis: filteredOrders.filter(o => o.status === 'pending' || o.status === 'edited').length,
    awaitingApproval: filteredOrders.filter(o => o.status === 'pending').length,
    approved: filteredOrders.filter(o => o.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Listagem de pedidos</h2>
        <p className="text-gray-500 mt-1">
          Visualize e gerencie todos os pedidos do sistema
        </p>
      </div>

      {/* Stats - Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Pedidos */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Total de Pedidos</CardTitle>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.total}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: '100%',
                  backgroundColor: '#465EFF'
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Precisam de Análise */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Precisam de Análise</CardTitle>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.needAnalysis}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${stats.total > 0 ? (stats.needAnalysis / stats.total) * 100 : 0}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total > 0 ? Math.round((stats.needAnalysis / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        {/* Aguardam Aprovação */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Aguardam Aprovação</CardTitle>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.awaitingApproval}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${stats.total > 0 ? (stats.awaitingApproval / stats.total) * 100 : 0}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total > 0 ? Math.round((stats.awaitingApproval / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        {/* Já Aprovados */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500">Já Aprovados</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.approved}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por item, ID, centro de custo ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="deferred">Adiado</SelectItem>
                <SelectItem value="edited">Editado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[200px]">
                <Database className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Fonte de dados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fontes</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSourceFilter('all');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>
            Pedidos
            <span className="text-gray-500 ml-2">({filteredOrders.length})</span>
          </h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
        
        <OrdersTable 
          orders={filteredOrders}
          onOrderClick={onOrderClick}
        />
      </div>
    </div>
  );
}
