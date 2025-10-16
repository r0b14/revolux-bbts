# Revolux - Documentação de Backend e Regras de Negócio

## Visão Geral do Sistema

**Revolux** é um sistema inteligente de gestão e análise de aquisições logísticas que centraliza dados de sistemas terceiros (ERP, SharePoint, planilhas) e permite upload manual de arquivos (.xlsx, .csv, .pdf, .xml).

### Tecnologias Frontend
- **Framework:** React + TypeScript
- **Estilização:** Tailwind CSS v4.0
- **Componentes:** shadcn/ui
- **Tema:** Modo claro/escuro completo
- **Fonte:** Calibri

### Cores do Sistema
- **Primary:** `#465EFF`
- **Secondary:** `#C2D6FF`
- **Accent (IA):** `#FCFC30`

---

## 1. Autenticação e Perfis de Usuário

### 1.1 Endpoint de Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "analyst" | "strategy-analyst"
  },
  "token": "string",
  "refreshToken": "string"
}
```

### 1.2 Regras de Redirecionamento

O sistema redireciona automaticamente baseado no email do usuário:

- **Analista de Pedidos:** `analista.pedidos@revolux.com`
  - Acesso: Home, Listagem de Pedidos, Previsões
  - Funcionalidades: Aprovar, Editar, Adiar pedidos

- **Analista de Estratégia:** `analista.estrategia@revolux.com`
  - Acesso: Painel Estratégico, Listagem de Pedidos (estratégica)
  - Funcionalidades: Aprovar/Reprovar, Gerenciar processo de compra

**Regra de Negócio:**
- Email termina com `@revolux.com` → Válido
- Domínio diferente → Rejeitar acesso
- Email contém "pedidos" → Perfil Analista de Pedidos
- Email contém "estrategia" → Perfil Analista de Estratégia

---

## 2. Estrutura de Dados

### 2.1 Modelo de Pedido (Order)

```typescript
interface Order {
  // Identificação
  id: string;                    // UUID único
  sku: string;                   // Código SKU do produto
  
  // Informações do Produto
  item: string;                  // Nome do produto
  quantity: number;              // Quantidade solicitada
  estimatedValue: number;        // Valor unitário estimado
  category?: string;             // Categoria do produto
  
  // Informações Organizacionais
  costCenter: string;            // Centro de custo
  supplier?: string;             // Fornecedor (opcional na criação)
  suppliers?: string[];          // Lista de fornecedores sugeridos
  
  // Status e Workflow
  status: OrderStatus;           // Status atual do pedido
  deadline?: string;             // Prazo de entrega (ISO 8601)
  
  // Rastreabilidade
  source: string;                // Origem: "ERP", "SharePoint", "Excel", "Manual"
  createdAt: string;             // Data de criação (ISO 8601)
  updatedAt?: string;            // Última atualização (ISO 8601)
  
  // Observações e Comentários
  comment?: string;              // Comentário principal
  comments?: Comment[];          // Histórico de comentários
  mentionedUser?: string;        // Usuário mencionado
  
  // Estratégia de Compra
  strategyObservation?: string;  // Observação do analista estratégico
  purchaseProcess?: PurchaseProcess; // Processo de compra completo
}
```

### 2.2 Status do Pedido (OrderStatus)

```typescript
type OrderStatus = 
  // Fluxo Analista de Pedidos
  | 'pending'                    // Aguardando análise inicial
  | 'edited'                     // Editado pelo analista
  | 'deferred'                   // Adiado temporariamente
  | 'approved'                   // Aprovado - enviado para estratégia
  
  // Fluxo Analista de Estratégia
  | 'strategy-review'            // Em análise estratégica
  | 'strategy-approved'          // Aprovado pela estratégia
  | 'strategy-approved-with-obs' // Aprovado com observações
  | 'strategy-rejected'          // Reprovado pela estratégia
  
  // Processo de Compra
  | 'purchase-request'           // Solicitação de compra criada
  | 'quotation-pending'          // Aguardando cotações
  | 'quotation-approved'         // Cotação aprovada
  | 'payment-pending'            // Aguardando pagamento
  | 'payment-done'               // Pagamento realizado
  | 'delivery-pending'           // Aguardando entrega
  | 'delivered';                 // Entregue
