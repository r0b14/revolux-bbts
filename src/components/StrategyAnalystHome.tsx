import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FloatingChat } from './FloatingChat';
import { LogOut, Package, TrendingUp, BarChart3, Users } from 'lucide-react';

interface StrategyAnalystHomeProps {
  onLogout: () => void;
  userEmail: string;
  orders?: any[];
}

export function StrategyAnalystHome({ onLogout, userEmail, orders = [] }: StrategyAnalystHomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#465EFF' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>Revolux</h1>
                <p className="text-xs text-gray-500">Analista de Estratégia de Compra</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm">{userEmail}</p>
                <p className="text-xs text-gray-500">Analista de Estratégia</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2>Painel Estratégico de Compras</h2>
          <p className="text-gray-500 mt-1">
            Visão consolidada e análises estratégicas do sistema de aquisições
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8" style={{ color: '#465EFF' }} />
                <span className="text-2xl">R$ 2.4M</span>
              </div>
              <CardTitle className="mt-4">Volume de Compras</CardTitle>
              <CardDescription>
                Total estimado em aquisições este mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600">
                +12% vs. mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8" style={{ color: '#465EFF' }} />
                <span className="text-2xl">23</span>
              </div>
              <CardTitle className="mt-4">Fornecedores Ativos</CardTitle>
              <CardDescription>
                Parceiros com contratos vigentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                3 novos este trimestre
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8" style={{ color: '#465EFF' }} />
                <span className="text-2xl">8.2%</span>
              </div>
              <CardTitle className="mt-4">Economia Gerada</CardTitle>
              <CardDescription>
                Otimização via análise preditiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600">
                R$ 196K economizados
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for future features */}
        <div className="mt-8 bg-white rounded-lg border p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-500 mb-2">Área em Desenvolvimento</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            O dashboard completo do Analista de Estratégia incluirá análises avançadas, 
            previsões de demanda, comparativos de fornecedores e relatórios estratégicos.
          </p>
        </div>
      </main>

      {/* Floating Chat */}
      <FloatingChat orders={orders} userName={userEmail} />
    </div>
  );
}
