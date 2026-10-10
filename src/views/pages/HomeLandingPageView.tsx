import React from 'react';
import { PageId } from '../../models/silica.model';
import { HeroSectionView } from '../sections/HeroSectionView';
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Database,
  Filter,
  FileCheck2,
  Layers,
  Recycle,
  Sparkles,
  Workflow,
  Quote,
} from 'lucide-react';

interface HomeLandingPageViewProps {
  onNavigate: (page: PageId) => void;
}

export const HomeLandingPageView: React.FC<HomeLandingPageViewProps> = ({
  onNavigate,
}) => {
  const shortFlowSteps = [
    {
      no: '01',
      title: 'Sludge & Residu PLTP',
      subtitle: 'Input Batch Material',
      desc: 'Data asal PLTP, jenis material (sludge padat / scaling / xerogel), kadar air, ukuran partikel, dan fase mineralogi masuk ke sistem.',
      icon: Database,
      tone: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      no: '02',
      title: 'Mesin GEOCEDS',
      subtitle: '8 Gerbang Gate-First',
      desc: 'Sistem memverifikasi kualifikasi material, neraca massa, batas teknis SNI 03-0691-1996, biaya (TEA), serta jejak karbon.',
      icon: Filter,
      tone: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      no: '03',
      title: 'Keputusan Tertelusur',
      subtitle: 'GO / CONDITIONAL / NO-GO / DATA REQUIRED',
      desc: 'Keluar status keputusan yang jujur beserta alasan teknis dan daftar data laboratorium yang wajib dilengkapi berikutnya.',
      icon: FileCheck2,
      tone: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      no: '04',
      title: 'Paving Sirkular',
      subtitle: 'Produk Mutu C & Loop Balik',
      desc: 'Batch yang lolos diproduksi menjadi paving block sirkular, sementara hasil uji aktual memperbarui akurasi basis data GEOCEDS.',
      icon: Recycle,
      tone: 'bg-emerald-900 text-white border-emerald-800',
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION + 3 FAKTA KUNCI BERLABEL STATUS */}
      <HeroSectionView onNavigate={onNavigate} />

      {/* 2. DIAGRAM ALUR SINGKAT 4 BLOK: SLUDGE -> GEOCEDS -> KEPUTUSAN -> PAVING SIRKULAR */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                Alur Kerja Inti (30 Detik)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Bagaimana GEOCEDS Mengubah Data Batch Menjadi Keputusan?
              </h2>
            </div>
            <button
              onClick={() => onNavigate('cara-kerja')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer shrink-0"
            >
              <span>Pelajari detail 8 gerbang evaluasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {shortFlowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.no}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between gap-4 relative hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border font-bold text-xs ${step.tone}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        LANGKAH {step.no}
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-semibold text-emerald-700 uppercase">
                        {step.subtitle}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {index < shortFlowSteps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-end text-[11px] font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-200/80">
                      <span>Lanjut ke tahap {index + 2} →</span>
                    </div>
                  )}
                  {index === shortFlowSteps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-end text-[11px] font-mono text-emerald-800 font-bold pt-2 border-t border-slate-200/80">
                      <span>Output Akhir Terverifikasi</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MASALAH VS SOLUSI: RESEARCH-TO-VALUE GAP */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl">
            <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
              Mengapa Sistem Keputusan Ini Dibutuhkan?
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Menjembatani Research-to-Value Gap pada Residu Panas Bumi
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Banyak riset membuktikan silika geothermal bisa dicampur ke beton, tetapi produsen industri tetap enggan menggunakannya karena ketidakpastian mutu antar-batch dan bukti yang tidak tertelusur.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kiri: Masalah (Tanpa GEOCEDS) */}
            <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>MASALAH SAAT INI · RESEARCH-TO-VALUE GAP</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Riset Laboratorium Banyak, Namun Produsen Tidak Berani Pakai
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>
                      <strong className="text-slate-900">Variabilitas Batch Tinggi:</strong> Sludge mentah, kerak pipa (scaling), dan silika xerogel memiliki kadar air, pengotor, dan fase kristal yang sangat berbeda.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>
                      <strong className="text-slate-900">Bukti Tidak Tertelusur:</strong> Hasil kuat tekan mortar di jurnal sering langsung diklaim sebagai kelayakan produk paving block tanpa uji serapan air, ketahanan aus, atau B3/TCLP.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>
                      <strong className="text-slate-900">Risiko Gagal Mutu &amp; Logistik:</strong> Tanpa saringan awal, biaya pengeringan dan transportasi dari PLTP ke pabrik pracetak bisa membuat margin negatif.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-rose-100 text-xs text-rose-800 font-medium">
                Dampak: Residu silika tetap menumpuk di PLTP dan inovasi berhenti di publikasi ilmiah.
              </div>
            </div>

            {/* Kanan: Solusi (Dengan GEOCEDS) */}
            <div className="bg-white rounded-2xl border border-emerald-300 p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SOLUSI GEOCEDS · EVIDENCE-BASED DECISION SYSTEM</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Menyaring Batch dengan Gerbang Bukti Sebelum Produksi
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-slate-900">Membedakan Jenis Material &amp; Batch:</strong> Sistem mengenali perbedaan karakterisasi sludge padat, scaling, maupun xerogel sejak gerbang pertama.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-slate-900">Disiplin Gate-First, Rank-Second:</strong> Keuntungan ekonomi dan klaim karbon tidak akan mengesahkan campuran yang gagal syarat SNI atau belum punya data uji wajib.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-slate-900">Keputusan Berorientasi Tindak Lanjut:</strong> Jika data belum lengkap, sistem mengeluarkan status <code className="font-mono font-bold text-amber-800">DATA REQUIRED</code> atau <code className="font-mono font-bold text-teal-800">CONDITIONAL</code> beserta daftar parameter yang harus diuji.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-emerald-900 font-semibold">
                  Dampak: Produsen memiliki dasar keputusan yang aman &amp; dapat diaudit.
                </span>
                <button
                  onClick={() => onNavigate('simulasi')}
                  className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Uji di Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NAVIGASI CEPAT 3 LAPIS (PANDUAN EKSPLORASI 3-5 MENIT) */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
              Alur Penilaian Cepat (3–5 Menit)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Jelajahi Sistem GEOCEDS Berdasarkan Urutan Implementasi
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Cara Kerja */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    TAHAP 01
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cara Kerja GEOCEDS
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Pahami arsitektur 8 gerbang evaluasi, aturan Gate-First Rank-Second, serta perbedaan 4 level bukti dan 4 status keputusan.
                </p>
              </div>

              <button
                onClick={() => onNavigate('cara-kerja')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-teal-900 bg-teal-100/80 hover:bg-teal-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <span>Buka Cara Kerja</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Simulasi Keputusan */}
            <div className="bg-emerald-950 text-white rounded-2xl border border-emerald-800 p-6 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-800 text-emerald-200 uppercase">
                    Inti Demo
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Simulasi Keputusan Interaktif
                </h3>
                <p className="mt-2 text-xs text-emerald-100/90 leading-relaxed">
                  Uji langsung skenario preset (Batch Belum Terkarakterisasi, Lulus Teknis Logistik Berat, dll.) pada panel input–output dua sisi dan telusuri 8 gerbangnya.
                </p>
              </div>

              <button
                onClick={() => onNavigate('simulasi')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                <span>Mulai Simulasi Keputusan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Siklus Sirkular & Roadmap */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    TAHAP 03
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Siklus Sirkular &amp; Roadmap
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Lihat integrasi Material Loop (termasuk daur ulang akhir masa pakai / end-of-life), Information Loop, serta peta jalan 3 fase menuju lisensi industri.
                </p>
              </div>

              <button
                onClick={() => onNavigate('sirkular-roadmap')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <span>Buka Sirkular &amp; Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KUTIPAN PRINSIP PENUTUP */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <Quote className="w-4 h-4" />
                <span>Prinsip Utama GEOCEDS</span>
              </div>
              <blockquote className="text-lg sm:text-xl font-bold text-white leading-snug">
                “GEOCEDS tidak mengubah limbah menjadi jawaban secara sepihak; sistem ini membangun dasar <span className="text-emerald-400">bukti tertelusur</span> untuk menentukan apakah suatu batch layak diproduksi.”
              </blockquote>
            </div>
            <button
              onClick={() => onNavigate('simulasi')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
            >
              Coba Simulasi Sekarang →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
