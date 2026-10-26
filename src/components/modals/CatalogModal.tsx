import React, { useState } from 'react';
import { X, Search, Sparkles, Clock, Scissors } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { formatIDR } from '../../utils/formatters';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  services: Service[];
  onSelectServiceAndBook?: (serviceId: string) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onClose,
  categories,
  services,
  onSelectServiceAndBook,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredServices = services.filter(s => {
    const matchCat = selectedCat === 'all' || s.categoryId === selectedCat;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#eae3d5] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eae3d5] flex items-center justify-between bg-[#faf6f0]">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#9c7540]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Menu Layanan & Daftar Harga Salon Asta
              </h3>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Standar perawatan salon atelier dengan produk premium resmi (Tokio Inkarami, Olaplex, L&apos;Oréal, Milbon).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 sm:p-6 border-b border-[#eae3d5] bg-white space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari perawatan (contoh: Balayage, Potong Rambut, Keratin, Scalp)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#d9cebe] rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-[#9c7540] focus:ring-2 focus:ring-[#9c7540]/20 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCat === 'all'
                  ? 'bg-[#b58c54] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Semua Layanan ({services.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-[#b58c54] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-[#faf8f5]">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              Tidak ada layanan yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map(srv => {
                const cat = categories.find(c => c.id === srv.categoryId);
                return (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl bg-white border border-[#eae3d5] hover:border-[#b58c54] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-[#8a602b] uppercase tracking-wider">
                          {cat?.name || 'Treatment'}
                        </span>
                        {srv.tag && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6ecde] text-[#8a602b] border border-[#e0cdb6]">
                            {srv.tag}
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#8a602b] transition-colors">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>~{srv.durationMinutes} Menit</span>
                        </div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">
                          {formatIDR(srv.price)}
                        </div>
                      </div>

                      {onSelectServiceAndBook && (
                        <button
                          onClick={() => {
                            onSelectServiceAndBook(srv.id);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#9c7540] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pilih & Book</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eae3d5] bg-white flex justify-between items-center text-xs text-stone-500">
          <span>* Harga sudah termasuk konsultasi & signature styling khas Salon Asta</span>
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
