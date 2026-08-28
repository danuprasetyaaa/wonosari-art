import {
  BootstrapData,
  Product,
  Category,
  Branch,
  GalleryItem,
  SiteSettings,
  PageContent,
  AdminUser,
  AdminStats,
} from '../types';

const TOKEN_KEY = 'nw_admin_token';
const USER_KEY = 'nw_admin_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AdminUser | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Terjadi kesalahan pada server' }));
    throw new Error(errorData.error || `HTTP Error ${res.status}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// PUBLIC API
// -------------------------------------------------------------

export async function fetchBootstrapData(): Promise<BootstrapData> {
  const res = await fetch('/api/public/bootstrap');
  if (!res.ok) {
    throw new Error('Gagal mengambil data katalog');
  }
  return res.json();
}

export async function fetchPublicProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.featured) query.set('featured', 'true');
  if (params?.sort) query.set('sort', params.sort);

  const res = await fetch(`/api/public/products?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Gagal mengambil daftar produk');
  }
  return res.json();
}

// -------------------------------------------------------------
// AUTH API
// -------------------------------------------------------------

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Login gagal' }));
    throw new Error(data.error || 'Email atau password salah');
  }

  const data = await res.json();
  setStoredAuth(data.token, data.user);
  return data;
}

export async function verifyAuth(): Promise<AdminUser> {
  return fetchWithAuth('/api/auth/me');
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return fetchWithAuth('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// -------------------------------------------------------------
// ADMIN CRUD API
// -------------------------------------------------------------

export async function fetchAdminStats(): Promise<AdminStats> {
  return fetchWithAuth('/api/admin/stats');
}

// Products
export async function fetchAdminProducts(): Promise<Product[]> {
  return fetchWithAuth('/api/admin/products');
}

export async function createAdminProduct(productData: Partial<Product>): Promise<Product> {
  return fetchWithAuth('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateAdminProduct(id: string, productData: Partial<Product>): Promise<Product> {
  return fetchWithAuth(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

export async function deleteAdminProduct(id: string): Promise<{ message: string }> {
  return fetchWithAuth(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// Aliases
export const createProduct = createAdminProduct;
export const updateProduct = updateAdminProduct;
export const deleteProduct = deleteAdminProduct;
export const createCategory = createAdminCategory;
export const updateCategory = updateAdminCategory;
export const deleteCategory = deleteAdminCategory;
export const createBranch = createAdminBranch;
export const updateBranch = updateAdminBranch;
export const deleteBranch = deleteAdminBranch;
export const createGalleryItem = createAdminGallery;
export const updateGalleryItem = updateAdminGallery;
export const deleteGalleryItem = deleteAdminGallery;
export const updatePageContent = updateAdminContent;
export const updateSiteSettings = updateAdminSettings;
export const changeAdminPassword = updateAdminPassword;
export const getAdminProfile = async (): Promise<AdminUser | null> => {
  const token = getStoredToken();
  if (!token) return null;
  try {
    return await verifyAuth();
  } catch {
    clearStoredAuth();
    return null;
  }
};
export const logoutAdmin = clearStoredAuth;

// Categories
export async function fetchAdminCategories(): Promise<Category[]> {
  return fetchWithAuth('/api/admin/categories');
}

export async function createAdminCategory(categoryData: Partial<Category>): Promise<Category> {
  return fetchWithAuth('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export async function updateAdminCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
  return fetchWithAuth(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

export async function deleteAdminCategory(id: string): Promise<{ message: string }> {
  return fetchWithAuth(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  });
}

// Branches
export async function fetchAdminBranches(): Promise<Branch[]> {
  return fetchWithAuth('/api/admin/branches');
}

export async function createAdminBranch(branchData: Partial<Branch>): Promise<Branch> {
  return fetchWithAuth('/api/admin/branches', {
    method: 'POST',
    body: JSON.stringify(branchData),
  });
}

export async function updateAdminBranch(id: string, branchData: Partial<Branch>): Promise<Branch> {
  return fetchWithAuth(`/api/admin/branches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(branchData),
  });
}

export async function deleteAdminBranch(id: string): Promise<{ message: string }> {
  return fetchWithAuth(`/api/admin/branches/${id}`, {
    method: 'DELETE',
  });
}

// Gallery
export async function fetchAdminGallery(): Promise<GalleryItem[]> {
  return fetchWithAuth('/api/admin/gallery');
}

export async function createAdminGallery(galleryData: Partial<GalleryItem>): Promise<GalleryItem> {
  return fetchWithAuth('/api/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(galleryData),
  });
}

export async function updateAdminGallery(id: string, galleryData: Partial<GalleryItem>): Promise<GalleryItem> {
  return fetchWithAuth(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(galleryData),
  });
}

export async function deleteAdminGallery(id: string): Promise<{ message: string }> {
  return fetchWithAuth(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
  });
}

// Content & Settings
export async function updateAdminContent(content: Partial<PageContent>): Promise<PageContent> {
  return fetchWithAuth('/api/admin/content', {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}

export async function updateAdminSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  return fetchWithAuth('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// Upload
export async function uploadMediaFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return fetchWithAuth('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
}

// Reset Seed Data
export async function resetDatabaseSeed(): Promise<{ message: string; data: BootstrapData }> {
  return fetchWithAuth('/api/admin/reset-seed', {
    method: 'POST',
  });
}

// -------------------------------------------------------------
// WHATSAPP URL HELPER
// -------------------------------------------------------------

export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned || '6281234567890';
}

export function buildWhatsAppProductUrl(product: Product, whatsappNumber: string, siteUrl = window.location.origin): string {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const productUrl = `${siteUrl}/#product-${product.slug}`;
  
  const text = `Halo Admin Nusantara Wayang,

Saya ingin menanyakan ketersediaan produk berikut:
• *Nama Produk:* ${product.name}
• *SKU:* ${product.sku}
• *Kategori:* ${product.categoryId}
${product.price ? `• *Estimasi Harga:* Rp ${product.price.toLocaleString('id-ID')}` : ''}
• *Link Katalog:* ${productUrl}

Saya melihat produk ini dari website resmi. Apakah produk tersebut saat ini masih tersedia untuk dipesan?

Terima kasih.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppGeneralUrl(whatsappNumber: string, customMessage?: string): string {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const text = customMessage || `Halo Admin Nusantara Wayang, saya ingin berkonsultasi mengenai koleksi aksesoris wayang dan souvenir budaya Jawa.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
