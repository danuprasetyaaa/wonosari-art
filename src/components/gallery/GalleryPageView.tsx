import React, { useState } from 'react';
import { Sparkles, Maximize2, X, Tag } from 'lucide-react';
import { GalleryItem } from '../../types';
import { GununganIcon } from '../common/JavaneseIcons';

interface GalleryPageViewProps {
  gallery: GalleryItem[];
}

export function GalleryPageView({ gallery }: GalleryPageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const publishedGallery = gallery.filter((g) => g.isPublished);
  const categories = ['all', ...Array.from(new Set(publishedGallery.map((g) => g.category || 'Koleksi')))];

  const filteredGallery = selectedCategory === 'all'
    ? publishedGallery
    : publishedGallery.filter((g) => g.category === selectedCategory);

  return (
    <div id="gallery-page-view" className="py-10 sm:py-16 bg-[#FAF7F2] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] text-[#8C431F] text-xs font-semibold">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span>Dokumentasi Visual</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2413]">
            Galeri Seni & Kerajinan
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            Menelusuri proses tatah sungging, tempa kuningan, atmosfer workshop perajin, hingga sudut display showroom Nusantara Wayang.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C26B38] text-white shadow-sm'
                  : 'bg-white text-[#5C4A3C] border border-[#E8DFD5] hover:bg-[#F3ECE1]'
              }`}
            >
              {cat === 'all' ? 'Semua Galeri' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8DFD5] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFEB]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#261B14]/80 via-[#261B14]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 block">
                      {item.category}
                    </span>
                    <span className="font-serif text-sm font-bold block line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 space-y-1.5 bg-white">
                <span className="text-[11px] font-semibold text-[#8C431F] block">
                  {item.category}
                </span>
                <h3 className="font-serif text-sm font-bold text-[#3A2413] line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-[#7A6B5D] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DFD5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] max-h-[70vh] bg-black">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                aria-label="Tutup lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-2 bg-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C26B38] block">
                {activeLightboxItem.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2413]">
                {activeLightboxItem.title}
              </h3>
              {activeLightboxItem.description && (
                <p className="text-sm text-[#5C4A3C] leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
