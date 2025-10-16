export type OrderStatus = 
  | 'pending' 
  | 'approved' 
  | 'deferred' 
  | 'edited'
  | 'strategy-review' // Aguardando análise estratégica
  | 'strategy-approved' // Aprovado pela estratégia
  | 'strategy-approved-with-obs' // Aprovado com observações
  | 'strategy-rejected' // Reprovado pela estratégia
  | 'purchase-request' // Solicitação de compra
  | 'quotation-pending' // Aguardando cotações
  | 'quotation-approved' // Cotação aprovada
  | 'payment-pending' // Aguardando pagamento
  | 'payment-done' // Pagamento realizado
  | 'delivery-pending' // Aguardando entrega
  | 'delivered'; // Entregue

export type UserProfile = 'orders-analyst' | 'strategy-analyst';

export type PurchaseStage = 
  | 'quotation-request'
  | 'quotation-received'
  | 'quotation-approved'
  | 'payment-processing'
  | 'payment-completed'
  | 'delivery-scheduled'
  | 'in-transit'
  | 'delivered';

export interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

export interface SupplierQuotation {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: number; // dias
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  submittedBy?: string;
}

export interface PurchaseProcess {
  id: string;
  orderId: string;
  stage: PurchaseStage;
  quotations: SupplierQuotation[];
  selectedQuotation?: string; // ID da cotação selecionada
  paymentStatus?: 'pending' | 'processing' | 'completed';
  paymentDate?: string;
  paymentBy?: string;
  deliveryDate?: string;
  deliveryConfirmedBy?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Order {
  id: string;
  sku: string;
  item: string;
  quantity: number;
  estimatedValue: number;
  costCenter: string;
  status: OrderStatus;
  category?: string;
  suppliers?: string[];
  supplier?: string;
  deadline?: string;
  reminderDate?: string;
  createdAt: string;
  source: string;
  comment?: string;
  comments?: Comment[];
  mentionedUser?: string;
  description?: string;
  strategyObservation?: string; // Observação do analista de estratégia
  purchaseProcess?: PurchaseProcess;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  action: 
    | 'created'
    | 'edited' 
    | 'deferred'
    | 'approved' // Aprovado pelo analista de pedidos
    | 'strategy-review' // Enviado para análise estratégica
    | 'strategy-approved'
    | 'strategy-approved-with-obs'
    | 'strategy-rejected'
    | 'quotation-requested'
    | 'quotation-received'
    | 'quotation-approved'
    | 'payment-initiated'
    | 'payment-completed'
    | 'delivery-scheduled'
    | 'delivered';
  user: string;
  userEmail: string;
  timestamp: string;
  details?: string;
  previousData?: Partial<Order>;
  metadata?: Record<string, any>; // Dados adicionais específicos da ação
}

export interface User {
  email: string;
  name: string;
  profile: UserProfile;
}
