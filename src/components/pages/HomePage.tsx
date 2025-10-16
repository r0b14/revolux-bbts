import { useState } from 'react';

import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Bell, AlertCircle, Clock, TrendingUp, Lightbulb } from 'lucide-react';
import { UploadAssistantSheet } from '../UploadAssistantSheet';
import { AITaskAgent } from '../AITaskAgent';

interface HomePageProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export function HomePage({ orders, onOrderClick }: HomePageProps) {
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const urgentOrders = pendingOrders.filter(o => {
    if (!o.deadline) return false;
    const deadline = new Date(o.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7;
  });

  const ordersWithComments = orders.filter(o => o.comment && o.mentionedUser);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Gerar tarefas dinâmicas baseadas nos pedidos - mostrar solicitações individuais
  const aiTasks = [
    // Primeira solicitação pendente individual
    ...(pendingOrders[0] ? [{
      id: 'pending-order-1',
      title: `Analisar ${pendingOrders[0].item}`,
      description: `Pedido ${pendingOrders[0].id} aguardando aprovação. Quantidade: ${pendingOrders[0].quantity} un.`,
      priority: 'high' as const,
      type: 'action' as const,
      action: () => onOrderClick(pendingOrders[0]),
      actionLabel: 'Analisar agora'
    }] : []),
    // Segunda solicitação pendente individual
    ...(pendingOrders[1] ? [{
      id: 'pending-order-2',
      title: `Revisar ${pendingOrders[1].item}`,
      description: `Pedido ${pendingOrders[1].id} precisa de validação. Valor estimado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendingOrders[1].quantity * pendingOrders[1].estimatedValue)}`,
      priority: 'high' as const,
      type: 'action' as const,
      action: () => onOrderClick(pendingOrders[1]),
      actionLabel: 'Revisar pedido'
    }] : []),
    // Pedido aprovado que precisa de revisão
    ...(ordersWithComments[0] ? [{
      id: 'review-approved',
      title: `Revisão solicitada: ${ordersWithComments[0].item}`,
      description: ordersWithComments[0].comment || 'Comentário adicionado no pedido aprovado.',
      priority: 'medium' as const,
      type: 'warning' as const,
      action: () => onOrderClick(ordersWithComments[0]),
      actionLabel: 'Ver comentário'
    }] : []),
    // Upload de dados
    {
      id: 'upload-data',
      title: 'Otimize seu fluxo com IA',
      description: 'Envie planilhas ou documentos e deixe o sistema gerar pedidos automaticamente.',
      priority: 'low' as const,
      type: 'info' as const,
      action: () => setUploadSheetOpen(true),
      actionLabel: 'Me ajude a pensar'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2>Suas atividades de hoje</h2>
          <p className="text-gray-500 mt-1">
            Tarefas priorizadas e organizadas para você
          </p>
        </div>
        <Button onClick={() => setUploadSheetOpen(true)} style={{ backgroundColor: '#465EFF' }}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Me ajude a pensar
        </Button>
      </div>

      {/* AI Task Agent */}
      <AITaskAgent tasks={aiTasks} />

      {/* Notificações e Alertas */}
      {urgentOrders.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900">Pedidos Urgentes</AlertTitle>
          <AlertDescription className="text-orange-800">
            Você tem {urgentOrders.length} pedido(s) com prazo de entrega em até 7 dias que precisam de análise.
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Pendentes de Análise</CardTitle>
              <Bell className="w-4 h-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{pendingOrders.length}</div>
            <p className="text-xs text-gray-500 mt-1">Aguardando sua Analise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Prazo Crítico</CardTitle>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{urgentOrders.length}</div>
            <p className="text-xs text-gray-500 mt-1">Vencimento em até 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Valor Total Pendente</CardTitle>
              <TrendingUp className="w-4 h-4" style={{ color: '#465EFF' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {new Intl.NumberFormat('pt-BR', { 
                notation: 'compact',
                style: 'currency', 
                currency: 'BRL' 
              }).format(pendingOrders.reduce((sum, o) => sum + o.estimatedValue, 0))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Em requisições pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <div>
        <div className="mb-4">
          <h3>Atividades Recentes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Últimas ações realizadas no sistema
          </p>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onOrderClick(order)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'approved' ? 'bg-green-100 text-green-800' :
                          order.status === 'deferred' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status === 'pending' ? 'Pendente' :
                           order.status === 'approved' ? 'Aprovado' :
                           order.status === 'deferred' ? 'Adiado' : 'Editado'}
                        </span>
                      </div>
                      <p className="text-sm">{order.item}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{order.source}</p>
                        {order.comment && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            Comentário pendente
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Assistant Sheet */}
      <UploadAssistantSheet 
        open={uploadSheetOpen}
        onOpenChange={setUploadSheetOpen}
      />
    </div>
  );
}
