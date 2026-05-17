import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mirvo_cart');
    const savedWishlist = localStorage.getItem('mirvo_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('mirvo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mirvo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const normalizedProduct = { ...product, price: Number(product.price) || 0 };
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === normalizedProduct.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );
      if (existing) {
        return prev.map(item => 
          (item.id === normalizedProduct.id && item.selectedSize === size && item.selectedColor === color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...normalizedProduct, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(item => 
      (item.id === productId && item.selectedSize === size && item.selectedColor === color)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('mirvo_cart');
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist, 
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
