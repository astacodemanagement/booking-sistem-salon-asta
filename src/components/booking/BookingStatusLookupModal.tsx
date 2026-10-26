import React, { useState } from 'react';
import { X, Search, Calendar, Clock, MapPin, User, Scissors, CheckCircle2, Clock3, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { Booking, Branch, Service, Stylist } from '../../types';
import { formatDateID, formatIDR, getWhatsAppUrl } from '../../utils/formatters';

interface BookingStatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  branches: Branch[];
  services: Service[];
  stylists: Stylist[];
  onCancelBooking: (bookingId: string) => void;
}

export const BookingStatusLookupModal: React.FC<BookingStatusLookupModalProps> = ({
  isOpen,
  onClose,
  bookings,
  branches,
  services,
  stylists,
  onCancelBooking,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchingBookings, setMatchingBookings] = useState<Booking[]>([]);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const results = bookings.filter(b => {
      const matchCode = b.referenceCode.toLowerCase().includes(clean);
      const matchPhone = b.customer.phone.toLowerCase().includes(clean);
      const matchEmail = b.customer.email.toLowerCase().includes(clean);
      const matchName = b.customer.name.toLowerCase().includes(clean);
      return matchCode || matchPhone || matchEmail || matchName;
    });

    setMatchingBookings(results);
    setSearched(true);
  };

  const getBranch = (branchId: string) => branches.find(b => b.id === branchId);
  const getStylist = (stylistId: string) => stylists.find(s => s.id === stylistId);
  const getServiceList = (serviceIds: string[]) => services.filter(s => serviceIds.includes(s.id));

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Terkonfirmasi
          </span>
        );
      case 'in_service':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock3 className="w-3.5 h-3.5 animate-spin" />
            Sedang Perawatan
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3.5 h-3.5" />
            Menunggu Konfirmasi
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            ✓ Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#eae3d5] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eae3d5] flex items-center justify-between bg-[#faf6f0]">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#9c7540]" />
              Cek Status Reservasi Anda di Salon Asta
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Masukkan Kode Booking (contoh: ASTA-8921) atau nomor WhatsApp Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-6 border-b border-[#eae3d5] bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Kode Booking (ASTA-XXXX) / No. WhatsApp / Nama"
                className="w-full pl-10 pr-4 py-3 bg-[#faf8f5] border border-[#d9cebe] rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#9c7540] focus:ring-2 focus:ring-[#9c7540]/20 transition-all font-medium"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#b58c54] hover:bg-[#9c7540] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Cari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {bookings.length > 0 && (
            <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-stone-500">
              <span>Contoh kode aktif:</span>
              {bookings.slice(0, 3).map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setQuery(b.referenceCode);
                    const res = bookings.filter(item => item.id === b.id);
                    setMatchingBookings(res);
                    setSearched(true);
                  }}
                  className="font-mono text-[#8a602b] hover:underline bg-[#f6ecde] px-2 py-0.5 rounded-lg border border-[#e0cdb6] font-semibold"
                >
                  {b.referenceCode}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#faf8f5]">
          {!searched ? (
            <div className="text-center py-12 text-stone-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#9c7540]" />
              <p className="text-sm">Silakan masukkan kode booking atau nomor telepon untuk melihat status reservasi.</p>
            </div>
          ) : matchingBookings.length === 0 ? (
            <div className="text-center py-10 text-stone-600 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-80" />
              <h4 className="font-semibold text-stone-900 mb-1">Reservasi Tidak Ditemukan</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Tidak ada data booking yang cocok dengan kata kunci &quot;{query}&quot;. Pastikan kode booking atau nomor telepon sudah tepat.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 font-medium">
                Ditemukan {matchingBookings.length} data reservasi:
              </div>

              {matchingBookings.map(b => {
                const branch = getBranch(b.branchId);
                const stylist = b.stylistId === 'any' ? null : getStylist(b.stylistId);
                const bookedServices = getServiceList(b.serviceIds);

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-white border border-[#eae3d5] hover:border-[#b58c54] transition-colors shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-lg text-[#8a602b]">
                            {b.referenceCode}
                          </span>
                          {getStatusBadge(b.status)}
                        </div>
                        <span className="text-xs text-stone-400">
                          Dibuat pada {formatDateID(b.createdAt)}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-stone-400">Total Biaya</div>
                        <div className="text-base font-bold text-stone-900">
                          {formatIDR(b.totalAmount)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-stone-700">
                          <MapPin className="w-4 h-4 text-[#9c7540] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-stone-900">{branch?.name || 'Salon Asta'}</span>
                            <p className="text-[11px] text-stone-500">{branch?.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-stone-700">
                          <User className="w-4 h-4 text-[#9c7540] shrink-0" />
                          <span>Stylist: <strong className="text-stone-900">{stylist ? stylist.name : 'Stylist Siap Pertama'}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-stone-700">
                          <Calendar className="w-4 h-4 text-[#9c7540] shrink-0" />
                          <span>Tanggal: <strong className="text-stone-900">{formatDateID(b.date)}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 text-stone-700">
                          <Clock className="w-4 h-4 text-[#9c7540] shrink-0" />
                          <span>Waktu: <strong className="text-stone-900">{b.timeSlot} WIB</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#faf6f0] border border-[#ebdccb] mb-4">
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                        Layanan yang Dipesan ({bookedServices.length}):
                      </span>
                      <div className="space-y-1.5">
                        {bookedServices.map(s => (
                          <div key={s.id} className="flex justify-between text-xs text-stone-800">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Scissors className="w-3.5 h-3.5 text-[#9c7540]" />
                              {s.name}
                            </span>
                            <span className="text-stone-600 font-semibold">{formatIDR(s.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      {branch && (
                        <a
                          href={getWhatsAppUrl(
                            branch.whatsapp,
                            `Halo Salon Asta, saya ingin menanyakan booking saya dengan kode *${b.referenceCode}* a/n *${b.customer.name}*.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Hubungi WhatsApp Cabang</span>
                        </a>
                      )}

                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <div>
                          {cancelConfirmId === b.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-rose-600 font-medium">Yakin ingin batalkan?</span>
                              <button
                                onClick={() => {
                                  onCancelBooking(b.id);
                                  setCancelConfirmId(null);
                                  setMatchingBookings(prev =>
                                    prev.map(item => item.id === b.id ? { ...item, status: 'cancelled' } : item)
                                  );
                                }}
                                className="px-2.5 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 shadow-xs"
                              >
                                Ya, Batalkan
                              </button>
                              <button
                                onClick={() => setCancelConfirmId(null)}
                                className="px-2.5 py-1 bg-stone-200 text-stone-700 text-xs rounded-lg hover:bg-stone-300 font-medium"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelConfirmId(b.id)}
                              className="text-xs text-stone-400 hover:text-rose-600 underline transition-colors"
                            >
                              Batalkan Reservasi
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eae3d5] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
