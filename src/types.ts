export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string; // Thematic color for the sport
  description?: string;
}

export interface SportCategory {
  id: string;
  name: string;
  sportId: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  subCategory?: string;
  sport?: string; // e.g., 'boxing', 'football'
  sportCategory?: string; // e.g., 'gloves', 'boots'
  image: string;
  imageAlt?: string; // Optional secondary image for hover
  description: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  stock: number; // Urgency indicator
  isBestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: { id: string, name: string }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'On Way' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  date: string;
  total: number;
  address: string;
}
