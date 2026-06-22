import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, SPORTS } from '@/src/constants';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard, WholesaleBanner } from '@/src/components/MarketplaceComponents';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Shield, RotateCcw, ChevronRight, ChevronLeft, Search, Zap, Clock, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

import { productsApi, getMediaUrl } from '@/src/lib/api';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [activeSportFilter, setActiveSportFilter] = useState(searchParams.get('sport') || 'all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600 * 5 + 45 * 60 + 12); // Flash deal timer

  const slides = [
    {
      id: 1,
      title: t('home.hero_slide_1_title'),
      sub: t('home.hero_slide_1_sub'),
      cta: t('home.view_more'),
      img: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=1200",
      color: "bg-zinc-900"
    },
    {
      id: 2,
      title: t('home.hero_slide_2_title'),
      sub: t('home.hero_slide_2_sub'),
      cta: t('home.view_more'),
      img: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=1200",
      color: "bg-blue-900"
    },
    {
      id: 3,
      title: t('home.hero_slide_3_title'),
      sub: t('home.hero_slide_3_sub'),
      cta: t('home.details'),
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
      color: "bg-zinc-800"
    }
  ];

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
    const countdown = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    
    // Fetch products — fallback to static constants if API is unavailable
    productsApi.getAll({ limit: 100 }).then(res => {
      const data = res?.data || (Array.isArray(res) ? res : []);
      setProducts(data.length > 0 ? data : PRODUCTS);
    }).catch(() => {
      setProducts(PRODUCTS);
    }).finally(() => setLoading(false));

    return () => { clearInterval(timer); clearInterval(countdown); };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'all' && activeCategory !== 'sport') {
      result = result.filter(p => p.subCategory === activeCategory);
    }
    if (activeCategory === 'sport') {
      if (activeSportFilter !== 'all') result = result.filter(p => p.sport === activeSportFilter);
    }
    return result;
  }, [activeCategory, activeSportFilter, products]);

  const bestsellers = useMemo(() => {
    const marked = products.filter(p => p.isBestseller);
    if (marked.length > 0) return marked.slice(0, 4);
    // Fallback: show top-rated or top-selling products
    return [...products].sort((a, b) => (b.salesCount || b.rating || 0) - (a.salesCount || a.rating || 0)).slice(0, 4);
  }, [products]);

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />

      <main className="pt-14 md:pt-16 pb-24">
        
        {/* 1. Promo Slider (Hero Replacement) */}
        <section className="relative h-[480px] md:h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={slides[currentSlide].img} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-24">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6 max-w-xl"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">MIRVO Exclusive</p>
                  <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter leading-[0.9] text-white">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-sm md:text-lg text-white/80 font-medium font-serif italic">{slides[currentSlide].sub}</p>
                  <button 
                    onClick={() => navigate('/catalog')}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {slides[currentSlide].cta}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slider Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
             {slides.map((_, i) => (
               <button key={i} onClick={() => setCurrentSlide(i)} className={cn("h-1 transition-all rounded-full", currentSlide === i ? "w-8 bg-white" : "w-2 bg-white/20")} />
             ))}
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 active:scale-90 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 active:scale-90 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>

        {/* 2. Sticky Search Bar + Value Text */}
        <section className="sticky top-14 md:top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100 p-4">
           <div className="max-w-screen-xl mx-auto space-y-3">
             <div 
               onClick={() => navigate('/search')}
               className="bg-zinc-50 border border-zinc-100 rounded-2xl px-5 h-12 flex items-center gap-3 cursor-pointer group hover:bg-zinc-100 transition-all"
             >
                <Search className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black/40">{t('common.search_placeholder')}</span>
             </div>
             
             {/* Search value helpers - Mobile only */}
             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar md:hidden">
                <button onClick={() => navigate('/deals')} className="flex items-center gap-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-primary">
                  <Zap className="w-3 h-3 fill-primary" /> 🔥 {t('home.flash_sale')}
                </button>
                <button onClick={() => navigate('/catalog')} className="flex items-center gap-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  <Star className="w-3 h-3" /> ⚡ {t('home.popular')}
                </button>
             </div>
           </div>
        </section>

        {/* 3. Quick Category Chips */}
        <section className="py-6 px-4 md:px-8">
           <div className="max-w-screen-xl mx-auto flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex-shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCategory === cat.id 
                      ? "bg-black text-white shadow-xl shadow-black/20 scale-105" 
                      : "bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-black/20 hover:text-black hover:-translate-y-0.5 hover:shadow-md"
                  )}
                >
                  {t(`categories.${cat.id}`)}
                </button>
              ))}
           </div>
        </section>

        {/* 4. Dynamic Sport Collections */}
        <AnimatePresence>
          {activeCategory === 'sport' && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="py-10 bg-zinc-50 overflow-hidden px-4 md:px-8"
            >
              <div className="max-w-screen-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-3xl uppercase tracking-tight text-black">{t('home.all_sports')}</h2>
                  <div className="flex-1 h-px bg-black/5 ml-8" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {SPORTS.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => setActiveSportFilter(sport.id)}
                      className={cn(
                        "group relative aspect-[4/5] overflow-hidden rounded-[2rem] transition-all",
                        activeSportFilter === sport.id ? "ring-4 ring-black ring-offset-2" : "border border-black/5"
                      )}
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                      <img src={`https://images.unsplash.com/photo-${
                          sport.id === 'boxing' ? '1549719386-74dfcbf7dbed' :
                          sport.id === 'mma' ? '1564415315949-7a0c4c73aab4' :
                          sport.id === 'football' ? '1431324155629-1a6deb1dec8d' :
                          sport.id === 'basketball' ? '1546519638-68e109498ffc' :
                          '1571008887538-b36bb32f4571'
                        }?auto=format&fit=crop&q=80&w=400`}
                        alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute bottom-6 left-6 z-20">
                        <h3 className="font-display text-xl text-white uppercase">{t(`sports.${sport.id}`)}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 5. Flash Deals Section (Moved Up) */}
        <section className="py-16 bg-black text-white overflow-hidden relative">
           <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
              <Zap className="w-full h-full text-white/10" />
           </div>
           <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-6 text-center md:text-left">
                    <div className={cn("w-fit px-4 py-2 rounded-full border flex items-center gap-3 mx-auto md:mx-0 transition-colors", timeLeft < 3600 ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-white/10 border-white/10 text-white")}>
                       <Clock className={cn("w-4 h-4", timeLeft < 3600 ? "text-red-400" : "text-white")} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{formatTime(timeLeft)}</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none">
                       {t('home.flash_deals_title').split(' ').map((word, i) => i === 1 ? <React.Fragment key={i}><br/> {word}</React.Fragment> : <span key={i}>{word} </span>)}
                    </h2>
                    <p className="text-emerald-400 font-serif italic text-lg md:text-xl max-w-sm">
                       {t('home.flash_deals_sub')}
                    </p>
                     <button 
                        onClick={() => navigate('/deals')}
                        className="bg-white text-black px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-white/20 hover:scale-105 active:scale-95 transition-all"
                     >
                        {t('common.buy')}
                     </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
                    {products.slice(4, 6).map(p => (
                      <div key={p.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:bg-white/10 transition-all">
                         <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={getMediaUrl(p.image)} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div className="space-y-2">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{p.brand}</p>
                            <h4 className="font-bold text-sm uppercase">{p.name}</h4>
                            <div className="flex items-baseline gap-3">
                               <span className="text-lg font-black">{Math.round(Number(p.price)).toLocaleString()} {t('home.currency')}</span>
                               <span className="text-[10px] text-white/30 line-through">{Math.round(Number(p.price) * 1.5).toLocaleString()} {t('home.currency')}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 6. Bestsellers Section (Moved Down) */}
        <section className="py-16 md:py-24 px-4 md:px-8">
           <div className="max-w-screen-xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-black fill-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{t('home.popular')}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter text-black">{t('home.bestsellers_title')}</h2>
                </div>
                <button 
                  onClick={() => navigate('/catalog')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group hover:text-black transition-colors"
                >
                  {t('common.view_all')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
               {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
             </div>
           </div>
        </section>

        {/* 7. New Arrivals Section */}
        <section className="py-24 px-4 md:px-8">
           <div className="max-w-screen-xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{t('home.new')}</span>
                  <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter text-black">{t('home.new_arrivals_title')}</h2>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group hover:text-black transition-colors">
                  {t('home.all_catalog')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
               {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
             </div>
           </div>
        </section>

        {/* 8. B2B Banner Section */}
        <section className="py-12 px-4 md:px-8">
           <div className="max-w-screen-xl mx-auto">
              <WholesaleBanner />
           </div>
        </section>

        {/* 9. Trust Badges Section */}
        <section className="py-12 md:py-20 bg-zinc-50 px-4 md:px-8">
           <div className="max-w-screen-xl mx-auto">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-12">
                 <TrustItem icon={<Truck />} title={t('home.trust_delivery_time')} sub={t('home.trust_delivery_label')} />
                 <TrustItem icon={<Shield />} title={t('home.trust_payment_title')} sub={t('home.trust_payment_label')} />
                 <TrustItem icon={<RotateCcw />} title={t('home.trust_return_title')} sub={t('home.trust_return_label')} />
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-16 pb-12 border-t border-zinc-100 px-6">
           <div className="max-w-screen-xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                 <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                    <h3 className="font-display text-3xl uppercase tracking-tighter text-black">MIRVO</h3>
                    <p className="text-zinc-400 font-medium text-[11px] uppercase tracking-widest max-w-[200px] mx-auto md:mx-0">
                       {t('home.footer_description')}
                    </p>
                    <div className="flex justify-center md:justify-start gap-6 pt-2">
                       {['Instagram', 'Telegram'].map(s => (
                          <a key={s} href="#" className="text-zinc-300 hover:text-black transition-colors">
                            {s === 'Instagram' ? <div className="w-5 h-5 bg-zinc-100 rounded-lg" /> : <div className="w-5 h-5 bg-zinc-100 rounded-lg" />}
                          </a>
                       ))}
                    </div>
                 </div>

                 {/* Desktop Links / Mobile Accordion */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:w-auto">
                    <FooterSection title={t('home.footer_sections_title')}>
                        {[
                          { name: t('common.categories'), path: '/catalog' },
                          { name: t('b2b.home_btn'), path: '/b2b' },
                          { name: t('home.flash_sale'), path: '/deals' }
                        ].map(l => (
                           <li key={l.name}><button onClick={() => navigate(l.path)} className="text-[11px] font-black text-black/40 hover:text-black uppercase tracking-widest">{l.name}</button></li>
                        ))}
                    </FooterSection>
                    <FooterSection title={t('home.footer_help_title')}>
                       {[
                          { name: t('home.footer_help_delivery'), path: '/delivery' },
                          { name: t('home.footer_help_return'), path: '/returns' },
                          { name: t('home.footer_help_contact'), path: '/contact' }
                       ].map(l => (
                          <li key={l.name}><button onClick={() => navigate(l.path)} className="text-[11px] font-black text-black/40 hover:text-black uppercase tracking-widest">{l.name}</button></li>
                        ))}
                    </FooterSection>
                 </div>
              </div>

              <div className="pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-200">© 2026 MIRVO</p>
                 <div className="flex gap-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-200 cursor-pointer">{t('home.footer_privacy')}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-200 cursor-pointer">{t('home.footer_terms')}</p>
                 </div>
              </div>
           </div>
        </footer>

      </main>


    </div>
  );
}

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:cursor-default"
      >
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{title}</h4>
        <ChevronRight className={cn("w-3 h-3 text-zinc-200 md:hidden transition-transform", isOpen && "rotate-90")} />
      </button>
      <ul className={cn("space-y-3 md:block", !isOpen && "hidden")}>
        {children}
      </ul>
    </div>
  );
}

function TrustItem({ icon, title, sub }: { icon: React.ReactNode, title: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 group">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-[2rem] flex items-center justify-center text-black shadow-sm border border-black/5 transition-all duration-500 group-hover:bg-black group-hover:text-white">
        {React.cloneElement(icon as React.ReactElement, { size: 20, strokeWidth: 1.5 })}
      </div>
      <div className="space-y-0.5">
        <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] text-black">{title}</h4>
        <p className="text-[8px] md:text-[10px] text-zinc-400 font-medium uppercase tracking-tight">{sub}</p>
      </div>
    </div>
  );
}
