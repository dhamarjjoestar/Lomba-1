import React, { useMemo } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  ShieldCheck,
  Table2,
  Workflow,
} from 'lucide-react';
import {
  directPavingEvidence,
  literaturePerformance,
  sourceById,
  validationRoadmap,
} from '../../engine/data/master';
import {
  defaultEconomicControls,
  defaultMix,
  demoCharacterization,
  runStudy,
} from '../../engine/study';

const methodologySteps = [
  {
    no: '01',
    title: 'Identifikasi material',
    copy: 'Kunci identitas sumber, asal, kondisi proses, dan konteks material sebelum data digunakan.',
  },
  {
    no: '02',
    title: 'Qualification gate',
    copy: 'Periksa kimia/mineralogi, fisik, pengotor, kadar air, ukuran partikel, dan kebutuhan karakterisasi.',
  },
  {
    no: '03',
    title: 'Formulasi kandidat',
    copy: 'Susun replacement level, replacement basis, W/B, ukuran partikel, dan geometri produk.',
  },
  {
    no: '04',
    title: 'Evidence mapping',
    copy: 'Petakan hasil literatur berdasarkan material, produk, basis substitusi, umur uji, dan transferability.',
  },
  {
    no: '05',
    title: 'Technical gate',
    copy: 'Bandingkan performa terhadap kebutuhan teknis dan standar; literatur tidak menggantikan validasi.',
  },
  {
    no: '06',
    title: 'Economic + environmental',
    copy: 'Screening ekonomi dan lingkungan dilakukan sesudah dasar teknis kandidat cukup kuat.',
  },
  {
    no: '07',
    title: 'Keputusan & validasi',
    copy: 'Hasil menjadi rekomendasi berbatas, lalu dikonfirmasi melalui eksperimen dan loop pembaruan evidence.',
  },
];

const evidenceRules = [
  {
    no: '01',
    text: 'Replacement basis tidak boleh dihilangkan saat membandingkan persentase.',
  },
  {
    no: '02',
    text: 'Mortar, concrete, dan paving block tidak diperlakukan sebagai dataset universal.',
  },
  {
    no: '03',
    text: 'Nilai reported, derived, assumed, dan validated harus tetap dibedakan.',
  },
  {
    no: '04',
    text: 'Evidence literatur tidak boleh dipindahkan menjadi klaim validasi eksperimen SILICA2CON.',
  },
];

const fikroni = literaturePerformance
  .filter(
    (item) =>
      item.source_id === 'SRC-017' &&
      item.product_type === 'PAVING_BLOCK' &&
      item.compressive_strength_7d_mpa != null
  )
  .sort((a, b) => (a.replacement_pct ?? 0) - (b.replacement_pct ?? 0));

const lopez = literaturePerformance
  .filter(
    (item) =>
      item.source_id === 'SRC-007' &&
      item.compressive_strength_28d_mpa != null
  )
  .sort((a, b) => (a.replacement_pct ?? 0) - (b.replacement_pct ?? 0));

const maxFikroni = Math.max(
  ...fikroni.map((item) => item.compressive_strength_7d_mpa ?? 0),
  1
);

const maxLopez = Math.max(
  ...lopez.map((item) => item.compressive_strength_28d_mpa ?? 0),
  1
);

/**
 * Cross-domain paving durability benchmark.
 *
 * IMPORTANT:
 * These are NOT geothermal-residue results.
 * They are included to demonstrate how SILICA2CON should visualize
 * durability variables before the target geothermal experiment exists.
 *
 * Source:
 * Han, Y., Jia, Z., Yang, X., & Jiang, X. (2026).
 * Graded Utilization of Asphalt Mixing Plant Dust in Alkali-Activated
 * Concrete Paving Blocks: Mechanical Performance and Sustainability Assessment.
 * Coatings, 16(5), 541.
 * DOI: 10.3390/coatings16050541
 */
const durabilityBenchmark = [
  {
    mix: 'S-0-0',
    waterAbsorption: 5.3,
    abrasionPit: 29.2,
  },
  {
    mix: 'L-10-10',
    waterAbsorption: 4.7,
    abrasionPit: 27.5,
  },
  {
    mix: 'B-15-20',
    waterAbsorption: 4.4,
    abrasionPit: 25.8,
  },
  {
    mix: 'M-10-20',
    waterAbsorption: 4.1,
    abrasionPit: 24.7,
  },
];

const maxWaterAbsorption = Math.max(
  ...durabilityBenchmark.map((item) => item.waterAbsorption),
  1
);

const maxAbrasionPit = Math.max(
  ...durabilityBenchmark.map((item) => item.abrasionPit),
  1
);

