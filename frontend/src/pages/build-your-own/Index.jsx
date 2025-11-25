import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import IngredientSelector from './components/IngredientSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useCart } from '../../context/CartContext';

const BuildYourOwn = () => {
  const navigate = useNavigate();

  // --- Estados principales ---
  const [selectedType, setSelectedType] = useState('pizza');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});
  const [ingredientsData, setIngredientsData] = useState({});
  const [extrasData, setExtrasData] = useState({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);

  const { addToCart, removeFromCart } = useCart();

  // ------------------------------------------------------------------------------------
  // DEFAULT SIZE PARA ITEMS NUEVOS
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    if (!isEditMode && selectedType && selectedSize === 'null') {
      const defaultSize = selectedType === 'pizza' ? 'small' : 'single';
      setSelectedSize(defaultSize);
    }
  }, [selectedType, selectedSize, isEditMode]);

  // ------------------------------------------------------------------------------------
  // FUNCIÓN PARA MAPEAR TAMAÑOS (pizza / burger)
  // ------------------------------------------------------------------------------------
  const getSizeInfo = (type, size) => {
    const sizeMap =
      type === 'pizza'
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

  // ------------------------------------------------------------------------------------
  // APLICAR DATOS DE EDICIÓN (cuando se edita un producto)
  // ------------------------------------------------------------------------------------
  const applyEditData = useCallback(
    (data) => {
      if (!data) return;

      let ingredientsToSet = {};
      let extrasToSet = {};

      // INGREDIENTES
      if (Array.isArray(data.selectedIngredients)) {
        data.selectedIngredients.forEach((ingredient) => {
          const { category, id, name } = ingredient;
          if (!category) return;

          const categoryItems = ingredientsData[category] || [];

          let found =
            categoryItems.find((i) => i.id === id) ||
            categoryItems.find((i) => i.name === name);

          if (found) {
            if (!ingredientsToSet[category]) ingredientsToSet[category] = [];
            ingredientsToSet[category].push(found.id);
          }
        });
      }

      // EXTRAS
      if (Array.isArray(data.selectedExtras)) {
        data.selectedExtras.forEach((extra) => {
          const { category, id, name } = extra;
          if (!category) return;

          const categoryItems = extrasData[category] || [];

          let found =
            categoryItems.find((i) => i.id === id) ||
            categoryItems.find((i) => i.name === name);

          if (found) {
            if (!extrasToSet[category]) extrasToSet[category] = [];
            extrasToSet[category].push(found.id);
          }
        });
      }

      setSelectedIngredients(ingredientsToSet);
      setSelectedExtras(extrasToSet);
    },
    [ingredientsData, extrasData]
  );

  // ------------------------------------------------------------------------------------
  // CARGAR MODO EDICIÓN DESDE localStorage
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('editItem');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (parsed.editMode) {
        setIsEditMode(true);
        setEditData(parsed);

        setSelectedType(parsed.productType || 'pizza');
        setSelectedSize(parsed.selectedSize || null);
      }
    } catch {
      console.error('Error cargando item para editar');
    }

    localStorage.removeItem('editItem');
  }, []);

  // Cuando ingredientsData y extrasData ya están listos → aplicar edición
  useEffect(() => {
    if (
      isEditMode &&
      editData &&
      Object.keys(ingredientsData).length > 0 &&
      Object.keys(extrasData).length > 0
    ) {
      applyEditData(editData);
    }
  }, [isEditMode, editData, ingredientsData, extrasData, applyEditData]);

  // ------------------------------------------------------------------------------------
  // AL HACER CLICK EN "AGREGAR AL CARRITO" → mostrar modal de confirmación
  // ------------------------------------------------------------------------------------
  const handleAddToCartRequest = (data) => {
    setProductToAdd(data);
    setShowConfirmModal(true);
  };

  // ------------------------------------------------------------------------------------
  // CONFIRMAR AGREGAR/EDITAR PRODUCTO
  // ------------------------------------------------------------------------------------
  const handleConfirmAddToCart = () => {
    if (!productToAdd) return;

    const sizeInfo = getSizeInfo(productToAdd.productType, productToAdd.selectedSize);
    const editing = editData && editData.originalItemId;

    // Ingredientes seleccionados
    const selectedItems = [];
    Object.entries(productToAdd.selectedIngredients ?? {}).forEach(
      ([category, ids]) => {
        const catData = productToAdd.ingredientsData[category] || [];
        ids.forEach((id) => {
          const found = catData.find((i) => i.id === id);
          if (found) {
            selectedItems.push({
              id: found.id,
              category,
              name: found.name,
              price: found.price || 0,
              type: 'ingredient',
            });
          }
        });
      }
    );

    // Extras seleccionados
    const selectedExtraItems = [];
    Object.entries(productToAdd.selectedExtras ?? {}).forEach(([category, ids]) => {
      const catData = productToAdd.extrasData[category] || [];
      ids.forEach((id) => {
        const found = catData.find((i) => i.id === id);
        if (found) {
          selectedExtraItems.push({
            id: found.id,
            category,
            name: found.name,
            price: found.price || 0,
            type: 'extra',
          });
        }
      });
    });

    const item = {
      id: editing ? editData.originalItemId : `custom-${Date.now()}`,
      name:
        productToAdd.productType === 'pizza'
          ? `Pizza ${sizeInfo?.nameEs || ''}`
          : `Hamburguesa ${sizeInfo?.nameEs || ''}`,
      description:
        selectedItems.map((i) => i.name).join(', ') || 'Sin ingredientes adicionales',
      extrasDescription:
        selectedExtraItems.length > 0
          ? `Extras: ${selectedExtraItems.map((e) => e.name).join(', ')}`
          : '',
      price: productToAdd.total,
      quantity: 1,
      image:
        productToAdd.productType === 'pizza'
          ? '/images/custom-pizza.jpg'
          : '/images/custom-burger.jpg',
      customProduct: true,
      customData: {
        type: productToAdd.productType,
        size: productToAdd.selectedSize,
        sizeInfo,
        ingredients: selectedItems,
        extras: selectedExtraItems,
        basePrice: productToAdd.basePrice,
        ingredientsPrice: productToAdd.ingredientsPrice,
        extrasPrice: productToAdd.extrasPrice,
      },
    };

    if (editing) {
      removeFromCart(editData.originalItemId);
    }

    addToCart(item);
    setShowConfirmModal(false);
    setProductToAdd(null);
    setIsEditMode(false);
    setEditData(null);

    if (editing) navigate('/cart');
  };

  const handleCancelAddToCart = () => {
    setShowConfirmModal(false);
    setProductToAdd(null);

    if (isEditMode) {
      setIsEditMode(false);
      setEditData(null);
    }
  };

  // ------------------------------------------------------------------------------------
  // HANDLERS NORMALES
  // ------------------------------------------------------------------------------------
  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (!isEditMode) setSelectedSize(type === 'pizza' ? 'small' : 'single');
  };

  const handleSizeChange = (s) => setSelectedSize(s);

  const handleIngredientChange = (cat, ids) =>
    setSelectedIngredients((p) => ({ ...p, [cat]: ids }));

  const handleExtraChange = (cat, ids) =>
    setSelectedExtras((p) => ({ ...p, [cat]: ids }));

  // ------------------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="mt-8 text-3xl font-semibold">
              {isEditMode ? '✏️ Editando Producto' : 'Creá Tu Propia Pizza o Hamburguesa'}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {isEditMode
                ? 'Modificá tu producto y guardá los cambios'
                : 'Elegí tu tipo, tamaño, ingredientes y extras. ¡Combiná a tu gusto!'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* IZQUIERDA */}
            <div className="lg:col-span-2 space-y-6">
              <ProductTypeSelector selectedType={selectedType} onTypeChange={handleTypeChange} />

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
                  onIngredientsLoaded={setIngredientsData}
                />
              )}

              {selectedType && (
                <ExtrasSelector
                  productType={selectedType}
                  selectedIngredients={selectedExtras}
                  onIngredientChange={handleExtraChange}
                  onIngredientsLoaded={setExtrasData}
                />
              )}
            </div>

            {/* DERECHA */}
            <div className="space-y-6">
              <OrderSummary
                productType={selectedType}
                selectedSize={selectedSize}
                selectedIngredients={selectedIngredients}
                selectedExtras={selectedExtras}
                ingredientsData={ingredientsData}
                extrasData={extrasData}
                onAddToCart={handleAddToCartRequest}
              />
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={showConfirmModal}
        title={isEditMode ? '¿Guardar cambios?' : '¿Agregar al carrito?'}
        message={
          isEditMode
            ? '¿Estás seguro de que querés guardar los cambios?'
            : '¿Agregar este producto personalizado al carrito?'
        }
        onConfirm={handleConfirmAddToCart}
        onCancel={handleCancelAddToCart}
      />
    </div>
  );
};

export default BuildYourOwn;
