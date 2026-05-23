import React, { useState } from 'react';
import { MapPin, Search, Compass, Navigation, ArrowRight, Sparkles } from 'lucide-react';
import { PRESET_LANDMARKS, PRESET_ROUTES, isWithinYogyakarta } from '../data';
import { Location } from '../types';

interface HalamanInputProps {
  onSearch: (origin: Location, destination: Location) => void;
  isLoading: boolean;
}

export default function HalamanInput({ onSearch, isLoading }: HalamanInputProps) {
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  const [selectedOrigin, setSelectedOrigin] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Filter suggestions based on typed input
  const getFilteredSuggestions = (text: string) => {
    if (!text.trim()) return PRESET_LANDMARKS;
    return PRESET_LANDMARKS.filter(landmark =>
      landmark.name.toLowerCase().includes(text.toLowerCase()) ||
      landmark.regency.toLowerCase().includes(text.toLowerCase())
    );
  };

  const handleSelectOrigin = (loc: Location) => {
    setSelectedOrigin(loc);
    setOriginText(loc.name);
    setShowOriginSuggestions(false);
    setErrorMsg(null);
  };

  const handleSelectDestination = (loc: Location) => {
    setSelectedDestination(loc);
    setDestinationText(loc.name);
    setShowDestSuggestions(false);
    setErrorMsg(null);
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Browser Anda tidak mendukung deteksi lokasi otomatis.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLocating(false);

        if (isWithinYogyakarta(latitude, longitude)) {
          const detected: Location = {
            id: 'custom-gps',
            name: 'Lokasi GPS Saya Saat Ini',
            regency: 'Kota Yogyakarta',
            lat: latitude,
            lng: longitude,
            description: 'Lokasi saat ini berhasil dideteksi otomatis via perangkat.'
          };
          setSelectedOrigin(detected);
          setOriginText(detected.name);
          setErrorMsg(null);
        } else {
          const tugu = PRESET_LANDMARKS.find(l => l.id === 'stasiun-tugu') || PRESET_LANDMARKS[0];
          setSelectedOrigin(tugu);
          setOriginText(tugu.name);
          setErrorMsg(
            'Lokasi Anda berada di luar Daerah Istimewa Yogyakarta. Jelajah Pintar mengalihkan titik awal secara otomatis ke Stasiun Tugu Yogyakarta agar Anda dapat menguji aplikasi.'
          );
        }
      },
      (error) => {
        setGeoLocating(false);
        const tugu = PRESET_LANDMARKS.find(l => l.id === 'stasiun-tugu') || PRESET_LANDMARKS[0];
        setSelectedOrigin(tugu);
        setOriginText(tugu.name);
        setErrorMsg('Gagal mendeteksi lokasi (Izin ditolak/GPS mati). Titik asal diarahkan ke Stasiun Tugu Yogyakarta.');
      },
      { timeout: 8000 }
    );
  };

  const handleSearchClick = () => {
    if (!selectedOrigin) {
      setErrorMsg('Silakan pilih Titik Asal (Titik A) terlebih dahulu.');
      return;
    }
    if (!selectedDestination) {
      setErrorMsg('Silakan pilih Titik Wisata Tujuan (Titik B) terlebih dahulu.');
      return;
    }
    if (selectedOrigin.id === selectedDestination.id) {
      setErrorMsg('Titik asal dan tujuan tidak boleh sama.');
      return;
    }

    if (!isWithinYogyakarta(selectedOrigin.lat, selectedOrigin.lng) ||
        !isWithinYogyakarta(selectedDestination.lat, selectedDestination.lng)) {
      setErrorMsg('Maaf, Jelajah Pintar saat ini baru tersedia di Yogyakarta.');
      return;
    }

    setErrorMsg(null);
    onSearch(selectedOrigin, selectedDestination);
  };

  const handlePresetRoute = (preset: typeof PRESET_ROUTES[0]) => {
    setSelectedOrigin(preset.origin);
    setOriginText(preset.origin.name);
    setSelectedDestination(preset.destination);
    setDestinationText(preset.destination.name);
    setErrorMsg(null);
    onSearch(preset.origin, preset.destination);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] flex flex-col justify-between overflow-y-auto font-sans text-slate-800 bg-transparent">
      {/* Hero Header Banner */}
      <div className="relative pt-8 px-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-600/30">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">
              Jelajah Pintar
            </h1>
            <p className="text-[10px] font-bold text-orange-600 tracking-wider uppercase">Edisi Yogyakarta</p>
          </div>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed mt-2.5">
          Temukan kuliner legendaris paling pas di sepanjang rute Anda tanpa membuang waktu memutar balik (<strong className="text-orange-600 font-bold">Zero-Detour</strong>).
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 px-6 space-y-4">
        {errorMsg && (
          <div className="backdrop-blur-md bg-orange-600/10 border border-orange-200/50 p-3.5 rounded-2xl text-orange-950 text-xs leading-relaxed animate-fade-in shadow-sm">
            {errorMsg}
          </div>
        )}

        {/* Input Lokasi A */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Titik Mulai (A)
          </label>
          <div className="relative flex items-center bg-white/60 rounded-2xl border border-white/80 shadow-sm focus-within:border-orange-400 transition-colors">
            <span className="pl-4 text-slate-400">
              <MapPin className="w-4 h-4 text-orange-500" />
            </span>
            <input
              type="text"
              placeholder="Masukkan lokasi Anda sekarang..."
              value={originText}
              onChange={(e) => {
                setOriginText(e.target.value);
                setSelectedOrigin(null);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
              className="w-full pl-3 pr-20 py-3.5 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
            {/* Auto-Detect location indicator */}
            <button
              onClick={handleAutoDetect}
              disabled={geoLocating}
              className="absolute right-2 px-2.5 py-1.5 bg-slate-900/10 hover:bg-slate-900/15 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-white/40 transition-colors"
            >
              <Navigation className={`w-3 h-3 ${geoLocating ? 'animate-pulse' : ''}`} />
              {geoLocating ? 'Mencari...' : 'GPS'}
            </button>
          </div>

          {showOriginSuggestions && (
            <div className="absolute z-30 w-full mt-1.5 bg-white/95 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 font-sans">
              <div className="p-2 text-slate-400 text-[9px] font-bold tracking-wider uppercase">Preset Yogyakarta</div>
              {getFilteredSuggestions(originText).map((landmark) => (
                <button
                  key={`origin-suggest-${landmark.id}`}
                  onClick={() => handleSelectOrigin(landmark)}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-100/90 flex flex-col transition-colors rounded-lg"
                >
                  <span className="text-xs font-bold text-slate-800">{landmark.name}</span>
                  <span className="text-[10px] text-slate-500 truncate">{landmark.regency} — {landmark.description}</span>
                </button>
              ))}
              {getFilteredSuggestions(originText).length === 0 && (
                <div className="p-3 text-slate-400 text-xs text-center">Lokasi tidak terindeks. Silakan ketik nama landmark rujukan.</div>
              )}
            </div>
          )}
        </div>

        {/* Input Lokasi B */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Destinasi Wisata (B)
          </label>
          <div className="relative flex items-center bg-white/60 rounded-2xl border border-white/80 shadow-sm focus-within:border-orange-400 transition-colors">
            <span className="pl-4 text-slate-400">
              <Compass className="w-4 h-4 text-orange-500" />
            </span>
            <input
              type="text"
              placeholder="Cari pantai, candi, atau tempat wisata..."
              value={destinationText}
              onChange={(e) => {
                setDestinationText(e.target.value);
                setSelectedDestination(null);
                setShowDestSuggestions(true);
              }}
              onFocus={() => setShowDestSuggestions(true)}
              className="w-full pl-3 pr-4 py-3.5 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>

          {showDestSuggestions && (
            <div className="absolute z-20 w-full mt-1.5 bg-white/95 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 font-sans">
              <div className="p-2 text-slate-400 text-[9px] font-bold tracking-wider uppercase">Destinasi Populer</div>
              {getFilteredSuggestions(destinationText).map((landmark) => (
                <button
                  key={`dest-suggest-${landmark.id}`}
                  onClick={() => handleSelectDestination(landmark)}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-100/90 flex flex-col transition-colors rounded-lg"
                >
                  <span className="text-xs font-bold text-slate-800">{landmark.name}</span>
                  <span className="text-[10px] text-slate-500 truncate">{landmark.regency} — {landmark.description}</span>
                </button>
              ))}
              {getFilteredSuggestions(destinationText).length === 0 && (
                <div className="p-3 text-slate-400 text-xs text-center">Destinasi tidak ditemukan.</div>
              )}
            </div>
          )}
        </div>

        {/* Quick Tour Preset Shortcuts */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Pilihan Rute Pintas</span>
          </div>
          <div className="space-y-2">
            {PRESET_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => handlePresetRoute(route)}
                className="w-full p-4 bg-white/50 border border-white hover:bg-white/70 transition-all rounded-[24px] shadow-sm flex flex-col justify-between group duration-200 text-left"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {route.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-slate-500 leading-snug mt-1">
                  {route.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Beautiful Submit Row */}
      <div className="p-6 bg-transparent border-t border-white/40 flex-shrink-0">
        <button
          onClick={handleSearchClick}
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:translate-y-[1px]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Memproses Rute Heuristik...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Cari Rute & Kuliner Searah</span>
            </>
          )}
        </button>
        <div className="text-center text-[9px] text-slate-400 font-bold mt-4 tracking-widest uppercase">
          POWERED BY GOOGLE MAPS PLATFORM • © 2026 JELAJAH PINTAR
        </div>
      </div>
    </div>
  );
}
