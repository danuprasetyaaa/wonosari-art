import React, { useState } from 'react';
import { Save, Sparkles, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { PageContent } from '../../types';

interface AdminContentViewProps {
  content: PageContent;
  onSaveContent: (updatedContent: PageContent) => Promise<void>;
}

export function AdminContentView({ content, onSaveContent }: AdminContentViewProps) {
  const [formData, setFormData] = useState<PageContent>({ ...content });
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await onSaveContent(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan konten website.');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (index: number, val: string) => {
    const updatedValues = [...(formData.aboutValues || [])];
    updatedValues[index] = val;
    setFormData({ ...formData, aboutValues: updatedValues });
  };

  const handleAddValue = () => {
    setFormData({
      ...formData,
      aboutValues: [...(formData.aboutValues || []), 'Nilai / Prinsip Baru'],
    });
  };

  const handleRemoveValue = (index: number) => {
    setFormData({
      ...formData,
      aboutValues: (formData.aboutValues || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div id="admin-content-view" className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Editor Konten Website & Profil
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Ubah teks headline beranda, narasi filosofi, visi-misi, dan nilai luhur toko
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Menyimpan...' : 'Simpan Semua Konten'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Konten website berhasil disimpan dan langsung diperbarui di website pelanggan!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* Section 1: Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-3">
            <span className="w-3 h-3 rounded-full bg-[#C26B38]" />
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              1. Hero Banner (Bagian Utama Beranda)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Badge Teks Atas</label>
              <input
                type="text"
                value={formData.heroBadgeText}
                onChange={(e) => setFormData({ ...formData, heroBadgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Teks Tombol CTA</label>
              <input
                type="text"
                value={formData.heroCtaText}
                onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">Headline Utama (Judul Besar)</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] font-serif text-base font-bold text-[#3A2413] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">Sub-headline (Penjelasan Singkat)</label>
            <textarea
              rows={3}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">URL Foto Showcase Utama</label>
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: About & Story */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-3">
            <span className="w-3 h-3 rounded-full bg-[#8C431F]" />
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              2. Cerita Toko, Visi, Misi & Nilai Budaya
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Judul Bagian Tentang</label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Tahun Pendirian</label>
              <input
                type="text"
                value={formData.aboutFoundedYear}
                onChange={(e) => setFormData({ ...formData, aboutFoundedYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">Deskripsi Narasi Profil Toko</label>
            <textarea
              rows={4}
              value={formData.aboutDescription}
              onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Visi Perusahaan</label>
              <textarea
                rows={3}
                value={formData.aboutVision}
                onChange={(e) => setFormData({ ...formData, aboutVision: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Misi Perusahaan</label>
              <textarea
                rows={3}
                value={formData.aboutMission}
                onChange={(e) => setFormData({ ...formData, aboutMission: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-[#3A2413]">Pilar & Nilai Luhur Toko</label>
              <button
                type="button"
                onClick={handleAddValue}
                className="text-xs text-[#C26B38] font-bold hover:underline"
              >
                + Tambah Pilar Nilai
              </button>
            </div>
            {(formData.aboutValues || []).map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleValueChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-xs text-[#3A2413] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue(idx)}
                  className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Philosophy Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-3">
            <span className="w-3 h-3 rounded-full bg-amber-600" />
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              3. Narasi Filosofi Pewayangan
            </h2>
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">Judul Seksi Filosofi</label>
            <input
              type="text"
              value={formData.philosophyTitle}
              onChange={(e) => setFormData({ ...formData, philosophyTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3A2413] mb-1">Deskripsi Seksi Filosofi</label>
            <textarea
              rows={3}
              value={formData.philosophyDescription}
              onChange={(e) => setFormData({ ...formData, philosophyDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
            />
          </div>
        </div>

        {/* Floating bottom save bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-sm font-bold shadow-lg transition-colors cursor-pointer"
          >
            {loading ? 'Menyimpan Perubahan...' : 'Simpan Semua Perubahan Konten'}
          </button>
        </div>
      </form>
    </div>
  );
}
