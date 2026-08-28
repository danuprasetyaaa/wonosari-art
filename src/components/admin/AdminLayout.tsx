import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  MapPin,
  Image,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Shield,
} from 'lucide-react';
import { GununganIcon } from '../common/JavaneseIcons';
import { AdminUser, SiteSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminUser: AdminUser;
  siteSettings: SiteSettings;
  onLogout: () => void;
  onViewWebsite: () => void;
  children: React.ReactNode;
}

export function AdminLayout({
  currentTab,
  onSelectTab,
  adminUser,
  siteSettings,
  onLogout,
  onViewWebsite,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Kelola Produk', icon: Package },
    { id: 'categories', label: 'Kategori Produk', icon: Layers },
    { id: 'branches', label: 'Cabang & Showroom', icon: MapPin },
    { id: 'gallery', label: 'Galeri Foto', icon: Image },
    { id: 'content', label: 'Konten Profil & Hero', icon: FileText },
    { id: 'settings', label: 'Pengaturan & WhatsApp', icon: Settings },
  ];

  const handleNav = (id: string) => {
    onSelectTab(id);
    setSidebarOpen(false);
  };

  return (
    <div id="admin-cms-layout" className="min-h-screen bg-[#F4EFEA] flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#261B14] text-[#E5DCD3] border-r border-[#3D2D23] shrink-0 min-h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#3D2D23]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C26B38] flex items-center justify-center text-amber-100 shadow-md">
              <GununganIcon className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight">
                Nusantara CMS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C29B7F] block">
                Panel Pengelola Toko
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C26B38] text-white shadow-sm'
                    : 'text-[#BDB0A4] hover:bg-[#38281E] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-[#3D2D23] space-y-2">
          <button
            onClick={onViewWebsite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#38281E] hover:bg-[#4E3729] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#C26B38]" />
            <span>Lihat Website Publik</span>
          </button>

          <div className="pt-2 flex items-center justify-between px-2 text-xs text-[#9E8E81]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#3D2D23] flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-white truncate max-w-[90px]">
                {adminUser.name}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Keluar dari Admin"
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#261B14] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <GununganIcon className="w-6 h-6 text-[#C26B38]" />
          <span className="font-serif font-bold text-base">Nusantara CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewWebsite}
            className="p-2 rounded-lg bg-[#38281E] text-xs text-[#E5DCD3] flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Web</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#38281E] text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {sidebarOpen && (
        <div className="lg:hidden bg-[#261B14] text-white p-4 border-b border-[#3D2D23] space-y-1 z-30">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-[#C26B38] text-white' : 'text-[#BDB0A4]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-4 border-t border-[#3D2D23] flex items-center justify-between">
            <span className="text-xs text-[#BDB0A4]">{adminUser.email}</span>
            <button
              onClick={onLogout}
              className="text-xs text-rose-400 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
