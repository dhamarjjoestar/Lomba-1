import React from 'react';
import { PageId } from '../../models/silica.model';
import { HeroSectionView } from '../sections/HeroSectionView';
import { AlurEvaluasiSectionView } from '../sections/AlurEvaluasiSectionView';
import { ProblemSectionView } from '../sections/ProblemSectionView';
import { ArchitectureSectionView } from '../sections/ArchitectureSectionView';
import { Sparkles, BookOpen, Users, ChevronRight, TrendingUp, Quote } from 'lucide-react';

interface HomeLandingPageViewProps {
  onNavigate: (page: PageId) => void;
}

export const HomeLandingPageView: React.FC<HomeLandingPageViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION WITH INDONESIAN MOUNTAIN BACKGROUND */}
      <HeroSectionView onNavigate={onNavigate} />

      {/* ALUR EVALUASI WORKFLOW (DARI DATA HINGGA KEPUTUSAN) */}
      <AlurEvaluasiSectionView />

      {/* 2. RANGKUMAN ESSAY - LONG-SCROLL LANDING PAGE */}
      <section id="ringkasan-essay" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Lead */}
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              Rangkuman Inti Riset
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Dari Persoalan Operasional Hingga Kerangka Keputusan Teruji
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Berikut adalah ringkasan komprehensif dari riset ilmiah kami, merangkum fenomena lapangan panas bumi Dieng, research gap yang dihadapi, hingga solusi konseptual arsitektur GEOCEDS.
            </p>
          </div>

          {/* Bagian 01 & 02: Problem Section View */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-4">
              <span>Bagian 01 &amp; 02 · Persoalan Lapangan &amp; Research Gap Residu Geothermal</span>
            </div>
            <ProblemSectionView />
          </div>

          {/* Bagian 03: Architecture Section View */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-4">
              <span>Bagian 03 · Arsitektur Tiga Engine GEOCEDS</span>
            </div>
            <ArchitectureSectionView />
          </div>

          {/* Bagian 04: Studi Kasus Paving Block Ringkas */}
          <div className="pt-6 border-t border-slate-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Bagian 04 · Studi Kasus Aplikasi Paving Block Dieng</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Kelayakan Teknis, Neraca Massa &amp; Skrining Finansial
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Paving block dipilih sebagai domain aplikasi pembuktian awal karena memiliki standar mutu terukur menurut <strong className="text-slate-900 font-semibold">SNI 03-0691-1996</strong> (Bata Beton). Evaluasi tekno-ekonomi pada kapasitas produksi <strong className="text-slate-900 font-semibold">5.000 blok/hari</strong> (dimensi 200×100×60 mm, massa 2,64 kg/blok) menghasilkan temuan penting:
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Investasi Mesin (CAPEX)</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">Rp 276.000.000</div>
                  <div className="text-[11px] text-slate-500 mt-1">Dryer 1 t/jam (150jt), Grinder (35jt), Sieve (20jt), Handling (25jt), QC &amp; Listrik (46jt).</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Biaya Olah Residu (OPEX)</div>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">≈Rp 503.000 / ton</div>
                  <div className="text-[11px] text-slate-500 mt-1">Energi pengeringan, grinding, tenaga kerja, maintenance, QC lab, dan transport internal.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Payback Period (Skenario Dasar)</div>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">~6,3 Bulan</div>
                  <div className="text-[11px] text-slate-500 mt-1">Harga jual Rp 1.600/blok (Rp 80rb/m²), biaya Rp 1.250/blok, margin Rp 350/blok.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 05: Metodologi Closed Loop */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 md:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                Bagian 05 · Kesimpulan &amp; Metodologi Umpan Balik Tertutup
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Closed-Loop Development: Dari Simulasi Menuju Validasi Lapangan
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                GEOCEDS tidak berhenti sebagai keluaran sekali jalan. Hasil pengujian laboratorium dimasukkan kembali ke basis data untuk mengoreksi asumsi model matematika dan mempersempit <em className="italic">data gap</em>. Dengan mekanisme ini, keputusan engineering pada setiap iterasi menjadi semakin kokoh dan akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GATEWAY KE HALAMAN LAINNYA (Simulasi, Metopen, Tim Kami) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              Navigasi Halaman Sistem
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Eksplorasi Modul Khusus GEOCEDS
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Setiap komponen arsitektur memiliki halaman tersendiri untuk eksplorasi simulasi interaktif, metodologi penelitian mendalam, dan profil tim pengembang.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gateway 1: Simulasi */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Halaman Khusus</div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Simulator DSS Interaktif</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Coba kalkulasi substitusi silika Dieng terhadap standar mutu SNI 03-0691-1996, cek batas aglomerasi, emisi karbon dihemat, serta neraca margin finansial secara real-time.
                </p>
              </div>

              <button
                onClick={() => onNavigate('simulasi')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-lg transition-colors cursor-pointer"
              >
                <span>Buka Page Simulasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Gateway 2: Metopen */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-teal-700 uppercase">Halaman Khusus</div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Metodologi Penelitian (Metopen)</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Pelajari alur Closed-Loop Development, kerangka DOE &amp; Response Surface Methodology (RSM), serta klasifikasi 4 status keabsahan data provenance.
                </p>
              </div>

              <button
                onClick={() => onNavigate('metopen')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-teal-800 bg-teal-100/70 hover:bg-teal-200/70 rounded-lg transition-colors cursor-pointer"
              >
                <span>Buka Page Metopen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Gateway 3: Tim Kami */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Halaman Khusus</div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Tim Pengembang Karya</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Profil tim peneliti mahasiswa dan dosen pembimbing Fakultas Teknik Universitas Negeri Semarang (UNNES).
                </p>
              </div>

              <button
                onClick={() => onNavigate('tim-kami')}
                className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-lg transition-colors cursor-pointer"
              >
                <span>Buka Page Tim Kami</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PESAN DARI TIM PENGEMBANG UNTUK PEMBACA (SEBELUM FOOTER) */}
      <section className="py-20 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
        {/* Dekorasi Cahaya Halus */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800/80 backdrop-blur-xs rounded-3xl border border-slate-700/80 p-8 sm:p-12 shadow-2xl">
            {/* Header Lencana */}
            <div className="flex items-center gap-2.5 text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Quote className="w-4 h-4" />
              </div>
              <span>Kata dari Tim Pengembang untuk Pembaca</span>
            </div>

            {/* Kutipan Inti Filosofi */}
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
              “GEOCEDS tidak mengubah limbah menjadi jawaban; sistem ini membangun dasar <span className="text-emerald-400">evidence</span> untuk menentukan apakah limbah tersebut layak menjadi jawaban.”
            </blockquote>

            {/* Narasi Catatan untuk Pembaca */}
            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Kami merancang sistem ini dengan kesadaran penuh bahwa inovasi material hijau dan pemanfaatan residu panas bumi tidak boleh sekadar berhenti pada klaim ramah lingkungan di atas kertas. Melalui GEOCEDS, setiap keputusan rekayasa divalidasi secara transparan — membedakan estimasi matematika dari kenyataan laboratorium, menahan keputusan saat data belum memadai, dan memastikan setiap langkah konversi membawa dampak nyata yang aman, terukur, dan berkelanjutan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