```

### 2.3 Processo de Compra (PurchaseProcess)

```typescript
interface PurchaseProcess {
  quotations: SupplierQuotation[];     // Cotações recebidas
  selectedQuotation?: string;           // ID da cotação selecionada
  paymentInfo?: {
    method: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid';
  };
  deliveryInfo?: {
    trackingNumber?: string;
    estimatedDate: string;
    actualDate?: string;
    status: 'pending' | 'in-transit' | 'delivered';
  };
}
```

### 2.4 Cotação de Fornecedor (SupplierQuotation)

```typescript
interface SupplierQuotation {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: number;              // Em dias
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;               // ISO 8601
  submittedBy: string;               // Email do usuário
}
```

### 2.5 Comentário (Comment)

```typescript
interface Comment {
  id: string;
  text: string;
  user: string;                      // Email do usuário
  timestamp: string;                 // ISO 8601
}
```

### 2.6 Histórico de Alterações (OrderHistory)

```typescript
interface OrderHistory {
  id: string;
  orderId: string;
  action: string;                    // Descrição da ação
  stage: string;                     // Etapa do processo
  user: string;                      // Email do usuário
  timestamp: string;                 // ISO 8601
  details?: string;                  // Detalhes adicionais
  changes?: {                        // Mudanças realizadas
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}
```

---

## 3. API Endpoints - Analista de Pedidos

### 3.1 Listar Pedidos

**GET** `/api/orders`

**Query Parameters:**
```
?status=pending,edited,approved,deferred
&search=texto_busca
&source=ERP,SharePoint,Excel
&costCenter=CC-001
&page=1
&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [Order[]],
    "total": number,
    "page": number,
    "totalPages": number
  }
}
```

### 3.2 Obter Detalhes do Pedido

**GET** `/api/orders/:orderId`

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "history": OrderHistory[]
  }
}
```

### 3.3 Aprovar Pedido

**POST** `/api/orders/:orderId/approve`

**Request Body:**
```json
{
  "comment": "string (opcional)",
  "mentionedUser": "string (opcional)"
}
```

**Regras de Negócio:**
1. Apenas pedidos com status `pending` ou `edited` podem ser aprovados
2. Atualiza status para `approved`
3. Registra no histórico com user, timestamp e ação
4. Envia notificação para Analista de Estratégia
5. Pedido entra na fila de análise estratégica

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "historyEntry": OrderHistory
  }
}
```

### 3.4 Editar Pedido

**PUT** `/api/orders/:orderId/edit`

**Request Body:**
```json
{
  "quantity": number,
  "estimatedValue": number,
  "category": "string",
  "suppliers": ["string"],
  "deadline": "ISO 8601",
  "comment": "string (opcional)"
}
```

**Regras de Negócio:**
1. Apenas pedidos `pending` podem ser editados diretamente
2. Pedidos `approved` ou superiores requerem justificativa
3. Atualiza status para `edited`
4. Registra todas as alterações no histórico
5. Recalcula valores totais automaticamente

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "changes": OrderHistory
  }
}
```

### 3.5 Adiar Pedido

**POST** `/api/orders/:orderId/defer`

**Request Body:**
```json
{
  "justification": "string (obrigatório)",
  "reminderDays": number (opcional, default: 7)
}
```

**Regras de Negócio:**
1. Justificativa é obrigatória
2. Atualiza status para `deferred`
3. Cria lembrete automático baseado em `reminderDays`
4. Registra no histórico
5. Pedido sai da fila de análise ativa

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "reminder": {
      "date": "ISO 8601",
      "days": number
    }
  }
}
```

### 3.6 Adicionar Comentário

**POST** `/api/orders/:orderId/comments`

**Request Body:**
```json
{
  "text": "string",
  "mentionedUser": "string (opcional)"
}
```

**Regras de Negócio:**
1. Comentário não pode ser vazio
2. Se mencionar usuário, envia notificação
3. Adiciona ao array de comentários
4. Registra no histórico

**Response:**
```json
{
  "success": true,
  "data": {
    "comment": Comment,
    "order": Order
  }
}
```

---

## 4. API Endpoints - Analista de Estratégia

### 4.1 Listar Pedidos Estratégicos

**GET** `/api/strategy/orders`

**Query Parameters:**
```
?status=approved,strategy-review,strategy-approved,purchase-request
&search=texto_busca
&page=1
&limit=50
```

**Regras de Negócio:**
- Retorna apenas pedidos relevantes para análise estratégica
- Inclui estatísticas de valores e prazos
- Ordena por urgência (deadline) por padrão

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": Order[],
    "statistics": {
      "forApproval": number,
      "inPurchase": number,
      "approvedWithObs": number,
      "totalValue": number
    },
    "total": number,
    "page": number,
    "totalPages": number
  }
}
```

