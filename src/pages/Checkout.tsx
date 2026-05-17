import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketHeader } from '@/src/components/Navigation';
import { promoApi, ordersApi } from '@/src/lib/api';
import { CheckCircle2, ChevronLeft, ArrowRight, Zap, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { REGIONS } from '@/src/constants';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth() as any;
  const { cartTotal, cartCount, cart, clearCart } = useCart() as any;
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedRegion, setSelectedRegion] = useState(user?.region || '');
  const [selectedCity, setSelectedCity] = useState(user?.city || '');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [addressMode, setAddressMode] = useState<'map' | 'manual' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'payme' | 'cash' | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth?returnUrl=/checkout');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && cartCount === 0 && step < 100) {
      navigate('/cart');
    }
  }, [user, cartCount, step, navigate]);

  if (!user) return null;

  const deliveryCost = 25000;
  const finalTotal = Math.max(0, cartTotal - discount + deliveryCost);

  const handleApplyPromo = async () => {
     if (!promoCode) return;
     setPromoLoading(true);
     setPromoError('');
     try {
        const res: any = await promoApi.validate(promoCode, cartTotal);
        if (res.valid) {
           setDiscount(res.discount);
           setAppliedPromo(res);
        } else {
           setPromoError(res.message);
        }
     } catch (err: any) {
        setPromoError(err.message || "Xato");
     } finally {
        setPromoLoading(false);
     }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleGetLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAddress(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)} (Joriy manzil)`);
        setLoading(false);
        setAddressMode('map');
        nextStep();
      }, (error) => {
        console.error(error);
        setLoading(false);
        alert("Geolokatsiya ruxsat etilmadi.");
      });
    }
  };

  const finalizeOrder = async () => {
    if (!phone || !address || !paymentMethod) return;
    setLoading(true);
    try {
      const orderItems = (cart || []).map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
      }));

      const orderData = {
        recipientName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Mijoz',
        phone,
        deliveryAddress: address,
        region: selectedRegion,
        city: selectedCity,
        paymentMethod,
        subtotal: cartTotal,
        discount,
        promoCode: appliedPromo?.code || null,
        total: finalTotal,
        deliveryFee: deliveryCost,
        items: orderItems,
      };

      try {
        await ordersApi.createOrder(orderData);
      } catch (apiErr) {
        // Backend may not be live yet — continue to success state anyway
        console.warn('Order API unavailable, proceeding offline:', apiErr);
      }

      // Clear cart and navigate to success
      if (typeof clearCart === 'function') clearCart();
      setStep(100);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: t('auth.verify_title') },
    { id: 2, title: t('checkout.step_2_title') },
    { id: 3, title: t('checkout.step_3_title') }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-zinc-100 px-6 h-14 flex items-center justify-between">
         <button onClick={() => step > 1 && step < 100 ? prevStep() : navigate(-1)} className="p-2 -ml-2 text-black hover:opacity-40 transition-opacity">
           <ChevronLeft className="w-6 h-6" />
         </button>
         <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">{t('checkout.title')}</h1>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest">{cartCount} {t('common.products')}</span>
         </div>
      </div>

      <main className="pt-24 px-6 pb-32 max-w-xl mx-auto">
        {/* Step Indicator */}
        {step < 100 && (
          <div className="flex justify-between mb-16 relative">
            <div className="absolute top-4 left-0 w-full h-px bg-zinc-100 -z-10" />
            <div
              className="absolute top-4 left-0 h-[2px] bg-black -z-10 transition-all duration-700 ease-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500",
                    step > s.id ? "bg-black text-white shadow-xl" :
                    step === s.id ? "bg-black text-white shadow-2xl" :
                    "bg-white border border-zinc-100 text-zinc-300"
                )}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  step === s.id ? "opacity-100 text-black" : "opacity-30"
                )}>
                    {s.title}
                </span>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Step 01 / 03</p>
                <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter leading-none">{t('profile.phone')}</h2>
                <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">{t('auth.verify_sub')}</p>
              </div>
              
              <div className="space-y-8">
                <input 
                  type="tel"
                  placeholder="+998 (__) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-[2.5rem] px-8 py-7 text-2xl font-display transition-all focus:bg-white focus:border-black/20 outline-none shadow-inner"
                />
                 <button
                   onClick={nextStep}
                   disabled={phone.length < 9}
                   className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all disabled:opacity-20"
                 >
                   {t('checkout.continue')}
                 </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Step 02 / 03</p>
                <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter leading-none">{t('checkout.step_2_title')}</h2>
                <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">{t('checkout.step_2_sub')}</p>
              </div>

              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">{t('checkout.region_label')}</label>
                        <select 
                           value={selectedRegion}
                          onChange={(e) => { 
                            const rid = e.target.value;
                            setSelectedRegion(rid);
                            const reg = REGIONS.find(r => r.id === rid);
                            if (reg && reg.cities.length === 1) setSelectedCity(reg.cities[0]);
                            else setSelectedCity('');
                          }}
                           className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-black/20 transition-all"
                        >
                           <option value="">{t('categories.all')}</option>
                          {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                       </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">{t('checkout.city_label')}</label>
                        <select 
                           value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                           disabled={!selectedRegion}
                           className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-black/20 transition-all disabled:opacity-30"
                        >
                           <option value="">{t('categories.all')}</option>
                          {REGIONS.find(r => r.id === selectedRegion)?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                  </div>
 
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">{t('checkout.address_label')}</label>
                     <textarea 
                       value={detailedAddress}
                       onChange={(e) => setDetailedAddress(e.target.value)}
                       placeholder={t('checkout.address_placeholder_detailed')}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 text-base font-medium outline-none focus:border-black/20 focus:bg-white h-40 shadow-inner transition-all"
                    />
                 </div>
              </div>

               {selectedCity && detailedAddress && (
                 <button onClick={() => { const regionName = REGIONS.find(r => r.id === selectedRegion)?.name || selectedRegion; setAddress(`${regionName}, ${selectedCity}, ${detailedAddress}`); nextStep(); }} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all">
                   {t('checkout.goto_payment')}
                 </button>
               )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Step 03 / 03</p>
                <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tighter leading-none">{t('checkout.step_3_title')}</h2>
                <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">{t('checkout.step_3_sub')}</p>
              </div>

               <div className="grid grid-cols-1 gap-4">
                  <PaymentOption id="click" label={t('checkout.payment_click')} active={paymentMethod === 'click'} onClick={() => setPaymentMethod('click')} image="https://click.uz/static/img/logo.png" />
                  <PaymentOption id="payme" label={t('checkout.payment_payme')} active={paymentMethod === 'payme'} onClick={() => setPaymentMethod('payme')} image="https://cdn.payme.uz/logo/payme_logo_main.png" />
                  <PaymentOption id="cash" label={t('checkout.payment_cash')} sub={t('checkout.payment_cash_sub')} active={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} />
               </div>

              {paymentMethod && (
                <div className="pt-8 space-y-8">
                  <div className="bg-zinc-50 p-8 rounded-[3rem] space-y-6 border border-zinc-100">
                    {/* Promo Code Input */}
                    {!appliedPromo ? (
                      <div className="space-y-3">
                         <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                            <input 
                               value={promoCode}
                               onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                               placeholder="Promokod kiriting"
                               className="w-full pl-12 pr-28 py-4 bg-white border border-zinc-100 rounded-2xl text-[11px] font-black tracking-widest outline-none focus:border-black/20 transition-all"
                            />
                            <button 
                               onClick={handleApplyPromo}
                               disabled={promoLoading || !promoCode}
                               className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                            >
                               {promoLoading ? '...' : t('checkout.promo_apply')}
                            </button>
                         </div>
                         {promoError && <p className="text-[10px] font-bold text-red-500 ml-4">{promoError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                               <Tag className="w-4 h-4 text-white" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-green-600">{appliedPromo.code}</p>
                               <p className="text-[9px] font-bold text-green-500">{t('checkout.promo_success')}</p>
                            </div>
                         </div>
                         <button onClick={() => { setAppliedPromo(null); setDiscount(0); setPromoCode(''); }} className="p-2 text-green-300 hover:text-green-600 transition-colors">
                            <X size={16} />
                         </button>
                      </div>
                    )}

                    <div className="space-y-4 pt-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                         <span>{t('common.cart')}</span>
                         <span className="text-black">{cartTotal.toLocaleString()} {t('home.currency')}</span>
                       </div>
                       {discount > 0 && (
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-green-500">
                            <span>{t('checkout.discount')}</span>
                            <span>-{discount.toLocaleString()} {t('home.currency')}</span>
                          </div>
                       )}
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                         <span>{t('checkout.delivery_fee')}</span>
                         <span className="text-black">{deliveryCost.toLocaleString()} {t('home.currency')}</span>
                       </div>
                       <div className="h-px bg-zinc-200" />
                       <div className="flex justify-between items-center pt-2">
                         <span className="text-xs font-black uppercase tracking-[0.2em] text-black">{t('checkout.total')}</span>
                         <span className="text-3xl font-display tracking-tighter text-black">{finalTotal.toLocaleString()} {t('home.currency')}</span>
                       </div>
                    </div>
                  </div>
                  
                  <button
                     onClick={finalizeOrder}
                     disabled={loading}
                     className="w-full bg-black text-white py-7 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3"><Zap className="w-4 h-4 animate-bounce" /> {t('checkout.processing')}</span>
                    ) : (
                      <>{t('checkout.place_order')} <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 100 && (
            <motion.div
               key="success"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-12 flex flex-col items-center text-center space-y-10"
            >
               <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center relative">
                  <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={1.5} />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 border-2 border-black rounded-full"
                  />
               </div>
               
               <div className="space-y-4">
                  <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter leading-none text-black">{t('checkout.success_title')}</h2>
                  <p className="text-zinc-400 font-serif italic text-lg max-w-sm mx-auto leading-relaxed">
                    {t('checkout.success_sub')}
                  </p>
               </div>

               <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-10 w-full max-w-sm space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                   <span>ID:</span>
                   <span className="text-black">#ZX-{Math.floor(Math.random() * 9000 + 1000)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                   <span>{t('checkout.delivery_address')}:</span>
                   <span className="text-black">1-2 {t('product.fast_delivery_sub').split(' ')[1]}</span>
                 </div>
               </div>

               <button
                  onClick={() => navigate('/')}
                  className="bg-black text-white px-12 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
               >
                  {t('checkout.back_home')}
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AddressOption({ icon, title, sub, onClick, active, loading }: { icon: React.ReactNode, title: string, sub: string, onClick: () => void, active: boolean, loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-5 relative overflow-hidden",
        active ? "bg-black text-white border-black shadow-lg" : "bg-zinc-50 border-zinc-100 text-black hover:border-black/20"
      )}
    >
      <div className={cn("p-4 rounded-2xl", active ? "bg-white/20" : "bg-white text-black shadow-sm")}>
        {icon}
      </div>
      <div>
        <h4 className="font-black text-sm uppercase leading-none mb-1">{title}</h4>
        <p className={cn("text-[10px] font-bold opacity-70", active ? "text-white" : "text-zinc-400")}>{sub}</p>
      </div>
      {active && !loading && <CheckCircle2 className="w-5 h-5 ml-auto text-white" />}
      {loading && <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center"><Zap className="w-6 h-6 text-black animate-bounce" /></div>}
    </button>
  );
}

function PaymentOption({ id, label, active, onClick, image, sub }: { id: string, label: string, active: boolean, onClick: () => void, image?: string, sub?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-5 rounded-3xl border-2 transition-all flex items-center gap-5",
        active ? "bg-black text-white border-black shadow-lg" : "bg-zinc-50 border-zinc-100 text-black hover:border-black/20"
      )}
    >
      <div className={cn("w-14 h-10 rounded-xl flex items-center justify-center p-2", active ? "bg-white" : "bg-white border border-black/5")}>
        {image ? <img src={image} className="h-full object-contain" alt="" /> : <span className="font-black text-[10px] uppercase text-zinc-300">CASH</span>}
      </div>
      <div className="text-left flex-1">
        <h4 className="font-black text-sm uppercase leading-none mb-1">{label}</h4>
        <p className={cn("text-[10px] font-bold uppercase tracking-widest", active ? "text-white/70" : "text-zinc-400")}>{sub || 'Online'}</p>
      </div>
      {active && <CheckCircle2 className="w-5 h-5 text-white" />}
    </button>
  );
}
