import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-primos-black border-b-2 border-primos-red shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            {loading ? (
              <div className="w-12 h-12 bg-primos-gray-100 rounded-full animate-pulse" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "Primos' Pares"}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primos-red"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-3xl font-display font-bold text-primos-red">
              {loading ? (
                <div className="w-32 h-8 bg-primos-gray-100 rounded animate-pulse" />
              ) : (
                "PRIMOS' PARES"
              )}
            </h1>
          </button>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onCartClick}
              className="relative p-3 text-primos-white hover:bg-primos-gray-50 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-7 w-7" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primos-red text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce-gentle">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;