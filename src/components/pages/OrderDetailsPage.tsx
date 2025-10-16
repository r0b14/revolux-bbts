import { useState } from 'react';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
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
  Edit,
  MessageSquare,
  History,
  Plus,
  X as CloseIcon,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { EditOrderDialog } from '../EditOrderDialog';
import { DeferDialog } from '../DeferDialog';

interface OrderDetailsPageProps {
  order: Order;
  onBack: () => void;
  onApprove: (orderId: string) => void;
  onEdit: (orderId: string, updates: Partial<Order>) => void;
  onDefer: (orderId: string, justification: string, reminderDays?: number) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
  deferred: { label: 'Adiado', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: XCircle },
  edited: { label: 'Editado', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Edit }
};

// Timeline stages
const timelineStages = [
  { id: 'created', label: 'Análise Pendente', icon: AlertCircle, color: '#f59e0b' },
  { id: 'deferred', label: 'Adiado', icon: XCircle, color: '#6b7280' },
  { id: 'awaiting', label: 'Aguardando Aprovação', icon: Clock, color: '#eab308' },
  { id: 'approved', label: 'Aprovado', icon: CheckCircle, color: '#22c55e' },
  { id: 'rejected', label: 'Reprovado', icon: XCircle, color: '#ef4444' },
  { id: 'purchase', label: 'Processo de Compra', icon: ShoppingCart, color: '#465EFF' },
];

