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
        {/* Main Headline Nilai & Intro (Lapis 1: Paham dalam 30 Detik) */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold tracking-wide mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>GEOCEDS · Sistem Keputusan Berbasis Bukti (Gate-First, Rank-Second)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.16] text-balance">
            Dari Residu Geothermal Menjadi Keputusan Bisnis Sirkular
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
            Bukan sekadar kalkulator campuran beton. <strong className="text-slate-900 font-semibold">GEOCEDS</strong> menyaring setiap batch residu silika PLTP melewati gerbang karakterisasi, teknis SNI, keekonomian, dan lingkungan hingga menghasilkan keputusan produksi yang <span className="text-emerald-800 font-semibold underline decoration-emerald-400 underline-offset-4">dapat dilacak alasannya</span>.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('simulasi')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Coba Simulasi Keputusan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('cara-kerja')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white/90 hover:bg-white border border-slate-300 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Lihat Cara Kerja 8 Gerbang</span>
            </button>
          </div>
        </div>

        {/* 3 Fakta Kunci Berlabel Status (Sesuai Essay) */}
        <div className="mt-10 pt-8 border-t border-slate-200/90 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fakta 1: 23.202 MW */}
          <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                01 · SKALA SUMBER DAYA
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Data Nasional
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                23.202 <span className="text-base font-bold text-emerald-700">MW</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                Potensi Energi Panas Bumi Indonesia
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kapasitas panas bumi nasional menghasilkan konsekuensi timbulan residu silika yang membutuhkan jalur hilirisasi terukur.
              </p>
            </div>
          </div>

          {/* Fakta 2: ±165 ton/bulan */}
          <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                02 · SUPLAI BAHAN BAKU
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Literatur
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                ±165 <span className="text-base font-bold text-emerald-700">ton/bulan</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                Timbulan Sludge PLTP Dieng
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dilaporkan mengandung silika amorf tinggi namun memiliki variabilitas kadar air &amp; pengotor antar-batch (Widiyandari et al., 2021).
              </p>
            </div>
          </div>

          {/* Fakta 3: Target Produk Paving Mutu C */}
          <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                03 · TARGET HILIRISASI AWAL
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Target Produk SNI
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                Paving <span className="text-slate-900">Mutu C</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                Bata Beton Pejalan Kaki (SNI 03-0691-1996)
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Target masuk pasar yang realistis (rata-rata ≥15 MPa, min. individu ≥12,5 MPa, serapan air ≤8%) sebelum ekspansi ke kelas beban berat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
