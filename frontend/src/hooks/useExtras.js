import { useState, useEffect } from 'react';

const useExtras = (productType) => {
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productType) {
      setLoading(false);
      return;
    }

    const fetchExtras = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching extras for type:', productType);

        if (productType === 'pizza') {
          const url = `http://localhost:4028/api/products/by-type/BOTH`;
          console.log('URL:', url);

          const response = await fetch(url);
          if (!response.ok) throw new Error(`Error ${response.status}`);

          const data = await response.json();
          console.log('Received BOTH data:', data);

          const filteredData = {};
          if (data['Bebida']) {
            filteredData['bebida'] = data['Bebida'].map(product => ({
              id: product.id.toString(),
              name: product.name,
              price: parseFloat(product.price),
              dietary: [],
              allergens: []
            }));
          }
          setExtras(filteredData);
        }
        
        else if (productType === 'burger') {
          const [bothResponse, burgerResponse] = await Promise.all([
            fetch('http://localhost:4028/api/products/by-type/BOTH'),
            fetch('http://localhost:4028/api/products/by-type/BURGER')
          ]);

          if (!bothResponse.ok || !burgerResponse.ok) {
            throw new Error('Error al cargar los extras');
          }

          const bothData = await bothResponse.json();
          const burgerData = await burgerResponse.json();
          console.log('BOTH data:', bothData);
          console.log('BURGER data:', burgerData);

          const filteredData = {};
          
          if (bothData['Bebida']) {
            filteredData['bebida'] = bothData['Bebida'].map(product => ({
              id: product.id.toString(),
              name: product.name,
              price: parseFloat(product.price),
              dietary: [],
              allergens: []
            }));
          }
          
          if (burgerData['Acompañamiento']) {
            filteredData['acompañamiento'] = burgerData['Acompañamiento'].map(product => ({
              id: product.id.toString(),
              name: product.name,
              price: parseFloat(product.price),
              dietary: [],
              allergens: []
            }));
          }

          console.log('Filtered extras data:', filteredData);
          setExtras(filteredData);
        }

      } catch (err) {
        const errorMessage = err.message || 'No se pudo conectar con el servidor';
        setError(errorMessage);
        console.error('Error fetching extras:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtras();
  }, [productType]);

  return { extras, loading, error };
};

export default useExtras;