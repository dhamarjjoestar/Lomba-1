import React, { useState } from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const GateWorkflowSectionView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Material Qualification Gate',
      subtitle: 'Skrining Identitas & Mineralogi Residu',
      description: 'Menilai apakah material residu geothermal memenuhi kriteria dasar sebelum diizinkan masuk ke ruang formulasi adukan.',
      checks: [
        'Kadar SiO₂ minimum (>60% sludge terolah atau >85% xerogel)',
        'Fase mineralogi terkonfirmasi amorf (bukan kristobalit/kuarsa mati)',
        'Kadar air terkontrol pasca-pengeringan (<5%)',
        'Distribusi ukuran partikel (lolos ayakan mesh 200 / d50 terkontrol)',
      ],
      output: 'Pass (Lolos ke formulasi) ATAU Insufficient Data (Wajib karakterisasi lab tambahan)',
    },
    {
      step: '02',
      title: 'Science Engine & Formulasi',
      subtitle: 'Komposisi Adukan & Neraca Massa',
      description: 'Membentuk kandidat formulasi berdasarkan basis substitusi yang dinormalisasi (% massa semen murni, bukan dicampuradukkan dengan agregat).',
      checks: [
        'Substitusi semen terkontrol (rentang optimum 5% – 20%)',
        'Penyesuaian rasio air-semen (W/C ratio) untuk mencegah kehilangan workability',
        'Kompensasi potensi aglomerasi partikel silika halus',
        'Kalkulasi neraca massa: 2,64 kg per paving block standar',
      ],
      output: 'Candidate Formulation dengan parameter adukan terdefinisi',
    },
    {
      step: '03',
      title: 'Technical Gate (SNI 03-0691-1996)',
      subtitle: 'Evaluasi Mutu Mekanik & Durabilitas',
      description: 'Prinsip Gate-First: Produk wajib memenuhi persyaratan teknis SNI sebelum boleh dihitung aspek kelayakan bisnis atau lingkungannya.',
      checks: [
        'Kuat Tekan 28 Hari (Mutu B: rata-rata ≥20 MPa, min 17 MPa)',
        'Penyerapan Air Maksimum (Mutu B: ≤6% rata-rata, Mutu C: ≤8%)',
        'Ketahanan Aus (Abrasion Resistance) sesuai standar lapangan',
        'Integritas fisik dan tidak retak akibat susut hidrasi',
      ],
      output: 'Technical Pass (Lolos ke skrining ekonomi) ATAU Not Recommended (Gagal)',
    },
    {
      step: '04',
      title: 'Economic & Environmental Gate',
      subtitle: 'Kelayakan Finansial & Jejak Karbon',
      description: 'Menganalisis margin operasi, payback investasi pabrik pengolahan, serta reduksi emisi gas rumah kaca dari substitusi klinker semen.',
      checks: [
        'CAPEX Pengolahan: Rp 276.000.000 (Dryer, Grinder, Sieve, QC)',
        'OPEX Residu Terolah: ±Rp 503.000/ton',
        'Margin Operasi: Rp 350 – Rp 650 per blok',
        'Emisi Pengeringan vs Penghematan Semen: Pengurangan emisi bersih CO₂e',
      ],
      output: 'Feasible (Layak komersial) ATAU Unfeasible (Hanya skala lab)',
    },
    {
      step: '05',
      title: 'Traceable Decision Status',
      subtitle: 'Keluaran Keputusan Bersertifikat Jejak',
      description: 'Sistem menetapkan status keputusan akhir yang disertai daftar provenance dan identifikasi data gap yang belum divalidasi.',
      checks: [
        'Recommended: Lolos seluruh gate dengan basis pengujian empiris',
        'Conditional: Lolos teknis namun didasarkan pada asumsi screening',
        'Not Recommended: Gagal memenuhi spesifikasi kekuatan mekanis',
        'Insufficient Data: Terhenti karena ketiadaan data esensial',
      ],
      output: 'Transparansi penuh tanpa klaim fiktif',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {workflowSteps.map((s, idx) => {
          const isCurrent = activeStep === idx;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`}>
                  GATE {s.step}
                </span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
              </div>
              <div className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Gate Focus Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                TAHAPAN {workflowSteps[activeStep].step}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {workflowSteps[activeStep].subtitle}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {workflowSteps[activeStep].title}
            </h3>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-slate-700 bg-slate-50 border-slate-200">
            Prinsip: Verifikasi Objektif
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {workflowSteps[activeStep].description}
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Kriteria Pengujian & Verifikasi:
              </h4>
              <ul className="space-y-2.5">
                {workflowSteps[activeStep].checks.map((check, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Hasil Keluaran Gate
              </div>
              <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 font-medium text-xs sm:text-sm text-slate-900 shadow-xs">
                {workflowSteps[activeStep].output}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Langkah {activeStep + 1} dari {workflowSteps.length}
              </span>
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % workflowSteps.length)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <span>Langkah Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
