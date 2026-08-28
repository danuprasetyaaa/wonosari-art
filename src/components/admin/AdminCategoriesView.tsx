import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoriesViewProps {
  categories: Category[];
  onSaveCategory: (categoryData: Partial<Category>, isEditing: boolean, categoryId?: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

export function AdminCategoriesView({
  categories,
  onSaveCategory,
  onDeleteCategory,
}: AdminCategoriesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    sortOrder: 1,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      sortOrder: categories.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      sortOrder: cat.sortOrder || 1,
    });
    setError(null);
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
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSaveCategory(formData, !!editingCategory, editingCategory?.id);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kategori.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-categories-view" className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Kategori Produk
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Atur klasifikasi produk aksesoris, souvenir, pajangan, dan miniatur wayang
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-xs flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3EC] text-[#C26B38] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-[#8C7A6B] bg-[#FAF7F2] px-2 py-0.5 rounded">
                  Urutan: #{cat.sortOrder || 1}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                  {cat.name}
                </h3>
                <span className="text-xs font-mono text-[#8C5D38] block mt-0.5">
                  /{cat.slug}
                </span>
                <p className="text-xs text-[#7A6B5D] mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || 'Kategori aksesoris dan kerajinan bertema wayang.'}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F0E8DF] flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(cat)}
                className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#C26B38] text-[#5C4A3C] hover:text-white transition-colors"
                title="Edit Kategori"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(cat.id)}
                className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors"
                title="Hapus Kategori"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8DFD5] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-[#7A6B5D]" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Nama Kategori <span className="text-[#C26B38]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Pajangan Dinding"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="pajangan-dinding"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] font-mono text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat seputar ragam produk di kategori ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
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
                  {loading ? 'Menyimpan...' : 'Simpan'}
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
              Hapus Kategori Ini?
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Produk di bawah kategori ini tidak akan terhapus, namun tidak lagi memiliki asosiasi kategori ini.
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
                  await onDeleteCategory(deleteConfirmId);
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
