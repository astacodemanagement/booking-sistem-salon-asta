import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Scissors, 
  Clock, 
  ShieldCheck, 
  Search, 
  Phone,
  Lock,
  LogOut
} from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { BookingWizard } from './components/booking/BookingWizard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { BookingStatusLookupModal } from './components/booking/BookingStatusLookupModal';
import { CatalogModal } from './components/modals/CatalogModal';
import { BranchesModal } from './components/modals/BranchesModal';
import { StorageService } from './services/storage';
import { Branch, ServiceCategory, Service, Stylist, PromoCode, Booking } from './types';

export default function App() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Navigation View & Auth Session based on URL hash:
  // "/" -> Public Customer Portal (Light Mode, simple step-by-step booking)
  // "/#admin" -> Private Staff / Admin Portal (Login gate -> Management Dashboard)
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>(() => {
    return window.location.hash.toLowerCase().includes('admin') ? 'admin' : 'customer';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('asta_admin_authenticated') === 'true';
  });

  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);

  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const reloadData = () => {
    setBranches(StorageService.getBranches());
    setCategories(StorageService.getCategories());
    setServices(StorageService.getServices());
    setStylists(StorageService.getStylists());
    setPromos(StorageService.getPromos());
    setBookings(StorageService.getBookings());
  };

  useEffect(() => {
    reloadData();

    // Listen to hash changes for separate URL routing (/ for customer, /#admin for staff)
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash.toLowerCase().includes('admin');
      setCurrentView(isHashAdmin ? 'admin' : 'customer');
      if (isHashAdmin) {
        setIsAdminAuthenticated(localStorage.getItem('asta_admin_authenticated') === 'true');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (view: 'customer' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      // Clean up hash to return to public customer portal
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('asta_admin_authenticated');
    localStorage.removeItem('asta_admin_user');
    setIsAdminAuthenticated(false);
    handleViewChange('customer');
  };

  const handleCompleteBooking = (newBookingData: Omit<Booking, 'id' | 'referenceCode' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageService.addBooking(newBookingData);
    reloadData();
    return created;
  };

  const handleCancelBooking = (bookingId: string) => {
    StorageService.updateBookingStatus(bookingId, 'cancelled');
    reloadData();
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#2c2724] selection:bg-[#dfc19a] selection:text-[#382b1c] font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenBranches={() => setIsBranchesOpen(true)}
        onNewBookingClick={() => {
          setSelectedBranchId(undefined);
          setSelectedServiceId(undefined);
          handleViewChange('customer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogoutAdmin={handleAdminLogout}
        isAdminLoggedIn={isAdminAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'customer' ? (
          <div>
            {/* Friendly Clean Light Mode Header Section */}
            <section className="pt-8 pb-4 text-center px-4 max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f6ecde] border border-[#e0cdb6] text-xs font-semibold text-[#8a602b] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#b58c54]" />
                <span>Formulir Reservasi Resmi Salon Asta</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                Pesan Jadwal Salon dengan Mudah
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                Silakan ikuti 4 langkah sederhana di bawah untuk memilih cabang, perawatan, dan jadwal kedatangan Anda. Tanpa perlu antre di tempat!
              </p>

              {/* Quick Help WhatsApp Bar for Elderly / Confused users */}
              <div className="p-3.5 rounded-2xl bg-[#edf9f1] border border-emerald-200/80 max-w-xl mx-auto flex items-center justify-between gap-3 text-left shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Butuh bantuan memesan?</div>
                    <div className="text-[11px] text-stone-600">Hubungi WhatsApp admin kami, kami siap pandu sampai selesai.</div>
                  </div>
                </div>
                <a
                  href="https://wa.me/6281298881234?text=Halo%20Admin%20Salon%20Asta,%20bisa%20tolong%20bantu%20saya%20untuk%20booking%20jadwal%20perawatan?"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-xs"
                >
                  Chat WA
                </a>
              </div>
            </section>

            {/* Simple Step-by-Step Form Container */}
            <section id="booking-section" className="pb-16">
              <BookingWizard
                branches={branches}
                categories={categories}
                services={services}
                stylists={stylists}
                promos={promos}
                bookings={bookings}
                onCompleteBooking={handleCompleteBooking}
                initialBranchId={selectedBranchId}
                initialServiceId={selectedServiceId}
              />
            </section>
          </div>
        ) : (
          /* Admin / Staff View: Separated URL (#admin) - Login Gate First, then Dashboard! */
          !isAdminAuthenticated ? (
            <AdminLogin
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                reloadData();
              }}
              onBackToCustomer={() => handleViewChange('customer')}
            />
          ) : (
            <AdminDashboard
              branches={branches}
              categories={categories}
              services={services}
              stylists={stylists}
              promos={promos}
              bookings={bookings}
              onDataChanged={reloadData}
              onSwitchToCustomer={() => handleViewChange('customer')}
              onLogout={handleAdminLogout}
            />
          )
        )}
      </main>

      {/* Modals */}
      <BookingStatusLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        bookings={bookings}
        branches={branches}
        services={services}
        stylists={stylists}
        onCancelBooking={handleCancelBooking}
      />

      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        categories={categories}
        services={services}
        onSelectServiceAndBook={(srvId) => {
          setSelectedServiceId(srvId);
          handleViewChange('customer');
        }}
      />

      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        branches={branches}
        onSelectBranchAndBook={(bId) => {
          setSelectedBranchId(bId);
          handleViewChange('customer');
        }}
      />

      {/* Footer in Light Mode */}
      <footer className="border-t border-[#eae3d5] bg-white text-stone-600 text-xs py-8 no-print">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-stone-900 font-serif text-lg font-bold">
              <span className="w-6 h-6 rounded-full border border-[#b58c54] flex items-center justify-center text-xs text-[#9c7540] font-serif bg-[#faf5eb]">A</span>
              <span>SALON ASTA</span>
            </div>
            <span className="text-[10px] tracking-[0.2em] text-[#9c7540] uppercase font-bold mt-0.5">
              Hair & Beauty Atelier
            </span>
          </div>

          <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
            Sistem Booking Online Praktis & Ramah Pengguna. Tersedia di Senopati, PIK, Kelapa Gading, Gading Serpong, Bandung, dan Bali.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button onClick={() => setIsLookupOpen(true)} className="text-[#8a602b] hover:text-[#5f3e15] hover:underline">
              Cek Status Booking
            </button>
            <span className="text-stone-300">•</span>
            <button onClick={() => setIsCatalogOpen(true)} className="text-[#8a602b] hover:text-[#5f3e15] hover:underline">
              Menu Layanan & Harga
            </button>
            <span className="text-stone-300">•</span>
            <button onClick={() => setIsBranchesOpen(true)} className="text-[#8a602b] hover:text-[#5f3e15] hover:underline">
              Lokasi Cabang
            </button>
          </div>

          {/* Discreet Staff link at the bottom (not prominent) */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
            <div>
              © 2026 SALON ASTA ID. Hak cipta dilindungi.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-300">|</span>
              <a 
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewChange('admin');
                }}
                className="text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1 font-medium"
                title="Akses Portal Staff"
              >
                <Lock className="w-3 h-3" />
                <span>Akses Karyawan</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
