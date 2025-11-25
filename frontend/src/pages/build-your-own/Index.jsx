import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import IngredientSelector from './components/IngredientSelector';
import OrderSummary from './components/OrderSummary';
import { useCart } from '../../context/CartContext';
import ExtrasSelector from './components/ExtrasSelector';
import ConfirmModal from '../../components/ui/ConfirmModal';

const BuildYourOwn = () => {
  const navigate = useNavigate();
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

  // ✅ NUEVO: useEffect para seleccionar tamaño por defecto en pedidos nuevos
  useEffect(() => {
    // Solo aplicar si NO estamos en modo edición
    if (!isEditMode && selectedType && selectedSize === 'null') {
      const defaultSize = selectedType === 'pizza' ? 'small' : 'single';
      console.log(`🎯 Seleccionando tamaño por defecto: ${defaultSize} para ${selectedType}`);
      setSelectedSize(defaultSize);
    }
  }, [selectedType, isEditMode, selectedSize]);

  // ✅ FUNCIÓN MEJORADA - Ahora busca por ID primero, luego por nombre como fallback
  const applyEditData = useCallback((data) => {
    console.log("🔄 APPLY EDIT DATA llamado con:", data);
    if (!data) return;
    
    console.log("📋 Estructura de selectedIngredients:", data.selectedIngredients);
    console.log("📋 Estructura de selectedExtras:", data.selectedExtras);
    console.log("📦 IngredientsData disponible:", ingredientsData);
    console.log("📦 ExtrasData disponible:", extrasData);
    
    let ingredientsToSet = {};
    let extrasToSet = {};
    
    // ✅ BUSCAR INGREDIENTES POR ID (PRIMERO) Y LUEGO POR NOMBRE (FALLBACK)
    if (data.selectedIngredients && Array.isArray(data.selectedIngredients)) {
      console.log("🔍 Buscando ingredientes...");
      data.selectedIngredients.forEach(ingredient => {
        console.log("Procesando ingrediente:", ingredient);
        
        if (ingredient.category) {
          const categoryData = ingredientsData[ingredient.category] || [];
          
          // ✅ BUSCAR POR ID PRIMERO (más confiable)
          let foundIngredient = null;
          if (ingredient.id) {
            foundIngredient = categoryData.find(item => item.id === ingredient.id);
            console.log(`Buscando por ID (${ingredient.id}):`, foundIngredient ? '✅ Encontrado' : '❌ No encontrado');
          }
          
          // ✅ SI NO SE ENCUENTRA POR ID, BUSCAR POR NOMBRE (fallback)
          if (!foundIngredient && ingredient.name) {
            foundIngredient = categoryData.find(item => item.name === ingredient.name);
            console.log(`Buscando por nombre (${ingredient.name}):`, foundIngredient ? '✅ Encontrado' : '❌ No encontrado');
          }
          
          if (foundIngredient) {
            if (!ingredientsToSet[ingredient.category]) {
              ingredientsToSet[ingredient.category] = [];
            }
            ingredientsToSet[ingredient.category].push(foundIngredient.id);
            console.log(`✅ Ingrediente mapeado: ${ingredient.name} -> ID: ${foundIngredient.id}`);
          } else {
            console.log(`❌ No se encontró: ${ingredient.name || ingredient.id} en ${ingredient.category}`);
            console.log("Disponibles en esta categoría:", categoryData.map(item => `${item.name} (${item.id})`));
          }
        }
      });
    }
    
    // ✅ BUSCAR EXTRAS POR ID (PRIMERO) Y LUEGO POR NOMBRE (FALLBACK)
    if (data.selectedExtras && Array.isArray(data.selectedExtras)) {
      console.log("🔍 Buscando extras...");
      data.selectedExtras.forEach(extra => {
        console.log("Procesando extra:", extra);
        
        if (extra.category) {
          const categoryData = extrasData[extra.category] || [];
          
          // ✅ BUSCAR POR ID PRIMERO (más confiable)
          let foundExtra = null;
          if (extra.id) {
            foundExtra = categoryData.find(item => item.id === extra.id);
            console.log(`Buscando extra por ID (${extra.id}):`, foundExtra ? '✅ Encontrado' : '❌ No encontrado');
          }
          
          // ✅ SI NO SE ENCUENTRA POR ID, BUSCAR POR NOMBRE (fallback)
          if (!foundExtra && extra.name) {
            foundExtra = categoryData.find(item => item.name === extra.name);
            console.log(`Buscando extra por nombre (${extra.name}):`, foundExtra ? '✅ Encontrado' : '❌ No encontrado');
          }
          
          if (foundExtra) {
            if (!extrasToSet[extra.category]) {
              extrasToSet[extra.category] = [];
            }
            extrasToSet[extra.category].push(foundExtra.id);
            console.log(`✅ Extra mapeado: ${extra.name} -> ID: ${foundExtra.id}`);
          } else {
            console.log(`❌ No se encontró: ${extra.name || extra.id} en ${extra.category}`);
            console.log("Disponibles en esta categoría:", categoryData.map(item => `${item.name} (${item.id})`));
          }
        }
      });
    }
    
    console.log("🎯 Ingredientes finales para seleccionar:", ingredientsToSet);
    console.log("🎯 Extras finales para seleccionar:", extrasToSet);
    
    setSelectedIngredients(ingredientsToSet);
    setSelectedExtras(extrasToSet);
    // ✅ NO desactivar isEditMode aquí - se mantiene hasta que se confirme el cambio
  }, [ingredientsData, extrasData]);

  useEffect(() => {
    const editItem = localStorage.getItem("editItem");
    console.log("🔍 Buscando editItem en localStorage:", editItem);
    
    if (editItem) {
      try {
        const parsed = JSON.parse(editItem);
        console.log("📖 EDITITEM ENCONTRADO - RAW:", parsed);
        
        if (parsed.editMode) {
          console.log("🎯 ACTIVANDO MODO EDICIÓN");
          setIsEditMode(true);
          setEditData(parsed);
          
          setSelectedType(parsed.productType || 'pizza');
          setSelectedSize(parsed.selectedSize || 'null');
          
          localStorage.removeItem("editItem");
          console.log("✅ editItem removido del localStorage");
        }
      } catch (error) {
        console.error("Error al cargar item para editar:", error);
        localStorage.removeItem("editItem");
      }
    } else {
      console.log("❌ NO se encontró editItem en localStorage");
    }
  }, []);

  useEffect(() => {
    if (isEditMode && editData && 
        Object.keys(ingredientsData).length > 0 && 
        Object.keys(extrasData).length > 0) {
      
      // ✅ VERIFICAR QUE LOS DATOS CORRESPONDAN AL TIPO DE PRODUCTO CORRECTO
      const editIngredientCategories = editData.selectedIngredients?.map(ing => ing.category) || [];
      const availableCategories = Object.keys(ingredientsData);
      
      // Verificar si al menos una categoría de ingredientes coincide
      const hasMatchingCategories = editIngredientCategories.some(cat => 
        availableCategories.includes(cat)
      );
      
      // Si NO hay categorías coincidentes, significa que aún no se cargaron los datos correctos
      if (editIngredientCategories.length > 0 && !hasMatchingCategories) {
        console.log("⏳ Esperando datos correctos del tipo de producto...");
        console.log("Categorías necesarias:", editIngredientCategories);
        console.log("Categorías disponibles:", availableCategories);
        return;
      }
      
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
    
    // ✅ GUARDAR INGREDIENTES CON ID, CATEGORY, NAME Y PRICE
    const selectedItems = [];
    if (productToAdd.ingredientsData && productToAdd.selectedIngredients) {
      Object.entries(productToAdd.selectedIngredients).forEach(([category, ids]) => {
        const categoryIngredients = productToAdd.ingredientsData[category] || [];
        ids.forEach((id) => {
          const found = categoryIngredients.find((ing) => ing.id === id);
          if (found) {
            selectedItems.push({
              id: found.id,           // ✅ GUARDAR EL ID
              category,               // ✅ GUARDAR LA CATEGORÍA
              name: found.name,       // ✅ GUARDAR EL NOMBRE
              price: found.price || 0, // ✅ GUARDAR EL PRECIO
              type: 'ingredient'
            });
          }
        });
      });
    }

    // ✅ GUARDAR EXTRAS CON ID, CATEGORY, NAME Y PRICE
    const selectedExtrasItems = [];
    if (productToAdd.extrasData && productToAdd.selectedExtras) {
      Object.entries(productToAdd.selectedExtras).forEach(([category, ids]) => {
        const categoryExtras = productToAdd.extrasData[category] || [];
        ids.forEach((id) => {
          const found = categoryExtras.find((extra) => extra.id === id);
          if (found) {
            selectedExtrasItems.push({
              id: found.id,           // ✅ GUARDAR EL ID
              category,               // ✅ GUARDAR LA CATEGORÍA
              name: found.name,       // ✅ GUARDAR EL NOMBRE
              price: found.price || 0, // ✅ GUARDAR EL PRECIO
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
        ingredients: selectedItems,        // ✅ Ahora incluye id, category, name, price
        extras: selectedExtrasItems,       // ✅ Ahora incluye id, category, name, price
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
    
    // ✅ Limpiar estado de edición DESPUÉS de confirmar
    setEditData(null);
    setIsEditMode(false);
    
    if (isEditing) {
      console.log("✅ Producto editado exitosamente - Redirigiendo al carrito");
      navigate('/cart');
    } else {
      console.log("✅ Producto agregado al carrito");
    }
  };

  const handleCancelAddToCart = () => {
    setShowConfirmModal(false);
    setProductToAdd(null);
    
    // ✅ Si estaba editando y cancela, limpiar el estado de edición
    if (isEditMode) {
      setIsEditMode(false);
      setEditData(null);
    }
  };

  const handleTypeChange = (type) => {
    if (type === 'pizza') {
      setSelectedType('pizza');
      // ✅ Si NO estamos editando, seleccionar tamaño por defecto
      if (!isEditMode) {
        setSelectedSize('small');
      }
    } else if (type === 'burger') {
      setSelectedType('burger');
      // ✅ Si NO estamos editando, seleccionar tamaño por defecto
      if (!isEditMode) {
        setSelectedSize('single');
      }
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
          <div className="text-center mb-8">
            <h1 className="mt-8 text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
              {isEditMode ? "✏️ Editando Producto" : "Creá Tu Propia Pizza o Hamburguesa"}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {isEditMode ? "Modificá tu producto y guardá los cambios" : "Elegí tu tipo, tamaño, ingredientes y extras. ¡Combiná a tu gusto!"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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