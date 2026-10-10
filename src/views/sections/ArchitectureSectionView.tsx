import React from 'react';
import { Microscope, FileCheck, Scale } from 'lucide-react';

export const ArchitectureSectionView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 3 Engines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engine 1: Science Engine */}
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6">
              <Microscope className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-700 font-semibold uppercase">Engine 01</div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Science Engine</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mengolah korelasi saintifik antara karakteristik mineralogi (fase amorf, kemurnian SiO₂, d50, LOI), komposisi substitusi semen, dan parameter performa beton (kuat tekan 28 hari, waktu ikat, absorpsi air).
            </p>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Koreksi dispersi partikel & risiko aglomerasi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Normalisasi basis substitusi (% binder / % semen)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Design of Experiments (DOE) & pemodelan RSM</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 text-xs font-medium text-slate-500">
            Peran: Membentuk kandidat formulasi yang relevan secara ilmiah
          </div>
        </div>

        {/* Engine 2: Evidence Engine */}
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-teal-700 font-semibold uppercase">Engine 02</div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Evidence Engine</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mengklasifikasikan bukti secara bertingkat dan mengawal jejak keabsahan data agar estimasi matematika tidak disalahartikan sebagai fakta hasil uji coba fisik.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-emerald-800">1. Validated</span>
                <span className="text-slate-500">Hasil uji lab aktual</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-teal-800">2. Literature-Supported</span>
                <span className="text-slate-500">Studi terdahulu sepadan</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-amber-800">3. Screening Estimate</span>
                <span className="text-slate-500">Estimasi teknis rekayasa</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold text-rose-800">4. Insufficient Data</span>
                <span className="text-slate-500">Data gap wajib uji fisik</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 text-xs font-medium text-slate-500">
            Peran: Menjaga transparansi kepastian data & keabsahan sumber
          </div>
        </div>

        {/* Engine 3: Decision Engine */}
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-6">
              <Scale className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-700 font-semibold uppercase">Engine 03</div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Decision Engine</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mengeksekusi logika keputusan <strong className="text-slate-900">Gate-First, Rank-Second</strong>. Menahan keputusan rekomendasi ketika data tidak cukup, bukan memaksakan jawaban semu.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Technical Gate: Kuat tekan & absorpsi SNI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Economic Screening: CAPEX, OPEX & Payback</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Environmental Screening: Neraca emisi CO₂e</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 text-xs font-medium text-slate-500">
            Peran: Menetapkan status kelayakan akhir kandidat material
          </div>
        </div>
      </div>
    </div>
  );
};
