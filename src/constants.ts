import { Product, Category, Sport, SportCategory } from './types';

export const IMAGES = {
  USER_AVATAR: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
  HERO_BANNER: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
  SALES_BANNER: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1920",
};

export const SPORTS: Sport[] = [
  { id: 'boxing', name: 'Boks', icon: 'Boxing', color: '#EF4444', description: 'Professional boks jihozlari va kiyimlari.' },
  { id: 'mma', name: 'MMA', icon: 'Mma', color: '#000000', description: 'Professional aralash jang san\'ati jihozlari.' },
  { id: 'football', name: 'Futbol', icon: 'Football', color: '#10B981', description: 'Elit futbol kiyimlari va jihozlari.' },
  { id: 'basketball', name: 'Basketbol', icon: 'Basketball', color: '#F59E0B', description: 'Professional basketbol kiyimlari.' },
  { id: 'running', name: 'Yugurish', icon: 'Zap', color: '#3B82F6', description: 'Texnik yugurish kiyimlari.' },
];

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: 'b-gloves', name: 'Pro Gloves', sportId: 'boxing' },
  { id: 'b-protection', name: 'Protection', sportId: 'boxing' },
  { id: 'f-boots', name: 'Elite Boots', sportId: 'football' },
  { id: 'f-kits', name: 'Official Kits', sportId: 'football' },
  { id: 'm-gloves', name: 'MMA Gloves', sportId: 'mma' },
  { id: 'm-rash', name: 'Rashguards', sportId: 'mma' },
  { id: 'bk-shoes', name: 'Court Shoes', sportId: 'basketball' },
  { id: 'r-shoes', name: 'Running Shoes', sportId: 'running' },
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Hammasi', icon: 'Grid' },
  { id: 't-shirt', name: 'Futbolka', icon: 'ShoppingBag' },
  { id: 'hoodie', name: 'Hoodie', icon: 'ShoppingBag' },
  { id: 'pants', name: 'Shim', icon: 'ShoppingBag' },
  { id: 'shorts', name: 'Shortik', icon: 'ShoppingBag' },
  { id: 'sport', name: 'Sport', icon: 'Dumbbell' }
];

// ═══════════════════════════════════════════
// FAQAT ERKAKLAR KIYIMLARI — MIRVO MARKETPLACE
// ═══════════════════════════════════════════

