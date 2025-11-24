import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom'; // ← AGREGAR ESTE IMPORT
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import IngredientSelector from './components/IngredientSelector';
import OrderSummary from './components/OrderSummary';
import { useCart } from '../../context/CartContext';
import ExtrasSelector from './components/ExtrasSelector';
import ConfirmModal from '../../components/ui/ConfirmModal';

const BuildYourOwn = () => {
  const navigate = useNavigate(); // ← AGREGAR ESTE HOOK
  const [selectedType, setSelectedType] = useState('pizza');
  const [selectedSize, setSelectedSize] = useState('null'); 
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});
  const [ingredientsData, setIngredientsData] = useState({});
  const [extrasData, setExtrasData] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const { addToCart, removeFromCart } = useCart();
  const [productToAdd, setProductToAdd] = useState(null);

  // applyEditData function - BUSCAR POR NOMBRE EN LUGAR DE ID
  const applyEditData = useCallback((data) => {
    console.log("🔄 APPLY EDIT DATA llamado con:", data);
    if (!data) return;
    
    console.log("📋 Estructura de selectedIngredients:", data.selectedIngredients);
    console.log("📋 Estructura de selectedExtras:", data.selectedExtras);
    console.log("📦 IngredientsData disponible:", ingredientsData);
    console.log("📦 ExtrasData disponible:", extrasData);
    
    let ingredientsToSet = {};
    let extrasToSet = {};
    
    // BUSCAR INGREDIENTES POR NOMBRE EN LUGAR DE ID
    if (data.selectedIngredients && Array.isArray(data.selectedIngredients)) {
      console.log("🔍 Buscando ingredientes por nombre...");
      data.selectedIngredients.forEach(ingredient => {
        console.log("Buscando ingrediente:", ingredient.name, "en categoría:", ingredient.category);
        
        if (ingredient.category && ingredient.name) {
          const categoryData = ingredientsData[ingredient.category] || [];
          const foundIngredient = categoryData.find(item => 
            item.name === ingredient.name || item.id === ingredient.id
          );
          
          if (foundIngredient) {
            if (!ingredientsToSet[ingredient.category]) {
              ingredientsToSet[ingredient.category] = [];
            }
            ingredientsToSet[ingredient.category].push(foundIngredient.id);
            console.log(`✅ Encontrado: ${ingredient.name} -> ID: ${foundIngredient.id}`);
          } else {
            console.log(`❌ No se encontró: ${ingredient.name} en ${ingredient.category}`);
            console.log("Disponibles en esta categoría:", categoryData.map(item => item.name));
          }
        }
      });
    }
    
    // BUSCAR EXTRAS POR NOMBRE EN LUGAR DE ID
    if (data.selectedExtras && Array.isArray(data.selectedExtras)) {
      console.log("🔍 Buscando extras por nombre...");
      data.selectedExtras.forEach(extra => {
        console.log("Buscando extra:", extra.name, "en categoría:", extra.category);
        
        if (extra.category && extra.name) {
          const categoryData = extrasData[extra.category] || [];
          const foundExtra = categoryData.find(item => 
            item.name === extra.name || item.id === extra.id
          );
          
          if (foundExtra) {
            if (!extrasToSet[extra.category]) {
              extrasToSet[extra.category] = [];
            }
            extrasToSet[extra.category].push(foundExtra.id);
            console.log(`✅ Encontrado extra: ${extra.name} -> ID: ${foundExtra.id}`);
          } else {
            console.log(`❌ No se encontró: ${extra.name} en ${extra.category}`);
            console.log("Disponibles en esta categoría:", categoryData.map(item => item.name));
          }
        }
      });
    }
    
    console.log("🎯 Ingredientes finales para seleccionar:", ingredientsToSet);
    console.log("🎯 Extras finales para seleccionar:", extrasToSet);
    
    setSelectedIngredients(ingredientsToSet);
    setSelectedExtras(extrasToSet);
    setIsEditMode(false);
  }, [ingredientsData, extrasData]);

  useEffect(() => {
    const editItem = localStorage.getItem("editItem");
    console.log("🔍 Buscando editItem en localStorage:", editItem);
    
    if (editItem) {
      try {
        const parsed = JSON.parse(editItem);
        console.log("📝 EDITITEM ENCONTRADO - RAW:", parsed);
        
        if (parsed.editMode) {
          console.log("🎯 ACTIVANDO MODO EDICIÓN");
          setIsEditMode(true);
          setEditData(parsed);
          
          setSelectedType(parsed.productType || 'pizza');
          setSelectedSize(parsed.selectedSize || 'null');
          
          // SOLO remover editItem si estamos en modo edición
          localStorage.removeItem("editItem");
          console.log("✅ editItem removido del localStorage");
        }
      } catch (error) {
        console.error("Error al cargar item para editar:", error);
        // SOLO remover si hay error al parsear
        localStorage.removeItem("editItem");
      }
    } else {
      console.log("❌ NO se encontró editItem en localStorage");
      // NO remover nada si no hay editItem
    }
  }, []);

  // 2. useEffect - Aplicar datos cuando todo esté cargado
  useEffect(() => {
    if (isEditMode && editData && 
        Object.keys(ingredientsData).length > 0 && 
        Object.keys(extrasData).length > 0) {
      console.log("🚀 TODOS LOS DATOS CARGADOS - Aplicando edición automáticamente");
      applyEditData(editData);
    }
  }, [isEditMode, editData, ingredientsData, extrasData, applyEditData]);

  const handleAddToCart = (productData) => {
    setProductToAdd(productData);
    setShowConfirmModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (!productToAdd) return;

    const sizeInfo = getSizeInfo(productToAdd.productType, productToAdd.selectedSize);
    const isEditing = editData && editData.originalItemId;

    const productName = productToAdd.productType === 'pizza' ? 'Pizza' : 'Hamburguesa';
    const sizeName = productToAdd.sizeInfo?.nameEs || '';
    
    const selectedItems = [];
    if (productToAdd.ingredientsData && productToAdd.selectedIngredients) {
      Object.entries(productToAdd.selectedIngredients).forEach(([category, ids]) => {
        const categoryIngredients = productToAdd.ingredientsData[category] || [];
        ids.forEach((id) => {
          const found = categoryIngredients.find((ing) => ing.id === id);
          if (found) {
            selectedItems.push({
              category,
              name: found.name,
              price: found.price || 0,
              type: 'ingredient'
            });
          }
        });
      });
    }

    const selectedExtrasItems = [];
    if (productToAdd.extrasData && productToAdd.selectedExtras) {
      Object.entries(productToAdd.selectedExtras).forEach(([category, ids]) => {
        const categoryExtras = productToAdd.extrasData[category] || [];
        ids.forEach((id) => {
          const found = categoryExtras.find((extra) => extra.id === id);
          if (found) {
            selectedExtrasItems.push({
              category,
              name: found.name,
              price: found.price || 0,
              type: 'extra'
            });
          }
        });
      });
    }

    const ingredientsList = selectedItems.map(item => item.name).join(', ');
    const extrasList = selectedExtrasItems.map(item => item.name).join(', ');

    const item = {
      id: isEditing ? editData.originalItemId : `custom-${Date.now()}`,
      name: `${productName} ${sizeName}`,
      description: ingredientsList || 'Sin ingredientes adicionales',
      extrasDescription: extrasList ? `Extras: ${extrasList}` : '',
      price: productToAdd.total,
      image: productToAdd.productType === 'pizza' ? '/images/custom-pizza.jpg' : '/images/custom-burger.jpg',
      quantity: 1,
      customData: {
        type: productToAdd.productType,
        size: productToAdd.selectedSize,
        sizeInfo: productToAdd.sizeInfo,
        ingredients: selectedItems,
        extras: selectedExtrasItems,
        basePrice: productToAdd.basePrice,
        ingredientsPrice: productToAdd.ingredientsPrice,
        extrasPrice: productToAdd.extrasPrice,
      },
      customProduct: true
    };

    if (isEditing) {
      removeFromCart(editData.originalItemId);
    }

    addToCart(item);
    setShowConfirmModal(false);
    setProductToAdd(null);
    setEditData(null);
    
    if (isEditing) {
      console.log("✅ Producto editado exitosamente - Redirigiendo al carrito");
      // ← AGREGAR ESTA LÍNEA PARA REDIRIGIR AL CARRITO
      navigate('/cart');
    } else {
      console.log("✅ Producto agregado al carrito");
      // Opcional: Si también querés redirigir cuando se agrega un producto nuevo
      // navigate('/cart');
    }
  };

  const handleCancelAddToCart = () => {
    setShowConfirmModal(false);
    setProductToAdd(null);
  };

  const handleTypeChange = (type) => {
    if (type === 'pizza') {
      setSelectedType('pizza');
    } else if (type === 'burger') {
      setSelectedType('burger');
    } else {
      setSelectedType(null);
      setSelectedSize(null);
      setSelectedIngredients({});
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIngredientChange = (category, ingredients) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [category]: ingredients,
    }));
  };

  const handleExtraChange = (category, extras) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [category]: extras,
    }));
  };

  const getSizeInfo = (type, size) => {
    const sizeMap = type === 'pizza' 
      ? {
          small: { nameEs: 'Pequeña', multiplier: 1 },
          medium: { nameEs: 'Mediana', multiplier: 1.5 },
          large: { nameEs: 'Grande', multiplier: 2 },
        }
      : {
          single: { nameEs: 'Simple', multiplier: 1 },
          double: { nameEs: 'Doble', multiplier: 1.5555 },
          triple: { nameEs: 'Triple', multiplier: 2 },
        };
    
    return sizeMap[size] || null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="mt-8 text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
              {isEditMode ? "✏️ Editando Producto" : "Creá Tu Propia Pizza o Hamburguesa"}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {isEditMode ? "Modificá tu producto y guardá los cambios" : "Elegí tu tipo, tamaño, ingredientes y extras. ¡Combiná a tu gusto!"}
            </p>
          </div>
          
          {/* Contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Izquierda */}
            <div className="lg:col-span-2 space-y-6">
              <ProductTypeSelector
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
              />

              {selectedType && (
                <SizeSelector
                  productType={selectedType}
                  selectedSize={selectedSize}
                  onSizeChange={handleSizeChange}
                />
              )}

              {selectedType && (
                <IngredientSelector
                  productType={selectedType}
                  selectedIngredients={selectedIngredients}
                  onIngredientChange={handleIngredientChange}
                  onIngredientsLoaded={(data) => {
                    console.log("📦 API IngredientSelector cargado con datos:", data);
                    setIngredientsData(data);
                  }}
                />
              )}

              {selectedType && (
                <ExtrasSelector
                  productType={selectedType}
                  selectedIngredients={selectedExtras}
                  onIngredientChange={handleExtraChange}
                  onIngredientsLoaded={(data) => {
                    console.log("📦 API ExtrasSelector cargado con datos:", data);
                    setExtrasData(data);
                  }}
                />
              )}
            </div>

            {/* Derecha */}
            <div className="space-y-6">
              <OrderSummary
                productType={selectedType}
                selectedSize={selectedSize}
                selectedIngredients={selectedIngredients}
                selectedExtras={selectedExtras}
                ingredientsData={ingredientsData}
                extrasData={extrasData}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={showConfirmModal}
        title={isEditMode ? "¿Guardar cambios?" : "¿Agregar al carrito?"}
        message={isEditMode ? 
          "¿Estás seguro de que querés guardar los cambios en este producto?" : 
          "¿Estás seguro de que querés agregar este producto personalizado al carrito?"
        }
        onConfirm={handleConfirmAddToCart}
        onCancel={handleCancelAddToCart}
      />
    </div>
  );
};

export default BuildYourOwn;