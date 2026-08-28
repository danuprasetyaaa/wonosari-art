import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { Product, Category, SiteSettings } from '../../types';
import { buildWhatsAppProductUrl } from '../../services/api';
import { GununganIcon } from '../common/JavaneseIcons';

interface FeaturedProductsProps {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
  onOpenDetail: (product: Product) => void;
  onViewAllProducts: () => void;
}

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
  onOpenDetail: (product: Product) => void;
  onViewAll: () => void;
}

// Single Experience / Product Card component styled after user's Carousel Card with Heritage palette
function ProductCarouselCard({
  product,
  categories,
  siteSettings,
  onOpenDetail,
}: {
  product: Product;
  categories: Category[];
  siteSettings: SiteSettings;
  onOpenDetail: (product: Product) => void;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('nw_favorites') || '[]');
      setIsFavorite(favs.includes(product.id));
    } catch {
      // ignore local storage errors
    }
  }, [product.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('nw_favorites') || '[]');
      let updated: string[];
      if (favs.includes(product.id)) {
        updated = favs.filter((id) => id !== product.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, product.id];
        setIsFavorite(true);
      }
      localStorage.setItem('nw_favorites', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const category = categories.find((c) => c.id === product.categoryId);
  const primaryImage =
    product.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';

  const formattedPrice =
    product.price && product.price > 0
      ? `Rp ${product.price.toLocaleString('id-ID')}`
      : 'Hubungi Kami';

  const badgeText =
    product.badge || (product.featured ? 'Karya Unggulan' : category?.name || 'Wayang Asli');

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative flex h-[340px] sm:h-[350px] w-full flex-col overflow-hidden rounded-2xl bg-white border border-[#E8DFD5] shadow-xs transition-all duration-300 hover:shadow-xl hover:border-[#D8C7B5] hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Top Image Container (Aspect 4:3 as in user's snippet) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-[#FAF7F2]">
        <img
          src={primaryImage}
          alt={product.images?.[0]?.alt || product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/85 text-[#5C4A3C] backdrop-blur-md hover:bg-white hover:text-rose-600 transition-all shadow-xs"
          aria-label="Simpan ke Favorit"
        >
          <Heart
            className={`h-4 w-4 stroke-[2.2px] transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Badge with clean styling & heritage dark backdrop */}
        {badgeText && (
          <div className="absolute top-2.5 left-2.5 rounded-lg bg-[#3A2413]/85 backdrop-blur-sm px-2.5 py-1 font-medium text-[#E5A962] text-[11px] tracking-wide border border-[#FAF7F2]/10">
            {badgeText}
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#8C5D38] font-medium">
            <span className="truncate max-w-[150px]">{category?.name || 'Aksesoris Wayang'}</span>
            {product.dimensions && (
              <span className="text-[#A89889] text-[10px] truncate">{product.dimensions}</span>
            )}
          </div>

          <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A2413] tracking-tight line-clamp-1 group-hover:text-[#C26B38] transition-colors">
            {product.name}
          </h3>

          <p className="text-[#7A6B5D] text-xs line-clamp-1">
            {product.material || product.shortDescription || 'Pahatan tatah sungging khas nusantara'}
          </p>
        </div>

        {/* Card Footer with Rating, Autentik text & Price */}
        <div className="mt-3 pt-2.5 border-t border-[#F3ECE1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#3A2413] font-semibold">
            <Star className="h-3.5 w-3.5 fill-[#E5A962] text-[#E5A962]" />
            <span>4.9</span>
            <span className="text-[#A89889] font-normal text-[11px]">(Autentik)</span>
          </div>

          <div className="text-right">
            <span className="font-bold text-[#8C431F] text-xs sm:text-sm font-sans">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Carousel section supporting smooth left/right horizontal scrolling
function ProductCarouselSection({
  title,
  subtitle,
  products,
  categories,
  siteSettings,
  onOpenDetail,
  onViewAll,
}: ProductCarouselSectionProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -320,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="w-full py-3 sm:py-5">
      {/* Header with Navigation Controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#8C431F]">
              Koleksi Budaya
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#3A2413] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#7A6B5D] mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Geser ke kiri"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-[#D8C7B5] bg-white hover:bg-[#FAF3EC] text-[#5C4A3C] hover:text-[#3A2413] flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Geser ke kanan"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-[#D8C7B5] bg-white hover:bg-[#FAF3EC] text-[#5C4A3C] hover:text-[#3A2413] flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onViewAll}
            className="ml-2 text-xs font-bold text-[#C26B38] hover:text-[#8C431F] hover:underline flex items-center gap-1 transition-colors cursor-pointer py-2 px-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap Scroll Container */}
      <div
        ref={scrollContainer}
        className="flex snap-x snap-mandatory gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            className="w-[245px] sm:w-[270px] md:w-[290px] flex-none snap-start"
          >
            <ProductCarouselCard
              product={item}
              categories={categories}
              siteSettings={siteSettings}
              onOpenDetail={onOpenDetail}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedProducts({
  products,
  categories,
  siteSettings,
  onOpenDetail,
  onViewAllProducts,
}: FeaturedProductsProps) {
  // Filter into two curated carousel rows
  const featuredProducts = products.filter((p) => p.featured);
  const otherProducts = products.filter((p) => !p.featured);

  const firstCarouselItems =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);
  const secondCarouselItems =
    otherProducts.length > 0 ? otherProducts : products;

  return (
    <section
      id="featured-products-section"
      className="py-14 sm:py-20 bg-[#FAF7F2] border-y border-[#E8DFD5]/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Main Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF3EC] border border-[#E8DFD5] text-[#8C431F] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C26B38]" />
            <span>Katalog Pilihan Nusantara</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2413]">
            Karya & Aksesoris Pilihan
          </h2>
          <p className="text-sm text-[#7A6B5D] leading-relaxed">
            Eksplorasi koleksi aksesoris, cinderamata, dan pajangan wayang dengan tatah sungging autentik dari pengrajin lokal Nusantara.
          </p>
        </div>

        {/* Carousel Row 1: Koleksi Pilihan Utama */}
        <ProductCarouselSection
          title="Koleksi Karya Unggulan ›"
          subtitle="Pajangan dinding, gunungan eksklusif, dan miniatur wayang pilihan kurasi terbaik."
          products={firstCarouselItems}
          categories={categories}
          siteSettings={siteSettings}
          onOpenDetail={onOpenDetail}
          onViewAll={onViewAllProducts}
        />

        {/* Carousel Row 2: Aksesoris & Souvenir Populer */}
        {secondCarouselItems.length > 0 && (
          <ProductCarouselSection
            title="Aksesoris & Souvenir Budaya Jawa ›"
            subtitle="Gantungan kunci, pembatas buku, dan cinderamata khas untuk buah tangan serta acara spesial."
            products={secondCarouselItems}
            categories={categories}
            siteSettings={siteSettings}
            onOpenDetail={onOpenDetail}
            onViewAll={onViewAllProducts}
          />
        )}

        {/* Bottom CTA Banner */}
        <div className="pt-2 text-center">
          <button
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#C26B38] hover:bg-[#A8582B] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Buka Semua Katalog Produk ({products.length} Item)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