export const PRODUCTS: Product[] = [
  // ━━━━ FUTBOLKALAR (T-SHIRTS) ━━━━
  {
    id: 'mt-1',
    name: 'Oversize Training Tee',
    brand: 'MIRVO',
    price: 189000,
    category: 'men',
    subCategory: 't-shirt',
    sport: 'boxing',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    description: 'Premium paxta oversize futbolka. Boks mashg\'ulotlari uchun ideal.',
    rating: 4.9,
    reviews: 247,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#FFFFFF', '#4D4D4D'],
    stock: 45,
    isBestseller: true
  },
  {
    id: 'mt-2',
    name: 'Compression Pro Tee',
    brand: 'MIRVO',
    price: 249000,
    category: 'men',
    subCategory: 't-shirt',
    sport: 'mma',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    description: 'Terga chidamli compression futbolka. MMA va grappling uchun.',
    rating: 4.8,
    reviews: 183,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#1A1A1A'],
    stock: 32
  },
  {
    id: 'mt-3',
    name: 'Dry-Fit Performance Tee',
    brand: 'MIRVO',
    price: 219000,
    category: 'men',
    subCategory: 't-shirt',
    sport: 'running',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    description: 'Yengil va nafas oladigan material. Yugurish va cardio uchun.',
    rating: 4.7,
    reviews: 156,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFFFFF', '#000000', '#333333'],
    stock: 60
  },
  {
    id: 'mt-4',
    name: 'Street Culture Tee',
    brand: 'MIRVO',
    price: 169000,
    category: 'men',
    subCategory: 't-shirt',
    sport: 'basketball',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
    description: 'Urban street style futbolka. Basketbol madaniyati ilhomlantirgan.',
    rating: 4.6,
    reviews: 98,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#FFFFFF'],
    stock: 75
  },

  // ━━━━ HOODILAR ━━━━
  {
    id: 'mh-1',
    name: 'Tech Fleece Hoodie',
    brand: 'MIRVO',
    price: 449000,
    category: 'men',
    subCategory: 'hoodie',
    sport: 'boxing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    description: 'Premium tech fleece hoodie. Issiq va qulay. Ring walkout uchun.',
    rating: 4.9,
    reviews: 312,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#1A1A1A', '#F5F5F5'],
    stock: 18,
    isBestseller: true
  },
  {
    id: 'mh-2',
    name: 'Zip-Up Training Hoodie',
    brand: 'MIRVO',
    price: 389000,
    category: 'men',
    subCategory: 'hoodie',
    sport: 'mma',
    image: 'https://images.unsplash.com/photo-1578768079470-c755908e1837?auto=format&fit=crop&q=80&w=800',
    description: 'Zamochkali sport hoodie. Warm-up va mashg\'ulotdan keyin uchun.',
    rating: 4.8,
    reviews: 167,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#333333'],
    stock: 25
  },
  {
    id: 'mh-3',
    name: 'Oversize Drop Shoulder',
    brand: 'MIRVO',
    price: 359000,
    category: 'men',
    subCategory: 'hoodie',
    sport: 'football',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
    description: 'Keng yelkali oversize hoodie. Kundalik va trenirovka uchun.',
    rating: 4.7,
    reviews: 203,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#F5F5F5', '#000000', '#4D4D4D'],
    stock: 30
  },

  // ━━━━ SHIMLAR (PANTS) ━━━━
  {
    id: 'mp-1',
    name: 'Slim Jogger Pants',
    brand: 'MIRVO',
    price: 329000,
    category: 'men',
    subCategory: 'pants',
    sport: 'running',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    description: 'Slim fit jogger shim. Terga chidamli material. Yugurish uchun.',
    rating: 4.8,
    reviews: 289,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#1A1A1A'],
    stock: 35,
    isBestseller: true
  },
  {
    id: 'mp-2',
    name: 'Wide Leg Cargo Pants',
    brand: 'MIRVO',
    price: 399000,
    category: 'men',
    subCategory: 'pants',
    sport: 'boxing',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    description: 'Keng oyoqli cargo shim. Jang san\'ati uchun maxsus dizayn.',
    rating: 4.6,
    reviews: 134,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#333333', '#4D4D4D'],
    stock: 22
  },

  // ━━━━ SHORTIKLAR (SHORTS) ━━━━
  {
    id: 'ms-1',
    name: 'Pro Fight Shorts',
    brand: 'MIRVO',
    price: 279000,
    category: 'men',
    subCategory: 'shorts',
    sport: 'mma',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800',
    description: 'Professional jang shortiyi. 4-tomonlama cho\'ziluvchi material.',
    rating: 4.9,
    reviews: 445,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF'],
    stock: 50,
    isBestseller: true
  },
  {
    id: 'ms-2',
    name: 'Basketball Mesh Shorts',
    brand: 'MIRVO',
    price: 229000,
    category: 'men',
    subCategory: 'shorts',
    sport: 'basketball',
    image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&q=80&w=800',
    description: 'Basketbol mesh shortiyi. Nafas oladigan va yengil.',
    rating: 4.7,
    reviews: 198,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#1A1A1A', '#FFFFFF'],
    stock: 40
  },
  {
    id: 'ms-3',
    name: '2-in-1 Training Shorts',
    brand: 'MIRVO',
    price: 299000,
    category: 'men',
    subCategory: 'shorts',
    sport: 'running',
    image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&q=80&w=800',
    description: 'Ichki laynerli ikki qatlamli shortik. Yugurish va HIIT uchun.',
    rating: 4.8,
    reviews: 267,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#333333'],
    stock: 38
  },
];
export const REGIONS = [
  { id: 'tashkent', name: 'Toshkent shahri', cities: ['Toshkent'] },
  { id: 'tashkent-r', name: 'Toshkent viloyati', cities: ['Chirchiq', 'Angren', 'Olmaliq', 'Bekobod', 'Yangiyo\'l', 'Nurafshon'] },
  { id: 'samarkand', name: 'Samarqand', cities: ['Samarqand', 'Kattaqo\'rg\'on', 'Urgut', 'Oqdaryo'] },
  { id: 'fergana', name: 'Farg\'ona', cities: ['Farg\'ona', 'Qo\'qon', 'Marg\'ilon', 'Quva'] },
  { id: 'andijan', name: 'Andijon', cities: ['Andijon', 'Asaka', 'Shahrixon', 'Xonobod'] },
  { id: 'namangan', name: 'Namangan', cities: ['Namangan', 'Chust', 'Uychi', 'Kosonsoy'] },
  { id: 'bukhara', name: 'Buxoro', cities: ['Buxoro', 'G\'ijduvon', 'Kogon', 'Vobkent'] },
  { id: 'navoi', name: 'Navoiy', cities: ['Navoiy', 'Zarafshon', 'Qiziltepa'] },
  { id: 'kashkadarya', name: 'Qashqadaryo', cities: ['Qarshi', 'Shahrisabz', 'Kitob', 'Koson'] },
  { id: 'surkhandarya', name: 'Surxondaryo', cities: ['Termiz', 'Denov', 'Sherobod', 'Jarqo\'rg\'on'] },
  { id: 'jizzakh', name: 'Jizzax', cities: ['Jizzax', 'Zomin', 'G\'allaorol'] },
  { id: 'sirdarya', name: 'Sirdaryo', cities: ['Guliston', 'Yangiyer', 'Shirin'] },
  { id: 'khorezm', name: 'Xorazm', cities: ['Urganch', 'Xiva', 'Gurlan'] },
  { id: 'karakalpakstan', name: 'Qoraqalpog\'iston', cities: ['Nukus', 'Xo\'jayli', 'Qo\'ng\'irot', 'Mo\'ynoq'] },
];
