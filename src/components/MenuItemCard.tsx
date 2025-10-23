import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity 
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-primos-gray-50 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primos-red/20 transition-all duration-300 overflow-hidden group animate-scale-in border-2 border-primos-gray-300 ${!item.available ? 'opacity-60' : ''}`}>
        {/* Image Container with Badges */}
        <div className="relative h-52 bg-primos-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-6xl opacity-20 text-gray-400">☕</div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-primos-red text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl animate-pulse">
                SALE
              </div>
            )}
            {item.popular && (
              <div className="bg-primos-black text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl">
                ⭐ POPULAR
              </div>
            )}
          </div>
          
          {!item.available && (
            <div className="absolute top-3 right-3 bg-primos-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl">
              UNAVAILABLE
            </div>
          )}
          
          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-3 right-3 bg-white text-primos-red text-sm font-black px-3 py-2 rounded-lg shadow-xl border-2 border-primos-red">
              {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-bold text-primos-white leading-tight flex-1 pr-2">{item.name}</h4>
            {item.variations && item.variations.length > 0 && (
              <div className="text-xs font-semibold text-primos-gray-700 bg-primos-gray-200 px-3 py-1 rounded-lg whitespace-nowrap">
                {item.variations.length} sizes
              </div>
            )}
          </div>
          
          <p className={`text-sm mb-5 leading-relaxed ${!item.available ? 'text-primos-gray-500' : 'text-primos-gray-600'}`}>
            {!item.available ? 'Currently Unavailable' : item.description}
          </p>
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-black text-primos-red">
                      ₱{item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-base font-semibold text-primos-gray-600 line-through">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-primos-brightRed">
                    Save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-black text-primos-red">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
              
              {item.variations && item.variations.length > 0 && (
                <div className="text-xs font-medium text-primos-gray-600 mt-1">
                  Starting price
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-primos-gray-200 text-primos-gray-500 px-5 py-3 rounded-lg cursor-not-allowed font-bold text-sm"
                >
                  Unavailable
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-primos-red text-white px-6 py-3 rounded-lg hover:bg-primos-darkRed transition-all duration-200 transform hover:scale-105 font-bold text-sm shadow-lg shadow-primos-red/50 hover:shadow-xl hover:shadow-primos-red/70"
                >
                  {item.variations?.length || item.addOns?.length ? 'CUSTOMIZE' : 'ADD'}
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-primos-gray-200 rounded-lg p-1.5 border-2 border-primos-gray-400">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-primos-white font-bold" />
                  </button>
                  <span className="font-black text-primos-white min-w-[32px] text-center text-base">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-primos-white font-bold" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-1 text-xs font-semibold text-primos-gray-700 bg-primos-gray-200 px-3 py-2 rounded-lg">
              <span>+</span>
              <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-primos-gray-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primos-red">
            <div className="sticky top-0 bg-primos-gray-50 border-b-2 border-primos-red p-6 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-2xl font-bold text-primos-white">Customize {item.name}</h3>
                <p className="text-sm font-medium text-primos-gray-600 mt-1">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-primos-gray-200 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-primos-white" />
              </button>
            </div>

            <div className="p-6">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-primos-white text-lg mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedVariation?.id === variation.id
                            ? 'border-primos-red bg-primos-gray-200'
                            : 'border-primos-gray-300 hover:border-primos-red hover:bg-primos-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-primos-red focus:ring-primos-red"
                          />
                          <span className="font-bold text-primos-white">{variation.name}</span>
                        </div>
                        <span className="text-primos-red font-black text-lg">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-primos-white text-lg mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-bold text-primos-gray-700 mb-3 uppercase">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border-2 border-primos-gray-300 rounded-lg hover:border-primos-red hover:bg-primos-gray-100 transition-all duration-200"
                          >
                            <div className="flex-1">
                              <span className="font-bold text-primos-white">{addOn.name}</span>
                              <div className="text-sm font-semibold text-primos-red">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-primos-gray-200 rounded-lg p-1 border-2 border-primos-gray-400">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-primos-white" />
                                  </button>
                                  <span className="font-black text-primos-white min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-primos-white" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-primos-red text-white rounded-lg hover:bg-primos-darkRed transition-all duration-200 text-sm font-bold shadow-lg shadow-primos-red/50"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>ADD</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t-2 border-primos-red pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-black">
                  <span className="text-primos-white">Total:</span>
                  <span className="text-primos-red">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-primos-red text-white py-4 rounded-lg hover:bg-primos-darkRed transition-all duration-200 font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primos-red/50 hover:shadow-2xl hover:shadow-primos-red/70 transform hover:scale-105 text-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>ADD TO CART - ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;