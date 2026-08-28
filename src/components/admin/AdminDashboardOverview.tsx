import React from 'react';
import {
  Package,
  Layers,
  MapPin,
  Image,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { Product, Category, Branch, GalleryItem, SiteSettings } from '../../types';

interface AdminDashboardOverviewProps {
  products: Product[];
  categories: Category[];
  branches: Branch[];
  gallery: GalleryItem[];
  siteSettings: SiteSettings;
  onNavigateTab: (tab: string) => void;
  onAddProduct: () => void;
}

export function AdminDashboardOverview({
  products,
  categories,
  branches,
  gallery,
  siteSettings,
  onNavigateTab,
  onAddProduct,
}: AdminDashboardOverviewProps) {
  const publishedProducts = products.filter((p) => (p.status || '').toUpperCase() === 'PUBLISHED');
  const featuredProducts = products.filter((p) => p.featured);
  const activeBranches = branches.filter((b) => b.isActive);

  const stats = [
    {
      label: 'Total Produk',
      value: products.length,
      sub: `${publishedProducts.length} aktif di website`,
      icon: Package,
      tab: 'products',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      label: 'Produk Unggulan',
      value: featuredProducts.length,
      sub: 'Ditampilkan di homepage',
      icon: Sparkles,
      tab: 'products',
      color: 'text-[#C26B38] bg-[#FAF3EC] border-[#E8D4C3]',
    },
    {
      label: 'Kategori Produk',
      value: categories.length,
      sub: 'Klasifikasi aksesoris',
      icon: Layers,
      tab: 'categories',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Cabang & Showroom',
      value: branches.length,
      sub: `${activeBranches.length} lokasi aktif`,
      icon: MapPin,
      tab: 'branches',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div id="admin-overview-view" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3A2413] to-[#261B14] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#523C2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8C5A8]">
            Selamat Datang di Content Management System
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Kelola {siteSettings.siteName || 'Nusantara Wayang'}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8CCC1] max-w-xl leading-relaxed">
            Perbarui katalog produk, nomor WhatsApp pemesanan, informasi cabang galeri, dan dokumentasi kerajinan dengan mudah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(stat.tab)}
              className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A6B5D] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="font-serif text-3xl font-bold text-[#3A2413] group-hover:text-[#C26B38] transition-colors">
                  {stat.value}
                </span>
                <span className="text-xs text-[#8C7A6B] block mt-1">{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:border-[#C26B38] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3EC] text-[#C26B38] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#C26B38] group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3A2413]">Katalog Produk</h3>
          <p className="text-xs text-[#7A6B5D] mt-1 leading-relaxed">
            Kelola foto, harga, status tampil, materi deskripsi, dan video YouTube/MP4.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('content')}
          className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:border-[#C26B38] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#C26B38] group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3A2413]">Konten Website</h3>
          <p className="text-xs text-[#7A6B5D] mt-1 leading-relaxed">
            Ubah teks Hero headline, cerita sejarah, visi misi, dan poin keunggulan toko.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:border-[#C26B38] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#C26B38] group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3A2413]">Pengaturan & WhatsApp</h3>
          <p className="text-xs text-[#7A6B5D] mt-1 leading-relaxed">
            Ubah nomor WhatsApp admin pemesanan ({siteSettings.whatsapp}), jam kerja, dan akun sosial media.
          </p>
        </div>
      </div>

      {/* Recent Products List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#3A2413]">
              Daftar Produk Terbaru
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Produk yang baru saja ditambahkan atau diperbarui
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-semibold text-[#C26B38] hover:underline cursor-pointer"
          >
            Lihat Semua Produk →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0E8DF] text-[#8C7A6B] uppercase tracking-wider">
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Estimasi Harga</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFEB]">
              {products.slice(0, 5).map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=100&q=80'}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-[#F5EFEB]"
                      />
                      <div>
                        <span className="font-semibold text-[#3A2413] block">{p.name}</span>
                        {p.featured && (
                          <span className="text-[10px] text-[#C26B38] font-bold">★ Unggulan</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#5C4A3C]">{cat?.name || '-'}</td>
                    <td className="py-3 px-4 font-mono text-[#8C7A6B]">{p.sku || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-[#8C431F]">
                      {p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          (p.status || '').toUpperCase() === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
