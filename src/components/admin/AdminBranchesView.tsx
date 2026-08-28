import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Clock, Phone, MessageCircle, ExternalLink, AlertCircle, X } from 'lucide-react';
import { Branch } from '../../types';

interface AdminBranchesViewProps {
  branches: Branch[];
  onSaveBranch: (branchData: Partial<Branch>, isEditing: boolean, branchId?: string) => Promise<void>;
  onDeleteBranch: (branchId: string) => Promise<void>;
}

export function AdminBranchesView({
  branches,
  onSaveBranch,
  onDeleteBranch,
}: AdminBranchesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    city: 'Yogyakarta',
    address: '',
    phone: '',
    whatsapp: '',
    openingHours: 'Senin - Minggu: 09.00 - 21.00 WIB',
    googleMapsUrl: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 1,
  });

  const openCreateModal = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      city: 'Yogyakarta',
      address: '',
      phone: '+62 812-3456-7890',
      whatsapp: '6281234567890',
      openingHours: 'Senin - Minggu: 09.00 - 21.00 WIB',
      googleMapsUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      sortOrder: branches.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone || '',
      whatsapp: branch.whatsapp || '',
      openingHours: branch.openingHours,
      googleMapsUrl: branch.googleMapsUrl || '',
      imageUrl: branch.imageUrl || '',
      isActive: branch.isActive,
      sortOrder: branch.sortOrder || 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Nama cabang dan alamat wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSaveBranch(formData, !!editingBranch, editingBranch?.id);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan cabang.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-branches-view" className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Cabang & Showroom Offline
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Kelola lokasi toko, kontak WhatsApp lokal cabang, jam operasional, dan Google Maps
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cabang Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#FAF7F2]">
                <img
                  src={b.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                  alt={b.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {b.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8C431F] uppercase tracking-wider">
                    {b.city}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C7A6B]">
                    Urutan: #{b.sortOrder || 1}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                  {b.name}
                </h3>
                <p className="text-xs text-[#5C4A3C] leading-relaxed">
                  {b.address}
                </p>
                <div className="text-xs text-[#7A6B5D] space-y-1 pt-1">
                  <div>⏰ {b.openingHours}</div>
                  <div>📞 {b.phone || '-'}</div>
                  <div>💬 WA: {b.whatsapp || '-'}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#F0E8DF] flex items-center justify-between">
              {b.googleMapsUrl ? (
                <a
                  href={b.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C26B38] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                </a>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#C26B38] text-[#5C4A3C] hover:text-white transition-colors"
                  title="Edit Cabang"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(b.id)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors"
                  title="Hapus Cabang"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8DFD5] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                {editingBranch ? 'Edit Cabang' : 'Tambah Cabang Baru'}
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
                  Nama Cabang <span className="text-[#C26B38]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Galeri Malioboro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">Kota</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Yogyakarta"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2413] mb-1">WhatsApp Cabang</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="6281234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">
                  Alamat Lengkap <span className="text-[#C26B38]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Malioboro No. 45, Danurejan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">Jam Operasional</label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="Senin - Minggu: 09.00 - 21.00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2413] mb-1">URL Foto Showroom</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38]"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="branch-active-toggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#C26B38] rounded"
                />
                <label htmlFor="branch-active-toggle" className="font-semibold text-[#3A2413] cursor-pointer">
                  Cabang Aktif dan Ditampilkan di Halaman Pelanggan
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
                  {loading ? 'Menyimpan...' : 'Simpan Cabang'}
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
              Hapus Cabang Ini?
            </h3>
            <p className="text-xs text-[#7A6B5D]">
              Cabang akan dihapus dari daftar showroom website pelanggan.
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
                  await onDeleteBranch(deleteConfirmId);
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