export function OrderDetailsPage({ 
  order, 
  onBack, 
  onApprove, 
  onEdit, 
  onDefer 
}: OrderDetailsPageProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deferDialogOpen, setDeferDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState(order.category || '');
  const [suppliers, setSuppliers] = useState<string[]>(
    order.suppliers || (order.supplier ? [order.supplier] : [])
  );
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const totalValue = order.quantity * order.estimatedValue;

  // Mock comments history
  const commentsHistory = order.comments || (order.comment ? [{
    id: '1',
    text: order.comment,
    user: 'analista.pedidos@revolux.com',
    timestamp: order.createdAt
  }] : []);

  // Calculate current stage in timeline
  const getCurrentStage = () => {
    if (order.status === 'approved') return 3; // Aprovado
    if (order.status === 'deferred') return 1; // Adiado
    if (order.status === 'pending' || order.status === 'edited') return 2; // Aguardando aprovação
    return 0; // Análise pendente
  };

  const currentStageIndex = getCurrentStage();

  // Mock history data with timeline events
  const history = [
    {
      id: '1',
      action: 'Pedido criado',
      stage: 'created',
      user: 'Sistema',
      timestamp: order.createdAt,
      details: `Pedido importado de ${order.source}`
    },
    ...(order.status === 'edited' ? [{
      id: '2',
      action: 'Pedido editado',
      stage: 'awaiting',
      user: 'analista.pedidos@revolux.com',
      timestamp: new Date().toISOString(),
      details: 'Quantidade e valores ajustados'
    }] : []),
    ...(order.status === 'deferred' ? [{
      id: '3',
      action: 'Pedido adiado',
      stage: 'deferred',
      user: 'analista.pedidos@revolux.com',
      timestamp: new Date().toISOString(),
      details: 'Aguardando revisão de orçamento'
    }] : []),
    ...(order.status === 'approved' ? [{
      id: '4',
      action: 'Pedido aprovado',
      stage: 'approved',
      user: 'analista.pedidos@revolux.com',
      timestamp: new Date().toISOString(),
      details: 'Aprovação realizada após análise'
    }] : []),
  ];

  const handleSaveCategory = () => {
    onEdit(order.id, { category: category.trim() });
    setIsEditingCategory(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: comment.trim(),
        user: 'analista.pedidos@revolux.com',
        timestamp: new Date().toISOString()
      };
      const updatedComments = [...commentsHistory, newComment];
      onEdit(order.id, { comments: updatedComments, comment: comment.trim() });
      setComment('');
    }
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
              <h2>Detalhes do Pedido</h2>
              <Badge variant="outline" className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {order.id}</p>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'pending' && (
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline"
              onClick={() => setDeferDialogOpen(true)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Adiar
            </Button>
            <Button 
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button 
              onClick={() => onApprove(order.id)}
              style={{ backgroundColor: '#465EFF' }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
          </div>
        )}
      </div>

      {/* Process Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Linha do Tempo do Processo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-[0px] pr-[24px] pb-[24px] pl-[24px]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden md:block" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-green-500 hidden md:block transition-all duration-500"
              style={{ width: `${(currentStageIndex / (timelineStages.length - 1)) * 100}%` }}
            />

            {/* Timeline stages */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
              {timelineStages.map((stage, index) => {
                const Icon = stage.icon;
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isSkipped = (stage.id === 'deferred' && order.status !== 'deferred') ||
                                  (stage.id === 'rejected' && order.status !== 'rejected');

                if (isSkipped && index > currentStageIndex) return null;

                return (
                  <div key={stage.id} className="flex flex-col items-center text-center">
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10
                        ${isCurrent ? 'ring-4 ring-opacity-30' : ''}
                        ${isCompleted ? 'text-white' : 'bg-gray-100 text-gray-400'}
                      `}
                      style={isCompleted ? { 
                        backgroundColor: stage.color,
                        ringColor: stage.color 
                      } : {}}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs ${isCompleted ? '' : 'text-gray-400'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="details">
            <FileText className="w-4 h-4 mr-2" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comentários
            {commentsHistory.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {commentsHistory.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
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
                  <Label className="text-gray-500 text-sm">Nome do Item</Label>
                  <p className="text-base mt-1">{order.item}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 text-sm">SKU</Label>
                  <p className="text-base mt-1 font-mono">{order.sku}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500 text-sm">Quantidade</Label>
                    <p className="text-base mt-1">
                      {order.quantity.toLocaleString('pt-BR')} un
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-sm">Categoria</Label>
                    {isEditingCategory ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Digite a categoria"
                          className="h-8"
                        />
                        <Button size="sm" onClick={handleSaveCategory}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setCategory(order.category || '');
                            setIsEditingCategory(false);
                          }}
                        >
                          <CloseIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-base">{category || 'Não definida'}</p>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setIsEditingCategory(true)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
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
                  <Label className="text-gray-500 text-sm">Valor Unitário</Label>
                  <p className="text-base mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(order.estimatedValue)}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 text-sm">Valor Total</Label>
                  <p className="text-2xl mt-1">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalValue)}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-gray-500 text-sm">Centro de Custo</Label>
                  <p className="text-base mt-1">{order.costCenter}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers Display */}
          {suppliers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Fornecedores ({suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {suppliers.map((supplier, index) => (
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

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deadline */}
            {order.deadline && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Prazo de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">
                    {new Date(order.deadline).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Source */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Fonte de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{order.source}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {order.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{order.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Comments */}
        <TabsContent value="comments" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Adicionar Comentário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comment">Novo Comentário</Label>
                <Textarea
                  id="comment"
                  placeholder="Adicione observações, justificativas ou informações relevantes sobre este pedido..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleAddComment}
                disabled={!comment.trim()}
                style={{ backgroundColor: '#465EFF' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Comentário
              </Button>
            </CardContent>
          </Card>

          {/* Comments History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Histórico de Comentários ({commentsHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commentsHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Nenhum comentário ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commentsHistory.map((commentItem, index) => (
                    <div key={commentItem.id} className="relative">
                      {index !== commentsHistory.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 z-10">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">{commentItem.user.split('@')[0]}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(commentItem.timestamp).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{commentItem.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <History className="w-5 h-5" />
                Histórico de Alterações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {index !== history.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ backgroundColor: '#465EFF' }}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm">{entry.action}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{entry.details}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{entry.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditOrderDialog
        order={order}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(updates) => {
          onEdit(order.id, updates);
          setEditDialogOpen(false);
        }}
      />

      <DeferDialog
        open={deferDialogOpen}
        onOpenChange={setDeferDialogOpen}
        onDefer={(justification, reminderDays) => {
          onDefer(order.id, justification, reminderDays);
          setDeferDialogOpen(false);
        }}
      />
    </div>
  );
}
