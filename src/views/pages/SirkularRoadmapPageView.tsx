import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Recycle,
  RefreshCw,
  Database,
  Factory,
  FlaskConical,
  Building2,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { PageId } from '../../models/silica.model';
import { ReferencesSectionView } from '../sections/ReferencesSectionView';

interface SirkularRoadmapPageViewProps {
  onNavigate: (page: PageId) => void;
}

export const SirkularRoadmapPageView: React.FC<SirkularRoadmapPageViewProps> = ({
  onNavigate,
}) => {
  const materialLoopSteps = [
    {
      step: '01',
      title: 'Sumber Residu PLTP',
      desc: 'Sludge kolam pengendapan & kerak silika pipa (scaling) dari operasi brine panas bumi Dieng (±165 ton/bulan).',
    },
    {
      step: '02',
      title: 'Pra-pemrosesan Terukur',
      desc: 'Dewatering, pengeringan terkontrol (<180°C agar tetap amorf), penggilingan (grinding), dan pengayakan (yield ~90%).',
    },
    {
      step: '03',
      title: 'Produksi Paving Sirkular',
      desc: 'Substitusi parsial semen (5–10% basis massa) untuk bata beton Mutu C (pejalan kaki/taman) sesuai SNI 03-0691-1996.',
    },
    {
      step: '04',
      title: 'Akhir Masa Pakai (End-of-Life)',
      desc: 'Paving yang rusak/habis umur pakai tidak dibuang ke TPA, melainkan dihancurkan (crushing) menjadi agregat daur ulang (Recycled Concrete Aggregate) untuk batch produksi baru.',
    },
  ];

  const informationLoopSteps = [
    {
      step: 'A',
      title: 'Input Data Batch & Lab Baru',
      desc: 'Setiap kali batch baru dari PLTP diuji (kadar air, XRF SiO₂, XRD fase, kuat tekan, serapan air, TCLP), datanya dicatat ke sistem.',
    },
    {
      step: 'B',
      title: 'Kalibrasi Batas & Model GEOCEDS',
      desc: 'Hasil uji fisik menggantikan status DATA REQUIRED / SCREENING ESTIMATE menjadi VALIDATED dan mempersempit ketidakpastian.',
    },
    {
      step: 'C',
      title: 'Keputusan Batch Berikutnya Makin Cepat',
      desc: 'Produsen mendapat rekomendasi proporsi campuran dan estimasi biaya yang makin presisi untuk karakteristik brine setiap sumur.',
    },
  ];

  const roadmapPhases = [
    {
      phase: 'FASE 1 · VALIDASI LABORATORIUM',
      timeline: 'Bulan 1 – 6 (TRL 3–4)',
      icon: FlaskConical,
      badgeTone: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      title: 'Karakterisasi Multi-Batch & Pembuktian Penuh SNI + TCLP',
      deliverables: [
        'Pengambilan sampel multi-batch sludge padat & scaling dari PLTP Dieng untuk memetakan variasi musiman.',
        'Uji lengkap SNI 03-0691-1996 pada geometri paving block aktual (kuat tekan rata-rata & individu, serapan air, ketahanan aus).',
        'Uji pelindian logam berat (TCLP) dan toksisitas untuk memastikan keamanan lingkungan produk.',
        'Kalibrasi database awal GEOCEDS dari status DATA REQUIRED menjadi VALIDATED.',
      ],
    },
    {
      phase: 'FASE 2 · PILOT PLANT & UJI TAPAK',
      timeline: 'Bulan 7 – 18 (TRL 5–6)',
      icon: Factory,
      badgeTone: 'bg-teal-100 text-teal-900 border-teal-300',
      title: 'Produksi Skala Pilot (5.000 Blok/Hari) & Pemasangan Area PLTP',
      deliverables: [
        'Instalasi unit pengering (dryer 1 ton/jam) dan grinder dengan investasi CAPEX terukur (~Rp 276 Juta).',
        'Uji coba produksi bersama mitra UMKM beton pracetak lokal di sekitar Wonosobo / Banjarnegara.',
        'Pemasangan perdana paving sirkular di area jalan inspeksi / parkir lingkungan PLTP Dieng untuk uji cuaca nyata.',
        'Audit konsumsi energi aktual pengeringan & transportasi guna memvalidasi reduksi emisi CO₂ bersih.',
      ],
    },
    {
      phase: 'FASE 3 · LISENSI & INTEGRASI INDUSTRI',
      timeline: 'Tahun 2 – 3 (TRL 7–8)',
      icon: Building2,
      badgeTone: 'bg-slate-900 text-white border-slate-700',
      title: 'Komersialisasi Sistem GEOCEDS & Replikasi Lintas PLTP Nasional',
      deliverables: [
        'Integrasi dashboard GEOCEDS sebagai standar kendali mutu (QC) rutin antara pengelola PLTP dan pabrik pracetak.',
        'Penerapan skema tarik-balik (take-back scheme) bongkaran paving lama untuk daur ulang agregat akhir masa pakai.',
        'Replikasi model keputusan ke lapangan panas bumi lain di Indonesia (bagian dari ekosistem 23.202 MW nasional).',
      ],
    },
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <button
            onClick={() => onNavigate('simulasi')}
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Kembali ke Simulasi Keputusan</span>
          </button>

          <button
            onClick={() => onNavigate('tim-kami')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <span>Lihat Tim Pengembang</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Page Header */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-2xs min-w-0 overflow-hidden">
          <div className="max-w-3xl space-y-2 min-w-0">
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider leading-snug break-words">
              <Recycle className="w-4 h-4 shrink-0" />
              <span>Lapis Kepercayaan · Ekonomi Sirkular &amp; Peta Jalan Implementasi</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug break-words">
              Siklus Sirkular Ganda &amp; Roadmap 3 Fase
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed break-words">
              Sirkularitas pada GEOCEDS tidak berhenti saat limbah masuk ke cetakan beton. Sistem ini menutup dua siklus sekaligus: <strong className="text-slate-900">Siklus Material (termasuk daur ulang akhir masa pakai)</strong> dan <strong className="text-slate-900">Siklus Informasi (umpan balik data uji laboratorium)</strong>.
            </p>
          </div>
        </section>

        {/* 1. DIAGRAM SIKLUS SIRKULAR: MATERIAL LOOP & INFORMATION LOOP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 min-w-0">
          {/* Material Loop (7 cols) */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-emerald-200 p-4 sm:p-6 md:p-7 shadow-2xs space-y-4 sm:space-y-5 flex flex-col justify-between min-w-0 overflow-hidden">
            <div className="space-y-4 min-w-0">
              <div className="pb-3.5 sm:pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-emerald-700 uppercase">
                    <Recycle className="w-4 h-4 shrink-0" />
                    <span className="break-words">Loop 01 · Aliran Fisik</span>
                  </div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5 leading-snug break-words">
                    Material Loop (Termasuk Akhir Masa Pakai / End-of-Life)
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
                  Zero-Waste Cycle
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 min-w-0">
                {materialLoopSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 space-y-1.5 min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono font-bold text-[11px] shrink-0">
                        TAHAP {item.step}
                      </span>
                      {item.step === '04' && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                           Sirkular Penuh ↺
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug break-words">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 text-xs text-emerald-950 flex items-start gap-2.5 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed break-words">
                <strong>Kunci Keamanan Akhir Masa Pakai:</strong> Paving hasil daur ulang hanya boleh masuk kembali sebagai agregat kasar/halus jika batch awalnya telah terverifikasi aman uji pelindian logam berat (TCLP).
              </span>
            </div>
          </section>

          {/* Information Loop (5 cols) */}
          <section className="lg:col-span-5 bg-emerald-950 text-white rounded-2xl border border-emerald-800 p-4 sm:p-6 md:p-7 shadow-2xs space-y-4 sm:space-y-5 flex flex-col justify-between min-w-0 overflow-hidden">
            <div className="space-y-4 min-w-0">
              <div className="pb-3.5 sm:pb-4 border-b border-emerald-800 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-emerald-300 uppercase">
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  <span className="break-words">Loop 02 · Aliran Bukti</span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-white mt-0.5 leading-snug break-words">
                  Information Loop (Closed-Loop Evidence)
                </h2>
                <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed break-words">
                  Bagaimana data pengujian mengoreksi asumsi model dari waktu ke waktu:
                </p>
              </div>

              <div className="space-y-3 min-w-0">
                {informationLoopSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl bg-emerald-900/60 border border-emerald-800 p-3.5 sm:p-4 space-y-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
                      <Database className="w-3.5 h-3.5 shrink-0" />
                      <span>SIMPUL {item.step}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug break-words">
                      {item.title}
                    </h3>
                    <p className="text-xs text-emerald-100/85 leading-relaxed break-words">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-800 text-[11px] text-emerald-200 font-mono leading-relaxed break-words">
              Hasil: Semakin banyak batch diuji, semakin kecil gap antara simulasi dan realitas pabrik.
            </div>
          </section>
        </div>

        {/* 2. ROADMAP IMPLEMENTASI 3 FASE (LAB -> PILOT -> LISENSI) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-2xs space-y-5 sm:space-y-6 min-w-0 overflow-hidden">
          <div className="pb-4 border-b border-slate-200 min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              <Layers className="w-4 h-4 shrink-0" />
              <span className="break-words">Peta Jalan Eksekusi (Roadmap)</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 leading-snug break-words">
              Roadmap Implementasi 3 Fase: Lab → Pilot → Lisensi Industri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed break-words">
              Tahapan terukur untuk membawa GEOCEDS dari prototipe keputusan menuju adopsi industri nyata di PLTP Dieng dan nasional:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 min-w-0">
            {roadmapPhases.map((phaseItem) => {
              const PhaseIcon = phaseItem.icon;
              return (
                <div
                  key={phaseItem.phase}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex flex-col justify-between gap-4 min-w-0"
                >
                  <div className="space-y-3.5 min-w-0">
                    <div className="flex items-start sm:items-center justify-between gap-2 min-w-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold border leading-snug break-words ${phaseItem.badgeTone}`}
                      >
                        {phaseItem.phase}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0">
                        <PhaseIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-mono font-semibold text-emerald-700 break-words">
                        Target Waktu: {phaseItem.timeline}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 leading-snug break-words">
                        {phaseItem.title}
                      </h3>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200/80 min-w-0">
                      {phaseItem.deliverables.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. LANDASAN PUSTAKA & RUJUKAN ILMIAH KANONIK */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-2xs space-y-4 sm:space-y-5 min-w-0 overflow-hidden">
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="break-words">Daftar Literatur Terverifikasi</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug break-words">
                Rujukan Ilmiah Pendukung Provenance Data GEOCEDS
              </h2>
            </div>
            <span className="text-xs text-slate-500 leading-relaxed break-words">
              Digunakan sebagai batas literatur pada Science &amp; Evidence Engine
            </span>
          </div>

          <ReferencesSectionView />
        </section>
      </div>
    </div>
  );
};
