export type OrderStatus = 'pending' | 'approved' | 'deferred' | 'edited';

export type UserProfile = 'orders-analyst' | 'strategy-analyst';

export interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
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
}

export interface OrderHistory {
  orderId: string;
  action: 'approved' | 'edited' | 'deferred';
  user: string;
  timestamp: string;
  details?: string;
  previousData?: Partial<Order>;
}

export interface User {
  email: string;
  name: string;
  profile: UserProfile;
}
