import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Clock3, 
  Plus, 
  Search, 
  Phone, 
  Scissors, 
  Tag, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Edit2, 
  Building2, 
  X,
  ExternalLink,
  MessageSquare,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Branch, ServiceCategory, Service, Stylist, PromoCode, Booking, BookingStatus } from '../../types';
import { formatIDR, formatDateID, getWhatsAppUrl } from '../../utils/formatters';
import { StorageService } from '../../services/storage';

interface AdminDashboardProps {
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  stylists: Stylist[];
  promos: PromoCode[];
  bookings: Booking[];
  onDataChanged: () => void;
  onSwitchToCustomer: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  branches,
  categories,
  services,
  stylists,
  promos,
  bookings,
  onDataChanged,
  onSwitchToCustomer,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'branches' | 'stylists' | 'promos' | 'database'>('bookings');
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isAddBookingOpen, setIsAddBookingOpen] = useState<boolean>(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);
  const [isAddStylistOpen, setIsAddStylistOpen] = useState<boolean>(false);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState<boolean>(false);
  const [isAddPromoOpen, setIsAddPromoOpen] = useState<boolean>(false);

  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const filteredBookings = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchBranch = branchFilter === 'all' || b.branchId === branchFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      b.referenceCode.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.phone.includes(q);
    return matchStatus && matchBranch && matchSearch;
  });

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    StorageService.updateBookingStatus(bookingId, status);
    onDataChanged();
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('Yakin ingin menghapus data booking ini dari sistem Salon Asta?')) {
      StorageService.deleteBooking(bookingId);
      if (selectedBookingDetail?.id === bookingId) {
        setSelectedBookingDetail(null);
      }
      onDataChanged();
    }
  };

  const getBranch = (id: string) => branches.find(b => b.id === id);
  const getStylist = (id: string) => stylists.find(s => s.id === id);
  const getServiceList = (ids: string[]) => services.filter(s => ids.includes(s.id));

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin me-reset semua data ke demo awal Salon Asta?')) {
      StorageService.resetAllToDefault();
      onDataChanged();
      alert('Data berhasil di-reset ke setelan awal Salon Asta.');
    }
  };

  const handleExportData = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salon-asta-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && StorageService.importAllData(content)) {
        onDataChanged();
        alert('Data berhasil diimpor dari file JSON!');
      } else {
        alert('Gagal mengimpor file. Pastikan format JSON sesuai.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#faf8f5] text-stone-900">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#faf5eb] text-[#8a602b] border border-[#dfc9ae] uppercase tracking-wider">
              Portal Internal Staff
            </span>
            <span className="text-xs text-stone-400 font-mono">Salon Asta v1.2</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Dashboard Manajemen Salon Asta
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Monitoring jadwal kunjungan tamu, status meja stylist, layanan perawatan, dan performa outlet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSwitchToCustomer}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors border border-stone-200 flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#b58c54]" />
            <span className="hidden sm:inline">Lihat Web Tamu</span>
            <span className="sm:hidden">Web Tamu</span>
          </button>

          <button
            onClick={() => setIsAddBookingOpen(true)}
            className="px-3.5 py-2 bg-[#b58c54] hover:bg-[#a07742] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Walk-In</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar dari sesi Admin"
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors border border-rose-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar (Light Mode) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Reservasi Hari Ini</span>
            <Calendar className="w-4 h-4 text-[#b58c54]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {todayBookings.length}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              dari total {bookings.length} reservasi
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Menunggu Konfirmasi</span>
            <Clock3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {pendingBookings.length}
            </div>
            <span className="text-[11px] text-amber-800/80 mt-0.5 block">
              perlu review & konfirmasi staff
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Nilai Booking</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {formatIDR(totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">
              {completedBookings.length} reservasi selesai
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Outlet & Stylist</span>
            <Building2 className="w-4 h-4 text-[#9c7540]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {branches.length} <span className="text-sm font-normal text-stone-500">/ {stylists.length} Stylist</span>
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Salon Asta terdaftar aktif
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#b58c54]" />
          <span>Daftar Reservasi ({bookings.length})</span>
          {pendingBookings.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-bold">
              {pendingBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'services'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Scissors className="w-4 h-4 text-[#b58c54]" />
          <span>Katalog Layanan ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'branches'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#b58c54]" />
          <span>Cabang Outlet ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stylists')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stylists'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4 text-[#b58c54]" />
          <span>Hair Stylists ({stylists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'promos'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Tag className="w-4 h-4 text-[#b58c54]" />
          <span>Voucher Promo ({promos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-white text-stone-900 border-t-2 border-[#b58c54] shadow-2xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-[#b58c54]" />
          <span>Backup & DB Reset</span>
        </button>
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#eae3d5] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kode booking, nama customer, atau nomor telepon..."
                className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#b58c54]"
              >
                <option value="all">Semua Cabang</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#b58c54]"
              >
                <option value="all">Semua Status ({bookings.length})</option>
                <option value="pending">Menunggu Konfirmasi ({pendingBookings.length})</option>
                <option value="confirmed">Terkonfirmasi</option>
                <option value="in_service">Sedang Perawatan</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#eae3d5] rounded-2xl overflow-hidden shadow-xs">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                <p className="text-sm font-medium">Tidak ada reservasi yang sesuai dengan filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf6ef] text-stone-600 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Kode & Tamu</th>
                      <th className="px-5 py-3.5">Outlet & Stylist</th>
                      <th className="px-5 py-3.5">Jadwal Kedatangan</th>
                      <th className="px-5 py-3.5">Layanan</th>
                      <th className="px-5 py-3.5">Total & Pembayaran</th>
                      <th className="px-5 py-3.5">Status Reservasi</th>
                      <th className="px-5 py-3.5 text-right">Aksi Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.map(b => {
                      const branch = getBranch(b.branchId);
                      const stylist = b.stylistId === 'any' ? null : getStylist(b.stylistId);
                      const bookedServices = getServiceList(b.serviceIds);

                      return (
                        <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-mono font-bold text-sm text-[#8a602b]">
                              {b.referenceCode}
                            </div>
                            <div className="font-semibold text-stone-900 mt-0.5">
                              {b.customer.name}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span>{b.customer.phone}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium text-stone-900">
                              {branch?.name || 'Salon Asta'}
                            </div>
                            <div className="text-[11px] text-[#9c7540] flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3" />
                              <span>{stylist ? stylist.name : 'Any Stylist'}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium text-stone-900">
                              {formatDateID(b.date)}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>{b.timeSlot} WIB</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 max-w-xs">
                            <div className="text-stone-800 line-clamp-1 font-medium">
                              {bookedServices.map(s => s.name).join(', ')}
                            </div>
                            <div className="text-[10px] text-stone-400 mt-0.5">
                              {bookedServices.length} Treatment ({bookedServices.reduce((acc, s) => acc + s.durationMinutes, 0)} menit)
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-stone-900">
                              {formatIDR(b.totalAmount)}
                            </div>
                            <div className="text-[10px] text-stone-500 capitalize">
                              {b.paymentMethod === 'salon' ? 'Bayar di Salon' : b.paymentMethod.toUpperCase()}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={b.status}
                              onChange={e => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : b.status === 'in_service'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : b.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : b.status === 'completed'
                                  ? 'bg-stone-100 text-stone-600 border-stone-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <option value="pending">Menunggu (Pending)</option>
                              <option value="confirmed">Terkonfirmasi (Confirmed)</option>
                              <option value="in_service">Sedang Treatment (In Service)</option>
                              <option value="completed">Selesai (Completed)</option>
                              <option value="cancelled">Dibatalkan (Cancelled)</option>
                            </select>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={getWhatsAppUrl(
                                  b.customer.phone,
                                  `Halo kak ${b.customer.name}, ini dari Tim Resepsionis ${branch?.name || 'Salon Asta'}. Kami ingin mengonfirmasi jadwal reservasi Anda kode *${b.referenceCode}* pada ${formatDateID(b.date)} jam ${b.timeSlot} WIB. Apakah ada hal yang ingin ditanyakan sebelum kedatangan? Terima kasih!`
                                )}
                                target="_blank"
                                rel="noreferrer"
                                title="Chat WhatsApp Customer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => setSelectedBookingDetail(b)}
                                title="Lihat Detail Lengkap"
                                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                title="Hapus Data"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Katalog Menu & Harga Salon Asta ({services.length})
            </h3>
            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Layanan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => {
              const cat = categories.find(c => c.id === s.categoryId);
              return (
                <div key={s.id} className="p-4 rounded-xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#9c7540] uppercase font-bold">{cat?.name}</span>
                      {s.tag && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#faf3e8] text-[#8a602b]">
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{s.name}</h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{s.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{s.durationMinutes} mnt</span>
                      </div>
                      <div className="text-sm font-bold text-stone-900 mt-0.5">
                        {formatIDR(s.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus layanan "${s.name}"?`)) {
                          const updated = services.filter(item => item.id !== s.id);
                          StorageService.saveServices(updated);
                          onDataChanged();
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Cabang Outlet Resmi Salon Asta ({branches.length})
            </h3>
            <button
              onClick={() => setIsAddBranchOpen(true)}
              className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Cabang Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map(b => (
              <div key={b.id} className="rounded-xl overflow-hidden bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
                <div className="h-32 relative">
                  <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-stone-800 shadow-xs">
                    {b.city}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm">{b.name}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2">{b.address}</p>
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <div>Jam: {b.operatingHours}</div>
                    <div>WhatsApp: +{b.whatsapp}</div>
                  </div>
                </div>

                <div className="p-3 bg-[#faf7f2] border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Beroperasi Aktif</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus cabang "${b.name}"?`)) {
                        const updated = branches.filter(item => item.id !== b.id);
                        StorageService.saveBranches(updated);
                        onDataChanged();
                      }
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STYLISTS */}
      {activeTab === 'stylists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Daftar Hair Stylist Salon Asta ({stylists.length})
            </h3>
            <button
              onClick={() => setIsAddStylistOpen(true)}
              className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Stylist Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stylists.map(s => (
              <div key={s.id} className="p-4 rounded-xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover border border-[#b58c54]/30" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{s.name}</h4>
                      <p className="text-xs text-[#9c7540] font-medium">{s.title}</p>
                      <span className="text-[11px] text-stone-500">★ {s.rating} ({s.reviewCount} ulasan)</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-2">{s.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.specialties.map((sp, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Jadwal Aktif</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus stylist "${s.name}"?`)) {
                        const updated = stylists.filter(item => item.id !== s.id);
                        StorageService.saveStylists(updated);
                        onDataChanged();
                      }
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROMOS */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Voucher & Kupon Diskon ({promos.length})
            </h3>
            <button
              onClick={() => setIsAddPromoOpen(true)}
              className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Kupon Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-white border border-[#eae3d5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-base font-bold text-[#8a602b] bg-[#faf5eb] px-2.5 py-1 rounded-lg border border-[#dfc9ae]">
                      {p.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `${formatIDR(p.discountValue)} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 mt-1">{p.description}</p>
                  <div className="text-[11px] text-stone-500 mt-2 space-y-0.5">
                    <div>Min. Belanja: {formatIDR(p.minSpend)}</div>
                    <div>Berlaku s/d: {p.validUntil}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Promo Aktif</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus promo "${p.code}"?`)) {
                        const updated = promos.filter(item => item.id !== p.id);
                        StorageService.savePromos(updated);
                        onDataChanged();
                      }
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DATABASE */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-white border border-[#eae3d5] shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#b58c54]" />
              Database Penyimpanan Lokal (LocalStorage)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Data Salon Asta tersimpan di browser. Anda dapat membuat file cadangan JSON atau memulihkannya kapan saja.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Backup Data (Download JSON)</h4>
                <p className="text-xs text-stone-500">Unduh seluruh cabang, layanan, stylist, dan reservasi.</p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-stone-300 shadow-2xs"
              >
                <Download className="w-4 h-4 text-[#b58c54]" />
                <span>Download JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Restore Data (Upload JSON)</h4>
                <p className="text-xs text-stone-500">Pulihkan data Salon Asta dari file cadangan yang pernah diunduh.</p>
              </div>
              <label className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-stone-300 shadow-2xs cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-rose-800">Reset ke Demo Awal</h4>
                <p className="text-xs text-rose-600/90">Kembalikan semua reservasi dan master data ke setelan awal.</p>
              </div>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-[#eae3d5] rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono font-bold text-lg text-[#8a602b]">
                  {selectedBookingDetail.referenceCode}
                </span>
                <p className="text-xs text-stone-500">Rincian Lengkap Tamu Reservasi</p>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#faf7f2] rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block uppercase text-[10px] font-bold">Nama Tamu</span>
                  <strong className="text-stone-900 text-sm">{selectedBookingDetail.customer.name}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase text-[10px] font-bold">WhatsApp</span>
                  <strong className="text-stone-900 text-sm">{selectedBookingDetail.customer.phone}</strong>
                </div>
              </div>

              {selectedBookingDetail.customer.notes && (
                <div className="p-3 bg-[#faf7f2] rounded-xl border border-stone-200">
                  <span className="text-stone-400 block uppercase text-[10px] font-bold mb-1">Catatan Tamu</span>
                  <p className="text-stone-800 italic">&ldquo;{selectedBookingDetail.customer.notes}&rdquo;</p>
                </div>
              )}

              <div className="p-3 bg-[#faf7f2] rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-400 block uppercase text-[10px] font-bold mb-1">Layanan ({selectedBookingDetail.serviceIds.length})</span>
                {getServiceList(selectedBookingDetail.serviceIds).map(s => (
                  <div key={s.id} className="flex justify-between text-stone-700">
                    <span>• {s.name}</span>
                    <span className="font-bold">{formatIDR(s.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Biaya</span>
                  <span className="text-[#8a602b]">{formatIDR(selectedBookingDetail.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN MODAL */}
      {isAddBookingOpen && (
        <AddWalkInBookingModal
          isOpen={isAddBookingOpen}
          onClose={() => setIsAddBookingOpen(false)}
          branches={branches}
          services={services}
          onSave={(newBooking) => {
            StorageService.addBooking(newBooking);
            setIsAddBookingOpen(false);
            onDataChanged();
          }}
        />
      )}

      {/* ADD SERVICE MODAL */}
      {isAddServiceOpen && (
        <AddServiceModal
          isOpen={isAddServiceOpen}
          onClose={() => setIsAddServiceOpen(false)}
          categories={categories}
          onSave={(newService) => {
            const current = StorageService.getServices();
            current.unshift(newService);
            StorageService.saveServices(current);
            setIsAddServiceOpen(false);
            onDataChanged();
          }}
        />
      )}

      {/* ADD STYLIST MODAL */}
      {isAddStylistOpen && (
        <AddStylistModal
          isOpen={isAddStylistOpen}
          onClose={() => setIsAddStylistOpen(false)}
          branches={branches}
          onSave={(newStylist) => {
            const current = StorageService.getStylists();
            current.unshift(newStylist);
            StorageService.saveStylists(current);
            setIsAddStylistOpen(false);
            onDataChanged();
          }}
        />
      )}

      {/* ADD BRANCH MODAL */}
      {isAddBranchOpen && (
        <AddBranchModal
          isOpen={isAddBranchOpen}
          onClose={() => setIsAddBranchOpen(false)}
          onSave={(newBranch) => {
            const current = StorageService.getBranches();
            current.unshift(newBranch);
            StorageService.saveBranches(current);
            setIsAddBranchOpen(false);
            onDataChanged();
          }}
        />
      )}

      {/* ADD PROMO MODAL */}
      {isAddPromoOpen && (
        <AddPromoModal
          isOpen={isAddPromoOpen}
          onClose={() => setIsAddPromoOpen(false)}
          onSave={(newPromo) => {
            const current = StorageService.getPromos();
            current.unshift(newPromo);
            StorageService.savePromos(current);
            setIsAddPromoOpen(false);
            onDataChanged();
          }}
        />
      )}
    </div>
  );
};

// Sub-modals
const AddWalkInBookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  services: Service[];
  onSave: (booking: Omit<Booking, 'id' | 'referenceCode' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ isOpen, onClose, branches, services, onSave }) => {
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [serviceIds, setServiceIds] = useState<string[]>([services[0]?.id || '']);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('14:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const total = services.filter(s => serviceIds.includes(s.id)).reduce((a, b) => a + b.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || serviceIds.length === 0) {
      alert('Mohon isi nama tamu, nomor telepon, dan pilih minimal 1 layanan.');
      return;
    }

    onSave({
      branchId,
      serviceIds,
      stylistId: 'any',
      date,
      timeSlot,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: `${name.toLowerCase().replace(/\s+/g, '')}@walkin.asta`,
        gender: 'Wanita',
        notes: '[Walk-in offline]',
      },
      subtotal: total,
      discountAmount: 0,
      totalAmount: total,
      paymentMethod: 'salon',
      paymentStatus: 'paid_full',
      status: 'in_service',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white border border-[#eae3d5] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#b58c54]" />
            Input Tamu Walk-In Salon Asta
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Nama Tamu *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama pelanggan"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">WhatsApp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0812xxxx"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Cabang</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Jam Datang</label>
              <input
                type="text"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Pilih Perawatan</label>
            <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-stone-50 border border-stone-200 rounded-xl">
              {services.map(s => {
                const checked = serviceIds.includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2 text-stone-800 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setServiceIds(serviceIds.filter(id => id !== s.id));
                        } else {
                          setServiceIds([...serviceIds, s.id]);
                        }
                      }}
                    />
                    <span className="flex-1 line-clamp-1">{s.name}</span>
                    <span className="font-bold text-[#8a602b]">{formatIDR(s.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 text-sm font-bold text-stone-900">
            <span>Total Tagihan:</span>
            <span className="text-[#8a602b]">{formatIDR(total)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
            Batal
          </button>
          <button type="submit" className="px-5 py-2 bg-[#b58c54] text-white font-bold text-xs rounded-xl">
            Simpan Walk-In
          </button>
        </div>
      </form>
    </div>
  );
};

const AddServiceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  onSave: (service: Service) => void;
}> = ({ isOpen, onClose, categories, onSave }) => {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(350000);
  const [tag, setTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: `srv-${Date.now()}`,
      categoryId,
      name: name.trim(),
      description: description.trim(),
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      tag: tag.trim() || undefined,
      isPopular: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#eae3d5] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-stone-900">Tambah Layanan Baru</h3>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Nama Layanan *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Asta Royal Blow"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Deskripsi</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Keterangan tahapan perawatan..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Harga (Rp) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Durasi (Menit)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Badge Tag (Opsional)</label>
            <input
              type="text"
              value={tag}
              onChange={e => setTag(e.target.value)}
              placeholder="Best Seller, Trending"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
            Batal
          </button>
          <button type="submit" className="px-5 py-2 bg-[#b58c54] text-white font-bold text-xs rounded-xl">
            Simpan Layanan
          </button>
        </div>
      </form>
    </div>
  );
};

const AddStylistModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  onSave: (stylist: Stylist) => void;
}> = ({ isOpen, onClose, branches, onSave }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Senior Stylist');
  const [specialtiesStr, setSpecialtiesStr] = useState('Layer Cut, Balayage, Treatment');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: `stylist-${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.95,
      reviewCount: 30,
      branchIds: branches.map(b => b.id),
      specialties: specialtiesStr.split(',').map(s => s.trim()).filter(Boolean),
      bio: 'Stylist profesional berpengalaman.',
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#eae3d5] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-stone-900">Tambah Stylist Baru</h3>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama stylist"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Jabatan</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Senior Hair Designer"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Spesialisasi</label>
            <input
              type="text"
              value={specialtiesStr}
              onChange={e => setSpecialtiesStr(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
            Batal
          </button>
          <button type="submit" className="px-5 py-2 bg-[#b58c54] text-white font-bold text-xs rounded-xl">
            Simpan Stylist
          </button>
        </div>
      </form>
    </div>
  );
};

const AddBranchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: Branch) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('6281298881234');
  const [operatingHours, setOperatingHours] = useState('10:00 - 21:00 WIB');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: `branch-${Date.now()}`,
      name: name.trim(),
      city: city.trim(),
      address: address.trim(),
      phone: '+62 21 5000 1234',
      whatsapp: whatsapp.trim(),
      gmapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name)}`,
      operatingHours,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
      features: ['Lounge Eksklusif', 'Konsultasi Gratis', 'Parkir Luas'],
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#eae3d5] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-stone-900">Tambah Cabang Baru</h3>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Nama Outlet *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Salon Asta Pondok Indah"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Kota</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Jam Operasional</label>
              <input
                type="text"
                value={operatingHours}
                onChange={e => setOperatingHours(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Alamat</label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">WhatsApp Outlet</label>
            <input
              type="text"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
            Batal
          </button>
          <button type="submit" className="px-5 py-2 bg-[#b58c54] text-white font-bold text-xs rounded-xl">
            Simpan Cabang
          </button>
        </div>
      </form>
    </div>
  );
};

const AddPromoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: PromoCode) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountValue, setDiscountValue] = useState(15);
  const [minSpend, setMinSpend] = useState(300000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      description: description.trim() || `Diskon ${discountValue}%`,
      discountType: 'percentage',
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      validUntil: '2026-12-31',
      isActive: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#eae3d5] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-stone-900">Buat Kupon Diskon</h3>
          <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Kode Voucher *</label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: ASTA15"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Diskon (%)</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Min. Belanja (Rp)</label>
              <input
                type="number"
                value={minSpend}
                onChange={e => setMinSpend(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Keterangan</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Diskon spesial reservasi online"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
            Batal
          </button>
          <button type="submit" className="px-5 py-2 bg-[#b58c54] text-white font-bold text-xs rounded-xl">
            Simpan Kupon
          </button>
        </div>
      </form>
    </div>
  );
};
