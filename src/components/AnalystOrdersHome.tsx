import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Order } from '../types';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { UploadAssistantSheet } from './UploadAssistantSheet';
import { useTheme } from './ThemeProvider';

import { HomePage } from './pages/HomePage';
import { OrderListingPage } from './pages/OrderListingPage';
import { ForecastsPage } from './pages/ForecastsPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { FloatingChat } from './FloatingChat';
import { 
  LogOut, 
  Home,
  List,
  TrendingUp,
  X,
  Moon,
  Sun,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../app/context/AuthContext';

interface AnalystOrdersHomeProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onLogout: () => void;
  userEmail: string;
  children?: React.ReactNode;
}

type PageType = 'home' | 'orders' | 'forecasts' | 'order-details';

export function AnalystOrdersHome({ 
  orders, 
  onUpdateOrder, 
  onLogout,
  userEmail,
  children
}: AnalystOrdersHomeProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const navigate = useNavigate();

  const location = useLocation();

  const menuItems = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'orders' as PageType, label: 'Listagem de Pedidos', icon: List },
    { id: 'forecasts' as PageType, label: 'Previsões', icon: TrendingUp },
  ];

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const { role } = useAuth() as any;
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors overflow-hidden">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Aquisições</p>
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
              const isActive = children ? (
                (item.id === 'home' && location.pathname.includes('/dashboard')) ||
                (item.id === 'orders' && location.pathname.includes('/orders')) ||
                (item.id === 'forecasts' && location.pathname.includes('/forecasts'))
              ) : currentPage === item.id;
              const showBadge = item.id === 'home' && pendingCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // If component rendered as a router layout (children present), navigate to the route.
                    if (children) {
                      if (item.id === 'home') navigate('/dashboard');
                      if (item.id === 'orders') navigate('/orders');
                      if (item.id === 'forecasts') navigate('/forecasts');
                      setSidebarOpen(false);
                      return;
                    }

                    // Fallback to internal state navigation for older flows
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            {!sidebarCollapsed && (
              <div className="mb-3">
                <p className="text-sm truncate dark:text-gray-200">{userEmail}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role === 'operador' ? 'Analista de Pedidos' : role === 'gestor' || role === 'admin' ? 'Analista de Estratégia' : 'Usuário'}</p>
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
          {/* If children provided (Router outlet) render it, otherwise fall back to internal navigation for older flows */}
          {children ? (
            children
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>

      {/* Floating Chat - Available on all pages */}
      <FloatingChat orders={orders} userName={userEmail} userProfile="orders-analyst" />
      {/* CSV Upload Assistant (visible for operadores) */}
      {role === 'operador' && (
        <>
          <button
            onClick={() => setUploadSheetOpen(true)}
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
            style={{ backgroundColor: '#465EFF', color: 'white' }}
            title="Enviar CSV"
          >
            <Upload className="w-6 h-6" />
          </button>
          <UploadAssistantSheet open={uploadSheetOpen} onOpenChange={setUploadSheetOpen} />
        </>
      )}
    </div>
  );
}
