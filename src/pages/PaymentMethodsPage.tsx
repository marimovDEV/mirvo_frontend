import React, { useState, useEffect } from 'react';
import { MarketHeader } from '../components/Navigation';
import { motion } from 'motion/react';
import { CreditCard, ArrowLeft, Plus, Smartphone, Wallet, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cardsApi } from '../lib/api';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadCards = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await cardsApi.getAll();
      setCards(res || []);
    } catch (err) {
      console.error('Cards load error:', err);
      setError(true);
      // Fallback
      setCards([
        { id: 1, type: 'Visa', number: '**** 4822', expiry: '12/26', color: 'bg-zinc-900' },
        { id: 2, type: 'Humo', number: '**** 1105', expiry: '05/25', color: 'bg-zinc-100 text-black' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const deleteCard = async (id: any) => {
    try {
      await cardsApi.delete(id);
      setCards(cards.filter(c => c.id !== id));
    } catch (err) {
      setCards(cards.filter(c => c.id !== id));
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
              <h1 className="text-3xl font-display uppercase tracking-tight">Kartalarim</h1>
           </div>
           <div className="flex gap-2">
             {error && (
               <button onClick={loadCards} className="p-3 text-zinc-400">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
               </button>
             )}
             <button className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 active:scale-95 transition-all">
                <Plus size={20} />
             </button>
           </div>
        </div>

        {loading ? (
           <div className="space-y-4">
              {[1,2].map(i => <div key={i} className="h-48 bg-zinc-50 rounded-[2.5rem] animate-pulse" />)}
           </div>
        ) : (
          <div className="space-y-4">
             {error && (
               <div className="p-4 bg-yellow-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-yellow-700 text-center">
                 Offline Mode: Demo ma'lumotlar
               </div>
             )}
             {cards.map((card) => (
               <motion.div 
                 key={card.id}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className={`p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-zinc-500/5 border border-zinc-100 group ${card.color}`}
               >
                  <div className="relative z-10 space-y-10">
                     <div className="flex items-center justify-between">
                        <CreditCard size={24} className={card.color.includes('text-black') ? 'text-black' : 'text-white'} />
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{card.type}</span>
                           <button onClick={() => deleteCard(card.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={16} className={card.color.includes('text-black') ? 'text-black' : 'text-white'} />
                           </button>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xl font-mono tracking-[0.3em] font-bold">{card.number}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{card.expiry}</p>
                     </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
               </motion.div>
             ))}
          </div>
        )}

        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-4">Tizimlar</h3>
           <div className="grid grid-cols-2 gap-4">
              <PaymentSystem icon={<Smartphone />} label="Click" />
              <PaymentSystem icon={<Wallet />} label="Payme" />
           </div>
        </div>

        <div className="flex items-center gap-3 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 text-zinc-300">
           <ShieldCheck size={20} />
           <p className="text-[10px] font-black uppercase tracking-widest">Xavfsiz to'lov kafolati</p>
        </div>
      </main>
    </div>
  );
}

function PaymentSystem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white hover:shadow-xl hover:shadow-zinc-500/5 transition-all cursor-pointer">
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-300">
          {icon}
       </div>
       <span className="font-black text-xs uppercase tracking-tight text-black">{label}</span>
    </div>
  );
}
