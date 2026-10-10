import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Scale,
  Layers,
  BookOpen,
  ClipboardCheck,
  Activity,
} from 'lucide-react';
import type {
  StudyResult,
  Characterization,
  MixControls,
} from '../../engine/study';
import { sniRequirements, sourceById } from '../../engine/data/master';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface TechnicalGateStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  studyMode: 'demo' | 'actual';
  onUpdateMixField: <K extends keyof MixControls>(
    field: K,
    value: MixControls[K]
  ) => void;
  onSelectStage: (stageId: SimulationStageId) => void;
  displayDecision: (decision: string) => string;
  evidenceLabel: (value: string | null | undefined) => string;
}

const ToneBadge: React.FC<{
  tone: 'emerald' | 'amber' | 'rose' | 'slate' | 'blue';
  children: React.ReactNode;
}> = ({ tone, children }) => {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${styles[tone]}`}
    >
      {children}
    </span>
  );
};

function getSniStatusMeta(status: string): {
  label: string;
  tone: 'emerald' | 'amber' | 'rose' | 'slate';
  description: string;
} {
  switch (status) {
    case 'PRELIMINARY_PASS':
      return {
        label: 'PRELIMINARY_PASS · Lulus Komparasi Kuantitatif Awal',
        tone: 'emerald',
        description:
          'Nilai terukur aktual pada parameter yang dievaluasi memenuhi ambang batas kuantitatif SNI 03-0691-1996 (tetap wajib memverifikasi metode uji dan replikasi laboratorium).',
      };
    case 'PRELIMINARY_FAIL':
      return {
        label: 'PRELIMINARY_FAIL · Tidak Memenuhi Ambang Batas SNI',
        tone: 'rose',
        description:
          'Satu atau lebih parameter terukur aktual berada di luar syarat ambang batas kelas mutu SNI 03-0691-1996 yang ditargetkan.',
      };
    case 'DATA_REQUIRED':
      return {
        label: 'DATA_REQUIRED · Menunggu Data Uji Laboratorium Aktual',
        tone: 'amber',
        description:
          'Evaluasi kepatuhan SNI 03-0691-1996 memerlukan hasil pengujian fisik dan mekanik aktual (kuat tekan rata-rata/minimum, penyerapan air, dan ketahanan aus). Nilai belum tersedia pada sesi ini.',
      };
    case 'NOT_APPLICABLE':
    case 'UNKNOWN':
    default:
      return {
        label: `${status || 'UNKNOWN'} · Klasifikasi Belum Ditemukan`,
        tone: 'slate',
        description:
          'Klasifikasi mutu target belum ditemukan pada basis data SNI 03-0691-1996 atau belum dapat dievaluasi.',
      };
  }
}

function getDecisionTone(
  decisionLabel: string,
): 'emerald' | 'amber' | 'rose' | 'slate' {
  if (decisionLabel === 'Direkomendasikan') return 'emerald';
  if (decisionLabel === 'Tidak Direkomendasikan') return 'rose';
  if (decisionLabel === 'Data Tidak Mencukupi') return 'slate';
  return 'amber';
}

function translateParameterName(param: string): {
  title: string;
  subtitle: string;
} {
  switch (param) {
    case 'Compressive strength — average':
      return {
        title: 'Kuat Tekan Rata-rata (Compressive strength — average)',
        subtitle: 'Nilai kuat tekan rata-rata dari benda uji paving block (MPa)',
      };
    case 'Compressive strength — minimum':
      return {
        title: 'Kuat Tekan Minimum Individu (Compressive strength — minimum)',
        subtitle: 'Batas terendah kuat tekan pada masing-masing spesimen uji (MPa)',
      };
    case 'Water absorption':
      return {
        title: 'Penyerapan Air Rata-rata Maksimum (Water absorption)',
        subtitle: 'Persentase serapan air rata-rata terhadap massa kering (%)',
      };
    case 'Abrasion — average':
      return {
        title: 'Ketahanan Aus Rata-rata (Abrasion — average)',
        subtitle: 'Kehilangan tebal akibat aus rata-rata maksimum (mm/menit)',
      };
    case 'Abrasion — maximum':
      return {
        title: 'Ketahanan Aus Maksimum Individu (Abrasion — maximum)',
        subtitle: 'Kehilangan tebal akibat aus maksimum per spesimen (mm/menit)',
      };
    default:
      return {
        title: param,
        subtitle: 'Parameter pengujian kuantitatif SNI 03-0691-1996',
      };
  }
}

export const TechnicalGateStageView: React.FC<TechnicalGateStageViewProps> = ({
  study,
  characterization,
  mix,
  studyMode,
  onUpdateMixField,
  onSelectStage,
  displayDecision,
  evidenceLabel,
}) => {
  const sni = study.state.sni;
  const decisionResult = study.state.decision;
  const validationSteps = study.state.validation;
  const qualification = study.science.materialQualification;
  const candidateEvidence = study.state.evidence;

  const sniStatusMeta = getSniStatusMeta(sni.status);
  const decisionBadgeText = displayDecision(decisionResult.decision);
  const decisionTone = getDecisionTone(decisionBadgeText);

  const sniSource = sourceById(sni.sourceId);
  const matchedClassRecord = sniRequirements.classification.find(
    (item) => item.class === sni.className,
  );
  const allSniClasses = sniRequirements.classification;

  // Unmodeled SNI requirements directly from canonical master.json sni_requirements
  const unmodeledRequirements = [
    {
      id: 'appearance',
      title: '1. Sifat Tampak & Cacat Visual (Appearance)',
      requirementText: sniRequirements.appearance,
      statusLabel: evidenceLabel(sniRequirements.verification_status),
      description:
        'Permukaan bidang harus rata, tidak terdapat retak-retak dan cacat, serta bagian sudut dan rusuknya tidak mudah direpihkan dengan kekuatan jari tangan.',
    },
    {
      id: 'nominal_thickness',
      title: '2. Ukuran & Toleransi Ketebalan Nominal',
      requirementText: `Tebal nominal ≥ ${sniRequirements.nominal_thickness_min_mm} mm · Toleransi ≤ ±${sniRequirements.thickness_tolerance_plus_pct}%`,
      statusLabel: evidenceLabel(sniRequirements.verification_status),
      description: `Dimensi blok pada konfigurasi formulasi saat ini adalah ${mix.blockLengthMm} × ${mix.blockWidthMm} × ${mix.blockThicknessMm} mm. Toleransi penyimpangan ukuran fisik antar benda uji wajib diverifikasi pada cetakan aktual.`,
    },
    {
      id: 'sodium_sulfate',
      title: '3. Ketahanan Natrium Sulfat (Sodium Sulfate Resistance)',
      requirementText: sniRequirements.sodium_sulfate_test_required
        ? `Wajib Uji · Kehilangan berat maks. ≤ ${sniRequirements.sodium_sulfate_weight_loss_max_pct}%`
        : 'Opsional',
      statusLabel: evidenceLabel(sniRequirements.test_method_status),
      description:
        'Bata beton apabila diuji ketahanan natrium sulfat tidak boleh cacat, dan kehilangan berat yang diperkenankan maksimum 1%. Parameter ini belum dievaluasi oleh fungsi checkSNI.',
    },
    {
      id: 'sampling_and_method',
      title: '4. Tata Cara Pengambilan Contoh & Metode Uji',
      requirementText: `Sampling: ${sniRequirements.sampling_status} · Metode: ${sniRequirements.test_method_status}`,
      statusLabel: evidenceLabel(sniRequirements.sampling_status),
      description:
        'Jumlah benda uji, pemilihan sampel acak per lot produksi, serta prosedur pembebanan harus mengikuti ketentuan standar SNI 03-0691-1996 di laboratorium terakreditasi.',
    },
  ];

  return (
    <div
      data-testid="technical-gate-stage-view"
      className="space-y-6 text-slate-800"
    >
      {/* SECTION A: Context and Target Classification */}
      <section
        aria-label="Konteks Evaluasi dan Target Klasifikasi Mutu SNI"
        className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Konteks Evaluasi Gerbang Teknis ({sni.standardId})
              </span>
              <ToneBadge tone={studyMode === 'actual' ? 'emerald' : 'blue'}>
                Mode: {studyMode === 'actual' ? 'Riset / Aktual' : 'Demo Studi'}
              </ToneBadge>
              <ToneBadge tone="slate">
                Bukti Kandidat: {evidenceLabel(candidateEvidence.status)}
              </ToneBadge>
            </div>
            <p className="text-xs text-slate-600">
              Gerbang Teknis mengevaluasi pemenuhan syarat mutu bata beton (paving block) berdasarkan kontrak kanonik{' '}
              <code className="font-mono text-[11px] bg-slate-200/70 px-1.5 py-0.5 rounded">
                study.state.sni
              </code>{' '}
              dan memisahkannya secara tegas dari status kesiapan keputusan riset.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={sniStatusMeta.tone}>
              Status SNI: {evidenceLabel(sni.status)} ({sni.status})
            </ToneBadge>
            <ToneBadge tone={decisionTone}>
              Keputusan DSS: {decisionBadgeText}
            </ToneBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white border border-slate-200/90 p-3 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Identitas Batch & Material
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {characterization.batch || 'Batch Belum Diisi'} ·{' '}
              {characterization.sample || 'Sampel Belum Diisi'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {characterization.source || 'Sumber material belum diisi'} (
              {characterization.materialId || 'Tanpa ID'})
            </p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200/90 p-3 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Target Klasifikasi SNI Aktif
            </span>
            <p className="text-xs sm:text-sm font-bold text-emerald-900">
              Mutu Kelas {sni.className || mix.targetClass} ({sni.standardId})
            </p>
            <p className="text-[11px] text-slate-500">
              Peruntukan:{' '}
              <span className="font-semibold text-slate-700">
                {matchedClassRecord?.intended_use || 'Tidak tersedia pada basis data'}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200/90 p-3 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Kandidat Formulasi Aktif
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Substitusi {mix.substitution}% · W/B {mix.waterRatio.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500">
              Target Partikel: {mix.particleSize} µm · Dimensi:{' '}
              {mix.blockLengthMm}×{mix.blockWidthMm}×{mix.blockThicknessMm} mm
            </p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200/90 p-3 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Kualifikasi Tahap 02
            </span>
            <div className="flex items-center gap-1.5">
              <ToneBadge
                tone={
                  qualification.status === 'QUALIFIED'
                    ? 'emerald'
                    : qualification.status === 'CONDITIONAL'
                      ? 'amber'
                      : 'rose'
                }
              >
                {qualification.status}
              </ToneBadge>
              <span className="text-xs font-bold text-slate-700">
                ({qualification.completeness}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {qualification.missing.length === 0
                ? 'Parameter karakterisasi lengkap'
                : `Belum lengkap: ${qualification.missing.length} parameter`}
            </p>
          </div>
        </div>

        {/* Reference Table & Interactive Selector of All 4 SNI Classes (A, B, C, D) from Master Registry */}
        <div className="rounded-xl bg-white border border-slate-200/90 p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Pilih Target Klasifikasi Mutu {sniRequirements.standard_id} (Basis Data Kanonik)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Target aktif pada state kanonik:{' '}
                <strong>Kelas {sni.className || mix.targetClass}</strong> (
                {matchedClassRecord?.intended_use || 'pejalan kaki'})
              </span>
            </div>

            <div
              role="group"
              aria-label="Pemilih Kelas Mutu SNI"
              className="flex flex-wrap items-center gap-1.5"
            >
              {allSniClasses.map((cls) => {
                const targetClassValue = cls.class as MixControls['targetClass'];
                const isSelected =
                  (sni.className || mix.targetClass) === targetClassValue;
                return (
                  <button
                    key={cls.class}
                    type="button"
                    onClick={() =>
                      onUpdateMixField('targetClass', targetClassValue)
                    }
                    aria-pressed={isSelected}
                    data-testid={`select-sni-class-${cls.class}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900'
                    }`}
                  >
                    Mutu {cls.class}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-1.5 px-2.5">Kelas Mutu</th>
                  <th className="py-1.5 px-2.5">Peruntukan Utama</th>
                  <th className="py-1.5 px-2.5">Kuat Tekan Rata-rata</th>
                  <th className="py-1.5 px-2.5">Kuat Tekan Min.</th>
                  <th className="py-1.5 px-2.5">Aus Rata-rata Maks.</th>
                  <th className="py-1.5 px-2.5">Aus Maks. Individu</th>
                  <th className="py-1.5 px-2.5">Serapan Air Maks.</th>
                  <th className="py-1.5 px-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allSniClasses.map((cls) => {
                  const targetClassValue = cls.class as MixControls['targetClass'];
                  const isActiveClass =
                    (sni.className || mix.targetClass) === targetClassValue;
                  return (
                    <tr
                      key={cls.class}
                      className={
                        isActiveClass
                          ? 'bg-emerald-50/80 font-semibold text-emerald-950'
                          : 'text-slate-600'
                      }
                    >
                      <td className="py-1.5 px-2.5 font-mono">
                        Mutu {cls.class}{' '}
                        {isActiveClass && (
                          <span className="ml-1 inline-block px-1.5 py-0.2 rounded bg-emerald-700 text-white text-[10px]">
                            Target Aktif
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-2.5">{cls.intended_use}</td>
                      <td className="py-1.5 px-2.5 font-mono">
                        ≥ {cls.compressive_strength_avg_mpa} MPa
                      </td>
                      <td className="py-1.5 px-2.5 font-mono">
                        ≥ {cls.compressive_strength_min_mpa} MPa
                      </td>
                      <td className="py-1.5 px-2.5 font-mono">
                        ≤ {cls.abrasion_avg_max_mm_min} mm/mnt
                      </td>
                      <td className="py-1.5 px-2.5 font-mono">
                        ≤ {cls.abrasion_min_or_equivalent_max_mm_min} mm/mnt
                      </td>
                      <td className="py-1.5 px-2.5 font-mono">
                        ≤ {cls.water_absorption_avg_max_pct}%
                      </td>
                      <td className="py-1.5 px-2.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateMixField('targetClass', targetClassValue)
                          }
                          disabled={isActiveClass}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            isActiveClass
                              ? 'bg-emerald-100 text-emerald-900 cursor-default'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 cursor-pointer'
                          }`}
                        >
                          {isActiveClass ? 'Aktif' : `Gunakan Kelas ${cls.class}`}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION B: Canonical SNI Gate Status & Quantitative Evaluation */}
      <section
        aria-label="Evaluasi Kuantitatif Gerbang Teknis SNI"
        className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Evaluasi Parameter Kuantitatif {sni.standardId} — Kelas Mutu {sni.className}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Menampilkan 5 parameter kuantitatif yang dievaluasi oleh fungsi kanonik{' '}
              <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">
                checkSNI
              </code>{' '}
              pada{' '}
              <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">
                study.state.sni.details
              </code>
              .
            </p>
          </div>
          <ToneBadge tone={sniStatusMeta.tone}>{sniStatusMeta.label}</ToneBadge>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 ${
            sni.status === 'PRELIMINARY_PASS'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : sni.status === 'PRELIMINARY_FAIL'
                ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          {sni.status === 'PRELIMINARY_PASS' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : sni.status === 'PRELIMINARY_FAIL' ? (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1.5 text-xs">
            <p className="font-bold text-sm">{sniStatusMeta.label}</p>
            <p className="leading-relaxed opacity-90">{sniStatusMeta.description}</p>
            <p className="text-[11px] font-medium pt-0.5">
              Aturan Kepatuhan Kanonik (<code className="font-mono">sni_requirements.compliance_rule</code>):{' '}
              <span className="italic">{sniRequirements.compliance_rule}</span>
            </p>
          </div>
        </div>

        {/* Quantitative Comparison Table from study.state.sni.details */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Parameter Pengujian ({sni.standardId})</th>
                <th className="py-3 px-4">Syarat Mutu {sni.className}</th>
                <th className="py-3 px-4">Nilai Aktual Terukur</th>
                <th className="py-3 px-4">Hasil Evaluasi</th>
                <th className="py-3 px-4">Catatan Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sni.details.length > 0 ? (
                sni.details.map((row) => {
                  const translated = translateParameterName(row.parameter);
                  const hasActual =
                    typeof row.actual === 'number' && Number.isFinite(row.actual);

                  return (
                    <tr key={row.parameter} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {translated.title}
                        <span className="block text-[11px] font-normal text-slate-500">
                          {translated.subtitle}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {row.requirement}
                      </td>
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {hasActual ? (
                          <span className="font-bold text-slate-900">
                            {row.actual?.toLocaleString('id-ID', {
                              maximumFractionDigits: 3,
                            })}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold">
                            DATA_REQUIRED (null)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {row.result === 'PRELIMINARY_PASS' ? (
                          <ToneBadge tone="emerald">
                            {evidenceLabel(row.result)} ({row.result})
                          </ToneBadge>
                        ) : row.result === 'PRELIMINARY_FAIL' ? (
                          <ToneBadge tone="rose">
                            {evidenceLabel(row.result)} ({row.result})
                          </ToneBadge>
                        ) : (
                          <ToneBadge tone="amber">
                            {evidenceLabel(row.result)} ({row.result})
                          </ToneBadge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {row.validation}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-4 text-center text-slate-500 font-medium"
                  >
                    Rincian parameter tidak tersedia untuk kelas mutu &ldquo;{sni.className}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Separation Notice from Literature Data */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
          <BookOpen className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">
              Pemisahan Tegas: Nilai Literatur Eksternal vs Hasil Uji Aktual SNI
            </p>
            <p className="leading-relaxed text-slate-600">
              Pada kandidat aktif (substitusi {mix.substitution}%), status bukti literatur adalah{' '}
              <code className="font-mono text-[11px] bg-slate-200/80 px-1 py-0.5 rounded">
                {candidateEvidence.status}
              </code>
              . Nilai kuat tekan dari publikasi literatur eksternal (SRC-017) hanya disajikan sebagai jangkar referensi pada Tahap 04 dan{' '}
              <strong>tidak pernah diumpankan secara otomatis</strong> ke parameter{' '}
              <code className="font-mono text-[11px] bg-slate-200/80 px-1 py-0.5 rounded">
                actualSNI
              </code>{' '}
              untuk mengklaim kelulusan SNI 03-0691-1996.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C: Unmodeled SNI Requirements Disclosure */}
      <section
        aria-label="Persyaratan SNI 03-0691-1996 Lainnya yang Belum Dimodelkan"
        className="rounded-xl sm:rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-amber-950">
                Keterbukaan Cakupan: Klausul {sniRequirements.standard_id} di Luar Evaluasi Numerik Otomatis
              </h2>
            </div>
            <p className="text-xs text-amber-900/80">
              Selain 5 parameter mekanik dan fisis pada tabel di atas, standar {sniRequirements.standard_id} memiliki klausul kelayakan fisik, dimensi, dan kimia berikut pada{' '}
              <code className="font-mono text-[11px]">sni_requirements</code> yang belum dievaluasi oleh fungsi <code className="font-mono text-[11px]">checkSNI</code>:
            </p>
          </div>
          <ToneBadge tone="amber">Wajib Verifikasi Fisik / Lab</ToneBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {unmodeledRequirements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white border border-amber-200/90 p-3.5 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900">{item.title}</span>
                <ToneBadge tone="slate">{item.statusLabel}</ToneBadge>
              </div>
              <p className="font-mono text-[11px] font-semibold text-amber-900 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60">
                Syarat: {item.requirementText}
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION D: Supporting SNI Reference Evidence */}
      <section
        aria-label="Bukti Referensi Standar SNI"
        className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Basis Bukti & Provenance Standar ({sni.sourceId})
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Disediakan oleh kontrak kanonik{' '}
              <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">
                study.state.sni
              </code>{' '}
              dan registri sumber{' '}
              <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">
                sni_requirements
              </code>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <ToneBadge tone="emerald">
              Standar: {sni.standardId}
            </ToneBadge>
            <ToneBadge tone="blue">
              Sumber: {sni.sourceId} ({sniRequirements.status})
            </ToneBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2 rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {sniSource?.title || `${sniRequirements.standard_id}: Bata Beton (Paving Block)`}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                ID Sumber: {sni.sourceId} · Tahun: {sniSource?.year ?? sniRequirements.edition_year}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Standar Nasional Indonesia ({sniRequirements.standard_id}) digunakan sebagai tolok ukur gerbang teknis untuk mengevaluasi mutu bata beton (paving block) berdasarkan klasifikasi peruntukan Kelas A, B, C, dan D.
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-600">
              {sniSource?.authors && (
                <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                  Penerbit / Otoritas: <strong>{sniSource.authors}</strong>
                </span>
              )}
              {typeof sniSource?.type === 'string' && (
                <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                  Tipe Sumber: <strong>{sniSource.type}</strong>
                </span>
              )}
              {typeof sniSource?.verification_status === 'string' && (
                <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                  Status Verifikasi Sumber:{' '}
                  <strong>{sniSource.verification_status}</strong>
                </span>
              )}
              <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                Konteks Domain:{' '}
                <strong>
                  {sniSource?.context || sniRequirements.applicability}
                </strong>
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-4 space-y-2">
            <span className="font-bold text-amber-950 block">
              Aturan Provenance & Bukti ({study.evidence.summary.dominantGrade}):
            </span>
            <ul className="list-disc list-inside space-y-1.5 text-amber-900 leading-relaxed">
              {study.evidence.decisionRules.slice(0, 3).map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION E: Separation Between Decision Readiness and SNI Compliance */}
      <section
        aria-label="Pemisahan Keputusan Kesiapan Riset dan Kepatuhan SNI"
        className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Pemisahan Status Keputusan Riset vs Kepatuhan SNI 03-0691-1996
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Menyandingkan evaluasi keputusan riset (<code className="font-mono text-[11px]">study.state.decision</code>) dengan status gerbang SNI (<code className="font-mono text-[11px]">study.state.sni</code>) dan protokol validasi (<code className="font-mono text-[11px]">study.state.validation</code>).
            </p>
          </div>
          <ToneBadge tone={decisionTone}>
            {decisionBadgeText} ({decisionResult.decision})
          </ToneBadge>
        </div>

        {/* Dual Status Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Research Decision Status */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Status Keputusan Riset (DSS)
              </span>
              <ToneBadge tone={decisionTone}>
                {decisionResult.decision}
              </ToneBadge>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {decisionBadgeText}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {decisionResult.reasons[0] ||
                'Keputusan riset mengevaluasi kesiapan kandidat untuk masuk ke tahap pengujian laboratorium.'}
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px]">
              <span className="bg-white border border-slate-200 px-2 py-1 rounded">
                Keyakinan Bukti: <strong>{decisionResult.evidence.confidence}</strong>
              </span>
              <span className="bg-white border border-slate-200 px-2 py-1 rounded">
                Status Bukti Kandidat:{' '}
                <strong>{evidenceLabel(decisionResult.evidence.status)}</strong>
              </span>
            </div>
          </div>

          {/* Card 2: SNI Technical Gate Status */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Status Kepatuhan Gerbang Teknis SNI
              </span>
              <ToneBadge tone={sniStatusMeta.tone}>{sni.status}</ToneBadge>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {sniStatusMeta.label}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {sni.status === 'PRELIMINARY_PASS'
                ? 'Kandidat telah memiliki data uji terukur yang melampaui ambang batas kuantitatif SNI 03-0691-1996.'
                : 'Status kesiapan riset (mis. Bersyarat / Siap Uji Laboratorium) TIDAK berarti produk telah lulus SNI 03-0691-1996. Kelulusan SNI hanya diberikan setelah pengujian fisik benda uji aktual dilakukan.'}
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px]">
              <span className="bg-white border border-slate-200 px-2 py-1 rounded">
                Status Gerbang Teknis DSS:{' '}
                <strong>
                  {sni.status === 'PRELIMINARY_PASS'
                    ? 'Lulus Komparasi Kuantitatif Awal (PRELIMINARY_PASS)'
                    : sni.status === 'PRELIMINARY_FAIL'
                      ? 'Tidak Memenuhi Ambang Batas (PRELIMINARY_FAIL)'
                      : sni.status === 'DATA_REQUIRED'
                        ? 'Belum Dapat Dipastikan — Menunggu Data Uji Aktual (DATA_REQUIRED)'
                        : `Belum Dapat Dipastikan (${sni.status || 'UNKNOWN'})`}
                </strong>
              </span>
              <span className="bg-white border border-slate-200 px-2 py-1 rounded">
                Target Mutu: <strong>Kelas {sni.className}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Reasons, Warnings, Trace, and Validation Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Rationale, Trace & Warnings */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              Rasionalitas, Jejak Evaluasi & Peringatan Keputusan
            </h3>
            {decisionResult.reasons.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Alasan Keputusan Utama:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                  {decisionResult.reasons.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {decisionResult.trace.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Jejak Audit Keputusan (Trace):
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
                  {decisionResult.trace.map((tr) => (
                    <li key={tr}>{tr}</li>
                  ))}
                </ul>
              </div>
            )}
            {decisionResult.warnings.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-amber-700 uppercase">
                  Peringatan Aktif:
                </span>
                <ul className="list-disc list-inside space-y-1 text-amber-800 leading-relaxed">
                  {decisionResult.warnings.map((warn) => (
                    <li key={warn}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Validation Roadmap Protocol */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              Peta Jalan Validasi Laboratorium Wajib (study.state.validation)
            </h3>
            <div className="space-y-2">
              {validationSteps.map((stepItem, index) => (
                <div
                  key={stepItem.parameter}
                  className="rounded-lg bg-slate-50 border border-slate-200/80 p-2.5 space-y-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      {index + 1}. {stepItem.parameter}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ToneBadge
                        tone={stepItem.priority === 'CRITICAL' ? 'rose' : 'amber'}
                      >
                        Prioritas: {stepItem.priority}
                      </ToneBadge>
                      <ToneBadge tone="slate">
                        {evidenceLabel(stepItem.status)}
                      </ToneBadge>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {stepItem.why}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    <strong>Output Wajib:</strong> {stepItem.test} ·{' '}
                    <span className="text-slate-500">
                      Metode: {stepItem.method}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: Stage Navigation */}
      <section
        aria-label="Navigasi Tahap Gerbang Teknis"
        className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
      >
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800">
            Navigasi Alur Kerja Evaluasi
          </p>
          <p className="text-[11px] text-slate-500">
            Pintasan ke Karakterisasi (Tahap 02), Formulasi (Tahap 03), Analisis Kandidat (Tahap 04), atau lanjut ke Keekonomian (Tahap 06).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectStage('characterization')}
            data-testid="gate-shortcut-characterization-btn"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Ke Tahap 02: Karakterisasi</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('formulation')}
            data-testid="gate-shortcut-formulation-btn"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Ke Tahap 03: Formulasi</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('simulation')}
            data-testid="gate-back-to-simulation-btn"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Kembali ke Tahap 04: Analisis Kandidat</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('economics')}
            data-testid="gate-continue-to-economics-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
          >
            <span>Lanjut ke Tahap 06: Keekonomian</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </section>
    </div>
  );
};
