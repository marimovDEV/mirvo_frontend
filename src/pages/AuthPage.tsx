import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, ChevronRight, ArrowLeft, Loader2, User, MapPin, ExternalLink } from 'lucide-react';
import { MarketHeader, MarketBottomNav } from '../components/Navigation';
import { useTranslation } from 'react-i18next';

const UZ_REGIONS = [
  'Toshkent', 'Toshkent viloyati', 'Xorazm', 'Buxoro', 'Samarqand',
  'Andijon', 'Farg\'ona', 'Namangan', 'Qashqadaryo', 'Surxondaryo',
  'Jizzax', 'Sirdaryo', 'Navoiy', 'Qoraqalpog\'iston'
];

type Step = 'phone' | 'code' | 'register' | 'login-pass';

export default function AuthPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  // Registration data
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    region: '',
    city: '',
    password: ''
  });

  const [loginPass, setLoginPass] = useState('');

  const { sendOtp, verifyOtp, passwordLogin, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/profile';

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError(t('auth.phone_placeholder'));
      return;
    }
    setError('');
    await sendOtp('+998' + phone);
    setStep('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 5) {
      setError(t('auth.verify_sub'));
      return;
    }
    const result = await verifyOtp(code);
    if (result) {
      // If it's a new user without details, go to register
      const user = JSON.parse(localStorage.getItem('mirvo_user') || '{}');
      if (!user.firstName) {
        setStep('register');
      } else {
        navigate(returnUrl);
      }
    } else {
      setError(t('auth.invalid_code'));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.firstName || !regData.lastName || !regData.region || !regData.password) {
      setError(t('auth.all_fields'));
      return;
    }
    const success = await updateProfile(regData);
    if (success) {
      navigate(returnUrl);
    } else {
      setError(t('auth.invalid_code'));
    }
  };

  const handlePassLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await passwordLogin('+998' + phone, loginPass);
    if (success) {
      navigate(returnUrl);
    } else {
      setError(t('auth.invalid_code'));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <MarketHeader />
      
      <main className="max-w-md mx-auto px-6 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary-light rounded-3xl mx-auto flex items-center justify-center text-primary">
                  <Phone size={40} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-on-surface">{t('auth.login_title')}</h2>
                <p className="text-on-surface-variant font-medium opacity-60">{t('auth.phone_sub')}</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">+998</span>
                    <input
                      type="tel"
                      placeholder="(_ _) _ _ _  _ _  _ _"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="w-full bg-primary-light border-2 border-primary/10 focus:border-primary/40 rounded-2xl py-5 pl-16 pr-6 text-lg font-bold outline-none transition-all text-on-surface"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t('auth.get_code')} <ChevronRight className="w-5 h-5" /></>}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase font-bold text-gray-400 bg-white px-4">{t('auth.or_label')}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('login-pass')}
                    className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={18} /> {t('auth.login_with_pass')}
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <p className="text-xs text-blue-700 font-bold flex items-center gap-2">
                    <ExternalLink size={14} /> {t('auth.bot_note_title')}
                  </p>
                  <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                    {t('auth.bot_note_text')}
                  </p>
                  <a href="#" target="_blank" className="inline-block text-xs font-black text-blue-700 underline decoration-2">
                    {t('auth.bot_link')}
                  </a>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setStep('phone')}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> {t('auth.change_phone')}
              </button>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-on-surface">{t('auth.verify_title')}</h2>
                <p className="text-on-surface-variant font-medium opacity-60">+998 {phone} {t('auth.verify_sub')}</p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="0 0 0 0 0"
                    className="w-full bg-primary-light border-2 border-primary/10 focus:border-primary/50 focus:bg-white text-center text-3xl font-black py-5 rounded-2xl outline-none text-primary transition-all tracking-[0.5em]"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs font-bold pl-2 text-center">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('auth.verify_title')}
                </button>

                <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                  {t('auth.resend_code')} (60s)
                </p>
              </form>
            </motion.div>
          )}

          {step === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-on-surface">{t('auth.register_title')}</h2>
                <p className="text-on-surface-variant font-medium opacity-60">{t('auth.register_sub')}</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      placeholder={t('auth.first_name')}
                      value={regData.firstName}
                      onChange={(e) => setRegData({...regData, firstName: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/30 rounded-xl py-4 pl-10 pr-4 font-bold text-sm outline-none"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      placeholder={t('auth.last_name')}
                      value={regData.lastName}
                      onChange={(e) => setRegData({...regData, lastName: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/30 rounded-xl py-4 pl-10 pr-4 font-bold text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={regData.region}
                    onChange={(e) => setRegData({...regData, region: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/30 rounded-xl py-4 pl-10 pr-4 font-bold text-sm outline-none appearance-none"
                  >
                    <option value="">{t('auth.region_select')}</option>
                    {UZ_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    placeholder={t('auth.city_district')}
                    value={regData.city}
                    onChange={(e) => setRegData({...regData, city: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/30 rounded-xl py-4 pl-10 pr-4 font-bold text-sm outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    placeholder={t('auth.create_pass')}
                    value={regData.password}
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/30 rounded-xl py-4 pl-10 pr-4 font-bold text-sm outline-none"
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('auth.ready_btn')}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'login-pass' && (
            <motion.div
              key="login-pass"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setStep('phone')}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.cancel')}
              </button>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight text-on-surface">{t('auth.login_title')}</h2>
                <p className="text-on-surface-variant font-medium opacity-60">{t('auth.create_pass')}</p>
              </div>

              <form onSubmit={handlePassLoginSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">+998</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="w-full bg-primary-light border-2 border-primary/10 focus:border-primary/40 rounded-2xl py-5 pl-16 pr-6 text-lg font-bold outline-none transition-all text-on-surface"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <input
                      type="password"
                      placeholder={t('auth.create_pass')}
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full bg-primary-light border-2 border-primary/10 focus:border-primary/40 rounded-2xl py-5 pl-12 pr-6 text-lg font-bold outline-none transition-all text-on-surface"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('auth.login_title')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MarketBottomNav />
    </div>
  );
}
