import React from 'react';
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { GununganIcon, JavanesePatternDivider } from '../common/JavaneseIcons';
import { SiteSettings, Category } from '../../types';
import { buildWhatsAppGeneralUrl } from '../../services/api';

interface FooterProps {
  siteSettings: SiteSettings;
  categories: Category[];
  onNavigate: (tab: string, categoryId?: string) => void;
  onOpenAdmin: () => void;
}

export function Footer({ siteSettings, categories, onNavigate, onOpenAdmin }: FooterProps) {
  const whatsappUrl = buildWhatsAppGeneralUrl(
    siteSettings.whatsapp,
    'Halo Admin Nusantara Wayang, saya ingin bertanya seputar koleksi aksesoris dan pemesanan souvenir.'
  );

  return (
    <footer id="main-footer" className="bg-[#261B14] text-[#E5DCD3] pt-16 pb-12 border-t-4 border-[#C26B38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3D2D23]">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C26B38] flex items-center justify-center text-amber-100 shadow-md">
                <GununganIcon className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block">
                  {siteSettings.siteName || 'Nusantara Wayang'}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#C29B7F] block">
                  Modern Javanese Heritage
                </span>
              </div>
            </div>
            <p className="text-sm text-[#BDB0A4] leading-relaxed">
              {siteSettings.tagline || 'Warisan Budaya dalam Setiap Karya'} — Menghadirkan aksesoris, kerajinan tangan, dan dekorasi bernuansa pewayangan dengan sentuhan modern, elegan, dan penuh makna keluhuran Jawa.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {siteSettings.instagram && (
                <a
                  id="footer-social-instagram"
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#38281E] hover:bg-[#C26B38] text-[#D8CCC1] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteSettings.facebook && (
                <a
                  id="footer-social-facebook"
                  href={siteSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#38281E] hover:bg-[#C26B38] text-[#D8CCC1] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {siteSettings.youtube && (
                <a
                  id="footer-social-youtube"
                  href={siteSettings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#38281E] hover:bg-[#C26B38] text-[#D8CCC1] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              <a
                id="footer-social-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-4 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C26B38]" />
              Navigasi Halaman
            </h3>
            <ul className="space-y-2.5 text-sm text-[#BDB0A4]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Tentang Kami & Cerita Toko
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Galeri Karya & Workshop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('branches')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Cabang & Galeri Offline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#E8A57A] transition-colors cursor-pointer"
                >
                  Kontak & Konsultasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kategori Unggulan */}
          <div>
            <h3 className="text-white font-serif font-semibold text-base mb-4 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C26B38]" />
              Kategori Produk
            </h3>
            <ul className="space-y-2.5 text-sm text-[#BDB0A4]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('products', cat.id)}
                    className="hover:text-[#E8A57A] transition-colors flex items-center justify-between w-full group cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C26B38]" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-[#C26B38] hover:text-[#E8A57A] text-xs font-semibold uppercase tracking-wider block pt-1 cursor-pointer"
                >
                  Lihat Semua Kategori →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Kontak & WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-semibold text-base mb-2 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C26B38]" />
              Pusat Layanan
            </h3>
            <div className="space-y-3 text-sm text-[#BDB0A4]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C26B38] shrink-0 mt-1" />
                <span>
                  {siteSettings.address}, {siteSettings.city} {siteSettings.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C26B38] shrink-0" />
                <span>{siteSettings.workingHours || '09.00 - 21.00 WIB'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C26B38] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-white transition-colors">
                  {siteSettings.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C26B38] shrink-0" />
                <span>{siteSettings.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                id="footer-cta-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-semibold shadow-md transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Subtle Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E8E81] gap-4">
          <p>© {new Date().getFullYear()} {siteSettings.siteName || 'Nusantara Wayang'}. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#BDB0A4]">
              <ShieldCheck className="w-4 h-4 text-[#C26B38]" />
              Karya Asli Pengrajin Nusantara
            </span>
            {/* Secret discreet entrance for administrators as per requirements */}
            <button
              id="admin-portal-secret-trigger"
              onClick={onOpenAdmin}
              title="Akses Portal Pengelola"
              className="text-[#523C2F] hover:text-[#C26B38] transition-colors cursor-pointer text-[10px] tracking-widest uppercase focus:outline-none"
            >
              CMS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
