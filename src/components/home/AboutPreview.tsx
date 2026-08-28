import React from 'react';
import { ArrowRight, CheckCircle, Award, Sparkles, Feather } from 'lucide-react';
import { PageContent } from '../../types';
import { GununganIcon, JavanesePatternDivider } from '../common/JavaneseIcons';

interface AboutPreviewProps {
  content: PageContent;
  onReadMore: () => void;
}

export function AboutPreview({ content, onReadMore }: AboutPreviewProps) {
  return (
    <section id="about-preview-section" className="py-16 sm:py-20 bg-white border-y border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E8DFD5] bg-[#F5EFEB]">
                <img
                  src={
                    content.aboutImageUrl ||
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Tentang Nusantara Wayang"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Founded Year Overlay Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#3A2413] text-white p-5 rounded-2xl shadow-xl border border-[#523722] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C26B38] flex items-center justify-center text-white">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#E8C5A8] block">Didirikan Sejak</span>
                  <span className="font-serif text-2xl font-bold text-white">{content.aboutFoundedYear || '2016'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Principles */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C26B38] mb-2">
                <Feather className="w-3.5 h-3.5" />
                <span>{content.aboutSubtitle || 'Apresiasi Budaya Luhur'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3A2413] leading-tight">
                {content.aboutTitle || 'Mengenal Nusantara Wayang'}
              </h2>
            </div>

            <p className="text-base text-[#5C4A3C] leading-relaxed">
              {content.aboutDescription ||
                'Nusantara Wayang menghadirkan berbagai aksesoris, dekorasi, dan kerajinan bernuansa wayang serta budaya Jawa. Setiap karya dirancang untuk membawa keindahan warisan budaya Nusantara ke dalam kehidupan modern.'}
            </p>

            {/* Core Values Checklist */}
            <div className="space-y-3 pt-2">
              {(content.aboutValues && content.aboutValues.length > 0
                ? content.aboutValues
                : [
                    'Orisinalitas & Ketelitian Tatah Tradisional',
                    'Harmoni Desain Modern dan Nilai Luhur Budaya',
                    'Pemberdayaan Pengrajin Lokal Jawa Tengah & Yogyakarta',
                    'Pelayanan Ramah, Tanggap, dan Terpercaya via WhatsApp',
                  ]
              ).map((value, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C26B38] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#4E3E31]">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="btn-about-read-more"
                onClick={onReadMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#C26B38] text-[#C26B38] hover:bg-[#C26B38] hover:text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
              >
                <span>Baca Cerita Lengkap & Filosofi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
