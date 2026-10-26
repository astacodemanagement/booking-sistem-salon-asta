import { Branch, ServiceCategory, Service, Stylist, PromoCode, Booking } from '../types';

const STORAGE_KEYS = {
  BRANCHES: 'asta_branches_v2',
  CATEGORIES: 'asta_categories_v2',
  SERVICES: 'asta_services_v2',
  STYLISTS: 'asta_stylists_v2',
  PROMOS: 'asta_promos_v2',
  BOOKINGS: 'asta_bookings_v2',
  ACTIVE_BRANCH_ID: 'asta_active_branch_v2',
};

// Seed Data for Salon Asta
export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-senopati',
    name: 'Salon Asta Senopati (Flagship)',
    city: 'Jakarta Selatan',
    address: 'Jl. Senopati No. 82, Kebayoran Baru, Jakarta Selatan 12190',
    phone: '+62 21 5296 8801',
    whatsapp: '6281298881234',
    gmapsUrl: 'https://maps.google.com/?q=Senopati+Jakarta',
    operatingHours: '09:00 - 21:00 WIB',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    features: ['VIP Private Suites', 'Valet Parking Gratis', 'Nespresso Coffee Bar', 'Aroma Therapy Basin'],
    isActive: true,
  },
  {
    id: 'branch-pik',
    name: 'Salon Asta PIK Avenue & Golf Island',
    city: 'Jakarta Utara',
    address: 'Rukan Theme Park Blok D No. 18, Golf Island PIK, Jakarta Utara',
    phone: '+62 21 2257 0192',
    whatsapp: '6281298881235',
    gmapsUrl: 'https://maps.google.com/?q=Golf+Island+PIK',
    operatingHours: '10:00 - 21:00 WIB',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80',
    features: ['Sea View Lounge', 'Modern Minimalist Aesthetic', 'Asta Color Bar'],
    isActive: true,
  },
  {
    id: 'branch-kelapa-gading',
    name: 'Salon Asta Kelapa Gading',
    city: 'Jakarta Utara',
    address: 'Jl. Boulevard Raya Blok QA 3 No. 12, Kelapa Gading, Jakarta Utara',
    phone: '+62 21 4584 7720',
    whatsapp: '6281298881236',
    gmapsUrl: 'https://maps.google.com/?q=Kelapa+Gading+Jakarta',
    operatingHours: '10:00 - 20:30 WIB',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1000&q=80',
    features: ['Private Scalp Capsule', 'Express Blow Bar', 'Spacious Consultation Area'],
    isActive: true,
  },
  {
    id: 'branch-gading-serpong',
    name: 'Salon Asta Gading Serpong',
    city: 'Tangerang',
    address: 'Ruko Pisa Grande Blok B No. 19, Gading Serpong, Tangerang',
    phone: '+62 21 5998 3311',
    whatsapp: '6281298881237',
    gmapsUrl: 'https://maps.google.com/?q=Pisa+Grande+Gading+Serpong',
    operatingHours: '09:30 - 20:30 WIB',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    features: ['Spacious 2 Floors', 'Photobooth Studio', 'Complimentary Drinks'],
    isActive: true,
  },
  {
    id: 'branch-bandung-riau',
    name: 'Salon Asta Riau Bandung',
    city: 'Bandung',
    address: 'Jl. R.E. Martadinata No. 142, Riau, Kota Bandung, Jawa Barat',
    phone: '+62 22 720 9102',
    whatsapp: '6281298881238',
    gmapsUrl: 'https://maps.google.com/?q=Jl+RE+Martadinata+Bandung',
    operatingHours: '09:00 - 20:00 WIB',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80',
    features: ['Heritage Garden Lounge', 'Bridal Glam Room', 'Scalp Health Clinic'],
    isActive: true,
  },
  {
    id: 'branch-bali-canggu',
    name: 'Salon Asta Canggu Bali',
    city: 'Bali',
    address: 'Jl. Pantai Batu Bolong No. 58A, Canggu, Kuta Utara, Badung, Bali',
    phone: '+62 361 909 451',
    whatsapp: '6281298881239',
    gmapsUrl: 'https://maps.google.com/?q=Batu+Bolong+Canggu',
    operatingHours: '09:00 - 21:00 WITA',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    features: ['Tropical Aesthetic', 'Sun & Surf Hair Recovery', 'Cocktail Mocktail Bar'],
    isActive: true,
  },
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-cut-styling',
    name: 'Hair Cut & Styling',
    description: 'Potongan rambut presisi disesuaikan dengan bentuk wajah dan karakter unik Anda.',
    iconName: 'Scissors',
  },
  {
    id: 'cat-color-balayage',
    name: 'Coloring & Balayage',
    description: 'Pewarnaan berstandar internasional dengan teknik seamless blend & gradasi natural.',
    iconName: 'Palette',
  },
  {
    id: 'cat-smoothing-treatment',
    name: 'Treatment & Smoothing',
    description: 'Pemulihan rambut rusak, kering, dan kusam dengan teknologi salon Jepang & Korea.',
    iconName: 'Sparkles',
  },
  {
    id: 'cat-scalp-spa',
    name: 'Scalp & Head Spa',
    description: 'Detoksifikasi kulit kepala, relaksasi syaraf, dan nutrisi stimulasi folikel rambut.',
    iconName: 'Waves',
  },
  {
    id: 'cat-nail-lash',
    name: 'Nail & Lash Art',
    description: 'Perawatan kuku estetik gel art tahan lama dan ekstensi bulu mata ultra-ringan.',
    iconName: 'Eye',
  },
];

