import { Heart, Star, ShoppingCart, Grid, User, Venus, Dumbbell, Watch, ShoppingBag, Package, Zap, Eye, ArrowRight, X, Check, Plus, Building2 } from 'lucide-react';
import { Product, Category } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/contexts/CartContext';
import React, { useState } from 'react';

export function ProductCard({ product, loading }: { product: Product, loading?: boolean, key?: any }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-full">
        <div className="aspect-[3/4] skeleton" />
        <div className="pt-3 space-y-2">
          <div className="h-2 w-1/3 skeleton" />
          <div className="h-3 w-4/5 skeleton" />
          <div className="h-3 w-2/5 skeleton" />
        </div>
      </div>
    );
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, selectedSize, selectedColor });
    setShowQuickAdd(false);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="group flex flex-col cursor-pointer h-full relative"
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-stone">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Minimal Add Button - Desktop */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickAdd(true); }}
              className="w-full bg-white/95 backdrop-blur-sm text-primary py-3 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> {t('common.add_to_cart')}
            </button>
          </div>

          {/* Minimal Add Button - Mobile */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickAdd(true); }}
            className="md:hidden absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center active:scale-90 z-20 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product info */}
        <div className="pt-3 flex-1 flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold text-black/30 uppercase tracking-[0.2em]">{product.brand}</p>
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[9px] font-bold text-black/40">{product.rating || '4.9'}</span>
            </div>
          </div>
          
          <h3 className="text-[13px] md:text-sm font-medium text-primary line-clamp-1 leading-snug">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-bold text-primary tracking-tight">
              {formatPrice(product.price)} <span className="text-[10px] font-normal text-black/20">{t('home.currency')}</span>
            </span>
          </div>

          {/* Stock & Badge - Mobile focus */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">{product.stock || '5'} dona qoldi</span>
            </div>
            {product.isBestseller && (
              <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-stone px-2 py-0.5 rounded-full">Bestseller</span>
            )}
          </div>
        </div>
      </div>


      {/* Quick Add Bottom Sheet */}
      <AnimatePresence>
        {showQuickAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQuickAdd(false)}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed bottom-0 left-0 w-full bg-white z-[101] pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-black/10 rounded-full" /></div>
              <div className="px-5 pb-6 space-y-5">
                <div className="flex gap-3">
                  <div className="w-16 h-20 overflow-hidden bg-stone flex-shrink-0">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-black/30 uppercase tracking-widest">{product.brand}</p>
                    <h4 className="font-medium text-sm leading-tight truncate">{product.name}</h4>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(product.price)} {t('home.currency')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-black/40">{t('product.select_size')}</p>
                  <div className="flex gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)} className={cn(
                        "flex-1 py-2.5 text-xs font-medium transition-all active:scale-95",
                        selectedSize === s ? "bg-primary text-white" : "bg-stone text-black/50 hover:text-black"
                      )}>{s}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleQuickAdd} className="w-full h-12 bg-primary text-white font-bold uppercase text-[11px] tracking-[0.15em] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> {t('common.add_to_cart')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function WholesaleBanner() {
  const { t } = useTranslation();
  return (
    <div className="relative w-full overflow-hidden text-white rounded-[2.5rem] border border-white/5" style={{ background: 'linear-gradient(160deg, #000 0%, #111 100%)' }}>
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative z-10 p-8 md:p-16 flex flex-col justify-center space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-white/20" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Hamkorlik</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter leading-none">
            {t('b2b.home_title')}
          </h2>
          <p className="text-white/40 text-[11px] md:text-sm max-w-xs leading-relaxed font-medium">
             Do'koningiz bormi? MIRVO bilan 1 oy bepul boshlang va ulgurji narxlarda hamkorlik qiling.
          </p>
          <Link
            to="/b2b"
            className="inline-flex items-center gap-3 bg-white text-black w-full md:w-fit justify-center px-8 py-4 md:py-3.5 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-95 rounded-2xl md:rounded-none"
          >
            Seller bo'lish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden md:block relative h-full">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
