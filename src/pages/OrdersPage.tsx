import React, { useState, useEffect } from 'react';
import { MarketHeader } from '../components/Navigation';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Package, ChevronRight, Clock, CheckCircle, 
  XCircle, Truck, RefreshCw, ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../lib/api';
import { cn } from '@/src/lib/utils';

export default function OrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await ordersApi.getMyOrders();
      setOrders(res || []);
    } catch (err) {
      console.error('Order load error:', err);
      setError(true);
      // Fallback to mock data for demonstration if server fails
      setOrders([
        { 
          id: 'mock1', 
          orderNumber: '1842', 
          total: 485000, 
          status: 'on_way', 
          createdAt: new Date().toISOString(),
          items: [{ product: { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' } }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'delivered': return { icon: <CheckCircle size={14} />, label: 'Yetkazildi', color: 'text-green-500 bg-green-50' };
      case 'on_way': return { icon: <Truck size={14} />, label: 'Yo\'lda', color: 'text-blue-500 bg-blue-50' };
      case 'cancelled': return { icon: <XCircle size={14} />, label: 'Bekor qilindi', color: 'text-red-500 bg-red-50' };
      default: return { icon: <Clock size={14} />, label: 'Kutilmoqda', color: 'text-yellow-500 bg-yellow-50' };
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
              <h1 className="text-3xl font-display uppercase tracking-tight">Buyurtmalarim</h1>
           </div>
           {error && (
             <button onClick={loadOrders} className="p-3 text-zinc-400 hover:text-black transition-colors">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
           )}
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="h-32 bg-zinc-50 rounded-[2.5rem] animate-pulse" />
             ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center space-y-6">
             <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200">
                <ShoppingBag size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-display uppercase">Sizda hali buyurtmalar yo'q</h3>
                <p className="text-zinc-400 text-sm font-medium">Xaridni boshlash vaqti keldi!</p>
             </div>
             <button 
               onClick={() => navigate('/')}
               className="bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
             >
                Xarid qilish
             </button>
          </div>
        ) : (
          <div className="space-y-4">
             {error && (
               <div className="p-4 bg-yellow-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-yellow-700 text-center">
                 Serverda xatolik, demo ma'lumotlar ko'rsatilmoqda
               </div>
             )}
             {orders.map((order) => {
               const status = getStatusInfo(order.status);
               return (
                 <motion.div 
                   key={order.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-6 hover:bg-white hover:shadow-2xl hover:shadow-zinc-500/5 transition-all group cursor-pointer"
                 >
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">#{order.orderNumber}</p>
                          <p className="font-display text-lg">{(order.total || 0).toLocaleString()} so'm</p>
                       </div>
                       <div className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest", status.color)}>
                          {status.icon} {status.label}
                       </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                       {(order.items || []).map((item: any, idx: number) => (
                         <div key={idx} className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-zinc-100 flex-shrink-0">
                            {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" alt="" />}
                         </div>
                       ))}
                       {order.items?.length > 4 && (
                         <div className="w-12 h-12 bg-white rounded-xl border border-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400">
                            +{order.items.length - 4}
                         </div>
                       )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-3">
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">
                              {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                           </p>
                           {order.status === 'delivered' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); alert("Qaytarish so'rovi yuborildi!"); }}
                                className="px-3 py-1 bg-white border border-zinc-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                              >
                                 Qaytarish
                              </button>
                           )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                 </motion.div>
               );
             })}
          </div>
        )}
      </main>
    </div>
  );
}