### 4.2 Aprovar Pedido Estrategicamente

**POST** `/api/strategy/orders/:orderId/approve`

**Request Body:**
```json
{
  "withObservation": boolean,
  "observation": "string (obrigatório se withObservation=true)"
}
```

**Regras de Negócio:**
1. Apenas pedidos `approved` ou `strategy-review` podem ser aprovados
2. Se `withObservation=true`: status → `strategy-approved-with-obs`
3. Se `withObservation=false`: status → `strategy-approved`
4. Inicia processo de compra automaticamente
5. Atualiza status para `purchase-request`
6. Registra no histórico

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "purchaseProcess": PurchaseProcess
  }
}
```

### 4.3 Reprovar Pedido

**POST** `/api/strategy/orders/:orderId/reject`

**Request Body:**
```json
{
  "reason": "string (obrigatório)",
  "returnToAnalyst": boolean
}
```

**Regras de Negócio:**
1. Motivo é obrigatório
2. Atualiza status para `strategy-rejected`
3. Se `returnToAnalyst=true`: volta para status `pending`
4. Envia notificação para Analista de Pedidos
5. Registra no histórico com motivo completo

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "notification": {
      "sent": boolean,
      "recipient": "string"
    }
  }
}
```

### 4.4 Adicionar Cotação

**POST** `/api/strategy/orders/:orderId/quotations`

**Request Body:**
```json
{
  "supplierId": "string",
  "supplierName": "string",
  "unitPrice": number,
  "totalPrice": number,
  "deliveryTime": number
}
```

**Regras de Negócio:**
1. Pedido deve estar em `quotation-pending` ou superior
2. Valida se fornecedor já enviou cotação
3. Calcula automaticamente totalPrice se não fornecido
4. Atualiza timestamp de última cotação
5. Notifica se todas cotações necessárias foram recebidas

**Response:**
```json
{
  "success": true,
  "data": {
    "quotation": SupplierQuotation,
    "order": Order
  }
}
```

### 4.5 Selecionar Cotação

**POST** `/api/strategy/orders/:orderId/quotations/:quotationId/select`

**Regras de Negócio:**
1. Pedido deve ter cotações disponíveis
2. Atualiza `selectedQuotation` no purchaseProcess
3. Atualiza status para `quotation-approved`
4. Rejeita automaticamente outras cotações
5. Prepara para fase de pagamento

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "selectedQuotation": SupplierQuotation
  }
}
```

### 4.6 Gerenciar Pagamento

**POST** `/api/strategy/orders/:orderId/payment`

**Request Body:**
```json
{
  "action": "initiate" | "confirm",
  "method": "string",
  "dueDate": "ISO 8601",
  "amount": number
}
```

**Regras de Negócio:**
1. **Initiate:** 
   - Status deve ser `quotation-approved`
   - Atualiza para `payment-pending`
   - Registra informações de pagamento
2. **Confirm:**
   - Status deve ser `payment-pending`
   - Atualiza para `payment-done`
   - Registra data efetiva de pagamento
   - Avança para fase de entrega

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "paymentInfo": {
      "status": "string",
      "confirmedAt": "ISO 8601"
    }
  }
}
```

### 4.7 Gerenciar Entrega

**POST** `/api/strategy/orders/:orderId/delivery`

**Request Body:**
```json
{
  "action": "schedule" | "confirm",
  "trackingNumber": "string",
  "estimatedDate": "ISO 8601",
  "actualDate": "ISO 8601 (para confirm)"
}
```

**Regras de Negócio:**
1. **Schedule:**
   - Status deve ser `payment-done`
   - Atualiza para `delivery-pending`
   - Registra tracking e data estimada
