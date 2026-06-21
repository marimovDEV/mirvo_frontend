// MIRVO API Service
const API_BASE = import.meta.env.VITE_API_URL || 'https://mapi.pizzacentergarden.uz/api/v1';
const MEDIA_BASE = API_BASE.replace('/api/v1', '');

export const getMediaUrl = (url: string | null | undefined) => {
  if (!url) return 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400';
  if (url.startsWith('http')) {
    if (url.includes('localhost:4000') && !window.location.hostname.includes('localhost')) {
      return url.replace('http://localhost:4000', MEDIA_BASE);
    }
    return url;
  }
  return `${MEDIA_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ═══════════════════════════════════════════
// HTTP Client
// ═══════════════════════════════════════════
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('mirvo_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request<T>(method: string, path: string, body?: any, params?: Record<string, any>): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') searchParams.append(k, String(v));
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const res = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }

    // Unwrap { data } only when no meta (pagination) is present
    if (data && data.data !== undefined && data.meta === undefined) {
      return data.data;
    }

    return data;
  }

  get<T>(path: string, params?: Record<string, any>) {
    return this.request<T>('GET', path, undefined, params);
  }

  post<T>(path: string, body?: any) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: any) {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body?: any) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

export const api = new ApiClient(API_BASE);

// ═══════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════
export const authApi = {
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, code: string, data?: any) =>
    api.post<{ user: any; token: string; isNew: boolean }>('/auth/verify-otp', { phone, code, ...data }),
  login: (phone: string, password: string) =>
    api.post<{ user: any; token: string }>('/auth/login', { phone, password }),
  adminLogin: (phone: string, password: string) =>
    api.post<{ user: any; token: string }>('/auth/admin/login', { phone, password }),
  getProfile: () => api.get('/auth/profile'),
};

// ═══════════════════════════════════════════
// USERS API
// ═══════════════════════════════════════════
export const usersApi = {
  getMe: () => api.get('/auth/profile'),
  updateMe: (data: any) => api.put('/auth/profile/update', data),
  getWishlist: () => api.get<any[]>('/users/me/wishlist'),
  addToWishlist: (productId: string) => api.post(`/users/${productId}/wishlist`),
  removeFromWishlist: (productId: string) => api.delete(`/users/${productId}/wishlist`),
};

// ═══════════════════════════════════════════
// SPORTS API
// ═══════════════════════════════════════════
export const sportsApi = {
  getAll: () => api.get<any[]>('/sports'),
  getOne: (id: string) => api.get(`/sports/${id}`),
};

// ═══════════════════════════════════════════
// CATEGORIES API
// ═══════════════════════════════════════════
export const categoriesApi = {
  getAll: (sportId?: string) => api.get<any[]>('/categories', sportId ? { sportId } : undefined),
  getOne: (id: string) => api.get(`/categories/${id}`),
};

// ═══════════════════════════════════════════
// PRODUCTS API
// ═══════════════════════════════════════════
export const productsApi = {
  getAll: (params?: {
    search?: string; sportId?: string; categoryId?: string; brand?: string;
    minPrice?: number; maxPrice?: number; size?: string; color?: string;
    sort?: string; page?: number; limit?: number;
    featured?: boolean; bestseller?: boolean; isNew?: boolean; isTrending?: boolean; isLimited?: boolean;
  }) => api.get<{ data: any[]; meta: any }>('/products', params as any),
  getFeatured: (limit = 10) => api.get<any[]>('/products/featured', { limit }),
  getBestsellers: (limit = 10) => api.get<any[]>('/products/bestsellers', { limit }),
  getNewArrivals: (limit = 10) => api.get<any[]>('/products/new-arrivals', { limit }),
  getTrending: (limit = 10) => api.get<any[]>('/products/trending', { limit }),
  getBrands: (sportId?: string) => api.get<string[]>('/products/brands', sportId ? { sportId } : undefined),
  getOne: (id: string) => api.get<any>(`/products/${id}`),
};

// ═══════════════════════════════════════════
// CART API  (backend-synced)
// ═══════════════════════════════════════════
export const cartApi = {
  getCart: () => api.get<{ items: any[]; subtotal: number; itemCount: number }>('/cart'),
  addToCart: (data: { productId: string; quantity: number; selectedSize?: string; selectedColor?: string }) =>
    api.post<{ items: any[]; subtotal: number; itemCount: number }>('/cart/add', data),
  updateQuantity: (itemId: string, quantity: number) =>
    api.put<{ items: any[]; subtotal: number; itemCount: number }>(`/cart/${itemId}/update`, { quantity }),
  removeFromCart: (itemId: string) =>
    api.delete<{ items: any[]; subtotal: number; itemCount: number }>(`/cart/${itemId}/remove`),
  clearCart: () => api.delete<{ items: any[]; subtotal: number; itemCount: number }>('/cart/clear'),
};

// ═══════════════════════════════════════════
// ORDERS API
// ═══════════════════════════════════════════
export const ordersApi = {
  createOrder: (data: {
    paymentMethod: string; deliveryAddress: string; city?: string; region?: string;
    phone: string; recipientName?: string; promoCode?: string | null;
    notes?: string; items?: any[]; subtotal?: number; total?: number;
    deliveryFee?: number; discount?: number;
  }) => api.post<any>('/orders', data),
  getMyOrders: (page = 1) => api.get<any>('/orders', { page }),
  getOne: (id: string) => api.get<any>(`/orders/${id}`),
  cancelOrder: (id: string, reason?: string) => api.post(`/orders/${id}/cancel`, { reason }),
  getMyOrderCount: () => api.get<number>('/orders/my/count'),
};

// ═══════════════════════════════════════════
// RETURNS API
// ═══════════════════════════════════════════
export const returnsApi = {
  getMyReturns: () => api.get<any>('/returns/my'),
  createReturn: (data: {
    orderId: string; reason: string; description?: string;
    type?: 'return' | 'exchange'; refundType?: string; amount?: number; images?: string[];
  }) => api.post<any>('/returns/create', data),
};

// ═══════════════════════════════════════════
// PROMO API
// ═══════════════════════════════════════════
export const promoApi = {
  validate: (code: string, orderAmount: number) =>
    api.post<{ valid: boolean; discount: number; message: string }>('/promo/validate', { code, orderAmount }),
  getAvailable: () => api.get<any[]>('/promo/available'),
};

// ═══════════════════════════════════════════
// REFERRAL API
// ═══════════════════════════════════════════
export const referralApi = {
  getMyStats: () => api.get('/referral/my-stats'),
};

// ═══════════════════════════════════════════
// B2B API
// ═══════════════════════════════════════════
export const b2bApi = {
  apply: (data: {
    fullName: string; phone: string; email?: string; city: string;
    businessType: string; businessName?: string; message?: string;
  }) => api.post('/b2b', data),
};

// ═══════════════════════════════════════════
// ADDRESSES API
// ═══════════════════════════════════════════
export const addressesApi = {
  getAll: () => api.get<any[]>('/auth/me/addresses'),
  create: (data: any) => api.post('/auth/me/addresses/add', data),
  update: (id: string, data: any) => api.patch(`/auth/${id}/addresses/update`, data),
  delete: (id: string) => api.delete(`/auth/${id}/addresses/delete`),
};

// ═══════════════════════════════════════════
// CARDS API
// ═══════════════════════════════════════════
export const cardsApi = {
  getAll: () => api.get<any[]>('/auth/me/cards'),
  create: (data: any) => api.post('/auth/me/cards/add', data),
  delete: (id: string) => api.delete(`/auth/${id}/cards/delete`),
};

// ═══════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════
export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get<any>('/admin/dashboard'),
  getRevenueChart: (period: 'daily' | 'monthly' = 'monthly') =>
    api.get('/admin/revenue-chart', { period }),

  // Users
  getUsers: (params?: { search?: string; role?: string }) =>
    api.get<any>('/admin/users', params),
  giveBonus: (userId: string, amount: number) =>
    api.post(`/admin/${userId}/give-bonus`, { amount }),

  // Orders
  getOrders: (params?: { status?: string; search?: string }) =>
    api.get<any>('/admin/orders', params),
  updateOrderStatus: (id: string, data: { status: string }) =>
    api.patch(`/admin/${id}/orders/status`, data),

  // Products
  getProducts: (params?: any) => api.get<any>('/products', params),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  // Sports
  getSports: () => api.get<any[]>('/sports'),
  createSport: (data: any) => api.post('/sports', data),
  updateSport: (id: string, data: any) => api.put(`/sports/${id}`, data),
  deleteSport: (id: string) => api.delete(`/sports/${id}`),

  // Categories
  getCategories: (params?: any) => api.get<any[]>('/categories', params),
  createCategory: (data: any) => api.post('/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),

  // Promos
  getPromos: () => api.get<any>('/promo'),
  createPromo: (data: any) => api.post('/promo', data),
  updatePromo: (id: string, data: any) => api.put(`/promo/${id}`, data),
  deletePromo: (id: string) => api.delete(`/promo/${id}`),

  // B2B
  getB2BApplications: (params?: any) => api.get<any>('/b2b', params),
  updateB2BStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/b2b/${id}/status`, { status, notes }),

  // Payments & Returns
  getPayments: (params?: any) => api.get<any>('/admin/payments', params),
  getReturns: (params?: any) => api.get<any>('/admin/returns', params),
  updateReturnStatus: (id: string, status: string, adminNotes?: string) =>
    api.patch(`/admin/${id}/returns/status`, { status, adminNotes }),

  // Analytics
  getSportsSummary: () => api.get('/admin/sports-summary'),

  // Ambassadors
  getAmbassadors: (params?: any) => api.get<any>('/referral/ambassadors', params),
  getReferralHistory: (params?: any) => api.get<any>('/referral/history', params),
};
