import React from 'react';
import {
  ArrowRight,
  Play,
  Target,
  Crown,
  Star,
  Sparkles,
  ShieldCheck,
  Award,
  Gem,
  Compass,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { PageContent, SiteSettings } from '../../types';
import { GununganIcon } from '../common/JavaneseIcons';

// --- HERITAGE & CLIENT PARTNERS FOR MARQUEE ---
const CLIENTS = [
  { name: 'Kraton Jogja', icon: Crown },
  { name: 'Dewan Kerajinan', icon: Award },
  { name: 'Galeri Budaya', icon: Gem },
  { name: 'Kolektor Nusantara', icon: ShieldCheck },
  { name: 'Sanggar Wayang', icon: Compass },
  { name: 'Batik & Kriya', icon: Layers },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-[#FAF7F2] sm:text-2xl font-serif">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-[#A89889] font-medium sm:text-xs text-center mt-0.5">
      {label}
    </span>
  </div>
);

interface HeroSectionProps {
  content: PageContent;
  siteSettings: SiteSettings;
  onExploreProducts: () => void;
  onAboutClick: () => void;
}

export function HeroSection({
  content,
  siteSettings,
  onExploreProducts,
  onAboutClick,
}: HeroSectionProps) {
  const heroImage =
    content.heroImageUrl ||
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80';

  return (
    <div id="hero-section" className="relative w-full bg-[#1A110B] text-[#FAF7F2] overflow-hidden font-sans">
      {/* 
        SCOPED ANIMATIONS & KEYFRAMES
      */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image with Warm Gradient Mask */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${heroImage})`,
          maskImage: 'linear-gradient(180deg, transparent, black 15%, black 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 15%, black 75%, transparent)',
        }}
      />

      {/* Atmospheric ambient glow using the project's signature terracotta and brass tones */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C26B38]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#E5A962]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Gunungan silhouette watermark */}
      <div className="absolute -bottom-16 -left-16 w-80 h-80 opacity-[0.04] pointer-events-none text-[#E5A962]">
        <GununganIcon className="w-full h-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-24 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 pt-4">
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C26B38]/30 bg-[#C26B38]/10 px-4 py-1.5 backdrop-blur-md transition-colors hover:bg-[#C26B38]/20">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#E5A962] flex items-center gap-2">
                  <GununganIcon className="w-3.5 h-3.5 text-[#C26B38]" />
                  {content.heroBadgeText || 'Modern Javanese Heritage & Craft'}
                  <Star className="w-3.5 h-3.5 text-[#E5A962] fill-[#E5A962]" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-in delay-200 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight leading-[1.08] text-[#FAF7F2]"
              style={{
                maskImage: 'linear-gradient(180deg, black 0%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 85%, transparent 100%)',
              }}
            >
              Warisan Budaya Jawa<br />
              <span className="bg-gradient-to-br from-[#FAF7F2] via-[#FAF7F2] to-[#E5A962] bg-clip-text text-transparent">
                Hadir Dalam Setiap
              </span><br />
              Karya Nusantara
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-base sm:text-lg text-[#C8B8A6] leading-relaxed font-normal">
              {content.heroSubtitle ||
                'Temukan berbagai aksesoris dan kerajinan bernuansa wayang autentik yang dipahat teliti oleh pengrajin lokal untuk menghadirkan keindahan filosofi luhur ke dalam keseharian Anda.'}
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-cta-portfolio"
                onClick={onExploreProducts}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C26B38] hover:bg-[#D9773F] px-8 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] shadow-lg shadow-[#C26B38]/30 active:scale-[0.98] cursor-pointer"
              >
                <span>{content.heroCtaText || 'Jelajahi Katalog Produk'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-cta-showreel"
                onClick={onAboutClick}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#FAF7F2]/15 bg-white/5 hover:bg-white/10 px-8 py-4 text-sm font-semibold text-[#FAF7F2] backdrop-blur-sm transition-all hover:border-[#FAF7F2]/30 active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#E5A962]" />
                <span>Cerita & Profil Kami</span>
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-4">
            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-[#4A3423] bg-[#241710]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              {/* Card Warm Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#C26B38]/20 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-7">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#C26B38]/20 border border-[#C26B38]/30 text-[#E5A962]">
                    <Target className="h-6 w-6 text-[#E5A962]" />
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold tracking-tight text-[#FAF7F2]">500+</div>
                    <div className="text-xs sm:text-sm text-[#A89889]">Karya & Souvenir Terkirim</div>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-2.5 mb-7">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[#C8B8A6]">Tingkat Kepuasan Pelanggan</span>
                    <span className="text-[#E5A962] font-bold">99.4%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#382417]">
                    <div className="h-full w-[99.4%] rounded-full bg-gradient-to-r from-[#C26B38] via-[#D9773F] to-[#E5A962]" />
                  </div>
                </div>

                <div className="h-px w-full bg-[#4A3423]/70 mb-6" />

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <StatItem value="100%" label="Kulit Asli" />
                  <div className="w-px h-full bg-[#4A3423]/70 mx-auto" />
                  <StatItem value="Est. 2016" label="Karya Asli" />
                  <div className="w-px h-full bg-[#4A3423]/70 mx-auto" />
                  <StatItem value="24/7" label="Konsultasi" />
                </div>

                {/* Tag Pills */}
                <div className="mt-7 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    SIAP KIRIM NASIONAL
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A962]/30 bg-[#E5A962]/10 px-3 py-1 text-[10px] font-medium tracking-wide text-[#E5A962]">
                    <Crown className="w-3 h-3 text-[#E5A962]" />
                    TATAH SUNGGING ASLI
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-[#4A3423] bg-[#241710]/80 py-7 backdrop-blur-xl shadow-xl">
              <h3 className="mb-5 px-6 sm:px-8 text-xs font-semibold uppercase tracking-wider text-[#A89889]">
                Dipercaya Komunitas Seni & Kolektor Budaya
              </h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                }}
              >
                <div className="animate-marquee flex gap-10 whitespace-nowrap px-4">
                  {/* Triple list for seamless continuous infinite loop */}
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 opacity-60 transition-all hover:opacity-100 hover:scale-105 cursor-default"
                    >
                      {/* Heritage Icon */}
                      <client.icon className="h-5 w-5 text-[#E5A962]" />
                      {/* Heritage Partner Name */}
                      <span className="text-sm sm:text-base font-serif font-bold text-[#FAF7F2] tracking-tight">
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
