import { useState } from 'react';
import * as React from 'react';
import { Order, OrderHistory, SupplierQuotation } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// Textarea not used in this file (dialogs/components use their own)
import { Label } from '../ui/label';
// select UI not used in this file
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Calendar,
  Building2,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  History as HistoryIcon,
  ShoppingCart,
  TrendingUp,
  Truck,
  CreditCard,
  AlertCircle,
  Plus,
  // Send icon not used here
} from 'lucide-react';
import { StrategyApprovalDialog } from '../StrategyApprovalDialog';
import { useAuth } from '../../app/context/AuthContext';

interface StrategyOrderDetailsPageProps {
  order: Order;
  onBack: () => void;
  onApprove: (orderId: string, withObservation: boolean, observation?: string) => void;
  onReject: (orderId: string, reason: string) => void;
  onUpdatePurchaseProcess: (orderId: string, updates: any) => void;
  orderHistory: OrderHistory[];
  userEmail: string;
}

export function StrategyOrderDetailsPage({ 
  order, 
  onBack, 
  onApprove, 
  onReject,
  onUpdatePurchaseProcess,
  orderHistory,
  userEmail
}: StrategyOrderDetailsPageProps) {
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [quotationSupplier, setQuotationSupplier] = useState('');
  const [quotationPrice, setQuotationPrice] = useState('');
  const [quotationDelivery, setQuotationDelivery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  // comment state not needed in strategy details (comments handled elsewhere)

  const totalValue = order.quantity * order.estimatedValue;

  // Status atual do pedido
  const canApprove = order.status === 'approved' || order.status === 'strategy-review';
  const isInPurchaseProcess = order.status?.includes('quotation') || 
                               order.status?.includes('payment') || 
                               order.status === 'purchase-request';
  
  const quotations = order.purchaseProcess?.quotations || [];
  const selectedQuotation = quotations.find(q => q.id === order.purchaseProcess?.selectedQuotation);

  // Função para obter informações do status
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      'approved': { label: 'Aguardando Análise', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
      'strategy-review': { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertCircle },
      'strategy-approved': { label: 'Aprovado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'strategy-approved-with-obs': { label: 'Aprovado c/ Obs', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'strategy-rejected': { label: 'Reprovado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
      'purchase-request': { label: 'Solicitação de Compra', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: ShoppingCart },
      'quotation-pending': { label: 'Aguardando Cotação', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: Clock },
      'quotation-approved': { label: 'Cotação Aprovada', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'payment-pending': { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      'payment-done': { label: 'Pagamento Realizado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      'delivery-pending': { label: 'Aguardando Entrega', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Package },
      'delivered': { label: 'Entregue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  const statusInfo = getStatusInfo(order.status);

  const { role } = useAuth() as any;

  // Timeline do processo
  const processStages = [
    { 
      id: 'analysis', 
      label: 'Análise de Necessidade', 
      status: 'completed', 
      icon: AlertCircle,
      color: '#f59e0b'
    },
    { 
      id: 'awaiting-tc', 
      label: 'Aguardando Aprovação TC', 
      status: (order.status === 'pending' || order.status === 'edited' || 
               order.status?.includes('approved') || order.status?.includes('quotation') || 
               order.status?.includes('payment') || order.status === 'delivered') ? 'completed' : 'current',
      icon: Clock,
      color: '#eab308'
    },
    { 
      id: 'approved', 
      label: 'Aprovado', 
      status: (order.status?.includes('approved') || order.status?.includes('quotation') || 
               order.status?.includes('payment') || order.status === 'delivered') ? 'completed' : 'pending',
      icon: CheckCircle,
      color: '#22c55e'
    },
    { 
      id: 'purchase', 
      label: 'Processo de Compra', 
      status: (order.status === 'purchase-request' || order.status?.includes('quotation') || 
               order.status?.includes('payment') || order.status?.includes('delivery') || 
               order.status === 'delivered') ? 'completed' : 'pending',
      icon: ShoppingCart,
      color: '#465EFF'
    },
    { 
      id: 'delivery', 
      label: 'Entrega', 
      status: order.status === 'delivered' ? 'completed' : 'pending',
      icon: Truck,
      color: '#10b981'
    },
  ];

  const handleApprove = (withObservation: boolean, observation?: string) => {
    onApprove(order.id, withObservation, observation);
  };

  const handleReject = (reason: string) => {
    onReject(order.id, reason);
  };

  const handleAddQuotation = () => {
    if (quotationSupplier && quotationPrice && quotationDelivery) {
      const newQuotation: SupplierQuotation = {
        id: Date.now().toString(),
        supplierId: quotationSupplier.toLowerCase().replace(/\s/g, '-'),
        supplierName: quotationSupplier,
        unitPrice: parseFloat(quotationPrice) / order.quantity,
        totalPrice: parseFloat(quotationPrice),
        deliveryTime: parseInt(quotationDelivery),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: userEmail
      };

      onUpdatePurchaseProcess(order.id, {
        type: 'add-quotation',
        quotation: newQuotation
      });

      setQuotationSupplier('');
      setQuotationPrice('');
      setQuotationDelivery('');
    }
  };

  const handleSelectQuotation = (quotationId: string) => {
    onUpdatePurchaseProcess(order.id, {
      type: 'select-quotation',
      quotationId
    });
  };

  const handleInitiatePayment = () => {
    onUpdatePurchaseProcess(order.id, {
      type: 'initiate-payment'
    });
  };

  const handleConfirmPayment = () => {
    onUpdatePurchaseProcess(order.id, {
      type: 'confirm-payment'
    });
  };

  const handleScheduleDelivery = () => {
    if (trackingNumber) {
      onUpdatePurchaseProcess(order.id, {
        type: 'schedule-delivery',
        trackingNumber
      });
      setTrackingNumber('');
    }
  };

  const handleConfirmDelivery = () => {
    onUpdatePurchaseProcess(order.id, {
      type: 'confirm-delivery'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="dark:text-white">Detalhes do Pedido</h2>
              <Badge className={statusInfo.color}>
                {React.createElement(statusInfo.icon, { className: "w-3 h-3 mr-1" })}
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {order.id}</p>
          </div>
        </div>

        {/* Actions (only Strategy roles) */}
        {canApprove && (role === 'gestor' || role === 'admin') && (
          <Button 
            onClick={() => setApprovalDialogOpen(true)}
            style={{ backgroundColor: '#465EFF' }}
          >
            Analisar Pedido
          </Button>
        )}
      </div>

      {/* Process Timeline */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Linha do Tempo do Processo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
              <div 
                className="absolute top-5 left-0 h-0.5 hidden md:block transition-all duration-500"
                style={{ 
                  width: `${(processStages.filter(s => s.status === 'completed').length / (processStages.length - 1)) * 100}%`,
                  backgroundColor: '#22c55e'
                }}
              />
              
              {/* Stages */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                {processStages.map((stage) => {
                  const Icon = stage.icon;
                  const isCompleted = stage.status === 'completed';
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center text-center">
                      <div 
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10
                          ${isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs ${isCompleted ? 'dark:text-white' : 'text-gray-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Observation Alert */}
      {order.strategyObservation && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-blue-900 dark:text-blue-200 mb-1">
                  Observação Estratégica
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {order.strategyObservation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="details">
            <FileText className="w-4 h-4 mr-2" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="purchase">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Processo de Compra
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comentários
          </TabsTrigger>
          <TabsTrigger value="history">
            <HistoryIcon className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Tab: Details */}
        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informações do Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">Nome do Item</Label>
                  <p className="text-base mt-1 dark:text-gray-200">{order.item}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">SKU</Label>
                  <p className="text-base mt-1 font-mono dark:text-gray-200">{order.sku}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400 text-sm">Quantidade</Label>
                    <p className="text-base mt-1 dark:text-gray-200">
                      {order.quantity.toLocaleString('pt-BR')} un
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400 text-sm">Categoria</Label>
                    <p className="text-base mt-1 dark:text-gray-200">{order.category || 'Não definida'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Informações Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">Valor Unitário Estimado</Label>
                  <p className="text-base mt-1 dark:text-gray-200">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(order.estimatedValue)}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">Valor Total Estimado</Label>
                  <p className="text-2xl mt-1 dark:text-white">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalValue)}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">Centro de Custo</Label>
                  <p className="text-base mt-1 dark:text-gray-200">{order.costCenter}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers */}
          {order.suppliers && order.suppliers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Fornecedores Sugeridos ({order.suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {order.suppliers.map((supplier, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      <Building2 className="w-3 h-3 mr-1" />
                      {supplier}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {order.deadline && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Prazo de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base dark:text-gray-200">
                    {new Date(order.deadline).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Fonte de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base dark:text-gray-200">{order.source}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Purchase Process */}
        <TabsContent value="purchase" className="space-y-4 mt-6">
          {!isInPurchaseProcess && !order.status?.includes('approved') ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  O processo de compra será iniciado após a aprovação estratégica
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Quotations Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Cotações de Fornecedores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Quotation Form */}
                  {order.status !== 'delivered' && (role === 'gestor' || role === 'admin') && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                      <h4 className="text-sm dark:text-gray-200">Adicionar Nova Cotação</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Nome do fornecedor"
                          value={quotationSupplier}
                          onChange={(e) => setQuotationSupplier(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Valor total"
                          value={quotationPrice}
                          onChange={(e) => setQuotationPrice(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Prazo (dias)"
                          value={quotationDelivery}
                          onChange={(e) => setQuotationDelivery(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAddQuotation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Cotação
                      </Button>
                    </div>
                  )}

                  {/* Quotations List */}
                  {quotations.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                      Nenhuma cotação recebida ainda
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {quotations.map((quotation) => (
                        <div
                          key={quotation.id}
                          className={`p-4 rounded-lg border ${
                            selectedQuotation?.id === quotation.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-sm dark:text-gray-200">{quotation.supplierName}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enviado em {new Date(quotation.submittedAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            {selectedQuotation?.id === quotation.id && (
                              <Badge className="bg-green-500 text-white">Selecionada</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Valor Unitário</p>
                              <p className="text-sm dark:text-gray-200">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(quotation.unitPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Valor Total</p>
                              <p className="text-sm dark:text-gray-200">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(quotation.totalPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Prazo</p>
                              <p className="text-sm dark:text-gray-200">{quotation.deliveryTime} dias</p>
                            </div>
                          </div>
                          {!selectedQuotation && quotation.status === 'pending' && (role === 'gestor' || role === 'admin') && (
                            <Button
                              size="sm"
                              onClick={() => handleSelectQuotation(quotation.id)}
                              style={{ backgroundColor: '#465EFF' }}
                            >
                              Selecionar Cotação
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Section */}
              {selectedQuotation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.status === 'quotation-approved' && (role === 'gestor' || role === 'admin') && (
                      <Button onClick={handleInitiatePayment} style={{ backgroundColor: '#465EFF' }}>
                        Iniciar Processo de Pagamento
                      </Button>
                    )}
                    {order.status === 'payment-pending' && (
                      <div className="space-y-3">
                        <p className="text-sm dark:text-gray-300">
                          Valor a pagar: <strong>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(selectedQuotation.totalPrice)}
                          </strong>
                        </p>
                        {(role === 'gestor' || role === 'admin') && (
                          <Button onClick={handleConfirmPayment} style={{ backgroundColor: '#465EFF' }}>
                            Confirmar Pagamento Realizado
                          </Button>
                        )}
                      </div>
                    )}
                    {order.status === 'payment-done' && (
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">Pagamento confirmado</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Delivery Section */}
        {(order.status === 'payment-done' || order.status === 'delivery-pending' || order.status === 'delivered') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.status === 'payment-done' && (
                      <div className="space-y-3">
                        <Label>Código de Rastreamento</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Digite o código de rastreamento"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                          />
                          {(role === 'gestor' || role === 'admin') && (
                            <Button 
                              onClick={handleScheduleDelivery}
                              disabled={!trackingNumber}
                              style={{ backgroundColor: '#465EFF' }}
                            >
                              Agendar Entrega
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {order.status === 'delivery-pending' && (
                      <div className="space-y-3">
                        <p className="text-sm dark:text-gray-300">
                          Rastreamento: <strong>{order.purchaseProcess?.trackingNumber}</strong>
                        </p>
                        {(role === 'gestor' || role === 'admin') && (
                          <Button onClick={handleConfirmDelivery} style={{ backgroundColor: '#465EFF' }}>
                            Confirmar Recebimento
                          </Button>
                        )}
                      </div>
                    )}
                    {order.status === 'delivered' && (
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">Entrega confirmada</span>
                        </div>
                        {order.purchaseProcess?.deliveryDate && (
                          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            {new Date(order.purchaseProcess.deliveryDate).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab: Comments */}
        <TabsContent value="comments" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comentários do Processo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.comments && order.comments.length > 0 ? (
                <div className="space-y-4">
                  {order.comments.map((commentItem) => (
                    <div key={commentItem.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm dark:text-gray-200">{commentItem.user.split('@')[0]}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(commentItem.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{commentItem.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">Nenhum comentário ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5" />
                Histórico Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HistoryIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">Nenhum histórico disponível</p>
                  </div>
                ) : (
                  orderHistory.map((entry, index) => (
                    <div key={entry.id} className="relative">
                      {index !== orderHistory.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      )}
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 bg-[#465EFF]">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm dark:text-gray-200">{entry.action}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(entry.timestamp).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            {entry.details && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{entry.details}</p>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <User className="w-3 h-3" />
                              <span>{entry.userEmail}</span>
                            </div>
                            {/* Mostrar com quem está o pedido para etapas de compra */}
                            {index === 0 && (order.status === 'purchase-request' || 
                             order.status?.includes('quotation') || 
                             order.status?.includes('payment') || 
                             order.status?.includes('delivery')) && (
                              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  <strong>Responsável atual:</strong> {entry.userEmail}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <StrategyApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        orderId={order.id}
      />
    </div>
  );
}
