// (nenhum hook necessário aqui)
import { Order } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

interface StrategyHomePageProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onNavigateToOrders: () => void;
}

export function StrategyHomePage({ orders, onOrderClick, onNavigateToOrders }: StrategyHomePageProps) {
  // Pedidos aguardando análise estratégica
  const awaitingReview = orders.filter(o => 
    o.status === 'approved' || o.status === 'strategy-review'
  );

  // Pedidos com processo de compra em andamento
  const inPurchaseProcess = orders.filter(o => 
    o.status?.includes('quotation') || 
    o.status?.includes('payment') || 
    o.status === 'purchase-request'
  );

  // Pedidos urgentes
  const urgentOrders = awaitingReview.filter(o => {
    if (!o.deadline) return false;
    const deadline = new Date(o.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7;
  });

  // Pedidos aprovados
  const approvedOrders = orders.filter(o => 
    o.status === 'strategy-approved' || o.status === 'strategy-approved-with-obs'
  );

  // Pedidos recentes
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Valor total em análise
  const totalUnderReview = awaitingReview.reduce((sum, o) => 
    sum + (o.quantity * o.estimatedValue), 0
  );

  // Valor aprovado este mês
  const totalApproved = approvedOrders.reduce((sum, o) => 
    sum + (o.quantity * o.estimatedValue), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="dark:text-white">Painel Estratégico</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visão geral de pedidos e processos de compra
        </p>
      </div>

      {/* Alertas */}
      {urgentOrders.length > 0 && (
        <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-200">Pedidos Urgentes</AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-300">
            Você tem {urgentOrders.length} pedido(s) com prazo em até 7 dias aguardando análise.
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Aguardando Análise</CardTitle>
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl dark:text-white">{awaitingReview.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pedidos pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Processo de Compra</CardTitle>
              <ShoppingCart className="w-5 h-5" style={{ color: '#465EFF' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl dark:text-white">{inPurchaseProcess.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Valor em Análise</CardTitle>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl dark:text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(totalUnderReview)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aguardando decisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Aprovados Este Mês</CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl dark:text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(totalApproved)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{approvedOrders.length} pedidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas Prioritárias */}
      {awaitingReview.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tarefas Prioritárias</CardTitle>
                <CardDescription>Pedidos aguardando sua análise estratégica</CardDescription>
              </div>
              <Button onClick={onNavigateToOrders} variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {awaitingReview.slice(0, 3).map((order) => {
                const isUrgent = urgentOrders.some(u => u.id === order.id);
                const totalValue = order.quantity * order.estimatedValue;

                return (
                  <div
                    key={order.id}
                    onClick={() => onOrderClick(order)}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm dark:text-gray-200">{order.id}</span>
                          {isUrgent && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                              URGENTE
                            </span>
                          )}
                        </div>
                        <p className="text-sm dark:text-gray-300 mb-2">{order.item}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>Qtd: {order.quantity.toLocaleString('pt-BR')}</span>
                          <span>•</span>
                          <span>{order.costCenter}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm dark:text-gray-200">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(totalValue)}
                        </p>
                        <Button size="sm" className="mt-2" style={{ backgroundColor: '#465EFF' }}>
                          Analisar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas atualizações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y dark:divide-gray-700">
            {recentOrders.map((order) => {
              const statusLabels: Record<string, string> = {
                'approved': 'Aprovado pelo Analista',
                'strategy-review': 'Em análise estratégica',
                'strategy-approved': 'Aprovado',
                'strategy-approved-with-obs': 'Aprovado com observações',
                'strategy-rejected': 'Reprovado',
                'quotation-pending': 'Aguardando cotações',
                'payment-pending': 'Aguardando pagamento',
                'delivered': 'Entregue'
              };

              return (
                <div
                  key={order.id}
                  className="py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => onOrderClick(order)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm dark:text-gray-200">{order.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-300">{order.item}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
