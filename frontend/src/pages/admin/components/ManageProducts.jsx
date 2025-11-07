import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      axios.get("http://localhost:4028/api/admin/catalog/products", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:4028/api/admin/catalog/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    console.log("CATEGORÍAS:", c.data);
    setProducts(p.data);
    setCategories(c.data);
  };

  const addProduct = async () => {
    if (!name || !price || !categoryId) return alert("Completa todos los campos");
    await axios.post(
      `http://localhost:4028/api/admin/catalog/products?categoryId=${categoryId}&name=${name}&price=${price}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setName("");
    setPrice("");
    setCategoryId("");
    fetchData();
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await axios.delete(`http://localhost:4028/api/admin/catalog/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Gestión de productos
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="border rounded-md px-3 py-2 w-40"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded-md px-3 py-2 w-24"
          placeholder="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
          onClick={addProduct}
        >
          Agregar
        </button>
      </div>

      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-primary/10 dark:bg-primary/20">
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b dark:border-gray-700">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.category?.name}</td>
              <td className="p-3">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteProduct(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
