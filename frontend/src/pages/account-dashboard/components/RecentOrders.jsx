import React from 'react';
import OrderItem from './OrderItem';

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow border border-border">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">
        Pedidos recientes
      </h2>

      {orders.length === 0 && (
        <p className="text-text-secondary">No tenés pedidos recientes.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
