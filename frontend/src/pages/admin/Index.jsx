import { useState } from "react";
import Header from "../../components/ui/Header";
import AdminOverview from "./components/AdminOverview";
import ManageProducts from "./components/ManageProducts";
import ManageOrders from "./components/ManageOrders";
import { ShieldCheck, Package, ClipboardList } from "lucide-react";
import Icon from '../../components/AppIcon';


export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Resumen", icon: ShieldCheck },
    { id: "products", label: "Productos", icon: Package },
    { id: "orders", label: "Pedidos", icon: ClipboardList }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ManageProducts />;
      case "orders":
        return <ManageOrders />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
          Panel de administración
        </h1>

        {/* Tabs de navegación */}
        <div className="flex flex-wrap gap-4 mb-10">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all ${
                activeTab === id
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Contenido dinámico */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
