import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';
import { orderService } from '../services/dbService';

type OrdersContextType = {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrderById: (id: string) => Order | undefined;
};

const Ctx = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await orderService.getAll();
        if (mounted && remote && remote.length > 0) {
          // normalize id field if needed
          const mapped = remote.map((r: any) => ({ ...(r as any), id: r.id || r.orderNumber || r.id }));
          setOrders(mapped as Order[]);
        }
      } catch (e) {
        // keep mockOrders on failure
      }
    })();

    return () => { mounted = false; };
  }, []);

  async function updateOrder(orderId: string, updates: Partial<Order>) {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, ...updates } : o)));
    try {
      await orderService.update(orderId, updates as any);
    } catch (e) {
      // ignore errors; UI was optimistically updated
    }
  }

  function getOrderById(id: string) {
    return orders.find(o => o.id === id);
  }

  return (
    <Ctx.Provider value={{ orders, updateOrder, getOrderById }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
