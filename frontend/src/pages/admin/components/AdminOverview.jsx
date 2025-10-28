import { useEffect, useState } from "react";
import axios from "axios";
import { Package, ClipboardList } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const token = localStorage.getItem("authToken");


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders] = await Promise.all([
          axios.get("http://localhost:4028/api/admin/catalog/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4028/api/admin/orders", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setStats({
          products: products.data.length,
          orders: orders.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Productos", value: stats.products, icon: Package, color: "bg-blue-500" },
    { label: "Pedidos", value: stats.orders, icon: ClipboardList, color: "bg-green-500" }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="flex items-center justify-between p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-900"
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</h2>
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}
