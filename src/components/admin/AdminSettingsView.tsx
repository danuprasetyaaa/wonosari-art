import React, { useState } from 'react';
import {
  Save,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { changeAdminPassword, resetDatabaseSeed } from '../../services/api';

interface AdminSettingsViewProps {
  siteSettings: SiteSettings;
  onSaveSettings: (updatedSettings: SiteSettings) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

export function AdminSettingsView({
  siteSettings,
  onSaveSettings,
  onRefreshData,
}: AdminSettingsViewProps) {
  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Reset DB state
  const [resettingDb, setResettingDb] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPassword !== confirmPassword) {
      setPwdError('Password baru dan konfirmasi tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('Password minimal 6 karakter.');
      return;
    }

    setPwdLoading(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPwdSuccess('Password admin berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Gagal mengubah password.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Apakah Anda yakin ingin memulihkan database ke data awal bawaan (seed)? Semua data perubahan akan diganti.')) {
      return;
    }

    setResettingDb(true);
    try {
      await resetDatabaseSeed();
      await onRefreshData();
      alert('Database berhasil di-reset ke data bawaan lengkap.');
    } catch (err: any) {
      alert('Gagal reset database: ' + err.message);
    } finally {
      setResettingDb(false);
    }
  };

  return (
    <div id="admin-settings-view" className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
            Pengaturan Toko & Integrasi WhatsApp
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Konfigurasi nomor WhatsApp pemesanan, jam operasional, identitas toko, dan keamanan akun
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C26B38] hover:bg-[#A8582B] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan toko berhasil diperbarui!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* WhatsApp & Order Conversion Callout */}
        <div className="bg-[#EBF7EE] rounded-3xl p-6 sm:p-8 border border-[#BDE5C7] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#14532D]">
                Nomor WhatsApp Pusat Pemesanan (Paling Utama)
              </h2>
              <p className="text-xs text-[#166534]">
                Nomor ini digunakan secara otomatis di seluruh tombol "Chat WhatsApp" dan "Tanyakan via WhatsApp" produk.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#14532D] mb-1">
              Nomor WhatsApp (Gunakan kode negara tanpa +, contoh: 6281234567890) <span className="text-[#C26B38]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="6281234567890"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#A1D9B0] font-mono text-sm font-bold text-[#14532D] focus:outline-none focus:border-[#25D366]"
            />
          </div>
        </div>

        {/* Identity & Branding */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="border-b border-[#F0E8DF] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              Identitas & Tagline Toko
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Nama Toko / Perusahaan</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Tagline Toko</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Warisan Budaya dalam Setiap Karya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info & Location */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="border-b border-[#F0E8DF] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              Kontak & Lokasi Galeri Pusat
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Email Resmi</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Telepon Kantor / Showroom</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#3A2413] mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Kota</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Jam Operasional</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
          <div className="border-b border-[#F0E8DF] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#3A2413]">
              Tautan Media Sosial
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/nusantarawayang"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/nusantarawayang"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@nusantarawayang"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">TikTok URL</label>
              <input
                type="url"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@nusantarawayang"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-3">
          <KeyRound className="w-5 h-5 text-[#C26B38]" />
          <h2 className="font-serif text-lg font-bold text-[#3A2413]">
            Ganti Password Admin
          </h2>
        </div>

        {pwdSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{pwdError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Password Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Password Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3A2413] mb-1">Ulangi Password Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-5 py-2.5 rounded-xl bg-[#3A2413] hover:bg-[#523722] text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            {pwdLoading ? 'Memperbarui...' : 'Perbarui Password Admin'}
          </button>
        </form>
      </div>

      {/* Reset Seed Utility */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold text-[#3A2413] flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#8C5D38]" />
            Pulihkan Data Awal Database (Reset Demo Seed)
          </h3>
          <p className="text-xs text-[#7A6B5D] mt-0.5">
            Mengembalikan seluruh data produk wayang, kategori, cabang, galeri, dan profil ke data sampel resmi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDb}
          disabled={resettingDb}
          className="px-4 py-2.5 rounded-xl border border-[#D8C7B5] hover:border-rose-400 text-xs font-bold text-[#5C4A3C] hover:text-rose-700 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
        >
          {resettingDb ? 'Memulihkan Data...' : 'Reset Database ke Seed Awal'}
        </button>
      </div>
    </div>
  );
}
