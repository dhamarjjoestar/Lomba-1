import React from 'react';
import {
  FlaskConical,
  BookOpen,
  Table2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  Characterization,
  MixControls,
  StudyResult,
} from '../../engine/study';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface CandidateAnalysisStageViewProps {
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

function hasText(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

function formatNumberId(
  value: number | null | undefined,
  maxFractionDigits = 2
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 'DATA_REQUIRED';
  }
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

function getGradeBadgeClass(grade: string): string {
  if (grade === 'VALIDATED') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  if (grade === 'LITERATURE_SUPPORTED') {
    return 'bg-sky-50 text-sky-800 border-sky-200';
  }
  if (grade === 'SCREENING_ESTIMATE') {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  return 'bg-rose-50 text-rose-800 border-rose-200';
}

function getApplicabilityBadgeClass(applicability: string): string {
  if (applicability === 'DIRECT') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  if (applicability === 'RELATED') {
    return 'bg-sky-50 text-sky-800 border-sky-200';
  }
  if (applicability === 'INDIRECT') {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function getCandidateEvidenceStatusMeta(
  substitution: number,
  study: StudyResult
): {
  categoryLabel: string;
  badgeClass: string;
  panelClass: string;
  summaryText: string;
} {
  const isControl =
    Boolean(study.state.evidence.isControlPoint) || substitution === 0;
  const isDirect = Boolean(study.state.evidence.direct);
  const outsideRange =
    study.science.formulationSpace.activeCandidate
      .outsideDirectSubstitutionRange;

  if (isControl) {
    return {
      categoryLabel: 'Titik Kontrol Referensi (0% Substitusi)',
      badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
      panelClass: 'bg-sky-50/70 border-sky-200 text-sky-950',
      summaryText:
        'Kandidat aktif berada pada 0% substitusi (100% semen Portland). Titik ini berfungsi sebagai baseline kontrol pembanding pada literatur SRC-017 dan rancangan eksperimen, bukan tingkat substitusi residu aktif.',
    };
  }

  if (isDirect) {
    return {
      categoryLabel: `Didukung Bukti Literatur Langsung (${substitution}%)`,
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      panelClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
      summaryText:
        study.state.evidence.explanation ||
        `Titik substitusi ${substitution}% memiliki kecocokan langsung pada rekaman literatur paving block (SRC-017). Nilai literatur tetap merupakan bukti eksternal sampai uji laboratorium batch aktual dilakukan.`,
    };
  }

  if (!outsideRange) {
    return {
      categoryLabel: `Kandidat Eksplorasi di Dalam Rentang (${study.directRange})`,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
      panelClass: 'bg-amber-50/70 border-amber-200 text-amber-950',
      summaryText: `Substitusi ${substitution}% berada di dalam rentang literatur langsung (${study.directRange}), namun bukan titik diskrit yang diuji langsung pada SRC-017. Engine tidak melakukan interpolasi kuat tekan; verifikasi eksperimen diperlukan.`,
    };
  }

  return {
    categoryLabel: `Bukti Langsung Tidak Mencukupi / Eksplorasi di Luar Rentang (${study.directRange})`,
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    panelClass: 'bg-rose-50/70 border-rose-200 text-rose-950',
    summaryText:
      study.science.formulationSpace.activeCandidate.warning ??
      `Substitusi ${substitution}% berada di luar rentang bukti langsung (${study.directRange}) dan belum memiliki kecocokan evidence paving block langsung. Diperlakukan sebagai kandidat eksplorasi yang membutuhkan pengujian laboratorium penuh.`,
  };
}

export const CandidateAnalysisStageView: React.FC<
  CandidateAnalysisStageViewProps
> = ({
  study,
  characterization,
  mix,
  studyMode,
  onUpdateMixField,
  onSelectStage,
  displayDecision,
  evidenceLabel,
}) => {
  const qualification = study.science.materialQualification;
  const massBalance = study.state.massBalance;
  const sni = study.state.sni;
  const decision = study.state.decision;
  const evidenceState = study.state.evidence;
  const evidenceEngine = study.evidence;
  const formulationSpace = study.science.formulationSpace;
  const experimentPlan = study.science.experimentPlan;
  const doePlan = study.science.doePlan;

  const cementSharePct = Math.max(
    0,
    Number((100 - mix.substitution).toFixed(4))
  );
  const blockVolumeCm3 =
    (mix.blockLengthMm * mix.blockWidthMm * mix.blockThicknessMm) / 1000;
  const blockVolumeM3 =
    (mix.blockLengthMm * mix.blockWidthMm * mix.blockThicknessMm) /
    1_000_000_000;

  const isMassBalanceDataRequired =
    massBalance.status === 'DATA_REQUIRED' ||
    massBalance.cementFinalKg === null ||
    massBalance.residueKg === null ||
    massBalance.totalBatchKg === null;

  const candidateEvidenceMeta = getCandidateEvidenceStatusMeta(
    mix.substitution,
    study
  );

  const matchingDirectLiteraturePoint =
    study.literaturePoints.find(
      (pt) => Math.abs(pt.replacement - mix.substitution) < 1e-6
    ) ?? null;

  // Canonical 5-candidate DOE matrix projection (matching FormulationStageView canonical mapping)
  type CanonicalDoeCandidateRow = {
    id: string;
    role: string;
    roleLabel: string;
    isCenter: boolean;
    substitutionPct: number | null;
    cementSharePct: number | null;
    residueSharePct: number | null;
    waterRatio: number | null;
    targetParticleSizeUm: number | null;
    evidenceAnchor: string | null;
  };

  const rawDoePlanWithRows = doePlan as typeof doePlan & {
    rows?: Array<{
      id?: string;
      role?: string;
      substitutionPct?: number | null;
      cementSharePct?: number | null;
      cementPct?: number | null;
      residueSharePct?: number | null;
      residuePct?: number | null;
      waterRatio?: number | null;
      wbRatio?: number | null;
      particleSizeUm?: number | null;
      targetParticleSizeUm?: number | null;
      evidenceAnchor?: string | null;
      isCenter?: boolean;
    }>;
  };

  const canonicalDoeRows: CanonicalDoeCandidateRow[] = (() => {
    if (Array.isArray(rawDoePlanWithRows.rows)) {
      return rawDoePlanWithRows.rows.map((r, idx) => {
        const sub =
          typeof r.substitutionPct === 'number' &&
          Number.isFinite(r.substitutionPct)
            ? r.substitutionPct
            : null;
        const cem =
          typeof r.cementSharePct === 'number'
            ? r.cementSharePct
            : typeof r.cementPct === 'number'
            ? r.cementPct
            : sub !== null
            ? Math.max(0, 100 - sub)
            : null;
        const res =
          typeof r.residueSharePct === 'number'
            ? r.residueSharePct
            : typeof r.residuePct === 'number'
            ? r.residuePct
            : sub;
        const roleRaw = r.role ?? (idx === 0 ? 'CONTROL' : `CANDIDATE_${idx}`);
        const isCenter =
          Boolean(r.isCenter) ||
          String(roleRaw).toUpperCase().includes('CENTER');
        return {
          id: r.id ?? (idx === 0 ? 'M0-CTRL' : `M${idx}`),
          role: roleRaw,
          roleLabel: String(roleRaw),
          isCenter,
          substitutionPct: sub,
          cementSharePct: cem,
          residueSharePct: res,
          waterRatio:
            r.waterRatio !== undefined
              ? r.waterRatio
              : r.wbRatio !== undefined
              ? r.wbRatio
              : mix.waterRatio,
          targetParticleSizeUm:
            r.targetParticleSizeUm !== undefined
              ? r.targetParticleSizeUm
              : r.particleSizeUm !== undefined
              ? r.particleSizeUm
              : mix.particleSize,
          evidenceAnchor: r.evidenceAnchor ?? null,
        };
      });
    }

    if (!study.literaturePoints || study.literaturePoints.length === 0) {
      return [];
    }

    const sortedPoints = [...study.literaturePoints].sort(
      (a, b) => a.replacement - b.replacement
    );
    const subFactorLevels =
      doePlan.factors.find((f) => f.key === 'substitutionPct')?.levels ?? [];
    const lowVal =
      subFactorLevels.find((l) => l.label === 'LOW')?.value ?? null;
    const centerVal =
      subFactorLevels.find((l) => l.label === 'CENTER')?.value ?? null;
    const highVal =
      subFactorLevels.find((l) => l.label === 'HIGH')?.value ?? null;
    const sourceId = study.evidenceSource?.id ?? 'SRC-017';

    return sortedPoints.slice(0, 5).map((pt, index) => {
      const sub = pt.replacement;
      const isCtrl = sub === 0;
      const id = isCtrl ? 'M0-CTRL' : `M${index}`;

      let role = 'VARIATION';
      let roleLabel = 'Variasi Kandidat';
      let isCenter = false;

      if (isCtrl) {
        role = 'CONTROL';
        roleLabel = 'CONTROL (Kontrol 0%)';
      } else if (lowVal !== null && sub === lowVal) {
        role = 'LOW';
        roleLabel = 'LOW (Batas Bawah Literatur)';
      } else if (highVal !== null && sub === highVal) {
        role = 'HIGH';
        roleLabel = 'HIGH (Batas Atas Literatur)';
      } else if ((centerVal !== null && sub === centerVal) || index === 2) {
        role = 'CENTER';
        roleLabel =
          centerVal !== null && sub !== centerVal
            ? `CENTER (Titik Tengah Diskrit · Midpoint DOE ${centerVal}%)`
            : 'CENTER (Titik Pusat Kandidat)';
        isCenter = true;
      } else {
        role = 'INTERMEDIATE';
        roleLabel = 'INTERMEDIATE (Variasi Menengah)';
      }

      const anchorLevel = subFactorLevels.find((l) => l.value === sub);
      const evidenceAnchor = isCtrl
        ? `${sourceId} · Baseline Kontrol 0% (${pt.age})`
        : anchorLevel
        ? `${sourceId} · ${anchorLevel.evidence} (${anchorLevel.label} ${sub}%, ${pt.age})`
        : `${sourceId} · LITERATURE_SUPPORTED (Titik Diskrit ${sub}%, ${pt.age})`;

      return {
        id,
        role,
        roleLabel,
        isCenter,
        substitutionPct: sub,
        cementSharePct: Math.max(0, 100 - sub),
        residueSharePct: sub,
        waterRatio: Number.isFinite(mix.waterRatio) ? mix.waterRatio : null,
        targetParticleSizeUm: Number.isFinite(mix.particleSize)
          ? mix.particleSize
          : null,
        evidenceAnchor,
      };
    });
  })();

  const activeDoeRow =
    canonicalDoeRows.find(
      (row) =>
        row.substitutionPct !== null &&
        Math.abs(row.substitutionPct - mix.substitution) < 1e-6
    ) ?? null;

  const measuredParticleFactorLevel =
    doePlan.factors
      .find((f) => f.key === 'particleSizeUm')
      ?.levels.find((l) => l.label === 'CENTER') ?? null;

  const measuredParticleUm = measuredParticleFactorLevel?.value ?? null;
  const targetParticleUm = formulationSpace.activeCandidate.particleSizeUm;

  const hasParticleSizeMismatch =
    measuredParticleUm !== null &&
    Number.isFinite(measuredParticleUm) &&
    Number.isFinite(targetParticleUm) &&
    Math.abs(measuredParticleUm - targetParticleUm) > 1e-6;

  return (
    <div
      data-testid="candidate-analysis-stage-view"
      className="space-y-6 sm:space-y-8"
    >
      {/* Context Banner: Mode & Active Batch Identity */}
      <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border ${
              studyMode === 'actual'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 shrink-0" />
            <span>
              Mode Studi: {studyMode === 'actual' ? 'Data Aktual' : 'Preset Demo'}
            </span>
          </span>

          <span className="text-slate-300" aria-hidden="true">
            |
          </span>

          <span className="font-medium text-slate-600">
            Batch:{' '}
            <strong className="font-mono text-slate-900">
              {hasText(characterization.batch)
                ? characterization.batch
                : 'BATCH_REQUIRED'}
            </strong>
          </span>

          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>

          <span className="font-medium text-slate-600">
            Material:{' '}
            <strong className="font-mono text-slate-900">
              {hasText(characterization.materialId)
                ? characterization.materialId
                : 'MATERIAL_REQUIRED'}
            </strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectStage('formulation')}
            data-testid="candidate-analysis-back-to-formulation"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Ubah Parameter di Tahap 03</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: RINGKASAN KANDIDAT AKTIF
         ===================================================================== */}
      <section
        aria-labelledby="active-candidate-summary-heading"
        data-testid="section-active-candidate-summary"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                BAGIAN 01 · KANDIDAT AKTIF
              </span>
              {activeDoeRow ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  Kandidat DOE: {activeDoeRow.id} ({activeDoeRow.roleLabel})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Substitusi Kustom ({formatNumberId(mix.substitution, 2)}%)
                </span>
              )}
            </div>
            <h2
              id="active-candidate-summary-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              Ringkasan Kandidat Aktif & Status Perhitungan Kanonik
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Parameter formulasi aktif dari Tahap 03 beserta hasil evaluasi neraca
              massa dan status kesiapan data pada mesin ilmiah kanonik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                decision.decision === 'VALIDATED'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : decision.decision === 'NOT_SUPPORTED'
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : decision.decision === 'DATA_REQUIRED'
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              <span>Status DSS: {displayDecision(decision.decision)}</span>
            </span>
          </div>
        </div>

        {/* Active Mix Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
            <div className="text-xs font-medium text-slate-500">
              Proporsi Pengikat (Semen : Residu Silika)
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formatNumberId(cementSharePct, 2)}% :{' '}
              <span className="text-emerald-700">
                {formatNumberId(mix.substitution, 2)}%
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Basis penggantian: {evidenceState.replacementBasis || 'CEMENT MASS'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
            <div className="text-xs font-medium text-slate-500">
              Rasio Air terhadap Pengikat (W/B) & Target D50
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              W/B {formatNumberId(mix.waterRatio, 2)} ·{' '}
              {formatNumberId(mix.particleSize, 1)} µm
            </div>
            <div className="text-[11px] text-slate-500">
              Ukuran partikel aktual Tahap 02:{' '}
              {hasText(characterization.particle)
                ? `${characterization.particle.trim()} µm`
                : 'Belum diisi'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
            <div className="text-xs font-medium text-slate-500">
              Kelas Mutu Sasaran & Geometri Blok
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              Mutu {mix.targetClass} · {mix.blockLengthMm}×{mix.blockWidthMm}×
              {mix.blockThicknessMm} mm
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Volume: {formatNumberId(blockVolumeCm3, 1)} cm³ (
              {blockVolumeM3.toFixed(6)} m³)
            </div>
          </div>
        </div>

        {/* Canonical Status & Mass Balance Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Calculation & Gate Status Card */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Status Mesin Ilmiah Kanonik</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Confidence Bukti: {evidenceState.confidence}
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
                <dt className="text-slate-500">Kualifikasi Material (Tahap 02)</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {evidenceLabel(qualification.status)} ({qualification.completeness}%)
                </dd>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
                <dt className="text-slate-500">Status Bukti Kandidat</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {evidenceLabel(evidenceEngine.candidate.grade)} (
                  {evidenceLabel(evidenceEngine.candidate.status)})
                </dd>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
                <dt className="text-slate-500">Status Neraca Massa</dt>
                <dd className="font-mono font-bold text-slate-900">
                  {evidenceLabel(massBalance.status)}
                </dd>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5">
                <dt className="text-slate-500">
                  Gerbang Teknis ({sni.standardId || 'SNI 03-0691-1996'})
                </dt>
                <dd className="font-mono font-bold text-slate-900">
                  {evidenceLabel(sni.status)} · Mutu {sni.className || mix.targetClass}
                </dd>
              </div>
            </dl>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Alasan Utama DSS:</strong>{' '}
              {decision.reasons[0] ?? evidenceState.explanation}
            </div>
          </div>

          {/* Mass Balance Summary Card */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Ringkasan Neraca Massa Kandidat Aktif</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                  isMassBalanceDataRequired
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {massBalance.status}
              </span>
            </div>

            {isMassBalanceDataRequired ? (
              <div
                data-testid="mass-balance-data-required-alert"
                className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 space-y-1.5 text-xs text-amber-950"
              >
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>DATA_REQUIRED — Input Batch Aktual Belum Lengkap</span>
                </div>
                <p className="leading-relaxed text-amber-900">
                  Perhitungan massa batch dalam mode aktual membutuhkan input massa
                  semen, agregat, dan air. Mesin ilmiah tidak menyubstitusi angka
                  demo ketika mode aktual belum lengkap.
                </p>
              </div>
            ) : (
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500">Semen Portland</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                    {formatNumberId(massBalance.cementFinalKg, 2)} kg
                  </dd>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                  <dt className="text-emerald-800">Residu Silika</dt>
                  <dd className="font-mono font-bold text-emerald-950 tabular-nums mt-0.5">
                    {formatNumberId(massBalance.residueKg, 2)} kg
                  </dd>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500">Agregat Halus</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                    {formatNumberId(massBalance.components.aggregate, 2)} kg
                  </dd>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500">Air Campuran</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                    {formatNumberId(massBalance.components.water, 2)} kg
                  </dd>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500">Total Massa Batch</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                    {formatNumberId(massBalance.totalBatchKg, 2)} kg
                  </dd>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500">Massa per Blok</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                    {massBalance.blockMassKg !== null &&
                    Number.isFinite(massBalance.blockMassKg) ? (
                      `${formatNumberId(massBalance.blockMassKg, 3)} kg`
                    ) : (
                      <span className="text-amber-800">Perlu Densitas</span>
                    )}
                  </dd>
                </div>
              </dl>
            )}

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-1">
              <span>
                Blok per m²:{' '}
                <strong className="font-mono text-slate-700">
                  {massBalance.blocksPerM2 !== null &&
                  Number.isFinite(massBalance.blocksPerM2)
                    ? `${formatNumberId(massBalance.blocksPerM2, 1)} blok/m²`
                    : 'DATA_REQUIRED'}
                </strong>
              </span>
              <span>
                Estimasi produksi harian:{' '}
                <strong className="font-mono text-slate-700">
                  {study.estimatedBlocksPerDay > 0
                    ? `${formatNumberId(study.estimatedBlocksPerDay, 0)} blok/hari`
                    : 'DATA_REQUIRED'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ANALISIS BUKTI LITERATUR
         ===================================================================== */}
      <section
        aria-labelledby="literature-evidence-analysis-heading"
        data-testid="section-literature-evidence-analysis"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-sky-50 text-sky-900 border border-sky-200">
                BAGIAN 02 · BUKTI LITERATUR & PROVENANCE
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${getGradeBadgeClass(
                  evidenceEngine.candidate.grade
                )}`}
              >
                Grade Kandidat: {evidenceLabel(evidenceEngine.candidate.grade)}
              </span>
            </div>
            <h2
              id="literature-evidence-analysis-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              Analisis Bukti Literatur & Ketertelusuran Sumber
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluasi bukti langsung maupun bukti pembanding dari repositori master
              untuk posisi substitusi aktif ({formatNumberId(mix.substitution, 2)}%),
              membedakan titik kontrol, titik literatur langsung, kandidat eksplorasi,
              dan batas validasi.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0">
            Rentang Bukti Langsung Paving: <strong>{study.directRange}</strong>
          </div>
        </div>

        {/* Classification Callout Banner */}
        <div
          data-testid="candidate-evidence-classification-banner"
          className={`rounded-xl border p-4 space-y-2 ${candidateEvidenceMeta.panelClass}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${candidateEvidenceMeta.badgeClass}`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{candidateEvidenceMeta.categoryLabel}</span>
            </span>

            <span className="text-xs font-mono">
              Sumber Primer:{' '}
              <strong>
                {evidenceState.sourceId ??
                  study.evidenceSource?.id ??
                  'Tidak ada kecocokan langsung'}
              </strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed">
            {candidateEvidenceMeta.summaryText}
          </p>

          {matchingDirectLiteraturePoint ? (
            <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
              <span>
                Referensi Kuat Tekan Literatur (SRC-017 pada{' '}
                {matchingDirectLiteraturePoint.replacement}%):{' '}
                <strong>
                  {formatNumberId(matchingDirectLiteraturePoint.strength, 2)} MPa
                </strong>{' '}
                (Umur uji: {matchingDirectLiteraturePoint.age})
              </span>
              <span className="text-[11px] opacity-85">
                *Catatan: Data literatur eksternal, bukan hasil uji laboratorium
                sampel batch aktif.
              </span>
            </div>
          ) : (
            <div className="pt-1 text-xs font-mono opacity-90">
              Nilai Kuat Tekan Literatur Langsung pada{' '}
              {formatNumberId(mix.substitution, 2)}%:{' '}
              <strong>
                DATA_REQUIRED (Titik ini tidak diuji langsung di SRC-017)
              </strong>
            </div>
          )}
        </div>

        {/* Summary Counters from study.evidence.summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="text-[11px] text-slate-500">Total Rekaman Jejak</div>
            <div className="text-lg font-extrabold font-mono text-slate-900 mt-0.5 tabular-nums">
              {evidenceEngine.summary.total}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
            <div className="text-[11px] text-emerald-800">
              Tervalidasi (VALIDATED)
            </div>
            <div className="text-lg font-extrabold font-mono text-emerald-900 mt-0.5 tabular-nums">
              {evidenceEngine.summary.validated}
            </div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3">
            <div className="text-[11px] text-sky-800">Didukung Literatur</div>
            <div className="text-lg font-extrabold font-mono text-sky-900 mt-0.5 tabular-nums">
              {evidenceEngine.summary.literatureSupported}
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3">
            <div className="text-[11px] text-amber-800">Estimasi Skrining</div>
            <div className="text-lg font-extrabold font-mono text-amber-900 mt-0.5 tabular-nums">
              {evidenceEngine.summary.screeningEstimate}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-500">Grade Dominan</div>
            <div className="text-xs font-bold font-mono text-slate-900 mt-1.5">
              {evidenceLabel(evidenceEngine.summary.dominantGrade)}
            </div>
          </div>
        </div>

        {/* Reference Table of Discrete Direct Literature Points (SRC-017) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Titik Uji Diskrit Literatur Paving Block (
              {study.evidenceSource?.id ?? 'SRC-017'})
            </h3>
            {study.evidenceSource?.title && (
              <span className="text-[11px] text-slate-500">
                {study.evidenceSource.authors
                  ? `${study.evidenceSource.authors} (${study.evidenceSource.year ?? '-'})`
                  : study.evidenceSource.title}
              </span>
            )}
          </div>

          {study.literaturePoints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-600">
              Belum ada titik literatur langsung yang tercatat pada dataset untuk
              domain ini.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Substitusi (%)</th>
                    <th className="py-2.5 px-3">Peran Literatur</th>
                    <th className="py-2.5 px-3">Kuat Tekan Dilaporkan (MPa)</th>
                    <th className="py-2.5 px-3">Umur Uji</th>
                    <th className="py-2.5 px-3">
                      Status terhadap Kandidat Aktif
                    </th>
                    <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {study.literaturePoints.map((pt) => {
                    const isCurrent =
                      Math.abs(pt.replacement - mix.substitution) < 1e-6;
                    const isControl = pt.replacement === 0;
                    return (
                      <tr
                        key={pt.replacement}
                        className={
                          isCurrent
                            ? 'bg-emerald-50/60 font-medium'
                            : 'hover:bg-slate-50/80'
                        }
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                          {formatNumberId(pt.replacement, 2)}%
                        </td>
                        <td className="py-2.5 px-3">
                          {isControl ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-sky-50 text-sky-800 border border-sky-200">
                              Kontrol Referensi (0%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Titik Uji Langsung SRC-017
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-slate-800">
                          {formatNumberId(pt.strength, 2)} MPa{' '}
                          <span className="text-[10px] text-slate-500 font-normal">
                            (LITERATURE)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {pt.age}
                        </td>
                        <td className="py-2.5 px-3">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Aktif Dipilih</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              Pembanding diskrit
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            disabled={isCurrent}
                            onClick={() =>
                              onUpdateMixField('substitution', pt.replacement)
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              isCurrent
                                ? 'bg-emerald-100 text-emerald-900 cursor-default'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer'
                            }`}
                          >
                            {isCurrent ? 'Aktif' : `Pilih ${pt.replacement}%`}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Candidate Warnings & Limitations */}
        {(evidenceEngine.candidate.warnings.length > 0 ||
          evidenceState.limitations.length > 0 ||
          evidenceEngine.material.missingContext.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Peringatan Bukti Kandidat & Keterbatasan Literatur</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900 list-disc pl-4">
                {evidenceEngine.candidate.warnings.map((warn, idx) => (
                  <li key={`warn-${idx}`}>{warn}</li>
                ))}
                {evidenceState.limitations.map((lim, idx) => (
                  <li key={`lim-${idx}`}>{lim}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Info className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Aturan Interpretasi Bukti & Konteks Material</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {evidenceEngine.decisionRules.map((rule, idx) => (
                  <li key={`rule-${idx}`}>{rule}</li>
                ))}
                {evidenceEngine.material.missingContext.length > 0 && (
                  <li className="text-amber-900 font-medium">
                    Konteks material yang masih terbuka:{' '}
                    {evidenceEngine.material.missingContext.join(', ')}.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Related / Comparative Literature Items from study.evidence.candidate.literatureSupport */}
        <div className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Rekaman Literatur Pembanding Terkait (
            {evidenceEngine.candidate.literatureSupport.length} rekaman)
          </h3>
          {evidenceEngine.candidate.literatureSupport.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-600">
              Tidak ada rekaman literatur pembanding tambahan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evidenceEngine.candidate.literatureSupport
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-mono font-bold text-slate-900">
                        {item.id} · {item.provenance.sourceId ?? 'SUMBER_UMUM'}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getApplicabilityBadgeClass(
                            item.applicability
                          )}`}
                        >
                          {evidenceLabel(item.applicability)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getGradeBadgeClass(
                            item.grade
                          )}`}
                        >
                          {evidenceLabel(item.grade)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      {item.claim}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-mono">
                      {item.provenance.productType && (
                        <span>Produk: {item.provenance.productType}</span>
                      )}
                      {item.provenance.replacementValue !== null && (
                        <span>
                          Substitusi: {item.provenance.replacementValue}%
                        </span>
                      )}
                      {item.provenance.testingAge && (
                        <span>Umur uji: {item.provenance.testingAge}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: ANALISIS RUANG FORMULASI
         ===================================================================== */}
      <section
        aria-labelledby="formulation-space-analysis-heading"
        data-testid="section-formulation-space-analysis"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-teal-50 text-teal-900 border border-teal-200">
                BAGIAN 03 · RUANG FORMULASI
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${
                  formulationSpace.activeCandidate
                    .outsideDirectSubstitutionRange
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {formulationSpace.activeCandidate.outsideDirectSubstitutionRange
                  ? 'Di Luar Rentang Literatur Langsung'
                  : 'Di Dalam Rentang Literatur Langsung'}
              </span>
            </div>
            <h2
              id="formulation-space-analysis-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              Analisis Ruang Formulasi & Batasan Faktor Kanonik
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluasi posisi kandidat aktif terhadap domain faktor substitusi
              material, ukuran partikel, serta kesiapan kualifikasi pada{' '}
              <code className="font-mono text-slate-800">
                study.science.formulationSpace
              </code>
              .
            </p>
          </div>

          <div className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 shrink-0">
            Status Rencana Eksperimen:{' '}
            <strong>{evidenceLabel(experimentPlan.status)}</strong>
          </div>
        </div>

        {/* Active Candidate & Domain Bounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Domain Substitusi Material
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getGradeBadgeClass(
                  formulationSpace.substitutionPct.evidence
                )}`}
              >
                {evidenceLabel(formulationSpace.substitutionPct.evidence)}
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formulationSpace.substitutionPct.min !== null &&
              formulationSpace.substitutionPct.max !== null
                ? `${formatNumberId(
                    formulationSpace.substitutionPct.min,
                    2
                  )}% – ${formatNumberId(
                    formulationSpace.substitutionPct.max,
                    2
                  )}%`
                : 'DATA_REQUIRED'}
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Sumber: <span className="font-mono">{formulationSpace.substitutionPct.source}</span>.{' '}
              {formulationSpace.substitutionPct.rationale}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Domain Ukuran Partikel
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getGradeBadgeClass(
                  formulationSpace.particleSizeUm.evidence
                )}`}
              >
                {evidenceLabel(formulationSpace.particleSizeUm.evidence)}
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 tabular-nums">
              {formulationSpace.particleSizeUm.min !== null &&
              formulationSpace.particleSizeUm.max !== null
                ? `${formatNumberId(
                    formulationSpace.particleSizeUm.min,
                    1
                  )} – ${formatNumberId(
                    formulationSpace.particleSizeUm.max,
                    1
                  )} µm`
                : 'Ruang Eksplorasi UI (50–300 µm)'}
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Sumber: <span className="font-mono">{formulationSpace.particleSizeUm.source}</span>.{' '}
              {formulationSpace.particleSizeUm.rationale}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Posisi Kandidat Aktif
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                AKTIF
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-800 tabular-nums">
              {formatNumberId(
                formulationSpace.activeCandidate.substitutionPct,
                2
              )}
              % ·{' '}
              {formatNumberId(
                formulationSpace.activeCandidate.particleSizeUm,
                1
              )}{' '}
              µm
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Porsi Semen: <strong>{formatNumberId(cementSharePct, 2)}%</strong>{' '}
              | Rasio W/B: <strong>{formatNumberId(mix.waterRatio, 2)}</strong>.{' '}
              {formulationSpace.activeCandidate.outsideDirectSubstitutionRange
                ? 'Berada di luar rentang substitusi literatur langsung.'
                : 'Berada di dalam batas rentang substitusi literatur langsung.'}
            </div>
          </div>
        </div>

        {/* Active Candidate Space Warning if present */}
        {formulationSpace.activeCandidate.warning && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">
                Peringatan Ruang Formulasi Kandidat Aktif
              </div>
              <p className="leading-relaxed">
                {formulationSpace.activeCandidate.warning}
              </p>
            </div>
          </div>
        )}

        {/* Primary Factors & Responses from study.science.experimentPlan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-900">
              Faktor Utama Ruang Eksperimen (`study.science.experimentPlan.factors`)
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 px-3">Faktor</th>
                    <th className="py-2 px-3">Peran</th>
                    <th className="py-2 px-3">Nilai Aktif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {experimentPlan.factors.map((f) => (
                    <tr key={f.key}>
                      <td className="py-2 px-3 font-medium text-slate-900">
                        {f.label}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                        {f.role}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-800 tabular-nums">
                        {f.key === 'substitutionPct'
                          ? `${formatNumberId(f.currentValue, 2)}%`
                          : `${formatNumberId(f.currentValue, 1)} µm`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-900">
              Jalur Pemodelan & Kualifikasi Material
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500">Alur Pemodelan:</span>
                {experimentPlan.modelPath.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {step}
                    </span>
                    {idx < experimentPlan.modelPath.length - 1 && (
                      <span className="text-slate-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="leading-relaxed">{experimentPlan.note}</p>
              {qualification.missing.length > 0 && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-amber-950">
                  <strong>Parameter Karakterisasi Belum Lengkap:</strong>{' '}
                  {qualification.missing.join(', ')}.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: RENCANA EKSPERIMEN (DOE)
         ===================================================================== */}
      <section
        aria-labelledby="doe-plan-analysis-heading"
        data-testid="section-doe-plan-analysis"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                BAGIAN 04 · RANCANGAN EKSPERIMEN (DOE)
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Desain: {doePlan.design}
              </span>
            </div>
            <h2
              id="doe-plan-analysis-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              Matriks Rencana Eksperimen (DOE) & Pemilihan Kandidat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluasi faktor DOE, level eksperimen, dan lima kandidat acuan
              (kontrol 0% serta variasi M1–M4). Anda dapat menerapkan persentase
              substitusi kandidat langsung ke simulasi aktif.
            </p>
          </div>

          <div className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 shrink-0">
            Status Desain DOE: <strong>{evidenceLabel(doePlan.status)}</strong>
          </div>
        </div>

        {/* Particle Size Mismatch Warning between Stage 02 and Stage 03 */}
        {hasParticleSizeMismatch && (
          <div
            data-testid="analysis-doe-particle-mismatch-warning"
            className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-xs text-amber-950"
          >
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">
                Perbedaan Ukuran Partikel Karakterisasi (Tahap 02) vs Target
                Formulasi (Tahap 03)
              </div>
              <p className="leading-relaxed">
                Ukuran partikel terukur pada karakterisasi batch adalah{' '}
                <strong className="font-mono">
                  {formatNumberId(measuredParticleUm, 1)} µm
                </strong>{' '}
                (level CENTER faktor DOE), sedangkan target ukuran partikel
                formulasi aktif adalah{' '}
                <strong className="font-mono">
                  {formatNumberId(targetParticleUm, 1)} µm
                </strong>
                . Pastikan protokol penggilingan/pengayakan laboratorium
                menyesuaikan perbedaan ini.
              </p>
            </div>
          </div>
        )}

        {/* DOE Factors & Responses Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
            <div className="font-bold text-slate-900">
              Level Faktor DOE Kanonik (`study.science.doePlan.factors`)
            </div>
            <div className="space-y-2.5">
              {doePlan.factors.map((factor) => (
                <div
                  key={factor.key}
                  className="rounded-lg bg-white border border-slate-200 p-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">
                      {factor.label} ({factor.unit})
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {factor.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                    {factor.levels.map((lvl) => (
                      <div
                        key={lvl.label}
                        className="p-1.5 rounded bg-slate-50 border border-slate-200 text-center"
                      >
                        <div className="text-[10px] text-slate-500">
                          {lvl.label}
                        </div>
                        <div className="font-bold text-slate-900">
                          {lvl.value !== null
                            ? formatNumberId(lvl.value, 2)
                            : 'NOT_DEFINED'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {factor.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
            <div className="font-bold text-slate-900">
              Respons Pengujian & Status Model (`study.science.doePlan.responses`)
            </div>
            <ul className="space-y-1.5">
              {doePlan.responses.map((resp) => (
                <li
                  key={resp.key}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {resp.label}
                    </span>{' '}
                    <span className="text-slate-500 font-mono">
                      ({resp.unit})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {resp.role}
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded-lg bg-white border border-slate-200 p-2.5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800">
                  Status Model ({doePlan.model.path.join(' → ')})
                </span>
                <span className="font-mono text-[10px] font-bold text-amber-800">
                  {doePlan.model.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {doePlan.model.note}
              </p>
            </div>
          </div>
        </div>

        {/* 5-Candidate DOE Matrix Table */}
        {canonicalDoeRows.length === 0 ? (
          <div
            data-testid="doe-matrix-empty-state"
            className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center space-y-1.5"
          >
            <div className="text-sm font-bold text-slate-800">
              Matriks Kandidat DOE Belum Tersedia
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Mesin sains kanonik belum mengembalikan baris kandidat DOE untuk
              konfigurasi saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table
              data-testid="candidate-analysis-doe-table"
              className="w-full text-left border-collapse text-xs"
            >
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">ID Kandidat</th>
                  <th className="py-2.5 px-3">Peran</th>
                  <th className="py-2.5 px-3">Substitusi (%)</th>
                  <th className="py-2.5 px-3">Semen (%)</th>
                  <th className="py-2.5 px-3">Residu (%)</th>
                  <th className="py-2.5 px-3">W/B</th>
                  <th className="py-2.5 px-3">Target Partikel (µm)</th>
                  <th className="py-2.5 px-3">Jangkar Bukti</th>
                  <th className="py-2.5 px-3 text-right">Aksi Kandidat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {canonicalDoeRows.map((row) => {
                  const isActiveRow =
                    row.substitutionPct !== null &&
                    Math.abs(row.substitutionPct - mix.substitution) < 1e-6;
                  const isCenter = row.isCenter;
                  const isControl = row.role === 'CONTROL';

                  return (
                    <tr
                      key={row.id}
                      data-testid={`analysis-doe-row-${row.id}`}
                      className={
                        isActiveRow
                          ? 'bg-emerald-50/70 font-medium'
                          : isCenter
                          ? 'bg-teal-50/30 hover:bg-teal-50/60'
                          : 'hover:bg-slate-50/80'
                      }
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{row.id}</span>
                          {isCenter && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-900 border border-teal-200">
                              CENTER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded border ${
                            isControl
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : isCenter
                              ? 'bg-teal-50 text-teal-800 border-teal-200 font-bold'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {row.roleLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                        {formatNumberId(row.substitutionPct, 2)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 tabular-nums">
                        {formatNumberId(row.cementSharePct, 2)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-800 tabular-nums">
                        {formatNumberId(row.residueSharePct, 2)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 tabular-nums">
                        {row.waterRatio !== null &&
                        row.waterRatio !== undefined &&
                        Number.isFinite(row.waterRatio)
                          ? formatNumberId(row.waterRatio, 2)
                          : 'DATA_REQUIRED'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 tabular-nums">
                        {row.targetParticleSizeUm !== null &&
                        row.targetParticleSizeUm !== undefined &&
                        Number.isFinite(row.targetParticleSizeUm)
                          ? `${formatNumberId(row.targetParticleSizeUm, 1)} µm`
                          : 'DATA_REQUIRED'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs">
                        {row.evidenceAnchor ?? 'DATA_REQUIRED'}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isActiveRow || row.substitutionPct === null}
                          data-testid={`analysis-doe-apply-${row.id}`}
                          onClick={() => {
                            if (row.substitutionPct !== null) {
                              onUpdateMixField(
                                'substitution',
                                row.substitutionPct
                              );
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isActiveRow
                              ? 'bg-emerald-700 text-white cursor-default'
                              : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer'
                          }`}
                        >
                          {isActiveRow ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>Kandidat Aktif</span>
                            </>
                          ) : (
                            <span>Gunakan % Ini</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* DOE Notes from Engine */}
        {Array.isArray(doePlan.notes) && doePlan.notes.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Table2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Catatan Rancangan Eksperimen (DOE) Kanonik</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              {doePlan.notes.map((note, idx) => (
                <li key={`doe-note-${idx}`}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Stage Quick Navigation Shortcuts */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-900">
            Langkah Evaluasi Selanjutnya
          </div>
          <p className="text-xs text-slate-600">
            Setelah menganalisis bukti literatur, batasan ruang formulasi, dan
            matriks DOE kandidat aktif, lanjutkan ke evaluasi syarat mutu SNI
            03-0691-1996 pada Tahap 05.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectStage('formulation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Kembali ke Formulasi (Tahap 03)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStage('gate')}
            data-testid="candidate-analysis-go-to-gate"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <span>Lanjut ke Gerbang Teknis (Tahap 05)</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
