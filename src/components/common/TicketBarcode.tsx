import React from 'react';

interface TicketBarcodeProps {
  code: string;
}

export const TicketBarcode: React.FC<TicketBarcodeProps> = ({ code }) => {
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg text-black">
      <div className="relative w-32 h-32 border-2 border-black p-2 bg-white flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-6 h-6 border-4 border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-black" />
          </div>
          <div className="w-6 h-6 border-4 border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-black" />
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1 mx-auto my-1">
          {Array.from({ length: 25 }).map((_, i) => {
            const isFilled = (hash * (i + 3) + i * 7) % 3 !== 0;
            return (
              <div
                key={i}
                className={`w-2.5 h-2.5 ${isFilled ? 'bg-black' : 'bg-transparent'}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-end">
          <div className="w-6 h-6 border-4 border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-black" />
          </div>
          <span className="text-[9px] font-mono tracking-tighter text-zinc-600 uppercase">ASTA PASS</span>
        </div>
      </div>
      <span className="mt-2 font-mono text-xs font-bold tracking-widest text-zinc-900">{code}</span>
    </div>
  );
};
