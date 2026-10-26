import React from 'react';
import { X, MapPin, Phone, Clock, Sparkles, Navigation } from 'lucide-react';
import { Branch } from '../../types';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  onSelectBranchAndBook?: (branchId: string) => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  isOpen,
  onClose,
  branches,
  onSelectBranchAndBook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#eae3d5] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eae3d5] flex items-center justify-between bg-[#faf6f0]">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9c7540]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Lokasi Cabang Resmi Salon Asta
              </h3>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Temukan studio Salon Asta terdekat Anda di Jakarta, Tangerang, Bandung, dan Bali.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#faf8f5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map(branch => (
              <div
                key={branch.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#eae3d5] hover:border-[#b58c54] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-xs text-stone-900 border border-white/60 shadow-xs">
                    {branch.city}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#8a602b] transition-colors">
                      {branch.name}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#9c7540] shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Jam Buka: {branch.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>Telp: {branch.phone}</span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {branch.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#faf6f0] text-[#8a602b] border border-[#ebdccb]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <a
                      href={branch.gmapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#8a602b] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Buka di Google Maps</span>
                    </a>

                    {onSelectBranchAndBook && (
                      <button
                        onClick={() => {
                          onSelectBranchAndBook(branch.id);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-[#b58c54] hover:bg-[#9c7540] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pilih Outlet Ini</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
