import React, { createContext, useContext, useState } from 'react';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';

type OrdersContextType = {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrderById: (id: string) => Order | undefined;
};

const Ctx = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  function updateOrder(orderId: string, updates: Partial<Order>) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
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
