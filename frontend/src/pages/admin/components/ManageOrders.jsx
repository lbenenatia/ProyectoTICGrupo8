import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Solo pedidos del backend
      const res = await axios.get("http://localhost:4028/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error al cargar los pedidos");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:4028/api/admin/orders/${orderId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Recargar la lista completa
      await fetchOrders();
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error al actualizar el estado del pedido");
    }
  };

  const STATUS_LABELS = {
    QUEUE: 'En cola',
    PREPARING: 'En preparación', 
    DELIVERING: 'En camino',
    CANCELLED: 'Cancelado'
  };

  const getNextPossibleStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "QUEUE":
        return ["PREPARING", "CANCELLED"];
      case "PREPARING":
        return ["DELIVERING", "CANCELLED"];
      case "DELIVERING":
        return [];
      case "CANCELLED":
        return [];
      default:
        return ["PREPARING", "CANCELLED"];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "QUEUE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "PREPARING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DELIVERING":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Gestión de pedidos ({orders.length})
      </h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay pedidos para gestionar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary/10 dark:bg-primary/20">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const nextStatuses = getNextPossibleStatuses(order.status);
                
                return (
                  <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-mono text-sm">{order.id}</td>
                    <td className="p-3">{order.user?.email || 'Usuario no especificado'}</td>
                    <td className="p-3">
                      {order.creationDate ? new Date(order.creationDate).toLocaleDateString() : 'Fecha no disponible'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium">${order.total?.toFixed(2) || '0.00'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Backend
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {nextStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              status === "CANCELLED"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-primary hover:bg-primary/80 text-white"
                            }`}
                          >
                            {STATUS_LABELS[status] || status}
                          </button>
                        ))}
                        {nextStatuses.length === 0 && (
                          <span className="text-xs text-gray-500 italic">
                            Completado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4">
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Actualizar Lista
        </button>
      </div>
    </div>
  );
}