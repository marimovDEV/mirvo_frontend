import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/src/contexts/CartContext';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard } from '@/src/components/MarketplaceComponents';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

export default function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlist } = useCart();

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto pb-40">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 px-2">
            <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Savoured Essentials</p>
                <h1 className="text-5xl md:text-[6vw] font-display uppercase tracking-tighter leading-none">
                  {t('wishlist.title')}
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold bg-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {wishlist.length} {t('common.products')}
                    </span>
                </div>
            </div>
            <p className="max-w-xs font-serif italic text-zinc-400 text-lg md:text-xl leading-relaxed">
              Siz tanlagan va yoqtirgan eng sara mahsulotlar to'plami.
            </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center space-y-10">
            {/* Elegant Empty Icon */}
            <div className="relative group">
              <div className="w-32 h-32 bg-zinc-50 rounded-[3rem] flex items-center justify-center relative overflow-hidden transition-all duration-700 group-hover:rounded-[2rem]">
                 <Heart className="w-12 h-12 text-zinc-200 group-hover:scale-110 group-hover:text-red-500/20 transition-all duration-500" strokeWidth={1.5} />
                 <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-primary/5 rounded-full blur-xl"
              />
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black">{t('wishlist.empty_title')}</h3>
                  <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto leading-relaxed">
                    {t('wishlist.empty_sub')}
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-black text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-[0.98] transition-all"
                >
                    {t('wishlist.cta')}
                </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-10">
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </main>


    </div>
  );
}
