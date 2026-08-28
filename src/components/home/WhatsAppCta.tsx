import React from 'react';
import { MessageCircle, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { buildWhatsAppGeneralUrl } from '../../services/api';
import { GununganIcon } from '../common/JavaneseIcons';

interface WhatsAppCtaProps {
  siteSettings: SiteSettings;
}

export function WhatsAppCta({ siteSettings }: WhatsAppCtaProps) {
  const whatsappUrl = buildWhatsAppGeneralUrl(
    siteSettings.whatsapp,
    'Halo Admin Nusantara Wayang, saya ingin berkonsultasi mengenai pemesanan aksesoris wayang dan souvenir budaya Jawa.'
  );

  return (
    <section id="whatsapp-cta-banner" className="py-16 sm:py-20 bg-gradient-to-br from-[#3A2413] via-[#2F1D0F] to-[#261B14] text-white relative overflow-hidden">
      {/* Decorative Gunungan Outline */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 opacity-10 pointer-events-none text-amber-200">
        <GununganIcon className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C26B38]" />
            <span>Konsultasi & Pemesanan Mudah</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Ingin Memesan atau Custom Souvenir Budaya Jawa?
          </h2>

          <p className="text-base sm:text-lg text-[#D8CCC1] leading-relaxed">
            Hubungi admin kami langsung via WhatsApp untuk menanyakan ketersediaan produk, estimasi pengerjaan grafir khusus, atau paket souvenir acara kantor.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="main-cta-whatsapp-banner"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat WhatsApp Sekarang</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#BDB0A4]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Respon Cepat & Ramah
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> Pengiriman ke Seluruh Indonesia
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#25D366]" /> Jam Operasional: {siteSettings.workingHours || '09.00 - 21.00 WIB'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
