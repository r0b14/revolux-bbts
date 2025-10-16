import { OrderListingPage } from './OrderListingPage';
import { OrderDetailsPage } from './OrderDetailsPage';
import { HomePage } from './HomePage';
import { useOrders } from '../../app/context/OrdersContext';
import { useNavigate, useParams } from 'react-router-dom';

export function OrdersListWrapper() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  function handleOrderClick(order: any) {
    navigate(`/orders/${order.id}`);
  }

  return <OrderListingPage orders={orders} onOrderClick={handleOrderClick} />;
}

export function HomeWrapper() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  function handleOrderClick(order: any) {
    navigate(`/orders/${order.id}`);
  }

  return <HomePage orders={orders} onOrderClick={handleOrderClick} />;
}

export function OrderDetailsWrapper() {
  const { getOrderById, updateOrder } = useOrders();
  const { id } = useParams();
  const order = id ? getOrderById(id) : undefined;
  const navigate = useNavigate();

  if (!order) return <div>Pedido não encontrado</div>;

  return (
    <OrderDetailsPage
      order={order}
      onBack={() => navigate('/orders')}
      onApprove={(orderId: string) => updateOrder(orderId, { status: 'approved' })}
      onEdit={(orderId: string, updates: any) => updateOrder(orderId, updates)}
      onDefer={(orderId: string, _justification: string, _reminderDays?: number) => updateOrder(orderId, { status: 'deferred' })}
    />
  );
}
