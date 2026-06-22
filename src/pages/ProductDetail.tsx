import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '@/src/constants';
import { productsApi, getMediaUrl } from '@/src/lib/api';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ChevronLeft, Truck, Heart, Minus, Plus, TrendingUp, ShieldCheck, RefreshCcw, Zap, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/contexts/CartContext';

function CountdownTimer({ expiryDate }: { expiryDate: string }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = React.useState<{ d: number; h: number; m: number; s: number } | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(expiryDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2">
      {[
        { label: t('product.countdown_days'), val: timeLeft.d },
        { label: t('product.countdown_hours'), val: timeLeft.h },
        { label: t('product.countdown_mins'), val: timeLeft.m },
        { label: t('product.countdown_secs'), val: timeLeft.s },
      ].map((item, i) => (
        <div key={i} className="bg-red-600 text-white p-2 rounded-xl min-w-[50px] text-center shadow-lg shadow-red-500/20">
          <div className="text-sm font-black leading-none">{item.val}</div>
          <div className="text-[7px] font-black uppercase tracking-widest opacity-60 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(true);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Normalize product: ensure sizes, colors arrays exist
  const normalizeProduct = (p: any) => {
    if (!p) return p;
    return {
      ...p,
      sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
      colors: p.colors && p.colors.length > 0 ? p.colors : ['#000000', '#FFFFFF'],
      price: Number(p.price) || Number(p.salePrice) || 0,
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      oldPrice: p.salePrice ? Number(p.price) : null,
      rating: p.rating || 0,
      reviews: p.reviews || p.reviews_count || 0,
      stock: p.stock || 0,
      brand: p.brand || 'MIRVO',
      description: p.description || '',
      image: p.image || (p.images && p.images[0]) || '',
    };
  };

  React.useEffect(() => {
    setLoading(true);
    productsApi.getOne(id!).then(res => {
      const normalized = normalizeProduct(res);
      setProduct(normalized);
      if (normalized.colors?.length) setSelectedColor(normalized.colors[0]);
      if (normalized.sizes?.length) setSelectedSize(normalized.sizes[0]);
    }).catch(() => {
      // Fallback to static constants if API fails
      const fallback = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
      const normalized = normalizeProduct(fallback);
      setProduct(normalized);
      if (normalized.colors?.length) setSelectedColor(normalized.colors[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) {
    return <div className="h-screen flex items-center justify-center bg-white"><Zap className="w-10 h-10 animate-pulse" /></div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Sticky Header Action */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 pointer-events-none md:hidden">
         <button onClick={() => navigate(-1)} className="p-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-2xl pointer-events-auto active:scale-90 shadow-xl transition-all">
           <ChevronLeft className="w-5 h-5 text-black" />
         </button>
         <button 
           onClick={() => toggleWishlist(product)}
           className={cn(
             "p-3 rounded-2xl pointer-events-auto active:scale-90 transition-all backdrop-blur-xl shadow-xl border border-black/5",
             isInWishlist(product.id) ? "bg-red-500 text-white border-red-500" : "bg-white/80 text-black"
           )}
         >
           <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-white")} />
         </button>
      </div>
      
      <MarketHeader />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-32 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          {/* 1. Immersive Image Section */}
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-black/5 group"
             >
                <img 
                  src={getMediaUrl(product.image)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   {product.isBestseller && (
                     <div className="bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                        {t('product.bestseller')}
                     </div>
                   )}
                   <div className="bg-white text-black px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl border border-black/5">
                      {t('product.new_collection')}
                   </div>
                </div>
             </motion.div>
             
             {/* Thumbnail Reel */}
             <div className="grid grid-cols-4 gap-4 px-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-zinc-50 border border-black/5 overflow-hidden cursor-pointer hover:border-black/20 transition-all opacity-60 hover:opacity-100">
                    <img src={getMediaUrl(product.image)} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
             </div>
          </div>

          {/* 2. Editorial Info Section */}
          <div className="flex flex-col space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">{product.brand}</p>
                    <div className="h-px w-8 bg-zinc-100" />
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{t('product.authentic_series')}</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none text-black">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-display tracking-tight text-black">{Math.round(Number(product.price)).toLocaleString()} {t('home.currency')}</span>
                       {product.oldPrice && (
                         <span className="text-sm text-zinc-300 line-through font-bold">{Math.round(Number(product.oldPrice)).toLocaleString()} {t('home.currency')}</span>
                       )}
                    </div>
                    {product.oldPrice && (
                      <div className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                         -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}
                </div>

                {product.saleTimer && (
                  <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                           <Clock size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{t('product.action_finish')}</p>
                           <p className="text-[8px] font-bold text-red-400 uppercase">{t('product.action_limit')}</p>
                        </div>
                     </div>
                     <CountdownTimer expiryDate={product.saleTimer} />
                  </div>
                )}
              </div>
              
              <p className="text-zinc-400 font-serif italic text-lg md:text-xl leading-relaxed max-w-md">
                 {product.description || t('product.description_default')}
              </p>
            </div>

            {/* Premium Selectors */}
            <div className="space-y-12 py-8 border-y border-zinc-100">
              {/* Size Selector */}
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">{t('product.select_size')}</h3>
                  <button className="text-[10px] font-bold text-zinc-400 border-b border-zinc-200 uppercase tracking-widest">{t('product.size_guide')}</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {(product.sizes || []).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex-1 min-w-[70px] py-4 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                        selectedSize === size ? "bg-black text-white border-black shadow-xl shadow-[var(--color-accent)]/20" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:-translate-y-0.5"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">{t('product.select_color')}</h3>
                <div className="flex gap-5">
                  {(product.colors || []).map((color: string) => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all p-1 flex items-center justify-center",
                        selectedColor === color ? "border-[var(--color-accent)] scale-110 shadow-lg shadow-[var(--color-accent)]/30" : "border-transparent opacity-30 hover:opacity-100 hover:scale-105"
                      )}
                    >
                      <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 bg-zinc-50 rounded-[2rem] border border-black/5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Truck className="w-5 h-5 text-black" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">{t('home.trust_delivery')}</p>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{t('home.trust_delivery_time')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-zinc-50 rounded-[2rem] border border-black/5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-black" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">{t('product.secure_payment')}</p>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{t('product.warranty_sub')}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Specs & Features */}
        <div className="mt-32 pt-10 border-t border-zinc-100 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
            <div className="lg:col-span-8 space-y-6">
                <button 
                  onClick={() => setFeaturesOpen(!featuresOpen)} 
                  className="w-full flex items-center justify-between font-display text-3xl md:text-4xl uppercase tracking-tighter text-black py-4 border-b border-zinc-100 hover:text-[var(--color-accent)] transition-colors"
                >
                  <span>{t('product.features')}</span>
                  {featuresOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                <AnimatePresence>
                  {featuresOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-12"
                    >
                      <p className="text-zinc-500 font-medium leading-relaxed text-lg max-w-2xl mt-6">
                         {t('product.features_desc')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-black/5 space-y-4 group hover:bg-[var(--color-accent)] transition-colors duration-500">
                              <TrendingUp className="text-black group-hover:text-white w-8 h-8 transition-colors" />
                              <div className="space-y-2">
                                 <h4 className="font-black text-sm uppercase group-hover:text-white transition-colors">{t('product.bestseller')}</h4>
                                 <p className="text-xs font-bold text-zinc-400 group-hover:text-white/80 transition-colors">{t('home.popular')}</p>
                              </div>
                          </div>
                          <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-black/5 space-y-4 group hover:bg-[var(--color-accent)] transition-colors duration-500">
                              <RefreshCcw className="text-black group-hover:text-white w-8 h-8 transition-colors" />
                              <div className="space-y-2">
                                 <h4 className="font-black text-sm uppercase group-hover:text-white transition-colors">{t('home.trust_return')}</h4>
                                 <p className="text-xs font-bold text-zinc-400 group-hover:text-white/80 transition-colors">{t('product.return_policy_desc')}</p>
                              </div>
                          </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            
            <div className="lg:col-span-4 bg-zinc-50 p-8 rounded-[3rem] border border-black/5 h-fit">
                <button 
                  onClick={() => setSpecsOpen(!specsOpen)} 
                  className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-4 hover:text-[var(--color-accent)] transition-colors"
                >
                  <span>{t('product.specs')}</span>
                  {specsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {specsOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6 pt-4"
                    >
                      <div className="flex justify-between border-b border-zinc-200 pb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('product.material')}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t('product.material_default')}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('product.warranty')}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t('product.warranty_default')}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('product.origin')}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-black">{t('product.origin_default')}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </main>

      {/* Pinned Buy Panel - Redesigned Mobile Experience */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-[60] bg-white border-t border-zinc-100 p-4 pb-[env(safe-area-inset-bottom)] flex gap-4 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
         <div className="flex items-center bg-zinc-100 rounded-2xl px-3 h-14 border border-black/5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 active:scale-75 transition-transform"><Minus className="w-4 h-4" /></button>
            <span className="w-8 text-center font-black text-sm">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 active:scale-75 transition-transform"><Plus className="w-4 h-4" /></button>
         </div>
         <button
           onClick={handleAddToCart}
           className="flex-1 bg-black text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] active:scale-[0.98] transition-all shadow-2xl shadow-black/20"
         >
           {t('common.add_to_cart')} — {Math.round(Number(product.price) * quantity).toLocaleString()}
         </button>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 bg-[var(--color-accent)] text-white px-6 py-3 rounded-full flex items-center gap-3 z-[70] shadow-2xl shadow-[var(--color-accent)]/30"
          >
            <Check className="w-4 h-4 text-white" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t('product.added_to_cart', 'Savatga qo\'shildi')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <MarketBottomNav />
    </div>
  );
}
