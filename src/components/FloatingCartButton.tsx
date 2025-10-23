import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-6 bg-primos-red text-white p-5 rounded-full shadow-2xl hover:bg-primos-darkRed transition-all duration-200 transform hover:scale-110 z-40 md:hidden border-4 border-white"
    >
      <div className="relative">
        <ShoppingCart className="h-7 w-7" />
        <span className="absolute -top-3 -right-3 bg-primos-black text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-black border-2 border-white">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;