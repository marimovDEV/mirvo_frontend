import React from 'react';
import { CATEGORIES, SPORTS } from '@/src/constants';
import { MarketHeader, MarketBottomNav } from '@/src/components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Grid, User, Venus, Dumbbell, Watch, ShoppingBag, Package, Zap, ArrowRight, Target } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sportEmojis: Record<string, string> = {
    boxing: '🥊',
    mma: '🥋',
    football: '⚽',
    basketball: '🏀',
    running: '🏃',
    hockey: '🏒'
  };

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="pt-24 md:pt-40 px-6 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
                <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.4em]">Curated Disciplines</p>
                <h1 className="text-6xl md:text-[8vw] font-display uppercase tracking-tighter leading-none">
                    Discovery
                </h1>
            </div>
            <p className="max-w-xs font-serif italic text-on-surface-variant/60 text-lg md:text-xl leading-relaxed">
                Exploring the boundaries of physical excellence through professional gear.
            </p>
        </div>

        {/* 🏆 Sports Discovery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-20">
          {SPORTS.map((sport, idx) => {
            return (
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div 
                  onClick={() => navigate(`/sport/${sport.id}`)}
                  className="group relative flex flex-col aspect-video bg-zinc-50 rounded-[2.5rem] overflow-hidden border border-black/5 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700"
                >
                  <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 text-3xl">
                            {sportEmojis[sport.id]}
                        </div>
                        <div className="text-[10px] font-bold text-black/20 group-hover:text-black/40 transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
                             Professional Hub <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-none">
                            {sport.name}
                        </h3>
                        <p className="text-xs font-serif italic text-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-sm">
                            {sport.description}
                        </p>
                    </div>
                  </div>
                  
                  {/* Visual Accent */}
                  <div 
                    className="absolute bottom-0 right-0 w-1/2 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                    style={{ backgroundColor: sport.color }}
                  />
                  
                  <div className="absolute top-0 right-0 w-1/3 h-full opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700">
                    <Target className="w-full h-full rotate-12 scale-150" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Secondary Categories (General) */}
        <div className="space-y-10">
             <div className="flex items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">General Collections</p>
                <div className="h-px flex-1 bg-black/5" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => (
                    <Link 
                        key={cat.id}
                        to={`/?category=${cat.id}`}
                        className="p-8 rounded-[2rem] bg-white border border-black/5 hover:border-black/20 transition-all text-center space-y-4 group"
                    >
                        <h4 className="font-display text-xl uppercase tracking-widest group-hover:translate-y-[-2px] transition-transform">{cat.name}</h4>
                        <div className="w-8 h-px bg-black/10 mx-auto" />
                    </Link>
                ))}
             </div>
        </div>
      </main>
    </div>
  );
}