const CANONICAL_SOURCE_IDS = [
  'SRC-001',
  'SRC-004',
  'SRC-005',
  'SRC-006',
  'SRC-007',
  'SRC-017',
  'SRC-010',
] as const;

export const MetopenSectionView: React.FC = () => {
  const study = useMemo(
    () => runStudy(demoCharacterization, defaultMix, defaultEconomicControls),
    []
  );

  const qualification = study.science.materialQualification;
  const direct = directPavingEvidence[0];
  const requiredGatesCount = validationRoadmap.filter(
    (item) => item.roadmap_status === 'VALIDATION_REQUIRED'
  ).length;

  return (
    <div className="space-y-8">
      {/* 00 · METODOLOGI UTAMA: Gate first · ranking second */}
      <section className="rounded-2xl bg-emerald-950 text-white p-6 md:p-8 border border-emerald-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <Workflow className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 max-w-3xl">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-300 block">
                METODOLOGI UTAMA
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Gate first · ranking second
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Angka literatur dipakai untuk membentuk ruang kandidat dan
                konteks; status kelayakan tetap menunggu bukti yang sesuai
                dengan material dan produk yang dituju.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {['PROVENANCE', 'CONTEXT', 'VALIDATION'].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold tracking-wider bg-emerald-900/90 text-emerald-200 border border-emerald-700/80"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 01 · DECISION FLOW */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              01 · DECISION FLOW
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Flowchart metodologi SILICA2CON
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Urutan kerja dari identitas material hingga keputusan akhir dan
              pembaruan evidence.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {methodologySteps.map((step, index) => (
            <div
              key={step.no}
              className="relative bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-2 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center">
                    {step.no}
                  </span>
                  {index < methodologySteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                  )}
                </div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                  {step.title}
                </strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 · CURRENT POSITION & 03 · EVIDENCE RULES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 02 · CURRENT POSITION */}
        <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                  02 · CURRENT POSITION (BASELINE DEFAULT)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Posisi studi saat ini
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Status engine baseline default dibaca sebagai kondisi kerja
                  referensi, bukan klaim kepatuhan atau hasil simulasi aktif.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Qualification
                </span>
                <strong className="text-sm font-mono font-extrabold text-slate-900 mt-1 block">
                  {qualification.status ?? 'INSUFFICIENT_DATA'}
                </strong>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Evidence class
                </span>
                <strong className="text-sm font-mono font-extrabold text-slate-900 mt-1 block">
                  {study.state.evidence.evidenceClass ?? 'DATA_REQUIRED'}
                </strong>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Direct benchmark
                </span>
                <strong className="text-sm font-mono font-extrabold text-emerald-700 mt-1 block">
                  {direct ? 'AVAILABLE' : 'DATA_REQUIRED'}
                </strong>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3.5">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Validation roadmap
                </span>
                <strong className="text-sm font-mono font-extrabold text-amber-700 mt-1 block">
                  {requiredGatesCount} GATE
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Literatur dipakai sebagai benchmark/context. Validasi paving block
              tetap harus dilakukan pada konfigurasi target.
            </span>
          </div>
        </section>

        {/* 03 · EVIDENCE RULES */}
        <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                03 · EVIDENCE RULES
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Aturan pembacaan data
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Setiap titik performa harus mempertahankan konteksnya.
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2.5">
            {evidenceRules.map((rule) => (
              <div
                key={rule.no}
                className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {rule.no}
                </span>
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {rule.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 04 · PERFORMANCE EVIDENCE */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              04 · PERFORMANCE EVIDENCE
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Grafik evidence performa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tiga konteks ditampilkan terpisah agar pola tidak disalahartikan
              sebagai satu kurva universal.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Fikroni SRC-017 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  Geodipa waste · paving block
                </strong>
                <span className="text-xs text-slate-500">
                  X: replacement (%) · Y: compressive strength (MPa) · 7 hari
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                SRC-017
              </span>
            </div>

            {fikroni.length > 0 ? (
              <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-52 pt-4 pb-2 px-2 border-l border-b border-slate-200 bg-slate-50/50 rounded-bl-lg">
                {fikroni.map((item) => {
                  const value = item.compressive_strength_7d_mpa ?? 0;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col items-center justify-end h-full gap-1.5"
                    >
                      <span className="text-[11px] font-mono font-bold text-emerald-800 tabular-nums">
                        {value.toFixed(2)}
                      </span>
                      <div className="w-full flex-1 flex items-end justify-center">
                        <div
                          title={`${item.replacement_pct}%: ${value.toFixed(2)} MPa (max ${maxFikroni.toFixed(2)} MPa)`}
                          style={{
                            height: `${Math.max(8, (value / maxFikroni) * 100)}%`,
                          }}
                          className="w-full max-w-[42px] rounded-t-md bg-emerald-600"
                        />
                      </div>
                      <small className="text-[11px] font-mono font-semibold text-slate-600 tabular-nums">
                        {item.replacement_pct}%
                      </small>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                Data performa SRC-017 tidak tersedia.
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              Dalam studi ini titik tertinggi yang dilaporkan berada pada 8%
              replacement, tetapi bukan berarti 8% adalah optimum universal.
            </p>
          </div>

          {/* Card 2: Lopez-Perales SRC-007 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  Geothermal nano-SiO₂ waste · concrete
                </strong>
                <span className="text-xs text-slate-500">
                  X: replacement (%) · Y: compressive strength (MPa) · 28 hari
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                SRC-007
              </span>
            </div>

            {lopez.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 items-end h-52 pt-4 pb-2 px-4 border-l border-b border-slate-200 bg-slate-50/50 rounded-bl-lg">
                  {lopez.map((item) => {
                    const value = item.compressive_strength_28d_mpa ?? 0;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col items-center justify-end h-full gap-1.5"
                      >
                        <span className="text-[11px] font-mono font-bold text-teal-800 tabular-nums">
                          {value.toFixed(2)}
                        </span>
                        <div className="w-full flex-1 flex items-end justify-center">
                          <div
                            title={`${item.replacement_pct}%: ${value.toFixed(2)} MPa (max ${maxLopez.toFixed(2)} MPa)`}
                            style={{
                              height: `${Math.max(8, (value / maxLopez) * 100)}%`,
                            }}
                            className="w-full max-w-[52px] rounded-t-md bg-teal-600"
                          />
                        </div>
                        <small className="text-[11px] font-mono font-semibold text-slate-600 tabular-nums">
                          {item.replacement_pct}%
                        </small>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {lopez.map((item) => (
                    <span
                      key={item.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700"
                    >
                      {item.replacement_pct}% → {item.slump_mm ?? '—'} mm
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                Data performa SRC-007 tidak tersedia.
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              Kenaikan kuat tekan pada studi tersebut berjalan bersama penurunan
              slump; keputusan tidak cukup memakai satu metrik.
            </p>
          </div>
        </div>
      </section>

      {/* 05 · DURABILITY BENCHMARK */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              05 · DURABILITY BENCHMARK
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Water absorption &amp; abrasion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Benchmark paving block lintas-material untuk menunjukkan metrik
              durability yang perlu masuk ke technical gate SILICA2CON.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WATER ABSORPTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  Water absorption
                </strong>
                <span className="text-xs text-slate-500">
                  X: mix system · Y: water absorption (wt.%) · 28 hari
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                SRC-DUR-01
              </span>
            </div>

            <div className="grid grid-cols-[28px_1fr] gap-2 h-[205px] pt-3">
              <div className="flex flex-col justify-between pb-[26px] text-[10px] font-mono font-bold text-slate-400 text-right">
                <span>6%</span>
                <span>4%</span>
                <span>2%</span>
                <span>0%</span>
              </div>

              <div className="relative grid grid-cols-4 gap-3 items-end pb-[26px] px-3 border-l border-b border-slate-200 bg-slate-50/50 rounded-bl-lg">
                <div
                  title="Batas referensi studi ≤6.0% (GB/T 28635-2012)"
                  style={{
                    bottom: `${Math.min(165, (6 / maxWaterAbsorption) * 150) + 26}px`,
                  }}
                  className="absolute left-0 right-0 border-t border-dashed border-slate-400 pointer-events-none"
                />
                {durabilityBenchmark.map((item) => (
                  <div
                    key={item.mix}
                    className="flex flex-col items-center justify-end h-[170px] gap-1.5"
                  >
                    <strong className="text-[11px] font-mono font-bold text-emerald-800 tabular-nums">
                      {item.waterAbsorption.toFixed(1)}%
                    </strong>
                    <div
                      title={`${item.mix}: ${item.waterAbsorption.toFixed(1)}% (max ${maxWaterAbsorption.toFixed(1)}%)`}
                      style={{
                        height: `${Math.max(
                          12,
                          (item.waterAbsorption / maxWaterAbsorption) * 150
                        )}px`,
                      }}
                      className="w-full max-w-[42px] rounded-t-md bg-emerald-700"
                    />
                    <small className="text-[10px] font-mono font-bold text-slate-500">
                      {item.mix}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Reference study reported 5.3 → 4.1 wt.%. Garis putus-putus
              menunjukkan batas studi ≤6.0% dari GB/T 28635-2012, bukan batas
              SNI Indonesia.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="font-bold text-emerald-950 block">
                Source
              </strong>
              <span className="text-slate-600 mt-0.5 block">
                Han et al. (2026), Coatings 16(5), 541 · DOI:
                10.3390/coatings16050541
              </span>
            </div>
          </div>

          {/* ABRASION RESISTANCE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-sm font-bold text-slate-900 block">
                  Abrasion resistance
                </strong>
                <span className="text-xs text-slate-500">
                  X: mix system · Y: abrasion pit length (mm) · 28 hari
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                SRC-DUR-02
              </span>
            </div>

            <div className="grid grid-cols-[28px_1fr] gap-2 h-[205px] pt-3">
              <div className="flex flex-col justify-between pb-[26px] text-[10px] font-mono font-bold text-slate-400 text-right">
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              <div className="relative grid grid-cols-4 gap-3 items-end pb-[26px] px-3 border-l border-b border-slate-200 bg-slate-50/50 rounded-bl-lg">
                {durabilityBenchmark.map((item) => (
                  <div
                    key={item.mix}
                    className="flex flex-col items-center justify-end h-[170px] gap-1.5"
                  >
                    <strong className="text-[11px] font-mono font-bold text-amber-800 tabular-nums">
                      {item.abrasionPit.toFixed(1)}
                    </strong>
                    <div
                      title={`${item.mix}: ${item.abrasionPit.toFixed(1)} mm (max ${maxAbrasionPit.toFixed(1)} mm)`}
                      style={{
                        height: `${Math.max(
                          12,
                          (item.abrasionPit / maxAbrasionPit) * 150
                        )}px`,
                      }}
                      className="w-full max-w-[42px] rounded-t-md bg-amber-600"
                    />
                    <small className="text-[10px] font-mono font-bold text-slate-500">
                      {item.mix}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Abrasion pit length turun 29.2 → 24.7 mm; nilai yang lebih kecil
              menunjukkan ketahanan aus yang lebih baik. Reference limit studi
              ≤30.0 mm dari GB/T 28635-2012.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="font-bold text-emerald-950 block">
                Source
              </strong>
              <span className="text-slate-600 mt-0.5 block">
                Han et al. (2026), Coatings 16(5), 541 · DOI:
                10.3390/coatings16050541
              </span>
            </div>
          </div>
        </div>

        {/* Cross-domain disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
          <strong className="font-bold text-amber-900">
            Cara membaca benchmark:
          </strong>{' '}
          data ini dipakai sebagai contoh struktur evidence untuk parameter
          durability paving block. Material pada sumber adalah asphalt mixing
          plant dust, bukan geothermal residue, sehingga tidak boleh dibaca
          sebagai performa SILICA2CON atau digabungkan dengan kurva geothermal.
        </div>
      </section>

      {/* 06 · EVIDENCE MATRIX */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              06 · EVIDENCE MATRIX
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Tabel perbandingan evidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Basis data dipertahankan agar pengguna dapat melihat jarak antara
              benchmark langsung dan evidence terkait.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Table2 className="w-4 h-4" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Studi</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Replacement</th>
                <th className="py-3 px-4">Performa</th>
                <th className="py-3 px-4">Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4">
                  <strong className="font-bold text-slate-900 block">
                    Fikroni et al. (2023)
                  </strong>
                  <small className="font-mono text-[11px] text-slate-500">
                    SRC-017
                  </small>
                </td>
                <td className="py-3.5 px-4">Geodipa waste</td>
                <td className="py-3.5 px-4">Paving block</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">0–12%</span>
                  <br />
                  <small className="font-mono text-[10px] text-slate-500">
                    CEMENT MASS
                  </small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    11.33–16.13 MPa
                  </span>
                  <br />
                  <small className="text-[11px] text-slate-500">7 hari</small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    DIRECT BENCHMARK
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4">
                  <strong className="font-bold text-slate-900 block">
                    López-Perales et al. (2024)
                  </strong>
                  <small className="font-mono text-[11px] text-slate-500">
                    SRC-007
                  </small>
                </td>
                <td className="py-3.5 px-4">Geothermal nano-SiO₂ waste</td>
                <td className="py-3.5 px-4">Concrete</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    0 / 20 / 30%
                  </span>
                  <br />
                  <small className="font-mono text-[10px] text-slate-500">
                    BASIS: STUDY-SPECIFIC
                  </small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    23.03 / 25.42 / 28.23 MPa
                  </span>
                  <br />
                  <small className="text-[11px] text-slate-500">28 hari</small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    RELATED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4">
                  <strong className="font-bold text-slate-900 block">
                    Meiyati et al. (2015)
                  </strong>
                  <small className="font-mono text-[11px] text-slate-500">
                    SRC-006
                  </small>
                </td>
                <td className="py-3.5 px-4">Geothermal sludge</td>
                <td className="py-3.5 px-4">Mortar</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">20%</span>
                  <br />
                  <small className="font-mono text-[10px] text-slate-500">
                    CEMENT MASS
                  </small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    27.093 kgf/cm²
                  </span>
                  <br />
                  <small className="text-[11px] text-slate-500">28 hari</small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    RELATED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4">
                  <strong className="font-bold text-slate-900 block">
                    Han et al. (2026)
                  </strong>
                  <small className="font-mono text-[11px] text-slate-500">
                    SRC-DUR-01/02
                  </small>
                </td>
                <td className="py-3.5 px-4">Asphalt mixing plant dust</td>
                <td className="py-3.5 px-4">Alkali-activated paving block</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    Mix-system specific
                  </span>
                  <br />
                  <small className="font-mono text-[10px] text-slate-500">
                    REPLACEMENT BY MASS
                  </small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900">
                    4.1–5.3 wt.% absorption
                  </span>
                  <br />
                  <small className="text-[11px] text-slate-500">
                    24.7–29.2 mm abrasion pit · 28 hari
                  </small>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    DURABILITY CONTEXT
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 07 · SOURCE REGISTRY */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              07 · SOURCE REGISTRY
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Sumber utama yang membentuk metodologi
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Referensi ditampilkan sebagai provenance registry; verifikasi dan
              konteks tetap melekat pada penggunaannya.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANONICAL_SOURCE_IDS.map((id) => {
            const source = sourceById(id);
            if (!source) return null;

            const hasValidDoi = Boolean(
              source.doi && source.doi.trim() !== '' && source.doi !== '—'
            );

            return (
              <article
                key={id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      {source.id}
                    </span>
                    <span className="text-slate-500 font-semibold">
                      {source.year}
                    </span>
                  </div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug pt-1">
                    {source.title}
                  </strong>
                  <p className="text-xs text-slate-600">{source.authors}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <small className="text-[11px] text-slate-500 italic block">
                    {source.journal ?? source.type}
                  </small>
                  {hasValidDoi && (
                    <code className="text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block break-all">
                      {source.doi}
                    </code>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Cross-domain durability source kept separate from master registry */}
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-4 sm:p-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
              CROSS-DOMAIN DURABILITY SOURCE
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              SRC-DUR-01/02
            </span>
          </div>
          <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
            Han, Y., Jia, Z., Yang, X., &amp; Jiang, X. (2026)
          </strong>
          <p className="text-xs text-slate-600 leading-relaxed">
            “Graded Utilization of Asphalt Mixing Plant Dust in Alkali-Activated
            Concrete Paving Blocks: Mechanical Performance and Sustainability
            Assessment.” Coatings, 16(5), 541.
          </p>
          <code className="text-[11px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
            DOI 10.3390/coatings16050541
          </code>
        </div>
      </section>

      {/* 08 · VALIDATION ROADMAP */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              08 · VALIDATION ROADMAP
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Bagaimana evidence berubah menjadi data validasi?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Literatur membentuk hipotesis dan kandidat; eksperimen mengisi
              evidence yang masih kosong.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {validationRoadmap.map((item) => {
            const isRequired = item.roadmap_status === 'VALIDATION_REQUIRED';

            return (
              <div
                key={item.phase}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                  isRequired
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                        isRequired
                          ? 'bg-amber-200/80 text-amber-950'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String(item.phase).padStart(2, '0')}
                    </span>
                  </div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                    {item.name}
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.required_outputs.join(' · ')}
                  </p>
                </div>

                <em
                  className={`not-italic text-[10px] font-mono font-bold px-2 py-1 rounded border self-start ${
                    isRequired
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.roadmap_status}
                </em>
              </div>
            );
          })}
        </div>
      </section>

      {/* METHODOLOGY FOOTNOTE */}
      <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
        Catatan: benchmark Fikroni, López-Perales, dan Meiyati tetap dipisahkan
        berdasarkan material, produk, basis replacement, dan kondisi uji.
        Benchmark Han et al. (2026) hanya digunakan sebagai contoh evidence
        durability lintas-material, bukan sebagai bukti geothermal.
      </p>
    </div>
  );
};
