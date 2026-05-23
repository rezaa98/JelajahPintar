import React from 'react';
import { Key, ChevronRight, Settings, Compass, Sparkles, AlertCircle } from 'lucide-react';

interface SplashErrorProps {
  onBypass: () => void;
}

export default function SplashError({ onBypass }: SplashErrorProps) {
  return (
    <div 
      className="w-full max-w-sm mx-auto h-[100dvh] flex flex-col justify-between p-6 overflow-y-auto font-sans relative text-slate-800 selection:bg-orange-200"
      style={{
        background: `radial-gradient(circle at 10% 20%, #ffedd5 0%, transparent 40%), 
                     radial-gradient(circle at 90% 10%, #fde68a 0%, transparent 45%), 
                     radial-gradient(circle at 90% 90%, #fdba74 0%, transparent 40%), 
                     radial-gradient(circle at 10% 80%, #fed7aa 0%, transparent 45%), 
                     #fff7ed`
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400"></div>

      {/* Hero Visual Block */}
      <div className="pt-8 text-center space-y-2 flex-shrink-0">
        <div className="inline-flex items-center justify-center p-3.5 bg-orange-600 rounded-2xl mb-1 shadow-lg shadow-orange-600/30">
          <Key className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Kunci API Google Maps</h2>
        <p className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">Edisi Yogyakarta</p>
        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed mt-1">
          Aplikasi menggunakan Google Maps JavaScript, Directions, dan Places API untuk memetakan rute kustom Anda.
        </p>
      </div>

      {/* Integration Setup Core Steps */}
      <div className="flex-1 py-6 space-y-4">
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 p-5 rounded-[28px] shadow-xl space-y-3">
          <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs uppercase tracking-widest font-mono border-b border-white/80 pb-2 mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Petunjuk Pemasangan</span>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 text-[10.5px] font-bold flex items-center justify-center text-slate-800 font-mono">1</span>
              <p className="text-xs text-slate-700 leading-normal">
                Dapatkan kunci API platform di{' '}
                <a
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 font-bold underline hover:text-orange-500 transition-colors"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 text-[10.5px] font-bold flex items-center justify-center text-slate-800 font-mono">2</span>
              <div className="text-xs text-slate-700 leading-normal space-y-1">
                <span>Pasang sebagai Secret di Google AI Studio:</span>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-600 text-[11px]">
                  <li>Buka menu <strong className="text-slate-800">Settings</strong> (⚙️ ikon ruji kanan atas)</li>
                  <li>Pilih tab <strong className="text-slate-800">Secrets</strong></li>
                  <li>Masukkan nama: <code className="px-1.5 py-0.5 bg-white/60 font-mono text-slate-800 border border-white/80 rounded">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                  <li>Masukkan Kunci API Anda, tekan <strong className="text-slate-800">Simpan</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Informative alert notification */}
        <div className="backdrop-blur-md bg-orange-600/10 border border-orange-200/50 p-4 rounded-2xl text-[10.5px] text-orange-950 leading-normal flex gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <span>Aplikasi terotomasi memuat ulang setelah Secret disimpan. Jangan menyegarkan browser secara manual.</span>
        </div>
      </div>

      {/* Immediate Interactive Preset Demo Mode (BYPASS Option) */}
      <div className="backdrop-blur-xl bg-white/50 border border-white p-5 rounded-[28px] shadow-xl space-y-3 flex-shrink-0 text-center">
        <div className="flex justify-center items-center gap-1.5 text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600">Coba Demo Interaktif</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Belum punya kunci API? Anda dapat melewati pemasangan ini dan langsung menjelajah Yogyakarta menggunakan simulator rute dan kuliner kami!
        </p>
        <button
          onClick={onBypass}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-orange-600/30 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          <Compass className="w-4 h-4 text-white animate-spin-slow" />
          <span>Lihat Demo Yogyakarta (Preset)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
