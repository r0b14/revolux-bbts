import { useState } from 'react';
import { Order } from '../types';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

// page contents will render via nested routes (Outlet)
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
// toast intentionally unused here; child pages will show toasts

export function AnalystOrdersHome({
  orders,
  onLogout,
  userEmail,
  children
}: {
  // keep props for backward compatibility but primary navigation will use routes
  orders?: Order[];
  onLogout?: () => void;
  userEmail?: string;
  children?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'orders', label: 'Listagem de Pedidos', icon: List, path: '/orders' },
    { id: 'forecasts', label: 'Previsões', icon: TrendingUp, path: '/forecasts' },
  ];

  const currentOrders = orders ?? [];
  const pendingCount = currentOrders.filter(o => o.status === 'pending').length;

  const pathname = location.pathname;
  // const isOrderDetails = pathname.startsWith('/orders/') && !!params.id;
  const isOrders = pathname === '/orders';
  const isForecasts = pathname === '/forecasts';
  const isHome = pathname === '/dashboard' || pathname === '/';

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
              const Icon = item.icon as any;
              const isActive = (item.path === '/dashboard' && isHome) ||
                (item.path === '/orders' && isOrders) ||
                (item.path === '/forecasts' && isForecasts);
              const showBadge = item.path === '/dashboard' && pendingCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
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

        {/* Page Content - children rendered here (Outlet from parent) */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-auto">
          {children ?? <div />}
        </main>
      </div>

      {/* Floating Chat - Available on all pages */}
      <FloatingChat orders={orders ?? []} userName={userEmail ?? ''} />
    </div>
  );
}
