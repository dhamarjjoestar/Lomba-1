import React from 'react';
import { ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';
import { PageId } from '../../models/silica.model';

interface HeroSectionViewProps {
  onNavigate: (page: PageId) => void;
}

export const HeroSectionView: React.FC<HeroSectionViewProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-slate-50">
      {/* Indonesian Mountain Background (Dataran Tinggi Dieng) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-0">
        <img
          src="/images/dieng.png"
          alt="Latar Belakang Dataran Tinggi Dieng Jawa Tengah"
          className="w-full h-full object-cover object-center opacity-90"
          loading="eager"
        />
        {/* Subtle Scrim to ensure crisp typography while keeping mountain landscape clear and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Headline & Intro (Not constrained side-by-side on desktop) */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] text-balance">
            Transformasi Residu Geothermal Menjadi Material Konstruksi Berkelanjutan
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            GEOCEDS adalah gagasan <strong className="text-slate-900 font-semibold">Evidence-Based Decision Support System (DSS)</strong> untuk mengevaluasi kelayakan residu silika PLTP Dieng menjadi produk paving block mutu tinggi berstandar SNI melalui prinsip evaluasi berjenjang <span className="text-emerald-700 font-semibold underline decoration-emerald-300 underline-offset-4">Gate-First, Rank-Second</span>.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('simulasi')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Buka Halaman Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#ringkasan-essay"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all active:scale-[0.98]"
            >
              <span>Baca Rangkuman Essay</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SNI 03-0691-1996 Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data Provenance Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Closed-Loop Development</span>
            </div>
          </div>
        </div>

        {/* Executive Abstract Snapshot Card (Positioned below h1 & intro, not beside) */}
        <div className="mt-12">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
                  RINGKASAN EKSEKUTIF KARYA
                </span>
                <span className="text-xs text-slate-400">PLTP Dieng Jawa Tengah</span>
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-5">
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    GEOCEDS Decision Architecture
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Sistem mengintegrasikan identitas material, basis formulasi normal, neraca massa, persyaratan teknis SNI, serta skrining ekonomi & lingkungan dalam satu alur keputusan yang dapat ditelusuri.
                  </p>
                </div>

                {/* 3 Core Principles */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                    <span className="font-mono text-emerald-400 font-bold">01</span>
                    <div className="mt-2">
                      <div className="font-semibold text-slate-200">Bukan Sekadar Mix Calculator</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-normal">Menjawab keputusan apa yang dapat dipertanggungjawabkan, bukan cuma menimbang komposisi.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                    <span className="font-mono text-emerald-400 font-bold">02</span>
                    <div className="mt-2">
                      <div className="font-semibold text-slate-200">Prinsip Gate-First, Rank-Second</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-normal">Wajib lolos persyaratan teknis SNI terlebih dahulu sebelum dinilai aspek ekonomi atau lingkungannya.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                    <span className="font-mono text-emerald-400 font-bold">03</span>
                    <div className="mt-2">
                      <div className="font-semibold text-slate-200">Transparansi Data Gap</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-normal">Sistem berani menahan status rekomendasi jika data empiris belum memadai, mencegah klaim semu.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Platform Awal: Paving Block Beton Ramah Lingkungan</span>
              <button
                onClick={() => onNavigate('simulasi')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Uji Kasus DEMO-Q-001</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Pillars */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              165 <span className="text-sm font-normal text-slate-600">t/bulan</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Timbulan Geothermal Sludge Dieng</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Widiyandari et al., 2021</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              90% <span className="text-sm font-normal text-slate-600">Yield</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Processing Yield Residu Terkontrol</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Uji neraca massa & pengeringan</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
              ~6,3 <span className="text-sm font-normal text-slate-600">Bulan</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Payback Period Investasi CAPEX</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kapasitas 5.000 blok/hari (Rp 276jt)</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              SNI <span className="text-sm font-normal text-slate-600">Mutu B</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Kuat Tekan Rata-rata ≥20 MPa</div>
            <div className="text-[11px] text-slate-400 mt-0.5">SNI 03-0691-1996 Paving Block</div>
          </div>
        </div>
      </div>
    </section>
  );
};
