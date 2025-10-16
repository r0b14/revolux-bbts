import { Order, OrderHistory } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    sku: 'PLT-MAD-1200',
    item: 'Palete de madeira tratada 1,20x1,00m',
    quantity: 500,
    estimatedValue: 30,
    costCenter: 'LOG-CD-SP-01',
    status: 'pending',
    supplier: 'Madeiras Brasil Ltda',
    deadline: '2025-11-15',
    createdAt: '2025-10-10T08:30:00',
    source: 'ERP SAP'
  },
  {
    id: 'ORD-2025-002',
    sku: 'EQP-EMP-25T',
    item: 'Empilhadeira elétrica 2.5T',
    quantity: 2,
    estimatedValue: 90000,
    costCenter: 'LOG-CD-RJ-02',
    status: 'pending',
    supplier: 'Toyota Material Handling',
    deadline: '2025-12-01',
    createdAt: '2025-10-11T09:15:00',
    source: 'SharePoint - Planilha de Necessidades'
  },
  {
    id: 'ORD-2025-003',
    sku: 'EMB-FLM-500',
    item: 'Filme stretch 500mm x 300m',
    quantity: 1200,
    estimatedValue: 30,
    costCenter: 'LOG-CD-SP-01',
    status: 'pending',
    supplier: 'Embralpack Distribuidora',
    deadline: '2025-10-25',
    createdAt: '2025-10-12T10:20:00',
    source: 'Upload Manual - inventory_forecast.xlsx'
  },
  {
    id: 'ORD-2025-004',
    sku: 'TEC-RFID-SYS',
    item: 'Sistema de etiquetagem RFID',
    quantity: 5,
    estimatedValue: 19000,
    costCenter: 'LOG-TEC-01',
    status: 'approved',
    supplier: 'Zebra Technologies',
    deadline: '2025-11-20',
    createdAt: '2025-10-08T14:45:00',
    source: 'ERP SAP',
    comment: 'Favor revisar a quantidade solicitada. Verificar se 5 unidades são suficientes para toda a operação.',
    mentionedUser: 'analista.pedidos@revolux.com'
  },
  {
    id: 'ORD-2025-005',
    sku: 'EMB-CXP-604',
    item: 'Caixas de papelão ondulado 60x40x40cm',
    quantity: 10000,
    estimatedValue: 2.80,
    costCenter: 'LOG-CD-MG-03',
    status: 'pending',
    supplier: 'Klabin Embalagens',
    deadline: '2025-10-30',
    createdAt: '2025-10-13T11:00:00',
    source: 'ERP SAP'
  },
  {
    id: 'ORD-2025-006',
    sku: 'EQP-TRP-25T',
    item: 'Transpalete manual 2.5T',
    quantity: 8,
    estimatedValue: 1600,
    costCenter: 'LOG-CD-SP-01',
    status: 'pending',
    supplier: 'Yale Industrial',
    deadline: '2025-11-10',
    createdAt: '2025-10-14T13:30:00',
    source: 'Upload Manual - equipment_needs.csv'
  },
  {
    id: 'ORD-2025-007',
    sku: 'EMB-FTA-48M',
    item: 'Fita adesiva transparente 48mm x 100m',
    quantity: 2400,
    estimatedValue: 3.50,
    costCenter: 'LOG-CD-RJ-02',
    status: 'deferred',
    supplier: 'Adelbras Adesivos',
    deadline: '2025-11-05',
    createdAt: '2025-10-09T15:20:00',
    source: 'SharePoint - Planilha de Necessidades'
  },
  {
    id: 'ORD-2025-008',
    sku: 'TEC-SCN-IND',
    item: 'Scanner de código de barras industrial',
    quantity: 15,
    estimatedValue: 1500,
    costCenter: 'LOG-CD-MG-03',
    status: 'pending',
    supplier: 'Honeywell Scanning',
    deadline: '2025-11-18',
    createdAt: '2025-10-15T08:00:00',
    source: 'ERP SAP'
  }
];

export const mockHistory: OrderHistory[] = [
  {
    orderId: 'ORD-2025-004',
    action: 'approved',
    user: 'maria.silva@revolux.com',
    timestamp: '2025-10-14T10:30:00',
    details: 'Aprovado conforme análise de ROI positivo'
  },
  {
    orderId: 'ORD-2025-007',
    action: 'deferred',
    user: 'joao.santos@revolux.com',
    timestamp: '2025-10-13T16:45:00',
    details: 'Estoque atual ainda suficiente para 45 dias. Reavaliar em novembro.'
  }
];
