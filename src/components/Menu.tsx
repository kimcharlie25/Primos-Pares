import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useSiteSettings } from '../hooks/useSiteSettings';
import MenuItemCard from './MenuItemCard';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');
  const { siteSettings } = useSiteSettings();

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure closed modal is visible by scrolling to top when store is closed
  React.useEffect(() => {
    if (siteSettings && siteSettings.store_open === false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [siteSettings?.store_open]);


  return (
    <>
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primos-black">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-display font-bold text-primos-red mb-4">OUR MENU</h2>
        <p className="text-primos-gray-600 text-lg font-medium max-w-2xl mx-auto">
          Savor the authentic taste of Filipino comfort food. Tender beef pares and hearty favorites, 
          made fresh with quality ingredients.
        </p>
      </div>

      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-20">
            <div className="flex items-center mb-8 pb-4 border-b-4 border-primos-red">
              <span className="text-4xl mr-4">{category.icon}</span>
              <h3 className="text-4xl font-display font-bold text-primos-white uppercase">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
        {/* Closed Modal Overlay */}
        {siteSettings && siteSettings.store_open === false && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-24">
            <div className="bg-primos-gray-50 border-2 border-primos-red rounded-xl p-8 max-w-md text-center shadow-2xl shadow-primos-red/30">
              <h3 className="text-2xl font-display font-bold text-primos-red mb-3">Our restaurant is currently closed.</h3>
              <p className="text-primos-white font-medium">{siteSettings.closed_message}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Menu;