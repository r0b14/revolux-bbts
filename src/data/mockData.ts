import { Order, OrderHistory } from '../types';

export const mockOrders: Order[] = [
  // Pedidos para aprovação
  {
    id: 'ORD-2025-001',
    sku: 'PLT-MAD-1200',
    item: 'Palete de madeira tratada 1,20x1,00m',
    quantity: 500,
    estimatedValue: 30,
    costCenter: 'LOG-CD-SP-01',
    status: 'pending',
    supplier: 'Madeiras Brasil Ltda',
    deadline: '2025-10-20',
    createdAt: '2025-10-10T08:30:00',
    source: 'ERP SAP',
    category: 'Embalagem'
  },
  {
    id: 'ORD-2025-002',
    sku: 'EQP-EMP-25T',
    item: 'Empilhadeira elétrica 2.5T',
    quantity: 2,
    estimatedValue: 90000,
    costCenter: 'LOG-CD-RJ-02',
    status: 'approved',
    supplier: 'Toyota Material Handling',
    deadline: '2025-12-01',
    createdAt: '2025-10-11T09:15:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Equipamentos'
  },
  {
    id: 'ORD-2025-003',
    sku: 'EMB-FLM-500',
    item: 'Filme stretch 500mm x 300m',
    quantity: 1200,
    estimatedValue: 30,
    costCenter: 'LOG-CD-SP-01',
    status: 'quotation-pending',
    supplier: 'Embralpack Distribuidora',
    deadline: '2025-10-18',
    createdAt: '2025-10-12T10:20:00',
    source: 'Upload Manual - inventory_forecast.xlsx',
    category: 'Embalagem',
    purchaseProcess: {
      id: 'PUR-003',
      orderId: 'ORD-2025-003',
      stage: 'quotation-request',
      quotations: [
        {
          id: 'QT-003-001',
          supplierId: 'embralpack',
          supplierName: 'Embralpack Distribuidora',
          unitPrice: 28.50,
          totalPrice: 34200,
          deliveryTime: 15,
          status: 'pending',
          submittedAt: '2025-10-14T10:30:00',
          submittedBy: 'compras.ana@revolux.com'
        },
        {
          id: 'QT-003-002',
          supplierId: 'plastiflex',
          supplierName: 'Plastiflex Embalagens',
          unitPrice: 29.00,
          totalPrice: 34800,
          deliveryTime: 12,
          status: 'pending',
          submittedAt: '2025-10-14T14:15:00',
          submittedBy: 'compras.ana@revolux.com'
        },
        {
          id: 'QT-003-003',
          supplierId: 'embaltec',
          supplierName: 'Embaltec Soluções',
          unitPrice: 27.80,
          totalPrice: 33360,
          deliveryTime: 18,
          status: 'pending',
          submittedAt: '2025-10-15T09:00:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ]
    }
  },
  {
    id: 'ORD-2025-004',
    sku: 'TEC-RFID-SYS',
    item: 'Sistema de etiquetagem RFID',
    quantity: 5,
    estimatedValue: 19000,
    costCenter: 'LOG-TEC-01',
    status: 'payment-pending',
    supplier: 'Zebra Technologies',
    deadline: '2025-11-20',
    createdAt: '2025-10-08T14:45:00',
    source: 'ERP SAP',
    category: 'Tecnologia',
    strategyObservation: 'Verificar compatibilidade com sistema WMS atual antes da compra',
    purchaseProcess: {
      id: 'PUR-004',
      orderId: 'ORD-2025-004',
      stage: 'payment-processing',
      quotations: [
        {
          id: 'QT-004-001',
          supplierId: 'zebra',
          supplierName: 'Zebra Technologies',
          unitPrice: 18500,
          totalPrice: 92500,
          deliveryTime: 30,
          status: 'approved',
          submittedAt: '2025-10-15T10:00:00',
          submittedBy: 'compras.lucia@revolux.com'
        },
        {
          id: 'QT-004-002',
          supplierId: 'honeywell',
          supplierName: 'Honeywell RFID',
          unitPrice: 19200,
          totalPrice: 96000,
          deliveryTime: 25,
          status: 'rejected',
          submittedAt: '2025-10-15T11:30:00',
          submittedBy: 'compras.lucia@revolux.com'
        }
      ],
      selectedQuotation: 'QT-004-001',
      paymentStatus: 'processing'
    }
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
    source: 'ERP SAP',
    category: 'Embalagem'
  },
  {
    id: 'ORD-2025-006',
    sku: 'EQP-TRP-25T',
    item: 'Transpalete manual 2.5T',
    quantity: 8,
    estimatedValue: 1600,
    costCenter: 'LOG-CD-SP-01',
    status: 'approved',
    supplier: 'Yale Industrial',
    deadline: '2025-11-10',
    createdAt: '2025-10-14T13:30:00',
    source: 'Upload Manual - equipment_needs.csv',
    category: 'Equipamentos'
  },
  {
    id: 'ORD-2025-007',
    sku: 'EMB-FTA-48M',
    item: 'Fita adesiva transparente 48mm x 100m',
    quantity: 2400,
    estimatedValue: 3.50,
    costCenter: 'LOG-CD-RJ-02',
    status: 'quotation-approved',
    supplier: 'Adelbras Adesivos',
    deadline: '2025-11-05',
    createdAt: '2025-10-09T15:20:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Embalagem',
    purchaseProcess: {
      id: 'PUR-007',
      orderId: 'ORD-2025-007',
      stage: 'quotation-approved',
      quotations: [
        {
          id: 'QT-007-001',
          supplierId: 'adelbras',
          supplierName: 'Adelbras Adesivos',
          unitPrice: 3.30,
          totalPrice: 7920,
          deliveryTime: 10,
          status: 'approved',
          submittedAt: '2025-10-12T09:00:00',
          submittedBy: 'compras.ana@revolux.com'
        },
        {
          id: 'QT-007-002',
          supplierId: 'tectape',
          supplierName: 'Tectape Fitas',
          unitPrice: 3.45,
          totalPrice: 8280,
          deliveryTime: 8,
          status: 'rejected',
          submittedAt: '2025-10-12T10:30:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ],
      selectedQuotation: 'QT-007-001'
    }
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
    source: 'ERP SAP',
    category: 'Tecnologia'
  },
  {
    id: 'ORD-2025-009',
    sku: 'SEG-EPI-LUV',
    item: 'Luvas de proteção antiderrapantes',
    quantity: 500,
    estimatedValue: 8.50,
    costCenter: 'LOG-CD-SP-01',
    status: 'payment-done',
    supplier: 'EPI Center',
    deadline: '2025-10-25',
    createdAt: '2025-10-05T09:30:00',
    source: 'ERP SAP',
    category: 'Segurança',
    purchaseProcess: {
      id: 'PUR-009',
      orderId: 'ORD-2025-009',
      stage: 'payment-completed',
      quotations: [
        {
          id: 'QT-009-001',
          supplierId: 'epi-center',
          supplierName: 'EPI Center',
          unitPrice: 8.20,
          totalPrice: 4100,
          deliveryTime: 15,
          status: 'approved',
          submittedAt: '2025-10-10T14:00:00',
          submittedBy: 'compras.lucia@revolux.com'
        },
        {
          id: 'QT-009-002',
          supplierId: 'protex',
          supplierName: 'Protex Segurança',
          unitPrice: 8.50,
          totalPrice: 4250,
          deliveryTime: 12,
          status: 'rejected',
          submittedAt: '2025-10-10T15:30:00',
          submittedBy: 'compras.lucia@revolux.com'
        }
      ],
      selectedQuotation: 'QT-009-001',
      paymentStatus: 'completed',
      paymentDate: '2025-10-14T16:20:00',
      paymentBy: 'financeiro.carlos@revolux.com'
    }
  },
  {
    id: 'ORD-2025-010',
    sku: 'MAT-LIM-DET',
    item: 'Detergente industrial neutro 5L',
    quantity: 200,
    estimatedValue: 25,
    costCenter: 'LOG-CD-RJ-02',
    status: 'pending',
    supplier: 'Química Total',
    deadline: '2025-10-22',
    createdAt: '2025-10-14T10:15:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Material de Limpeza'
  },
  {
    id: 'ORD-2025-011',
    sku: 'EQP-PRA-300',
    item: 'Prateleira industrial 3,00m x 2,50m',
    quantity: 50,
    estimatedValue: 850,
    costCenter: 'LOG-CD-MG-03',
    status: 'delivery-pending',
    supplier: 'Racks & Cia',
    deadline: '2025-11-15',
    createdAt: '2025-10-01T11:20:00',
    source: 'ERP SAP',
    category: 'Equipamentos',
    purchaseProcess: {
      id: 'PUR-011',
      orderId: 'ORD-2025-011',
      stage: 'in-transit',
      quotations: [
        {
          id: 'QT-011-001',
          supplierId: 'racks-cia',
          supplierName: 'Racks & Cia',
          unitPrice: 820,
          totalPrice: 41000,
          deliveryTime: 20,
          status: 'approved',
          submittedAt: '2025-10-05T09:00:00',
          submittedBy: 'compras.ana@revolux.com'
        },
        {
          id: 'QT-011-002',
          supplierId: 'metalurgica-forte',
          supplierName: 'Metalúrgica Forte',
          unitPrice: 850,
          totalPrice: 42500,
          deliveryTime: 25,
          status: 'rejected',
          submittedAt: '2025-10-05T11:00:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ],
      selectedQuotation: 'QT-011-001',
      paymentStatus: 'completed',
      paymentDate: '2025-10-12T15:30:00',
      paymentBy: 'financeiro.carlos@revolux.com',
      trackingNumber: 'BR123456789CD'
    }
  },
  {
    id: 'ORD-2025-012',
    sku: 'TEC-IMP-TER',
    item: 'Impressora térmica de etiquetas',
    quantity: 10,
    estimatedValue: 2500,
    costCenter: 'LOG-CD-SP-01',
    status: 'approved',
    supplier: 'Argox Brasil',
    deadline: '2025-11-28',
    createdAt: '2025-10-13T14:45:00',
    source: 'Upload Manual - tech_requirements.xlsx',
    category: 'Tecnologia'
  },
  {
    id: 'ORD-2025-013',
    sku: 'EMB-ETQ-100',
    item: 'Etiquetas adesivas 100x50mm',
    quantity: 50000,
    estimatedValue: 0.15,
    costCenter: 'LOG-CD-RJ-02',
    status: 'delivered',
    supplier: 'Label Express',
    deadline: '2025-10-15',
    createdAt: '2025-09-28T08:00:00',
    source: 'ERP SAP',
    category: 'Embalagem',
    purchaseProcess: {
      id: 'PUR-013',
      orderId: 'ORD-2025-013',
      stage: 'delivered',
      quotations: [
        {
          id: 'QT-013-001',
          supplierId: 'label-express',
          supplierName: 'Label Express',
          unitPrice: 0.14,
          totalPrice: 7000,
          deliveryTime: 10,
          status: 'approved',
          submittedAt: '2025-10-01T10:00:00',
          submittedBy: 'compras.lucia@revolux.com'
        }
      ],
      selectedQuotation: 'QT-013-001',
      paymentStatus: 'completed',
      paymentDate: '2025-10-05T11:20:00',
      paymentBy: 'financeiro.carlos@revolux.com',
      deliveryDate: '2025-10-14T16:30:00',
      deliveryConfirmedBy: 'recebimento.pedro@revolux.com',
      trackingNumber: 'BR987654321SP'
    }
  },
  {
    id: 'ORD-2025-014',
    sku: 'SEG-CAP-SEG',
    item: 'Capacetes de segurança com jugular',
    quantity: 100,
    estimatedValue: 35,
    costCenter: 'LOG-CD-MG-03',
    status: 'pending',
    supplier: 'Protege Mais',
    deadline: '2025-10-26',
    createdAt: '2025-10-14T16:00:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Segurança'
  },
  {
    id: 'ORD-2025-015',
    sku: 'MAT-CAN-ESC',
    item: 'Canetas esferográficas azul',
    quantity: 1000,
    estimatedValue: 1.20,
    costCenter: 'LOG-ADM-01',
    status: 'quotation-approved',
    supplier: 'Papelaria Central',
    deadline: '2025-11-01',
    createdAt: '2025-10-10T09:30:00',
    source: 'ERP SAP',
    category: 'Material de Escritório',
    purchaseProcess: {
      id: 'PUR-015',
      orderId: 'ORD-2025-015',
      stage: 'quotation-approved',
      quotations: [
        {
          id: 'QT-015-001',
          supplierId: 'papelaria-central',
          supplierName: 'Papelaria Central',
          unitPrice: 1.10,
          totalPrice: 1100,
          deliveryTime: 7,
          status: 'approved',
          submittedAt: '2025-10-13T11:00:00',
          submittedBy: 'compras.ana@revolux.com'
        },
        {
          id: 'QT-015-002',
          supplierId: 'kalunga',
          supplierName: 'Kalunga',
          unitPrice: 1.25,
          totalPrice: 1250,
          deliveryTime: 5,
          status: 'rejected',
          submittedAt: '2025-10-13T13:00:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ],
      selectedQuotation: 'QT-015-001'
    }
  },
  {
    id: 'ORD-2025-016',
    sku: 'EQP-CAR-ELE',
    item: 'Carrinho de transporte elétrico',
    quantity: 3,
    estimatedValue: 15000,
    costCenter: 'LOG-CD-SP-01',
    status: 'strategy-review',
    supplier: 'Movetech',
    deadline: '2025-12-10',
    createdAt: '2025-10-12T11:45:00',
    source: 'Upload Manual - capex_2025.xlsx',
    category: 'Equipamentos'
  },
  {
    id: 'ORD-2025-017',
    sku: 'EMB-PLA-BOL',
    item: 'Plástico bolha 1,30m x 100m',
    quantity: 80,
    estimatedValue: 120,
    costCenter: 'LOG-CD-RJ-02',
    status: 'pending',
    supplier: 'Plastiflex',
    deadline: '2025-10-21',
    createdAt: '2025-10-15T13:20:00',
    source: 'ERP SAP',
    category: 'Embalagem'
  },
  {
    id: 'ORD-2025-018',
    sku: 'TEC-TAB-IND',
    item: 'Tablet industrial resistente',
    quantity: 12,
    estimatedValue: 3200,
    costCenter: 'LOG-CD-MG-03',
    status: 'payment-pending',
    supplier: 'Panasonic Toughbook',
    deadline: '2025-11-25',
    createdAt: '2025-10-11T10:00:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Tecnologia',
    strategyObservation: 'Priorizar modelos com Android para integração com apps existentes',
    purchaseProcess: {
      id: 'PUR-018',
      orderId: 'ORD-2025-018',
      stage: 'payment-processing',
      quotations: [
        {
          id: 'QT-018-001',
          supplierId: 'panasonic',
          supplierName: 'Panasonic Toughbook',
          unitPrice: 3150,
          totalPrice: 37800,
          deliveryTime: 35,
          status: 'approved',
          submittedAt: '2025-10-14T09:30:00',
          submittedBy: 'compras.lucia@revolux.com'
        },
        {
          id: 'QT-018-002',
          supplierId: 'samsung',
          supplierName: 'Samsung Enterprise',
          unitPrice: 2980,
          totalPrice: 35760,
          deliveryTime: 40,
          status: 'rejected',
          submittedAt: '2025-10-14T11:00:00',
          submittedBy: 'compras.lucia@revolux.com'
        },
        {
          id: 'QT-018-003',
          supplierId: 'zebra-tablets',
          supplierName: 'Zebra Tablets',
          unitPrice: 3280,
          totalPrice: 39360,
          deliveryTime: 30,
          status: 'rejected',
          submittedAt: '2025-10-14T14:30:00',
          submittedBy: 'compras.lucia@revolux.com'
        }
      ],
      selectedQuotation: 'QT-018-001',
      paymentStatus: 'processing'
    }
  },
  {
    id: 'ORD-2025-019',
    sku: 'SEG-COL-REF',
    item: 'Coletes refletivos amarelo/laranja',
    quantity: 300,
    estimatedValue: 18,
    costCenter: 'LOG-CD-SP-01',
    status: 'payment-done',
    supplier: 'Segurança Total',
    deadline: '2025-10-19',
    createdAt: '2025-10-08T08:30:00',
    source: 'ERP SAP',
    category: 'Segurança',
    purchaseProcess: {
      id: 'PUR-019',
      orderId: 'ORD-2025-019',
      stage: 'payment-completed',
      quotations: [
        {
          id: 'QT-019-001',
          supplierId: 'seguranca-total',
          supplierName: 'Segurança Total',
          unitPrice: 17.50,
          totalPrice: 5250,
          deliveryTime: 10,
          status: 'approved',
          submittedAt: '2025-10-11T14:30:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ],
      selectedQuotation: 'QT-019-001',
      paymentStatus: 'completed',
      paymentDate: '2025-10-15T10:00:00',
      paymentBy: 'financeiro.carlos@revolux.com'
    }
  },
  {
    id: 'ORD-2025-020',
    sku: 'MAT-PAP-A4',
    item: 'Papel sulfite A4 75g (cx c/ 10 resmas)',
    quantity: 50,
    estimatedValue: 180,
    costCenter: 'LOG-ADM-01',
    status: 'pending',
    supplier: 'Distribuidora Papéis',
    deadline: '2025-10-24',
    createdAt: '2025-10-14T15:30:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Material de Escritório'
  },
  {
    id: 'ORD-2025-021',
    sku: 'EQP-ESC-ALU',
    item: 'Escada de alumínio 6 degraus',
    quantity: 15,
    estimatedValue: 280,
    costCenter: 'LOG-CD-MG-03',
    status: 'approved',
    supplier: 'Ferramentas Industriais',
    deadline: '2025-11-08',
    createdAt: '2025-10-13T09:00:00',
    source: 'ERP SAP',
    category: 'Equipamentos'
  },
  {
    id: 'ORD-2025-022',
    sku: 'TEC-ROU-WIF',
    item: 'Roteador industrial Wi-Fi 6',
    quantity: 8,
    estimatedValue: 1800,
    costCenter: 'LOG-TEC-01',
    status: 'quotation-pending',
    supplier: 'Cisco Systems',
    deadline: '2025-11-30',
    createdAt: '2025-10-10T14:00:00',
    source: 'Upload Manual - network_upgrade.csv',
    category: 'Tecnologia',
    purchaseProcess: {
      id: 'PUR-022',
      orderId: 'ORD-2025-022',
      stage: 'quotation-request',
      quotations: [
        {
          id: 'QT-022-001',
          supplierId: 'cisco',
          supplierName: 'Cisco Systems',
          unitPrice: 1750,
          totalPrice: 14000,
          deliveryTime: 20,
          status: 'pending',
          submittedAt: '2025-10-15T10:00:00',
          submittedBy: 'compras.lucia@revolux.com'
        },
        {
          id: 'QT-022-002',
          supplierId: 'ubiquiti',
          supplierName: 'Ubiquiti Networks',
          unitPrice: 1680,
          totalPrice: 13440,
          deliveryTime: 15,
          status: 'pending',
          submittedAt: '2025-10-15T11:30:00',
          submittedBy: 'compras.lucia@revolux.com'
        }
      ]
    }
  },
  {
    id: 'ORD-2025-023',
    sku: 'EMB-SAC-PLT',
    item: 'Sacos plásticos 50x60cm (pct c/ 100un)',
    quantity: 500,
    estimatedValue: 12,
    costCenter: 'LOG-CD-RJ-02',
    status: 'pending',
    supplier: 'Plastipack',
    deadline: '2025-10-23',
    createdAt: '2025-10-15T11:00:00',
    source: 'ERP SAP',
    category: 'Embalagem'
  },
  {
    id: 'ORD-2025-024',
    sku: 'SEG-BOT-SEG',
    item: 'Botas de segurança com biqueira de aço',
    quantity: 80,
    estimatedValue: 120,
    costCenter: 'LOG-CD-SP-01',
    status: 'strategy-rejected',
    supplier: 'Calçados Profissionais',
    deadline: '2025-10-28',
    createdAt: '2025-10-12T16:30:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Segurança'
  },
  {
    id: 'ORD-2025-025',
    sku: 'MAT-TON-HP',
    item: 'Toner HP LaserJet CE285A',
    quantity: 30,
    estimatedValue: 180,
    costCenter: 'LOG-ADM-01',
    status: 'quotation-pending',
    supplier: 'Suprimentos Corporativos',
    deadline: '2025-11-05',
    createdAt: '2025-10-11T10:30:00',
    source: 'ERP SAP',
    category: 'Material de Escritório',
    purchaseProcess: {
      id: 'PUR-025',
      orderId: 'ORD-2025-025',
      stage: 'quotation-request',
      quotations: []
    }
  },
  {
    id: 'ORD-2025-026',
    sku: 'EQP-VEN-IND',
    item: 'Ventilador industrial de parede 60cm',
    quantity: 20,
    estimatedValue: 350,
    costCenter: 'LOG-CD-MG-03',
    status: 'pending',
    supplier: 'Ventisol Industrial',
    deadline: '2025-11-12',
    createdAt: '2025-10-14T14:15:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Equipamentos'
  },
  {
    id: 'ORD-2025-027',
    sku: 'TEC-CAM-SEG',
    item: 'Câmera de segurança IP Full HD',
    quantity: 25,
    estimatedValue: 450,
    costCenter: 'LOG-TEC-01',
    status: 'approved',
    supplier: 'Intelbras',
    deadline: '2025-12-05',
    createdAt: '2025-10-09T13:00:00',
    source: 'ERP SAP',
    category: 'Tecnologia'
  },
  {
    id: 'ORD-2025-028',
    sku: 'EMB-CIN-EMB',
    item: 'Cinta de amarração 5m x 50mm',
    quantity: 200,
    estimatedValue: 25,
    costCenter: 'LOG-CD-SP-01',
    status: 'delivered',
    supplier: 'Amarrações Brasil',
    deadline: '2025-10-16',
    createdAt: '2025-10-05T09:45:00',
    source: 'Upload Manual - logistics_supplies.xlsx',
    category: 'Embalagem',
    purchaseProcess: {
      id: 'PUR-028',
      orderId: 'ORD-2025-028',
      stage: 'delivered',
      quotations: [
        {
          id: 'QT-028-001',
          supplierId: 'amarracoes-brasil',
          supplierName: 'Amarrações Brasil',
          unitPrice: 24,
          totalPrice: 4800,
          deliveryTime: 8,
          status: 'approved',
          submittedAt: '2025-10-07T11:00:00',
          submittedBy: 'compras.ana@revolux.com'
        }
      ],
      selectedQuotation: 'QT-028-001',
      paymentStatus: 'completed',
      paymentDate: '2025-10-10T14:00:00',
      paymentBy: 'financeiro.carlos@revolux.com',
      deliveryDate: '2025-10-15T10:30:00',
      deliveryConfirmedBy: 'recebimento.pedro@revolux.com',
      trackingNumber: 'BR456789123MG'
    }
  },
  {
    id: 'ORD-2025-029',
    sku: 'SEG-OCL-PRO',
    item: 'Óculos de proteção com antiembaçante',
    quantity: 150,
    estimatedValue: 22,
    costCenter: 'LOG-CD-RJ-02',
    status: 'pending',
    supplier: 'Protex EPI',
    deadline: '2025-10-27',
    createdAt: '2025-10-15T08:15:00',
    source: 'ERP SAP',
    category: 'Segurança'
  },
  {
    id: 'ORD-2025-030',
    sku: 'MAT-CAD-ESC',
    item: 'Caderno universitário 200 folhas',
    quantity: 200,
    estimatedValue: 15,
    costCenter: 'LOG-ADM-01',
    status: 'pending',
    supplier: 'Tilibra Produtos',
    deadline: '2025-10-29',
    createdAt: '2025-10-14T12:00:00',
    source: 'SharePoint - Planilha de Necessidades',
    category: 'Material de Escritório'
  }
];

export const mockHistory: OrderHistory[] = [
  // ORD-2025-003 - Filme stretch (quotation-pending)
  {
    id: 'H-003-001',
    orderId: 'ORD-2025-003',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-13T09:00:00',
    details: 'Pedido aprovado pela estratégia - Processo de compra iniciado'
  },
  {
    id: 'H-003-002',
    orderId: 'ORD-2025-003',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-14T10:30:00',
    details: 'Solicitação de cotação enviada para 3 fornecedores'
  },
  {
    id: 'H-003-003',
    orderId: 'ORD-2025-003',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-14T10:30:00',
    details: 'Cotação recebida de Embralpack Distribuidora - R$ 34.200,00'
  },
  {
    id: 'H-003-004',
    orderId: 'ORD-2025-003',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-14T14:15:00',
    details: 'Cotação recebida de Plastiflex Embalagens - R$ 34.800,00'
  },
  {
    id: 'H-003-005',
    orderId: 'ORD-2025-003',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-15T09:00:00',
    details: 'Cotação recebida de Embaltec Soluções - R$ 33.360,00 (Melhor preço)'
  },

  // ORD-2025-004 - RFID (payment-pending)
  {
    id: 'H-004-001',
    orderId: 'ORD-2025-004',
    action: 'strategy-approved-with-obs',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-13T15:00:00',
    details: 'Aprovado com observação: Verificar compatibilidade com sistema WMS'
  },
  {
    id: 'H-004-002',
    orderId: 'ORD-2025-004',
    action: 'quotation-requested',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T09:00:00',
    details: 'Solicitação de cotação enviada para fornecedores especializados'
  },
  {
    id: 'H-004-003',
    orderId: 'ORD-2025-004',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T10:00:00',
    details: 'Cotação recebida de Zebra Technologies - R$ 92.500,00'
  },
  {
    id: 'H-004-004',
    orderId: 'ORD-2025-004',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T11:30:00',
    details: 'Cotação recebida de Honeywell RFID - R$ 96.000,00'
  },
  {
    id: 'H-004-005',
    orderId: 'ORD-2025-004',
    action: 'quotation-approved',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T14:00:00',
    details: 'Cotação da Zebra Technologies aprovada - Melhor custo-benefício'
  },
  {
    id: 'H-004-006',
    orderId: 'ORD-2025-004',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-15T16:30:00',
    details: 'Pagamento em processamento - Aguardando aprovação financeira'
  },

  // ORD-2025-007 - Fita adesiva (quotation-approved)
  {
    id: 'H-007-001',
    orderId: 'ORD-2025-007',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-11T10:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-007-002',
    orderId: 'ORD-2025-007',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-12T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-007-003',
    orderId: 'ORD-2025-007',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-12T09:00:00',
    details: 'Cotação recebida de Adelbras Adesivos - R$ 7.920,00'
  },
  {
    id: 'H-007-004',
    orderId: 'ORD-2025-007',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-12T10:30:00',
    details: 'Cotação recebida de Tectape Fitas - R$ 8.280,00'
  },
  {
    id: 'H-007-005',
    orderId: 'ORD-2025-007',
    action: 'quotation-approved',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-12T15:00:00',
    details: 'Cotação da Adelbras aprovada - Melhor preço e prazo adequado'
  },

  // ORD-2025-009 - Luvas (payment-done)
  {
    id: 'H-009-001',
    orderId: 'ORD-2025-009',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-09T11:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-009-002',
    orderId: 'ORD-2025-009',
    action: 'quotation-requested',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-10T09:00:00',
    details: 'Solicitação de cotação enviada para fornecedores de EPI'
  },
  {
    id: 'H-009-003',
    orderId: 'ORD-2025-009',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-10T14:00:00',
    details: 'Cotação recebida de EPI Center - R$ 4.100,00'
  },
  {
    id: 'H-009-004',
    orderId: 'ORD-2025-009',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-10T15:30:00',
    details: 'Cotação recebida de Protex Segurança - R$ 4.250,00'
  },
  {
    id: 'H-009-005',
    orderId: 'ORD-2025-009',
    action: 'quotation-approved',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-11T10:00:00',
    details: 'Cotação da EPI Center aprovada'
  },
  {
    id: 'H-009-006',
    orderId: 'ORD-2025-009',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-14T14:00:00',
    details: 'Pagamento iniciado via boleto bancário'
  },
  {
    id: 'H-009-007',
    orderId: 'ORD-2025-009',
    action: 'payment-completed',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-14T16:20:00',
    details: 'Pagamento confirmado - Comprovante: 20251014-007'
  },

  // ORD-2025-011 - Prateleiras (delivery-pending)
  {
    id: 'H-011-001',
    orderId: 'ORD-2025-011',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-03T10:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-011-002',
    orderId: 'ORD-2025-011',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-05T08:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-011-003',
    orderId: 'ORD-2025-011',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-05T09:00:00',
    details: 'Cotação recebida de Racks & Cia - R$ 41.000,00'
  },
  {
    id: 'H-011-004',
    orderId: 'ORD-2025-011',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-05T11:00:00',
    details: 'Cotação recebida de Metalúrgica Forte - R$ 42.500,00'
  },
  {
    id: 'H-011-005',
    orderId: 'ORD-2025-011',
    action: 'quotation-approved',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-06T14:00:00',
    details: 'Cotação da Racks & Cia aprovada'
  },
  {
    id: 'H-011-006',
    orderId: 'ORD-2025-011',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-12T10:00:00',
    details: 'Pagamento iniciado'
  },
  {
    id: 'H-011-007',
    orderId: 'ORD-2025-011',
    action: 'payment-completed',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-12T15:30:00',
    details: 'Pagamento confirmado - Comprovante: 20251012-011'
  },
  {
    id: 'H-011-008',
    orderId: 'ORD-2025-011',
    action: 'delivery-scheduled',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-13T09:00:00',
    details: 'Entrega programada para 17/10/2025 - Código de rastreio: BR123456789CD'
  },

  // ORD-2025-013 - Etiquetas (delivered)
  {
    id: 'H-013-001',
    orderId: 'ORD-2025-013',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-09-30T14:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-013-002',
    orderId: 'ORD-2025-013',
    action: 'quotation-requested',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-01T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-013-003',
    orderId: 'ORD-2025-013',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-01T10:00:00',
    details: 'Cotação recebida de Label Express - R$ 7.000,00'
  },
  {
    id: 'H-013-004',
    orderId: 'ORD-2025-013',
    action: 'quotation-approved',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-02T11:00:00',
    details: 'Cotação aprovada'
  },
  {
    id: 'H-013-005',
    orderId: 'ORD-2025-013',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-05T10:00:00',
    details: 'Pagamento iniciado'
  },
  {
    id: 'H-013-006',
    orderId: 'ORD-2025-013',
    action: 'payment-completed',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-05T11:20:00',
    details: 'Pagamento confirmado - Comprovante: 20251005-013'
  },
  {
    id: 'H-013-007',
    orderId: 'ORD-2025-013',
    action: 'delivery-scheduled',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-06T09:00:00',
    details: 'Entrega programada - Código de rastreio: BR987654321SP'
  },
  {
    id: 'H-013-008',
    orderId: 'ORD-2025-013',
    action: 'delivered',
    user: 'recebimento.pedro',
    userEmail: 'recebimento.pedro@revolux.com',
    timestamp: '2025-10-14T16:30:00',
    details: 'Material recebido e conferido - 50.000 unidades OK'
  },

  // ORD-2025-015 - Canetas (quotation-approved)
  {
    id: 'H-015-001',
    orderId: 'ORD-2025-015',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-12T10:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-015-002',
    orderId: 'ORD-2025-015',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-13T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-015-003',
    orderId: 'ORD-2025-015',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-13T11:00:00',
    details: 'Cotação recebida de Papelaria Central - R$ 1.100,00'
  },
  {
    id: 'H-015-004',
    orderId: 'ORD-2025-015',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-13T13:00:00',
    details: 'Cotação recebida de Kalunga - R$ 1.250,00'
  },
  {
    id: 'H-015-005',
    orderId: 'ORD-2025-015',
    action: 'quotation-approved',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-13T16:00:00',
    details: 'Cotação da Papelaria Central aprovada - Melhor custo'
  },

  // ORD-2025-018 - Tablets (payment-pending)
  {
    id: 'H-018-001',
    orderId: 'ORD-2025-018',
    action: 'strategy-approved-with-obs',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-13T11:00:00',
    details: 'Aprovado com observação: Priorizar Android para integração'
  },
  {
    id: 'H-018-002',
    orderId: 'ORD-2025-018',
    action: 'quotation-requested',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-14T08:00:00',
    details: 'Solicitação de cotação enviada para 3 fornecedores'
  },
  {
    id: 'H-018-003',
    orderId: 'ORD-2025-018',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-14T09:30:00',
    details: 'Cotação recebida de Panasonic Toughbook - R$ 37.800,00'
  },
  {
    id: 'H-018-004',
    orderId: 'ORD-2025-018',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-14T11:00:00',
    details: 'Cotação recebida de Samsung Enterprise - R$ 35.760,00'
  },
  {
    id: 'H-018-005',
    orderId: 'ORD-2025-018',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-14T14:30:00',
    details: 'Cotação recebida de Zebra Tablets - R$ 39.360,00'
  },
  {
    id: 'H-018-006',
    orderId: 'ORD-2025-018',
    action: 'quotation-approved',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T10:00:00',
    details: 'Cotação da Panasonic aprovada - Melhor custo-benefício e compatível com Android'
  },
  {
    id: 'H-018-007',
    orderId: 'ORD-2025-018',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-15T15:00:00',
    details: 'Pagamento em processamento - Alto valor requer aprovação adicional'
  },

  // ORD-2025-019 - Coletes (payment-done)
  {
    id: 'H-019-001',
    orderId: 'ORD-2025-019',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-10T09:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-019-002',
    orderId: 'ORD-2025-019',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-11T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-019-003',
    orderId: 'ORD-2025-019',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-11T14:30:00',
    details: 'Cotação recebida de Segurança Total - R$ 5.250,00'
  },
  {
    id: 'H-019-004',
    orderId: 'ORD-2025-019',
    action: 'quotation-approved',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-12T10:00:00',
    details: 'Cotação aprovada'
  },
  {
    id: 'H-019-005',
    orderId: 'ORD-2025-019',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-14T16:00:00',
    details: 'Pagamento iniciado'
  },
  {
    id: 'H-019-006',
    orderId: 'ORD-2025-019',
    action: 'payment-completed',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-15T10:00:00',
    details: 'Pagamento confirmado - Comprovante: 20251015-019'
  },

  // ORD-2025-022 - Roteadores (quotation-pending)
  {
    id: 'H-022-001',
    orderId: 'ORD-2025-022',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-14T11:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-022-002',
    orderId: 'ORD-2025-022',
    action: 'quotation-requested',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-022-003',
    orderId: 'ORD-2025-022',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T10:00:00',
    details: 'Cotação recebida de Cisco Systems - R$ 14.000,00'
  },
  {
    id: 'H-022-004',
    orderId: 'ORD-2025-022',
    action: 'quotation-received',
    user: 'compras.lucia',
    userEmail: 'compras.lucia@revolux.com',
    timestamp: '2025-10-15T11:30:00',
    details: 'Cotação recebida de Ubiquiti Networks - R$ 13.440,00'
  },

  // ORD-2025-024 - Botas (strategy-rejected)
  {
    id: 'H-024-001',
    orderId: 'ORD-2025-024',
    action: 'strategy-rejected',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-14T11:00:00',
    details: 'Pedido reprovado: Estoque atual suficiente para 90 dias. Reavaliar em janeiro/2026'
  },

  // ORD-2025-028 - Cintas (delivered)
  {
    id: 'H-028-001',
    orderId: 'ORD-2025-028',
    action: 'strategy-approved',
    user: 'joao.estrategia',
    userEmail: 'joao.estrategia@revolux.com',
    timestamp: '2025-10-06T10:00:00',
    details: 'Pedido aprovado pela estratégia'
  },
  {
    id: 'H-028-002',
    orderId: 'ORD-2025-028',
    action: 'quotation-requested',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-07T09:00:00',
    details: 'Solicitação de cotação enviada'
  },
  {
    id: 'H-028-003',
    orderId: 'ORD-2025-028',
    action: 'quotation-received',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-07T11:00:00',
    details: 'Cotação recebida de Amarrações Brasil - R$ 4.800,00'
  },
  {
    id: 'H-028-004',
    orderId: 'ORD-2025-028',
    action: 'quotation-approved',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-08T10:00:00',
    details: 'Cotação aprovada'
  },
  {
    id: 'H-028-005',
    orderId: 'ORD-2025-028',
    action: 'payment-initiated',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-10T10:00:00',
    details: 'Pagamento iniciado'
  },
  {
    id: 'H-028-006',
    orderId: 'ORD-2025-028',
    action: 'payment-completed',
    user: 'financeiro.carlos',
    userEmail: 'financeiro.carlos@revolux.com',
    timestamp: '2025-10-10T14:00:00',
    details: 'Pagamento confirmado - Comprovante: 20251010-028'
  },
  {
    id: 'H-028-007',
    orderId: 'ORD-2025-028',
    action: 'delivery-scheduled',
    user: 'compras.ana',
    userEmail: 'compras.ana@revolux.com',
    timestamp: '2025-10-11T09:00:00',
    details: 'Entrega programada - Código de rastreio: BR456789123MG'
  },
  {
    id: 'H-028-008',
    orderId: 'ORD-2025-028',
    action: 'delivered',
    user: 'recebimento.pedro',
    userEmail: 'recebimento.pedro@revolux.com',
    timestamp: '2025-10-15T10:30:00',
    details: 'Material recebido e conferido - 200 unidades OK'
  },

  // ORD-2025-002 - Empilhadeiras (approved - aguardando análise estratégica)
  {
    id: 'H-002-001',
    orderId: 'ORD-2025-002',
    action: 'approved',
    user: 'maria.silva',
    userEmail: 'maria.silva@revolux.com',
    timestamp: '2025-10-14T10:30:00',
    details: 'Aprovado conforme análise de ROI positivo - Enviado para análise estratégica'
  }
];
