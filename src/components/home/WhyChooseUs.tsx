import React from 'react';
import { Sparkles, Award, Gift, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { PageContent } from '../../types';
import { GununganIcon } from '../common/JavaneseIcons';

interface WhyChooseUsProps {
  content: PageContent;
}

export function WhyChooseUs({ content }: WhyChooseUsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6 text-[#C26B38]" />;
      case 'Gift':
        return <Gift className="w-6 h-6 text-[#C26B38]" />;
      case 'MessageCircle':
        return <MessageCircle className="w-6 h-6 text-[#C26B38]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-[#C26B38]" />;
    }
  };

  const defaultItems = [
    {
      title: 'Warisan Budaya',
      description: 'Setiap karya mengangkat nilai budaya Jawa otentik dengan riset karakter wayang yang mendalam.',
      icon: 'Sparkles',
    },
    {
      title: 'Karya Berkualitas',
      description: 'Menggunakan material pilihan seperti kuningan murni, kulit tatah sungging, dan kayu jati perhutani.',
      icon: 'Award',
    },
    {
      title: 'Cocok untuk Hadiah',
      description: 'Kemasan eksklusif yang siap dijadikan souvenir perusahaan, kenang-kenangan tamu VIP, dan kado spesial.',
      icon: 'Gift',
    },
    {
      title: 'Bisa Ditanyakan via WhatsApp',
      description: 'Tanyakan ketersediaan stok, custom nama/grafir, dan diskon kuantiti secara langsung kepada tim kami.',
      icon: 'MessageCircle',
    },
  ];

  const items = content.whyChooseUs && content.whyChooseUs.length > 0 ? content.whyChooseUs : defaultItems;

  return (
    <section id="why-choose-us-section" className="py-16 sm:py-24 bg-white border-y border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C26B38] block">
            Keunggulan Kami
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2413]">
            Mengapa Memilih Nusantara Wayang?
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            Menghadirkan perpaduan sempurna antara keagungan filosofi Jawa dan standar kualitas kerajinan kontemporer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] rounded-2xl p-7 border border-[#E8DFD5] hover:border-[#C26B38]/40 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E8DFD5] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#EFE7DC] transition-all duration-300">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2413] group-hover:text-[#C26B38] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5A4B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
