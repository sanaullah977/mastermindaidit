import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout & Global Components
import { Navbar } from './components/layout/Navbar';
import { Preloader } from './components/layout/Preloader';

// Routing configuration
import { AppRoutes } from './routes/AppRoutes';

// Modals & Floating Tools
import { SearchModal } from './components/shared/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { PathFinderModal } from './components/shared/PathFinderModal';

import { Course } from './types/platform';
import { DBService } from './services/db';

export function App() {
  const navigate = useNavigate();

  // Site Initial Preloader State
  const [isLoaded, setIsLoaded] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('mastermindaidit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPathFinderOpen, setIsPathFinderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mastermindaidit_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (course: Course) => {
    if (!cart.some((item) => item.id === course.id)) {
      setCart([...cart, course]);
      showToast(`" ${course.title} " added to your cart!`);
    } else {
      showToast(`" ${course.title} " is already in your cart.`);
    }
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCart(cart.filter((item) => item.id !== courseId));
    showToast('Course removed from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared.');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans overflow-x-hidden">
      
      {/* Global Responsive Navbar */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Site Entrance Preloader Splash */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0A192F] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-brand-400 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Application Route Engine */}
      <div className="flex-1">
        <AppRoutes
          onAddToCart={handleAddToCart}
          cartItemIds={cart.map((c) => c.id)}
          onOpenPathFinder={() => setIsPathFinderOpen(true)}
        />
      </div>

      {/* Global Modals & Overlay Components */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCourse={(course) => navigate(`/courses/${course.id}`)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenPayment={() => {
          setIsCartOpen(false);
          if (cart.length > 0) {
            navigate(`/checkout/${cart[0].id}`);
          } else {
            navigate('/courses');
          }
        }}
      />

      <PathFinderModal
        isOpen={isPathFinderOpen}
        onClose={() => setIsPathFinderOpen(false)}
        onSelectRecommendedCourse={(course: any) => navigate(`/courses/${course.id}`)}
      />


    </div>
  );
}

export default App;
