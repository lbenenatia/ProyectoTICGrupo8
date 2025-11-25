import React from "react";
import Icon from "../../../components/AppIcon";

const OrderItem = ({ order }) => {
  return (
    <div className="border border-border rounded-md p-4 flex justify-between items-center bg-card">
      <div>
        <p className="text-sm text-text-secondary">Pedido #{order.id}</p>
        <p className="text-sm">
          Fecha: {order.creationDate ? new Date(order.creationDate).toLocaleString() : "N/A"}
        </p>
        <p className="text-sm capitalize">
          Estado: {order.status?.toLowerCase().replace("_", " ")}
        </p>
        {order.total && (
          <p className="text-sm font-semibold">
            Total: ${Number(order.total || 0).toFixed(2)}
          </p>
        )}
      </div>

      <button className="text-primary flex items-center space-x-1 hover:underline">
        <Icon name="Eye" size={18} />
        <span>Ver detalle</span>
      </button>
    </div>
  );
};

export default OrderItem;
