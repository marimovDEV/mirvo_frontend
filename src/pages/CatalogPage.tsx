import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard } from '@/src/components/MarketplaceComponents';
import { PRODUCTS, CATEGORIES, SPORTS } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Filter, X, ChevronDown, SlidersHorizontal, LayoutGrid, List, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function CatalogPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'all';
  const initialSport = searchParams.get('sport') || 'all';
  const initialFilter = searchParams.get('filter') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSport, setActiveSport] = useState(initialSport);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.subCategory === activeCategory);
    }
    if (activeSport !== 'all') {
      result = result.filter(p => p.sport === activeSport);
    }
    if (initialFilter === 'sale') {
      // For now, let's say some products are on sale. 
      // In real app, we would have a field 'isSale' or 'discountPrice'
      result = result.slice(0, 10); // Mocking sale items
    }

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, activeSport, initialFilter, sortBy]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') newParams.delete(key);
    else newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto pb-32">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
                  {initialFilter === 'sale' ? 'Flash Offers' : 'The Collection'}
                </p>
                <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter leading-none">
                  {initialFilter === 'sale' ? 'Chegirmalar' : t(`categories.${activeCategory}`)}
                </h1>
            </div>
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setShowFilters(!showFilters)}
                 className={cn(
                   "flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                   showFilters ? "bg-black text-white" : "bg-zinc-50 text-black border border-zinc-100"
                 )}
               >
                 <SlidersHorizontal className="w-4 h-4" /> Filter
               </button>
               <div className="hidden md:flex bg-zinc-50 border border-zinc-100 rounded-2xl p-1">
                  <button onClick={() => setViewMode('grid')} className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-black" : "text-zinc-300")}>
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? "bg-white shadow-sm text-black" : "text-zinc-300")}>
                    <List size={16} />
                  </button>
               </div>
            </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12 border-b border-zinc-100"
            >
              <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                 <FilterGroup title="Kategoriyalar">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => { setActiveCategory(cat.id); updateFilters('category', cat.id); }}
                        className={cn("text-xs font-bold uppercase tracking-wider block text-left transition-colors", activeCategory === cat.id ? "text-black" : "text-zinc-300 hover:text-black")}
                      >
                        {t(`categories.${cat.id}`)}
                      </button>
                    ))}
                 </FilterGroup>
                 <FilterGroup title="Sport yo'nalishi">
                    <button 
                      onClick={() => { setActiveSport('all'); updateFilters('sport', 'all'); }}
                      className={cn("text-xs font-bold uppercase tracking-wider block text-left transition-colors", activeSport === 'all' ? "text-black" : "text-zinc-300 hover:text-black")}
                    >
                      Hammasi
                    </button>
                    {SPORTS.map(sport => (
                      <button 
                        key={sport.id} 
                        onClick={() => { setActiveSport(sport.id); updateFilters('sport', sport.id); }}
                        className={cn("text-xs font-bold uppercase tracking-wider block text-left transition-colors", activeSport === sport.id ? "text-black" : "text-zinc-300 hover:text-black")}
                      >
                        {t(`sports.${sport.id}`)}
                      </button>
                    ))}
                 </FilterGroup>
                 <FilterGroup title="Saralash">
                    {[
                      { id: 'newest', name: 'Yangi kelganlar' },
                      { id: 'price-low', name: 'Arzonroq' },
                      { id: 'price-high', name: 'Qimmatroq' },
                      { id: 'popular', name: 'Ommabop' }
                    ].map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSortBy(s.id)}
                        className={cn("text-xs font-bold uppercase tracking-wider block text-left transition-colors", sortBy === s.id ? "text-black" : "text-zinc-300 hover:text-black")}
                      >
                        {s.name}
                      </button>
                    ))}
                 </FilterGroup>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className={cn(
          "grid gap-x-4 gap-y-16 md:gap-x-12 md:gap-y-24",
          viewMode === 'grid' ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center space-y-6">
             <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <LayoutGrid size={32} className="text-zinc-200" />
             </div>
             <h2 className="text-xl font-bold uppercase tracking-widest text-black">Mahsulotlar topilmadi</h2>
             <p className="text-zinc-400 max-w-xs mx-auto">Tanlangan parametrlar bo'yicha hech qanday mahsulot mavjud emas.</p>
             <button 
               onClick={() => { setActiveCategory('all'); setActiveSport('all'); setSearchParams({}); }}
               className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2"
             >
               Filtrlarni tozalash
             </button>
          </div>
        )}
      </main>


    </div>
  );
}

function FilterGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{title}</h4>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
