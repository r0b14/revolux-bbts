import { useState } from 'react';
import { Order, OrderHistory } from '../types';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { FloatingChat } from './FloatingChat';
import { StrategyHomePage } from './pages/StrategyHomePage';
import { StrategyOrdersPage } from './pages/StrategyOrdersPage';
import { StrategyOrderDetailsPage } from './pages/StrategyOrderDetailsPage';
import { ForecastsPage } from './pages/ForecastsPage';
import { 
  LogOut, 
  Moon, 
  Sun,
  Home,
  List,
  X,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface StrategyAnalystHomeProps {
  onLogout: () => void;
  userEmail: string;
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  orderHistory: OrderHistory[];
  onAddHistory: (history: OrderHistory) => void;
}

type PageType = 'home' | 'orders' | 'forecasts' | 'order-details';

export function StrategyAnalystHome({ 
  onLogout, 
  userEmail, 
  orders,
  onUpdateOrder,
  orderHistory,
  onAddHistory
}: StrategyAnalystHomeProps) {
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage('order-details');
  };

  const handleApprove = (orderId: string, withObservation: boolean, observation?: string) => {
    const status = withObservation ? 'strategy-approved-with-obs' : 'strategy-approved';
    const updates: Partial<Order> = { 
      status: status as any,
      ...(withObservation && observation ? { strategyObservation: observation } : {}),
      purchaseProcess: {
        id: Date.now().toString(),
        orderId,
        stage: 'quotation-request',
        quotations: [],
      }
    };

    onUpdateOrder(orderId, updates);

    const historyEntry: OrderHistory = {
      id: Date.now().toString(),
      orderId,
      action: withObservation ? 'strategy-approved-with-obs' : 'strategy-approved',
      user: userEmail.split('@')[0],
      userEmail,
      timestamp: new Date().toISOString(),
      details: withObservation && observation 
        ? `Aprovado com observação: ${observation}` 
        : 'Pedido aprovado para processo de compra',
    };

    onAddHistory(historyEntry);

    toast.success(withObservation ? 'Pedido aprovado com observação!' : 'Pedido aprovado!', {
      description: 'O processo de compra foi iniciado.'
    });

    setCurrentPage('orders');
  };

  const handleReject = (orderId: string, reason: string) => {
    onUpdateOrder(orderId, { status: 'strategy-rejected' as any });

    const historyEntry: OrderHistory = {
      id: Date.now().toString(),
      orderId,
      action: 'strategy-rejected',
      user: userEmail.split('@')[0],
      userEmail,
      timestamp: new Date().toISOString(),
      details: `Pedido reprovado: ${reason}`,
    };

    onAddHistory(historyEntry);

    toast.error('Pedido reprovado', {
      description: 'A justificativa foi registrada no histórico.'
    });

    setCurrentPage('orders');
  };

  const handleUpdatePurchaseProcess = (orderId: string, updateData: any) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.purchaseProcess) return;

  // removed unused newStatus variable
    let historyAction: any = '';
    let historyDetails = '';

    switch (updateData.type) {
      case 'add-quotation':
        const updatedQuotations = [...(order.purchaseProcess.quotations || []), updateData.quotation];
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            quotations: updatedQuotations
          },
          status: 'quotation-pending' as any
        });
        historyAction = 'quotation-received';
        historyDetails = `Cotação recebida de ${updateData.quotation.supplierName} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(updateData.quotation.totalPrice)}`;
        break;

      case 'select-quotation':
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            selectedQuotation: updateData.quotationId,
            stage: 'quotation-approved'
          },
          status: 'quotation-approved' as any
        });
        const selectedQuot = order.purchaseProcess.quotations.find(q => q.id === updateData.quotationId);
        historyAction = 'quotation-approved';
        historyDetails = selectedQuot ? `Cotação aprovada: ${selectedQuot.supplierName}` : 'Cotação aprovada';
        break;

      case 'initiate-payment':
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            paymentStatus: 'processing'
          },
          status: 'payment-pending' as any
        });
        historyAction = 'payment-initiated';
        historyDetails = 'Processo de pagamento iniciado';
        break;

      case 'confirm-payment':
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            paymentStatus: 'completed',
            paymentDate: new Date().toISOString(),
            paymentBy: userEmail
          },
          status: 'payment-done' as any
        });
        historyAction = 'payment-completed';
        historyDetails = 'Pagamento confirmado';
        break;

      case 'schedule-delivery':
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            trackingNumber: updateData.trackingNumber
          },
          status: 'delivery-pending' as any
        });
        historyAction = 'delivery-scheduled';
        historyDetails = `Entrega agendada - Rastreamento: ${updateData.trackingNumber}`;
        break;

      case 'confirm-delivery':
        onUpdateOrder(orderId, {
          purchaseProcess: {
            ...order.purchaseProcess,
            deliveryDate: new Date().toISOString(),
            deliveryConfirmedBy: userEmail
          },
          status: 'delivered' as any
        });
        historyAction = 'delivered';
        historyDetails = 'Entrega confirmada';
        break;
    }

    if (historyAction) {
      const historyEntry: OrderHistory = {
        id: Date.now().toString(),
        orderId,
        action: historyAction,
        user: userEmail.split('@')[0],
        userEmail,
        timestamp: new Date().toISOString(),
        details: historyDetails,
      };

      onAddHistory(historyEntry);

      toast.success('Atualização registrada!', {
        description: historyDetails
      });
    }
  };

  const menuItems = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'orders' as PageType, label: 'Listagem de Pedidos', icon: List },
    { id: 'forecasts' as PageType, label: 'Previsões', icon: Home },
  ];

  const awaitingReview = orders.filter(o => 
    o.status === 'approved' || o.status === 'strategy-review'
  ).length;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        h-full
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className={`border-b border-gray-200 dark:border-gray-800 ${sidebarCollapsed ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-10 h-10 bg-[#465EFF] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  title={sidebarCollapsed ? 'Expandir menu' : 'Encolher menu'}
                >
                  <Bot className="w-6 h-6 text-[#FCFC30]" />
                </button>
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="text-lg dark:text-white">Revolux</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Análise Estratégica</p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const showBadge = item.id === 'orders' && awaitingReview > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center rounded-lg
                    transition-colors text-left relative
                    ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'}
                    ${isActive 
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#465EFF' } : {}}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {showBadge && sidebarCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {showBadge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {awaitingReview}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`border-t border-gray-200 dark:border-gray-800 mt-auto ${sidebarCollapsed ? 'p-4' : 'p-6'} space-y-2`}>
            {!sidebarCollapsed && (
              <div className="mb-3">
                <p className="text-sm truncate dark:text-gray-200">{userEmail}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Analista de Estratégia</p>
              </div>
            )}
            <Button
              variant="outline"
              className={`w-full ${sidebarCollapsed ? 'px-0' : ''}`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!sidebarCollapsed && <span className="ml-2">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
            </Button>
            <Button
              variant="outline"
              className={`w-full ${sidebarCollapsed ? 'px-0' : ''}`}
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-auto">
          {currentPage === 'home' && (
            <StrategyHomePage 
              orders={orders}
              onOrderClick={handleOrderClick}
              onNavigateToOrders={() => setCurrentPage('orders')}
            />
          )}
          {currentPage === 'orders' && (
            <StrategyOrdersPage 
              orders={orders}
              onOrderClick={handleOrderClick}
            />
          )}
          {currentPage === 'forecasts' && (
            <ForecastsPage 
              orders={orders}
            />
          )}
          {currentPage === 'order-details' && selectedOrder && (
            <StrategyOrderDetailsPage
              order={selectedOrder}
              onBack={() => setCurrentPage('orders')}
              onApprove={handleApprove}
              onReject={handleReject}
              onUpdatePurchaseProcess={handleUpdatePurchaseProcess}
              orderHistory={orderHistory.filter(h => h.orderId === selectedOrder.id)}
              userEmail={userEmail}
            />
          )}
        </main>
      </div>

      {/* Floating Chat */}
      <FloatingChat orders={orders} userName={userEmail} userProfile="strategy-analyst" />
    </div>
  );
}