2. **Confirm:**
   - Status deve ser `delivery-pending`
   - Atualiza para `delivered`
   - Registra data real de entrega
   - Finaliza processo completo

**Response:**
```json
{
  "success": true,
  "data": {
    "order": Order,
    "deliveryInfo": {
      "status": "string",
      "deliveredAt": "ISO 8601"
    }
  }
}
```

---

## 5. Previsões e Analytics

### 5.1 Obter Previsões

**GET** `/api/forecasts`

**Query Parameters:**
```
?product=nome_produto
&period=7-days|30-days|3-months|6-months|12-months|year
&supplier=nome_fornecedor
```

**Response:**
```json
{
  "success": true,
  "data": {
    "demandTrend": [
      {
        "month": "string",
        "demand": number,
        "forecast": number
      }
    ],
    "supplierPerformance": {
      "averageDeliveryTime": number,
      "contractValidity": "ISO 8601",
      "reliabilityRate": number,
      "onTimeDeliveryRate": number
    },
    "costAnalysis": [
      {
        "month": "string",
        "avgCost": number,
        "trend": "up" | "down" | "stable"
      }
    ]
  }
}
```

### 5.2 Obter Dashboard de Estatísticas

**GET** `/api/dashboard/stats`

**Query Parameters:**
```
?period=7-days|30-days|90-days
&userRole=analyst|strategy-analyst
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": number,
    "pendingAnalysis": number,
    "urgent": number,
    "totalValue": number,
    "byStatus": {
      "pending": number,
      "approved": number,
      "inPurchase": number,
      "delivered": number
    },
    "byCostCenter": [
      {
        "costCenter": "string",
        "count": number,
        "value": number
      }
    ]
  }
}
```

---

## 6. Upload e Importação de Dados

### 6.1 Upload de Arquivo

**POST** `/api/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: File (.xlsx, .csv, .pdf, .xml)
source: "ERP" | "SharePoint" | "Excel" | "Manual"
autoProcess: boolean
```

**Regras de Negócio:**
1. Valida formato do arquivo
2. Valida tamanho máximo (10MB)
3. Extrai dados usando parser apropriado
4. Valida estrutura de dados
5. Se `autoProcess=true`: cria pedidos automaticamente
6. Se `autoProcess=false`: retorna preview para validação

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "string",
    "fileName": "string",
    "recordsFound": number,
    "validRecords": number,
    "invalidRecords": number,
    "preview": Order[],
    "errors": [
      {
        "line": number,
        "field": "string",
        "error": "string"
      }
    ]
  }
}
```

### 6.2 Confirmar Importação

**POST** `/api/upload/:fileId/confirm`

**Request Body:**
```json
{
  "selectedRecords": ["recordId1", "recordId2"],
  "overwriteExisting": boolean
}
```

**Regras de Negócio:**
1. Valida se registros existem no preview
2. Verifica duplicatas por SKU + costCenter
3. Se `overwriteExisting=true`: atualiza pedidos existentes
4. Cria novos pedidos em lote
5. Registra origem da importação

**Response:**
```json
{
  "success": true,
  "data": {
    "created": number,
    "updated": number,
    "failed": number,
    "orders": Order[]
  }
}
```

---

## 7. Notificações e Lembretes

### 7.1 Obter Notificações

**GET** `/api/notifications`

**Query Parameters:**
```
?read=true|false
&type=mention|deadline|approval|update
&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "string",
        "title": "string",
        "message": "string",
        "orderId": "string",
        "read": boolean,
        "createdAt": "ISO 8601"
      }
    ],
    "unreadCount": number
  }
}
```

### 7.2 Marcar como Lida

**PUT** `/api/notifications/:notificationId/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "string",
      "read": true
    }
  }
}
```

---

## 8. Regras de Negócio Globais

### 8.1 Linha do Tempo do Processo

**Etapas Obrigatórias:**

1. **Análise de Necessidade** (Automático)
   - Pedido criado/importado
   - Status: `pending`
   - Responsável: Sistema

2. **Aguardando Aprovação TC** (Analista de Pedidos)
   - Analista revisa e valida
   - Status: `pending` ou `edited`
   - Ações: Aprovar, Editar, Adiar
   - Responsável: Analista de Pedidos

3. **Aprovado** (Analista de Estratégia)
   - Análise estratégica e viabilidade
   - Status: `approved`, `strategy-review`, `strategy-approved`
   - Ações: Aprovar, Reprovar, Adicionar Observação
   - Responsável: Analista de Estratégia

4. **Processo de Compra** (Analista de Estratégia)
   - Cotações, seleção de fornecedor, pagamento
   - Status: `purchase-request`, `quotation-*`, `payment-*`
   - Ações: Gerenciar cotações, processar pagamento
   - Responsável: Analista de Estratégia

5. **Entrega** (Automático/Manual)
   - Acompanhamento e confirmação
   - Status: `delivery-pending`, `delivered`
   - Ações: Agendar, Confirmar entrega
   - Responsável: Analista de Estratégia / Sistema

### 8.2 Validações de Dados

**Pedido (Order):**
- `id`: UUID válido
- `sku`: Alfanumérico, máx 50 caracteres
- `item`: Obrigatório, mín 3, máx 200 caracteres
- `quantity`: Número positivo > 0
- `estimatedValue`: Número positivo >= 0
- `costCenter`: Formato CC-XXX (validar contra lista)
- `deadline`: Data futura (exceto importação histórica)
- `source`: Valores permitidos apenas

**Comentário:**
- `text`: Mín 1, máx 1000 caracteres
- `user`: Email válido

**Cotação:**
- `unitPrice` e `totalPrice`: Devem ser consistentes
- `deliveryTime`: Dias inteiros positivos

### 8.3 Cálculos Automáticos

**Valor Total do Pedido:**
```
totalValue = quantity * estimatedValue
```

**Urgência:**
```
daysUntilDeadline = (deadline - today) / 86400000
urgency = 
  | daysUntilDeadline < 0    → 'overdue'
  | daysUntilDeadline <= 3   → 'critical'
  | daysUntilDeadline <= 7   → 'urgent'
  | else                     → 'normal'
