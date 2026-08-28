'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GununganIcon } from '../common/JavaneseIcons';
import { SiteSettings } from '../../types';

// Custom useScroll hook matching the provided snippet
export function useScroll(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Check initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}

// Animated hamburger / close toggle icon matching MenuToggleIcon
export function MenuToggleIcon({
  open,
  className,
  duration = 300,
}: {
  open: boolean;
  className?: string;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-5 h-5 cursor-pointer',
        className
      )}
      style={{ transition: `all ${duration}ms ease-in-out` }}
    >
      <span
        className={cn(
          'absolute h-0.5 w-4.5 bg-current rounded-full transition-all duration-300 transform',
          open ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        )}
      />
      <span
        className={cn(
          'absolute h-0.5 w-4.5 bg-current rounded-full transition-all duration-200',
          open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        )}
      />
      <span
        className={cn(
          'absolute h-0.5 w-4.5 bg-current rounded-full transition-all duration-300 transform',
          open ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        )}
      />
    </div>
  );
}

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  siteSettings: SiteSettings;
}

export function Navbar({ currentTab, onNavigate, siteSettings }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);
  const isHome = currentTab === 'home';

  const links = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'products', label: 'Produk' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'branches', label: 'Cabang' },
    { id: 'contact', label: 'Kontak' },
  ];

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 ease-out',
        // HOME PAGE STYLING: Seamlessly matches dark teak #1A110B background with ZERO white gap
        isHome && {
          'bg-[#1A110B] border-b border-[#382417]/70': !scrolled && !open,
          'md:top-3 md:max-w-5xl md:mx-auto md:rounded-full md:border md:border-[#4A3423] md:shadow-2xl md:shadow-black/50 bg-[#241710]/95 supports-[backdrop-filter]:bg-[#241710]/85 backdrop-blur-xl border-b border-[#382417]':
            scrolled && !open,
          'bg-[#1A110B]/98': open,
        },
        // OTHER PAGES STYLING: Warm Linen #FAF7F2 palette
        !isHome && {
          'bg-[#FAF7F2]/95 border-b border-[#E8DFD5] backdrop-blur-md': !scrolled && !open,
          'md:top-3 md:max-w-5xl md:mx-auto md:rounded-full md:border md:border-[#E8DFD5] md:shadow-lg md:shadow-[#3A2413]/5 bg-[#FAF7F2]/95 supports-[backdrop-filter]:bg-[#FAF7F2]/80 backdrop-blur-lg border-b border-[#E8DFD5]':
            scrolled && !open,
          'bg-[#FAF7F2]/98': open,
        }
      )}
    >
      <nav
        className={cn(
          'mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:h-14 md:transition-all md:ease-out',
          {
            'md:px-4': scrolled,
          }
        )}
      >
        {/* Brand Wordmark & Icon */}
        <button
          id="nav-brand-logo"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#C26B38] to-[#8C431F] flex items-center justify-center text-[#FAF7F2] shadow-xs transition-transform duration-300 group-hover:scale-105 border border-[#E5A962]/30">
            <GununganIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FAF7F2]" />
          </div>
          <div>
            <span
              className={cn(
                'font-serif text-lg sm:text-xl font-bold tracking-tight block leading-none transition-colors',
                isHome ? 'text-[#FAF7F2]' : 'text-[#3A2413]'
              )}
            >
              {siteSettings.siteName || 'Nusantara Wayang'}
            </span>
            <span
              className={cn(
                'text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold block mt-0.5 transition-colors',
                isHome ? 'text-[#E5A962]' : 'text-[#8C5D38]'
              )}
            >
              Modern Javanese Heritage
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = currentTab === link.id;

            if (isHome) {
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-[#C26B38]/20 text-[#E5A962] font-bold border border-[#C26B38]/40 shadow-xs'
                      : 'text-[#C8B8A6] hover:bg-white/10 hover:text-[#FAF7F2]'
                  )}
                >
                  {link.label}
                </button>
              );
            }

            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-[#EFE7DC] text-[#C26B38] font-bold shadow-2xs'
                    : 'text-[#5C4A3C] hover:bg-[#F3ECE1] hover:text-[#3A2413]'
                )}
              >
                {link.label}
              </button>
            );
          })}

          {/* Action Buttons */}
          <div
            className={cn(
              'flex items-center gap-2 ml-2 pl-2 border-l',
              isHome ? 'border-[#4A3423]' : 'border-[#E8DFD5]'
            )}
          >
            <button
              id="header-btn-contact"
              onClick={() => handleLinkClick('contact')}
              className={cn(
                'inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shadow-2xs cursor-pointer border',
                isHome
                  ? 'border-[#FAF7F2]/20 bg-white/5 hover:bg-white/10 text-[#FAF7F2] hover:border-[#FAF7F2]/40'
                  : 'border-[#D8C7B5] bg-white hover:bg-[#FAF3EC] text-[#5C4A3C] hover:text-[#3A2413]'
              )}
            >
              Hubungi Kami
            </button>

            <button
              id="header-btn-products"
              onClick={() => handleLinkClick('products')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C26B38] hover:bg-[#D9773F] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Lihat Produk</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          id="mobile-menu-toggle-btn"
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'p-2 rounded-full border md:hidden transition-colors shadow-2xs cursor-pointer',
            isHome
              ? 'border-[#4A3423] bg-[#241710]/90 hover:bg-[#382417] text-[#FAF7F2]'
              : 'border-[#D8C7B5] bg-white/70 hover:bg-[#FAF3EC] text-[#5C4A3C] hover:text-[#3A2413]'
          )}
          aria-label="Toggle navigation menu"
        >
          <MenuToggleIcon open={open} className="w-5 h-5" duration={300} />
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          'fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden transition-all duration-300 backdrop-blur-xl',
          isHome
            ? 'bg-[#1A110B]/98 text-[#FAF7F2] border-[#4A3423]'
            : 'bg-[#FAF7F2]/98 text-[#3A2413] border-[#E8DFD5]',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'flex h-full w-full flex-col justify-between gap-y-4 p-5 transition-transform duration-300 ease-out',
            open ? 'translate-y-0' : '-translate-y-4'
          )}
        >
          {/* Navigation Link List */}
          <div className="grid gap-y-1.5 pt-2">
            {links.map((link) => {
              const isActive = currentTab === link.id;

              if (isHome) {
                return (
                  <button
                    key={link.id}
                    id={`mobile-nav-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors',
                      isActive
                        ? 'bg-[#C26B38]/20 text-[#E5A962] font-bold border border-[#C26B38]/30 shadow-2xs'
                        : 'text-[#C8B8A6] hover:bg-[#241710] hover:text-[#FAF7F2]'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <div className="w-2 h-2 rounded-full bg-[#E5A962]" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-[#A89889] opacity-60" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors',
                    isActive
                      ? 'bg-[#EFE7DC] text-[#C26B38] font-bold shadow-2xs'
                      : 'text-[#5C4A3C] hover:bg-[#F3ECE1] hover:text-[#3A2413]'
                  )}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <div className="w-2 h-2 rounded-full bg-[#C26B38]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-[#A89889] opacity-60" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Action CTA Buttons */}
          <div
            className={cn(
              'flex flex-col gap-2.5 pb-6 pt-4 border-t',
              isHome ? 'border-[#4A3423]' : 'border-[#E8DFD5]'
            )}
          >
            <button
              onClick={() => handleLinkClick('contact')}
              className={cn(
                'w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 shadow-2xs border',
                isHome
                  ? 'border-[#4A3423] bg-[#241710] hover:bg-[#382417] text-[#FAF7F2]'
                  : 'border-[#D8C7B5] bg-white hover:bg-[#FAF3EC] text-[#5C4A3C]'
              )}
            >
              <MessageCircle className="w-4 h-4 text-[#E5A962]" />
              <span>Hubungi Pengrajin</span>
            </button>

            <button
              onClick={() => handleLinkClick('products')}
              className="w-full py-3 rounded-full bg-[#C26B38] hover:bg-[#D9773F] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Lihat Katalog Produk</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Export alias Header for compatibility
export const Header = Navbar;
