/**
 * EXEMPLO DE USO DO SERVIÇO DE BANCO DE DADOS
 * 
 * Este arquivo mostra como usar o dbService em seus componentes React
 */

import { useState, useEffect } from 'react';
import dbService, { Order } from '@/app/services/dbService';

// ===== EXEMPLO 1: Buscar e exibir todas as ordens =====

export const OrdersListExample = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await dbService.orders.getAll();
        setOrders(allOrders);
      } catch (err) {
        setError('Erro ao carregar ordens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Lista de Ordens</h2>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.orderNumber}</h3>
          <p>{order.description}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

// ===== EXEMPLO 2: Criar uma nova ordem =====

export const CreateOrderExample = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleCreateOrder = async () => {
    try {
      setSubmitting(true);
      
      const newOrder = await dbService.orders.create({
        orderNumber: 'ORD-' + Date.now(),
        description: 'Descrição da ordem',
        status: 'normal',
        priority: 'média',
        supplier: 'Fornecedor XYZ',
        requestedBy: 'João Silva',
        deadline: new Date('2025-12-31')
      });

      console.log('Ordem criada:', newOrder);
      alert('Ordem criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      alert('Erro ao criar ordem');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button onClick={handleCreateOrder} disabled={submitting}>
      {submitting ? 'Criando...' : 'Criar Nova Ordem'}
    </button>
  );
};

// ===== EXEMPLO 3: Buscar ordens críticas =====

export const CriticalOrdersExample = () => {
  const [criticalOrders, setCriticalOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchCriticalOrders = async () => {
      try {
        const orders = await dbService.orders.getCritical();
        setCriticalOrders(orders);
      } catch (error) {
        console.error('Erro ao buscar ordens críticas:', error);
      }
    };

    fetchCriticalOrders();
  }, []);

  return (
    <div>
      <h2>Ordens Críticas ({criticalOrders.length})</h2>
      {criticalOrders.map(order => (
        <div key={order.id} style={{ backgroundColor: '#fee', padding: '10px', margin: '5px' }}>
          <strong>{order.orderNumber}</strong> - {order.description}
        </div>
      ))}
    </div>
  );
};

// ===== EXEMPLO 4: Atualizar uma ordem =====

export const UpdateOrderExample = ({ orderId }: { orderId: string }) => {
  const handleUpdateStatus = async (newStatus: Order['status']) => {
    try {
      await dbService.orders.update(orderId, {
        status: newStatus
      });
      alert('Status atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      alert('Erro ao atualizar ordem');
    }
  };

  return (
    <div>
      <h3>Atualizar Status</h3>
      <button onClick={() => handleUpdateStatus('crítico')}>
        Marcar como Crítico
      </button>
      <button onClick={() => handleUpdateStatus('urgente')}>
        Marcar como Urgente
      </button>
      <button onClick={() => handleUpdateStatus('normal')}>
        Marcar como Normal
      </button>
    </div>
  );
};

// ===== EXEMPLO 5: Deletar uma ordem =====

export const DeleteOrderExample = ({ orderId }: { orderId: string }) => {
  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar esta ordem?')) {
      try {
        await dbService.orders.delete(orderId);
        alert('Ordem deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar ordem:', error);
        alert('Erro ao deletar ordem');
      }
    }
  };

  return (
    <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
      Deletar Ordem
    </button>
  );
};

// ===== EXEMPLO 6: Usar Query Customizada =====

export const CustomQueryExample = () => {
  const [highPriorityOrders, setHighPriorityOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchHighPriorityOrders = async () => {
      try {
        // Buscar ordens com prioridade alta, ordenadas por deadline
        const orders = await dbService.queryDocuments<Order>(
          'orders',
          [
            { field: 'priority', operator: '==', value: 'alta' },
            { field: 'status', operator: '!=', value: 'normal' }
          ],
          'deadline',
          'asc',
          5 // Limitar a 5 resultados
        );
        setHighPriorityOrders(orders);
      } catch (error) {
        console.error('Erro na query:', error);
      }
    };

    fetchHighPriorityOrders();
  }, []);

  return (
    <div>
      <h2>Top 5 Ordens de Alta Prioridade</h2>
      {highPriorityOrders.map(order => (
        <div key={order.id}>
          {order.orderNumber} - Deadline: {order.deadline.toString()}
        </div>
      ))}
    </div>
  );
};

// ===== EXEMPLO 7: Hook customizado para ordens =====

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const allOrders = await dbService.orders.getAll();
      setOrders(allOrders);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder = await dbService.orders.create(orderData);
    setOrders(prev => [...prev, newOrder as Order]);
    return newOrder;
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    await dbService.orders.update(orderId, updates);
    setOrders(prev => 
      prev.map(order => order.id === orderId ? { ...order, ...updates } : order)
    );
  };

  const deleteOrder = async (orderId: string) => {
    await dbService.orders.delete(orderId);
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return {
    orders,
    loading,
    error,
    refreshOrders,
    createOrder,
    updateOrder,
    deleteOrder
  };
};

// Uso do hook:
export const OrdersWithHookExample = () => {
  const { orders, loading, error, createOrder } = useOrders();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <button onClick={() => createOrder({
        orderNumber: 'ORD-NEW',
        description: 'Nova ordem via hook',
        status: 'normal',
        priority: 'baixa',
        supplier: 'Fornecedor',
        requestedBy: 'Usuário',
        deadline: new Date()
      })}>
        Criar Ordem
      </button>
      
      <ul>
        {orders.map(order => (
          <li key={order.id}>{order.orderNumber}</li>
        ))}
      </ul>
    </div>
  );
};
