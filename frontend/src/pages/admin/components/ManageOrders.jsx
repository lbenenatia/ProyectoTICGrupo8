import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:4028/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  const cancelOrder = async (id) => {
    await axios.put(
      `http://localhost:4028/api/admin/orders/${id}/status?status=CANCELLED`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Gestión de pedidos
      </h2>
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-primary/10 dark:bg-primary/20">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Usuario</th>
            <th className="p-3 text-left">Fecha</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b dark:border-gray-700">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.user?.email}</td>
              <td className="p-3">{new Date(o.creationDate).toLocaleDateString()}</td>
              <td className="p-3">{o.status}</td>
              <td className="p-3">
                {o.status !== "CANCELLED" && (
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => cancelOrder(o.id)}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
