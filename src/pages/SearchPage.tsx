import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, SPORTS, PRODUCTS } from '@/src/constants';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard } from '@/src/components/MarketplaceComponents';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Search, X, ArrowLeft, TrendingUp, History, Filter, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Oversize Hoodie', 'Boxing Gloves', 'Running Shoes']);
  
  const filteredProducts = useMemo(() => {
    if (query.trim().length < 1) return [];
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.sport?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 12);
  }, [query]);

  const trendingItems = [
    { name: 'Boxing Gear', sub: 'Top seller', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed' },
    { name: 'MMA Shorts', sub: 'New drop', image: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4' },
    { name: 'Oversize T-Shirts', sub: 'Trending', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c' },
    { name: 'Performance', sub: 'Best gear', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571' }
  ];

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-20 px-6 max-w-screen-md mx-auto pb-32">
        {/* Sticky Search Bar - Redesigned */}
        <div className="sticky top-14 md:top-16 bg-white z-40 py-4 -mx-6 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                autoFocus
                placeholder={t('common.search_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-zinc-100 h-12 pl-11 pr-11 rounded-full text-[13px] font-bold placeholder-zinc-400 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              )}
            </div>
            <button className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 mt-4"
            >
              {/* Recent Searches - Chips */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">{t('search.recent_searches')}</h3>
                  <button onClick={() => setRecentSearches([])} className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest">{t('search.clear_history')}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 rounded-full group cursor-pointer hover:bg-zinc-200 transition-colors">
                      <span onClick={() => setQuery(s)} className="text-[11px] font-bold uppercase tracking-tight">{s}</span>
                      <X className="w-3 h-3 text-zinc-400 cursor-pointer" />
                    </div>
                  ))}
                  {recentSearches.length === 0 && <p className="text-xs text-zinc-300 italic font-medium">{t('search.empty_history')}</p>}
                </div>
              </section>

              {/* Trending - Card Style */}
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-5">{t('search.trending_collections')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {trendingItems.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setQuery(item.name)}
                      className="relative aspect-video rounded-2xl overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{item.sub}</span>
                        <h4 className="text-sm font-black uppercase tracking-tight text-white">{item.name}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Explore Disciplines - Premium Cards */}
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-5">{t('search.by_discipline')}</h3>
                <div className="space-y-3">
                  {SPORTS.slice(0, 4).map((sport) => (
                    <button 
                      key={sport.id}
                      onClick={() => navigate(`/sport/${sport.id}`)}
                      className="w-full relative h-24 rounded-2xl overflow-hidden group flex items-center px-8"
                    >
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
                      <img src={sport.image || `https://images.unsplash.com/photo-1549719386-74dfcbf7dbed`} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="relative z-20 flex items-center justify-between w-full">
                        <h4 className="font-display text-2xl text-white uppercase tracking-wider">{t(`sports.${sport.id}`)}</h4>
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {t('search.results_count', { count: filteredProducts.length })}
                </h3>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-black hover:opacity-60 transition-opacity">
                  <Filter className="w-3.5 h-3.5" /> {t('home.filter')}
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-12">
                  {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center space-y-6">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-zinc-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-black">{t('search.no_results')}</p>
                    <p className="text-xs text-zinc-400">{t('search.no_results_sub', { query })}</p>
                  </div>
                  <button 
                    onClick={() => setQuery('')}
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-primary border-b-2 border-primary pb-1"
                  >
                    {t('search.start_over')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>


    </div>
  );
}
