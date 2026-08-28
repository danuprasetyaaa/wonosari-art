import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, AlertCircle, X, Check } from 'lucide-react';
import { GalleryItem } from '../../types';
import { uploadMediaFile } from '../../services/api';

interface AdminGalleryViewProps {
  gallery: GalleryItem[];
  onSaveGallery: (itemData: Partial<GalleryItem>, isEditing: boolean, itemId?: string) => Promise<void>;
  onDeleteGallery: (itemId: string) => Promise<void>;
}

export function AdminGalleryView({
  gallery,
  onSaveGallery,
  onDeleteGallery,
}: AdminGalleryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Koleksi Wayang',
    imageUrl: '',
    description: '',
    isPublished: true,
    sortOrder: 1,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Koleksi Wayang',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      description: '',
      isPublished: true,
      sortOrder: gallery.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      description: item.description || '',
      isPublished: item.isPublished,
      sortOrder: item.sortOrder || 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadMediaFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
    } catch (err: any) {
      alert('Upload gagal: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      setError('Judul dan URL Foto wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSaveGallery(formData, !!editingItem, editingItem?.id);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan foto galeri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-gallery-view" className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Galeri Seni & Workshop
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Kelola dokumentasi foto kerajinan, workshop pengrajin, dan display produk
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Galeri</span>
        </button>
      </div>

      {/* Grid of gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#E8DFD5] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[4/3] bg-[#FAF7F2]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3A2413]/80 backdrop-blur-xs text-amber-200">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-serif text-sm font-bold text-[#3A2413] line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-[11px] text-[#7A6B5D] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-[#F0E8DF] flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  item.isPublished
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {item.isPublished ? 'Tayang' : 'Draft'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded bg-[#FAF7F2] hover:bg-[#C26B38] text-[#5C4A3C] hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 rounded bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8DFD5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                {editingItem ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#7A6B5D]" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#3A2413] mb-1">Judul Foto</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Proses Pahat Wayang Kulit Tatah Sungging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">Kategori Galeri</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
                >
                  <option value="Koleksi Wayang">Koleksi Wayang</option>
                  <option value="Proses Pembuatan">Proses Pembuatan & Tatah</option>
                  <option value="Workshop Kerajinan">Workshop Kerajinan</option>
                  <option value="Interior Toko">Interior Toko & Display</option>
                  <option value="Koleksi Souvenir">Koleksi Souvenir</option>
                  <option value="Budaya Jawa">Budaya Jawa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">URL Foto</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#EFE7DC] hover:bg-[#E2D6C7] text-[#5C4A3C] font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">Keterangan Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat dokumentasi karya..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="gallery-published"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-[#C26B38]"
                />
                <label htmlFor="gallery-published" className="font-semibold text-[#3A2413] cursor-pointer">
                  Tampilkan di Galeri Publik
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B5] text-[#5C4A3C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#C26B38] text-white font-bold"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E8DFD5] shadow-2xl text-center space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3A2413]">
              Hapus Foto Ini?
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Foto akan dihapus dari galeri website.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[#D8C7B5] text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await onDeleteGallery(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
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
