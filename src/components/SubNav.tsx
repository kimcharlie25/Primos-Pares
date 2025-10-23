import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-primos-black border-b border-primos-gray-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-10 w-24 bg-primos-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primos-red text-white border-primos-red shadow-lg shadow-primos-red/50'
                    : 'bg-primos-gray-50 text-primos-white border-primos-gray-300 hover:border-primos-red hover:text-primos-red'
                }`}
              >
                ALL
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 flex items-center space-x-2 whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-primos-red text-white border-primos-red shadow-lg shadow-primos-red/50'
                      : 'bg-primos-gray-50 text-primos-white border-primos-gray-300 hover:border-primos-red hover:text-primos-red'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