export const INITIAL_SERVICES: Service[] = [
  // Hair Cut
  {
    id: 'srv-signature-cut',
    categoryId: 'cat-cut-styling',
    name: 'Asta Signature Hair Cut & Blow',
    description: 'Konsultasi bentuk wajah, keramas dengan relaksasi massage, hair cut presisi Asta, dan styling blow dry eksklusif.',
    durationMinutes: 60,
    price: 350000,
    isPopular: true,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-korean-butterfly-cut',
    categoryId: 'cat-cut-styling',
    name: 'Korean Layer / Butterfly Cut & C-Curl Blow',
    description: 'Teknik layer bervolume khas selebriti Korea dengan finishing soft C-Curl bouncy.',
    durationMinutes: 75,
    price: 420000,
    isPopular: true,
    isNew: true,
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-gentleman-cut',
    categoryId: 'cat-cut-styling',
    name: 'Gentleman Executive Cut & Scalp Rinse',
    description: 'Potongan pria modern (Crop, Fade, Comma Hair, Two-Block) disertai hot towel & styling pomade.',
    durationMinutes: 45,
    price: 250000,
    tag: 'Men Special',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-event-blow-styling',
    categoryId: 'cat-cut-styling',
    name: 'Red Carpet Glam Blow & Wave Styling',
    description: 'Styling rambut untuk photoshoot, kondangan, engagement, atau pesta dengan ketahanan seharian.',
    durationMinutes: 50,
    price: 220000,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
  },

  // Coloring
  {
    id: 'srv-signature-balayage',
    categoryId: 'cat-color-balayage',
    name: 'Signature Seamless AirTouch Balayage Asta',
    description: 'Gradasi balayage tanpa garis tegas dengan teknik AirTouch. Tumbuh rambut baru tetap rapi & natural.',
    durationMinutes: 210,
    price: 1650000,
    isPopular: true,
    tag: 'Signature Asta',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-full-color-gloss',
    categoryId: 'cat-color-balayage',
    name: 'Single Process Rich Color + Gloss Shine',
    description: 'Pewarnaan satu kepala dengan cat premium bebas amonia (L’Oréal Inoa / Milbon) plus glossy seal.',
    durationMinutes: 120,
    price: 850000,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-root-retouch',
    categoryId: 'cat-color-balayage',
    name: 'Precision Root Retouch (Up to 3cm)',
    description: 'Penyamaran akar rambut baru dengan warna matching persis warna rambut existing.',
    durationMinutes: 90,
    price: 490000,
  },
  {
    id: 'srv-ash-blonde-bleach',
    categoryId: 'cat-color-balayage',
    name: 'Platinum / Ash Blonde Full Transformation',
    description: 'Bleaching bertahap dengan Olaplex Bond Multiplier untuk proteksi maksimal serat rambut.',
    durationMinutes: 240,
    price: 1950000,
    tag: 'Advanced',
  },

  // Treatment & Smoothing
  {
    id: 'srv-tokio-inkarami',
    categoryId: 'cat-smoothing-treatment',
    name: 'Tokio Inkarami 5-Step System Treatment',
    description: 'Perawatan rambut nomor 1 di Jepang dengan Fullerene pemenang Nobel prize. Memperkuat rambut hingga 140%.',
    durationMinutes: 90,
    price: 950000,
    isPopular: true,
    tag: 'Japan No. 1',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-keratin-diamond-smooth',
    categoryId: 'cat-smoothing-treatment',
    name: 'Diamond Keratin Smooth & Frizz-Free Therapy',
    description: 'Pelurusan semi-permanen tanpa kaku lepek. Hasil rambut jatuh halus berkilau tahan 3-5 bulan.',
    durationMinutes: 150,
    price: 1250000,
    tag: 'Frizz-Free',
  },
  {
    id: 'srv-olaplex-rescue',
    categoryId: 'cat-smoothing-treatment',
    name: 'Olaplex Intense Bond Repair Treatment',
    description: 'Menyambung kembali ikatan disulfida rambut yang patah akibat proses kimia & catok panas.',
    durationMinutes: 60,
    price: 550000,
  },

  // Scalp & Head Spa
  {
    id: 'srv-korean-scalp-detox',
    categoryId: 'cat-scalp-spa',
    name: 'Korean Deep Cleansing Scalp Detox & Hydro Mist',
    description: 'Scrub kulit kepala berbahan menthol herbal, pembersihan pori tersumbat, hydro mist spa, dan pijat leher pundak.',
    durationMinutes: 75,
    price: 480000,
    isPopular: true,
    tag: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-anti-hairloss-treatment',
    categoryId: 'cat-scalp-spa',
    name: 'Medical Scalp Microneedling & Hair Tonic Infusion',
    description: 'Terapi penguatan akar rambut untuk mengurangi kerontokan dan merangsang pertumbuhan helai baru.',
    durationMinutes: 90,
    price: 750000,
    tag: 'Hair Growth',
  },

  // Nail & Lash
  {
    id: 'srv-gel-manicure-art',
    categoryId: 'cat-nail-lash',
    name: 'Signature Russian Gel Manicure + Custom Art',
    description: 'Pembersihan kutikula tanpa rasa sakit dengan e-file, cat gel tahan hingga 4-6 minggu bebas chip.',
    durationMinutes: 75,
    price: 320000,
  },
  {
    id: 'srv-lash-lift-keratin',
    categoryId: 'cat-nail-lash',
    name: 'Keratin Lash Lift & Deep Black Tint',
    description: 'Melentikkan bulu mata asli dengan serum keratin bernutrisi. Tahan 6-8 minggu tanpa mascara.',
    durationMinutes: 60,
    price: 350000,
    tag: 'Natural Look',
  },
];

