import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, ShoppingCart, Grid, User as UserIcon, Venus, Dumbbell, Watch, ShoppingBag, Package, Zap, Eye, ArrowRight, X, Globe, ShoppingBag as ShoppingBagIcon, Home, Search, LayoutDashboard, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { IMAGES, PRODUCTS } from '@/src/constants';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { Logo } from './Logo';
import { getMediaUrl } from '@/src/lib/api';

export function MarketHeader() {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const languages = [
    { code: 'uz', name: 'UZ', flag: '🇺🇿' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' },
    { code: 'en', name: 'EN', flag: '🇬🇧' }
  ];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangMenu(false);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        if (!searchQuery) setIsSearchActive(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5" : "bg-white"
      )}>
        <div className="flex items-center justify-between px-3 md:px-8 max-w-screen-2xl mx-auto h-14 md:h-16">
          
          {/* Logo */}
          {!isSearchActive && (
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
              <Logo size="sm" />
            </NavLink>
          )}
          
          {/* Search */}
          <div className={cn(
            "relative flex-1 transition-all duration-500", 
            isSearchActive ? "max-w-xl mx-4" : "max-w-sm hidden md:block mx-auto"
          )} ref={searchRef}>
            <div className="flex items-center gap-3 h-10 bg-zinc-100 px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
              <Search className="w-4 h-4 text-black/25" />
              <input 
                type="text" 
                placeholder={t('common.search_placeholder')}
                value={searchQuery}
                onFocus={() => {
                  setIsSearchActive(true);
                  if (searchQuery.length > 1) setShowResults(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[13px] font-medium w-full placeholder-black/25 text-black outline-none"
              />
              {(searchQuery || isSearchActive) && (
                <button onClick={() => { setSearchQuery(''); setIsSearchActive(false); }}>
                  <X className="w-4 h-4 text-black/30" />
                </button>
              )}
            </div>

            {/* Search results */}
            <AnimatePresence>
              {showResults && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 w-full mt-1 bg-white shadow-2xl border border-black/5 overflow-hidden z-[60]"
                >
                  {searchResults.map(product => (
                    <Link 
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => { setShowResults(false); setIsSearchActive(false); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors"
                    >
                      <img src={getMediaUrl(product.image)} className="w-10 h-10 rounded object-cover bg-zinc-100" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{product.brand}</p>
                        <p className="text-xs font-bold text-black truncate">{product.name}</p>
                      </div>
                      <div className="text-xs font-black text-black shrink-0">{product.price.toLocaleString()}</div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Mobile search toggle */}
            {!isSearchActive && (
              <button onClick={() => setIsSearchActive(true)} className="md:hidden p-2 text-black/50 active:scale-90">
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-black/50 flex items-center gap-1 active:scale-90"
              >
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] font-black uppercase hidden md:block">{i18n.language.toUpperCase()}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 5 }} 
                    className="absolute top-full right-0 mt-1 bg-white shadow-2xl border border-black/5 min-w-[120px] z-[70] overflow-hidden"
                  >
                    {languages.map(lang => (
                      <button 
                        key={lang.code} 
                        onClick={() => changeLang(lang.code)} 
                        className={cn(
                          "w-full px-4 py-2.5 text-xs font-bold text-left flex items-center gap-2.5 hover:bg-zinc-50 transition-colors",
                          i18n.language === lang.code ? "text-black font-black bg-zinc-50" : "text-black/40"
                        )}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <NavLink to="/cart" className="relative p-2 text-black/50 active:scale-90">
              <ShoppingBagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0 w-4 h-4 bg-black text-white text-[8px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Profile — desktop */}
            <NavLink to="/profile" className="p-2 text-black/50 hidden md:block active:scale-90">
              <UserIcon className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Search overlay (mobile) */}
      {isSearchActive && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setIsSearchActive(false)} />}
    </>
  );
}

export function MarketBottomNav() {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-[64px]">
        <BottomNavLink to="/" icon={<Home />} label={t('common.home')} />
        <BottomNavLink to="/search" icon={<Search />} label={t('common.search')} />
        <BottomNavLink to="/cart" icon={<ShoppingBagIcon />} label={t('common.cart')} badge={cartCount} />
        <BottomNavLink to="/wishlist" icon={<Heart />} label={t('common.wishlist')} />
        <BottomNavLink to="/profile" icon={<UserIcon />} label={t('common.profile')} />
      </div>
    </nav>
  );
}

function BottomNavLink({ to, icon, label, badge }: { to: string, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <NavLink to={to} className={({isActive}) => cn(
      "flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative",
      isActive ? 'text-primary' : 'text-zinc-400'
    )}>
      {({ isActive }) => (
        <>
          <div className="relative">
            {React.cloneElement(icon as React.ReactElement, { 
              size: 22,
              className: cn("transition-all duration-300", isActive && "stroke-[2.5px]") 
            })}
            {badge && badge > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full px-1 border-2 border-white">
                {badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
          {isActive && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute top-0 w-10 h-[3px] bg-primary rounded-b-full shadow-[0_2px_10px_rgba(var(--primary-rgb),0.5)]"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export function AdminSideNav() {
  return (
    <aside className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 z-50 bg-surface-container-low border-r border-outline-variant/10 p-6 pt-24">
      <div className="flex items-center gap-3 mb-10 px-2">
        <Logo iconOnly size="sm" />
        <div>
          <h2 className="font-display tracking-widest text-sm text-on-surface uppercase leading-none">MIRVO</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 mt-1">Terminal Control</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        <AdminNavLink to="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
        <AdminNavLink to="/admin/inventory" icon={<Package className="w-5 h-5" />} label="Inventory" />
        <AdminNavLink to="/admin/orders" icon={<ShoppingBag className="w-5 h-5" />} label="Orders" />
        <AdminNavLink to="/admin/analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
      </nav>

      <div className="pt-6 border-t border-outline-variant/10 flex flex-col gap-1">
        <AdminNavLink to="/admin/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
        <AdminNavLink to="/admin/support" icon={<HelpCircle className="w-5 h-5" />} label="Support" />
      </div>
    </aside>
  );
}

function AdminNavLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink to={to} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-primary hover:bg-white/50'}`}>
      {icon}
      <span className="text-sm font-headline tracking-tight">{label}</span>
    </NavLink>
  );
}
