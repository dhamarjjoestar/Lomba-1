import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers3,
  ShieldCheck,
  TestTube2,
  FlaskConical,
  FileCheck2,
} from 'lucide-react';
import type {
  Characterization,
  DemoDatasetId,
  MixControls,
  StudyResult,
} from '../../engine/study';
import type {
  SimulationStageId,
  SimulationStageMeta,
} from '../../models/simulationWorkspace.model';

export interface OverviewStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  studyMode: 'demo' | 'actual';
  datasetId: DemoDatasetId;
  datasetLabel: string;
  workflowStages: SimulationStageMeta[];
  onSelectStage: (stageId: SimulationStageId) => void;
  displayDecision: (decision: string) => string;
  evidenceLabel: (value: string | null | undefined) => string;
}

function hasText(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

export const OverviewStageView: React.FC<OverviewStageViewProps> = ({
  study,
  characterization,
  mix,
  studyMode,
  datasetId,
  datasetLabel,
  workflowStages,
  onSelectStage,
  displayDecision,
  evidenceLabel,
}) => {
  const qualification = study.science.materialQualification;
  const evidence = study.state.evidence;
  const sni = study.state.sni;
  const decision = study.state.decision;
  const candidateSpace = study.science.formulationSpace.activeCandidate;

  const standardId = hasText(sni.standardId)
    ? sni.standardId
    : 'SNI 03-0691-1996';

  const isControlSubstitution = Boolean(evidence.isControlPoint);

  const evidenceClassOrStatusLabel = isControlSubstitution
    ? `${evidenceLabel(evidence.evidenceClass ?? evidence.status)} (TITIK KONTROL 0%)`
    : evidenceLabel(evidence.evidenceClass ?? evidence.status);

  const evidenceSublabel = isControlSubstitution
    ? 'Titik kontrol 0% (bukan substitusi semen aktif)'
    : evidence.direct
    ? 'Bukti literatur paving langsung (SRC-017)'
    : 'Memerlukan bukti langsung pada titik ini';

  const materialSnapshotItems = [
    {
      label: 'Kandungan SiO₂',
      value: hasText(characterization.silica)
        ? `${characterization.silica.trim()} wt.%`
        : null,
      sublabel: 'Komposisi oksida utama',
      isAccent: false,
    },
    {
      label: 'Fase Material',
      value: hasText(characterization.phase)
        ? characterization.phase.trim()
        : null,
      sublabel: 'Status mineralogi silika',
      isAccent: false,
    },
    {
      label: 'Ukuran Partikel (D50)',
      value: hasText(characterization.particle)
        ? `${characterization.particle.trim()} μm`
        : null,
      sublabel: 'Distribusi ukuran partikel',
      isAccent: false,
    },
    {
      label: 'Kadar Air',
      value: hasText(characterization.moisture)
        ? `${characterization.moisture.trim()} %`
        : null,
      sublabel: 'Moisture content bahan baku',
      isAccent: false,
    },
    {
      label: 'Fraksi Pengotor',
      value: hasText(characterization.impurity)
        ? `${characterization.impurity.trim()} %`
        : null,
      sublabel: 'Impurity fraction tercatat',
      isAccent: false,
    },
    {
      label: 'Pra-pemrosesan',
      value: hasText(characterization.preprocessing)
        ? characterization.preprocessing.trim()
        : null,
      sublabel: 'Perlakuan awal material',
      isAccent: false,
    },
    {
      label: 'ID Sampel',
      value: hasText(characterization.sample)
        ? characterization.sample.trim()
        : null,
      sublabel: 'Identitas spesimen uji',
      isAccent: false,
    },
    {
      label: 'Kelas Bukti (Evidence)',
      value: evidenceClassOrStatusLabel,
      sublabel: evidenceSublabel,
      isAccent: false,
    },
    {
      label: 'Substitusi Aktif',
      value: `${mix.substitution}%`,
      sublabel: isControlSubstitution
        ? `Titik kontrol 0% · W/B ${mix.waterRatio}`
        : `Basis massa semen · W/B ${mix.waterRatio}`,
      isAccent: true,
    },
  ];

  const qualificationBadgeTone =
    qualification.status === 'QUALIFIED'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : qualification.status === 'CONDITIONAL'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-rose-50 text-rose-800 border-rose-200';

  const qualificationIconTone =
    qualification.status === 'QUALIFIED'
      ? 'bg-emerald-100 text-emerald-800'
      : qualification.status === 'CONDITIONAL'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-rose-100 text-rose-800';

  const isGateOrDecisionFailed =
    decision.decision === 'NOT_SUPPORTED' || sni.status === 'PRELIMINARY_FAIL';
  const isGateAndDecisionValidated =
    decision.decision === 'VALIDATED' ||
    (sni.status === 'PRELIMINARY_PASS' &&
      decision.decision === 'PRELIMINARY_PROMISING');

  const gateDecisionIconTone = isGateOrDecisionFailed
    ? 'bg-rose-100 text-rose-800'
    : isGateAndDecisionValidated
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-amber-100 text-amber-800';

  const gateDecisionBadgeTone = isGateOrDecisionFailed
    ? 'bg-rose-50 text-rose-800 border-rose-200'
    : isGateAndDecisionValidated
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-amber-50 text-amber-800 border-amber-200';

  const primaryDecisionReasons = decision.reasons.slice(0, 2);

  return (
    <div
      data-testid="overview-stage-content"
      className="space-y-5 sm:space-y-6 min-w-0"
    >
      {/* 1. Context Summary Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Batch */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              BATCH MATERIAL
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
              {studyMode === 'demo' ? `Preset: ${datasetId}` : 'Input Aktual'}
            </span>
          </div>
          <div className="min-w-0">
            {hasText(characterization.batch) ? (
              <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                {characterization.batch}
              </div>
            ) : (
              <div className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 inline-block">
                DATA DIPERLUKAN
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 break-words">
            Dataset: <span className="font-mono">{datasetLabel}</span>
          </div>
        </div>

        {/* Card 2: Material Source */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              SUMBER MATERIAL
            </span>
            <TestTube2 className="w-4 h-4 text-emerald-700 shrink-0" />
          </div>
          <div className="min-w-0">
            {hasText(characterization.source) ? (
              <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words leading-snug">
                {characterization.source.trim()}
              </div>
            ) : (
              <div className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 inline-block">
                DATA DIPERLUKAN
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 break-words">
            ID Material:{' '}
            <span className="font-semibold text-slate-700">
              {hasText(characterization.materialId)
                ? characterization.materialId
                : 'Belum diisi'}
            </span>
          </div>
        </div>

        {/* Card 3: Target Application */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              TARGET APLIKASI
            </span>
            <Layers3 className="w-4 h-4 text-emerald-700 shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
              Paving Block · Kelas {mix.targetClass}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 break-words">
            Dimensi nominal: {mix.blockLengthMm} × {mix.blockWidthMm} ×{' '}
            {mix.blockThicknessMm} mm
          </div>
        </div>

        {/* Card 4: Technical Standard vs Literature Window */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              STANDAR MUTU & LITERATUR
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
              {standardId}
            </div>
            <div className="text-[11px] text-slate-500">
              Acuan syarat mutu fisik paving block
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-200/80 text-[11px] text-slate-500 break-words">
            Rentang substitusi literatur (SRC-017):{' '}
            <span className="font-semibold text-slate-700">
              {study.directRange} massa semen
            </span>{' '}
            <span>(bukan ketentuan SNI)</span>
          </div>
        </div>
      </div>

      {/* 2. 8-Stage Evaluation Pipeline Overview */}
      <div className="rounded-xl sm:rounded-2xl bg-slate-50/70 border border-slate-200 p-3.5 sm:p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
              ALUR KERJA EVALUASI
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              8 Tahap Evaluasi Berurutan SILICA2CON
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Klik tahap mana pun untuk berpindah langsung
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {workflowStages.map((stage) => {
            const StageIcon = stage.icon;
            const isCurrentOverview = stage.id === 'overview';
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                data-testid={`overview-pipeline-step-${stage.id}`}
                className={`p-3 min-h-[48px] rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 min-w-0 ${
                  isCurrentOverview
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white hover:bg-emerald-50/60 text-slate-800 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tabular-nums ${
                      isCurrentOverview
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Tahap {stage.stageNumber}
                  </span>
                  <StageIcon
                    className={`w-4 h-4 shrink-0 ${
                      isCurrentOverview ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold break-words leading-snug">
                    {stage.title}
                  </div>
                  <div
                    className={`text-[11px] mt-0.5 line-clamp-2 ${
                      isCurrentOverview ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {stage.shortLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Material Snapshot & Study Readiness (Responsive Layout across Tablet/Laptop/Desktop) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Material Characterization Snapshot */}
        <div className="xl:col-span-7 rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="min-w-0">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                RINGKASAN MATERIAL AKTIF
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Karakterisasi Awal & Parameter Kandidat
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${qualificationBadgeTone}`}
              >
                {evidenceLabel(qualification.status)} ({qualification.completeness}
                %)
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {studyMode === 'demo' ? 'Data Demo' : 'Batch Aktual'}
              </span>
            </div>
          </div>

          {/* 9-Item Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {materialSnapshotItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-3 border flex flex-col justify-between gap-1 min-w-0 ${
                  item.isAccent
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <span className="text-[11px] font-medium text-slate-500 break-words">
                  {item.label}
                </span>
                {item.value !== null ? (
                  <strong
                    className={`text-xs sm:text-sm font-bold break-words ${
                      item.isAccent ? 'text-emerald-900' : 'text-slate-900'
                    }`}
                  >
                    {item.value}
                  </strong>
                ) : (
                  <span className="text-xs font-bold text-amber-800">
                    DATA DIPERLUKAN
                  </span>
                )}
                <span className="text-[10px] text-slate-500 break-words">
                  {item.sublabel}
                </span>
              </div>
            ))}
          </div>

          {/* Provenance & Mode Notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="min-w-0 break-words">
              {studyMode === 'demo'
                ? 'Nilai pada tampilan ini berasal dari rekam preset demonstrasi dan digunakan untuk menelusuri alur evaluasi, bukan sebagai bukti validasi eksperimen laboratorium.'
                : 'Nilai yang tampil mengikuti input batch aktual saat ini; ketersediaan input karakterisasi belum menggantikan keharusan uji fisik produk.'}
            </span>
          </div>
        </div>

        {/* Right Column: Study Readiness Checklist */}
        <div className="xl:col-span-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 min-w-0">
          <div className="pb-3 border-b border-slate-200">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800">
              KESIAPAN STUDI
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Status Kesiapan & Batas Bukti Saat Ini
            </h2>
          </div>

          <div className="space-y-3">
            {/* Readiness Item 1: Material Identification & Qualification */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-start gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${qualificationIconTone}`}
              >
                {qualification.status === 'QUALIFIED' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900">
                    Identifikasi & Kualifikasi Material
                  </strong>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${qualificationBadgeTone}`}
                  >
                    {evidenceLabel(qualification.status)} ({qualification.completeness}
                    %)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {qualification.status === 'QUALIFIED'
                    ? 'Seluruh parameter karakterisasi awal (10/10 field) telah terisi pada batch aktif.'
                    : qualification.status === 'CONDITIONAL'
                    ? `Identitas utama tersedia, namun sebagian parameter karakterisasi belum lengkap: ${qualification.missing.join(
                        ', '
                      )}.`
                    : `Identitas kritis material belum mencukupi. Parameter yang masih diperlukan: ${qualification.missing.join(
                        ', '
                      )}.`}
                </p>
                {qualification.rationale.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed break-words">
                    {qualification.rationale[1] ?? qualification.rationale[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Readiness Item 2: Formulation & Literature Evidence Window */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-start gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  !candidateSpace.outsideDirectSubstitutionRange &&
                  evidence.direct &&
                  !isControlSubstitution
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900">
                    Posisi Bukti Literatur Formulasi
                  </strong>
                  <span className="text-[11px] font-semibold text-slate-700">
                    {evidenceClassOrStatusLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {isControlSubstitution
                    ? `Substitusi 0% merupakan titik kontrol literatur (tanpa residu silika), bukan bukti langsung untuk substitusi semen aktif pada rentang ${study.directRange} massa semen.`
                    : candidateSpace.warning ?? evidence.explanation}
                </p>
              </div>
            </div>

            {/* Readiness Item 3: Technical Gate & Validation Status */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-start gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${gateDecisionIconTone}`}
              >
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <strong className="text-xs sm:text-sm font-bold text-slate-900">
                    Status Gerbang Teknis & Keputusan
                  </strong>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${gateDecisionBadgeTone}`}
                  >
                    {displayDecision(decision.decision)} (
                    {evidenceLabel(decision.decision)})
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  Status SNI: <strong>{evidenceLabel(sni.status)}</strong> ·
                  Status DSS: <strong>{evidenceLabel(decision.decision)}</strong>
                  . Pengujian fisik laboratorium aktual tetap diperlukan sebelum
                  klaim kelayakan produk.
                </p>
                {primaryDecisionReasons.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Catatan Alasan Keputusan Aktif:
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 break-words">
                      {primaryDecisionReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Next Action Callout Card */}
      <div className="rounded-xl sm:rounded-2xl bg-emerald-900 text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl min-w-0">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
            LANGKAH SELANJUTNYA · TAHAP 02
          </div>
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight break-words">
            Mulai dari Karakterisasi Material
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed break-words">
            Tinjau atau perbarui identitas sampel, kandungan SiO₂, fase amorf,
            ukuran partikel, dan kadar air sebelum mengatur kandidat campuran
            paving block.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectStage('characterization')}
          data-testid="overview-start-characterization-button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 min-h-[44px] rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
        >
          <span>Mulai Karakterisasi</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
