import React, { useState } from 'react';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, MessageCircle, Truck, 
  Paintbrush, TrendingUp, Users, ArrowRight, Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function B2BPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 md:pt-32 pb-40 px-6 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="lean-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-16"
            >
              {/* 1. Minimal Hero */}
              <section className="text-center space-y-8 pt-6">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full">
                    <Sparkles className="w-3 h-3 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Biznes Portal</span>
                 </div>
                 <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none text-black">
                       Biznes uchun <br/> <span className="text-zinc-200">Xarid</span>
                    </h1>
                    <p className="text-zinc-400 font-medium text-lg leading-relaxed max-w-xs mx-auto">
                       Do'kon, jamoa va resellerlar uchun maxsus ulgurji narxlar.
                    </p>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => document.getElementById('quick-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 active:scale-95 transition-all"
                    >
                      Ulgurji narx so'rash
                    </button>
                    <a 
                      href="https://t.me/mirvo_b2b" 
                      target="_blank"
                      className="w-full flex items-center justify-center gap-3 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-100 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> Telegram Aloqa
                    </a>
                 </div>
              </section>

              {/* 2. Compact Benefits */}
              <section className="grid grid-cols-3 gap-2">
                 <BenefitItem icon={<TrendingUp />} label="Maxsus" sub="Narxlar" />
                 <BenefitItem icon={<Truck />} label="Tezkor" sub="Yetkazish" />
                 <BenefitItem icon={<Paintbrush />} label="Custom" sub="Dizayn" />
              </section>

              {/* 3. Quick Stats Row */}
              <section className="flex items-center justify-around py-8 border-y border-zinc-50">
                 <StatItem count="500+" label="Hamkor" />
                 <StatItem count="10k+" label="Mahsulot" />
                 <StatItem count="UZB" label="Barcha hudud" />
              </section>

              {/* 4. Mini Lead Form */}
              <section id="quick-form" className="space-y-10 pt-4">
                 <div className="text-center space-y-2">
                    <h2 className="text-2xl font-display uppercase tracking-tight">Ariza qoldiring</h2>
                    <p className="text-zinc-400 text-sm font-medium">30 daqiqa ichida aloqaga chiqamiz.</p>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                       <input 
                         required 
                         type="text" 
                         placeholder="Ismingiz" 
                         className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:border-black/10 transition-all"
                       />
                       <input 
                         required 
                         type="tel" 
                         placeholder="Telefon raqamingiz" 
                         className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:border-black/10 transition-all"
                       />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Yuborilmoqda...' : 'Ariza yuborish'}
                    </button>
                 </form>
              </section>

              {/* Trust Sub-text */}
              <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-200">
                O'zbekiston bo'ylab professional kiyim ta'minoti.
              </p>

            </motion.div>
          ) : (
            <motion.div 
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center text-center space-y-8"
            >
               <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={1.5} />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-display uppercase tracking-tight">Qabul qilindi!</h2>
                  <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                    Tez orada menejerimiz bog'lanadi.
                  </p>
               </div>
               <button
                  onClick={() => setSubmitted(false)}
                  className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] underline underline-offset-8"
               >
                  Yangi ariza
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


    </div>
  );
}

function BenefitItem({ icon, label, sub }: { icon: React.ReactNode, label: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-4 bg-zinc-50 rounded-3xl border border-zinc-100">
       <div className="text-zinc-300">
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-tight text-black leading-none">{label}</p>
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mt-1">{sub}</p>
       </div>
    </div>
  );
}

function StatItem({ count, label }: { count: string, label: string }) {
  return (
    <div className="text-center">
       <p className="text-xl font-display text-black leading-none mb-1">{count}</p>
       <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{label}</p>
    </div>
  );
}
