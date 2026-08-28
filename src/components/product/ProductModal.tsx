import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Sparkles,
  Layers,
  Maximize2,
  Tag,
  CheckCircle2,
  PlayCircle,
  Share2,
} from 'lucide-react';
import { Product, Category, SiteSettings } from '../../types';
import { buildWhatsAppProductUrl } from '../../services/api';

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  siteSettings: SiteSettings;
  onClose: () => void;
}

export function ProductModal({ product, categories, siteSettings, onClose }: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('photos');
    setCopiedLink(false);
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const category = categories.find((c) => c.id === product.categoryId);
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'default', imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', alt: product.name, sortOrder: 1 }];

  const currentImage = images[activeImageIndex] || images[0];
  const whatsappUrl = buildWhatsAppProductUrl(product, siteSettings.whatsapp);

  // Helper to parse video embed URL
  const getEmbedVideoUrl = (url?: string, type?: string) => {
    if (!url) return null;
    if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : url;
    }
    if (type === 'vimeo' || url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : url;
    }
    return url;
  };

  const videoEmbedUrl = getEmbedVideoUrl(product.videoUrl, product.videoType);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#product-${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD5] bg-white/70 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C26B38]">
              Katalog Nusantara Wayang
            </span>
            {product.sku && (
              <span className="text-xs text-[#8C7A6B] bg-[#F3ECE1] px-2.5 py-0.5 rounded-full font-mono">
                {product.sku}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Salin tautan produk"
              className="p-2 rounded-full text-[#7A6B5D] hover:bg-[#EFE7DC] hover:text-[#2C241E] transition-colors"
            >
              {copiedLink ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tersalin!
                </span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full text-[#7A6B5D] hover:bg-[#EFE7DC] hover:text-[#2C241E] transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visual Media Gallery & Video */}
            <div className="lg:col-span-6 space-y-4">
              {/* Media Mode Tabs if Video Available */}
              {videoEmbedUrl && (
                <div className="flex items-center gap-2 border-b border-[#E8DFD5] pb-2">
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'photos'
                        ? 'bg-[#C26B38] text-white'
                        : 'bg-[#EFE7DC] text-[#5C4A3C] hover:bg-[#E5DCD1]'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Galeri Foto ({images.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'video'
                        ? 'bg-[#C26B38] text-white'
                        : 'bg-[#EFE7DC] text-[#5C4A3C] hover:bg-[#E5DCD1]'
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Video Produk
                  </button>
                </div>
              )}

              {/* Main Image or Video Player */}
              {activeTab === 'photos' || !videoEmbedUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E8DFD5] shadow-inner group">
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.alt || product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-all duration-300"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C26B38] text-white shadow-md">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? 'border-[#C26B38] ring-2 ring-[#C26B38]/30 scale-105'
                              : 'border-[#E8DFD5] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img.imageUrl}
                            alt={img.alt || `Foto ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Video Player */
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#E8DFD5] shadow-md">
                  {product.videoType === 'mp4' || product.videoUrl?.endsWith('.mp4') ? (
                    <video controls className="w-full h-full object-contain">
                      <source src={product.videoUrl} type="video/mp4" />
                      Browser Anda tidak mendukung tag video.
                    </video>
                  ) : (
                    <iframe
                      src={videoEmbedUrl}
                      title={`Video ${product.name}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Product Details & WhatsApp Conversion */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE7DC] text-[#8C431F] mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    {category.name}
                  </span>
                )}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413] leading-tight">
                  {product.name}
                </h2>
                {product.price && (
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#8C431F]">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">(Estimasi per unit)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#7A6B5D]">
                  Deskripsi Karya
                </h4>
                <p className="text-sm text-[#4E3E31] leading-relaxed whitespace-pre-line">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Specification Grid */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD5] space-y-3 shadow-xs">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#7A6B5D] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C26B38]" />
                  Spesifikasi & Material
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.material && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                      <span className="text-[#8C7A6B] block mb-0.5">Material:</span>
                      <span className="font-semibold text-[#3A2413]">{product.material}</span>
                    </div>
                  )}

                  {product.dimensions && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                      <span className="text-[#8C7A6B] block mb-0.5">Ukuran / Dimensi:</span>
                      <span className="font-semibold text-[#3A2413]">{product.dimensions}</span>
                    </div>
                  )}

                  {product.sku && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                      <span className="text-[#8C7A6B] block mb-0.5">Kode SKU:</span>
                      <span className="font-semibold font-mono text-[#3A2413]">{product.sku}</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                    <span className="text-[#8C7A6B] block mb-0.5">Ketersediaan:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Konfirmasi Langsung
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary WhatsApp Action Box */}
              <div className="pt-2">
                <a
                  id="modal-cta-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Tanyakan Ketersediaan via WhatsApp</span>
                </a>
                <p className="text-center text-[11px] text-[#8C7A6B] mt-2.5">
                  Format pesan otomatis berisi detail & SKU produk akan langsung disiapkan saat Anda membuka WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