```

**Taxa de Confiabilidade do Fornecedor:**
```
reliabilityRate = (entregas_no_prazo / total_entregas) * 100
```

### 8.4 Permissões de Acesso

**Analista de Pedidos pode:**
- ✅ Visualizar pedidos `pending`, `edited`, `deferred`, `approved`
- ✅ Aprovar pedidos `pending` ou `edited`
- ✅ Editar pedidos `pending`
- ✅ Adiar pedidos `pending` ou `edited`
- ✅ Adicionar comentários
- ✅ Ver histórico de alterações próprias
- ❌ Acessar processo de compra
- ❌ Ver pedidos de outros analistas (opcional)

**Analista de Estratégia pode:**
- ✅ Visualizar todos os pedidos aprovados
- ✅ Aprovar/Reprovar pedidos `approved` ou `strategy-review`
- ✅ Gerenciar todo processo de compra
- ✅ Adicionar e selecionar cotações
- ✅ Processar pagamentos
- ✅ Confirmar entregas
- ✅ Ver histórico completo
- ❌ Aprovar pedidos não enviados pelo analista

### 8.5 Integrações Externas

**ERP:**
- Sincronização bidirecional de pedidos
- Atualização de custos e estoques
- Webhook para atualizações em tempo real

**SharePoint:**
- Import de documentos e planilhas
- Sincronização de centro de custos
- Validação de fornecedores cadastrados

**Sistema de Email:**
- Notificações de aprovação/rejeição
- Lembretes de prazos
- Menções em comentários

---

## 9. Webhooks e Eventos

### 9.1 Eventos Disparados

**order.created**
```json
{
  "event": "order.created",
  "timestamp": "ISO 8601",
  "data": {
    "orderId": "string",
    "order": Order,
    "createdBy": "string"
  }
}
```

**order.approved**
```json
{
  "event": "order.approved",
  "timestamp": "ISO 8601",
  "data": {
    "orderId": "string",
    "approvedBy": "string",
    "previousStatus": "string",
    "newStatus": "string"
  }
}
```

**order.status_changed**
```json
{
  "event": "order.status_changed",
  "timestamp": "ISO 8601",
  "data": {
    "orderId": "string",
    "previousStatus": "string",
    "newStatus": "string",
    "changedBy": "string",
    "reason": "string"
  }
}
```

**quotation.received**
```json
{
  "event": "quotation.received",
  "timestamp": "ISO 8601",
  "data": {
    "orderId": "string",
    "quotationId": "string",
    "supplierName": "string",
    "totalPrice": number
  }
}
```

**delivery.confirmed**
```json
{
  "event": "delivery.confirmed",
  "timestamp": "ISO 8601",
  "data": {
    "orderId": "string",
    "deliveredAt": "ISO 8601",
    "confirmedBy": "string"
  }
}
```

---

## 10. Estrutura do Banco de Dados Sugerida

### 10.1 Tabelas Principais

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  active BOOLEAN DEFAULT true
);
```

**orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  sku VARCHAR(50) NOT NULL,
  item VARCHAR(200) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  estimated_value DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  cost_center VARCHAR(50) NOT NULL,
  supplier VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  deadline TIMESTAMP,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_cost_center (cost_center),
  INDEX idx_deadline (deadline),
  INDEX idx_created_at (created_at)
);
```

**order_suppliers**
```sql
CREATE TABLE order_suppliers (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  supplier_name VARCHAR(255) NOT NULL,
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**comments**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255) NOT NULL,
  mentioned_user VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_order_id (order_id)
);
```

**order_history**
```sql
CREATE TABLE order_history (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
);
```

**quotations**
```sql
CREATE TABLE quotations (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  supplier_id VARCHAR(255) NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  submitted_by UUID REFERENCES users(id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);
```

**purchase_processes**
```sql
CREATE TABLE purchase_processes (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  selected_quotation_id UUID REFERENCES quotations(id),
  payment_method VARCHAR(100),
  payment_due_date TIMESTAMP,
  payment_amount DECIMAL(10,2),
  payment_status VARCHAR(50),
  payment_confirmed_at TIMESTAMP,
  tracking_number VARCHAR(100),
  estimated_delivery_date TIMESTAMP,
  actual_delivery_date TIMESTAMP,
  delivery_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  order_id UUID REFERENCES orders(id),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_read (read),
  INDEX idx_created_at (created_at)
);
```

### 10.2 Índices Recomendados

```sql
-- Performance para consultas frequentes
CREATE INDEX idx_orders_status_deadline ON orders(status, deadline);
CREATE INDEX idx_orders_cost_center_status ON orders(cost_center, status);
CREATE INDEX idx_history_order_created ON order_history(order_id, created_at DESC);
CREATE INDEX idx_quotations_order_status ON quotations(order_id, status);

-- Full-text search
CREATE FULLTEXT INDEX idx_orders_search ON orders(item, sku);
```

---

## 11. Segurança e Auditoria

### 11.1 Requisitos de Segurança

**Autenticação:**
- JWT com expiração de 1 hora
- Refresh token com expiração de 7 dias
- Hash de senha com bcrypt (rounds: 12)
- 2FA opcional via email

**Autorização:**
- RBAC baseado em perfil
- Validação de permissões em cada endpoint
- Rate limiting: 100 requisições/minuto por usuário

**Dados Sensíveis:**
- Logs não devem conter senhas ou tokens
- Valores financeiros criptografados em repouso
- HTTPS obrigatório em produção

### 11.2 Auditoria

**Registro Obrigatório:**
- Todas as alterações em pedidos
- Aprovações e reprovações
- Mudanças de status
- Uploads de arquivos
- Login e logout

**Formato de Log:**
```json
{
  "timestamp": "ISO 8601",
  "userId": "string",
  "action": "string",
  "resource": "string",
  "resourceId": "string",
  "changes": {},
  "ip": "string",
  "userAgent": "string"
}
```

---

## 12. Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/revolux
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d

# External Services
ERP_API_URL=https://erp.company.com/api
ERP_API_KEY=your-erp-api-key
SHAREPOINT_URL=https://company.sharepoint.com
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@revolux.com
SMTP_PASSWORD=your-password
EMAIL_FROM=Sistema Revolux <noreply@revolux.com>

# Application
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://revolux.com
MAX_UPLOAD_SIZE=10485760  # 10MB

# Feature Flags
ENABLE_AUTO_APPROVAL=false
ENABLE_WEBHOOKS=true
ENABLE_EMAIL_NOTIFICATIONS=true
```

---

## 13. Métricas e Monitoramento

### 13.1 KPIs do Sistema

**Performance:**
- Tempo médio de resposta das APIs
- Taxa de erro por endpoint
- Throughput (requisições/segundo)
- Tempo de processamento de uploads

**Negócio:**
- Tempo médio de aprovação (Analista → Estratégia)
- Taxa de aprovação vs rejeição
- Número de pedidos por status
- Valor total em cada etapa
- Tempo médio do processo completo (criação → entrega)

**Fornecedores:**
- Taxa de entrega no prazo
- Preço médio por categoria
- Número de cotações por pedido
- Taxa de seleção por fornecedor

### 13.2 Endpoints de Health Check

**GET** `/api/health`
```json
{
  "status": "healthy",
  "timestamp": "ISO 8601",
  "uptime": 123456,
  "version": "1.0.0"
}
```

**GET** `/api/health/detailed`
```json
{
  "status": "healthy",
  "timestamp": "ISO 8601",
  "services": {
    "database": "connected",
    "erp": "connected",
    "email": "operational"
  },
  "metrics": {
    "activeOrders": 150,
    "pendingApprovals": 25,
    "avgResponseTime": "120ms"
  }
}
```

---

## 14. Migração de Dados

### 14.1 Script de Migração Inicial

```sql
-- Migração de dados do sistema legado
INSERT INTO orders (
  id, sku, item, quantity, estimated_value,
  cost_center, supplier, status, deadline,
  source, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  legacy_sku,
  legacy_item_name,
  legacy_qty,
  legacy_price,
  legacy_cc,
  legacy_supplier,
  CASE 
    WHEN legacy_status = 'PENDENTE' THEN 'pending'
    WHEN legacy_status = 'APROVADO' THEN 'approved'
    ELSE 'pending'
  END,
  legacy_deadline,
  'ERP',
  legacy_created_date,
  NOW()
FROM legacy_orders
WHERE legacy_created_date >= '2024-01-01';
```

### 14.2 Validação Pós-Migração

```sql
-- Verificar totais
SELECT 
  status, 
  COUNT(*) as count,
  SUM(quantity * estimated_value) as total_value
FROM orders
GROUP BY status;

-- Verificar inconsistências
SELECT * FROM orders 
WHERE quantity <= 0 OR estimated_value < 0;

-- Verificar referências órfãs
SELECT o.* FROM orders o
LEFT JOIN users u ON o.created_by = u.id
WHERE o.created_by IS NOT NULL AND u.id IS NULL;
```

---

## 15. Considerações Finais

### 15.1 Roadmap de Implementação

**Fase 1 - MVP (4 semanas):**
- ✅ Autenticação e autorização
- ✅ CRUD de pedidos básico
- ✅ Fluxo de aprovação simples
- ✅ Dashboard básico

**Fase 2 - Processo Completo (6 semanas):**
- ✅ Processo de compra completo
- ✅ Cotações e fornecedores
- ✅ Notificações por email
- ✅ Upload de arquivos

**Fase 3 - Analytics (4 semanas):**
- ✅ Previsões e forecasting
- ✅ Relatórios avançados
- ✅ Integrações com ERP/SharePoint
- ✅ Webhooks

**Fase 4 - Otimizações (2 semanas):**
- ✅ Cache e performance
- ✅ Testes de carga
- ✅ Documentação completa
- ✅ Deploy em produção

### 15.2 Tecnologias Backend Recomendadas

**Runtime:** Node.js 20+ ou Python 3.11+
**Framework:** Express.js / Fastify / FastAPI / Django
**ORM:** Prisma / TypeORM / SQLAlchemy
**Database:** PostgreSQL 15+
**Cache:** Redis 7+
**Queue:** Bull / RabbitMQ
**Storage:** AWS S3 / MinIO
**Monitoring:** Prometheus + Grafana

### 15.3 Contato e Suporte

Para dúvidas sobre implementação:
- 📧 Email: dev@revolux.com
- 📚 Documentação Frontend: `/FRONTEND_DOCUMENTATION.md`
- 🎨 Design System: `/guidelines/Design-System.md`

---

**Versão:** 1.0.0  
**Última Atualização:** Outubro 2025  
**Autor:** Equipe Revolux
