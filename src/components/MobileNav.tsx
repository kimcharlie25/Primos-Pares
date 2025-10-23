import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-white border-b border-primos-gray-200 md:hidden shadow-md">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-lg mr-3 transition-all duration-200 border-2 ${
              activeCategory === category.id
                ? 'bg-primos-red text-white border-primos-red font-bold shadow-lg'
                : 'bg-white text-primos-black border-primos-gray-300 hover:border-primos-red font-semibold'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;