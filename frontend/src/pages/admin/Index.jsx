import { useState } from "react";
import Header from "../../components/ui/Header";
import AdminOverview from "./components/AdminOverview";
import ManageProducts from "./components/ManageProducts";
import ManageOrders from "./components/ManageOrders";
import { ShieldCheck, Package, ClipboardList } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Resumen", icon: ShieldCheck },
    { id: "products", label: "Productos", icon: Package },
    { id: "orders", label: "Pedidos", icon: ClipboardList },
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="mt-8 text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
              Panel de Administración
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Gestioná productos, pedidos y visualizá estadísticas de la tienda.
            </p>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Columna izquierda: tabs */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-warm">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Secciones
                </h2>
                <div className="flex flex-col gap-3">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        activeTab === id
                          ? "bg-orange-500 text-white shadow-md"
                          : "border-2 border-primary bg-primary/5 hover:bg-primary/10 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha: contenido dinámico */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-warm">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
