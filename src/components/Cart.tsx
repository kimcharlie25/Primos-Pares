import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 bg-primos-black min-h-screen">
        <div className="text-center py-20">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-4xl font-display font-bold text-primos-red mb-4">YOUR CART IS EMPTY</h2>
          <p className="text-primos-gray-600 text-lg font-medium mb-8">Add some delicious items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-primos-red text-white px-8 py-4 rounded-lg hover:bg-primos-darkRed transition-all duration-200 font-bold text-lg shadow-xl shadow-primos-red/50"
          >
            BROWSE MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-primos-black min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-primos-white hover:text-primos-red transition-colors duration-200 font-bold"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="hidden sm:inline">CONTINUE SHOPPING</span>
          <span className="sm:hidden">BACK</span>
        </button>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-primos-red">YOUR CART</h1>
        <button
          onClick={clearCart}
          className="text-primos-red hover:text-primos-brightRed transition-colors duration-200 font-bold text-sm sm:text-base"
        >
          CLEAR ALL
        </button>
      </div>

      <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 overflow-hidden mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b-2 border-primos-gray-300' : ''}`}>
            {/* Mobile Layout - Stack Vertically */}
            <div className="block sm:hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="text-lg font-bold text-primos-white mb-2">{item.name}</h3>
                  {item.selectedVariation && (
                    <p className="text-xs font-semibold text-primos-gray-600 mb-1">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs font-semibold text-primos-gray-600 mb-1">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm font-bold text-primos-red">₱{item.totalPrice} each</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-white bg-primos-red hover:bg-primos-darkRed rounded-lg transition-all duration-200 border-2 border-primos-red shadow-lg shadow-primos-red/50 flex-shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-primos-gray-200 rounded-lg p-1 border-2 border-primos-gray-400">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-primos-white" />
                  </button>
                  <span className="font-black text-primos-white min-w-[32px] text-center text-base">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-primos-white" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-black text-primos-red">₱{item.totalPrice * item.quantity}</p>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primos-white mb-2">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm font-semibold text-primos-gray-600 mb-1">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm font-semibold text-primos-gray-600 mb-1">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-bold text-primos-red">₱{item.totalPrice} each</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3 bg-primos-gray-200 rounded-lg p-1.5 border-2 border-primos-gray-400">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Minus className="h-5 w-5 text-primos-white" />
                  </button>
                  <span className="font-black text-primos-white min-w-[40px] text-center text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-primos-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 text-primos-white" />
                  </button>
                </div>
                
                <div className="text-right min-w-[120px]">
                  <p className="text-2xl font-black text-primos-red">₱{item.totalPrice * item.quantity}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-white bg-primos-red hover:bg-primos-darkRed rounded-lg transition-all duration-200 border-2 border-primos-red shadow-lg shadow-primos-red/50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 p-4 sm:p-8">
        <div className="flex items-center justify-between text-2xl sm:text-3xl font-black mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-4 border-primos-red">
          <span className="text-primos-white">TOTAL:</span>
          <span className="text-primos-red">₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-primos-red text-white py-4 sm:py-5 rounded-lg hover:bg-primos-darkRed transition-all duration-200 transform hover:scale-[1.02] font-bold text-lg sm:text-xl shadow-2xl shadow-primos-red/50"
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;