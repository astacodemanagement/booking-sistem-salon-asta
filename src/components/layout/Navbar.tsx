import React, { useState } from 'react';
import { Calendar, Search, Sparkles, MapPin, Menu, X, Scissors, ArrowLeft, ShieldCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
  onOpenLookup: () => void;
  onOpenCatalog: () => void;
  onOpenBranches: () => void;
  onNewBookingClick: () => void;
  onLogoutAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenLookup,
  onOpenCatalog,
  onOpenBranches,
  onNewBookingClick,
  onLogoutAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eae3d5] bg-white/95 backdrop-blur-md shadow-xs transition-all">
      {/* Top Banner Promo (Only shown on customer view) */}
      {currentView === 'customer' && (
        <div className="bg-gradient-to-r from-[#fcf7ef] via-[#f7ecdc] to-[#fcf7ef] border-b border-[#ebdccb] py-1.5 px-3 sm:px-4 text-center text-[11px] sm:text-xs tracking-wider text-[#8a602b] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#b58c54] animate-pulse shrink-0" />
          <span className="truncate">Gunakan kode voucher <strong>ASTANEW</strong> untuk diskon 20% reservasi online pertama Anda!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo - SALON ASTA (Responsive & Elegant) */}
        <div 
          onClick={() => {
            onViewChange('customer');
            onNewBookingClick();
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#b58c54]/60 bg-[#faf5eb] flex items-center justify-center text-[#9c7540] font-serif text-lg sm:text-xl font-bold tracking-tight shadow-xs group-hover:border-[#9c7540] transition-colors shrink-0">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base sm:text-xl lg:text-2xl tracking-[0.1em] sm:tracking-[0.16em] font-bold text-stone-900 group-hover:text-[#9c7540] transition-colors leading-tight">
              SALON ASTA
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.22em] text-[#9c7540] font-semibold leading-none mt-0.5 truncate max-w-[130px] sm:max-w-none">
              Hair & Beauty Atelier
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          {currentView === 'customer' ? (
            <>
              <button
                onClick={onNewBookingClick}
                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-800 hover:text-[#9c7540] transition-colors flex items-center gap-1.5 rounded-xl hover:bg-[#faf6f0]"
              >
                <Calendar className="w-4 h-4 text-[#b58c54]" />
                Reservasi
              </button>

              <button
                onClick={onOpenCatalog}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 rounded-xl hover:bg-[#faf6f0]"
              >
                <Scissors className="w-4 h-4 text-stone-400" />
                Menu & Harga
              </button>

              <button
                onClick={onOpenBranches}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 rounded-xl hover:bg-[#faf6f0]"
              >
                <MapPin className="w-4 h-4 text-stone-400" />
                Lokasi Cabang
              </button>

              <button
                onClick={onOpenLookup}
                className="ml-1 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#8a602b] bg-[#faf3e8] hover:bg-[#f3e6d3] border border-[#dfc9ae] transition-colors flex items-center gap-1.5 rounded-xl shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                Cek Booking
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Portal Khusus Staff & Admin
              </span>
              <button
                onClick={() => onViewChange('customer')}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Lihat Website Tamu</span>
              </button>
              {isAdminLoggedIn && onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button (Customer only) */}
        {currentView === 'customer' ? (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenLookup}
              className="px-2.5 py-1.5 text-xs font-bold text-[#8a602b] bg-[#faf3e8] border border-[#dfc9ae] rounded-lg flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek Booking</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onViewChange('customer')}
              className="px-2.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 rounded-lg flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Web Tamu</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer (Clean Light Mode) */}
      {mobileMenuOpen && currentView === 'customer' && (
        <div className="md:hidden border-t border-[#eae3d5] bg-white px-4 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNewBookingClick();
            }}
            className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold text-stone-900 bg-[#faf6f0] flex items-center gap-2.5"
          >
            <Calendar className="w-4 h-4 text-[#b58c54]" />
            Buat Reservasi Baru
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLookup();
            }}
            className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-[#8a602b] bg-[#faf3e8] flex items-center gap-2.5"
          >
            <Search className="w-4 h-4 text-[#b58c54]" />
            Cek Status Booking
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCatalog();
            }}
            className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
          >
            <Scissors className="w-4 h-4 text-stone-400" />
            Daftar Layanan & Harga
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBranches();
            }}
            className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
          >
            <MapPin className="w-4 h-4 text-stone-400" />
            Lokasi 6 Cabang Outlet
          </button>
        </div>
      )}
    </header>
  );
};
