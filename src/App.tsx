import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchBootstrapData,
  getAdminProfile,
  logoutAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createBranch,
  updateBranch,
  deleteBranch,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updatePageContent,
  updateSiteSettings,
} from './services/api';
import {
  BootstrapData,
  Product,
  Category,
  Branch,
  GalleryItem,
  PageContent,
  SiteSettings,
  AdminUser,
} from './types';

// Layout & Common
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GununganIcon } from './components/common/JavaneseIcons';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppGeneralUrl } from './services/api';

// Customer Views & Components
import { HeroSection } from './components/home/HeroSection';
import { AboutPreview } from './components/home/AboutPreview';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { PhilosophySection } from './components/home/PhilosophySection';
import { WhatsAppCta } from './components/home/WhatsAppCta';
import { ProductModal } from './components/product/ProductModal';
import { ProductCatalogView } from './components/product/ProductCatalogView';
import { AboutPageView } from './components/about/AboutPageView';
import { BranchPageView } from './components/branch/BranchPageView';
import { GalleryPageView } from './components/gallery/GalleryPageView';
import { ContactPageView } from './components/contact/ContactPageView';

// Admin CMS Views
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { AdminProductsView } from './components/admin/AdminProductsView';
import { AdminCategoriesView } from './components/admin/AdminCategoriesView';
import { AdminBranchesView } from './components/admin/AdminBranchesView';
import { AdminGalleryView } from './components/admin/AdminGalleryView';
import { AdminContentView } from './components/admin/AdminContentView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

