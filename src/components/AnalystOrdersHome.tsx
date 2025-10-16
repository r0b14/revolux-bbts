import { useState } from 'react';
import { Order } from '../types';
import { Button } from './ui/button';

import { HomePage } from './pages/HomePage';
import { OrderListingPage } from './pages/OrderListingPage';
import { ForecastsPage } from './pages/ForecastsPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { FloatingChat } from './FloatingChat';
import { 
  LogOut, 
  Package, 
  Home,
  List,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AnalystOrdersHomeProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onLogout: () => void;
  userEmail: string;
}

type PageType = 'home' | 'orders' | 'forecasts' | 'order-details';

export function AnalystOrdersHome({ 
  orders, 
  onUpdateOrder, 
  onLogout,
  userEmail 
}: AnalystOrdersHomeProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage('order-details');
  };

  const handleApprove = (orderId: string) => {
    onUpdateOrder(orderId, { status: 'approved' });
    toast.success('Pedido aprovado com sucesso!', {
      description: `O pedido ${orderId} foi aprovado e registrado no histórico.`
    });
    setCurrentPage('orders');
  };

  const handleEdit = (orderId: string, updates: Partial<Order>) => {
    const currentOrder = orders.find(o => o.id === orderId);
    const shouldChangeStatus = currentOrder?.status === 'pending' && 
      (updates.quantity !== undefined || updates.estimatedValue !== undefined);
    
    onUpdateOrder(orderId, { 
      ...updates, 
      ...(shouldChangeStatus ? { status: 'edited' } : {})
    });
    
    toast.success('Pedido atualizado com sucesso!', {
      description: `As alterações do pedido ${orderId} foram salvas.`
    });
  };

  const handleDefer = (orderId: string, justification: string, reminderDays?: number) => {
    const reminderDate = new Date();
    if (reminderDays) {
      reminderDate.setDate(reminderDate.getDate() + reminderDays);
    }
    
    onUpdateOrder(orderId, { 
      status: 'deferred',
      reminderDate: reminderDays ? reminderDate.toISOString() : undefined
    });
    
    toast.success('Pedido adiado', {
      description: `${justification}${reminderDays ? ` - Lembrete em ${reminderDays} dia(s)` : ''}`
    });
    setCurrentPage('orders');
  };

  const menuItems = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'orders' as PageType, label: 'Listagem de Pedidos', icon: List },
    { id: 'forecasts' as PageType, label: 'Previsões', icon: TrendingUp },
  ];

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className={`border-b ${sidebarCollapsed ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-10 h-10 bg-[rgb(70,94,255)] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  title={sidebarCollapsed ? 'Expandir menu' : 'Encolher menu'}
                >
                  <Package className="w-6 h-6 text-white" />
                </button>
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="text-lg">Revolux</h2>
                    <p className="text-xs text-gray-500">Sistema de Aquisições</p>
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
              const showBadge = item.id === 'home' && pendingCount > 0;

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
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#465EFF' } : {}}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {showBadge && sidebarCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {showBadge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {pendingCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            {!sidebarCollapsed && (
              <div className="mb-3">
                <p className="text-sm truncate">{userEmail}</p>
                <p className="text-xs text-gray-500">Analista de Pedidos</p>
              </div>
            )}
            <Button 
              variant="outline" 
              size={sidebarCollapsed ? "icon" : "sm"}
              className="w-full"
              onClick={onLogout}
              title={sidebarCollapsed ? 'Sair' : ''}
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
      <div className="flex-1 flex flex-col min-w-0" style={{ maxHeight: '768px' }}>
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-auto">
          {currentPage === 'home' && (
            <HomePage 
              orders={orders}
              onOrderClick={handleOrderClick}
              onNavigateToOrders={() => setCurrentPage('orders')}
            />
          )}
          {currentPage === 'orders' && (
            <OrderListingPage 
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
            <OrderDetailsPage
              order={selectedOrder}
              onBack={() => setCurrentPage('orders')}
              onApprove={handleApprove}
              onEdit={handleEdit}
              onDefer={handleDefer}
            />
          )}
        </main>
      </div>

      {/* Floating Chat - Available on all pages */}
      <FloatingChat orders={orders} userName={userEmail} />
    </div>
  );
}
