import React, { useState, useEffect } from 'react';
import { MarketHeader } from '../components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Plus, Trash2, Edit2, 
  ArrowLeft, CheckCircle2, Home, Building2, Map,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addressesApi } from '../lib/api';
import { cn } from '@/src/lib/utils';

export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState(false);

  const loadAddresses = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await addressesApi.getAll();
      setAddresses(res || []);
    } catch (err) {
      console.error('Addresses load error:', err);
      setError(true);
      // Fallback
      setAddresses([
        { id: '1', title: 'Uy', address: 'Toshkent sh., Yunusobod tumani, 4-kvartal, 12-uy', isDefault: true, type: 'home' },
        { id: '2', title: 'Ish', address: 'Toshkent sh., Shayxontohur tumani, Navoiy ko\'chasi, 7-uy', isDefault: false, type: 'work' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const deleteAddress = async (id: string) => {
    try {
      await addressesApi.delete(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      // If server fails, just update UI for demo
      setAddresses(addresses.filter(a => a.id !== id));
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
              <h1 className="text-3xl font-display uppercase tracking-tight">Manzillarim</h1>
           </div>
           <div className="flex gap-2">
             {error && (
               <button onClick={loadAddresses} className="p-3 text-zinc-400">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
               </button>
             )}
             <button 
               onClick={() => setShowAdd(true)}
               className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 active:scale-95 transition-all"
             >
                <Plus size={20} />
             </button>
           </div>
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1,2].map(i => <div key={i} className="h-32 bg-zinc-50 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
             {error && (
               <div className="p-4 bg-yellow-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-yellow-700 text-center">
                 Offline Mode: Demo ma'lumotlar
               </div>
             )}
             {addresses.map((addr) => (
               <motion.div 
                 key={addr.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={cn(
                   "p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-4 transition-all relative overflow-hidden",
                   addr.isDefault && "border-black/5 bg-white shadow-xl shadow-zinc-500/5"
                 )}
               >
                  <div className="flex items-start justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-300">
                           {addr.type === 'home' ? <Home size={18} /> : <Building2 size={18} />}
                        </div>
                        <div>
                           <h4 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                             {addr.title}
                             {addr.isDefault && <CheckCircle2 size={12} className="text-green-500" />}
                           </h4>
                           <p className="text-zinc-400 text-xs font-medium leading-relaxed max-w-[200px]">
                             {addr.address}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="p-3 bg-white rounded-xl shadow-sm text-zinc-300 hover:text-black transition-colors">
                           <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteAddress(addr.id)}
                          className="p-3 bg-white rounded-xl shadow-sm text-zinc-300 hover:text-red-500 transition-colors"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </div>
               </motion.div>
             ))}

             {addresses.length === 0 && !loading && (
               <div className="py-20 text-center space-y-4">
                  <Map className="w-12 h-12 text-zinc-100 mx-auto" />
                  <p className="text-zinc-400 font-medium">Hozircha manzillar yo'q</p>
               </div>
             )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowAdd(false)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               className="relative w-full bg-white rounded-t-[3rem] p-10 space-y-8"
             >
                <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto" />
                <div className="space-y-2">
                   <h2 className="text-3xl font-display uppercase tracking-tight">Yangi manzil</h2>
                   <p className="text-zinc-400 text-sm font-medium">Yetkazib berish uchun manzilni kiriting.</p>
                </div>
                <div className="space-y-4">
                   <input placeholder="Sarlavha (masalan: Uy)" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-5 text-sm font-bold" />
                   <textarea placeholder="To'liq manzil" className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-5 text-sm font-bold h-32" />
                </div>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                   Saqlash
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
