import React, { useState, useEffect } from 'react';
import { MarketHeader } from '../components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, ArrowLeft, Copy, Check, Gift, Share2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { promoApi } from '../lib/api';

export default function PromocodesPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPromos = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await promoApi.getAll();
      setPromos(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Promo load error:', err);
      setError(true);
      // Fallback
      setPromos([
        { code: 'MIRVO2026', value: 20, type: 'percentage', description: 'Yangi yil chegirmasi', expiresAt: '2026-12-31' },
        { code: 'START10', value: 10000, type: 'fixed', description: 'Birinchi xarid uchun', expiresAt: null }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setShowToast(true);
    setTimeout(() => {
      setCopied(null);
      setShowToast(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MIRVO Promokod',
          text: 'MIRVO do\'konida xarid qiling va START10 promokodi bilan chegirmaga ega bo\'ling!',
          url: window.location.origin
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Share error:', err);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pb-40">
      <MarketHeader />
      
      <main className="max-w-xl mx-auto px-6 pt-24 space-y-10">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-3 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-colors">
                 <ArrowLeft size={18} />
              </button>
              <h1 className="text-3xl font-display uppercase tracking-tight">Promokodlar</h1>
           </div>
           {error && (
             <button onClick={loadPromos} className="p-3 text-zinc-400">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
           )}
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1,2].map(i => <div key={i} className="h-48 bg-zinc-50 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
             {error && (
               <div className="p-4 bg-yellow-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-yellow-700 text-center">
                 Offline Mode: Real promokodlarni yuklashda xatolik
               </div>
             )}
             {promos.map((p) => (
               <motion.div 
                 key={p.code}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] relative overflow-hidden group hover:bg-white hover:shadow-2xl hover:shadow-zinc-500/5 transition-all"
               >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-black/5 rounded-full blur-2xl group-hover:bg-black/10 transition-all" />
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                           <Ticket size={20} className="text-black" />
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-display text-black">
                              {p.type === 'percentage' ? `${p.value}%` : `${(p.value || 0).toLocaleString()} so'm`}
                           </p>
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Chegirma</p>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-black text-sm uppercase tracking-tight">{p.description || p.label || 'Chegirma'}</h4>
                        <p className="text-zinc-400 text-xs font-medium">
                          Amal qilish muddati: {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('uz-UZ') : 'Doimiy'}
                        </p>
                     </div>
                     <button 
                       onClick={() => handleCopy(p.code)}
                       className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 group-hover:border-black/10 transition-all active:scale-95"
                     >
                        <span className="font-mono font-bold text-sm tracking-widest">{p.code}</span>
                        {copied === p.code ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-zinc-300" />}
                     </button>
                  </div>
               </motion.div>
             ))}
          </div>
        )}

        <div className="p-8 bg-black text-white rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden group">
           <div className="absolute right-0 top-0 opacity-10">
              <Gift size={100} />
           </div>
           <div className="relative z-10 flex-1 space-y-2">
              <h4 className="font-black text-sm uppercase tracking-tight">Ko'proq chegirma kerakmi?</h4>
              <p className="text-white/40 text-xs font-medium leading-relaxed">Do'stlaringizni taklif qiling va har biriga 10,000 so'mlik promokod bering.</p>
           </div>
           <button 
             onClick={handleShare}
             className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative z-10 hover:bg-white/20 transition-all active:scale-95"
           >
              <Share2 className="w-5 h-5" />
           </button>
        </div>
      </main>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3"
          >
             <Check size={14} className="text-green-500" />
             Promokod nusxalandi
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
