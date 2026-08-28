import React from 'react';
import { Sparkles, Compass, Shield, Heart } from 'lucide-react';
import { GununganIcon, JavanesePatternDivider } from '../common/JavaneseIcons';
import { PageContent } from '../../types';

interface PhilosophySectionProps {
  content: PageContent;
}

export function PhilosophySection({ content }: PhilosophySectionProps) {
  const characters = [
    {
      name: 'Gunungan (Kayon)',
      meaning: 'Simbol Alam Semesta & Harmoni Hayat',
      desc: 'Melambangkan permulaan, perjalanan hidup, dan keseimbangan jagad raya (makrokosmos & mikrokosmos).',
      icon: <GununganIcon className="w-5 h-5 text-[#C26B38]" />,
    },
    {
      name: 'Raden Arjuna',
      meaning: 'Ksatria Lembut Budi & Fokus Jiwa',
      desc: 'Perlambang ketenangan budi pekerti, ketajaman konsentrasi batin, dan kebenaran watak satria sejati.',
      icon: <Sparkles className="w-5 h-5 text-[#C26B38]" />,
    },
    {
      name: 'Raden Gatotkaca',
      meaning: 'Keberanian, Kekuatan & Loyalitas',
      desc: 'Figur pembela keadilan dengan jiwa kesatria tanpa pamrih yang siap berkorban demi kehormatan bangsa.',
      icon: <Shield className="w-5 h-5 text-[#C26B38]" />,
    },
    {
      name: 'Kyai Semar Badranaya',
      meaning: 'Kearifan, Kerendahan Hati & Keteduhan',
      desc: 'Pamong agung yang mengajarkan kebijaksanaan luhur, welas asih, dan sikap bersahaja dalam segala keadaan.',
      icon: <Heart className="w-5 h-5 text-[#C26B38]" />,
    },
  ];

  return (
    <section id="philosophy-section" className="py-16 sm:py-24 bg-[#F5EFEB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C26B38] block">
            Makna & Filosofi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2413]">
            {content.philosophyTitle || 'Filosofi di Balik Tokoh Pewayangan'}
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            {content.philosophyDescription ||
              'Wayang bukan sekadar seni pertunjukan, melainkan cerminan watak, tuntunan kebijaksanaan hidup, dan falsafah tata krama Jawa yang abadi.'}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((char, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center">
                  {char.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2413]">
                  {char.name}
                </h3>
                <span className="text-xs font-semibold text-[#8C431F] block">
                  {char.meaning}
                </span>
                <p className="text-xs text-[#7A6B5D] leading-relaxed">
                  {char.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
