# Documentação Frontend - Sistema Revolux

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Perfis de Usuário](#perfis-de-usuário)
6. [Componentes Principais](#componentes-principais)
7. [Páginas do Sistema](#páginas-do-sistema)
8. [Sistema de Temas](#sistema-de-temas)
9. [Estrutura de Dados](#estrutura-de-dados)
10. [Fluxos de Trabalho](#fluxos-de-trabalho)
11. [Componentes UI](#componentes-ui)
12. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 Visão Geral

**Revolux** é um sistema inteligente de gestão e análise de aquisições logísticas que centraliza dados de sistemas terceiros (ERP, SharePoint, planilhas) e permite upload manual de arquivos (.xlsx, .csv, .pdf, .xml).

### Características Principais

- **Dois perfis de usuário** com interfaces distintas
- **Redirecionamento automático** baseado no email de login
- **Tema claro/escuro** com suporte completo
- **Chat com IA** para análise de dados
- **Sistema de aprovação** multi-nível
- **Processo de compra** completo (cotação → pagamento → entrega)
- **Dashboard preditivo** com insights baseados em dados

### Cores do Sistema

- **Primária**: `#465EFF` (Azul)
- **Secundária**: `#C2D6FF` (Azul claro)
- **IA/Chat**: `#FAFEC3` (Amarelo)
- **Fonte**: Calibri (sistema completo)

---

## 🏗️ Arquitetura do Sistema

### Estrutura Hierárquica

```
App.tsx (Entry Point)
├── ThemeProvider (Contexto de Tema)
├── LoginPage (Autenticação)
└── Perfis de Usuário
    ├── AnalystOrdersHome (Analista de Pedidos)
    │   ├── HomePage
    │   ├── OrderListingPage
    │   ├── OrderDetailsPage
    │   └── ForecastsPage
    └── StrategyAnalystHome (Analista de Estratégia)
        ├── StrategyHomePage
        ├── StrategyOrdersPage
        ├── StrategyOrderDetailsPage
        └── ForecastsPage
```

### Padrões de Design

- **Component-Based Architecture**: React com TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Props Drilling**: Comunicação entre componentes via props
- **Responsive Design**: Mobile-first com breakpoints

---

## 💻 Tecnologias Utilizadas

### Core

- **React** 18+ - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4.0** - Estilização utility-first
- **Vite** - Build tool e dev server

### Bibliotecas UI

- **shadcn/ui** - Componentes base
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Sonner** - Toast notifications
- **Motion (Framer Motion)** - Animações

### Utilitários

- **date-fns** - Manipulação de datas
- **clsx** - Utilities de className

---

## 📁 Estrutura de Pastas

```
/
├── components/           # Componentes React
│   ├── pages/           # Páginas completas
│   ├── ui/              # Componentes UI (shadcn)
│   └── figma/           # Componentes Figma
├── data/                # Dados mock e fixtures
├── types/               # Definições TypeScript
├── styles/              # Estilos globais
└── guidelines/          # Documentação de guidelines
```

### Organização de Componentes

#### `/components` (Raiz)

Componentes principais e de layout:

- `AnalystOrdersHome.tsx` - Container do Analista de Pedidos
- `StrategyAnalystHome.tsx` - Container do Analista de Estratégia
- `LoginPage.tsx` - Página de autenticação
- `FloatingChat.tsx` - Chat com IA (global)
- `ThemeProvider.tsx` - Provedor de tema

#### `/components/pages`

Páginas individuais de cada perfil:

- `HomePage.tsx` - Dashboard do Analista de Pedidos
- `OrderListingPage.tsx` - Listagem de pedidos
- `OrderDetailsPage.tsx` - Detalhes de pedido
- `StrategyHomePage.tsx` - Dashboard do Analista de Estratégia
- `StrategyOrdersPage.tsx` - Listagem de pedidos (estratégia)
- `StrategyOrderDetailsPage.tsx` - Detalhes com processo de compra
- `ForecastsPage.tsx` - Análise preditiva (compartilhado)

#### `/components/ui`

Componentes shadcn/ui reutilizáveis (40+ componentes)

---

## 👥 Perfis de Usuário

### 1. Analista de Pedidos (`orders-analyst`)

**Acesso via email**: `*analista.pedidos*` ou `*orders*`

#### Responsabilidades

- Analisar pedidos pendentes
- Aprovar, editar ou adiar pedidos
- Adicionar comentários e mencionar usuários
- Monitorar prazos e urgências

#### Páginas Disponíveis

1. **Home** - Dashboard com métricas
2. **Listagem de Pedidos** - Tabela completa com filtros
3. **Previsões** - Análise preditiva

#### Ações Principais

- ✅ Aprovar pedido
- ✏️ Editar pedido
- ⏸️ Adiar pedido (com lembrete)
- 💬 Adicionar comentário

---

### 2. Analista de Estratégia (`strategy-analyst`)

**Acesso via email**: `*analista.estrategia*` ou `*strategy*`

#### Responsabilidades

- Análise estratégica de pedidos aprovados
- Gestão do processo de compra
- Aprovação de cotações
- Acompanhamento de pagamentos e entregas

#### Páginas Disponíveis

1. **Home** - Dashboard estratégico
2. **Listagem de Pedidos** - Pedidos em processo de compra
3. **Previsões** - Análise preditiva

#### Fluxo de Aprovação

1. **Aprovar** - Sem observações
2. **Aprovar com Observação** - Com ressalvas
3. **Reprovar** - Com justificativa

#### Processo de Compra

```
Aprovado → Cotação → Pagamento → Entrega → Concluído
```

**Status do Pedido**:

- `purchase-request` - Solicitação iniciada
- `quotation-pending` - Aguardando cotações
- `quotation-approved` - Cotação aprovada
- `payment-pending` - Aguardando pagamento
- `payment-done` - Pagamento realizado
- `delivery-pending` - Aguardando entrega
- `delivered` - Entregue

---

## 🧩 Componentes Principais

### `App.tsx`

**Entry point** da aplicação

```typescript
// Gerencia
- Estado global (orders, orderHistory)
- Autenticação e perfil do usuário
- Roteamento entre perfis
- Atualização de pedidos
```

**Props principais**:

- `orders: Order[]` - Lista de pedidos
- `userEmail: string` - Email do usuário logado
- `userProfile: UserProfile` - Perfil do usuário

---

### `LoginPage.tsx`

Página de autenticação

**Funcionalidades**:

- Login baseado em email
- Detecção automática de perfil
- Tema claro/escuro
- Validação de campos

**Lógica de Redirecionamento**:

```typescript
if (email.includes('analista.pedidos') || email.includes('orders'))
  → orders-analyst
else if (email.includes('analista.estrategia') || email.includes('strategy'))
  → strategy-analyst
else
  → orders-analyst (padrão)
```

---

### `FloatingChat.tsx`

Chat com IA disponível em todas as páginas

**Características**:

- Botão flutuante (bottom-right)
- Análise inteligente de dados
- Sugestões contextuais por perfil
- Respostas baseadas em queries
- Exportação para nova aba

**Queries suportadas**:

- Status geral dos pedidos
- Pedidos urgentes
- Valores por centro de custo
- Fornecedores que atrasam
- Licitações em aberto
- Análise de ticket médio

**Personalização por Perfil**:

_Analista de Estratégia_:

- "Liste fornecedores que mais atrasam entrega"
- "Liste fornecedores com licitação em aberto"
- "Pedidos que precisam de análise estratégica"

_Analista de Pedidos_:

- "Qual o status geral dos pedidos?"
- "Quais pedidos precisam de atenção urgente?"
- "Mostre resumo por centro de custo"

---

### `ThemeProvider.tsx`

Gerenciador de tema claro/escuro

**Funcionalidades**:

- Persistência no localStorage
- Toggle suave entre temas
- Context API para acesso global

**Uso**:

```typescript
const { theme, toggleTheme } = useTheme();
```

---

### Dialogs e Modais

#### `EditOrderDialog.tsx`

Modal de edição de pedidos

**Campos editáveis**:

- Quantidade
- Valor estimado
- Fornecedor
- Centro de custo
- Prazo

#### `DeferDialog.tsx`

Modal de adiamento de pedidos

**Opções**:

- Justificativa obrigatória
- Tempo de lembrete (7, 15, 30 dias)
- Registro no histórico

#### `StrategyApprovalDialog.tsx`

Modal de aprovação estratégica

**Ações**:

1. Aprovar (direto)
2. Aprovar com Observação (campo de texto)
3. Reprovar (justificativa obrigatória)

**Comportamento**:

- Botão "Voltar" ocultado em "Aprovar com Observação"
- Validação de campos obrigatórios

---

## 📄 Páginas do Sistema

### Analista de Pedidos

#### `HomePage.tsx`

Dashboard principal

**Seções**:

1. **Cards de Métricas**
   - Total de pedidos
   - Precisam de análise
   - Aguardam aprovação
   - Já aprovados

2. **Pedidos Críticos**
   - Prazo ≤ 3 dias
   - Cards destacados

3. **Ações Rápidas**
   - Revisar pendentes
   - Ver todos os pedidos

#### `OrderListingPage.tsx`

Listagem completa de pedidos

**Funcionalidades**:

- Busca por item, ID, centro de custo
- Filtros por status e fonte
- Tabela responsiva
- Click para detalhes

**Colunas da Tabela**:

- ID | Item | Quantidade | Valor | Centro de Custo | Status | Ações

#### `OrderDetailsPage.tsx`

Detalhes completos do pedido

**Tabs**:

1. **Detalhes** - Informações completas
2. **Comentários** - Histórico de comunicação
3. **Histórico** - Todas as ações registradas

**Ações Disponíveis**:

- Aprovar
- Editar
- Adiar
- Adicionar comentário

---

### Analista de Estratégia

#### `StrategyHomePage.tsx`

Dashboard estratégico

**Cards de Métricas**:

- Aguardando análise
- Aprovados este mês
- Em processo de compra
- Valor total processado

**Insights**:

- Pedidos urgentes
- Tendências de aprovação
- Alertas automáticos

#### `StrategyOrdersPage.tsx`

Listagem de pedidos em processo de compra

**Cards de Status**:

- Para aprovação
- Em processo de compra
- Aprovados com observação
- Total de pedidos

**Tabela com Indicadores**:

- Cores de urgência (vermelho, laranja, amarelo)
- Status dinâmico com badges
- Informações de prazo

**Legenda de Urgência**:

- 🔴 Atrasado
- 🟠 Crítico (≤3 dias)
- 🟡 Urgente (≤7 dias)

#### `StrategyOrderDetailsPage.tsx`

Detalhes com processo de compra

**Linha do Tempo**:

1. Análise Estratégica
2. Aprovado
3. Cotação
4. Pagamento
5. Entrega

**Gestão de Cotações**:

- Adicionar múltiplas cotações
- Comparar fornecedores
- Aprovar/rejeitar cotações
- Selecionar melhor proposta

**Gestão de Pagamento**:

- Iniciar pagamento
- Confirmar pagamento
- Anexar comprovantes

**Gestão de Entrega**:

- Código de rastreamento
- Confirmar recebimento
- Data de entrega

---

### Compartilhado

#### `ForecastsPage.tsx`

Análise preditiva e previsões

**Dashboard Completo**:

1. **Filtro de Período**
   - Últimos 7 dias
   - Últimos 30 dias
   - Últimos 90 dias

2. **Métricas Principais**
   - Total de pedidos
   - Valor total
   - Taxa de aprovação
   - Tempo médio de análise

3. **Gráficos**
   - Volume de pedidos (linha)
   - Status dos pedidos (pizza)
   - Top categorias (barras)
   - Tendências (área)
   - Top centros de custo
   - Top fornecedores

4. **Insights Inteligentes**
   - Pedidos urgentes
   - Anomalias detectadas
   - Recomendações

5. **Projeções**
   - Gastos próximo mês
   - Tendências futuras

---

## 🎨 Sistema de Temas

### Implementação

```typescript
// ThemeProvider.tsx
const [theme, setTheme] = useState<"light" | "dark">("light");

// Toggle
const toggleTheme = () => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
};
```

### Classes Tailwind

**Modo Claro**:

- `bg-white` - Fundos
- `text-gray-900` - Textos
- `border-gray-200` - Bordas

**Modo Escuro**:

- `dark:bg-gray-900` - Fundos
- `dark:text-white` - Textos
- `dark:border-gray-800` - Bordas

### Variáveis CSS

```css
/* globals.css */
--color-primary: #465eff;
--color-secondary: #c2d6ff;
--color-ai: #fafec3;
```

---

## 📊 Estrutura de Dados

### Tipos Principais

#### `Order`

```typescript
interface Order {
  id: string; // ORD-2025-001
  sku: string; // Código do produto
  item: string; // Nome do item
  quantity: number; // Quantidade
  estimatedValue: number; // Valor unitário estimado
  costCenter: string; // Centro de custo
  status: OrderStatus; // Status atual
  category?: string; // Categoria do item
  suppliers?: string[]; // Lista de fornecedores
  supplier?: string; // Fornecedor principal
  deadline?: string; // Prazo (ISO 8601)
  reminderDate?: string; // Data de lembrete
  createdAt: string; // Data de criação
  source: string; // Origem (ERP, SharePoint, etc)
  comment?: string; // Comentário do analista
  comments?: Comment[]; // Histórico de comentários
  mentionedUser?: string; // Usuário mencionado
  description?: string; // Descrição detalhada
  strategyObservation?: string; // Observação estratégica
  purchaseProcess?: PurchaseProcess; // Processo de compra
}
```

#### `OrderStatus`

```typescript
type OrderStatus =
  | "pending" // Aguardando análise
  | "approved" // Aprovado
  | "deferred" // Adiado
  | "edited" // Editado
  | "strategy-review" // Em análise estratégica
  | "strategy-approved" // Aprovado pela estratégia
  | "strategy-approved-with-obs" // Aprovado com observação
  | "strategy-rejected" // Reprovado
  | "purchase-request" // Solicitação de compra
  | "quotation-pending" // Aguardando cotação
  | "quotation-approved" // Cotação aprovada
  | "payment-pending" // Aguardando pagamento
  | "payment-done" // Pagamento realizado
  | "delivery-pending" // Aguardando entrega
  | "delivered"; // Entregue
```

#### `PurchaseProcess`

```typescript
interface PurchaseProcess {
  id: string;
  orderId: string;
  stage: PurchaseStage;
  quotations: SupplierQuotation[];
  selectedQuotation?: string; // ID da cotação selecionada
  paymentStatus?: "pending" | "processing" | "completed";
  paymentDate?: string;
  paymentBy?: string; // Email do responsável
  deliveryDate?: string;
  deliveryConfirmedBy?: string;
  trackingNumber?: string;
  notes?: string;
}
```

#### `SupplierQuotation`

```typescript
interface SupplierQuotation {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: number; // Dias
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  submittedBy?: string;
}
```

#### `OrderHistory`

```typescript
interface OrderHistory {
  id: string;
  orderId: string;
  action: HistoryAction;
  user: string; // Nome do usuário
  userEmail: string; // Email completo
  timestamp: string; // ISO 8601
  details?: string; // Descrição da ação
  previousData?: Partial<Order>; // Dados anteriores (edição)
  metadata?: Record<string, any>; // Dados adicionais
}
```

#### `Comment`

```typescript
interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}
```

---

## 🔄 Fluxos de Trabalho

### Fluxo 1: Aprovação de Pedido (Analista de Pedidos)

```
1. Login → Dashboard
2. Ver pedido pendente
3. Clicar no pedido
4. Analisar detalhes
5. Decisão:
   ├─ Aprovar → Status: 'approved' → Histórico
   ├─ Editar → Modal → Salvar → Status: 'edited' → Histórico
   └─ Adiar → Modal → Justificativa → Status: 'deferred' → Histórico
```

### Fluxo 2: Análise Estratégica (Analista de Estratégia)

```
1. Login → Dashboard
2. Ver pedido aprovado ('approved')
3. Abrir detalhes
4. Clicar "Analisar Pedido"
5. Escolher ação:
   ├─ Aprovar → Status: 'strategy-approved'
   ├─ Aprovar c/ Obs → Campo de texto → Status: 'strategy-approved-with-obs'
   └─ Reprovar → Justificativa → Status: 'strategy-rejected'
6. Se aprovado → Inicia processo de compra
```

### Fluxo 3: Processo de Compra Completo

```
1. Pedido aprovado (strategy-approved)
   ↓
2. Status: 'purchase-request'
   - Gerar solicitação de compra
   ↓
3. Status: 'quotation-pending'
   - Solicitar cotações de fornecedores
   - Adicionar múltiplas cotações
   ↓
4. Status: 'quotation-approved'
   - Comparar propostas
   - Selecionar melhor cotação
   - Aprovar/Rejeitar outras
   ↓
5. Status: 'payment-pending'
   - Iniciar pagamento
   ↓
6. Status: 'payment-done'
   - Confirmar pagamento
   - Anexar comprovante
   ↓
7. Status: 'delivery-pending'
   - Aguardar entrega
   - Código de rastreamento
   ↓
8. Status: 'delivered'
   - Confirmar recebimento
   - Finalizar pedido
```

**Registro de Histórico em Cada Etapa**:

- Quem executou a ação
- Email do responsável
- Timestamp
- Detalhes da ação

---

## 🎨 Componentes UI

### Biblioteca: shadcn/ui

Total de **40+ componentes** disponíveis em `/components/ui`

### Componentes Mais Utilizados

#### `Button`

```tsx
<Button
  variant="default | outline | ghost"
  size="sm | default | lg"
>
  Texto
</Button>
```

**Variações**:

- `default` - Botão primário
- `outline` - Contornado
- `ghost` - Transparente

#### `Card`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>
```

#### `Badge`

```tsx
<Badge className="bg-green-100 text-green-800">Aprovado</Badge>
```

**Classes de Status**:

- Verde: `bg-green-100 text-green-800`
- Amarelo: `bg-yellow-100 text-yellow-800`
- Vermelho: `bg-red-100 text-red-800`
- Azul: `bg-blue-100 text-blue-800`

#### `Table`

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Coluna</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Dado</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### `Dialog`

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>
    {/* Conteúdo */}
    <DialogFooter>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### `Tabs`

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Conteúdo 1</TabsContent>
  <TabsContent value="tab2">Conteúdo 2</TabsContent>
</Tabs>
```

#### `Select`

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Opção 1</SelectItem>
    <SelectItem value="2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

### Gráficos: Recharts

#### `LineChart`

```tsx
<LineChart data={data} width={400} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="value" stroke="#465EFF" />
</LineChart>
```

#### `PieChart`

```tsx
<PieChart width={400} height={300}>
  <Pie
    data={data}
    dataKey="value"
    nameKey="name"
    fill="#465EFF"
  />
  <Tooltip />
  <Legend />
</PieChart>
```

#### `BarChart`

```tsx
<BarChart data={data} width={400} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#465EFF" />
</BarChart>
```

---

## 🛠️ Guia de Desenvolvimento

### Setup Inicial

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Estrutura de Novo Componente

```typescript
// components/NovoComponente.tsx
import { useState } from 'react';
import { Button } from './ui/button';

interface NovoComponenteProps {
  prop1: string;
  prop2?: number;
}

export function NovoComponente({ prop1, prop2 }: NovoComponenteProps) {
  const [state, setState] = useState('');

  return (
    <div className="p-4">
      {/* Conteúdo */}
    </div>
  );
}
```

### Boas Práticas

#### 1. Tipagem

- Sempre usar TypeScript
- Definir interfaces para props
- Evitar `any`

```typescript
// ✅ Bom
interface Props {
  orders: Order[];
  onUpdate: (id: string) => void;
}

// ❌ Ruim
function Component(props: any) {}
```

#### 2. Nomenclatura

```typescript
// Componentes: PascalCase
export function OrderCard() {}

// Funções: camelCase
const handleClick = () => {};

// Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;

// Interfaces: PascalCase com 'I' opcional
interface OrderProps {}
```

#### 3. Organização de Imports

```typescript
// 1. React e bibliotecas externas
import { useState } from "react";
import { Button } from "./ui/button";

// 2. Tipos
import { Order, OrderStatus } from "../types";

// 3. Componentes locais
import { OrderCard } from "./OrderCard";

// 4. Utilities e helpers
import { formatDate } from "../utils";

// 5. Estilos (se necessário)
import "./styles.css";
```

#### 4. Estado e Props

```typescript
// Estado local
const [isOpen, setIsOpen] = useState(false);

// Props drilling para dados compartilhados
<ChildComponent
  data={orders}
  onAction={handleAction}
/>

// Evitar prop drilling excessivo (>3 níveis)
// Considerar Context API se necessário
```

#### 5. Tailwind Classes

```typescript
// ✅ Use classes Tailwind
<div className="flex items-center gap-4 p-4 bg-white rounded-lg">

// ❌ Evite inline styles (exceto cores do sistema)
<div style={{ padding: '16px' }}>

// ✅ OK para cores do sistema
<div style={{ backgroundColor: '#465EFF' }}>
```

#### 6. Responsividade

```typescript
// Mobile-first
<div className="
  w-full          // Mobile
  md:w-1/2        // Tablet
  lg:w-1/3        // Desktop
">

// Breakpoints Tailwind
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

#### 7. Modo Escuro

```typescript
// Sempre adicionar classes dark:
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-800
">
```

---

### Adicionar Novo Tipo de Status

```typescript
// 1. types/index.ts
export type OrderStatus =
  | 'existing-status'
  | 'new-status';  // Adicionar aqui

// 2. Criar função de mapeamento
const getStatusInfo = (status: string) => {
  const statusMap: Record<string, StatusInfo> = {
    'new-status': {
      label: 'Novo Status',
      color: 'bg-purple-100 text-purple-800',
      icon: IconName
    }
  };
  return statusMap[status];
};

// 3. Adicionar no filtro (se aplicável)
<SelectItem value="new-status">Novo Status</SelectItem>

// 4. Adicionar lógica de transição
const handleNewStatus = () => {
  onUpdateOrder(orderId, { status: 'new-status' });
};
```

---

### Adicionar Nova Página

```typescript
// 1. Criar arquivo
// components/pages/NovaPage.tsx
export function NovaPage() {
  return (
    <div className="space-y-6">
      <h2>Nova Página</h2>
      {/* Conteúdo */}
    </div>
  );
}

// 2. Importar no Home correspondente
import { NovaPage } from './pages/NovaPage';

// 3. Adicionar ao tipo de página
type PageType = 'home' | 'orders' | 'nova-page';

// 4. Adicionar item no menu
const menuItems = [
  { id: 'nova-page', label: 'Nova Página', icon: IconName }
];

// 5. Adicionar renderização
{currentPage === 'nova-page' && <NovaPage />}
```

---

### Debugging

#### Console Logs Estruturados

```typescript
// ✅ Logs informativos
console.log("[OrderCard] Rendering order:", order.id);

// ⚠️ Avisos
console.warn("[API] Slow response time:", responseTime);

// ❌ Erros
console.error("[Payment] Failed to process:", error);
```

#### React DevTools

- Inspecionar hierarquia de componentes
- Ver props e state
- Identificar re-renders

#### Network Tab

- Verificar requisições (futuras)
- Analisar payloads
- Debug de APIs

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile First */
.element {
} /* < 640px */

@media (min-width: 640px) {
} /* sm */
@media (min-width: 768px) {
} /* md */
@media (min-width: 1024px) {
} /* lg */
@media (min-width: 1280px) {
} /* xl */
```

### Padrões Responsivos

#### Sidebar

```typescript
// Desktop: Sempre visível
// Mobile: Overlay com toggle
<aside className="
  fixed lg:sticky
  inset-y-0 left-0
  z-50 lg:z-0
  w-64
  -translate-x-full lg:translate-x-0
">
```

#### Grid

```typescript
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-4
">
```

#### Tabela

```typescript
<div className="overflow-x-auto">
  <Table>
    {/* Conteúdo */}
  </Table>
</div>
```

---

## 🎯 Indicadores de Urgência

### Sistema de Cores

```typescript
const getUrgencyLevel = (deadline?: string) => {
  if (!deadline) return "normal";

  const days = getDaysUntilDeadline(deadline);

  if (days < 0) return "overdue"; // Atrasado
  if (days <= 3) return "critical"; // Crítico
  if (days <= 7) return "urgent"; // Urgente
  return "normal"; // Normal
};
```

### Classes Visuais

```typescript
const urgencyColors = {
  overdue: "bg-red-50 border-l-4 border-red-500",
  critical: "bg-orange-50 border-l-4 border-orange-500",
  urgent: "bg-yellow-50 border-l-4 border-yellow-500",
  normal: "",
};
```

### Ícones

```typescript
{urgency === 'overdue' && <AlertTriangle className="text-red-500" />}
{urgency === 'critical' && <AlertTriangle className="text-orange-500" />}
{urgency === 'urgent' && <AlertTriangle className="text-yellow-500" />}
```

---

## 🔍 Chat com IA - Queries Avançadas

### Análise de Fornecedores

```typescript
// Fornecedores que atrasam
if (query.includes("atras") && query.includes("fornecedor")) {
  // Calcula atrasos de entrega
  // Ordena por frequência
  // Retorna top 5 com média de atraso
}
```

### Licitações em Aberto

```typescript
// Cotações pendentes
if (query.includes("licitação") || query.includes("cotação")) {
  // Filtra pedidos com quotations pendentes
  // Lista fornecedores envolvidos
  // Mostra status de cada cotação
}
```

### Análise Financeira

```typescript
// Ticket médio, valores, tendências
if (query.includes("ticket") || query.includes("valor")) {
  // Calcula médias
  // Identifica maior/menor pedido
  // Retorna análise detalhada
}
```

---

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading** (futuro)

   ```typescript
   const Component = lazy(() => import("./Component"));
   ```

2. **Memoization** (quando necessário)

   ```typescript
   const memoizedValue = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);
   ```

3. **Debounce em Buscas**
   ```typescript
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     [],
   );
   ```

---

## 📝 Convenções de Código

### Formatação

- **Indentação**: 2 espaços
- **Aspas**: Simples para JSX, duplas para strings
- **Ponto-e-vírgula**: Obrigatório
- **Linha máxima**: 100 caracteres (soft limit)

### Comentários

```typescript
// ✅ Comentários explicativos
// Calcula o total considerando descontos
const total = calculateTotal(items, discount);

// ✅ TODO comments
// TODO: Implementar cache para melhorar performance

// ✅ Seções
// ========================================
// Funções de Processamento
// ========================================
```

---

## 🔐 Segurança

### Validações

```typescript
// Input sanitization
const sanitizedInput = input.trim().toLowerCase();

// Email validation
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Prevent XSS
const SafeContent = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);
```

### Dados Sensíveis

- Não armazenar senhas no frontend
- Não logar dados sensíveis
- Usar HTTPS em produção
- Sanitizar inputs do usuário

---

## 📈 Métricas e Analytics

### Dados Coletáveis (futuro)

```typescript
// Page views
trackPageView(pageName);

// User actions
trackEvent("order_approved", { orderId, value });

// Performance
trackPerformance("page_load", duration);
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Estado não atualiza

```typescript
// ❌ Mutação direta
orders.push(newOrder);

// ✅ Imutabilidade
setOrders([...orders, newOrder]);
```

#### 2. Componente não re-renderiza

```typescript
// Verificar dependências do useEffect
useEffect(() => {
  // ...
}, [dependency]); // Não esquecer!
```

#### 3. Tema não aplica

```typescript
// Verificar se está dentro do ThemeProvider
<ThemeProvider>
  <App />
</ThemeProvider>
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

### Ícones

- [Lucide Icons](https://lucide.dev)

---

## 🔄 Atualizações Futuras

### Roadmap Técnico

1. **Backend Integration**
   - API REST
   - Autenticação JWT
   - WebSocket para real-time

2. **State Management**
   - Implementar Redux/Zustand
   - Cache de dados

3. **Testing**
   - Unit tests (Vitest)
   - Integration tests
   - E2E tests (Playwright)

4. **Performance**
   - Code splitting
   - Virtual scrolling
   - Image optimization

5. **Features**
   - Upload de arquivos
   - Exportação de relatórios
   - Notificações push
   - Integração com calendário

---

## 📞 Suporte

Para dúvidas sobre o código ou arquitetura, consulte:

1. Esta documentação
2. Comentários no código
3. `/guidelines/Guidelines.md`
4. Equipe de desenvolvimento

---

## 📄 Licença

Projeto proprietário - Revolux © 2025

---

**Última Atualização**: 16 de Outubro de 2025

**Versão da Documentação**: 1.0.0

**Mantido por**: Equipe de Desenvolvimento Revolux