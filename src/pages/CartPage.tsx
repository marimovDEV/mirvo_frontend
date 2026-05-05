import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/src/contexts/CartContext';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ChevronLeft, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

import { ProductCard } from '@/src/components/MarketplaceComponents';
import { PRODUCTS } from '@/src/constants';

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    const recommended = PRODUCTS.filter(p => p.isBestseller).slice(0, 4);

    return (
      <div className="bg-white min-h-screen pb-32">
        <MarketHeader />
        
        <main className="max-w-2xl mx-auto pt-24 pb-12">
          {/* Empty State Hero */}
          <section className="px-6 py-12 flex flex-col items-center text-center space-y-8">
            <div className="w-32 h-32 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-90 group-hover:scale-110 transition-transform duration-700" />
              <ShoppingBag className="w-12 h-12 text-zinc-300 relative z-10" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black uppercase tracking-tight text-primary">
                Savatingiz hozircha bo'sh
              </h2>
              <p className="text-sm font-medium text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
                Yoqtirgan mahsulotlarni tanlang va savatga qo'shing. Xarid qilishni hoziroq boshlang!
              </p>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-white w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
            >
              Xaridni boshlash
            </button>
          </section>

          {/* Recommendations */}
          <section className="px-6 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">Sizga yoqishi mumkin</h3>
              <div className="h-px flex-1 bg-zinc-100 ml-4" />
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {recommended.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full mt-12 py-5 border-2 border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black hover:border-black transition-all"
            >
              Barcha mahsulotlarni ko'rish
            </button>
          </section>
        </main>
        
        <MarketBottomNav />
      </div>
    );
  }


  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 md:pt-32 px-5 max-w-6xl mx-auto pb-48">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 px-4">
            <div className="space-y-4">
                <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.4em]">Review your selection</p>
                <h1 className="text-5xl md:text-[6vw] font-display uppercase tracking-tighter leading-none">{t('cart.title')}</h1>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{cartCount} {t('common.products')}</span>
                </div>
            </div>
            <button onClick={() => navigate('/')} className="font-serif italic text-lg hover:text-black transition-colors opacity-40 hover:opacity-100 flex items-center gap-2 group">
                Continue Exploring <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="group p-6 bg-white border border-black/5 rounded-[2.5rem] hover:border-black/20 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8 shadow-sm hover:shadow-2xl"
              >
                <div className="w-full sm:w-40 aspect-square rounded-[2rem] overflow-hidden bg-surface-container-low shrink-0 relative">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-1 w-full space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">{item.brand}</p>
                            <h3 className="font-display text-2xl uppercase tracking-tighter">{item.name}</h3>
                            <div className="flex gap-4 pt-1">
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Size: {item.selectedSize}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Color:</span>
                                    <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                            className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-75"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                        <div className="flex items-center bg-zinc-100 rounded-xl px-2 h-12">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)} className="p-2 hover:opacity-40 transition-opacity"><Minus className="w-4 h-4" /></button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)} className="p-2 hover:opacity-40 transition-opacity"><Plus className="w-4 h-4" /></button>
                        </div>
                        <p className="font-display text-xl tracking-tight">{item.price.toLocaleString()} so'm</p>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Pinned Bottom Summary */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-primary/10 p-4 md:p-6 pb-6 md:pb-8 shadow-[0_-4px_24px_rgba(99,102,241,0.1)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{t('checkout.total')}</p>
                  <h4 className="text-xl md:text-3xl font-display tracking-tighter text-gradient-primary">{cartTotal.toLocaleString()} so'm</h4>
                  <p className="text-[9px] text-on-surface-variant/50">+ 25,000 yetkazib berish</p>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-primary text-white h-14 md:h-16 px-10 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
              >
                {t('checkout.title')} →
              </button>
          </div>
      </div>
    </div>
  );
}
