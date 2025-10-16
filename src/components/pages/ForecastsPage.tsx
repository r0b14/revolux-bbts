import { useState, useMemo } from 'react';
import { Order } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle,
  MapPin,
  FileText,
  Building2,
  Clock
} from 'lucide-react';

interface ForecastsPageProps {
  orders: Order[];
}

// Mock data para o dashboard
const generateDemandData = () => {
  return [
    { mes: 'Jan', quantidade: 45, valor: 125000 },
    { mes: 'Fev', quantidade: 52, valor: 148000 },
    { mes: 'Mar', quantidade: 61, valor: 172000 },
    { mes: 'Abr', quantidade: 58, valor: 165000 },
    { mes: 'Mai', quantidade: 68, valor: 195000 },
    { mes: 'Jun', quantidade: 75, valor: 218000 },
    { mes: 'Jul', quantidade: 71, valor: 205000 },
    { mes: 'Ago', quantidade: 82, valor: 238000 },
    { mes: 'Set', quantidade: 78, valor: 225000 },
    { mes: 'Out', quantidade: 88, valor: 256000 },
    { mes: 'Nov', quantidade: 92, valor: 268000 },
    { mes: 'Dez', quantidade: 85, valor: 245000 },
  ];
};

const generateStateData = () => {
  return [
    { estado: 'SP', quantidade: 245, percentual: 28 },
    { estado: 'RJ', quantidade: 186, percentual: 21 },
    { estado: 'MG', quantidade: 142, percentual: 16 },
    { estado: 'RS', quantidade: 98, percentual: 11 },
    { estado: 'PR', quantidade: 87, percentual: 10 },
    { estado: 'BA', quantidade: 65, percentual: 7 },
    { estado: 'SC', quantidade: 42, percentual: 5 },
    { estado: 'Outros', quantidade: 15, percentual: 2 },
  ];
};

const generateObsolescenceData = () => {
  return [
    { mes: 'Jun', taxa: 3.2 },
    { mes: 'Jul', taxa: 3.5 },
    { mes: 'Ago', taxa: 3.8 },
    { mes: 'Set', taxa: 4.1 },
    { mes: 'Out', taxa: 4.5 },
    { mes: 'Nov', taxa: 4.3 },
  ];
};

const generateStockNeedData = () => {
  return {
    estoqueAtual: 450,
    pontoReposicao: 300,
    estoqueSeguranca: 200,
    estoqueMaximo: 600,
    necessidadeCompra: 0, // Calculado dinamicamente
  };
};

const generateReplenishmentSchedule = () => {
  return [
    { periodo: 'Semana 1', consumoProjetado: 65, estoqueProjetado: 385, reposicao: false },
    { periodo: 'Semana 2', consumoProjetado: 72, estoqueProjetado: 313, reposicao: false },
    { periodo: 'Semana 3', consumoProjetado: 68, estoqueProjetado: 245, reposicao: true },
    { periodo: 'Semana 4', consumoProjetado: 75, estoqueProjetado: 470, reposicao: false },
    { periodo: 'Semana 5', consumoProjetado: 70, estoqueProjetado: 400, reposicao: false },
    { periodo: 'Semana 6', consumoProjetado: 73, estoqueProjetado: 327, reposicao: false },
  ];
};

const generateSupplierData = () => {
  return [
    {
      id: '1',
      nome: 'Fornecedor Alpha Tech Ltda',
      contratoInicio: '2024-01-15',
      contratoFim: '2025-12-31',
      leadTime: 14, // dias
      precoMedio: 2850,
      avaliacaoQualidade: 4.5,
      totalPedidos: 48
    },
    {
      id: '2',
      nome: 'Beta Componentes S.A.',
      contratoInicio: '2023-06-01',
      contratoFim: '2025-05-31',
      leadTime: 21,
      precoMedio: 2720,
      avaliacaoQualidade: 4.2,
      totalPedidos: 35
    },
    {
      id: '3',
      nome: 'Gamma Supplies Corp',
      contratoInicio: '2024-03-10',
      contratoFim: '2024-12-15',
      leadTime: 10,
      precoMedio: 2950,
      avaliacaoQualidade: 4.8,
      totalPedidos: 52
    },
  ];
};

