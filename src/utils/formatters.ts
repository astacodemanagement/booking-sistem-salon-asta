import { Booking, Branch, Service } from '../types';

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateID(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatShortDateID(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function generateWhatsAppBookingMessage(
  booking: Booking,
  branch: Branch | undefined,
  services: Service[],
  stylistName: string
): string {
  const serviceNames = services.map(s => `• ${s.name} (${formatIDR(s.price)})`).join('\n');
  const branchName = branch ? branch.name : 'Salon Asta';
  const branchAddress = branch ? branch.address : '';

  const message = `Halo ${branchName}, saya ingin konfirmasi reservasi saya di Salon Asta:

*KODE BOOKING*: *${booking.referenceCode}*
*Nama*: ${booking.customer.name}
*No. WhatsApp*: ${booking.customer.phone}
*Email*: ${booking.customer.email}

*Outlet*: ${branchName}
*Alamat*: ${branchAddress}
*Tanggal*: ${formatDateID(booking.date)}
*Jam*: ${booking.timeSlot} WIB
*Stylist*: ${stylistName}

*Layanan Dipilih*:
${serviceNames}

*Total Biaya*: ${formatIDR(booking.totalAmount)}${booking.discountAmount > 0 ? ` (Hemat ${formatIDR(booking.discountAmount)})` : ''}
*Metode Pembayaran*: ${booking.paymentMethod === 'salon' ? 'Bayar di Salon' : booking.paymentMethod === 'qris' ? 'QRIS / DP' : 'Transfer Bank'}
${booking.customer.notes ? `*Catatan Khusus*: ${booking.customer.notes}\n` : ''}
Mohon konfirmasi ketersediaan slot saya. Terima kasih! ✨`;

  return message;
}

export function getWhatsAppUrl(phoneOrWa: string, text: string): string {
  let cleanPhone = phoneOrWa.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createGoogleCalendarUrl(
  booking: Booking,
  branch: Branch | undefined,
  services: Service[]
): string {
  const title = encodeURIComponent(`Salon Asta Appointment - ${services.map(s => s.name).join(', ')}`);
  const details = encodeURIComponent(
    `Kode Reservasi: ${booking.referenceCode}\n` +
    `Layanan: ${services.map(s => s.name).join(', ')}\n` +
    `Outlet: ${branch?.name || 'Salon Asta'}\n` +
    `Alamat: ${branch?.address || ''}\n` +
    `Total: ${formatIDR(booking.totalAmount)}`
  );
  const location = encodeURIComponent(branch ? `${branch.name}, ${branch.address}` : 'Salon Asta');

  const [hours, minutes] = booking.timeSlot.split(':').map(Number);
  const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0) || 60;
  
  const start = new Date(`${booking.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
  const end = new Date(start.getTime() + totalDuration * 60000);

  const startIso = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endIso = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}
