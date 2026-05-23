import React from 'react';
import { ArrowLeft, Clock, Compass, MapPin, Navigation, ExternalLink, Calendar, CheckCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Location, Restaurant } from '../types';

interface HalamanEksekusiProps {
  origin: Location;
  destination: Location;
  restaurant: Restaurant;
  detourMin: number;
  originalDurationMin: number;
  onReset: () => void;
}

export default function HalamanEksekusi({
  origin,
  destination,
  restaurant,
  detourMin,
  originalDurationMin,
  onReset,
}: HalamanEksekusiProps) {
  // Total trip timing: original route duration + detour time + 45-minute dining allowance
  const diningTimeMin = 45;
  const totalDurationMin = originalDurationMin + detourMin + diningTimeMin;
  
  const formatTime = (totalMinutes: number): string => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hrs > 0 ? `${hrs} j ${mins} m` : `${mins} m`;
  };

  const getGoogleMapsUrl = (): string => {
    const originCoords = `${origin.lat},${origin.lng}`;
    const destCoords = `${destination.lat},${destination.lng}`;
    const waypointsCoords = `${restaurant.lat},${restaurant.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCoords)}&destination=${encodeURIComponent(destCoords)}&waypoints=${encodeURIComponent(waypointsCoords)}&travelmode=driving`;
  };

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-transparent text-slate-800 flex flex-col justify-between overflow-y-auto font-sans relative">
      
      {/* Decorative orange border on top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400"></div>

      {/* Main Body Column */}
      <div className="flex-1 p-6 space-y-6">
        
        {/* Header Title Section */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-600/10 border border-orange-500/20 text-orange-600 rounded-full mb-3">
            <CheckCircle className="w-7 h-7 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Rute Selesai Disusun!</h2>
          <p className="text-slate-500 text-xs mt-1">
            Petualangan kuliner Yogyakarta Anda siap dieksekusi.
          </p>
        </div>

        {/* Travel Summary Ticket Info Panel */}
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-[32px] overflow-hidden shadow-2xl relative">
          
          {/* Top Ticket Header */}
          <div className="px-5 py-3.5 bg-white/40 border-b border-white/60 flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            <span>Travel Ticket</span>
            <span className="text-orange-600 font-extrabold uppercase font-mono">JELAJAH PINTAR</span>
          </div>

          <div className="p-5 space-y-4">
            {/* Timeline Steps */}
            <div className="relative pl-6 space-y-5">
              {/* Vertical dotted timeline line */}
              <div className="absolute top-2 bottom-2 left-2.5 w-[1.5px] border-l border-dashed border-slate-350"></div>

              {/* Step 1: Origin */}
              <div className="relative">
                <span className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm">A</span>
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-blue-500">Titik Berangkat</h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{origin.name}</p>
                </div>
              </div>

              {/* Step 2: Selected Restaurant Detour */}
              <div className="relative">
                <span className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm">★</span>
                <div className="p-4 bg-white/65 border border-white/80 rounded-2xl shadow-sm">
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                    Singgah Kuliner <span className="text-[8px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded border border-orange-200/40 ml-1">+{detourMin}m detour</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-1">{restaurant.name}</p>
                  <p className="text-[10px] font-bold text-orange-700 mt-0.5">🏆 {restaurant.specialty}</p>
                  <div className="mt-2 text-[10px] font-sans text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Rekomendasi Waktu Santap: <strong className="text-slate-800 font-bold">{diningTimeMin} Menit</strong></span>
                  </div>
                </div>
              </div>

              {/* Step 3: Destination */}
              <div className="relative">
                <span className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm">B</span>
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-wider text-orange-500">Tujuan Akhir Wisata</h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{destination.name}</p>
                </div>
              </div>
            </div>

            {/* Simulated Timing breakdown */}
            <div className="pt-4 border-t border-white/60 grid grid-cols-2 gap-4 font-mono text-center">
              <div className="p-3 bg-white/50 rounded-2xl border border-white/80 shadow-sm">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">ESTIMASI JALAN</div>
                <div className="text-xs font-extrabold text-slate-800">{formatTime(originalDurationMin + detourMin)}</div>
                <div className="text-[9px] text-slate-400 font-bold mt-0.5">(Detour Masuk)</div>
              </div>
              <div className="p-3 bg-white/50 rounded-2xl border border-white/80 shadow-sm">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">TOTAL DURASI</div>
                <div className="text-xs font-extrabold text-orange-600">{formatTime(totalDurationMin)}</div>
                <div className="text-[9px] text-slate-400 font-bold mt-0.5">(+Makan Santai)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative usage tip details */}
        <div className="backdrop-blur-md bg-orange-600/10 border border-orange-200/50 p-4 rounded-2xl flex gap-2.5 shadow-sm">
          <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-orange-950 font-medium leading-relaxed">
            Menekan tombol <strong>&ldquo;Buka di Aplikasi Google Maps&rdquo;</strong> di bawah akan meluncurkan aplikasi Google Maps native di HP Anda dengan rute waypoint, waktu berangkat, dan tempat mampir kuliner yang sudah tersusun rapi otomatis.
          </p>
        </div>
      </div>

      {/* Persistent Button Actions Row */}
      <div className="p-6 bg-transparent border-t border-white/40 space-y-3 flex-shrink-0">
        {/* Main deep link action */}
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/30 transition-all text-center hover:translate-y-[-1px]"
        >
          <ExternalLink className="w-4 h-4 text-white" />
          <span>Buka di Aplikasi Google Maps</span>
        </a>

        {/* Back and restart action button */}
        <button
          onClick={onReset}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10 transition-all active:translate-y-[1px]"
        >
          <Compass className="w-3.5 h-3.5 text-white animate-spin-slow" />
          <span>Ubah Rute Wisata</span>
        </button>
      </div>
    </div>
  );
}
