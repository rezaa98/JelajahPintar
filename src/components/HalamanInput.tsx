import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass, Navigation, ArrowRight, Sparkles, Map, Info } from 'lucide-react';
import { PRESET_LANDMARKS, PRESET_ROUTES, isWithinYogyakarta } from '../data';
import { Location } from '../types';

interface HalamanInputProps {
  onSearch: (origin: Location, destination: Location) => void;
  isLoading: boolean;
  apiKey: string;
  hasValidKey: boolean;
}

const PRESET_CATEGORIES = [
  { id: 'semua', label: 'Semua', emoji: '✨' },
  { id: 'candi', label: 'Candi', emoji: '🛕' },
  { id: 'pantai', label: 'Pantai', emoji: '🏖️' },
  { id: 'alam', label: 'Alam', emoji: '🌳' },
  { id: 'kota', label: 'Kota', emoji: '🏰' }
];

export default function HalamanInput({ 
  onSearch, 
  isLoading,
  apiKey,
  hasValidKey
}: HalamanInputProps) {
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  const [selectedOrigin, setSelectedOrigin] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Category selection lists
  const [activeOriginCategory, setActiveOriginCategory] = useState('semua');
  const [activeDestCategory, setActiveDestCategory] = useState('semua');

  // Google Maps autocomplete prediction lists
  const [originPredictions, setOriginPredictions] = useState<any[]>([]);
  const [destPredictions, setDestPredictions] = useState<any[]>([]);

  const [isResolvingOrigin, setIsResolvingOrigin] = useState(false);
  const [isResolvingDest, setIsResolvingDest] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Debounced API Queries for Places Autocomplete
  useEffect(() => {
    if (!hasValidKey || !originText || selectedOrigin) {
      setOriginPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.google?.maps?.places) {
        try {
          const service = new window.google.maps.places.AutocompleteService();
          service.getPlacePredictions({
            input: originText,
            componentRestrictions: { country: 'id' },
            locationBias: { lat: -7.797064, lng: 110.370529, radius: 40000 } // Bias around Jogja province
          }, (predictions, status) => {
            if (status === 'OK' && predictions) {
              setOriginPredictions(predictions);
            } else {
              setOriginPredictions([]);
            }
          });
        } catch (e) {
          console.warn("Autocomplete error: ", e);
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [originText, selectedOrigin, hasValidKey]);

  useEffect(() => {
    if (!hasValidKey || !destinationText || selectedDestination) {
      setDestPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.google?.maps?.places) {
        try {
          const service = new window.google.maps.places.AutocompleteService();
          service.getPlacePredictions({
            input: destinationText,
            componentRestrictions: { country: 'id' },
            locationBias: { lat: -7.797064, lng: 110.370529, radius: 40000 }
          }, (predictions, status) => {
            if (status === 'OK' && predictions) {
              setDestPredictions(predictions);
            } else {
              setDestPredictions([]);
            }
          });
        } catch (e) {
          console.warn("Autocomplete error: ", e);
        }
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [destinationText, selectedDestination, hasValidKey]);

  // Handle Google prediction selection with Geocoder lookup
  const handleSelectGooglePrediction = (prediction: any, isOrigin: boolean) => {
    const mainText = prediction.structured_formatting?.main_text || prediction.description;
    const secondaryText = prediction.structured_formatting?.secondary_text || 'Yogyakarta, Indonesia';

    if (isOrigin) {
      setIsResolvingOrigin(true);
      setOriginText(mainText);
      setShowOriginSuggestions(false);
    } else {
      setIsResolvingDest(true);
      setDestinationText(mainText);
      setShowDestSuggestions(false);
    }

    if (typeof window !== 'undefined' && window.google?.maps) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
          if (isOrigin) setIsResolvingOrigin(false);
          else setIsResolvingDest(false);

          if (status === 'OK' && results && results[0]) {
            const loc = results[0].geometry.location;
            const lat = loc.lat();
            const lng = loc.lng();

            const resolved: Location = {
              id: `google-${prediction.place_id}`,
              name: mainText,
              regency: secondaryText,
              lat: lat,
              lng: lng,
              description: prediction.description
            };

            if (isOrigin) {
              setSelectedOrigin(resolved);
              setOriginPredictions([]);
            } else {
              setSelectedDestination(resolved);
              setDestPredictions([]);
            }
            setErrorMsg(null);
          } else {
            setErrorMsg('Gagal memproses titik koordinat dari Google Maps API.');
          }
        });
      } catch (err) {
        if (isOrigin) setIsResolvingOrigin(false);
        else setIsResolvingDest(false);
        setErrorMsg('Terjadi kesalahan koneksi geocoding.');
      }
    }
  };

  // Filter local suggestions based on typed input & category tab
  const getFilteredSuggestions = (text: string, categoryId: string) => {
    let filtered = PRESET_LANDMARKS;

    // Apply typed text filter if any
    if (text.trim()) {
      filtered = filtered.filter(landmark =>
        landmark.name.toLowerCase().includes(text.toLowerCase()) ||
        landmark.regency.toLowerCase().includes(text.toLowerCase())
      );
    } else {
      // If text is blank, filter strictly by category tab
      if (categoryId === 'candi') {
        filtered = filtered.filter(l => l.id.startsWith('candi-') || l.name.toLowerCase().includes('candi'));
      } else if (categoryId === 'pantai') {
        filtered = filtered.filter(l => l.id.startsWith('pantai-') || l.name.toLowerCase().includes('pantai'));
      } else if (categoryId === 'alam') {
        const alamIds = ['kaliurang', 'hutan-pinus-mangunan', 'tebing-breksi', 'goa-pindul', 'waduk-sermo'];
        filtered = filtered.filter(l => alamIds.includes(l.id) || l.description.toLowerCase().includes('alam') || l.description.toLowerCase().includes('hutan'));
      } else if (categoryId === 'kota') {
        const kotaIds = ['stasiun-tugu', 'kraton-jogja'];
        filtered = filtered.filter(l => kotaIds.includes(l.id) || l.regency.toLowerCase().includes('kota'));
      }
    }
    return filtered;
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
      setErrorMsg('Maaf, Jelajah Pintar saat ini baru dikhususkan di Yogyakarta & Sekitarnya (toleransi batas DIY).');
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
            <p className="text-[10px] font-bold text-orange-600 tracking-wider uppercase flex items-center gap-1">
              <span>Edisi Yogyakarta & Gunung Kidul</span>
              {hasValidKey && <span className="bg-orange-100 text-orange-700 font-mono scale-[0.8] px-1 py-0.2 rounded border border-orange-200">MAPS ONLINE</span>}
            </p>
          </div>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed mt-2.5">
          Temukan kuliner legendaris paling pas di sepanjang rute perjalanan Anda tanpa membuang waktu memutar balik (<strong className="text-orange-600 font-bold">Zero-Detour</strong>).
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
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
            <span>Titik Mulai (A)</span>
            {selectedOrigin && <span className="text-[9px] text-orange-600 font-mono font-bold tracking-normal text-right">TERKUNCI & COCOK</span>}
          </label>
          <div className="relative flex items-center bg-white/60 rounded-2xl border border-white/80 shadow-sm focus-within:border-orange-400 transition-colors">
            <span className="pl-4 text-slate-400">
              <MapPin className="w-4 h-4 text-orange-500" />
            </span>
            <input
              type="text"
              placeholder="Ketik asal / Cari di Jogja..."
              value={originText}
              onChange={(e) => {
                setOriginText(e.target.value);
                setSelectedOrigin(null);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => {
                setShowOriginSuggestions(true);
                setShowDestSuggestions(false);
              }}
              className="w-full pl-3 pr-20 py-3.5 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
            {/* Auto-Detect location indicator */}
            <button
              onClick={handleAutoDetect}
              disabled={geoLocating}
              className="absolute right-2 px-2.5 py-1.5 bg-slate-900/10 hover:bg-slate-900/15 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-white/40 transition-colors cursor-pointer"
            >
              <Navigation className={`w-3 h-3 ${geoLocating ? 'animate-pulse' : ''}`} />
              {geoLocating ? 'Cari...' : 'GPS'}
            </button>
          </div>

          {/* Autocompletes for Origin */}
          {showOriginSuggestions && (
            <div className="absolute z-30 w-full mt-1.5 bg-white/95 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 font-sans">
              
              {/* Category tabs for local preset exploration */}
              {!originText.trim() && (
                <div className="flex gap-1 p-1 bg-slate-100/50 rounded-xl mb-1.5 overflow-x-auto scrollbar-none shrink-0">
                  {PRESET_CATEGORIES.map(cat => (
                    <button
                      key={`origin-cat-${cat.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOriginCategory(cat.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                        activeOriginCategory === cat.id
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200/50 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Dynamic Google Maps suggestions */}
              {hasValidKey && originPredictions.length > 0 && (
                <div className="bg-orange-50/20 rounded-xl mb-1.5">
                  <div className="p-2 text-orange-700 text-[8px] font-bold tracking-wider uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                    <span>Rekomendasi Google Maps API (Yogyakarta)</span>
                  </div>
                  {originPredictions.map((pred) => (
                    <button
                      key={pred.place_id}
                      onClick={() => handleSelectGooglePrediction(pred, true)}
                      className="w-full px-3 py-2 text-left hover:bg-orange-100/50 flex flex-col transition-colors rounded-lg group text-slate-800"
                    >
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-orange-600 truncate">{pred.structured_formatting?.main_text || pred.description}</span>
                      <span className="text-[9px] text-slate-500 truncate">{pred.structured_formatting?.secondary_text || 'Daerah Istimewa Yogyakarta'}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Preset Landmarks local lists */}
              <div className="p-2 text-slate-400 text-[9px] font-bold tracking-wider uppercase">Preset Yogyakarta</div>
              {getFilteredSuggestions(originText, activeOriginCategory).map((landmark) => (
                <button
                  key={`origin-suggest-${landmark.id}`}
                  onClick={() => handleSelectOrigin(landmark)}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-100/90 flex flex-col transition-colors rounded-lg text-slate-800"
                >
                  <span className="text-xs font-bold text-slate-800">{landmark.name}</span>
                  <span className="text-[9px] text-slate-500 truncate">{landmark.regency} — {landmark.description}</span>
                </button>
              ))}

              {getFilteredSuggestions(originText, activeOriginCategory).length === 0 && originPredictions.length === 0 && (
                <div className="p-3 text-slate-400 text-xs text-center border-t border-slate-100">Ketik nama lokasi atau bersihkan kolom cari.</div>
              )}
            </div>
          )}

          {isResolvingOrigin && (
            <div className="absolute top-1/2 right-[12%] -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <span className="text-[9px] font-bold text-slate-500">Geocoding...</span>
            </div>
          )}
        </div>

        {/* Input Lokasi B */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
            <span>Destinasi Wisata (B)</span>
            {selectedDestination && <span className="text-[9px] text-orange-600 font-mono font-bold tracking-normal text-right">TERKUNCI & COCOK</span>}
          </label>
          <div className="relative flex items-center bg-white/60 rounded-2xl border border-white/80 shadow-sm focus-within:border-orange-400 transition-colors">
            <span className="pl-4 text-slate-400">
              <Compass className="w-4 h-4 text-orange-500" />
            </span>
            <input
              type="text"
              placeholder="Cari pantai, candi, atau tempat lainnya..."
              value={destinationText}
              onChange={(e) => {
                setDestinationText(e.target.value);
                setSelectedDestination(null);
                setShowDestSuggestions(true);
              }}
              onFocus={() => {
                setShowDestSuggestions(true);
                setShowOriginSuggestions(false);
              }}
              className="w-full pl-3 pr-4 py-3.5 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Autocompletes for Destination */}
          {showDestSuggestions && (
            <div className="absolute z-25 w-full mt-1.5 bg-white/95 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 font-sans">
              
              {/* Category tabs for local preset exploration */}
              {!destinationText.trim() && (
                <div className="flex gap-1 p-1 bg-slate-100/50 rounded-xl mb-1.5 overflow-x-auto scrollbar-none shrink-0">
                  {PRESET_CATEGORIES.map(cat => (
                    <button
                      key={`dest-cat-${cat.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDestCategory(cat.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                        activeDestCategory === cat.id
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200/50 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Dynamic Google Maps suggestions */}
              {hasValidKey && destPredictions.length > 0 && (
                <div className="bg-orange-50/20 rounded-xl mb-1.5">
                  <div className="p-2 text-orange-700 text-[8px] font-bold tracking-wider uppercase flex items-center gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                    <span>Pencarian Google Maps API Active</span>
                  </div>
                  {destPredictions.map((pred) => (
                    <button
                      key={pred.place_id}
                      onClick={() => handleSelectGooglePrediction(pred, false)}
                      className="w-full px-3 py-2 text-left hover:bg-orange-100/50 flex flex-col transition-colors rounded-lg group text-slate-800"
                    >
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-orange-600 truncate">{pred.structured_formatting?.main_text || pred.description}</span>
                      <span className="text-[9px] text-slate-500 truncate">{pred.structured_formatting?.secondary_text || 'Indonesia'}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Preset list options */}
              <div className="p-2 text-slate-400 text-[9px] font-bold tracking-wider uppercase flex justify-between items-center">
                <span>Destinasi Terpopuler</span>
                {activeDestCategory !== 'semua' && <span className="text-orange-600 text-[8px] tracking-normal font-bold">Kategori: {activeDestCategory.toUpperCase()}</span>}
              </div>
              {getFilteredSuggestions(destinationText, activeDestCategory).map((landmark) => (
                <button
                  key={`dest-suggest-${landmark.id}`}
                  onClick={() => handleSelectDestination(landmark)}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-100/90 flex flex-col transition-colors rounded-lg text-slate-800"
                >
                  <span className="text-xs font-bold text-slate-800">{landmark.name}</span>
                  <span className="text-[9px] text-slate-500 truncate">{landmark.regency} — {landmark.description}</span>
                </button>
              ))}

              {getFilteredSuggestions(destinationText, activeDestCategory).length === 0 && destPredictions.length === 0 && (
                <div className="p-3 text-slate-400 text-xs text-center border-t border-slate-100">Destinasi tidak ditemukan. Coba bersihkan filter kategori.</div>
              )}
            </div>
          )}

          {isResolvingDest && (
            <div className="absolute top-1/2 right-[12%] -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <span className="text-[9px] font-bold text-slate-500">Geocoding...</span>
            </div>
          )}
        </div>

        {/* Quick Tour Preset Shortcuts */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Alternatif Rute Pintar & Canti</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => handlePresetRoute(route)}
                className="w-full p-4.5 bg-white/50 border border-white hover:bg-white/70 transition-all rounded-[24px] shadow-sm flex flex-col justify-between group duration-200 text-left cursor-pointer"
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
          disabled={isLoading || isResolvingOrigin || isResolvingDest}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:translate-y-[1px] cursor-pointer disabled:opacity-60"
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
