import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Info,
  AlertTriangle,
  CheckCircle2,
  Layers3,
  Ruler,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  TestTube2,
  Scale,
  Table2,
  Check,
} from 'lucide-react';
import {
  defaultMix,
  type MixControls,
  type StudyResult,
} from '../../engine/study';
import { massBalance, type MassBalanceResult } from '../../engine/lib/massBalance';
import { sniRequirements, type SNIClassRecord } from '../../engine/data/master';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface FormulationStageViewProps {
  mix: MixControls;
  setMix: React.Dispatch<React.SetStateAction<MixControls>>;
  onUpdateMixField: <K extends keyof MixControls>(
    field: K,
    value: MixControls[K]
  ) => void;
  study: StudyResult;
  studyMode: 'demo' | 'actual';
  onSelectStage: (stageId: SimulationStageId) => void;
  evidenceLabel: (status: string) => string;
}

const SNI_TARGET_CLASSES: Array<MixControls['targetClass']> = [
  'A',
  'B',
  'C',
  'D',
];

function sanitizeUnsignedDecimal(raw: string, maxDecimals = 4): string {
  const normalized = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  if (!normalized || /^\.+$/.test(normalized)) {
    return '';
  }
  const [head, ...tail] = normalized.split('.');
  if (tail.length === 0) {
    return head;
  }
  const fractional = tail.join('').slice(0, maxDecimals);
  const integerPart = head === '' ? '0' : head;
  return `${integerPart}.${fractional}`;
}

