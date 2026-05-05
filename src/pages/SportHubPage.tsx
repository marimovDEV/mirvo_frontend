import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SPORTS, PRODUCTS, SPORT_CATEGORIES } from '@/src/constants';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { ProductCard } from '@/src/components/MarketplaceComponents';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Target, Award, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SportHubPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();

  const sport = useMemo(() => SPORTS.find(s => s.id === sportId), [sportId]);
  const categories = useMemo(() => SPORT_CATEGORIES.filter(c => c.sportId === sportId), [sportId]);
  const products = useMemo(() => PRODUCTS.filter(p => p.sport === sportId), [sportId]);

  if (!sport) return null;

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-20 md:pt-32">
        {/* Sub-header Navigation */}
        <div className="px-6 py-4 border-b border-primary/10 flex items-center gap-4 bg-white/90 backdrop-blur-xl sticky top-14 md:top-20 z-40 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-primary/10 mx-2" />
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50">Professional {sport.name} Hub</h1>
        </div>

        {/* Hero Section */}
        <section className="relative px-6 py-12 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{sportId === 'boxing' ? '🥊' : sportId === 'football' ? '⚽' : sportId === 'basketball' ? '🏀' : sportId === 'mma' ? '🥋' : '🏃'}</span>
                            <div className="px-3 py-1 rounded-full bg-zinc-100 text-[8px] font-black uppercase tracking-widest">A-Grade Selection</div>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none">
                            {sport.name} <br />
                            <span className="italic font-serif text-black/30">Excellence</span>
                        </h2>
                        <p className="text-lg md:text-2xl font-serif italic text-on-surface-variant/60 max-w-lg leading-relaxed">
                            {sport.description}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-primary-light border border-primary/10 space-y-2">
                            <ShieldCheck className="w-6 h-6 text-primary/50" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Lab-Tested Gear</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-primary-light border border-primary/10 space-y-2">
                            <Zap className="w-6 h-6 text-primary/50" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Performance</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-xl">
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white"
                    >
                        <img 
                            src={`https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800`} 
                            className="w-full h-full object-cover grayscale brightness-75" 
                            alt=""
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-10 left-10">
                            <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
                            <p className="text-white font-display text-4xl uppercase tracking-widest">Elite <br /> Tier</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="px-6 py-12 max-w-7xl mx-auto space-y-16 pb-40">
            {/* Subcategory Chips */}
            <div className="flex flex-col items-center space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar justify-center w-full">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className="px-8 py-4 rounded-full bg-primary-light border border-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/25"
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                <div className="w-px h-12 bg-black/10" />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <Target className="w-12 h-12 text-black/10 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/30">The collection is being curated</p>
                </div>
            )}
        </section>
      </main>
    </div>
  );
}