export function ForecastsPage({ orders }: ForecastsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12-months');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('1');

  // Dados do dashboard
  const demandData = useMemo(() => generateDemandData(), []);
  const stateData = useMemo(() => generateStateData(), []);
  const obsolescenceData = useMemo(() => generateObsolescenceData(), []);
  const stockNeed = useMemo(() => generateStockNeedData(), []);
  const replenishmentSchedule = useMemo(() => generateReplenishmentSchedule(), []);
  const suppliers = useMemo(() => generateSupplierData(), []);

  const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier) || suppliers[0];

  // Calcular necessidade de compra
  const needToBuy = stockNeed.estoqueAtual < stockNeed.pontoReposicao;
  const quantityToBuy = needToBuy ? (stockNeed.estoqueMaximo - stockNeed.estoqueAtual) : 0;

  // Verificar se o contrato estará vigente na semana de reposição
  const idealWeek = replenishmentSchedule.find(w => w.reposicao);
  const daysUntilReplenishment = idealWeek ? 14 : 0; // Semana 3 = ~14 dias
  const replenishmentDate = new Date();
  replenishmentDate.setDate(replenishmentDate.getDate() + daysUntilReplenishment);
  const contractEndDate = new Date(selectedSupplierData.contratoFim);
  const isContractValid = replenishmentDate <= contractEndDate;

  // Taxa de obsolescência atual
  const currentObsolescence = obsolescenceData[obsolescenceData.length - 1].taxa;
  const previousObsolescence = obsolescenceData[obsolescenceData.length - 2].taxa;
  const obsolescenceTrend = currentObsolescence > previousObsolescence ? 'up' : 'down';

  // Produtos únicos dos pedidos
  const uniqueProducts = useMemo(() => {
    const products = Array.from(new Set(orders.map(o => o.item)));
    return products.slice(0, 20); // Limitar para não poluir o dropdown
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="dark:text-white">Dashboard de Previsões</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Análise preditiva de estoque, demanda e fornecedores
        </p>
      </div>

      {/* Filtros Globais */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs dark:text-white">Filtros:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Produto</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Produtos</SelectItem>
                {uniqueProducts.map((product, idx) => (
                  <SelectItem key={idx} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Período</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">Últimos 7 dias</SelectItem>
                <SelectItem value="30-days">Últimos 30 dias</SelectItem>
                <SelectItem value="3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="6-months">Últimos 6 meses</SelectItem>
                <SelectItem value="12-months">Últimos 12 meses</SelectItem>
                <SelectItem value="year">Ano atual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Seção de Análise de Estoque e Demanda */}
      <div>
        <h3 className="text-lg mb-4 dark:text-white">Análise de Estoque e Demanda</h3>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Quantidade de solicitações x Valor - Dual Axis Line Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <CardTitle className="text-sm font-normal">Quantidade de Solicitações x Valor Total</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Correlação entre volume de pedidos e valor financeiro ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-xs dark:text-gray-400"
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs dark:text-gray-400"
                    label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    className="text-xs dark:text-gray-400"
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Valor', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'valor') return `R$ ${value.toLocaleString('pt-BR')}`;
                      return value;
                    }}
                    labelStyle={{ color: '#000' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #465EFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="quantidade" 
                    stroke="#465EFF" 
                    strokeWidth={3}
                    name="Quantidade de Solicitações"
                    dot={{ fill: '#465EFF', r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#FF8C00" 
                    strokeWidth={3}
                    name="Valor Total (R$)"
                    dot={{ fill: '#FF8C00', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grid para KPIs e gráficos menores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quantidade por Estado - Horizontal Bar Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <CardTitle className="text-sm font-normal">Solicitações por Estado</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Distribuição geográfica da demanda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis type="number" className="text-xs dark:text-gray-400" />
                    <YAxis 
                      dataKey="estado" 
                      type="category" 
                      width={80}
                      className="text-xs dark:text-gray-400"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #465EFF',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="quantidade" name="Quantidade">
                      {stateData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`rgba(70, 94, 255, ${0.3 + (entry.percentual / 100)})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Taxa de Obsolescência - KPI com Sparkline */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <CardTitle className="text-sm font-normal">Taxa de Obsolescência</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Percentual de peças com baixa rotatividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl dark:text-white">
                        {currentObsolescence.toFixed(1)}%
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {obsolescenceTrend === 'up' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">
                              +{(currentObsolescence - previousObsolescence).toFixed(1)}% vs. mês anterior
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">
                              {(currentObsolescence - previousObsolescence).toFixed(1)}% vs. mês anterior
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Evolução nos últimos 6 meses</p>
                    <ResponsiveContainer width="100%" height={60}>
                      <AreaChart data={obsolescenceData}>
                        <defs>
                          <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="taxa" 
                          stroke="#ff6b6b" 
                          strokeWidth={2}
                          fill="url(#colorTaxa)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Necessidade de Compra - Bullet Chart Simulado */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <CardTitle className="text-sm font-normal">Necessidade Real de Compra Baseada no Estoque</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Comparação do estoque atual com pontos de reposição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Indicador Visual tipo Bullet Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="dark:text-gray-300">Estoque Atual</span>
                    <span className="dark:text-white">{stockNeed.estoqueAtual} unidades</span>
                  </div>
                  
                  <div className="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {/* Zona de Segurança (vermelho claro) */}
                    <div 
                      className="absolute h-full bg-red-100 dark:bg-red-950/30"
                      style={{ 
                        width: `${(stockNeed.estoqueSeguranca / stockNeed.estoqueMaximo) * 100}%` 
                      }}
                    />
                    
                    {/* Zona de Reposição (amarelo) */}
                    <div 
                      className="absolute h-full bg-yellow-100 dark:bg-yellow-950/30"
                      style={{ 
                        left: `${(stockNeed.estoqueSeguranca / stockNeed.estoqueMaximo) * 100}%`,
                        width: `${((stockNeed.pontoReposicao - stockNeed.estoqueSeguranca) / stockNeed.estoqueMaximo) * 100}%` 
                      }}
                    />
                    
                    {/* Zona Ideal (verde) */}
                    <div 
                      className="absolute h-full bg-green-100 dark:bg-green-950/30"
                      style={{ 
                        left: `${(stockNeed.pontoReposicao / stockNeed.estoqueMaximo) * 100}%`,
                        width: `${((stockNeed.estoqueMaximo - stockNeed.pontoReposicao) / stockNeed.estoqueMaximo) * 100}%` 
                      }}
                    />
                    
                    {/* Barra de Estoque Atual */}
                    <div 
                      className="absolute h-full transition-all"
                      style={{ 
                        width: `${(stockNeed.estoqueAtual / stockNeed.estoqueMaximo) * 100}%`,
                        backgroundColor: '#465EFF'
                      }}
                    />
                    
                    {/* Marcador de Estoque Atual */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                      style={{ 
                        left: `${(stockNeed.estoqueAtual / stockNeed.estoqueMaximo) * 100}%` 
                      }}
                    />
                  </div>
                  
                  {/* Legenda */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-950/30 border border-red-300" />
                      <span className="dark:text-gray-400">Crítico (&lt;{stockNeed.estoqueSeguranca})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-950/30 border border-yellow-300" />
                      <span className="dark:text-gray-400">Repor (&lt;{stockNeed.pontoReposicao})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-950/30 border border-green-300" />
                      <span className="dark:text-gray-400">Ideal ({stockNeed.pontoReposicao}-{stockNeed.estoqueMaximo})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: '#465EFF' }} />
                      <span className="dark:text-gray-400">Atual ({stockNeed.estoqueAtual})</span>
                    </div>
                  </div>
                </div>

                {/* Status e Recomendação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    needToBuy 
                      ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' 
                      : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {needToBuy ? (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <span className={needToBuy ? 'text-orange-800 dark:text-orange-300' : 'text-green-800 dark:text-green-300'}>
                        {needToBuy ? 'Reposição Necessária' : 'Estoque Adequado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {needToBuy 
                        ? `Estoque abaixo do ponto de reposição (${stockNeed.pontoReposicao} un)`
                        : `Estoque acima do ponto de reposição`
                      }
                    </p>
                  </div>
                  
                  {needToBuy && (
                    <div className="p-4 rounded-lg border-2" style={{ 
                      backgroundColor: 'rgba(70, 94, 255, 0.05)',
                      borderColor: '#465EFF'
                    }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5" style={{ color: '#465EFF' }} />
                        <span className="dark:text-white" style={{ color: '#465EFF' }}>Quantidade Sugerida</span>
                      </div>
                      <p className="text-3xl dark:text-white mb-1">{quantityToBuy}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        unidades para atingir estoque máximo
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Semana Ideal de Reposição - Time Series Bar Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <CardTitle className="text-sm font-normal">Cronograma de Reposição Ideal</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Projeção de consumo e momento ideal para reposição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={replenishmentSchedule}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="periodo" 
                    className="text-xs dark:text-gray-400"
                  />
                  <YAxis 
                    className="text-xs dark:text-gray-400"
                    label={{ value: 'Consumo Projetado', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #465EFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="consumoProjetado" 
                    name="Consumo Projetado"
                    radius={[8, 8, 0, 0]}
                  >
                    {replenishmentSchedule.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.reposicao ? '#22c55e' : '#465EFF'}
                      />
                    ))}
                  </Bar>
                  <Line 
                    type="monotone" 
                    dataKey="estoqueProjetado" 
                    stroke="#ff6b6b" 
                    strokeWidth={2}
                    name="Estoque Projetado"
                    dot={{ fill: '#ff6b6b', r: 4 }}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm dark:text-green-400">
                      <strong>Recomendação:</strong> Realizar pedido na <strong>Semana 3</strong>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      O estoque atingirá o ponto de reposição (300 un) durante este período
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção de Fornecedor */}
      <div className="border-t pt-6 dark:border-gray-800">
        <div className="mb-6">
          <h3 className="text-lg dark:text-white">Análise de Fornecedores</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Métricas de desempenho e confiabilidade
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Filtro de Fornecedor - Estilo mais limpo */}
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400" />
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Métricas do Fornecedor - Estilo melhorado seguindo referência */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prazo Médio de Entrega */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <CardTitle className="text-sm font-normal">Prazo Médio de Entrega</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Tempo médio desde o pedido até a entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl dark:text-white">{selectedSupplierData.leadTime}</span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">dias</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>5.2% em relação ao mês anterior</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taxa de Confiabilidade - Gauge Chart */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  <CardTitle className="text-sm font-normal">Taxa de Confiabilidade</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Entregas realizadas conforme acordado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Gauge Chart Semicircular */}
                  <div className="relative flex justify-center items-end h-32">
                    <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
                      {/* Background arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        className="dark:stroke-gray-700"
                      />
                      {/* Progress arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="16"
                        strokeDasharray={`${(selectedSupplierData.avaliacaoQualidade / 5) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                      {/* Center text */}
                      <text
                        x="100"
                        y="85"
                        textAnchor="middle"
                        className="text-3xl fill-gray-900 dark:fill-white"
                        style={{ fontSize: '32px', fontWeight: 'bold' }}
                      >
                        {((selectedSupplierData.avaliacaoQualidade / 5) * 100).toFixed(1)}%
                      </text>
                    </svg>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Meta</span>
                    <div className="flex items-center gap-1">
                      <span className="dark:text-white">95%</span>
                      <Badge variant="outline" className="text-xs bg-orange-50 dark:bg-orange-950/20 text-orange-600 border-orange-200">
                        Próximo da Meta
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vigência do Contrato */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <CardTitle className="text-sm font-normal">Vigência do Contrato</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Período de validade do contrato atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Início do Contrato</p>
                      <p className="dark:text-white">
                        {new Date(selectedSupplierData.contratoInicio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fim do Contrato</p>
                      <p className="dark:text-white">
                        {new Date(selectedSupplierData.contratoFim).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-start gap-2">
                    {isContractValid ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${isContractValid ? 'text-green-600' : 'text-red-600'}`}>
                        Reposição Sugerida: {idealWeek ? idealWeek.periodo : 'N/A'}
                        {' '}({replenishmentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {isContractValid
                          ? '✓ Contrato estará vigente na data de reposição sugerida'
                          : '⚠ Contrato vencerá antes da reposição'}
                      </p>
                    </div>
                  </div>

                  {/* Dias Restantes */}
                  <div className="pt-2 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dias Restantes</p>
                    <p className="text-2xl" style={{ color: '#465EFF' }}>
                      {Math.max(
                        0,
                        Math.ceil(
                          (contractEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        )
                      )}{' '}
                      dias
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de Pedidos</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm dark:text-gray-300">Total de Pedidos</span>
                    <span className="text-lg dark:text-white">{selectedSupplierData.totalPedidos}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm dark:text-gray-300">Valor Médio por Pedido</span>
                    <span className="text-lg dark:text-white">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        notation: 'compact',
                      }).format(selectedSupplierData.precoMedio)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm dark:text-gray-300">Avaliação Geral</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg dark:text-white">{selectedSupplierData.avaliacaoQualidade.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
                <CardDescription>Operações relacionadas ao fornecedor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Histórico Completo
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Reunião
                </Button>
                <Button className="w-full justify-start" style={{ backgroundColor: '#465EFF' }}>
                  <Package className="w-4 h-4 mr-2" />
                  Criar Novo Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