function parseFiniteNonNegative(raw: string): number | null {
  if (!raw || raw.trim() === '') return null;
  const normalized = raw.trim().replace(/,/g, '.');
  if (/^\.+$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function getSubstitutionContext(
  value: number,
  study: StudyResult
): {
  badgeText: string;
  toneClass: string;
  description: string;
} {
  const directListText = study.literaturePoints
    .filter((pt) => pt.replacement > 0)
    .map((pt) => `${pt.replacement}%`)
    .join(', ');
  const rangeLabel = study.directRange;

  if (study.state.evidence.isControlPoint || value === 0) {
    return {
      badgeText: 'Titik Kontrol Referensi (0% Residu)',
      toneClass: 'bg-sky-50 text-sky-900 border-sky-200',
      description:
        'Campuran 100% semen Portland tanpa substitusi residu silika. Digunakan sebagai titik kontrol pembanding (baseline) dalam literatur SRC-017 dan rancangan eksperimen.',
    };
  }

  if (study.state.evidence.direct) {
    return {
      badgeText: `Titik Literatur Langsung SRC-017 (${value}%)`,
      toneClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      description: `${study.state.evidence.explanation} Titik substitusi berbasis massa semen yang diuji langsung pada SRC-017: ${directListText} (serta kontrol 0%).`,
    };
  }

  if (
    !study.science.formulationSpace.activeCandidate
      .outsideDirectSubstitutionRange
  ) {
    return {
      badgeText: `Di Dalam Rentang Literatur (${rangeLabel}), Bukan Titik Uji Diskrit`,
      toneClass: 'bg-amber-50 text-amber-900 border-amber-200',
      description: `Berada di dalam rentang substitusi literatur langsung ${rangeLabel} massa semen (SRC-017), namun di antara titik uji diskrit (${directListText}). Engine tidak melakukan interpolasi kuat tekan.`,
    };
  }

  return {
    badgeText: `Eksplorasi di Luar Rentang Literatur Langsung (${rangeLabel})`,
    toneClass: 'bg-amber-50 text-amber-900 border-amber-200',
    description:
      study.science.formulationSpace.activeCandidate.warning ??
      `Proporsi ini berada di luar rentang bukti langsung SRC-017 (${rangeLabel} massa semen) sehingga diperlakukan sebagai ruang eksplorasi yang wajib diverifikasi melalui uji laboratorium.`,
  };
}

export const FormulationStageView: React.FC<FormulationStageViewProps> = ({
  mix,
  setMix,
  onUpdateMixField,
  study,
  studyMode,
  onSelectStage,
  evidenceLabel,
}) => {
  // Controlled text drafts so users can freely clear or type decimal numbers (e.g., "0.", "12.") without silent clamping
  const [substitutionInput, setSubstitutionInput] = useState<string>(
    String(mix.substitution)
  );
  const [waterRatioInput, setWaterRatioInput] = useState<string>(
    String(mix.waterRatio)
  );
  const [particleSizeInput, setParticleSizeInput] = useState<string>(
    String(mix.particleSize)
  );
  const [lengthInput, setLengthInput] = useState<string>(
    String(mix.blockLengthMm)
  );
  const [widthInput, setWidthInput] = useState<string>(
    String(mix.blockWidthMm)
  );
  const [thicknessInput, setThicknessInput] = useState<string>(
    String(mix.blockThicknessMm)
  );

  // Sync local text drafts when canonical mix state changes externally (e.g., slider, quick-chip, or reset)
  useEffect(() => {
    const parsed = parseFiniteNonNegative(substitutionInput);
    if (parsed !== mix.substitution) {
      setSubstitutionInput(String(mix.substitution));
    }
  }, [mix.substitution]);

  useEffect(() => {
    const parsed = parseFiniteNonNegative(waterRatioInput);
    if (parsed !== mix.waterRatio) {
      setWaterRatioInput(String(mix.waterRatio));
    }
  }, [mix.waterRatio]);

  useEffect(() => {
    const parsed = parseFiniteNonNegative(particleSizeInput);
    if (parsed !== mix.particleSize) {
      setParticleSizeInput(String(mix.particleSize));
    }
  }, [mix.particleSize]);

  useEffect(() => {
    const parsed = parseFiniteNonNegative(lengthInput);
    if (parsed !== mix.blockLengthMm) {
      setLengthInput(String(mix.blockLengthMm));
    }
  }, [mix.blockLengthMm]);

  useEffect(() => {
    const parsed = parseFiniteNonNegative(widthInput);
    if (parsed !== mix.blockWidthMm) {
      setWidthInput(String(mix.blockWidthMm));
    }
  }, [mix.blockWidthMm]);

  useEffect(() => {
    const parsed = parseFiniteNonNegative(thicknessInput);
    if (parsed !== mix.blockThicknessMm) {
      setThicknessInput(String(mix.blockThicknessMm));
    }
  }, [mix.blockThicknessMm]);

  const isDefaultMix =
    mix.substitution === defaultMix.substitution &&
    mix.waterRatio === defaultMix.waterRatio &&
    mix.particleSize === defaultMix.particleSize &&
    mix.targetClass === defaultMix.targetClass &&
    mix.blockLengthMm === defaultMix.blockLengthMm &&
    mix.blockWidthMm === defaultMix.blockWidthMm &&
    mix.blockThicknessMm === defaultMix.blockThicknessMm;

  const handleResetMix = () => {
    setMix(defaultMix);
    setSubstitutionInput(String(defaultMix.substitution));
    setWaterRatioInput(String(defaultMix.waterRatio));
    setParticleSizeInput(String(defaultMix.particleSize));
    setLengthInput(String(defaultMix.blockLengthMm));
    setWidthInput(String(defaultMix.blockWidthMm));
    setThicknessInput(String(defaultMix.blockThicknessMm));
  };

  const handleNumericDraftChange = <
    K extends
      | 'substitution'
      | 'waterRatio'
      | 'particleSize'
      | 'blockLengthMm'
      | 'blockWidthMm'
      | 'blockThicknessMm',
  >(
    field: K,
    raw: string,
    setDraft: React.Dispatch<React.SetStateAction<string>>,
    maxDecimals = 4
  ) => {
    const sanitized = sanitizeUnsignedDecimal(raw, maxDecimals);
    setDraft(sanitized);
    const parsed = parseFiniteNonNegative(sanitized);
    if (parsed !== null) {
      onUpdateMixField(field, parsed as MixControls[K]);
    }
  };

  const handleNumericBlur = <
    K extends
      | 'substitution'
      | 'waterRatio'
      | 'particleSize'
      | 'blockLengthMm'
      | 'blockWidthMm'
      | 'blockThicknessMm',
  >(
    field: K,
    draft: string,
    setDraft: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const parsed = parseFiniteNonNegative(draft);
    if (parsed === null) {
      setDraft(String(mix[field]));
    } else {
      setDraft(String(parsed));
    }
  };

  const substitutionContext = getSubstitutionContext(mix.substitution, study);
  const sniClassRecords: SNIClassRecord[] =
    sniRequirements.classification ?? [];
  const activeSniClassRecord = sniClassRecords.find(
    (item) => item.class === mix.targetClass
  );

  // Canonical literature points from study.literaturePoints (separating 0% control from substitution points)
  const controlLiteraturePoint = study.literaturePoints.find(
    (pt) => pt.replacement === 0
  );
  const directSubstitutionPoints = study.literaturePoints.filter(
    (pt) => pt.replacement > 0
  );
  const isDefaultInDirectPoints = directSubstitutionPoints.some(
    (pt) => pt.replacement === defaultMix.substitution
  );

  const evidenceStatus = study.evidence.candidate.grade;
  const mass = study.state.massBalance;
  const massBalanceStatus = mass.status;
  const qualification = study.science.materialQualification;
  const formulationSpace = study.science.formulationSpace;
  const doePlan = study.science.doePlan;

  // Canonical DOE 5-candidate matrix rows (supporting study.science.doePlan.rows if present, or strictly projecting canonical 0% control M0-CTRL + M1-M4 from canonical literaturePoints & doePlan without inventing experimental values)
  type CanonicalDoeCandidateRow = {
    id: string;
    role: 'CONTROL' | 'LOW' | 'CENTER' | 'MID_HIGH' | 'HIGH' | string;
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

    // When doePlan.rows is not pre-populated on the runtime object, project the 5 canonical candidates strictly from study.literaturePoints & study.science.doePlan factors (never inventing candidate percentages if canonical literaturePoints are empty)
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
      } else if (
        (centerVal !== null && sub === centerVal) ||
        index === 2
      ) {
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

  // Canonical 0% control mass balance computed via engine massBalance() using the exact same canonical batch & geometry inputs
  const initialCementKg =
    mass.cementFinalKg !== null && mass.cementReplacedKg !== null
      ? mass.cementFinalKg + mass.cementReplacedKg
      : mass.components.cement;

  const derivedDensityKgM3 =
    mass.blockMassKg !== null &&
    mass.volumeM3 !== null &&
    mass.volumeM3 > 0
      ? mass.blockMassKg / mass.volumeM3
      : null;

  const controlMass: MassBalanceResult = massBalance({
    cementKg: initialCementKg,
    aggregateKg: mass.components.aggregate,
    replacementValue: 0,
    replacementBasis: mass.replacementBasis,
    waterKg: mass.components.water,
    admixtureKg: mass.components.admixture,
    blockDimensionsMm: {
      length: mix.blockLengthMm,
      width: mix.blockWidthMm,
      thickness: mix.blockThicknessMm,
    },
    densityKgM3: derivedDensityKgM3,
  });

  const formatKgCell = (val: number | null, status: string): string => {
    if (val === null) return status;
    return `${val.toFixed(2)} kg`;
  };

  const formatDeltaKgCell = (
    activeVal: number | null,
    controlVal: number | null
  ): { text: string; toneClass: string } => {
    if (activeVal === null || controlVal === null) {
      return { text: '—', toneClass: 'text-slate-400' };
    }
    const diff = activeVal - controlVal;
    if (Math.abs(diff) < 1e-6) {
      return { text: '0.00 kg', toneClass: 'text-slate-600' };
    }
    const sign = diff > 0 ? '+' : '';
    const toneClass =
      diff > 0 ? 'text-emerald-800 font-bold' : 'text-amber-800 font-bold';
    return { text: `${sign}${diff.toFixed(2)} kg`, toneClass };
  };

  const formatDryFractionCell = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return '—';
    return `${val.toFixed(2)}%`;
  };

  const massComparisonRows: Array<{
    id: string;
    label: string;
    roleNote: string;
    controlKg: number | null;
    activeKg: number | null;
    activeDryFractionPct: number | null;
    isSubtotal?: boolean;
    isTotal?: boolean;
  }> = [
    {
      id: 'cement',
      label: 'Semen Portland (OPC)',
      roleNote: 'Pengikat hidrolik utama',
      controlKg: controlMass.cementFinalKg,
      activeKg: mass.cementFinalKg,
      activeDryFractionPct: mass.dryFractions?.cement ?? null,
    },
    {
      id: 'silica-residue',
      label: 'Residu Silika Panas Bumi',
      roleNote: `Substitusi ${mix.substitution}% berbasis massa semen`,
      controlKg: controlMass.residueKg,
      activeKg: mass.residueKg,
      activeDryFractionPct: mass.dryFractions?.residue ?? null,
    },
    {
      id: 'aggregate',
      label: 'Agregat Halus / Pasir',
      roleNote: 'Rangka pengisi padat (tetap terhadap kontrol)',
      controlKg:
        controlMass.status === 'CALCULATED'
          ? controlMass.components.aggregate
          : null,
      activeKg:
        mass.status === 'CALCULATED' ? mass.components.aggregate : null,
      activeDryFractionPct: mass.dryFractions?.aggregate ?? null,
    },
    {
      id: 'admixture',
      label: 'Admixture Kimia',
      roleNote: 'Bahan tambah kimia campuran kering',
      controlKg:
        controlMass.status === 'CALCULATED'
          ? controlMass.components.admixture
          : null,
      activeKg:
        mass.status === 'CALCULATED' ? mass.components.admixture : null,
      activeDryFractionPct: mass.dryFractions?.admixture ?? null,
    },
    {
      id: 'dry-mix-total',
      label: 'Total Campuran Kering',
      roleNote: 'Semen + residu silika + agregat + admixture',
      controlKg: controlMass.dryTotalKg,
      activeKg: mass.dryTotalKg,
      activeDryFractionPct:
        mass.dryTotalKg !== null && mass.dryTotalKg > 0 ? 100 : null,
      isSubtotal: true,
    },
    {
      id: 'water',
      label: 'Air Pencampur',
      roleNote: 'Komponen cair batch (di luar fraksi kering)',
      controlKg:
        controlMass.status === 'CALCULATED'
          ? controlMass.components.water
          : null,
      activeKg: mass.status === 'CALCULATED' ? mass.components.water : null,
      activeDryFractionPct: null,
    },
    {
      id: 'total-batch',
      label: 'Total Massa Batch Basah',
      roleNote: 'Total campuran kering + air pencampur',
      controlKg: controlMass.totalBatchKg,
      activeKg: mass.totalBatchKg,
      activeDryFractionPct: null,
      isTotal: true,
    },
  ];

  // Binder split based on initial cement mass (100% initial cement mass = cement share + residue share)
  const binderResiduePct = Math.max(0, Math.min(100, mix.substitution));
  const binderCementPct = Math.max(0, 100 - binderResiduePct);

  // Non-blocking UI notices when typed values exceed standard exploration ranges
  const substitutionNotice =
    mix.substitution > 100
      ? `Nilai substitusi (${mix.substitution}%) melebihi 100% massa semen. Engine neraca massa menandai proporsi > 100% sebagai input tidak valid.`
      : mix.substitution > 30
      ? `Nilai substitusi (${mix.substitution}%) berada di atas rentang slider eksplorasi UI (0–30%). Nilai Anda tetap digunakan apa adanya tanpa pemotongan.`
      : null;

  const waterRatioNotice =
    mix.waterRatio < 0.35 || mix.waterRatio > 0.8
      ? `Rasio W/B (${mix.waterRatio}) berada di luar rentang slider eksplorasi UI (0.35–0.80). Nilai Anda tetap disimpan apa adanya.`
      : null;

  const particleSizeNotice =
    mix.particleSize < 50 || mix.particleSize > 300
      ? `Target ukuran partikel (${mix.particleSize} µm) berada di luar rentang slider eksplorasi UI (50–300 µm). Nilai Anda tetap disimpan apa adanya.`
      : null;

  const hasInvalidGeometry =
    mix.blockLengthMm <= 0 ||
    mix.blockWidthMm <= 0 ||
    mix.blockThicknessMm <= 0;

  return (
    <div className="space-y-6" data-testid="formulation-stage-content">
      {/* 1. Top Stage Context Banner & Canonical Reset */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <span>Basis Substitusi: Massa Semen (CEMENT MASS)</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md font-medium bg-white text-slate-700 border border-slate-200">
              Mode Aktif:{' '}
              <strong className="ml-1 font-semibold text-slate-900">
                {studyMode === 'actual'
                  ? 'Data Aktual Pengguna'
                  : 'Pratinjau Studi (Demo)'}
              </strong>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Atur proporsi substitusi residu silika, rasio air terhadap pengikat
            (W/B), target kehalusan partikel, kelas mutu sasaran SNI
            03-0691-1996, dan dimensi geometri paving block. Perubahan langsung
            memperbarui state kanonik simulasi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetMix}
            disabled={isDefaultMix}
            data-testid="button-reset-mix"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[42px] text-xs font-semibold rounded-xl border transition-colors ${
              isDefaultMix
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Reset ke Default Formulasi</span>
          </button>
        </div>
      </div>

      {/* 2. Main Responsive Grid: Controls (Left) & Active Parameter Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formulation Controls */}
        <div className="lg:col-span-8 space-y-5">
          {/* Control Card 1: Silica Residue Substitution */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Parameter 01 · Proporsi Pengikat
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Substitusi Residu Silika terhadap Massa Semen
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Persentase massa semen Portland yang digantikan oleh residu
                  silika panas bumi (1:1 berbasis massa semen).
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200 tabular-nums">
                  {mix.substitution}% massa semen
                </span>
              </div>
            </div>

            {/* Slider + Numeric Input */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label
                    htmlFor="slider-substitution"
                    className="font-medium text-slate-700"
                  >
                    Slider Eksplorasi UI (0% – 30%)
                  </label>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    Langkah slider: 1%
                  </span>
                </div>
                <input
                  id="slider-substitution"
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={Math.min(30, Math.max(0, mix.substitution))}
                  onChange={(e) => {
                    const nextVal = Number(e.target.value);
                    setSubstitutionInput(String(nextVal));
                    onUpdateMixField('substitution', nextVal);
                  }}
                  data-testid="slider-mix-substitution"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                  <span>0% (Kontrol)</span>
                  <span>3–12% (Literatur SRC-017)</span>
                  <span>30% (Batas Slider UI)</span>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="input-substitution"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Input Angka (%)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-substitution"
                    type="text"
                    inputMode="decimal"
                    value={substitutionInput}
                    onChange={(e) =>
                      handleNumericDraftChange(
                        'substitution',
                        e.target.value,
                        setSubstitutionInput,
                        4
                      )
                    }
                    onBlur={() =>
                      handleNumericBlur(
                        'substitution',
                        substitutionInput,
                        setSubstitutionInput
                      )
                    }
                    data-testid="input-mix-substitution"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-8 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Quick-select Reference Points: Control 0% & Canonical Literature Points from study.literaturePoints */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  Titik Acuan Eksperimen & Literatur Paving Block (
                  {study.evidenceSource?.id ?? 'SRC-017'} · Rentang{' '}
                  {study.directRange}):
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 0% Control Point */}
                {controlLiteraturePoint ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSubstitutionInput('0');
                      onUpdateMixField('substitution', 0);
                    }}
                    data-testid="chip-substitution-control-0"
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                      mix.substitution === 0
                        ? 'bg-sky-700 text-white border-sky-700'
                        : 'bg-sky-50/70 hover:bg-sky-100 text-sky-900 border-sky-200'
                    }`}
                  >
                    0% · Titik Kontrol (Tanpa Residu)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSubstitutionInput('0');
                      onUpdateMixField('substitution', 0);
                    }}
                    data-testid="chip-substitution-control-0"
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                      mix.substitution === 0
                        ? 'bg-sky-700 text-white border-sky-700'
                        : 'bg-sky-50/70 hover:bg-sky-100 text-sky-900 border-sky-200'
                    }`}
                  >
                    0% · Titik Kontrol (Tanpa Residu)
                  </button>
                )}

                {/* Canonical Literature Direct Substitution Points from study.literaturePoints */}
                {directSubstitutionPoints.map((pt) => {
                  const isSelected = mix.substitution === pt.replacement;
                  const isDefault = pt.replacement === defaultMix.substitution;
                  return (
                    <button
                      key={pt.replacement}
                      type="button"
                      onClick={() => {
                        setSubstitutionInput(String(pt.replacement));
                        onUpdateMixField('substitution', pt.replacement);
                      }}
                      data-testid={`chip-substitution-lit-${pt.replacement}`}
                      className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {pt.replacement}% · Literatur{' '}
                      {study.evidenceSource?.id ?? 'SRC-017'}
                      {isDefault ? ' (Default)' : ''}
                    </button>
                  );
                })}

                {/* Separate Default Preview Chip only if defaultMix.substitution is not already in directSubstitutionPoints */}
                {!isDefaultInDirectPoints && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubstitutionInput(String(defaultMix.substitution));
                      onUpdateMixField('substitution', defaultMix.substitution);
                    }}
                    data-testid="chip-substitution-default-8"
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                      mix.substitution === defaultMix.substitution
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {defaultMix.substitution}% · Default Pratinjau
                  </button>
                )}
              </div>
            </div>

            {/* Scientific Context Notice for Active Substitution */}
            <div
              className={`rounded-xl border p-3.5 text-xs space-y-1 ${substitutionContext.toneClass}`}
              data-testid="substitution-evidence-context"
            >
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>{substitutionContext.badgeText}</span>
              </div>
              <p className="leading-relaxed">
                {substitutionContext.description}
              </p>
            </div>

            {substitutionNotice && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{substitutionNotice}</span>
              </div>
            )}
          </div>

          {/* Control Card 2: Water-to-Binder Ratio (W/B) & Target Particle Size */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                Parameter 02 & 03 · Air/Pengikat & Kehalusan Partikel
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                Rasio Air terhadap Pengikat (W/B) & Target Ukuran Partikel
              </h2>
            </div>

            {/* Water-to-Binder Ratio (W/B) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label
                    htmlFor="input-water-ratio"
                    className="text-xs sm:text-sm font-bold text-slate-900"
                  >
                    Rasio Air terhadap Pengikat (W/B)
                  </label>
                  <p className="text-xs text-slate-500">
                    Rasio massa air terhadap pengikat awal. Literatur paving
                    langsung SRC-017 tidak melaporkan angka W/B eksplisit
                    sehingga parameter ini berstatus asumsi desain eksperimen.
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200 shrink-0 tabular-nums">
                  W/B = {mix.waterRatio}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Slider Eksplorasi UI (0.35 – 0.80)</span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      Langkah: 0.01 · Default: {defaultMix.waterRatio}
                    </span>
                  </div>
                  <input
                    id="slider-water-ratio"
                    type="range"
                    min={0.35}
                    max={0.8}
                    step={0.01}
                    value={Math.min(0.8, Math.max(0.35, mix.waterRatio))}
                    onChange={(e) => {
                      const nextVal = Number(e.target.value);
                      setWaterRatioInput(String(nextVal));
                      onUpdateMixField('waterRatio', nextVal);
                    }}
                    data-testid="slider-mix-water-ratio"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>0.35</span>
                    <span>{defaultMix.waterRatio} (Default)</span>
                    <span>0.80</span>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="input-water-ratio"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Input Rasio W/B
                  </label>
                  <input
                    id="input-water-ratio"
                    type="text"
                    inputMode="decimal"
                    value={waterRatioInput}
                    onChange={(e) =>
                      handleNumericDraftChange(
                        'waterRatio',
                        e.target.value,
                        setWaterRatioInput,
                        4
                      )
                    }
                    onBlur={() =>
                      handleNumericBlur(
                        'waterRatio',
                        waterRatioInput,
                        setWaterRatioInput
                      )
                    }
                    data-testid="input-mix-water-ratio"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                  />
                </div>
              </div>

              {waterRatioNotice && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{waterRatioNotice}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              {/* Target Particle Size */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label
                    htmlFor="input-particle-size"
                    className="text-xs sm:text-sm font-bold text-slate-900"
                  >
                    Target Ukuran Partikel Residu Silika (µm)
                  </label>
                  <p className="text-xs text-slate-500">
                    Sasaran kehalusan partikel residu pada formulasi kandidat
                    (dalam mikrometer / µm).
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200 shrink-0 tabular-nums">
                  {mix.particleSize} µm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Slider Eksplorasi UI (50 µm – 300 µm)</span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      Langkah: 5 µm · Default: {defaultMix.particleSize} µm
                    </span>
                  </div>
                  <input
                    id="slider-particle-size"
                    type="range"
                    min={50}
                    max={300}
                    step={5}
                    value={Math.min(300, Math.max(50, mix.particleSize))}
                    onChange={(e) => {
                      const nextVal = Number(e.target.value);
                      setParticleSizeInput(String(nextVal));
                      onUpdateMixField('particleSize', nextVal);
                    }}
                    data-testid="slider-mix-particle-size"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                    <span>50 µm (Halus)</span>
                    <span>{defaultMix.particleSize} µm (Default)</span>
                    <span>300 µm (Kasar)</span>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="input-particle-size"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Input Target (µm)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="input-particle-size"
                      type="text"
                      inputMode="decimal"
                      value={particleSizeInput}
                      onChange={(e) =>
                        handleNumericDraftChange(
                          'particleSize',
                          e.target.value,
                          setParticleSizeInput,
                          4
                        )
                      }
                      onBlur={() =>
                        handleNumericBlur(
                          'particleSize',
                          particleSizeInput,
                          setParticleSizeInput
                        )
                      }
                      data-testid="input-mix-particle-size"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                    />
                    <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                      µm
                    </span>
                  </div>
                </div>
              </div>

              {particleSizeNotice && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{particleSizeNotice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Control Card 3: Target SNI Class (A, B, C, D) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Parameter 04 · Sasaran Mutu Produk
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Kelas Mutu Sasaran SNI 03-0691-1996
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menentukan batas acuan syarat mutu pada Tahap 05 (Gerbang
                  Teknis). Memilih kelas sasaran tidak menyatakan kandidat telah
                  memenuhi SNI.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shrink-0">
                Target: Mutu Kelas {mix.targetClass}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SNI_TARGET_CLASSES.map((cls) => {
                const isSelected = mix.targetClass === cls;
                const record = sniClassRecords.find((r) => r.class === cls);

                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => onUpdateMixField('targetClass', cls)}
                    data-testid={`select-target-class-${cls}`}
                    aria-pressed={isSelected}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        KELAS {cls}
                      </span>
                      {record && (
                        <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                          Rata-rata ≥ {record.compressive_strength_avg_mpa} MPa
                        </span>
                      )}
                    </div>

                    {record && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-800">
                          Peruntukan: {record.intended_use}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                          Min ≥ {record.compressive_strength_min_mpa} MPa ·
                          Serapan air ≤ {record.water_absorption_avg_max_pct}%
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control Card 4: Block Geometry (Length, Width, Thickness in mm) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Parameter 05 · Geometri Spesimen / Produk
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Dimensi Geometri Paving Block (mm)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Digunakan oleh engine untuk menghitung volume blok dan
                  kebutuhan blok per m². Dimensi referensi literatur SRC-017:
                  200 × 100 × 60 mm.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-900 border border-slate-200 shrink-0 tabular-nums">
                <Ruler className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>
                  {mix.blockLengthMm} × {mix.blockWidthMm} ×{' '}
                  {mix.blockThicknessMm} mm
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Length */}
              <div>
                <label
                  htmlFor="input-block-length"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Panjang (mm)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-block-length"
                    type="text"
                    inputMode="decimal"
                    value={lengthInput}
                    onChange={(e) =>
                      handleNumericDraftChange(
                        'blockLengthMm',
                        e.target.value,
                        setLengthInput,
                        2
                      )
                    }
                    onBlur={() =>
                      handleNumericBlur(
                        'blockLengthMm',
                        lengthInput,
                        setLengthInput
                      )
                    }
                    data-testid="input-block-length"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-11 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Panduan UI: 50–500 mm (Default: {defaultMix.blockLengthMm} mm)
                </span>
              </div>

              {/* Width */}
              <div>
                <label
                  htmlFor="input-block-width"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Lebar (mm)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-block-width"
                    type="text"
                    inputMode="decimal"
                    value={widthInput}
                    onChange={(e) =>
                      handleNumericDraftChange(
                        'blockWidthMm',
                        e.target.value,
                        setWidthInput,
                        2
                      )
                    }
                    onBlur={() =>
                      handleNumericBlur(
                        'blockWidthMm',
                        widthInput,
                        setWidthInput
                      )
                    }
                    data-testid="input-block-width"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-11 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Panduan UI: 50–300 mm (Default: {defaultMix.blockWidthMm} mm)
                </span>
              </div>

              {/* Thickness */}
              <div>
                <label
                  htmlFor="input-block-thickness"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Tebal (mm)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="input-block-thickness"
                    type="text"
                    inputMode="decimal"
                    value={thicknessInput}
                    onChange={(e) =>
                      handleNumericDraftChange(
                        'blockThicknessMm',
                        e.target.value,
                        setThicknessInput,
                        2
                      )
                    }
                    onBlur={() =>
                      handleNumericBlur(
                        'blockThicknessMm',
                        thicknessInput,
                        setThicknessInput
                      )
                    }
                    data-testid="input-block-thickness"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-11 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none min-h-[42px] tabular-nums"
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    mm
                  </span>
                </div>
                <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                  Panduan UI: 20–150 mm (Default: {defaultMix.blockThicknessMm}{' '}
                  mm)
                </span>
              </div>
            </div>

            {hasInvalidGeometry && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>
                  Dimensi panjang, lebar, dan tebal harus bernilai lebih besar
                  dari 0 mm agar volume geometri dapat dihitung oleh engine.
                </span>
              </div>
            )}
          </div>

          {/* Card 5: Canonical Mass Balance Comparison Table (0% Control vs Active Candidate) */}
          <div
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
            data-testid="mass-balance-comparison-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  <span>Neraca Massa Kanonik · Kontrol 0% vs Kandidat Aktif</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Perbandingan Komposisi Batch & Massa per Blok
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dihitung langsung melalui fungsi neraca massa kanonik engine
                  berbasis massa semen awal ({study.state.formulation.replacementBasis}
                  ). Kontrol 0% dan kandidat aktif ({mix.substitution}%)
                  dievaluasi menggunakan input batch dan geometri yang sama.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                    mass.status === 'CALCULATED'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                  data-testid="mass-balance-table-status"
                >
                  {mass.status === 'CALCULATED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  )}
                  <span>{mass.status}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {studyMode === 'actual' ? 'Mode Aktual' : 'Basis Demo'}
                </span>
              </div>
            </div>

            {mass.status !== 'CALCULATED' && (
              <div
                className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 space-y-1.5"
                data-testid="mass-balance-data-required-alert"
              >
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Status Neraca Massa: {mass.status} (
                    {evidenceLabel(mass.status)})
                  </span>
                </div>
                <p className="leading-relaxed">
                  {studyMode === 'actual'
                    ? 'Mode Data Aktual Pengguna tidak menggunakan angka batch demo sebagai pengganti. Karena input batch produksi aktual (massa semen, agregat, air) belum lengkap atau proporsi substitusi tidak valid, seluruh komponen neraca massa berstatus DATA_REQUIRED.'
                    : 'Perhitungan neraca massa membutuhkan proporsi substitusi (0–100%) dan dimensi geometri positif (> 0 mm) agar dapat dihitung oleh engine.'}
                </p>
              </div>
            )}

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table
                className="w-full min-w-[640px] text-left border-collapse text-xs"
                data-testid="mass-balance-comparison-table"
              >
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-mono uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-3 font-bold">Komponen Material</th>
                    <th className="py-2.5 px-3 font-bold text-right">
                      Kontrol 0% (kg/batch)
                    </th>
                    <th className="py-2.5 px-3 font-bold text-right">
                      Kandidat Aktif {mix.substitution}% (kg/batch)
                    </th>
                    <th className="py-2.5 px-3 font-bold text-right">
                      Perubahan vs Kontrol (Δ kg)
                    </th>
                    <th className="py-2.5 px-3 font-bold text-right">
                      Fraksi Kering Aktif (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {massComparisonRows.map((row) => {
                    const delta = formatDeltaKgCell(
                      row.activeKg,
                      row.controlKg
                    );
                    const rowBgClass = row.isTotal
                      ? 'bg-emerald-50/50 font-bold text-slate-900'
                      : row.isSubtotal
                      ? 'bg-slate-50/90 font-semibold text-slate-900'
                      : 'bg-white text-slate-800';

                    return (
                      <tr
                        key={row.id}
                        className={rowBgClass}
                        data-testid={`mass-row-${row.id}`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">
                            {row.label}
                          </div>
                          <div className="text-[11px] font-normal text-slate-500">
                            {row.roleNote}
                          </div>
                        </td>
                        <td
                          className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700"
                          data-testid={`mass-control-${row.id}`}
                        >
                          {formatKgCell(row.controlKg, controlMass.status)}
                        </td>
                        <td
                          className="py-2.5 px-3 font-mono text-right tabular-nums font-semibold text-slate-900"
                          data-testid={`mass-active-${row.id}`}
                        >
                          {formatKgCell(row.activeKg, mass.status)}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-mono text-right tabular-nums ${delta.toneClass}`}
                          data-testid={`mass-delta-${row.id}`}
                        >
                          {delta.text}
                        </td>
                        <td
                          className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700"
                          data-testid={`mass-dry-fraction-${row.id}`}
                        >
                          {formatDryFractionCell(row.activeDryFractionPct)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Per-Block Mass Row (strictly from canonical blockMassKg; never uses assumed density) */}
                  <tr
                    className="bg-slate-100/80 border-t-2 border-slate-200 font-semibold text-slate-900"
                    data-testid="mass-row-block-mass"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        Massa per Blok (kg/blok)
                      </div>
                      <div className="text-[11px] font-normal text-slate-500">
                        Dihitung dari volume geometri kanonik × densitas terukur
                      </div>
                    </td>
                    <td
                      className="py-3 px-3 font-mono text-right tabular-nums"
                      data-testid="mass-control-block-mass"
                    >
                      {controlMass.blockMassKg !== null ? (
                        <span>
                          {controlMass.blockMassKg.toFixed(3)} kg
                          {studyMode === 'demo' ? ' (Demo)' : ''}
                        </span>
                      ) : controlMass.densityRequired ? (
                        <span className="text-amber-800">Perlu Densitas</span>
                      ) : (
                        <span className="text-amber-800">
                          {controlMass.status}
                        </span>
                      )}
                    </td>
                    <td
                      className="py-3 px-3 font-mono text-right tabular-nums font-bold"
                      data-testid="mass-active-block-mass"
                    >
                      {mass.blockMassKg !== null ? (
                        <span>
                          {mass.blockMassKg.toFixed(3)} kg
                          {studyMode === 'demo' ? ' (Demo)' : ''}
                        </span>
                      ) : mass.densityRequired ? (
                        <span className="text-amber-800">Perlu Densitas</span>
                      ) : (
                        <span className="text-amber-800">{mass.status}</span>
                      )}
                    </td>
                    <td
                      className="py-3 px-3 font-mono text-right tabular-nums text-slate-600"
                      data-testid="mass-delta-block-mass"
                    >
                      {mass.blockMassKg !== null &&
                      controlMass.blockMassKg !== null
                        ? `${(
                            mass.blockMassKg - controlMass.blockMassKg
                          ).toFixed(3)} kg`
                        : '—'}
                    </td>
                    <td className="py-3 px-3 font-mono text-right tabular-nums text-slate-400">
                      —
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed flex flex-wrap items-center justify-between gap-2 pt-1">
              <span>
                Catatan: Substitusi residu silika dilakukan 1:1 berbasis massa
                semen awal, sehingga total campuran kering dan total massa batch
                tetap konstan terhadap kontrol 0%.
              </span>
              {mass.densityRequired && (
                <span className="font-mono font-semibold text-amber-800">
                  Massa per blok: Perlu Densitas (tidak menggunakan densitas
                  asumsi)
                </span>
              )}
            </div>
          </div>

          {/* Card 6: Canonical 5-Candidate DOE Matrix */}
          <div
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
            data-testid="doe-candidate-matrix-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Table2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Matriks Rancangan Eksperimen (DOE) · Lima Kandidat Kanonik
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Matriks Kandidat Formulasi (`M0-CTRL` & `M1–M4`)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Disusun dari rencana DOE kanonik engine ({doePlan.design}) dan
                  jangkar bukti literatur paving langsung. Tidak mengarang hasil
                  eksperimen, jumlah replikasi, atau klaim optimum.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                    doePlan.status === 'READY_FOR_DESIGN'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                  data-testid="doe-plan-status-badge"
                >
                  {doePlan.status === 'READY_FOR_DESIGN' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  )}
                  <span>{doePlan.status}</span>
                </span>
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  data-testid="doe-model-status-badge"
                >
                  {doePlan.model.status}
                </span>
              </div>
            </div>

            {/* Stage 02 vs Stage 03 Particle Size Mismatch Warning (when measured PSD from Stage 02 differs from Stage 03 target PSD) */}
            {hasParticleSizeMismatch && (
              <div
                className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5"
                data-testid="doe-particle-mismatch-warning"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <div className="font-bold">
                    Perbedaan Ukuran Partikel Karakterisasi Tahap 02 vs Target
                    Formulasi Tahap 03
                  </div>
                  <p>
                    Ukuran partikel terukur pada Tahap 02 (
                    <strong className="font-mono">{measuredParticleUm} µm</strong>
                    ) berbeda dengan target ukuran partikel formulasi pada Tahap
                    03 (
                    <strong className="font-mono">{targetParticleUm} µm</strong>
                    ). Pastikan tahapan pra-pemrosesan (penggilingan/pengayakan)
                    disesuaikan untuk mencapai target ukuran partikel kandidat.
                  </p>
                </div>
              </div>
            )}

            {/* Empty State Handling */}
            {canonicalDoeRows.length === 0 ? (
              <div
                className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center space-y-1.5"
                data-testid="doe-matrix-empty-state"
              >
                <div className="text-xs font-bold text-slate-800">
                  Data Kandidat DOE Belum Tersedia (`DATA_REQUIRED`)
                </div>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Engine belum memiliki baris kandidat DOE maupun titik
                  literatur langsung untuk membentuk matriks lima kandidat.
                  Sistem tidak membuat kandidat sintetis atau mengarang nilai
                  substitusi.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table
                  className="w-full min-w-[780px] text-left border-collapse text-xs"
                  data-testid="doe-candidate-matrix-table"
                >
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-mono uppercase tracking-wider text-slate-600">
                      <th className="py-2.5 px-3 font-bold">ID</th>
                      <th className="py-2.5 px-3 font-bold">Peran Kandidat</th>
                      <th className="py-2.5 px-3 font-bold text-right">
                        Substitusi (%)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right">
                        Porsi Semen (%)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right">
                        Porsi Residu (%)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right">W/B</th>
                      <th className="py-2.5 px-3 font-bold text-right">
                        Target Partikel (µm)
                      </th>
                      <th className="py-2.5 px-3 font-bold">Evidence Anchor</th>
                      <th className="py-2.5 px-3 font-bold text-right">
                        Aksi Formulasi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {canonicalDoeRows.map((row) => {
                      const isRowActive =
                        row.substitutionPct !== null &&
                        Math.abs(mix.substitution - row.substitutionPct) < 1e-6;
                      const isControlRow = row.id === 'M0-CTRL' || row.role === 'CONTROL';

                      const rowBgClass = row.isCenter
                        ? 'bg-emerald-50/70 text-slate-900'
                        : isControlRow
                        ? 'bg-sky-50/40 text-slate-900'
                        : 'bg-white text-slate-800';

                      return (
                        <tr
                          key={row.id}
                          className={`${rowBgClass} transition-colors`}
                          data-testid={`doe-row-${row.id}`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{row.id}</span>
                              {row.isCenter && (
                                <span
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-700 text-white"
                                  data-testid={`doe-center-badge-${row.id}`}
                                >
                                  CENTER
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                                row.isCenter
                                  ? 'bg-emerald-100/90 text-emerald-950 border-emerald-300 font-bold'
                                  : isControlRow
                                  ? 'bg-sky-100/80 text-sky-900 border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {row.roleLabel}
                            </span>
                          </td>

                          <td
                            className="py-2.5 px-3 font-mono font-bold text-right tabular-nums text-slate-900"
                            data-testid={`doe-sub-${row.id}`}
                          >
                            {row.substitutionPct !== null
                              ? `${row.substitutionPct}%`
                              : 'DATA_REQUIRED'}
                          </td>

                          <td
                            className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700"
                            data-testid={`doe-cement-${row.id}`}
                          >
                            {row.cementSharePct !== null
                              ? `${Number(row.cementSharePct.toFixed(2))}%`
                              : 'DATA_REQUIRED'}
                          </td>

                          <td
                            className="py-2.5 px-3 font-mono text-right tabular-nums text-emerald-800 font-semibold"
                            data-testid={`doe-residue-${row.id}`}
                          >
                            {row.residueSharePct !== null
                              ? `${Number(row.residueSharePct.toFixed(2))}%`
                              : 'DATA_REQUIRED'}
                          </td>

                          <td
                            className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700"
                            data-testid={`doe-wb-${row.id}`}
                          >
                            {row.waterRatio !== null
                              ? row.waterRatio
                              : 'DATA_REQUIRED'}
                          </td>

                          <td
                            className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700"
                            data-testid={`doe-particle-${row.id}`}
                          >
                            {row.targetParticleSizeUm !== null
                              ? `${row.targetParticleSizeUm} µm`
                              : 'DATA_REQUIRED'}
                          </td>

                          <td
                            className="py-2.5 px-3 text-[11px] font-mono text-slate-600"
                            data-testid={`doe-anchor-${row.id}`}
                          >
                            {row.evidenceAnchor ?? 'NOT_DEFINED'}
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              disabled={row.substitutionPct === null}
                              onClick={() => {
                                if (row.substitutionPct !== null) {
                                  onUpdateMixField(
                                    'substitution',
                                    row.substitutionPct
                                  );
                                }
                              }}
                              data-testid={`doe-apply-${row.id}`}
                              className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                                row.substitutionPct === null
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : isRowActive
                                  ? 'bg-emerald-700 text-white border border-emerald-700'
                                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {isRowActive ? (
                                <>
                                  <Check className="w-3 h-3 shrink-0" />
                                  <span>Digunakan ({row.substitutionPct}%)</span>
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

            {/* Canonical DOE Notes & Model Path from Engine */}
            <div
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5 text-xs"
              data-testid="doe-engine-notes"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Catatan Rancangan Eksperimen (DOE) Kanonik Engine</span>
                </span>
                <span className="font-mono text-[11px] text-slate-600">
                  Jalur Model: {doePlan.model.path.join(' → ')}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {doePlan.model.note}
              </p>

              {doePlan.notes.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/80">
                  {doePlan.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Brief Active Formulation Summary Card */}
        <aside className="lg:col-span-4 space-y-4">
          <div
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
            data-testid="formulation-active-summary"
          >
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900">
                  Ringkasan Parameter Aktif
                </h3>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                STATE KANONIK
              </span>
            </div>

            {/* 1. Binder Proportion Visualization (Basis Massa Semen) */}
            <div
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5"
              data-testid="binder-proportion-card"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800">
                  Proporsi Pengikat (100% Basis)
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                  {study.state.formulation.replacementBasis}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                <div
                  className="bg-slate-700 h-full transition-all duration-200"
                  style={{ width: `${binderCementPct}%` }}
                  title={`Semen Portland: ${binderCementPct}%`}
                />
                <div
                  className="bg-emerald-600 h-full transition-all duration-200"
                  style={{ width: `${binderResiduePct}%` }}
                  title={`Residu Silika: ${binderResiduePct}%`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                <div className="rounded-lg bg-white border border-slate-200 p-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                    <span>Semen Portland</span>
                  </div>
                  <div
                    className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums"
                    data-testid="binder-cement-pct"
                  >
                    {Number(binderCementPct.toFixed(4))}%
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span>Residu Silika</span>
                  </div>
                  <div
                    className="font-mono font-bold text-emerald-800 mt-0.5 tabular-nums"
                    data-testid="binder-residue-pct"
                  >
                    {Number(binderResiduePct.toFixed(4))}%
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Dihitung terhadap 100% massa semen awal (Titik Kontrol 0% = 100%
                semen Portland : 0% residu). Agregat dan air dihitung sebagai
                komponen batch terpisah.
              </p>
            </div>

            {/* 2. Active Parameters Readout */}
            <dl className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Substitusi Residu Silika</dt>
                <dd className="font-mono font-bold text-slate-900 tabular-nums">
                  {mix.substitution}% massa semen
                </dd>
              </div>

              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Rasio Air / Pengikat (W/B)</dt>
                <dd className="font-mono font-bold text-slate-900 tabular-nums">
                  {mix.waterRatio}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Target Ukuran Partikel</dt>
                <dd className="font-mono font-bold text-slate-900 tabular-nums">
                  {mix.particleSize} µm
                </dd>
              </div>

              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Kelas Mutu Sasaran SNI</dt>
                <dd className="font-mono font-bold text-emerald-800">
                  Kelas {mix.targetClass}
                  {activeSniClassRecord
                    ? ` (≥ ${activeSniClassRecord.compressive_strength_avg_mpa} MPa)`
                    : ''}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100">
                <dt className="text-slate-500">Status Bukti Campuran</dt>
                <dd className="font-semibold text-slate-800 text-right">
                  {evidenceLabel(evidenceStatus)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-2 py-1.5">
                <dt className="text-slate-500">Status Neraca Massa Engine</dt>
                <dd className="font-mono font-semibold text-slate-800">
                  {massBalanceStatus === 'CALCULATED' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>CALCULATED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{massBalanceStatus}</span>
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            {/* 3. Canonical Geometry & Block Mass Summary from study.state.massBalance */}
            <div
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5"
              data-testid="canonical-geometry-summary"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Geometri & Massa per Blok</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {evidenceLabel(mass.status)}
                </span>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500">Dimensi (P × L × T)</dt>
                  <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                    {mix.blockLengthMm} × {mix.blockWidthMm} ×{' '}
                    {mix.blockThicknessMm} mm
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500">Volume Kanonik per Blok</dt>
                  <dd
                    className="font-mono font-semibold text-slate-900 tabular-nums text-right"
                    data-testid="canonical-volume-m3"
                  >
                    {mass.volumeM3 !== null
                      ? `${mass.volumeM3.toFixed(6)} m³`
                      : evidenceLabel(mass.status)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500">Kebutuhan Blok per m²</dt>
                  <dd
                    className="font-mono font-semibold text-slate-900 tabular-nums text-right"
                    data-testid="canonical-blocks-per-m2"
                  >
                    {mass.blocksPerM2 !== null
                      ? `${Number(mass.blocksPerM2.toFixed(2))} blok/m²`
                      : evidenceLabel(mass.status)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/80">
                  <dt className="text-slate-500">Massa per Blok</dt>
                  <dd
                    className="font-mono font-bold text-slate-900 tabular-nums text-right"
                    data-testid="canonical-block-mass-kg"
                  >
                    {mass.blockMassKg !== null ? (
                      <span>
                        {mass.blockMassKg.toFixed(3)} kg
                        {studyMode === 'demo' ? ' (Basis Demo)' : ''}
                      </span>
                    ) : (
                      <span className="text-amber-800">
                        {mass.densityRequired
                          ? `${evidenceLabel('DATA_REQUIRED')} (Perlu Densitas)`
                          : evidenceLabel(mass.status)}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              {mass.volumeM3 === null && (
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Output neraca massa & turunan geometri kanonik berstatus{' '}
                  <strong>{mass.status}</strong> karena input produksi batch
                  aktual belum lengkap.
                </p>
              )}
            </div>

            {/* 4. Material Qualification & Formulation Space Status (study.science) */}
            <div
              className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5"
              data-testid="formulation-science-status"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <TestTube2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Kualifikasi Material & Ruang Faktor</span>
                </span>
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    qualification.status === 'QUALIFIED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : qualification.status === 'CONDITIONAL'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                  data-testid="qualification-status-badge"
                >
                  {evidenceLabel(qualification.status)} (
                  {qualification.completeness}%)
                </span>
              </div>

              {qualification.missing.length > 0 && (
                <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2 leading-relaxed">
                  <strong>Field Tahap 02 belum lengkap:</strong>{' '}
                  {qualification.missing.join(', ')}.
                </p>
              )}

              <div className="text-[11px] text-slate-600 space-y-1 leading-relaxed">
                <p>{formulationSpace.substitutionPct.rationale}</p>
                <p>{formulationSpace.particleSizeUm.rationale}</p>
              </div>

              {formulationSpace.activeCandidate.warning && (
                <div
                  className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed"
                  data-testid="formulation-space-warning"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{formulationSpace.activeCandidate.warning}</span>
                </div>
              )}
            </div>

            {/* Scientific Boundary Notice */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Catatan Batasan Ilmiah</span>
              </div>
              <p>
                Parameter formulasi di atas adalah konfigurasi kandidat
                eksperimen. Penetapan proporsi substitusi dan kelas sasaran SNI{' '}
                <strong>bukan klaim campuran optimum</strong> dan{' '}
                <strong>bukan bukti kelulusan SNI 03-0691-1996</strong> tanpa
                pengujian fisik aktual.
              </p>
            </div>

            {/* Quick Navigation Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSelectStage('simulation')}
                data-testid="button-formulation-to-simulation"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                <span>Lanjut ke Tahap 04: Analisis Kandidat</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onSelectStage('characterization')}
                data-testid="button-formulation-to-characterization"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[38px] rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span>Kembali ke Tahap 02: Karakterisasi Material</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