export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'stylist-daniel',
    name: 'Daniel Setiawan',
    title: 'Art Director & Master Colorist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    reviewCount: 384,
    branchIds: ['branch-senopati', 'branch-pik'],
    specialties: ['AirTouch Balayage', 'Precision Korean Cut', 'Color Correction'],
    bio: 'Pengalaman 12 tahun di Seoul & Tokyo. Spesialis balayage multidimensi dan potongan modern berkarakter di Salon Asta.',
    isActive: true,
  },
  {
    id: 'stylist-jessica',
    name: 'Jessica Aurelia',
    title: 'Senior Hair Designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.92,
    reviewCount: 420,
    branchIds: ['branch-senopati', 'branch-kelapa-gading'],
    specialties: ['Butterfly Cut', 'Tokio Inkarami', 'Natural Brunette & Ash'],
    bio: 'Lulusan Vidal Sassoon Academy London. Ahli dalam styling feminin, bervolume, dan pemulihan rambut rapuh.',
    isActive: true,
  },
  {
    id: 'stylist-kenji',
    name: 'Kenji Takahashi',
    title: 'Technical Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    reviewCount: 295,
    branchIds: ['branch-pik', 'branch-gading-serpong'],
    specialties: ['Japanese Straightening', 'Keratin Therapy', 'Men Two-Block & Comma'],
    bio: 'Pernah berkarir di Omotesando Tokyo selama 7 tahun. Sangat teliti dalam tekstur dan ketahanan styling.',
    isActive: true,
  },
  {
    id: 'stylist-michelle',
    name: 'Michelle Tan',
    title: 'Creative Stylist & Balayage Artist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.89,
    reviewCount: 210,
    branchIds: ['branch-gading-serpong', 'branch-bandung-riau'],
    specialties: ['Pastel & Fashion Color', 'Layer Shag', 'Scalp Spa'],
    bio: 'Kreatif, ramah, dan solutif. Mengedepankan kesehatan batang rambut sebelum dan sesudah proses chemical.',
    isActive: true,
  },
  {
    id: 'stylist-devi',
    name: 'Devi Maharani',
    title: 'Head Spa & Holistic Hair Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    reviewCount: 312,
    branchIds: ['branch-bali-canggu', 'branch-senopati'],
    specialties: ['Korean Scalp Detox', 'Ayurvedic Head Massage', 'Lash & Nail Art'],
    bio: 'Sertifikasi trichology scalp care. Memberikan pengalaman relaksasi spa rambut yang menenangkan pikiran.',
    isActive: true,
  },
];

