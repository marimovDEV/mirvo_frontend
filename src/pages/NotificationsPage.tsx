import React from 'react';
import { MarketHeader } from '../components/Navigation';
import { motion } from 'motion/react';
import { Bell, ArrowLeft, Package, Star, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const notes = [
    { id: 1, title: 'Buyurtmangiz yo\'lda', sub: '#1842 raqamli buyurtma kuryerga topshirildi.', time: '2 soat oldin', icon: <TruckIcon />, color: 'bg-blue-50 text-blue-500' },
    { id: 2, title: 'Yangi bonus!', sub: 'Ro\'yxatdan o\'tganingiz uchun +10,000 bonus!', time: '1 kun oldin', icon: <Star />, color: 'bg-yellow-50 text-yellow-500' },
    { id: 3, title: 'Sezon yakuni', sub: 'Barcha kiyimlarga -50% gacha chegirma!', time: '2 kun oldin', icon: <Zap />, color: 'bg-purple-50 text-purple-500' }
  ];

  return (
    <div className="bg-white min-h-screen pb-40">
      <MarketHeader />
      
      <main className="max-w-xl mx-auto px-6 pt-24 space-y-10">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-3 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-colors">
              <ArrowLeft size={18} />
           </button>
           <h1 className="text-3xl font-display uppercase tracking-tight">Bildirishnomalar</h1>
        </div>

        <div className="space-y-4">
           {notes.map((n) => (
             <motion.div 
               key={n.id}
               className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex items-start gap-5 hover:bg-white hover:shadow-2xl hover:shadow-zinc-500/5 transition-all group cursor-pointer"
             >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                   {n.icon}
                </div>
                <div className="flex-1 space-y-1">
                   <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase tracking-tight">{n.title}</h4>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">{n.time}</span>
                   </div>
                   <p className="text-zinc-400 text-xs font-medium leading-relaxed">{n.sub}</p>
                </div>
                <div className="pt-2">
                   <ChevronRight size={14} className="text-zinc-200 group-hover:text-black transition-colors" />
                </div>
             </motion.div>
           ))}
        </div>
      </main>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
