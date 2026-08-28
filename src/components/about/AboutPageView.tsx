import React from 'react';
import { Award, Compass, Heart, Shield, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { PageContent, SiteSettings } from '../../types';
import { GununganIcon, JavanesePatternDivider } from '../common/JavaneseIcons';
import { buildWhatsAppGeneralUrl } from '../../services/api';

interface AboutPageViewProps {
  content: PageContent;
  siteSettings: SiteSettings;
  onExploreProducts: () => void;
}

export function AboutPageView({ content, siteSettings, onExploreProducts }: AboutPageViewProps) {
  const whatsappUrl = buildWhatsAppGeneralUrl(
    siteSettings.whatsapp,
    'Halo Admin Nusantara Wayang, saya tertarik membaca kisah profil Nusantara Wayang dan ingin berkonsultasi mengenai produk/souvenir.'
  );

  return (
    <div id="about-page-view" className="py-10 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] text-[#8C431F] text-xs font-semibold">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span>Profil & Sejarah</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2413]">
            {content.aboutTitle || 'Mengenal Nusantara Wayang'}
          </h1>
          <p className="text-base sm:text-lg text-[#6B5A4B] leading-relaxed">
            {content.aboutSubtitle || 'Dedikasi Mengangkat Keindahan Warisan Budaya Jawa ke Panggung Modern'}
          </p>
        </div>

        {/* Story Section with 2-Column Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8DFD5] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
                Kisah di Balik Setiap Pahatan & Tatahan
              </h2>
              <p className="text-sm sm:text-base text-[#5C4A3C] leading-relaxed">
                {content.aboutDescription ||
                  'Nusantara Wayang berawal dari kecintaan mendalam terhadap seni wayang kulit dan kerajinan logam tradisional di Yogyakarta dan Surakarta. Kami melihat bahwa kekayaan filosofi tokoh pewayangan tidak boleh berhenti di museum atau panggung pertunjukan semata, melainkan dapat hadir sebagai bagian dari gaya hidup modern.'}
              </p>
              <p className="text-sm sm:text-base text-[#5C4A3C] leading-relaxed">
                Melalui riset bentuk yang matang, kami mentransformasikan karakter-karakter legendaris seperti Arjuna, Gatotkaca, Semar, hingga Gunungan Kayon ke dalam ragam aksesoris fungsional, pajangan meja elegan, dan cinderamata berkelas tinggi.
              </p>
              <div className="pt-2 flex items-center gap-6">
                <div>
                  <span className="font-serif text-3xl font-bold text-[#8C431F]">
                    {content.aboutFoundedYear || '2016'}
                  </span>
                  <span className="text-xs text-[#7A6B5D] block">Tahun Pendirian</span>
                </div>
                <div className="h-10 w-[1px] bg-[#E8DFD5]" />
                <div>
                  <span className="font-serif text-3xl font-bold text-[#8C431F]">30+</span>
                  <span className="text-xs text-[#7A6B5D]">Mitra Pengrajin Lokal</span>
                </div>
                <div className="h-10 w-[1px] bg-[#E8DFD5]" />
                <div>
                  <span className="font-serif text-3xl font-bold text-[#8C431F]">10.000+</span>
                  <span className="text-xs text-[#7A6B5D]">Karya Terdistribusi</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DFD5]">
                <img
                  src={
                    content.aboutStoryImageUrl ||
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Workshop Pengrajin Nusantara Wayang"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F5EFEB] rounded-3xl p-8 border border-[#E8DFD5] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD5] flex items-center justify-center text-[#C26B38] shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#3A2413]">
              Visi Perusahaan
            </h3>
            <p className="text-sm sm:text-base text-[#5C4A3C] leading-relaxed">
              {content.aboutVision ||
                'Menjadi wadah pelestarian budaya Jawa terkemuka di tingkat nasional dan internasional melalui karya kerajinan kontemporer yang relevan bagi generasi masa kini.'}
            </p>
          </div>

          <div className="bg-[#F5EFEB] rounded-3xl p-8 border border-[#E8DFD5] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD5] flex items-center justify-center text-[#C26B38] shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#3A2413]">
              Misi Kami
            </h3>
            <p className="text-sm sm:text-base text-[#5C4A3C] leading-relaxed">
              {content.aboutMission ||
                'Memberdayakan perajin lokal Nusantara, menjaga standar tatah & tempa tradisional, dan menghadirkan produk berkualitas tinggi yang membanggakan sebagai hadiah maupun dekorasi pribadi.'}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DFD5]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C26B38]">
              Prinsip Kerja
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2413]">
              Nilai Luhur yang Kami Pegang
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content.aboutValues && content.aboutValues.length > 0
              ? content.aboutValues
              : [
                  'Orisinalitas & Ketelitian Tatah Tradisional',
                  'Harmoni Desain Modern dan Nilai Luhur Budaya',
                  'Pemberdayaan Pengrajin Lokal Jawa Tengah & Yogyakarta',
                  'Pelayanan Ramah, Tanggap, dan Terpercaya via WhatsApp',
                ]
            ).map((val, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#C26B38]" />
                <h4 className="font-semibold text-sm text-[#3A2413]">Pilar {idx + 1}</h4>
                <p className="text-xs text-[#6B5A4B] leading-relaxed">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="font-serif text-2xl font-bold text-[#3A2413]">
            Tertarik Menjelajahi Koleksi Kami?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreProducts}
              className="px-6 py-3 rounded-full bg-[#C26B38] hover:bg-[#A8582B] text-white text-sm font-semibold shadow-md transition-colors cursor-pointer"
            >
              Lihat Katalog Produk
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white hover:bg-[#F3ECE1] border border-[#D8C7B5] text-[#3A2413] text-sm font-semibold shadow-xs transition-colors"
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
