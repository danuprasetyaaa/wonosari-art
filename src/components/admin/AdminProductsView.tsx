import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Product, Category, ProductImage, SiteSettings } from '../../types';
import { uploadMediaFile } from '../../services/api';

interface AdminProductsViewProps {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
  onSaveProduct: (productData: Partial<Product>, isEditing: boolean, productId?: string) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export function AdminProductsView({
  products,
  categories,
  siteSettings,
  onSaveProduct,
  onDeleteProduct,
}: AdminProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: categories[0]?.id || '',
    shortDescription: '',
    description: '',
    price: '' as string | number,
    material: '',
    dimensions: '',
    badge: '',
    featured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    sortOrder: 1,
    videoUrl: '',
    videoType: 'youtube' as 'youtube' | 'vimeo' | 'mp4',
    images: [] as ProductImage[],
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `NW-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: categories[0]?.id || '',
      shortDescription: '',
      description: '',
      price: '',
      material: 'Kuningan Cor & Kayu Jati',
      dimensions: '15 cm x 10 cm x 5 cm',
      badge: '',
      featured: false,
      status: 'PUBLISHED',
      sortOrder: products.length + 1,
      videoUrl: '',
      videoType: 'youtube',
      images: [
        {
          id: `img-${Date.now()}`,
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          alt: 'Aksesoris Wayang',
          sortOrder: 1,
        },
      ],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      categoryId: product.categoryId,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
      badge: product.badge || '',
      featured: product.featured,
      status: product.status,
      sortOrder: product.sortOrder || 1,
      videoUrl: product.videoUrl || '',
      videoType: product.videoType || 'youtube',
      images: product.images && product.images.length > 0 ? [...product.images] : [],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg: ProductImage = {
      id: `img-${Date.now()}`,
      imageUrl: newImageUrl.trim(),
      alt: formData.name || 'Foto Produk',
      sortOrder: formData.images.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImg],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadMediaFile(file);
      const newImg: ProductImage = {
        id: `img-${Date.now()}`,
        imageUrl: res.url,
        alt: formData.name || file.name,
        sortOrder: formData.images.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImg],
      }));
    } catch (err: any) {
      alert('Upload gagal: ' + (err.message || 'Error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Pilih kategori produk.');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      await onSaveProduct(
        {
          ...formData,
          price: formData.price === '' ? null : Number(formData.price),
        },
        !!editingProduct,
        editingProduct?.id
      );
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-products-view" className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Manajemen Produk
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Total {products.length} karya wayang & aksesoris terdaftar dalam sistem
          </p>
        </div>

        <button
          id="btn-add-new-product"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, SKU, material..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs font-semibold text-[#3A2413] focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs font-semibold text-[#3A2413] focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DFD5] text-[#8C7A6B] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Harga (IDR)</th>
                <th className="py-3.5 px-4">Badge / Fitur</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DF]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-[#F5EFEB] shrink-0 border border-[#E8DFD5]"
                        />
                        <div>
                          <span className="font-bold text-[#3A2413] block">{p.name}</span>
                          <span className="text-[11px] text-[#7A6B5D] line-clamp-1">{p.material || 'Kerajinan Wayang'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#5C4A3C]">{cat?.name || '-'}</td>
                      <td className="py-3 px-4 font-mono text-[#8C7A6B]">{p.sku || '-'}</td>
                      <td className="py-3 px-4 font-bold text-[#8C431F]">
                        {p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : '-'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          {p.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 w-fit">
                              {p.badge}
                            </span>
                          )}
                          {p.featured && (
                            <span className="text-[10px] font-bold text-[#C26B38] flex items-center gap-0.5">
                              <Sparkles className="w-3 h-3" /> Unggulan
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            (p.status || '').toUpperCase() === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Produk"
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#C26B38] text-[#5C4A3C] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Hapus Produk"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#7A6B5D]">
                    Tidak ada produk yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFD5] overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD5] bg-white sticky top-0 z-10">
              <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                {editingProduct ? 'Edit Produk Wayang' : 'Tambah Produk Wayang Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#7A6B5D] hover:bg-[#EFE7DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Area */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Nama Produk <span className="text-[#C26B38]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Pajangan Meja Gunungan Wayang Kuningan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Slug URL (Otomatis / Kustom)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="pajangan-meja-gunungan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] font-mono text-xs text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Kategori <span className="text-[#C26B38]">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="NW-GN-001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] font-mono text-xs text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Estimasi Harga (IDR, opsional)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Contoh: 185000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Label Badge Promo / Edisi
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none cursor-pointer"
                  >
                    <option value="">Tanpa Badge</option>
                    <option value="Unggulan">Unggulan</option>
                    <option value="Terlaris">Terlaris</option>
                    <option value="Baru">Baru</option>
                    <option value="Edisi Terbatas">Edisi Terbatas</option>
                  </select>
                </div>
              </div>

              {/* Material & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Material / Bahan Baku
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Contoh: Kuningan Cor, Kayu Jati"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">
                    Ukuran / Dimensi
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Contoh: 18 cm x 12 cm x 4 cm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Deskripsi Singkat (Tampil di Kartu Produk)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Pajangan meja bermotif gunungan wayang dari kuningan cor dengan dudukan kayu jati."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Deskripsi Lengkap & Cerita Tokoh Wayang
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan makna filosofi tokoh pewayangan dan detail kerajinan ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              {/* Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#3A2413] mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#C26B38]" />
                    <span>Tautan Video Produk (YouTube / Video Embed)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-xs text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">Tipe Video</label>
                  <select
                    value={formData.videoType}
                    onChange={(e) => setFormData({ ...formData, videoType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD5] text-xs text-[#3A2413] focus:outline-none cursor-pointer"
                  >
                    <option value="youtube">YouTube Embed</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="mp4">Direct MP4 File</option>
                  </select>
                </div>
              </div>

              {/* Gallery Images Management */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFD5]">
                <label className="block font-bold text-[#3A2413] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#C26B38]" />
                    <span>Galeri Gambar Produk ({formData.images.length})</span>
                  </span>
                </label>

                {/* Image List Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={img.id || idx} className="relative group rounded-xl overflow-hidden border border-[#E8DFD5] bg-[#FAF7F2] aspect-square">
                      <img
                        src={img.imageUrl}
                        alt={img.alt || `Foto ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Image Inputs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Tempel URL gambar (https://...)"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs text-[#3A2413] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#3A2413] text-white text-xs font-semibold hover:bg-[#523722] shrink-0"
                  >
                    Tambah URL
                  </button>

                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#EFE7DC] hover:bg-[#E2D6C7] text-[#5C4A3C] text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Mengupload...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Status and Featured Switches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-[#E8DFD5]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-[#C26B38] rounded focus:ring-[#C26B38]"
                  />
                  <label htmlFor="featured-checkbox" className="font-semibold text-[#3A2413] cursor-pointer">
                    Jadikan Produk Unggulan di Homepage
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs font-semibold text-[#3A2413] focus:outline-none cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED (Tampil di Website)</option>
                    <option value="DRAFT">DRAFT (Disembunyikan)</option>
                    <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-end gap-3 sticky bottom-0 bg-[#FAF7F2] py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#D8C7B5] text-[#5C4A3C] text-xs font-semibold hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E8DFD5] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3A2413]">
              Hapus Produk Ini?
            </h3>
            <p className="text-xs text-[#7A6B5D] leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus dari katalog website.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-xs font-semibold text-[#5C4A3C] hover:bg-[#FAF7F2]"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await onDeleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
