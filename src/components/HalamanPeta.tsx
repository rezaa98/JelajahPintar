import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Navigation, Compass, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Location, Restaurant, DetourResult } from '../types';
import { computeZeroDetourRestaurants, getHaversineDistance, generateCurvedRoute } from '../utils';

interface HalamanPetaProps {
  origin: Location;
  destination: Location;
  onBack: () => void;
  onSelectRestaurant: (restaurant: Restaurant, detourMin: number) => void;
  apiKey: string;
  hasValidKey: boolean;
}

export default function HalamanPeta({
  origin,
  destination,
  onBack,
  onSelectRestaurant,
  apiKey,
  hasValidKey
}: HalamanPetaProps) {
  const [detourOptions, setDetourOptions] = useState<DetourResult[]>([]);
  const [selectedDetour, setSelectedDetour] = useState<DetourResult | null>(null);
  
  // Load and calculate matching restaurants on mount
  useEffect(() => {
    const results = computeZeroDetourRestaurants(origin, destination, 2.0); // 2km radius buffer
    setDetourOptions(results);
    
    // Auto-select the first option (best rating, lowest detour)
    if (results.length > 0) {
      setSelectedDetour(results[0]);
    }
  }, [origin, destination]);

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-transparent text-slate-800 flex flex-col justify-between overflow-hidden relative font-sans">
      
      {/* Header bar */}
      <div className="p-4 backdrop-blur-xl bg-white/40 border-b border-white/60 flex items-center gap-3 flex-shrink-0 z-10 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 bg-white/60 hover:bg-white/80 text-slate-700 hover:text-slate-900 rounded-xl transition-colors cursor-pointer border border-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase font-bold tracking-widest text-orange-600 font-mono">Rute Zero-Detour</div>
          <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1 mt-0.5">
            <span className="text-slate-800 capitalize leading-none">{origin.regency.split(' ')[0]}</span>
            <span className="text-slate-400">➔</span>
            <span className="text-orange-600 truncate leading-none">{destination.name}</span>
          </div>
        </div>
      </div>

      {/* Main Map Frame */}
      <div className="flex-1 relative w-full bg-orange-50/20 border-b border-white/40 overflow-hidden">
        {hasValidKey ? (
          <RealGoogleMap
            origin={origin}
            destination={destination}
            selectedDetour={selectedDetour}
          />
        ) : (
          <FallbackProjectionMap 
            origin={origin}
            destination={destination}
            selectedDetour={selectedDetour}
            detourOptions={detourOptions}
            onSelectDetour={(opt) => setSelectedDetour(opt)}
          />
        )}

        {/* Demo Mode / Key Config Banner Overlay */}
        {!hasValidKey && (
          <div className="absolute top-3 left-3 right-3 py-2.5 px-3.5 bg-white/80 border border-white rounded-xl z-10 flex items-center gap-2 shadow-md backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></div>
            <span className="text-[9px] font-bold font-mono text-orange-600 uppercase tracking-widest leading-none">Simulator Presisi</span>
            <span className="text-[9px] text-slate-500 leading-none">• Peta Yogyakarta aktif</span>
          </div>
        )}
      </div>

      {/* Bottom Curated Dining Roll / Selection Panel */}
      <div className="p-4 backdrop-blur-xl bg-white/45 border-t border-white/60 flex-shrink-0 z-10">
        <div className="mb-3 flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              Rekomendasi Zero-Detour ({detourOptions.length})
            </h3>
          </div>
          <span className="text-[9px] font-bold text-slate-400 font-mono">MAX DETOUR: &le;15m</span>
        </div>

        {detourOptions.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-slate-300 rounded-2xl bg-white/30 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700">Tidak Ada Kuliner Legendaris Searah</div>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Tidak ada kuliner legendaris dalam jangkauan radius 2km untuk rute ini. Coba ubah destinasi pilihan Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Horizontal Slider / Card Carousel */}
            <div className="flex gap-3 overflow-x-auto pb-2.5 scrollbar-hide snap-x">
              {detourOptions.map((option) => {
                const isSelected = selectedDetour?.restaurant.id === option.restaurant.id;
                return (
                  <div
                    key={`carousel-card-${option.restaurant.id}`}
                    onClick={() => setSelectedDetour(option)}
                    className={`snap-center shrink-0 w-72 p-3.5 rounded-[28px] cursor-pointer border transition-all duration-200 select-none group ${
                      isSelected
                        ? 'bg-white/80 border-orange-300 shadow-xl ring-2 ring-orange-400/10'
                        : 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-white shadow-md'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail Photo of Restaurant */}
                      <img
                        src={option.restaurant.photoUrl}
                        alt={option.restaurant.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-100 flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight truncate group-hover:text-orange-600 transition-colors">
                            {option.restaurant.name}
                          </h4>
                        </div>
                        
                        {/* Rating block */}
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center gap-0.5 text-orange-500">
                            <Star className="w-3 h-3 fill-orange-500" />
                            <span className="text-[10px] font-bold font-mono">{option.restaurant.rating}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">({option.restaurant.userRatingCount.toLocaleString()})</span>
                        </div>

                        {/* Specialty tags */}
                        <div className="mt-1.5 text-[9px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded border border-orange-200/40 w-fit">
                          🏆 {option.restaurant.specialty}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {option.restaurant.description}
                    </p>

                    {/* Detour metrics banner */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>Detour:</span>
                        <strong className="text-orange-600 font-bold">
                          +{option.detourDurationMin} m
                        </strong>
                      </div>
                      <div className="text-slate-400 text-[10px] font-bold">
                        {option.distanceToRouteKm} KM Saja
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Submit Block */}
            {selectedDetour && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <button
                  onClick={() => onSelectRestaurant(selectedDetour.restaurant, selectedDetour.detourDurationMin)}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/35 transition-all font-sans hover:translate-y-[-1px]"
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span>Singgah di {selectedDetour.restaurant.name.split(' ')[0]} ➔</span>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ==========================================
 * REAL GOOGLE MAPS COMPONENT
 * ==========================================
 */
interface RealMapProps {
  origin: Location;
  destination: Location;
  selectedDetour: DetourResult | null;
}

function RealGoogleMap({ origin, destination, selectedDetour }: RealMapProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;

    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    const intermediates = selectedDetour ? [{
      location: new google.maps.LatLng(selectedDetour.restaurant.lat, selectedDetour.restaurant.lng)
    }] : [];

    routesLib.Route.computeRoutes({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: 'DRIVING',
      //@ts-ignore
      intermediates: intermediates,
      fields: ['path', 'viewport', 'distanceMeters', 'durationMillis'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({
            strokeColor: '#ea580c',
            strokeWeight: 5,
            strokeOpacity: 0.85
          });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (routes[0].viewport) {
          map.fitBounds(routes[0].viewport);
        }
      }
    }).catch(err => {
      console.error('Error drawing real routes:', err);
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination, selectedDetour]);

  return (
    <Map
      defaultCenter={{ lat: origin.lat, lng: origin.lng }}
      defaultZoom={11}
      mapId="YOGYA_ZERO_DETOUR_MAP"
      internalUsageAttributionIds = {['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker position={{ lat: origin.lat, lng: origin.lng }} title={origin.name}>
        <Pin background="#3b82f6" glyphColor="#fff" scale={1} />
      </AdvancedMarker>

      <AdvancedMarker position={{ lat: destination.lat, lng: destination.lng }} title={destination.name}>
        <Pin background="#f97316" glyphColor="#fff" scale={1} />
      </AdvancedMarker>

      {selectedDetour && (
        <AdvancedMarker 
          position={{ lat: selectedDetour.restaurant.lat, lng: selectedDetour.restaurant.lng }} 
          title={selectedDetour.restaurant.name}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-60"></div>
            <Pin background="#ef4444" glyphColor="#fff" scale={1.1} />
          </div>
        </AdvancedMarker>
      )}
    </Map>
  );
}

/**
 * ==========================================
 * HIGH-FIDELITY FALLBACK PROJECTED VECTOR MAP
 * ==========================================
 */
interface FallbackMapProps extends RealMapProps {
  detourOptions: DetourResult[];
  onSelectDetour: (option: DetourResult) => void;
}

function FallbackProjectionMap({
  origin,
  destination,
  selectedDetour,
  detourOptions,
  onSelectDetour,
}: FallbackMapProps) {
  
  const coordsList = [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
    ...detourOptions.map(o => [o.restaurant.lat, o.restaurant.lng])
  ];

  const lats = coordsList.map(c => c[0]);
  const lngs = coordsList.map(c => c[1]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = maxLat - minLat || 0.05;
  const lngSpan = maxLng - minLng || 0.05;

  const latBuffer = latSpan * 0.18;
  const lngBuffer = lngSpan * 0.18;

  const finalMinLat = minLat - latBuffer;
  const finalMaxLat = maxLat + latBuffer;
  const finalMinLng = minLng - lngBuffer;
  const finalMaxLng = maxLng + lngBuffer;

  const finalLatSpan = finalMaxLat - finalMinLat;
  const finalLngSpan = finalMaxLng - finalMinLng;

  const width = 450;
  const height = 450;

  const project = (lat: number, lng: number) => {
    const x = ((lng - finalMinLng) / finalLngSpan) * width;
    const y = (1 - (lat - finalMinLat) / finalLatSpan) * height;
    return { x, y };
  };

  const oProj = project(origin.lat, origin.lng);
  const dProj = project(destination.lat, destination.lng);

  const getRoutePointsStr = () => {
    let pts: [number, number][] = [];
    if (selectedDetour) {
      pts = generateCurvedRoute(origin, destination, selectedDetour.restaurant);
    } else {
      pts = generateCurvedRoute(origin, destination);
    }
    return pts.map(([lat, lng]) => {
      const { x, y } = project(lat, lng);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  const routePointsStr = getRoutePointsStr();

  return (
    <div className="w-full h-full bg-orange-50/15 flex items-center justify-center relative select-none">
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#fed7aa_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-40"></div>
      
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10 w-full h-full max-w-full max-h-full p-4"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Roads representation */}
        <line x1="20" y1="80" x2="430" y2="70" stroke="#ffedd5" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>
        <line x1="80" y1="430" x2="300" y2="30" stroke="#ffedd5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <line x1="120" y1="400" x2="430" y2="390" stroke="#ffedd5" strokeWidth="1.2" opacity="0.6"/>
        <line x1="30" y1="220" x2="420" y2="230" stroke="#ffedd5" strokeWidth="1.5" opacity="0.5"/>

        {/* 2. Buffer zone */}
        {routePointsStr && (
          <polyline
            points={routePointsStr}
            fill="none"
            stroke="#fdba74"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.12"
            className="animate-pulse"
          />
        )}

        {/* 3. Base/Old direct pathway */}
        {selectedDetour && (
          <line
            x1={oProj.x}
            y1={oProj.y}
            x2={dProj.x}
            y2={dProj.y}
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.5"
          />
        )}

        {/* 4. Active curved route path */}
        {routePointsStr && (
          <polyline
            points={routePointsStr}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all"
            filter="url(#glow)"
          />
        )}

        {/* Floating pulse */}
        {routePointsStr && (
          <path
            d={`M ${oProj.x} ${oProj.y} L ${dProj.x} ${dProj.y}`}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2"
            strokeDasharray="10 110"
            strokeDashoffset="0"
            opacity="0.8"
            className="animate-[dash_6s_linear_infinite]"
          />
        )}

        {/* 5. Restaurants */}
        {detourOptions.map((opt) => {
          const isSelected = selectedDetour?.restaurant.id === opt.restaurant.id;
          const { x, y } = project(opt.restaurant.lat, opt.restaurant.lng);
          return (
            <g 
              key={`marker-${opt.restaurant.id}`} 
              onClick={() => onSelectDetour(opt)}
              className="cursor-pointer group"
            >
              {isSelected ? (
                <>
                  <circle cx={x} cy={y} r="16" fill="#ea580c" opacity="0.25" className="animate-ping" />
                  <circle cx={x} cy={y} r="8" fill="#ea580c" stroke="#fff" strokeWidth="2" />
                  <path d="M-3 -3 L3 3 M3 -3 L-3 3" transform={`translate(${x}, ${y})`} stroke="#fff" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <circle cx={x} cy={y} r="11" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" className="group-hover:fill-slate-50" />
                  <circle cx={x} cy={y} r="3.5" fill="#94a3b8" />
                </>
              )}
              <text
                x={x}
                y={y - 14}
                textAnchor="middle"
                fill={isSelected ? "#ea580c" : "#64748b"}
                fontSize="9"
                fontWeight={isSelected ? "bold" : "600"}
                className="pointer-events-none drop-shadow-[0_1px_1px_rgba(255,255,255,1)] select-none font-mono"
              >
                {opt.restaurant.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* 6. Start point */}
        <g transform={`translate(${oProj.x}, ${oProj.y})`} className="pointer-events-none">
          <circle cx="0" cy="0" r="10" fill="#3b82f6" opacity="0.3" className="animate-pulse" />
          <circle cx="0" cy="0" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
          <text x="0" y="20" textAnchor="middle" fill="#2563eb" fontSize="9.5" fontWeight="bold" className="font-mono drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)]">
            A: {origin.name.split(' ')[0]}
          </text>
        </g>

        {/* 7. Destination point */}
        <g transform={`translate(${dProj.x}, ${dProj.y})`} className="pointer-events-none">
          <circle cx="0" cy="0" r="10" fill="#f97316" opacity="0.3" className="animate-pulse" />
          <circle cx="0" cy="0" r="6" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
          <text x="0" y="20" textAnchor="middle" fill="#ea580c" fontSize="9.5" fontWeight="bold" className="font-mono drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,1)]">
            B: {destination.name.split(' ')[0]}
          </text>
        </g>
      </svg>
    </div>
  );
}