export const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo-astanew',
    code: 'ASTANEW',
    description: 'Diskon 20% khusus tamu pertama reservasi online Salon Asta',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 100000,
    minSpend: 250000,
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'promo-glam15',
    code: 'GLAM15',
    description: 'Diskon 15% untuk paket Color & Treatment Salon Asta',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 150000,
    minSpend: 500000,
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'promo-beauty50k',
    code: 'BEAUTY50K',
    description: 'Potongan langsung Rp 50.000 untuk all service',
    discountType: 'fixed',
    discountValue: 50000,
    minSpend: 300000,
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'promo-balayageday',
    code: 'BALAYAGEDAY',
    description: 'Diskon spesial Rp 200.000 treatment Balayage Signature',
    discountType: 'fixed',
    discountValue: 200000,
    minSpend: 1500000,
    validUntil: '2026-12-31',
    isActive: true,
  },
];

// Seed realistic bookings for initial demo
const todayStr = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-101',
    referenceCode: 'ASTA-8921',
    branchId: 'branch-senopati',
    serviceIds: ['srv-signature-cut', 'srv-tokio-inkarami'],
    stylistId: 'stylist-daniel',
    date: todayStr,
    timeSlot: '13:00',
    customer: {
      name: 'Clarissa Valerie',
      phone: '081289123456',
      email: 'clarissa.val@gmail.com',
      gender: 'Wanita',
      hairLength: 'Long',
      notes: 'Mohon blow jangan terlalu kaku, suka yang soft wave alami ya kak.',
    },
    promoCode: 'ASTANEW',
    subtotal: 1300000,
    discountAmount: 100000,
    totalAmount: 1200000,
    paymentMethod: 'qris',
    paymentStatus: 'paid_dp',
    status: 'in_service',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-102',
    referenceCode: 'ASTA-7734',
    branchId: 'branch-pik',
    serviceIds: ['srv-signature-balayage'],
    stylistId: 'stylist-daniel',
    date: todayStr,
    timeSlot: '15:30',
    customer: {
      name: 'Nadia Pradita',
      phone: '081387654321',
      email: 'nadia.p@example.com',
      gender: 'Wanita',
      hairLength: 'Long',
      notes: 'Ingin konsultasi warna warm caramel balayage.',
    },
    promoCode: 'GLAM15',
    subtotal: 1650000,
    discountAmount: 150000,
    totalAmount: 1500000,
    paymentMethod: 'salon',
    paymentStatus: 'unpaid',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-103',
    referenceCode: 'ASTA-6542',
    branchId: 'branch-senopati',
    serviceIds: ['srv-gentleman-cut', 'srv-korean-scalp-detox'],
    stylistId: 'stylist-kenji',
    date: tomorrowStr,
    timeSlot: '11:00',
    customer: {
      name: 'Arga Wicaksono',
      phone: '08176543210',
      email: 'arga.w@company.co.id',
      gender: 'Pria',
      hairLength: 'Short',
      notes: 'Fade tipis samping, atas rapikan sedikit.',
    },
    subtotal: 730000,
    discountAmount: 0,
    totalAmount: 730000,
    paymentMethod: 'salon',
    paymentStatus: 'unpaid',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-104',
    referenceCode: 'ASTA-3319',
    branchId: 'branch-gading-serpong',
    serviceIds: ['srv-korean-butterfly-cut', 'srv-tokio-inkarami'],
    stylistId: 'stylist-michelle',
    date: tomorrowStr,
    timeSlot: '14:00',
    customer: {
      name: 'Stephanie Lim',
      phone: '08119876543',
      email: 'stephanie.lim@gmail.com',
      gender: 'Wanita',
      hairLength: 'Medium',
    },
    promoCode: 'BEAUTY50K',
    subtotal: 1370000,
    discountAmount: 50000,
    totalAmount: 1320000,
    paymentMethod: 'transfer',
    paymentStatus: 'paid_full',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-105',
    referenceCode: 'ASTA-2108',
    branchId: 'branch-bali-canggu',
    serviceIds: ['srv-korean-scalp-detox', 'srv-tokio-inkarami'],
    stylistId: 'stylist-devi',
    date: todayStr,
    timeSlot: '10:00',
    customer: {
      name: 'Elena Rostova',
      phone: '081299887766',
      email: 'elena.canggu@outlook.com',
      gender: 'Wanita',
      hairLength: 'Long',
      notes: 'Hair feels dry from surfing and sun exposure.',
    },
    subtotal: 1430000,
    discountAmount: 0,
    totalAmount: 1430000,
    paymentMethod: 'salon',
    paymentStatus: 'paid_full',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper Storage functions
