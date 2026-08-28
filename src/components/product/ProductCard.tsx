import React from 'react';
import { Eye, MessageCircle, Sparkles } from 'lucide-react';
import { Product, Category, SiteSettings } from '../../types';
import { buildWhatsAppProductUrl } from '../../services/api';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  categories: Category[];
  siteSettings: SiteSettings;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({ product, categories, siteSettings, onOpenDetail }: ProductCardProps) {
  const category = categories.find((c) => c.id === product.categoryId);
  const mainImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
  const whatsappUrl = buildWhatsAppProductUrl(product, siteSettings.whatsapp);

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'Unggulan':
        return 'bg-gradient-to-r from-[#C26B38] to-[#9E4E22] text-white';
      case 'Terlaris':
        return 'bg-amber-600 text-white';
      case 'Baru':
        return 'bg-emerald-700 text-white';
      case 'Edisi Terbatas':
        return 'bg-[#5C3A21] text-amber-200';
      default:
        return 'bg-[#8C5D38] text-white';
    }
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFD5] hover:border-[#C26B38]/40 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5EFEB]">
        <img
          src={mainImage}
          alt={product.images?.[0]?.alt || product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm ${getBadgeClass(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {product.featured && !product.badge && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C26B38] text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Unggulan
            </span>
          )}
        </div>

        {/* Category Pill */}
        {category && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#2C241E]/80 backdrop-blur-sm text-[#F5EFEB]">
              {category.name}
            </span>
          </div>
        )}

        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-[#2C241E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={() => onOpenDetail(product)}
            className="px-4 py-2 rounded-full bg-white text-[#2C241E] text-sm font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 flex items-center gap-2 hover:bg-[#FAF7F2] cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#C26B38]" />
            Lihat Detail
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-serif text-lg font-bold text-[#3A2413] group-hover:text-[#C26B38] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#7A6B5D] mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Bottom Specs & Actions */}
        <div className="pt-3 border-t border-[#F0E8DF] flex items-center justify-between gap-2">
          {product.price ? (
            <div>
              <span className="text-[10px] text-[#8C7A6B] block">Estimasi</span>
              <span className="text-sm font-bold text-[#8C431F]">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[11px] font-medium text-[#7A6B5D] bg-[#F5EFEB] px-2 py-0.5 rounded">
                Karya Pilihan
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              id={`btn-detail-${product.slug}`}
              onClick={() => onOpenDetail(product)}
              className="px-3 py-1.5 rounded-lg border border-[#D8C7B5] hover:border-[#C26B38] text-[#5C4A3C] hover:text-[#C26B38] text-xs font-medium transition-colors cursor-pointer"
            >
              Detail
            </button>
            <a
              id={`btn-wa-${product.slug}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#1E9E4B] hover:text-white transition-colors"
              title="Tanyakan via WhatsApp"
              aria-label="Tanyakan produk via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
