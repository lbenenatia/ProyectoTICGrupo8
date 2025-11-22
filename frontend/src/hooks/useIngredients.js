import { useState, useEffect } from 'react';

const useIngredients = (productType) => {
  const [ingredients, setIngredients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productType) {
      setLoading(false);
      return;
    }

    const fetchIngredients = async () => {
      try {
        setLoading(true);
        setError(null);

        const type = productType === 'pizza' ? 'PIZZA' : 'BURGER';

        console.log('Fetching ingredients for type:', type);
        const url = `http://localhost:4028/api/products/by-type/${type}`;
        console.log('URL:', url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${errorText || 'Error al cargar los ingredientes'}`);
        }

        const data = await response.json();
        console.log('Received ingredients data:', data);

        const filteredData = {};
        Object.keys(data).forEach(categoryName => {
          const categoryLower = categoryName.toLowerCase();
          
          if (categoryLower !== 'bebida' && categoryLower !== 'acompañamiento') {
            filteredData[categoryLower] = data[categoryName].map(product => ({
              id: product.id.toString(),
              name: product.name,
              price: parseFloat(product.price),
              dietary: [],
              allergens: []
            }));
          }
        });

        console.log('Filtered ingredients data:', filteredData);
        setIngredients(filteredData);
      } catch (err) {
        const errorMessage = err.message || 'No se pudo conectar con el servidor';
        setError(errorMessage);
        console.error('Error fetching ingredients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [productType]);

  return { ingredients, loading, error };
};

export default useIngredients;