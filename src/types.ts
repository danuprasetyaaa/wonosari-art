export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price?: number;
  material: string;
  dimensions: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4';
  status: 'Published' | 'Draft' | 'Archived' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  badge?: 'Unggulan' | 'Terlaris' | 'Baru' | 'Edisi Terbatas';
  sortOrder: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  googleMapsUrl: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  workingHours: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBadgeText: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutVision: string;
  aboutMission: string;
  aboutValues: string[];
  aboutFoundedYear: string;
  aboutImageUrl: string;
  aboutStoryImageUrl: string;
  philosophyTitle: string;
  philosophyDescription: string;
  whyChooseUs: {
    title: string;
    description: string;
    icon: string;
  }[];
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  featuredProducts: number;
  totalCategories: number;
  totalBranches: number;
  activeBranches: number;
  totalGallery: number;
  publishedGallery: number;
}

export interface BootstrapData {
  categories: Category[];
  products: Product[];
  branches: Branch[];
  gallery: GalleryItem[];
  pageContent: PageContent;
  siteSettings: SiteSettings;
}
