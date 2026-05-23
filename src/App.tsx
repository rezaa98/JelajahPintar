/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Location, Restaurant } from './types';
import { calculateMockRouteStats } from './utils';

// Import Modular Components
import SplashError from './components/SplashError';
import HalamanInput from './components/HalamanInput';
import HalamanPeta from './components/HalamanPeta';
import HalamanEksekusi from './components/HalamanEksekusi';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && 
                    API_KEY !== 'YOUR_API_KEY' && 
                    API_KEY !== 'MY_GOOGLE_MAPS_PLATFORM_KEY' &&
                    API_KEY !== '';

export default function App() {
  // Screen Router States:
  // 1: Beranda & Input Form
  // 2: Peta Hasil & Kurasi Kuliner Carousel
  // 3: Eksekusi Handoff Summary & Deep Link Map
  const [halaman, setHalaman] = useState<1 | 2 | 3>(1);
  const [bypassSplash, setBypassSplash] = useState<boolean>(false);

  // Search Context states
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Trip stats states
  const [detourMin, setDetourMin] = useState<number>(0);
  const [originalDurationMin, setOriginalDurationMin] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Render the Google Maps Platform Skill Constitution Splash Screen
  // if no environment API Key is active AND "Bypass Demo Mode" has not been clicked yet
  if (!hasValidKey && !bypassSplash) {
    return <SplashError onBypass={() => setBypassSplash(true)} />;
  }

  const handleSearch = (from: Location, to: Location) => {
    setIsLoading(true);

    // Simulate database lookup / spatial loading
    setTimeout(() => {
      setOrigin(from);
      setDestination(to);
      
      // Calculate original direct route time
      const stats = calculateMockRouteStats(from, to);
      setOriginalDurationMin(stats.durationMin);
      
      setIsLoading(false);
      setHalaman(2);
    }, 1200);
  };

  const handleSelectRestaurant = (restauran: Restaurant, additionalMin: number) => {
    setSelectedRestaurant(restauran);
    setDetourMin(additionalMin);
    setHalaman(3);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setSelectedRestaurant(null);
    setDetourMin(0);
    setOriginalDurationMin(0);
    setHalaman(1);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative select-none selection:bg-orange-200"
      style={{
        background: `radial-gradient(circle at 10% 20%, #ffedd5 0%, transparent 40%), 
                     radial-gradient(circle at 90% 10%, #fde68a 0%, transparent 45%), 
                     radial-gradient(circle at 90% 90%, #fdba74 0%, transparent 40%), 
                     radial-gradient(circle at 10% 80%, #fed7aa 0%, transparent 45%), 
                     #fff7ed`
      }}
    >
      <div 
        className="w-full max-w-md h-[100dvh] relative overflow-hidden shadow-2xl border-x border-white/50 flex flex-col"
        style={{
          background: `radial-gradient(circle at 0% 0%, #ffedd5 0%, transparent 50%), 
                       radial-gradient(circle at 100% 0%, #fde68a 0%, transparent 50%), 
                       radial-gradient(circle at 100% 100%, #fdba74 0%, transparent 50%), 
                       radial-gradient(circle at 0% 100%, #fed7aa 0%, transparent 50%), 
                       #fff7ed`
        }}
      >
        
        {halaman === 1 && (
          <HalamanInput 
            onSearch={handleSearch} 
            isLoading={isLoading} 
          />
        )}

        {halaman === 2 && origin && destination && (
          <HalamanPeta
            origin={origin}
            destination={destination}
            onBack={() => setHalaman(1)}
            onSelectRestaurant={handleSelectRestaurant}
            apiKey={API_KEY}
            hasValidKey={hasValidKey}
          />
        )}

        {halaman === 3 && origin && destination && selectedRestaurant && (
          <HalamanEksekusi
            origin={origin}
            destination={destination}
            restaurant={selectedRestaurant}
            detourMin={detourMin}
            originalDurationMin={originalDurationMin}
            onReset={handleReset}
          />
        )}

      </div>
    </div>
  );
}