export const StorageService = {
  getBranches(): Branch[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
        return INITIAL_BRANCHES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BRANCHES;
    }
  },

  saveBranches(branches: Branch[]) {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  },

  getCategories(): ServiceCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: ServiceCategory[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getServices(): Service[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  saveServices(services: Service[]) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  },

  getStylists(): Stylist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STYLISTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(INITIAL_STYLISTS));
        return INITIAL_STYLISTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STYLISTS;
    }
  },

  saveStylists(stylists: Stylist[]) {
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(stylists));
  },

  getPromos(): PromoCode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMOS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(INITIAL_PROMOS));
        return INITIAL_PROMOS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROMOS;
    }
  },

  savePromos(promos: PromoCode[]) {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
  },

  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  addBooking(bookingData: Omit<Booking, 'id' | 'referenceCode' | 'createdAt' | 'updatedAt'>): Booking {
    const bookings = this.getBookings();
    const randomCode = `ASTA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      referenceCode: randomCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },

  updateBookingStatus(id: string, status: Booking['status'], paymentStatus?: Booking['paymentStatus']) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index].status = status;
      if (paymentStatus) {
        bookings[index].paymentStatus = paymentStatus;
      }
      bookings[index].updatedAt = new Date().toISOString();
      this.saveBookings(bookings);
      return bookings[index];
    }
    return null;
  },

  updateBooking(updated: Booking) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === updated.id);
    if (index !== -1) {
      bookings[index] = { ...updated, updatedAt: new Date().toISOString() };
      this.saveBookings(bookings);
      return bookings[index];
    }
    return null;
  },

  deleteBooking(id: string) {
    const bookings = this.getBookings().filter(b => b.id !== id);
    this.saveBookings(bookings);
  },

  resetAllToDefault() {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(INITIAL_STYLISTS));
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(INITIAL_PROMOS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  },

  exportAllData(): string {
    const dump = {
      salonName: 'Salon Asta',
      branches: this.getBranches(),
      categories: this.getCategories(),
      services: this.getServices(),
      stylists: this.getStylists(),
      promos: this.getPromos(),
      bookings: this.getBookings(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.branches) localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(parsed.branches));
      if (parsed.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
      if (parsed.services) localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(parsed.services));
      if (parsed.stylists) localStorage.setItem(STORAGE_KEYS.STYLISTS, JSON.stringify(parsed.stylists));
      if (parsed.promos) localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(parsed.promos));
      if (parsed.bookings) localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(parsed.bookings));
      return true;
    } catch {
      return false;
    }
  }
};