export default function App() {
  // Data State
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'products' | 'gallery' | 'branches' | 'contact'>('home');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Admin Portal State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState('overview');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Load Initial Bootstrap Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBootstrapData();
      setData(res);

      // Check if admin is currently logged in via token
      const profile = await getAdminProfile();
      if (profile) {
        setAdminUser(profile);
      }
    } catch (err: any) {
      console.error('Bootstrap data error:', err);
      setError('Gagal memuat data website. Pastikan server aktif.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // URL Hash Listener for direct navigation, product slugs, and secret admin access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash === 'admin') {
        setIsAdminMode(true);
      } else if (hash.startsWith('product-') && data) {
        const slug = hash.replace('product-', '');
        const found = data.products.find((p) => p.slug === slug);
        if (found) {
          setActiveModalProduct(found);
        }
      } else if (['home', 'about', 'products', 'gallery', 'branches', 'contact'].includes(hash)) {
        setCurrentTab(hash as any);
        setIsAdminMode(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [data]);

  // Keyboard shortcut for discrete Admin portal access (Ctrl+Alt+A or Cmd+Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNavigate = (tab: string, categoryId?: string) => {
    setIsAdminMode(false);
    setCurrentTab(tab as any);
    if (categoryId) {
      setSelectedCatalogCategory(categoryId);
    }
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminMode(true);
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    window.location.hash = currentTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    setIsAdminMode(false);
    window.location.hash = 'home';
  };

  // CRUD Handlers for Admin
  const handleSaveProduct = async (productData: Partial<Product>, isEditing: boolean, productId?: string) => {
    if (isEditing && productId) {
      const updated = await updateProduct(productId, productData);
      setData((prev) =>
        prev
          ? {
              ...prev,
              products: prev.products.map((p) => (p.id === productId ? updated : p)),
            }
          : null
      );
    } else {
      const created = await createProduct(productData);
      setData((prev) => (prev ? { ...prev, products: [created, ...prev.products] } : null));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setData((prev) =>
      prev ? { ...prev, products: prev.products.filter((p) => p.id !== productId) } : null
    );
  };

  const handleSaveCategory = async (catData: Partial<Category>, isEditing: boolean, catId?: string) => {
    if (isEditing && catId) {
      const updated = await updateCategory(catId, catData);
      setData((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((c) => (c.id === catId ? updated : c)),
            }
          : null
      );
    } else {
      const created = await createCategory(catData);
      setData((prev) => (prev ? { ...prev, categories: [...prev.categories, created] } : null));
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    await deleteCategory(catId);
    setData((prev) =>
      prev ? { ...prev, categories: prev.categories.filter((c) => c.id !== catId) } : null
    );
  };

  const handleSaveBranch = async (branchData: Partial<Branch>, isEditing: boolean, branchId?: string) => {
    if (isEditing && branchId) {
      const updated = await updateBranch(branchId, branchData);
      setData((prev) =>
        prev
          ? {
              ...prev,
              branches: prev.branches.map((b) => (b.id === branchId ? updated : b)),
            }
          : null
      );
    } else {
      const created = await createBranch(branchData);
      setData((prev) => (prev ? { ...prev, branches: [...prev.branches, created] } : null));
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    await deleteBranch(branchId);
    setData((prev) =>
      prev ? { ...prev, branches: prev.branches.filter((b) => b.id !== branchId) } : null
    );
  };

  const handleSaveGallery = async (itemData: Partial<GalleryItem>, isEditing: boolean, itemId?: string) => {
    if (isEditing && itemId) {
      const updated = await updateGalleryItem(itemId, itemData);
      setData((prev) =>
        prev
          ? {
              ...prev,
              gallery: prev.gallery.map((g) => (g.id === itemId ? updated : g)),
            }
          : null
      );
    } else {
      const created = await createGalleryItem(itemData);
      setData((prev) => (prev ? { ...prev, gallery: [created, ...prev.gallery] } : null));
    }
  };

  const handleDeleteGallery = async (itemId: string) => {
    await deleteGalleryItem(itemId);
    setData((prev) =>
      prev ? { ...prev, gallery: prev.gallery.filter((g) => g.id !== itemId) } : null
    );
  };

  const handleSaveContent = async (updatedContent: PageContent) => {
    const saved = await updatePageContent(updatedContent);
    setData((prev) => (prev ? { ...prev, pageContent: saved } : null));
  };

  const handleSaveSettings = async (updatedSettings: SiteSettings) => {
    const saved = await updateSiteSettings(updatedSettings);
    setData((prev) => (prev ? { ...prev, siteSettings: saved } : null));
  };

  // Loading State
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#C26B38] flex items-center justify-center text-amber-100 shadow-xl animate-pulse">
          <GununganIcon className="w-10 h-10" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="font-serif text-xl font-bold text-[#3A2413]">Nusantara Wayang</h2>
          <p className="text-xs text-[#8C5D38] tracking-widest uppercase">Memuat Karya & Warisan Budaya...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <GununganIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3A2413]">Terjadi Kendala</h2>
        <p className="text-sm text-[#7A6B5D] max-w-md">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2.5 rounded-full bg-[#C26B38] text-white font-semibold text-xs shadow-md"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  const { products, categories, branches, gallery, pageContent, siteSettings } = data;
  const publishedProducts = products.filter((p) => (p.status || '').toUpperCase() === 'PUBLISHED');

  // Floating direct WhatsApp URL
  const floatingWaUrl = buildWhatsAppGeneralUrl(
    siteSettings.whatsapp,
    'Halo Admin Nusantara Wayang, saya ingin bertanya seputar produk wayang dan souvenir budaya Jawa.'
  );

  // ================= ADMIN PORTAL RENDER =================
  if (isAdminMode) {
    if (!adminUser) {
      return (
        <AdminLoginView
          onLoginSuccess={(user) => setAdminUser(user)}
          onBackToCustomer={handleExitAdmin}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        adminUser={adminUser}
        siteSettings={siteSettings}
        onLogout={handleAdminLogout}
        onViewWebsite={handleExitAdmin}
      >
        {adminTab === 'overview' && (
          <AdminDashboardOverview
            products={products}
            categories={categories}
            branches={branches}
            gallery={gallery}
            siteSettings={siteSettings}
            onNavigateTab={setAdminTab}
            onAddProduct={() => setAdminTab('products')}
          />
        )}

        {adminTab === 'products' && (
          <AdminProductsView
            products={products}
            categories={categories}
            siteSettings={siteSettings}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {adminTab === 'categories' && (
          <AdminCategoriesView
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {adminTab === 'branches' && (
          <AdminBranchesView
            branches={branches}
            onSaveBranch={handleSaveBranch}
            onDeleteBranch={handleDeleteBranch}
          />
        )}

        {adminTab === 'gallery' && (
          <AdminGalleryView
            gallery={gallery}
            onSaveGallery={handleSaveGallery}
            onDeleteGallery={handleDeleteGallery}
          />
        )}

        {adminTab === 'content' && (
          <AdminContentView
            content={pageContent}
            onSaveContent={handleSaveContent}
          />
        )}

        {adminTab === 'settings' && (
          <AdminSettingsView
            siteSettings={siteSettings}
            onSaveSettings={handleSaveSettings}
            onRefreshData={loadData}
          />
        )}
      </AdminLayout>
    );
  }

  // ================= CUSTOMER WEBSITE RENDER =================
  return (
    <div
      className={`min-h-screen flex flex-col antialiased selection:bg-[#C26B38]/20 selection:text-[#8C431F] ${
        currentTab === 'home' ? 'bg-[#1A110B] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#3A2413]'
      }`}
    >
      {/* Sticky Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        siteSettings={siteSettings}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              content={pageContent}
              siteSettings={siteSettings}
              onExploreProducts={() => handleNavigate('products')}
              onAboutClick={() => handleNavigate('about')}
            />

            <AboutPreview
              content={pageContent}
              onReadMore={() => handleNavigate('about')}
            />

            <FeaturedProducts
              products={publishedProducts}
              categories={categories}
              siteSettings={siteSettings}
              onOpenDetail={(product) => setActiveModalProduct(product)}
              onViewAllProducts={() => handleNavigate('products')}
            />

            <WhyChooseUs content={pageContent} />

            <PhilosophySection content={pageContent} />

            <WhatsAppCta siteSettings={siteSettings} />
          </>
        )}

        {currentTab === 'about' && (
          <AboutPageView
            content={pageContent}
            siteSettings={siteSettings}
            onExploreProducts={() => handleNavigate('products')}
          />
        )}

        {currentTab === 'products' && (
          <ProductCatalogView
            products={publishedProducts}
            categories={categories}
            siteSettings={siteSettings}
            selectedCategory={selectedCatalogCategory}
            onSelectCategory={setSelectedCatalogCategory}
            onOpenDetail={(product) => setActiveModalProduct(product)}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPageView gallery={gallery} />
        )}

        {currentTab === 'branches' && (
          <BranchPageView
            branches={branches}
            siteSettings={siteSettings}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPageView siteSettings={siteSettings} />
        )}
      </main>

      {/* Global Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        categories={categories}
        siteSettings={siteSettings}
        onClose={() => {
          setActiveModalProduct(null);
          if (window.location.hash.startsWith('#product-')) {
            window.location.hash = currentTab;
          }
        }}
      />

      {/* Floating WhatsApp Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={floatingWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="Konsultasi via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute right-16 bg-[#261B14] text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Chat Kami di WhatsApp
        </span>
      </a>

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        categories={categories}
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
      />
    </div>
  );
}
