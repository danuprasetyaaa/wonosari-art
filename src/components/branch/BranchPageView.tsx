import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Building2 } from 'lucide-react';
import { Branch, SiteSettings } from '../../types';
import { GununganIcon } from '../common/JavaneseIcons';
import { buildWhatsAppGeneralUrl } from '../../services/api';

interface BranchPageViewProps {
  branches: Branch[];
  siteSettings: SiteSettings;
}

export function BranchPageView({ branches, siteSettings }: BranchPageViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const activeBranches = branches.filter((b) => b.isActive);
  const cities = ['all', ...Array.from(new Set(activeBranches.map((b) => b.city)))];

  const filteredBranches = selectedCity === 'all'
    ? activeBranches
    : activeBranches.filter((b) => b.city === selectedCity);

  return (
    <div id="branch-page-view" className="py-10 sm:py-16 bg-[#FAF7F2] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] text-[#8C431F] text-xs font-semibold">
            <GununganIcon className="w-4 h-4 text-[#C26B38]" />
            <span>Galeri & Showroom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A2413]">
            Cabang Nusantara Wayang
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4B] leading-relaxed">
            Kunjungi showroom dan galeri kami secara langsung di Yogyakarta, Surakarta (Solo), dan Jakarta untuk melihat langsung keindahan detail karya wayang.
          </p>
        </div>

        {/* City Filter Pills */}
        {cities.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#C26B38] text-white shadow-sm'
                    : 'bg-white text-[#5C4A3C] border border-[#E8DFD5] hover:bg-[#F3ECE1]'
                }`}
              >
                {city === 'all' ? 'Semua Cabang' : city}
              </button>
            ))}
          </div>
        )}

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map((branch) => {
            const branchWa = buildWhatsAppGeneralUrl(
              branch.whatsapp || siteSettings.whatsapp,
              `Halo Admin ${branch.name}, saya ingin menanyakan ketersediaan produk di cabang ini.`
            );

            return (
              <div
                key={branch.id}
                id={`branch-card-${branch.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5EFEB]">
                  <img
                    src={
                      branch.imageUrl ||
                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={branch.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3A2413]/85 backdrop-blur-xs text-amber-200">
                      {branch.city}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl font-bold text-[#3A2413] group-hover:text-[#C26B38] transition-colors leading-snug">
                      {branch.name}
                    </h3>

                    <div className="space-y-2.5 text-xs text-[#5C4A3C]">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#C26B38] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{branch.address}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#C26B38] shrink-0" />
                        <span>{branch.openingHours}</span>
                      </div>

                      {branch.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-[#C26B38] shrink-0" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#F0E8DF] grid grid-cols-2 gap-2">
                    {branch.googleMapsUrl ? (
                      <a
                        href={branch.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D8C7B5] hover:border-[#C26B38] text-[#3A2413] hover:text-[#C26B38] text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Maps</span>
                      </a>
                    ) : (
                      <div />
                    )}

                    <a
                      href={branchWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat Cabang</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
