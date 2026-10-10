import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Database,
  Scale,
  Workflow,
  Microscope,
  FileCheck,
} from 'lucide-react';
import { PageId } from '../../models/silica.model';
import { SIMULATION_WORKFLOW_STAGES } from '../../models/simulationWorkspace.model';

interface CaraKerjaPageViewProps {
  onNavigate: (page: PageId) => void;
}

export const CaraKerjaPageView: React.FC<CaraKerjaPageViewProps> = ({
  onNavigate,
}) => {
  const fourEvidenceLevels = [
    {
      level: 'Level 01',
      code: 'VALIDATED',
      title: 'Bukti Uji Fisik Tervalidasi',
      desc: 'Data berasal langsung dari pengujian laboratorium terstandar pada batch residu dan geometri produk paving block yang dituju.',
      badgeTone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      borderTone: 'border-emerald-300',
    },
    {
      level: 'Level 02',
      code: 'LITERATURE-SUPPORTED',
      title: 'Didukung Literatur Terpublikasi',
      desc: 'Terdapat rujukan ilmiah langsung atau studi analog sementisius yang sepadan untuk menyusun ruang kandidat awal, tetapi belum menggantikan uji batch aktual.',
      badgeTone: 'bg-teal-50 text-teal-800 border-teal-200',
      borderTone: 'border-teal-300',
    },
    {
      level: 'Level 03',
      code: 'SCREENING ESTIMATE',
      title: 'Estimasi Skrining Rekayasa',
      desc: 'Perhitungan neraca massa, skenario biaya (TEA), atau potensi karbon berdasarkan parameter model kanonik sebelum validasi pilot.',
      badgeTone: 'bg-amber-50 text-amber-800 border-amber-200',
      borderTone: 'border-amber-300',
    },
    {
      level: 'Level 04',
      code: 'INSUFFICIENT DATA',
      title: 'Data Belum Memadai (Data Gap)',
      desc: 'Parameter wajib seperti ketahanan aus, serapan air, atau uji pelindian B3/TCLP belum diinput sehingga sistem menahan klaim kelulusan.',
      badgeTone: 'bg-rose-50 text-rose-800 border-rose-200',
      borderTone: 'border-rose-300',
    },
  ];

  const fourDecisionStatuses = [
    {
      status: 'GO / VALIDATED',
      engineCode: 'VALIDATED / PRELIMINARY_PROMISING',
      meaning: 'Seluruh gerbang karakterisasi dan batas teknis SNI terpenuhi dengan margin ekonomi sehat.',
      action: 'Lanjutkan ke produksi batch / uji skala pilot.',
      icon: CheckCircle2,
      boxTone: 'bg-emerald-50/70 border-emerald-300 text-emerald-950',
      badgeTone: 'bg-emerald-700 text-white',
    },
    {
      status: 'CONDITIONAL',
      engineCode: 'CONDITIONAL_PROMISING',
      meaning: 'Secara teknis menjanjikan atau lolos skrining awal, namun terkendala syarat tertentu (misal biaya logistik/pengeringan tinggi atau sebagian parameter masih estimasi).',
      action: 'Optimasi rantai pasok / verifikasi parameter bersyarat sebelum produksi komersial.',
      icon: AlertTriangle,
      boxTone: 'bg-teal-50/70 border-teal-300 text-teal-950',
      badgeTone: 'bg-teal-700 text-white',
    },
    {
      status: 'DATA REQUIRED',
      engineCode: 'DATA_REQUIRED',
      meaning: 'Identitas batch, karakterisasi dasar (kadar air, D50, SiO₂, fase), atau hasil uji wajib SNI belum lengkap.',
      action: 'Sistem menolak menebak. Lengkapi daftar pengujian laboratorium yang ditandai.',
      icon: Clock,
      boxTone: 'bg-amber-50/70 border-amber-300 text-amber-950',
      badgeTone: 'bg-amber-600 text-white',
    },
    {
      status: 'NO-GO / NOT SUPPORTED',
      engineCode: 'NOT_SUPPORTED',
      meaning: 'Gagal pada gerbang teknis SNI (kuat tekan di bawah batas mutu), dosis substitusi memicu aglomerasi berat, atau margin finansial negatif.',
      action: 'Tolak formulasi batch ini atau ubah proporsi campuran / metode pra-pemrosesan.',
      icon: XCircle,
      boxTone: 'bg-rose-50/70 border-rose-300 text-rose-950',
      badgeTone: 'bg-rose-700 text-white',
    },
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Top Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <button
            onClick={() => onNavigate('beranda')}
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            onClick={() => onNavigate('simulasi')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <span>Langsung Coba Simulasi Keputusan</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Header Banner: Gate-First, Rank-Second */}
        <section className="bg-emerald-950 text-white rounded-2xl border border-emerald-800 p-4 sm:p-6 md:p-8 shadow-xs min-w-0 overflow-hidden">
          <div className="max-w-3xl space-y-2.5 min-w-0">
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider sm:tracking-widest text-emerald-300 leading-snug break-words">
              <Workflow className="w-4 h-4 shrink-0" />
              <span>Lapis Kepercayaan · Arsitektur Keputusan GEOCEDS</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-snug break-words">
              Cara Kerja Sistem: Gate-First, Rank-Second
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed break-words">
              GEOCEDS mengevaluasi setiap batch residu panas bumi melalui <strong className="text-white">8 tahapan berurutan</strong>. Sistem menerapkan aturan tegas: kandidat campuran harus melewati gerbang kualifikasi material dan gerbang teknis SNI terlebih dahulu sebelum dinilai keuntungan ekonomi maupun reduksi karbonnya.
            </p>
          </div>

          {/* 3 Core Engines Summary */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-emerald-800/80 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-xs min-w-0">
            <div className="rounded-xl bg-emerald-900/60 border border-emerald-800 p-3.5 sm:p-4 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                <Microscope className="w-4 h-4 shrink-0" />
                <span className="break-words">01 · SCIENCE ENGINE</span>
              </div>
              <div className="font-bold text-white text-sm leading-snug break-words">
                Kualifikasi &amp; Neraca Massa
              </div>
              <p className="text-emerald-100/80 leading-relaxed break-words">
                Memeriksa kadar SiO₂, fase amorf vs kristalin, ukuran partikel D50, kadar air, serta menghitung kebutuhan material per blok dan per hari.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-900/60 border border-emerald-800 p-3.5 sm:p-4 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span className="break-words">02 · EVIDENCE ENGINE</span>
              </div>
              <div className="font-bold text-white text-sm leading-snug break-words">
                Pelacakan Keabsahan Bukti
              </div>
              <p className="text-emerald-100/80 leading-relaxed break-words">
                Memisahkan data hasil uji langsung, rujukan literatur, asumsi skrining, dan data yang belum tersedia agar tidak terjadi klaim semu.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-900/60 border border-emerald-800 p-3.5 sm:p-4 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                <Scale className="w-4 h-4 shrink-0" />
                <span className="break-words">03 · DECISION ENGINE</span>
              </div>
              <div className="font-bold text-white text-sm leading-snug break-words">
                Keputusan &amp; Rekomendasi Tindak Lanjut
              </div>
              <p className="text-emerald-100/80 leading-relaxed break-words">
                Menetapkan status akhir (<code className="font-mono break-words">GO / CONDITIONAL / DATA REQUIRED / NO-GO</code>) lengkap dengan alasan dan parameter yang harus dilengkapi.
              </p>
            </div>
          </div>
        </section>

        {/* Stepper 8 Tahap Evaluasi GEOCEDS */}
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 shadow-2xs space-y-5 sm:space-y-6 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 pb-4 border-b border-slate-200 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider break-words">
                Alur Evaluasi 8 Tahap
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 leading-snug break-words">
                Stepper 8 Gerbang Evaluasi dari Batch Masuk hingga Keputusan
              </h2>
            </div>
            <span className="text-xs text-slate-500 leading-relaxed break-words">
              Seluruh tahap ini dapat diuji langsung di halaman Simulasi Keputusan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 min-w-0">
            {SIMULATION_WORKFLOW_STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-colors min-w-0"
                >
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs shrink-0">
                        Tahap {stage.stageNumber}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug break-words">
                        {stage.title}
                      </h3>
                      <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5 leading-snug break-words">
                        {stage.shortLabel}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 break-words">
                        {stage.purpose}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono leading-snug break-words">
                    Modul: {stage.technicalName}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Level Bukti & 4 Status Keputusan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 min-w-0">
          {/* Kiri: 4 Level Bukti */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-7 shadow-2xs space-y-4 sm:space-y-5 min-w-0 overflow-hidden">
            <div className="pb-3.5 sm:pb-4 border-b border-slate-200 min-w-0">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
                <Database className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="break-words">Hierarki Provenance Data</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 leading-snug break-words">
                4 Level Bukti (Evidence Classification)
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                Setiap angka di GEOCEDS diberi label asal bukti agar pengguna tahu mana fakta uji fisik dan mana estimasi skrining:
              </p>
            </div>

            <div className="space-y-3 min-w-0">
              {fourEvidenceLevels.map((item) => (
                <div
                  key={item.code}
                  className={`rounded-xl border p-3.5 sm:p-4 bg-slate-50/60 space-y-1.5 min-w-0 ${item.borderTone}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {item.level}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold rounded-full border break-words ${item.badgeTone}`}
                    >
                      {item.code}
                    </span>
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
          </section>

          {/* Kanan: 4 Status Keputusan */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-7 shadow-2xs space-y-4 sm:space-y-5 min-w-0 overflow-hidden">
            <div className="pb-3.5 sm:pb-4 border-b border-slate-200 min-w-0">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="break-words">Output Mesin Keputusan</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 leading-snug break-words">
                4 Status Keputusan &amp; Tindak Lanjutnya
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                Sistem tidak hanya menerima atau menolak, melainkan mengarahkan langkah teknis berikutnya berdasarkan kondisi bukti:
              </p>
            </div>

            <div className="space-y-3 min-w-0">
              {fourDecisionStatuses.map((item) => {
                const StatusIcon = item.icon;
                return (
                  <div
                    key={item.status}
                    className={`rounded-xl border p-3.5 sm:p-4 space-y-2 min-w-0 ${item.boxTone}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold self-start ${item.badgeTone}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="break-words">{item.status}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-600 leading-snug break-words">
                        Kode Engine: {item.engineCode}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium break-words">
                      {item.meaning}
                    </p>
                    <div className="text-[11px] pt-1.5 border-t border-black/10 font-semibold leading-relaxed break-words">
                      Tindak Lanjut: <span className="font-normal">{item.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Bottom CTA to Simulation */}
        <section className="bg-white rounded-2xl border border-emerald-200 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 min-w-0 overflow-hidden">
          <div className="space-y-1 min-w-0">
            <div className="text-[11px] sm:text-xs font-mono font-bold text-emerald-700 uppercase break-words">
              Langkah Berikutnya (Lapis 2 — Demo)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug break-words">
              Uji Langsung Mekanisme Gate-First pada Halaman Simulasi Keputusan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed break-words">
              Gunakan tombol skenario preset untuk melihat bagaimana perubahan kelengkapan data dan biaya logistik mengubah keputusan sistem.
            </p>
          </div>

          <button
            onClick={() => onNavigate('simulasi')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
          >
            <span>Buka Simulasi Keputusan</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </section>
      </div>
    </div>
  );
};
