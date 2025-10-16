import { Order } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ForecastsPageProps {
  orders: Order[];
}

export function ForecastsPage({ orders }: ForecastsPageProps) {
  // Mock forecast data
  const monthlyForecast = [
    { month: 'Out', real: 2400000, previsto: 2200000 },
    { month: 'Nov', real: 0, previsto: 2800000 },
    { month: 'Dez', real: 0, previsto: 3200000 },
    { month: 'Jan', real: 0, previsto: 2900000 },
    { month: 'Fev', real: 0, previsto: 2600000 },
    { month: 'Mar', real: 0, previsto: 3100000 },
  ];

  const categoryDistribution = [
    { name: 'Embalagens', value: 35, color: '#465EFF' },
    { name: 'Equipamentos', value: 28, color: '#8b5cf6' },
    { name: 'Tecnologia', value: 20, color: '#ec4899' },
    { name: 'Materiais', value: 12, color: '#f59e0b' },
    { name: 'Outros', value: 5, color: '#94a3b8' },
  ];

  const demandTrends = [
    { week: 'Sem 1', demanda: 45 },
    { week: 'Sem 2', demanda: 52 },
    { week: 'Sem 3', demanda: 48 },
    { week: 'Sem 4', demanda: 61 },
    { week: 'Sem 5', demanda: 55 },
    { week: 'Sem 6', demanda: 67 },
  ];

  const topItems = [
    { item: 'Filme stretch 500mm', forecast: 1200, trend: '+15%', status: 'high' },
    { item: 'Palete de madeira', forecast: 800, trend: '+8%', status: 'medium' },
    { item: 'Caixas onduladas', forecast: 10000, trend: '+22%', status: 'high' },
    { item: 'Fita adesiva', forecast: 2400, trend: '-5%', status: 'low' },
    { item: 'Etiquetas RFID', forecast: 15, trend: '+12%', status: 'medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Previsões e Análise Preditiva</h2>
        <p className="text-gray-500 mt-1">
          Insights baseados em dados históricos e padrões de consumo
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Previsão Nov/2025</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ 2.8M</div>
            <p className="text-xs text-green-600 mt-1">+27% vs. outubro</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Acurácia do Modelo</CardTitle>
              <BarChart3 className="w-4 h-4" style={{ color: '#465EFF' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">94.2%</div>
            <p className="text-xs text-gray-500 mt-1">Últimos 90 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Itens em Alta</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-xs text-orange-600 mt-1">+30% de demanda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Economia Prevista</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ 240K</div>
            <p className="text-xs text-green-600 mt-1">Via otimização</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Gastos - Próximos 6 Meses</CardTitle>
            <CardDescription>Comparação entre valores reais e previstos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: number) => 
                    new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="real" fill="#465EFF" name="Real" />
                <Bar dataKey="previsto" fill="#C2D6FF" name="Previsto" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Previsão de demanda por tipo de material</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demand Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Demanda Semanal</CardTitle>
          <CardDescription>Número de requisições geradas por semana</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={demandTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="demanda" 
                stroke="#465EFF" 
                strokeWidth={2}
                name="Requisições"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Items Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Top Itens - Previsão de Demanda</CardTitle>
          <CardDescription>Itens com maior demanda prevista para o próximo mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{item.item}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${
                        item.status === 'high' ? 'text-red-600' :
                        item.status === 'medium' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {item.trend}
                      </span>
                      {item.trend.startsWith('+') ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={item.status === 'high' ? 80 : item.status === 'medium' ? 50 : 30} 
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 min-w-[80px] text-right">
                      {item.forecast.toLocaleString('pt-BR')} un
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-orange-900">Alertas Preditivos</CardTitle>
          </div>
          <CardDescription className="text-orange-800">
            Ações recomendadas baseadas em análise preditiva
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
            <div>
              <p className="text-orange-900">
                <strong>Aumento de demanda:</strong> Previsão de crescimento de 22% em embalagens de papelão. Considere negociar volumes maiores com fornecedores.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
            <div>
              <p className="text-orange-900">
                <strong>Sazonalidade:</strong> Dezembro historicamente apresenta 35% mais requisições. Planeje antecipadamente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
            <div>
              <p className="text-orange-900">
                <strong>Otimização de custos:</strong> Consolidar pedidos de filme stretch pode gerar economia de até R$ 45K no próximo trimestre.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
