import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, X, ArrowUpDown, Tag } from 'lucide-react';
import { Product, Category, SiteSettings } from '../../types';
import { ProductCard } from './ProductCard';
import { GununganIcon } from '../common/JavaneseIcons';

interface ProductCatalogViewProps {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenDetail: (product: Product) => void;
}

export function ProductCatalogView({
  products,
  categories,
  siteSettings,
  selectedCategory,
  onSelectCategory,
  onOpenDetail,
}: ProductCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'name-asc' | 'price-low' | 'price-high'>('default');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.categoryId === selectedCategory || p.slug.includes(selectedCategory)
      );
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOption === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.categoryId === catId).length;
  };

  return (
    <div id="product-catalog-view" className="py-10 sm:py-16 bg-[#FAF7F2] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] text-[#8C431F] text-xs font-semibold">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span>Katalog Lengkap</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2413]">
            Koleksi Aksesoris & Kerajinan Wayang
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            Temukan karya bernilai estetika tinggi untuk aksesoris harian, dekorasi meja kerja, hingga plakat cinderamata Nusantara.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs mb-10 space-y-6">
          {/* Top Search & Sort Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk, tokoh wayang, material..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E8DFD5] text-sm text-[#3A2413] placeholder-[#9E8E81] focus:outline-none focus:border-[#C26B38] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#3A2413]"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <label htmlFor="catalog-sort-select" className="text-xs text-[#7A6B5D] font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan:
              </label>
              <select
                id="catalog-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs font-semibold text-[#3A2413] focus:outline-none focus:border-[#C26B38] cursor-pointer"
              >
                <option value="default">Pilihan Terbaik (Default)</option>
                <option value="name-asc">Nama Produk (A - Z)</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-4 border-t border-[#F0E8DF]">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#7A6B5D]">
              <Filter className="w-3.5 h-3.5 text-[#C26B38]" />
              <span>Filter Kategori</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="category-pill-all"
                onClick={() => onSelectCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === 'all' || !selectedCategory
                    ? 'bg-[#C26B38] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#5C4A3C] border border-[#E8DFD5] hover:bg-[#EFE7DC]'
                }`}
              >
                Semua Produk ({products.length})
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = getCategoryCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    id={`category-pill-${cat.slug}`}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#C26B38] text-white shadow-sm'
                        : 'bg-[#FAF7F2] text-[#5C4A3C] border border-[#E8DFD5] hover:bg-[#EFE7DC]'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6 text-xs text-[#7A6B5D]">
              <span>Menampilkan {filteredProducts.length} produk</span>
              {(searchQuery || (selectedCategory && selectedCategory !== 'all')) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSelectCategory('all');
                  }}
                  className="text-[#C26B38] hover:underline font-medium cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  siteSettings={siteSettings}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFD5] max-w-md mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-center mx-auto text-[#C26B38]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3A2413]">
              Belum Ada Produk yang Sesuai
            </h3>
            <p className="text-xs text-[#7A6B5D] leading-relaxed">
              Tidak ditemukan produk dengan kata kunci "{searchQuery}" atau filter yang dipilih. Coba reset pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="px-5 py-2 rounded-full bg-[#C26B38] text-white text-xs font-semibold hover:bg-[#A8582B] transition-colors cursor-pointer"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
