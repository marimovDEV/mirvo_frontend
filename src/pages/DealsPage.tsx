import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard } from '@/src/components/MarketplaceComponents';
import { PRODUCTS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Zap, Clock, TrendingDown, ChevronLeft, ShoppingBag } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function DealsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3600 * 14 + 1200); // Mocked countdown

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter products that are on "sale" (mocked)
  const deals = PRODUCTS.slice(0, 8).map(p => ({
    ...p,
    discount: Math.floor(Math.random() * 30) + 10, // 10-40% discount
    oldPrice: Math.floor(p.price * 1.3)
  }));

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 pb-32">
        {/* Hero Section - High Intensity */}
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto bg-black rounded-[3rem] p-8 md:p-20 overflow-hidden relative">
             <div className="absolute right-0 top-0 w-full h-full opacity-10 pointer-events-none">
                <Zap className="w-full h-full scale-150 rotate-12" />
             </div>
             
             <div className="relative z-10 space-y-8 max-w-2xl">
                <div className="flex items-center gap-4">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{formatTime(timeLeft)}</span>
                   </div>
                   <div className="bg-primary px-4 py-2 rounded-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">LIVE NOW</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <h1 className="text-5xl md:text-[7vw] font-display uppercase tracking-tighter leading-none text-white">
                      Kunlik <br /> Chegirmalar
                   </h1>
                   <p className="text-white/40 font-serif italic text-lg md:text-xl leading-relaxed">
                      Eksklyuziv takliflar. Faqat 24 soat ichida amal qiladi. 
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="px-6 max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-16 md:gap-x-10 md:gap-y-24">
              {deals.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                   {/* Discount Badge */}
                   <div className="absolute top-4 left-4 z-20 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                      -{p.discount}%
                   </div>
                   
                   <ProductCard product={p} />
                   
                   {/* Stock Indicator */}
                   <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-300">
                         <span>Qoldi: {Math.floor(Math.random() * 10) + 2} dona</span>
                         <span className="text-primary italic">Sotilmoqda!</span>
                      </div>
                      <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${Math.random() * 60 + 20}%` }} />
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* B2B Hook */}
        <section className="px-6 mt-32">
           <div className="max-w-screen-md mx-auto bg-zinc-50 rounded-[2.5rem] p-12 text-center space-y-6 border border-zinc-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <ShoppingBag size={24} className="text-black" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Katta buyurtmalar bormi?</h2>
              <p className="text-zinc-400 font-medium text-sm max-w-sm mx-auto">MIRVO bilan hamkorlik qiling va maxsus ulgurji narxlarni qo'lga kiriting.</p>
              <button 
                onClick={() => navigate('/b2b')}
                className="bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Hamkor bo'lish
              </button>
           </div>
        </section>
      </main>


    </div>
  );
}
