import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { GununganIcon } from '../common/JavaneseIcons';
import { buildWhatsAppGeneralUrl } from '../../services/api';

interface ContactPageViewProps {
  siteSettings: SiteSettings;
}

export function ContactPageView({ siteSettings }: ContactPageViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Ketersediaan Produk',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    const query = `Halo Admin Nusantara Wayang,

Nama: ${formData.name}
Nomor Kontak: ${formData.phone || '-'}
Topik Pembahasan: ${formData.topic}

Pesan:
${formData.message}

Terima kasih.`;

    const waUrl = buildWhatsAppGeneralUrl(siteSettings.whatsapp, query);
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  const directWaUrl = buildWhatsAppGeneralUrl(
    siteSettings.whatsapp,
    'Halo Admin Nusantara Wayang, saya ingin berkonsultasi mengenai pemesanan produk wayang.'
  );

  return (
    <div id="contact-page-view" className="py-10 sm:py-16 bg-[#FAF7F2] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] text-[#8C431F] text-xs font-semibold">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span>Pusat Layanan Pelanggan</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2413]">
            Hubungi Nusantara Wayang
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            Punya pertanyaan mengenai stok karya, permintaan custom souvenir dengan kemasan besek khusus, atau kerjasama galeri? Tim kami siap melayani Anda.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Store Details & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#3A2413]">
                Informasi Kontak Toko
              </h2>

              <div className="space-y-4 text-sm text-[#5C4A3C]">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center text-[#C26B38] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#3A2413] block">Alamat Galeri Utama</span>
                    <span className="leading-relaxed">
                      {siteSettings.address}, {siteSettings.city}, {siteSettings.province} {siteSettings.postalCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center text-[#C26B38] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#3A2413] block">Jam Layanan</span>
                    <span>{siteSettings.workingHours || 'Setiap Hari: 09.00 - 21.00 WIB'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center text-[#C26B38] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#3A2413] block">Telepon Kantor</span>
                    <span>{siteSettings.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center text-[#C26B38] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#3A2413] block">Email Resmi</span>
                    <a href={`mailto:${siteSettings.email}`} className="text-[#C26B38] hover:underline">
                      {siteSettings.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-[#F0E8DF]">
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat Langsung via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-[#F5EFEB] rounded-3xl p-6 border border-[#E8DFD5] space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                Ikuti Media Sosial Kami
              </h3>
              <p className="text-xs text-[#6B5A4B]">
                Dapatkan update rilisan tokoh wayang terbaru, video proses produksi, dan liputan workshop seni.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {siteSettings.instagram && (
                  <a
                    href={siteSettings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white border border-[#E8DFD5] text-[#7A6B5D] hover:text-[#C26B38] hover:border-[#C26B38] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.facebook && (
                  <a
                    href={siteSettings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white border border-[#E8DFD5] text-[#7A6B5D] hover:text-[#C26B38] hover:border-[#C26B38] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {siteSettings.youtube && (
                  <a
                    href={siteSettings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white border border-[#E8DFD5] text-[#7A6B5D] hover:text-[#C26B38] hover:border-[#C26B38] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#3A2413]">
                  Kirim Pesan Konsultasi
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B5D] mt-1">
                  Formulir ini akan membantu Anda menyusun pesan rapi untuk langsung dikirim ke WhatsApp admin toko.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Pesan Anda telah disiapkan dan diarahkan ke WhatsApp kami. Terima kasih!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label htmlFor="contact-name" className="block font-semibold text-[#3A2413] mb-1.5">
                    Nama Lengkap <span className="text-[#C26B38]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Raden Satria"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] placeholder-[#9E8E81] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block font-semibold text-[#3A2413] mb-1.5">
                      Nomor WhatsApp / HP
                    </label>
                    <input
                      id="contact-phone"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] placeholder-[#9E8E81] focus:outline-none focus:border-[#C26B38]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block font-semibold text-[#3A2413] mb-1.5">
                      Topik Pertanyaan
                    </label>
                    <select
                      id="contact-topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] focus:outline-none focus:border-[#C26B38] cursor-pointer"
                    >
                      <option value="Ketersediaan Produk">Ketersediaan Produk & Stok</option>
                      <option value="Pemesanan Souvenir">Paket Souvenir Acara & Kantor</option>
                      <option value="Custom Nama / Grafir">Custom Nama / Grafir Khusus</option>
                      <option value="Kunjungan Galeri">Informasi Kunjungan Galeri Cabang</option>
                      <option value="Kerjasama">Kerjasama & Reseller</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-semibold text-[#3A2413] mb-1.5">
                    Pesan / Pertanyaan <span className="text-[#C26B38]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan nama produk atau detail pesanan yang ingin Anda tanyakan..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] text-[#3A2413] placeholder-[#9E8E81] focus:outline-none focus:border-[#C26B38]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C26B38] hover:bg-[#A8582B] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lanjutkan Kirim via WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
