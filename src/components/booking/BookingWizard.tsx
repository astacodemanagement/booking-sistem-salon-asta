import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  MapPin, 
  Scissors, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  Printer, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  CalendarPlus,
  Tag
} from 'lucide-react';
import { Branch, ServiceCategory, Service, Stylist, PromoCode, Booking } from '../../types';
import { formatIDR, formatDateID, generateWhatsAppBookingMessage, getWhatsAppUrl, createGoogleCalendarUrl } from '../../utils/formatters';
import { TicketBarcode } from '../common/TicketBarcode';

interface BookingWizardProps {
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  stylists: Stylist[];
  promos: PromoCode[];
  bookings: Booking[];
  onCompleteBooking: (booking: Omit<Booking, 'id' | 'referenceCode' | 'createdAt' | 'updatedAt'>) => Booking;
  initialBranchId?: string;
  initialServiceId?: string;
  onViewAdminRequested?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  branches,
  categories,
  services,
  stylists,
  promos,
  bookings,
  onCompleteBooking,
  initialBranchId,
  initialServiceId,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    initialBranchId || branches[0]?.id || ''
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    initialServiceId ? [initialServiceId] : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStylistId, setSelectedStylistId] = useState<string>('any');

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'salon' | 'qris' | 'transfer'>('salon');

  const [promoCodeInput, setPromoCodeInput] = useState<string>('ASTANEW');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (initialBranchId) {
      setSelectedBranchId(initialBranchId);
    }
    if (initialServiceId) {
      if (!selectedServiceIds.includes(initialServiceId)) {
        setSelectedServiceIds([initialServiceId]);
      }
      setCurrentStep(2);
    }
  }, [initialBranchId, initialServiceId]);

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const selectedStylist = stylists.find(s => s.id === selectedStylistId);

  const totalDurationMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (subtotal >= appliedPromo.minSpend) {
      if (appliedPromo.discountType === 'percentage') {
        const rawDisc = (subtotal * appliedPromo.discountValue) / 100;
        discountAmount = appliedPromo.maxDiscount ? Math.min(rawDisc, appliedPromo.maxDiscount) : rawDisc;
      } else {
        discountAmount = appliedPromo.discountValue;
      }
    }
  }
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    setPromoError('');
    if (!code) {
      setAppliedPromo(null);
      return;
    }
    const found = promos.find(p => p.code.toUpperCase() === code && p.isActive);
    if (!found) {
      setPromoError('Kode voucher tidak ditemukan atau sudah habis.');
      setAppliedPromo(null);
      return;
    }
    if (subtotal < found.minSpend) {
      setPromoError(`Minimal transaksi untuk voucher ini adalah ${formatIDR(found.minSpend)}.`);
      setAppliedPromo(null);
      return;
    }
    setAppliedPromo(found);
    setPromoCodeInput(found.code);
  };

  const handleToggleService = (serviceId: string) => {
    if (selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const quickDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    let label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
    if (i === 0) label = `Hari Ini`;
    if (i === 1) label = `Besok`;
    return { dateStr, label, dayNum: d.getDate(), dayName: days[d.getDay()], monthName: months[d.getMonth()], isToday: i === 0 };
  });

  const morningTimes = ['10:00', '10:30', '11:00', '11:30'];
  const afternoonTimes = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
  const eveningTimes = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '19:00'];

  const isSlotBooked = (time: string) => {
    return bookings.some(b => 
      b.branchId === selectedBranchId &&
      b.date === selectedDate &&
      b.timeSlot === time &&
      (selectedStylistId === 'any' || b.stylistId === selectedStylistId) &&
      b.status !== 'cancelled'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Mohon isi nomor WhatsApp Anda.');
      return;
    }

    const newBookingData = {
      branchId: selectedBranchId,
      serviceIds: selectedServiceIds,
      stylistId: selectedStylistId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: `${customerName.toLowerCase().replace(/\s+/g, '')}@pelanggan.asta`,
        gender: 'Wanita' as const,
        hairLength: 'Medium' as const,
        notes: customerNotes.trim(),
      },
      promoCode: appliedPromo?.code,
      subtotal,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'salon' ? 'unpaid' as const : 'paid_dp' as const,
      status: 'confirmed' as const,
    };

    const created = onCompleteBooking(newBookingData);
    setCompletedBooking(created);
    setCurrentStep(5);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b58c54', '#d9b27d', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  const steps = [
    { num: 1, title: 'Lokasi Cabang' },
    { num: 2, title: 'Menu Layanan' },
    { num: 3, title: 'Jadwal & Waktu' },
    { num: 4, title: 'Data Pemesan' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* Friendly Step Tracker (Light Mode) */}
      {currentStep <= 4 && (
        <div className="mb-6 bg-white border border-[#eae3d5] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
            <span className="font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#b58c54] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                {currentStep}
              </span>
              <span>Langkah {currentStep} dari 4: <strong>{steps[currentStep - 1].title}</strong></span>
            </span>
            <span className="text-stone-400 text-xs hidden sm:inline">
              Reservasi Online Salon Asta
            </span>
          </div>

          <div className="w-full h-2 bg-[#f0eade] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b58c54] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-stone-100">
            {steps.map(s => {
              const isActive = currentStep === s.num;
              const isDone = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  disabled={s.num > currentStep}
                  className={`text-left p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#faf5eb] border border-[#d9c5ab] text-stone-900 font-bold'
                      : isDone
                      ? 'text-stone-700 hover:text-stone-900 cursor-pointer'
                      : 'text-stone-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    {isDone ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#b58c54] font-bold">{s.num}.</span>
                    )}
                    <span className="truncate">{s.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: CABANG */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#eae3d5] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#9c7540] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 text-[#b58c54]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Di cabang mana Anda ingin berkunjung?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Klik salah satu cabang Salon Asta di bawah ini:
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {branches.map(branch => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#faf5eb] border-[#b58c54] shadow-xs'
                      : 'bg-[#faf9f6] border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-[#b58c54] bg-[#b58c54] text-white font-bold' : 'border-stone-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-bold text-base sm:text-lg text-stone-900">
                        {branch.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-stone-700 border border-stone-200">
                        {branch.city}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      {branch.address}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-2.5 pt-2 border-t border-stone-200/60">
                      <span className="flex items-center gap-1.5 text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-[#b58c54]" />
                        {branch.operatingHours}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        +{branch.whatsapp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-extrabold text-base rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Lanjut Pilih Layanan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PERAWATAN */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#eae3d5] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#9c7540] flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5 text-[#b58c54]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Perawatan apa yang Anda butuhkan?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Centang satu atau lebih perawatan yang ingin Anda ambil:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#b58c54] text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Menu ({services.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#b58c54] text-white'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {services
              .filter(s => selectedCategory === 'all' || s.categoryId === selectedCategory)
              .map(service => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'bg-[#faf5eb] border-[#b58c54] shadow-xs'
                        : 'bg-[#faf9f6] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-[#b58c54] bg-[#b58c54] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base sm:text-lg text-stone-900">
                            {service.name}
                          </h4>
                          {service.tag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4ebe0] text-[#8a602b]">
                              {service.tag}
                            </span>
                          )}
                        </div>

                        <div className="text-base sm:text-lg font-extrabold text-[#9c7540]">
                          {formatIDR(service.price)}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 mt-1">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                        <Clock className="w-3.5 h-3.5 text-[#b58c54]" />
                        <span>Estimasi durasi: ~{service.durationMinutes} menit</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Sticky Mini Summary */}
          <div className="p-4 rounded-xl bg-[#faf6ef] border border-[#ebdccb] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-stone-500 block">Dipilih:</span>
              <strong className="text-stone-900 text-base">
                {selectedServiceIds.length} Perawatan
              </strong>
              {totalDurationMinutes > 0 && (
                <span className="text-xs text-stone-600 ml-1.5">
                  (~{totalDurationMinutes} menit)
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 block">Subtotal:</span>
              <strong className="text-xl font-bold text-[#8a602b]">
                {formatIDR(subtotal)}
              </strong>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-2 rounded-xl hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedServiceIds.length === 0) {
                  alert('Silakan pilih minimal 1 perawatan terlebih dahulu.');
                  return;
                }
                setCurrentStep(3);
              }}
              className={`w-full sm:w-auto px-8 py-3.5 font-extrabold text-base rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all ${
                selectedServiceIds.length > 0
                  ? 'bg-[#b58c54] hover:bg-[#a07742] text-white'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Lanjut Pilih Waktu</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: JADWAL & WAKTU */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#eae3d5] rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#9c7540] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5 text-[#b58c54]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Kapan Anda ingin berkunjung?
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Tentukan tanggal dan jam kedatangan Anda di {selectedBranch.name}.
                </p>
              </div>
            </div>
          </div>

          {/* 1. Pilih Hari */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. Pilih Hari Kedatangan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickDates.map(item => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-[#faf5eb] border-[#b58c54] text-stone-900 shadow-xs'
                        : 'bg-[#faf9f6] border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-[11px] uppercase font-bold text-stone-500">
                      {item.isToday ? 'Hari Ini' : item.dayName}
                    </div>
                    <div className="text-lg font-extrabold text-stone-900 my-0.5">
                      {item.dayNum} {item.monthName}
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-[#9c7540] font-bold' : 'text-stone-400'}`}>
                      {isSelected ? '✓ Terpilih' : 'Tersedia'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Jam */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. Pilih Jam Kedatangan:
            </label>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-stone-600 block mb-1">Pagi:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {morningTimes.map(t => {
                    const booked = isSlotBooked(t);
                    const isSelected = selectedTimeSlot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTimeSlot(t)}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                          booked
                            ? 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                            : isSelected
                            ? 'bg-[#b58c54] text-white border-[#b58c54]'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {t} WIB
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-600 block mb-1">Siang:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {afternoonTimes.map(t => {
                    const booked = isSlotBooked(t);
                    const isSelected = selectedTimeSlot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTimeSlot(t)}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                          booked
                            ? 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                            : isSelected
                            ? 'bg-[#b58c54] text-white border-[#b58c54]'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {t} WIB
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-600 block mb-1">Sore & Malam:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {eveningTimes.map(t => {
                    const booked = isSlotBooked(t);
                    const isSelected = selectedTimeSlot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTimeSlot(t)}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                          booked
                            ? 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                            : isSelected
                            ? 'bg-[#b58c54] text-white border-[#b58c54]'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {t} WIB
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pilihan Stylist */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              3. Pilihan Hair Stylist:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedStylistId('any')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedStylistId === 'any'
                    ? 'bg-[#faf5eb] border-[#b58c54]'
                    : 'bg-[#faf9f6] border-stone-200'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-stone-900">Stylist Siap Pertama (Bebas)</div>
                  <div className="text-xs text-emerald-700 font-semibold">★ Pilihan paling cepat & fleksibel</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedStylistId === 'any' ? 'border-[#b58c54] bg-[#b58c54] text-white' : 'border-stone-300'
                }`}>
                  {selectedStylistId === 'any' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-stone-200 bg-[#faf9f6] flex flex-col justify-center">
                <span className="text-xs text-stone-600 block mb-1">Atau pilih nama stylist:</span>
                <select
                  value={selectedStylistId}
                  onChange={e => setSelectedStylistId(e.target.value)}
                  className="w-full bg-white border border-stone-300 text-stone-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#b58c54]"
                >
                  <option value="any">Stylist Bebas / Yang Tersedia</option>
                  {stylists.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.title})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-2 rounded-xl hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#b58c54] hover:bg-[#a07742] text-white font-extrabold text-base rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <span>Lanjut Isi Data Diri</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DATA DIRI */}
      {currentStep === 4 && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#eae3d5] rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf4ea] text-[#9c7540] flex items-center justify-center font-bold">
                <User className="w-5 h-5 text-[#b58c54]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Data Diri Pemesan
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Bukti tiket reservasi akan dikirimkan ke nomor WhatsApp Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1.5">
                Nama Lengkap Anda <span className="text-[#b58c54]">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Contoh: Ibu Rina / Pak Budi"
                className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-stone-200 rounded-xl text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1.5">
                Nomor WhatsApp Aktif <span className="text-[#b58c54]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
                  +62
                </span>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => {
                    let val = e.target.value;
                    if (val.startsWith('0')) val = val.substring(1);
                    if (val.startsWith('62')) val = val.substring(2);
                    setCustomerPhone(val);
                  }}
                  placeholder="812 3456 7890"
                  className="w-full pl-14 pr-4 py-3 bg-[#fdfbf7] border-2 border-stone-200 rounded-xl text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1.5">
                Catatan Khusus (Opsional)
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                placeholder="Contoh: Kulit kepala sensitif, minta blow lembut..."
                className="w-full px-4 py-3 bg-[#fdfbf7] border-2 border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#b58c54] focus:bg-white"
              />
            </div>
          </div>

          {/* Promo code */}
          <div className="p-3.5 rounded-xl bg-[#faf6ef] border border-[#ebdccb] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#b58c54]" />
              <span className="text-xs sm:text-sm text-stone-700">
                Kupon diskon: <strong>ASTANEW</strong> (Diskon 20%)
              </span>
            </div>
            {appliedPromo ? (
              <span className="text-xs font-bold text-emerald-700">
                ✓ Voucher Dipakai (-{formatIDR(discountAmount)})
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleApplyPromo('ASTANEW')}
                className="px-3 py-1 bg-[#b58c54] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#a07742]"
              >
                Pakai Voucher
              </button>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-2">
              Pilihan Pembayaran:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('salon')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'salon'
                    ? 'bg-[#faf5eb] border-[#b58c54]'
                    : 'bg-[#faf9f6] border-stone-200'
                }`}
              >
                <div>
                  <div className="font-bold text-stone-900 text-sm">Bayar di Salon (Kasir)</div>
                  <div className="text-xs text-stone-500">Tunai, Debit, atau Kartu Kredit</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'salon' ? 'border-[#b58c54] bg-[#b58c54] text-white' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'salon' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('qris')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'qris'
                    ? 'bg-[#faf5eb] border-[#b58c54]'
                    : 'bg-[#faf9f6] border-stone-200'
                }`}
              >
                <div>
                  <div className="font-bold text-stone-900 text-sm">QRIS / Transfer Bank</div>
                  <div className="text-xs text-stone-500">BCA, Mandiri, GoPay, OVO</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'qris' ? 'border-[#b58c54] bg-[#b58c54] text-white' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'qris' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Total Box */}
          <div className="p-4 rounded-xl bg-[#faf6ef] border border-[#ebdccb] space-y-2 text-xs sm:text-sm">
            <div className="font-bold text-stone-900 text-sm pb-2 border-b border-stone-200">
              Ringkasan Reservasi Anda:
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Cabang:</span>
              <strong className="text-stone-900">{selectedBranch.name}</strong>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Waktu Kunjungan:</span>
              <strong className="text-stone-900">{formatDateID(selectedDate)}, pukul {selectedTimeSlot} WIB</strong>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Perawatan:</span>
              <strong className="text-stone-900">{selectedServices.map(s => s.name).join(' + ')}</strong>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Kupon:</span>
                <strong>-{formatIDR(discountAmount)}</strong>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Biaya:</span>
              <span className="text-[#8a602b]">{formatIDR(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-2 rounded-xl hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-[#b58c54] hover:bg-[#a07742] text-white font-extrabold text-base rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Konfirmasi & Terbitkan Tiket</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: TIKET RESERVASI SELESAI */}
      {currentStep === 5 && completedBooking && (
        <div className="bg-white border border-[#eae3d5] rounded-2xl p-6 sm:p-9 shadow-sm space-y-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Reservasi Anda Berhasil!
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
              Terima kasih <strong>{completedBooking.customer.name}</strong>, jadwal Anda sudah tercatat di Salon Asta.
            </p>
          </div>

          {/* Ticket pass */}
          <div className="max-w-md mx-auto bg-[#faf6ef] border-2 border-[#d9c4aa] rounded-2xl p-6 text-left shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <span className="font-serif font-bold text-lg text-stone-900">SALON ASTA</span>
                <span className="block text-[11px] text-[#9c7540] font-semibold">Bukti Reservasi Resmi</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-500 uppercase block">Kode Booking:</span>
                <span className="font-mono text-xl font-black text-stone-900">{completedBooking.referenceCode}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Nama Pemesan:</span>
                <strong className="text-stone-900">{completedBooking.customer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">No. WhatsApp:</span>
                <strong className="text-stone-900">{completedBooking.customer.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cabang:</span>
                <strong className="text-stone-900">{selectedBranch.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jadwal:</span>
                <strong className="text-[#8a602b]">{formatDateID(completedBooking.date)} pukul {completedBooking.timeSlot} WIB</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-stone-500">Layanan:</span>
                <span className="text-stone-900 text-right font-medium">
                  {selectedServices.map(s => s.name).join(', ')}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total:</span>
                <span className="text-[#8a602b]">{formatIDR(completedBooking.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex flex-col items-center justify-center">
              <TicketBarcode code={completedBooking.referenceCode} />
              <span className="text-[11px] text-stone-500 mt-2">
                Tunjukkan bukti ini kepada kasir saat tiba di salon.
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-3 pt-2">
            <a
              href={getWhatsAppUrl(
                selectedBranch.whatsapp,
                generateWhatsAppBookingMessage(
                  completedBooking,
                  selectedBranch,
                  selectedServices,
                  selectedStylist ? selectedStylist.name : 'Stylist Siap Pertama'
                )
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span>Kirim Konfirmasi ke WhatsApp Salon</span>
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-stone-500" />
                <span>Cetak Bukti</span>
              </button>

              <a
                href={createGoogleCalendarUrl(completedBooking, selectedBranch, selectedServices)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-stone-500" />
                <span>Google Cal</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setSelectedServiceIds([]);
                setCompletedBooking(null);
              }}
              className="text-[#b58c54] hover:underline text-sm font-bold"
            >
              ← Buat Reservasi Lainnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
