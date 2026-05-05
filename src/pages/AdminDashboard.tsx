import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import {
  Users, TrendingUp, Package, DollarSign, Box, Eye, Plus,
  Search, Filter, Check, X, Edit2, Trash2, RefreshCw,
  ShoppingBag, Tag, Star, Award, Building2, BarChart3,
  ChevronDown, ChevronLeft, ChevronRight, AlertCircle,
  Truck, CheckCircle, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  Save, ToggleLeft, ToggleRight, Gift, Layout, Image, AlertTriangle, Settings, MoreVertical, Shield, ShieldCheck,
  CreditCard, RotateCcw, Bell, History, Zap
} from 'lucide-react';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
type AdminView =
  | 'dashboard' | 'orders' | 'products' | 'users'
  | 'promos' | 'loyalty' | 'b2b' | 'inventory' | 'content' | 'team' | 'settings' | 'returns' | 'payments';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'on_way', 'delivered', 'cancelled', 'returned'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Yangi', confirmed: 'Tasdiqlandi', processing: 'Qadoqlanmoqda',
  on_way: 'Yuborilgan', delivered: 'Yetkazilgan', cancelled: 'Bekor', returned: 'Qaytarilgan'
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-cyan-100 text-cyan-700',
  processing: 'bg-purple-100 text-purple-700',
  on_way: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-zinc-100 text-zinc-700',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={12} />, confirmed: <CheckCircle size={12} />,
  processing: <RefreshCw size={12} />, on_way: <Truck size={12} />,
  delivered: <Check size={12} />, cancelled: <XCircle size={12} />,
  returned: <RotateCcw size={12} />,
};

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function formatPrice(n: any) {
  const val = Number(n);
  if (isNaN(val)) return "0 so'm";
  return new Intl.NumberFormat('uz-UZ').format(Math.round(val)) + " so'm";
}
function formatDate(d: string) {
  return new Date(d).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest', STATUS_COLORS[status] || 'bg-gray-100 text-gray-600')}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function KPICard({ title, value, delta, trend, icon, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-500/5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
        {delta && (
          <span className={cn('flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg',
            trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 bg-gray-50 rounded-xl animate-pulse mb-1" />
      ) : (
        <div className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{value}</div>
      )}
      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{title}</div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════
function DashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [chartData, setChartData] = useState<any[]>([]);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getRevenueChart(chartPeriod),
    ]).then(([dash, chart]) => {
      setStats((dash as any)?.stats || dash);
      setChartData(Array.isArray(chart) ? chart : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { adminApi.getRevenueChart(chartPeriod).then(c => setChartData(Array.isArray(c) ? c : [])); }, [chartPeriod]);

  const maxRevenue = Math.max(...chartData.map(d => Number(d.revenue || 0)), 1);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Bugungi savdo" value={formatPrice(stats?.todayRevenue || 0)}
          delta={stats?.todayOrders ? `+${stats.todayOrders} order` : undefined}
          trend="up" icon={<TrendingUp size={24} className="text-blue-600" />} loading={loading} />
        <KPICard title="Jami foydalanuvchi" value={stats?.totalUsers?.toLocaleString() || '0'}
          icon={<Users size={24} className="text-purple-600" />} loading={loading} />
        <KPICard title="Yangi buyurtmalar" value={stats?.pendingOrders?.toLocaleString() || '0'}
          icon={<ShoppingBag size={24} className="text-orange-600" />} loading={loading} />
        <KPICard title="Low Stock" value={stats?.lowStockCount?.toLocaleString() || '0'}
          icon={<AlertTriangle size={24} className="text-red-600" />} loading={loading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight">Savdo grafigi</h3>
              <p className="text-xs text-gray-400 font-medium">Daromad o'sish dinamikasi</p>
            </div>
            <div className="flex bg-gray-50 rounded-2xl p-1 gap-1 border border-gray-100">
              {(['daily', 'monthly'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className={cn('px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all',
                    chartPeriod === p ? 'bg-white shadow-lg text-black' : 'text-gray-400 hover:text-black')}>
                  {p === 'daily' ? 'Kunlik' : 'Oylik'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-64 px-2">
            {chartData.map((d, i) => {
              const h = (Number(d.revenue) / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full h-full flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(h, 5)}%` }}
                      className={cn("w-full rounded-t-xl transition-all group-hover:brightness-110", 
                        i === chartData.length - 1 ? "bg-black" : "bg-zinc-100")} />
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatPrice(d.revenue)}
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Info */}
        <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                 <h3 className="text-xl font-black uppercase tracking-tight">Jami Daromad</h3>
                 <p className="text-4xl font-black text-blue-400 tracking-tight">{formatPrice(stats?.totalRevenue || 0)}</p>
              </div>
              <div className="pt-8 border-t border-white/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Delivered</span>
                    <span className="font-display font-bold">{stats?.deliveredOrders || 0}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Pending</span>
                    <span className="font-display font-bold">{stats?.pendingOrders || 0}</span>
                 </div>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 border border-white/5">
                 Hisobotni yuklash
              </button>
           </div>
           <BarChart3 className="absolute right-[-20px] bottom-[-20px] opacity-10" size={180} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ORDERS VIEW
// ═══════════════════════════════════════════
function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getOrders({ status, search }).then((res: any) => {
      setOrders(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-2xl font-black uppercase tracking-tight">Buyurtmalar</h2>
           <p className="text-zinc-400 text-xs font-medium">Barcha savdo va tranzaksiyalar boshqaruvi.</p>
        </div>
        <div className="flex flex-wrap bg-white p-1.5 rounded-[1.5rem] border border-gray-100 gap-1 shadow-sm">
           {['', ...ORDER_STATUSES].map(s => (
             <button key={s} onClick={() => setStatus(s)}
               className={cn("px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", 
                 status === s ? "bg-black text-white shadow-xl shadow-black/10" : "text-gray-400 hover:text-black")}>
               {s === '' ? 'Barchasi' : STATUS_LABELS[s]}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)} 
                placeholder="Buyurtma raqami yoki tel..." 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 rounded-2xl text-xs font-bold transition-all outline-none" />
           </div>
           <button className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-400"><Filter size={18} /></button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['ID', 'Mijoz', 'Status', 'Summa', 'To\'lov', 'Sana', ''].map(h => (
                  <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-4 bg-gray-50 rounded" /></td>)}
                </tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-20 text-gray-400 font-black uppercase text-[10px] tracking-widest">Buyurtmalar topilmadi</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-5 px-8 font-mono font-bold text-gray-900 text-xs">{order.orderNumber}</td>
                  <td className="py-5 px-8">
                    <div className="font-black text-gray-900 text-xs uppercase">{order.recipientName}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{order.phone}</div>
                  </td>
                  <td className="py-5 px-8"><StatusBadge status={order.status} /></td>
                  <td className="py-5 px-8 font-display font-bold text-gray-900">{formatPrice(order.total)}</td>
                  <td className="py-5 px-8">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-50 rounded border border-gray-100 text-gray-500">{order.paymentMethod}</span>
                  </td>
                  <td className="py-5 px-8 text-gray-400 text-[10px] font-bold">{formatDate(order.createdAt)}</td>
                  <td className="py-5 px-8 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100">
                       <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PRODUCTS VIEW
// ═══════════════════════════════════════════
function ProductsView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getProducts({ search, category: filterCategory, brand: filterBrand }).then((res: any) => {
      setItems(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, filterCategory, filterBrand]);

  const stats = {
    total: items.length,
    active: items.filter(i => i.isActive).length,
    outOfStock: items.filter(i => i.stock === 0).length,
    onSale: items.filter(i => i.salePrice).length
  };

  return (
    <div className="space-y-8">
       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Jami" value={stats.total} icon={<Package className="text-zinc-400" />} />
          <KPICard title="Aktiv" value={stats.active} icon={<CheckCircle2 className="text-green-500" />} />
          <KPICard title="Tugagan" value={stats.outOfStock} icon={<XCircle className="text-red-500" />} />
          <KPICard title="Aksiyada" value={stats.onSale} icon={<Tag className="text-blue-500" />} />
       </div>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h2 className="text-2xl font-black uppercase tracking-tight">Katalog</h2>
             <p className="text-zinc-400 text-xs font-medium">Mahsulotlar va inventar boshqaruvi.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">
             <Plus size={16} /> Yangi Mahsulot
          </button>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center gap-4">
             <div className="relative flex-1 min-w-[300px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
                <input value={search} onChange={e => setSearch(e.target.value)} 
                  placeholder="Mahsulot nomi yoki SKU..." 
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 rounded-2xl text-xs font-bold transition-all outline-none" />
             </div>
             <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} 
               className="px-6 py-4 bg-gray-50 border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white border focus:border-gray-100">
               <option value="">Barcha Kategoriyalar</option>
               <option value="oyoq-kiyimlar">Oyoq kiyimlar</option>
               <option value="liboslar">Liboslar</option>
             </select>
             <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} 
               className="px-6 py-4 bg-gray-50 border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white border focus:border-gray-100">
               <option value="">Barcha Brendlar</option>
               <option value="Nike">Nike</option>
               <option value="Adidas">Adidas</option>
               <option value="MIRVO">MIRVO</option>
             </select>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                      {['Mahsulot', 'Kategoriya', 'Narx', 'Stok', 'Status', ''].map(h => (
                        <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {loading ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50 animate-pulse">
                         {Array.from({ length: 6 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-6 bg-gray-50 rounded-xl" /></td>)}
                      </tr>
                   )) : items.map(item => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                         <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                                  {item.isTrending && <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full shadow-lg" />}
                               </div>
                               <div>
                                  <div className="font-black text-gray-900 text-xs uppercase">{item.name}</div>
                                  <div className="text-[9px] text-gray-400 font-black tracking-widest uppercase">{item.sku}</div>
                               </div>
                            </div>
                         </td>
                         <td className="py-5 px-8">
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.categoryName}</div>
                            <div className="text-[9px] font-bold text-zinc-300">{item.brand}</div>
                         </td>
                         <td className="py-5 px-8">
                            {item.salePrice ? (
                               <div className="space-y-0.5">
                                  <div className="text-xs font-display font-bold text-red-500">{formatPrice(item.salePrice)}</div>
                                  <div className="text-[9px] font-bold text-gray-300 line-through">{formatPrice(item.price)}</div>
                               </div>
                            ) : (
                               <div className="text-xs font-display font-bold text-gray-900">{formatPrice(item.price)}</div>
                            )}
                         </td>
                         <td className="py-5 px-8">
                            <div className="flex flex-col gap-1">
                               <span className={cn("text-[10px] font-display font-bold", item.stock < 10 ? "text-red-500" : "text-zinc-900")}>
                                  {item.stock} dona
                               </span>
                               <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={cn("h-full transition-all", item.stock < 10 ? "bg-red-500" : "bg-black")} style={{ width: `${Math.min(item.stock * 2, 100)}%` }} />
                                </div>
                            </div>
                         </td>
                         <td className="py-5 px-8">
                            <button onClick={() => adminApi.updateProduct(item.id, { isActive: !item.isActive }).then(load)}
                              className={cn("w-10 h-5 rounded-full relative transition-all", item.isActive ? "bg-black" : "bg-gray-200")}>
                               <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", item.isActive ? "right-1" : "left-1")} />
                            </button>
                         </td>
                         <td className="py-5 px-8 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100"><Edit2 size={14} /></button>
                               <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 text-red-500"><Trash2 size={14} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Add Product Modal */}
       <AnimatePresence>
          {showModal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                   className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                   <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                      <div>
                         <h3 className="text-2xl font-black uppercase tracking-tight">Yangi Mahsulot</h3>
                         <p className="text-xs text-gray-400 font-medium">Barcha majburiy maydonlarni to'ldiring.</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"><X size={20} /></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-10 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Mahsulot nomi</label>
                            <input placeholder="Masalan: Nike Air Max 270" className="w-full p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">SKU</label>
                            <input placeholder="Masalan: NIKE-AM270" className="w-full p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Asosiy Narx</label>
                            <input type="number" placeholder="0 so'm" className="w-full p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Aksiya Narxi</label>
                            <input type="number" placeholder="0 so'm" className="w-full p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Stok (Soni)</label>
                            <input type="number" placeholder="0" className="w-full p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Mahsulot rasmi (URL)</label>
                         <div className="flex gap-4">
                            <input placeholder="https://..." className="flex-1 p-5 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                            <button className="px-8 bg-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Yuklash</button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Marketing Taglari</h4>
                            <div className="flex flex-wrap gap-3">
                               {['Trending', 'New', 'Bestseller', 'Limited'].map(tag => (
                                 <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">{tag}</button>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Variantlar</h4>
                            <div className="flex flex-wrap gap-2">
                               {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                 <div key={size} className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">{size}</div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                      <button onClick={() => setShowModal(false)} className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">Bekor qilish</button>
                      <button className="px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">Saqlash</button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════
// OTHER VIEWS (STUBS)
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// INVENTORY VIEW
// ═══════════════════════════════════════════
function InventoryView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getProducts({ search, limit: 100 }).then((res: any) => {
      setItems(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const updateStock = async (id: string, newStock: number) => {
    await adminApi.updateProduct(id, { stock: Math.max(0, newStock) });
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight">Inventar</h2>
            <p className="text-zinc-400 text-xs font-medium">Ombor qoldiqlari va stok boshqaruvi.</p>
         </div>
         <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} 
              placeholder="SKU yoki nom..."
              className="w-72 pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none shadow-sm" />
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Mahsulot</th>
              <th className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Status</th>
              <th className="text-center py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Qoldiq</th>
              <th className="text-right py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Boshqaruv</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 animate-pulse">
                {Array.from({ length: 4 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-6 bg-gray-50 rounded-xl" /></td>)}
              </tr>
            )) : items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-5 px-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                         <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900 leading-none mb-1 text-xs">{item.name}</p>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">SKU: {item.sku || '—'}</p>
                      </div>
                   </div>
                </td>
                <td className="py-5 px-8">
                   {item.stock < 10 ? (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100 animate-pulse">Low Stock</span>
                   ) : (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">In Stock</span>
                   )}
                </td>
                <td className="py-5 px-8 text-center">
                   <span className={cn("text-sm font-display font-bold", item.stock < 10 ? "text-red-600" : "text-zinc-900")}>
                      {item.stock}
                   </span>
                </td>
                <td className="py-5 px-8">
                   <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateStock(item.id, item.stock - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all font-bold">-</button>
                      <button onClick={() => updateStock(item.id, item.stock + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all font-bold">+</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// USERS VIEW
// ═══════════════════════════════════════════
function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.getUsers({ search }).then((res: any) => {
      setUsers(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight">Mijozlar</h2>
            <p className="text-zinc-400 text-xs font-medium">Barcha ro'yxatdan o'tgan foydalanuvchilar.</p>
         </div>
         <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} 
              placeholder="Ism yoki telefon..."
              className="w-72 pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none shadow-sm" />
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Mijoz', 'Rol', 'Status', 'Sana', ''].map(h => (
                <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 animate-pulse">
                {Array.from({ length: 5 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-4 bg-gray-50 rounded" /></td>)}
              </tr>
            )) : users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-5 px-8">
                   <div className="font-bold text-gray-900 text-xs uppercase">{u.firstName} {u.lastName}</div>
                   <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{u.phone}</div>
                </td>
                <td className="py-5 px-8">
                   <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded">{u.role}</span>
                </td>
                <td className="py-5 px-8">
                   <div className={cn("w-2 h-2 rounded-full", u.isActive ? "bg-green-500" : "bg-red-500")} />
                </td>
                <td className="py-5 px-8 text-[10px] text-gray-400 font-bold">{u.date_joined ? formatDate(u.date_joined) : '—'}</td>
                <td className="py-5 px-8 text-right">
                   <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// B2B VIEW
// ═══════════════════════════════════════════
function B2BView() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.getB2BApplications().then((res: any) => {
      setApps(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black uppercase tracking-tight">B2B Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse" />
        )) : apps.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest">Arizalar yo'q</div>
        ) : apps.map(app => (
          <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{app.status}</span>
                <span className="text-[9px] text-gray-400 font-bold">{formatDate(app.createdAt)}</span>
             </div>
             <div>
                <h4 className="font-black text-sm uppercase tracking-tight">{app.fullName}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.businessName}</p>
             </div>
             <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-900">{app.phone}</span>
                <button className="text-[9px] font-black uppercase tracking-widest text-blue-600">Batafsil →</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMINS VIEW
// ═══════════════════════════════════════════
function AdminsView() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight">Jamoa</h2>
          <button className="px-6 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10">+ Yangi Admin</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ name: 'Ogabek', role: 'Super Admin', status: 'online' }].map(a => (
            <div key={a.name} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-black text-gray-400">{a.name[0]}</div>
               <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{a.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{a.role}</p>
               </div>
               <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
            </div>
          ))}
       </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SETTINGS VIEW
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// PAYMENTS VIEW
// ═══════════════════════════════════════════
function PaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getPayments({ provider }).then((res: any) => {
      setPayments(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [provider]);

  const stats = {
    payme: payments.filter(p => p.provider === 'payme' && p.status === 'paid').reduce((acc, p) => acc + Number(p.amount), 0),
    click: payments.filter(p => p.provider === 'click' && p.status === 'paid').reduce((acc, p) => acc + Number(p.amount), 0),
    cash: payments.filter(p => p.provider === 'cash' && p.status === 'paid').reduce((acc, p) => acc + Number(p.amount), 0),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight">To'lovlar</h2>
            <p className="text-zinc-400 text-xs font-medium">Barcha tranzaksiyalar va to'lov usullari.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center p-2">
               <img src="https://cdn.payme.uz/logo/payme_logo_main.png" className="h-full object-contain grayscale brightness-0" alt="Payme" />
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Payme tushum</p>
               <p className="text-xl font-black">{formatPrice(stats.payme)}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center p-2">
               <img src="https://click.uz/static/img/logo.png" className="h-full object-contain grayscale brightness-0" alt="Click" />
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Click tushum</p>
               <p className="text-xl font-black">{formatPrice(stats.click)}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
               <DollarSign className="text-gray-400" size={24} />
            </div>
            <div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Naqd (COD)</p>
               <p className="text-xl font-black">{formatPrice(stats.cash)}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-black text-xs uppercase tracking-widest">Tranzaksiyalar</h3>
           <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 gap-1">
              {['', 'payme', 'click', 'cash'].map(p => (
                <button key={p} onClick={() => setProvider(p)}
                  className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", 
                    provider === p ? "bg-white shadow text-black" : "text-gray-400")}>
                  {p === '' ? 'Barchasi' : p}
                </button>
              ))}
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Mijoz', 'Provider', 'Summa', 'Status', 'Sana'].map(h => (
                  <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-4 bg-gray-50 rounded" /></td>)}
                </tr>
              )) : payments.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-400 font-black uppercase text-[10px] tracking-widest">To'lovlar topilmadi</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-8 text-xs font-bold text-gray-900">{p.user?.phone || 'Mijoz'}</td>
                  <td className="py-5 px-8">
                     <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded">{p.provider}</span>
                  </td>
                  <td className="py-5 px-8 font-display font-bold">{formatPrice(p.amount)}</td>
                  <td className="py-5 px-8">
                     <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", 
                       p.status === 'paid' ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100")}>
                        {p.status}
                     </span>
                  </td>
                  <td className="py-5 px-8 text-[10px] text-gray-400 font-bold">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-xs uppercase tracking-widest">To'lov usullari (Gateway)</h3>
            <div className="space-y-4">
               {[
                 { name: 'Payme', status: 'Connected', color: 'text-green-500', logo: 'https://cdn.payme.uz/logo/payme_logo_main.png' },
                 { name: 'Click', status: 'Connected', color: 'text-green-500', logo: 'https://click.uz/static/img/logo.png' },
                 { name: 'Cash', status: 'Active', color: 'text-blue-500', icon: <DollarSign size={16} /> },
                 { name: 'UzumPay', status: 'Not connected', color: 'text-gray-400', logo: 'https://uzumbank.uz/static/favicon.ico' },
               ].map(m => (
                 <div key={m.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-black transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                          {m.logo ? <img src={m.logo} className="h-full object-contain grayscale" alt="" /> : m.icon}
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight">{m.name}</p>
                          <p className={cn("text-[9px] font-black uppercase tracking-widest", m.color)}>{m.status}</p>
                       </div>
                    </div>
                    <button className="p-2 text-gray-300 group-hover:text-black"><Settings size={16} /></button>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
               <h3 className="text-xl font-black uppercase tracking-tight">Payment Settings</h3>
               <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Default Currency</span>
                     <span className="text-xs font-bold">UZS (So'm)</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Auto Confirm</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Test Mode</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Active</span>
                  </div>
               </div>
               <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 border border-white/5">
                  Webhook URL nusxalash
               </button>
            </div>
            <ShieldCheck className="absolute right-[-20px] top-[-20px] opacity-10" size={160} />
         </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// RETURNS VIEW
// ═══════════════════════════════════════════
function ReturnsView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getReturns({ status }).then((res: any) => {
      setItems(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);

  const stats = {
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    total: items.length
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight">Qaytarishlar</h2>
            <p className="text-zinc-400 text-xs font-medium">Qaytarish va almashtirish so'rovlari.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <KPICard title="Kutilmoqda" value={stats.pending} icon={<Clock className="text-orange-500" />} />
         <KPICard title="Tasdiqlandi" value={stats.approved} icon={<CheckCircle2 className="text-green-500" />} />
         <KPICard title="Rad etildi" value={stats.rejected} icon={<XCircle className="text-red-500" />} />
         <KPICard title="Jami" value={stats.total} icon={<History className="text-blue-500" />} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-black text-xs uppercase tracking-widest">So'rovlar</h3>
           <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 gap-1">
              {['', 'pending', 'approved', 'rejected', 'refunded'].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn("px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", 
                    status === s ? "bg-white shadow text-black" : "text-gray-400")}>
                  {s === '' ? 'Barchasi' : s}
                </button>
              ))}
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['ID', 'Order', 'Mijoz', 'Sabab', 'Status', 'Sana'].map(h => (
                  <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => <td key={j} className="py-5 px-8"><div className="h-4 bg-gray-50 rounded" /></td>)}
                </tr>
              )) : items.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-400 font-black uppercase text-[10px] tracking-widest">So'rovlar topilmadi</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-5 px-8 font-mono text-[10px] font-bold">#R-{item.id.slice(0, 5)}</td>
                  <td className="py-5 px-8 font-bold text-xs">#O-{item.orderNumber || '1842'}</td>
                  <td className="py-5 px-8">
                     <p className="font-black text-xs uppercase text-gray-900">Mijoz</p>
                     <p className="text-[9px] text-gray-400 font-bold">Phone</p>
                  </td>
                  <td className="py-5 px-8">
                     <p className="text-xs font-bold">{item.reason}</p>
                     <p className="text-[9px] text-gray-400 font-medium truncate max-w-[150px]">{item.description}</p>
                  </td>
                  <td className="py-5 px-8">
                     <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", 
                       item.status === 'pending' ? "bg-orange-50 text-orange-600 border-orange-100" : 
                       item.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                       "bg-gray-50 text-gray-400 border-gray-100")}>
                        {item.status}
                     </span>
                  </td>
                  <td className="py-5 px-8 text-[10px] text-gray-400 font-bold">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROMOS VIEW
// ═══════════════════════════════════════════
function PromosView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getPromos().then((res: any) => {
      setItems(res?.data || (Array.isArray(res) ? res : []));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const stats = {
    active: items.filter(i => i.isActive).length,
    todayUsage: 8,
    totalDiscount: items.reduce((acc, i) => acc + (Number(i.usedCount) * Number(i.value)), 0),
    topCode: items.sort((a, b) => b.usedCount - a.usedCount)[0]?.code || '—'
  };

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Faol kodlar" value={stats.active} icon={<Tag className="text-zinc-400" />} />
          <KPICard title="Bugun ishlatilgan" value={stats.todayUsage} icon={<History className="text-blue-500" />} />
          <KPICard title="Jami chegirma" value={formatPrice(stats.totalDiscount)} icon={<DollarSign className="text-green-500" />} />
          <KPICard title="Top kod" value={stats.topCode} icon={<Star className="text-orange-500" />} />
       </div>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h2 className="text-2xl font-black uppercase tracking-tight">Promokodlar</h2>
             <p className="text-zinc-400 text-xs font-medium">Marketing kampaniyalari boshqaruvi.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">
             <Plus size={16} /> Yangi Promokod
          </button>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
             <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                   {['Kod', 'Qiymat', 'Stok', 'Status', ''].map(h => (
                     <th key={h} className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                   ))}
                </tr>
             </thead>
             <tbody>
                {loading ? Array.from({ length: 3 }).map((_, i) => (
                   <tr key={i} className="border-b border-gray-50 animate-pulse"><td className="p-8"><div className="h-4 bg-gray-50 rounded" /></td></tr>
                )) : items.map(item => (
                   <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-8 font-black text-gray-900 text-xs tracking-widest uppercase">{item.code}</td>
                      <td className="py-5 px-8 font-display font-bold">
                         {item.type === 'percentage' ? `${item.value}%` : formatPrice(item.value)}
                      </td>
                      <td className="py-5 px-8">
                         <span className="text-xs font-bold">{item.usedCount}</span>
                         <span className="text-[10px] text-gray-300"> / {item.maxUses}</span>
                      </td>
                      <td className="py-5 px-8">
                         <button onClick={() => adminApi.updatePromo(item.id, { isActive: !item.isActive }).then(load)}
                           className={cn("w-10 h-5 rounded-full relative transition-all", item.isActive ? "bg-black" : "bg-gray-200")}>
                            <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", item.isActive ? "right-1" : "left-1")} />
                         </button>
                      </td>
                      <td className="py-5 px-8 text-right">
                         <button onClick={() => adminApi.deletePromo(item.id).then(load)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={14} /></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LOYALTY VIEW
// ═══════════════════════════════════════════
function LoyaltyView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers().then((res: any) => setUsers(res?.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Jami bonuslar" value={formatPrice(users.reduce((acc, u) => acc + Number(u.bonusBalance || 0), 0))} icon={<Award className="text-zinc-400" />} />
          <KPICard title="Faol a'zolar" value={users.filter(u => Number(u.bonusBalance) > 0).length} icon={<Users className="text-blue-500" />} />
       </div>
       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
             <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Top Mijozlar (Loyallik)</h3>
          </div>
          <table className="w-full text-sm">
             <tbody>
                {users.sort((a, b) => b.bonusBalance - a.bonusBalance).slice(0, 10).map((u, i) => (
                   <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-5 px-8 flex items-center gap-4">
                         <span className="text-[10px] font-black text-gray-300 w-4">{i+1}</span>
                         <div className="font-black text-xs uppercase">{u.phone}</div>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex flex-col items-end">
                            <span className="text-sm font-display font-bold text-green-600">{formatPrice(u.bonusBalance)}</span>
                            <button onClick={() => adminApi.giveBonus(u.id, 10000).then(() => adminApi.getUsers().then(res => setUsers(res?.data || [])))} 
                              className="text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-all">+ 10,000 bonus berish</button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// CONTENT VIEW
// ═══════════════════════════════════════════
function ContentView() {
  return (
    <div className="space-y-8">
       <h2 className="text-2xl font-black uppercase tracking-tight">Kontent Boshqaruvi</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
             <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Bannerlar (Slider)</h3>
             <div className="aspect-[21/9] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
                <Image className="text-gray-300" size={32} />
                <button className="text-[10px] font-black uppercase tracking-widest text-black">+ Banner qo'shish</button>
             </div>
          </div>
          <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
             <h3 className="font-black text-[10px] uppercase tracking-widest text-white/30">Marketing Bloklari</h3>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-tight">Flash Sale Bar</span>
                <div className="w-8 h-4 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" /></div>
             </div>
          </div>
       </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-8">
       <h2 className="text-2xl font-black uppercase tracking-tight">Sozlamalar</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Umumiy sozlamalar</h3>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Do'kon nomi</label>
                   <input defaultValue="MIRVO" className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Valyuta</label>
                   <select className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-100 rounded-2xl text-xs font-bold outline-none transition-all">
                      <option>UZS (So'm)</option>
                      <option>USD ($)</option>
                   </select>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 text-center">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
       <AlertCircle size={40} className="text-gray-200" />
    </div>
    <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-gray-400 text-sm max-w-xs font-medium">Ushbu bo'lim hozirda takomillashtirilmoqda va tez orada ishga tushiriladi.</p>
  </div>
);

// ═══════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════
const NAV_GROUPS = [
  {
    label: 'Savdo',
    items: [
      { view: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
      { view: 'orders', label: 'Buyurtmalar', icon: <ShoppingBag size={18} /> },
      { view: 'payments', label: 'To\'lovlar', icon: <CreditCard size={18} /> },
      { view: 'returns', label: 'Qaytarishlar', icon: <RotateCcw size={18} /> },
    ]
  },
  {
    label: 'Katalog',
    items: [
      { view: 'products', label: 'Mahsulotlar', icon: <Package size={18} /> },
      { view: 'inventory', label: 'Inventar', icon: <Box size={18} /> },
    ]
  },
  {
    label: 'Mijozlar',
    items: [
      { view: 'users', label: 'Mijozlar', icon: <Users size={18} /> },
      { view: 'b2b', label: 'B2B Leads', icon: <Building2 size={18} /> },
    ]
  },
  {
    label: 'Marketing',
    items: [
      { view: 'promos', label: 'Promokodlar', icon: <Tag size={18} /> },
      { view: 'loyalty', label: 'Loyallik', icon: <Award size={18} /> },
    ]
  },
  {
    label: 'Tizim',
    items: [
      { view: 'content', label: 'Kontent', icon: <Layout size={18} /> },
      { view: 'team', label: 'Jamoa', icon: <Shield size={18} /> },
      { view: 'settings', label: 'Sozlamalar', icon: <Settings size={18} /> },
    ]
  }
];

export default function AdminDashboard() {
  const { user, logout, isLoading, adminLogin } = useAuth() as any;
  const [view, setView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (isLoading) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await adminLogin?.(loginUsername, loginPassword);
    if (!success) setLoginError('Login yoki parol xato');
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-black rounded-3xl mx-auto flex items-center justify-center text-white font-black text-3xl mb-6 shadow-2xl shadow-black/20">M</div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-3">Xush kelibsiz!</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="text" placeholder="Login" value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl py-5 px-6 text-sm font-bold outline-none transition-all" />
            <input type="password" placeholder="Parol" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 focus:border-black focus:bg-white rounded-2xl py-5 px-6 text-sm font-bold outline-none transition-all" />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{loginError}</p>}
            <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">Kirish</button>
          </form>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView />;
      case 'orders': return <OrdersView />;
      case 'products': return <ProductsView />;
      case 'inventory': return <InventoryView />;
      case 'users': return <UsersView />;
      case 'b2b': return <B2BView />;
      case 'promos': return <PromosView />;
      case 'loyalty': return <LoyaltyView />;
      case 'content': return <ContentView />;
      case 'team': return <AdminsView />;
      case 'settings': return <SettingsView />;
      case 'returns': return <ReturnsView />;
      case 'payments': return <PaymentsView />;
      default: return <DashboardView />;
    }
  };

  const currentItem = NAV_GROUPS.flatMap(g => g.items).find(i => i.view === view);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-white transform transition-transform duration-300',
        'md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black font-black text-lg">M</div>
            <div>
              <div className="font-black text-white uppercase tracking-tight">MIRVO</div>
              <div className="text-[9px] text-white/40 font-black uppercase tracking-widest">Operating System</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-8 flex-1 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="space-y-2">
              <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{group.label}</h3>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button key={item.view} onClick={() => { setView(item.view as AdminView); setSidebarOpen(false); }}
                    className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all',
                      view === item.view ? 'bg-white text-black shadow-2xl shadow-white/10' : 'text-white/50 hover:text-white hover:bg-white/5')}>
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black uppercase">{user?.phone?.[0] || 'A'}</div>
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-black uppercase tracking-tight truncate">{user?.phone}</p>
                 <p className="text-[9px] text-white/30 font-bold uppercase truncate">{user?.role}</p>
              </div>
           </div>
           <button onClick={logout} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Chiqish →</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 bg-gray-50 rounded-xl"><Box size={18} /></button>
            <div className="space-y-1">
              <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">{currentItem?.label}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Tizim Online</span>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
