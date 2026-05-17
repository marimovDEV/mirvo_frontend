import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MarketHeader, MarketBottomNav } from '../components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, MapPin, CreditCard, Ticket, 
  LogOut, ChevronRight, 
  Clock, CheckCircle, Building2,
  Languages, Bell, ShieldCheck, Heart, Sparkles, Wallet,
  Info, History, TrendingUp, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../components/Avatar';
import { ordersApi } from '../lib/api';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [showBonusInfo, setShowBonusInfo] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    if (user) {
      ordersApi.getMyOrderCount().then(setOrderCount).catch(console.error);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white min-h-screen">
        <MarketHeader />
        <main className="pt-32 px-6 flex flex-col items-center justify-center space-y-8 max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center relative">
                <Sparkles className="w-10 h-10 text-zinc-200" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-display uppercase tracking-tight text-black">{t('profile.welcome')}</h2>
                <p className="text-zinc-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                  {t('profile.welcome_sub')}
                </p>
            </div>
            <button
                onClick={() => navigate('/auth')}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20"
            >
                {t('common.login')}
            </button>
        </main>

      </div>
    );
  }

  const formatPhone = (p: string) => {
    const raw = p.replace(/\D/g, '').replace('998', '');
    if (raw.length === 9) {
      return `+998 ${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5, 7)} ${raw.slice(7, 9)}`;
    }
    return p;
  };

  const membership = orderCount >= 15 ? 'Gold' : orderCount >= 5 ? 'Silver' : 'Standard';
  const membershipColors = {
    Gold: 'bg-yellow-500 text-white border-yellow-600 shadow-xl shadow-yellow-500/20',
    Silver: 'bg-zinc-400 text-white border-zinc-500 shadow-xl shadow-zinc-400/20',
    Standard: 'bg-black text-white border-black shadow-xl shadow-black/20'
  };

  const cashbackRate = membership === 'Gold' ? 8 : membership === 'Silver' ? 5 : 3;

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="max-w-xl mx-auto px-6 pt-24 pb-40 space-y-10">
        {/* Profile Card */}
        <section className="flex flex-col items-center text-center space-y-6 py-4">
            <div className="relative">
              <Avatar 
                firstName={user.firstName} 
                lastName={user.lastName} 
                src={user.avatar} 
                size="lg" 
                className="rounded-[3rem] border-4 border-zinc-50 shadow-2xl"
              />
              <div className={cn(
                "absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border-2",
                membershipColors[membership]
              )}>
                {membership === 'Gold' ? t('profile.gold_member') : membership === 'Silver' ? t('profile.silver_member') : t('profile.standard_member')}
              </div>
            </div>
            
            <div className="space-y-1">
                <h2 className="text-4xl font-display uppercase tracking-tight text-black">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-zinc-300 font-black text-xs tracking-widest">{formatPhone(user.phone)}</p>
            </div>

            {user.role === 'admin' && (
              <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-6 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
              >
                <ShieldCheck size={14} /> Admin Access
              </button>
            )}
        </section>

        {/* Bonus Balansi - REAL Logic */}
        <div className="p-8 text-white rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-zinc-500/10 border border-black/5" 
             style={{ background: 'linear-gradient(135deg, #18181b 0%, #000000 100%)' }}>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white/60" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{t('profile.bonus_balance')}</p>
              </div>
              <button 
                onClick={() => setShowBonusInfo(!showBonusInfo)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-white/40" />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-end justify-between">
                <h4 className="text-4xl font-display tracking-tight">{(user.bonusBalance || 0).toLocaleString()} {t('home.currency')}</h4>
                <div className="flex gap-2">
                   <button onClick={() => navigate('/orders')} className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all">
                      <History className="w-4 h-4" />
                   </button>
                   <button onClick={() => navigate('/')} className="bg-white text-black px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all">
                      {t('profile.use_bonus')}
                   </button>
                </div>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> {t('profile.cashback_note', { rate: cashbackRate })}
              </p>
            </div>
          </div>
          
          <AnimatePresence>
            {showBonusInfo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative z-10 pt-6 mt-6 border-t border-white/5 overflow-hidden"
              >
                <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase tracking-wider">
                  {t('profile.bonus_info_text', { rate: cashbackRate })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders Summary - REAL Logic placeholders */}
        <div className="grid grid-cols-3 gap-3">
          <OrderStat icon={<Clock />} label={t('profile.active_orders')} count={orderCount > 0 ? 1 : 0} onClick={() => navigate('/orders')} />
          <OrderStat icon={<CheckCircle />} label={t('profile.completed_orders')} count={orderCount} onClick={() => navigate('/orders')} />
          <OrderStat icon={<Package />} label={t('profile.returns')} count={0} onClick={() => navigate('/orders')} />
        </div>

        {/* Menu Sections */}
        <div className="space-y-10">
          <MenuSection title={t('profile.my_account')}>
            <MenuItem 
              icon={<Package />} 
              label={t('profile.my_orders')} 
              sub={t('profile.my_orders_sub')} 
              onClick={() => navigate('/orders')} 
            />
            <MenuItem 
              icon={<MapPin />} 
              label={t('profile.my_addresses')} 
              sub={t('profile.my_addresses_sub')} 
              onClick={() => navigate('/addresses')} 
            />
            <MenuItem 
              icon={<Heart />} 
              label={t('profile.favorites')} 
              sub={t('profile.favorites_sub')} 
              onClick={() => navigate('/wishlist')} 
            />
            <MenuItem 
              icon={<CreditCard />} 
              label={t('profile.payment_methods')} 
              sub={t('profile.payment_methods_sub')} 
              onClick={() => navigate('/payment-methods')} 
            />
          </MenuSection>

          <MenuSection title={t('profile.services')}>
            <MenuItem 
              icon={<Building2 />} 
              label={t('profile.b2b_title')} 
              sub={t('profile.b2b_sub')} 
              onClick={() => navigate('/b2b')}
              highlight
            />
            <MenuItem 
              icon={<Languages />} 
              label={t('profile.language_title')} 
              sub={i18n.language === 'uz' ? "O'zbekcha" : i18n.language === 'ru' ? "Русский" : "English"} 
              onClick={() => setShowLanguageModal(true)}
            />
            <MenuItem 
              icon={<Ticket />} 
              label={t('profile.promocodes_title')} 
              sub={t('profile.promocodes_sub')} 
              onClick={() => navigate('/promocodes')} 
            />
          </MenuSection>

          <MenuSection title={t('profile.system')}>
            <MenuItem 
              icon={<Bell />} 
              label={t('profile.notifications')} 
              sub={t('profile.notifications_sub')} 
              onClick={() => navigate('/notifications')} 
            />
            <MenuItem 
              icon={<LogOut className="text-red-500" />} 
              label={t('profile.logout_title')} 
              sub={t('profile.logout_sub')} 
              onClick={logout} 
              noBorder 
            />
          </MenuSection>
        </div>
      </main>

      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-50 flex items-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowLanguageModal(false)}
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
                   <h2 className="text-3xl font-display uppercase tracking-tight">{t('profile.select_language')}</h2>
                   <p className="text-zinc-400 text-sm font-medium">{t('profile.language_sub')}</p>
                </div>
                <div className="space-y-3">
                   <button 
                     onClick={() => { i18n.changeLanguage('uz'); setShowLanguageModal(false); }}
                     className={cn(
                       "w-full p-6 rounded-2xl border flex items-center justify-between font-black text-xs uppercase tracking-widest transition-all",
                       i18n.language === 'uz' ? "border-black bg-black text-white" : "border-zinc-100 bg-zinc-50 text-black"
                     )}
                   >
                      O'zbekcha
                      {i18n.language === 'uz' && <CheckCircle size={16} />}
                   </button>
                   <button 
                     onClick={() => { i18n.changeLanguage('ru'); setShowLanguageModal(false); }}
                     className={cn(
                       "w-full p-6 rounded-2xl border flex items-center justify-between font-black text-xs uppercase tracking-widest transition-all",
                       i18n.language === 'ru' ? "border-black bg-black text-white" : "border-zinc-100 bg-zinc-50 text-black"
                     )}
                   >
                      Русский
                      {i18n.language === 'ru' && <CheckCircle size={16} />}
                   </button>
                   <button 
                     onClick={() => { i18n.changeLanguage('en'); setShowLanguageModal(false); }}
                     className={cn(
                       "w-full p-6 rounded-2xl border flex items-center justify-between font-black text-xs uppercase tracking-widest transition-all",
                       i18n.language === 'en' ? "border-black bg-black text-white" : "border-zinc-100 bg-zinc-50 text-black"
                     )}
                   >
                      English
                      {i18n.language === 'en' && <CheckCircle size={16} />}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}

function OrderStat({ icon, label, count, onClick }: { icon: React.ReactNode, label: string, count: number, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-zinc-50 border border-zinc-100 p-6 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-white hover:shadow-xl hover:shadow-zinc-500/5 transition-all cursor-pointer group"
    >
      <div className="p-3 bg-white rounded-2xl shadow-sm text-zinc-300 group-hover:text-black transition-colors">
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      <div className="text-center">
        <p className="text-[9px] font-black uppercase text-zinc-300 tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-xl font-display text-black leading-none">{count}</p>
      </div>
    </div>
  );
}

function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 ml-4">{title}</h3>
      <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick, highlight, noBorder }: { icon: React.ReactNode, label: string, sub: string, onClick?: () => void, highlight?: boolean, noBorder?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-5 p-6 hover:bg-zinc-50 transition-all text-left group",
        !noBorder && "border-b border-zinc-50"
      )}
    >
      <div className={cn(
        "p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-sm",
        highlight ? "bg-black text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-white group-hover:text-black"
      )}>
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      <div className="flex-1">
        <p className="font-black text-[13px] uppercase tracking-tight text-black">{label}</p>
        <p className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-500 transition-colors">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
    </button>
  );
}
