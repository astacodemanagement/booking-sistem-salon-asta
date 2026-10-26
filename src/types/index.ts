export type BookingStatus = 'pending' | 'confirmed' | 'in_service' | 'completed' | 'cancelled';

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  gmapsUrl: string;
  operatingHours: string;
  image: string;
  features: string[];
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isPopular?: boolean;
  isNew?: boolean;
  image?: string;
  tag?: string;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  branchIds: string[];
  specialties: string[];
  bio: string;
  isActive: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 50000 for Rp 50.000
  maxDiscount?: number; // max in IDR if percentage
  minSpend: number;
  validUntil: string;
  isActive: boolean;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  gender: 'Wanita' | 'Pria' | 'Lainnya';
  hairLength?: 'Short' | 'Medium' | 'Long' | 'Extra Long';
  notes?: string;
}

export interface Booking {
  id: string;
  referenceCode: string; // e.g. MOIR-8492
  branchId: string;
  serviceIds: string[];
  stylistId: string; // stylist ID or 'any'
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "13:30"
  customer: CustomerInfo;
  promoCode?: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'salon' | 'qris' | 'transfer';
  paymentStatus: 'unpaid' | 'paid_dp' | 'paid_full';
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}
