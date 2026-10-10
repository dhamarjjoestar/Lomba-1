import React from 'react';
import {
  Leaf,
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
  Sliders,
  Factory,
  ShieldAlert,
  Calculator,
  Database,
  Truck,
  Zap,
  FlaskConical,
} from 'lucide-react';
import type {
  StudyResult,
  Characterization,
  MixControls,
  EconomicControls,
  BatchProductionInputs,
} from '../../engine/study';
import { DEMO_BATCH_INPUTS } from '../../engine/study';
import {
  environmentalAssumptions,
  formulaRegistry,
  normalizedEconomicScenario,
  sourceById,
} from '../../engine/data/master';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface EnvironmentStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  batchInputs: BatchProductionInputs;
  studyMode: 'demo' | 'actual';
  onUpdateMixField: <K extends keyof MixControls>(
    field: K,
    value: MixControls[K],
  ) => void;
  onUpdateEconomicsField: <K extends keyof EconomicControls>(
    field: K,
    value: EconomicControls[K],
  ) => void;
  onUpdateBatchInputsField: <K extends keyof BatchProductionInputs>(
    field: K,
    value: BatchProductionInputs[K],
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

function getEnvStatusMeta(status: string, complete: boolean): {
  label: string;
  tone: 'emerald' | 'amber' | 'rose' | 'slate';
  description: string;
} {
  if (status === 'CALCULATED' && complete) {
    return {
      label: 'CALCULATED · Inventaris Skrining Lingkungan Lengkap',
      tone: 'emerald',
      description:
        'Seluruh inventaris fisik dan faktor emisi pada batas sistem gate-to-gate tersedia untuk menghitung neraca emisi bersih.',
    };
  }
  if (status === 'DATA_REQUIRED' || !complete) {
    return {
      label: 'DATA_REQUIRED · Faktor Emisi & Inventaris Penuh Belum Lengkap',
      tone: 'amber',
      description:
        'Potensi penghindaran CO₂ terkait semen (kasar) dapat dihitung sebagai skrining awal, tetapi reduksi CO₂ bersih (net) belum dapat diklaim karena faktor emisi energi pemrosesan, transportasi, dan bahan kimia masih berstatus DATA_REQUIRED.',
    };
  }
  return {
    label: `${status || 'UNKNOWN'} · Status Belum Terdefinisi`,
    tone: 'slate',
    description:
      'Status skrining lingkungan belum dapat diverifikasi pada konfigurasi saat ini.',
  };
}

function getDecisionTone(
  decision: string,
): 'emerald' | 'amber' | 'rose' | 'slate' {
  if (decision === 'VALIDATED' || decision === 'PRELIMINARY_PROMISING') {
    return 'emerald';
  }
  if (decision === 'CONDITIONAL') return 'amber';
  if (decision === 'NOT_SUPPORTED') return 'rose';
  return 'slate';
}

function formatNumber(
  value: number | null | undefined,
  decimals = 2,
  fallback = 'DATA_REQUIRED',
): string {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const SUBSTITUTION_PRESETS = [0, 3, 5, 8, 10, 12, 15, 20];
const DISTANCE_PRESETS = [5, 10, 20, 50];

export const EnvironmentStageView: React.FC<EnvironmentStageViewProps> = ({
  study,
  characterization,
  mix,
  economics,
  batchInputs,
  studyMode,
  onUpdateMixField,
  onUpdateEconomicsField,
  onUpdateBatchInputsField,
  onSelectStage,
  displayDecision,
  evidenceLabel,
}) => {
  const env = study.state.environment;
  const massBalance = study.state.massBalance;
  const tea = study.state.tea;
  const decisionResult = study.state.decision;

  const envStatusMeta = getEnvStatusMeta(env.status, env.complete);
  const decisionTone = getDecisionTone(decisionResult.decision);

  // Physical inventory quantities from canonical engine
  const cementReplacedKg = massBalance.cementReplacedKg;
  const cementBaselineKg =
    studyMode === 'demo' ? DEMO_BATCH_INPUTS.cementKg : batchInputs.cementKg;
  const cementFinalKg = massBalance.cementFinalKg;
  const residueKg = massBalance.residueKg;
  const processingEnergyKwh = tea.processingEnergyKwh;
  const activeScenario = normalizedEconomicScenario(economics.scenario);
  const rawDistance =
    economics.transportDistanceKm ??
    activeScenario.transport_distance_km?.value ??
    null;
  const transportDistanceKm =
    typeof rawDistance === 'number' ? rawDistance : null;
  const transportTonKm =
    massBalance.status === 'CALCULATED' &&
    residueKg != null &&
    residueKg > 0
      ? transportDistanceKm == null
        ? null
        : (residueKg / 1000) * transportDistanceKm
      : massBalance.status === 'CALCULATED'
        ? 0
        : null;
  const chemicalKg = env.chemicalKg;

  const activeBatchBlocks =
    studyMode === 'demo'
      ? DEMO_BATCH_INPUTS.batchBlocks
      : batchInputs.batchBlocks;
  const blocksPerM2 = massBalance.blocksPerM2;

  // Derived per-block and per-m2 gross cement CO2 avoidance (pure unit scaling from canonical env.avoided)
  const avoidedPerBlockKgCo2 =
    env.avoided != null && activeBatchBlocks != null && activeBatchBlocks > 0
      ? env.avoided / activeBatchBlocks
      : null;

  const avoidedPerM2KgCo2 =
    avoidedPerBlockKgCo2 != null && blocksPerM2 != null && blocksPerM2 > 0
      ? avoidedPerBlockKgCo2 * blocksPerM2
      : null;

  // Canonical cement emission factor sensitivity values from environmentalAssumptions
  const cementEfBase =
    environmentalAssumptions.cement_emission_factor_kgco2e_per_kg;
  const cementEfLow = environmentalAssumptions.cement_emission_factor_low;
  const cementEfHigh = environmentalAssumptions.cement_emission_factor_high;

  const avoidedLow =
    cementReplacedKg != null && cementEfLow != null
      ? cementReplacedKg * cementEfLow
      : null;
  const avoidedBase = env.avoided;
  const avoidedHigh =
    cementReplacedKg != null && cementEfHigh != null
      ? cementReplacedKg * cementEfHigh
      : null;

  // Relevant formulas from formulaRegistry
  const envFormulas = formulaRegistry.filter((f) =>
    ['FORM-011', 'FORM-012', 'FORM-013'].includes(f.id),
  );

  // Relevant canonical literature & reference sources for environmental screening
  const envSourceIds = ['SRC-009', 'SRC-015', 'SRC-016'];

  // Filter decision trace items related to environment
  const envDecisionTraces = decisionResult.trace.filter((t) =>
    /environmental|lingkungan|emisi|CO₂|CO2/i.test(t),
  );
  const envDecisionReasons = decisionResult.reasons.filter((r) =>
    /environmental|lingkungan|emisi|CO₂|CO2/i.test(r),
  );

  return (
    <div className="space-y-6">
      {/* 1. Ringkasan Konteks & Status Skrining Lingkungan */}
      <div
        data-testid="environment-context-section"
        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 border-b border-slate-200/80 pb-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-900 text-white">
                <Leaf className="w-3.5 h-3.5" />
                <span>TAHAP 07 · ENVIRONMENTAL SCREENING</span>
              </span>
              <ToneBadge tone={studyMode === 'actual' ? 'blue' : 'slate'}>
                Mode Studi:{' '}
                {studyMode === 'actual'
                  ? 'ACTUAL (Input Pengguna)'
                  : 'DEMO (Ilustratif)'}
              </ToneBadge>
              <ToneBadge tone={envStatusMeta.tone}>
                Status Lingkungan: {evidenceLabel(env.status)}
              </ToneBadge>
              <ToneBadge tone={decisionTone}>
                Status DSS: {displayDecision(decisionResult.decision)} (
                {decisionResult.decision})
              </ToneBadge>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Skrining Jejak Karbon Gate-to-Gate & Potensi Penghindaran CO₂
              Terkait Semen
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              {envStatusMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectStage('economics')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Tahap 06 (Ekonomi)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectStage('recommendation')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Tahap 08 (Keputusan)</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Boundary & Claim Policy Alert Banner */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 sm:p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-950">
            <div className="font-bold flex flex-wrap items-center gap-2">
              <span>
                Batas Klaim Karbon Kanonik:{' '}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">
                  default_net_co2_claim_allowed ={' '}
                  {String(
                    environmentalAssumptions.default_net_co2_claim_allowed,
                  )}
                </code>
              </span>
              <span className="font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-amber-800">
                Boundary: {env.boundary}
              </span>
            </div>
            <p className="leading-relaxed text-amber-900">
              Nilai{' '}
              <span className="font-semibold">{env.avoidanceLabel}</span> hanya
              merepresentasikan estimasi kasar pengurangan emisi dari semen
              Portland yang tergantikan pada batas{' '}
              <span className="font-mono font-semibold">
                {environmentalAssumptions.scope}
              </span>
              . Angka ini <strong>bukan</strong> klaim reduksi emisi CO₂ bersih
              (<em>net carbon reduction</em>) karena beban emisi dari energi
              pengeringan/penggilingan residu, transportasi, dan bahan kimia
              tambahan belum memiliki faktor emisi lokal yang terverifikasi (
              <span className="font-mono font-semibold">DATA_REQUIRED</span>).
            </p>
          </div>
        </div>

        {/* Summary Context Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Identitas Batch & Material
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {characterization.source || 'Sumber belum diisi'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Batch: {characterization.batch || '—'} · Sampel:{' '}
              {characterization.sample || '—'}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Substitusi & Semen Terhindarkan
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-800 font-mono">
              {mix.substitution}% Substitusi ·{' '}
              {cementReplacedKg != null
                ? `${formatNumber(cementReplacedKg, 2)} kg/batch`
                : 'DATA_REQUIRED'}
            </div>
            <div className="text-[11px] text-slate-500">
              Semen awal:{' '}
              {cementBaselineKg != null ? `${cementBaselineKg} kg` : '—'} →
              Semen akhir:{' '}
              {cementFinalKg != null
                ? `${formatNumber(cementFinalKg, 2)} kg`
                : '—'}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-emerald-200 p-3.5 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              {env.avoidanceLabel} (Kasar)
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-900 font-mono">
              {env.avoided != null
                ? `${formatNumber(env.avoided, 2)} kgCO₂e / batch`
                : 'DATA_REQUIRED'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {avoidedPerBlockKgCo2 != null
                ? `${formatNumber(avoidedPerBlockKgCo2, 4)} kgCO₂e/blok`
                : 'Per blok: DATA_REQUIRED'}
              {avoidedPerM2KgCo2 != null
                ? ` · ${formatNumber(avoidedPerM2KgCo2, 2)} kgCO₂e/m²`
                : ''}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              Neraca Emisi Bersih (Net CO₂e)
            </div>
            <div className="text-sm sm:text-base font-extrabold text-amber-900 font-mono">
              {env.net != null
                ? `${formatNumber(env.net, 2)} kgCO₂e / batch`
                : 'DATA_REQUIRED (Belum Lengkap)'}
            </div>
            <div className="text-[11px] text-amber-700">
              {env.missing.length} parameter inventaris/faktor emisi belum
              tersedia
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kontrol Cepat Parameter yang Mempengaruhi Inventaris Lingkungan */}
      <div
        data-testid="environment-controls-section"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Parameter Penggerak Inventaris Fisik Lingkungan
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Perubahan kadar substitusi semen, jarak angkut residu, atau massa
              batch secara langsung memperbarui kuantitas aktivitas fisik pada
              mesin <code className="font-mono">calcEnvironment</code>.
            </p>
          </div>
          <ToneBadge tone="emerald">
            Sinkron dengan Tahap 03 & Tahap 06
          </ToneBadge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Substitution Control */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="env-substitution-range"
                className="text-xs font-bold text-slate-800"
              >
                Kadar Substitusi Semen oleh Residu Silika (%)
              </label>
              <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {mix.substitution}%
              </span>
            </div>
            <input
              id="env-substitution-range"
              type="range"
              min={0}
              max={30}
              step={1}
              value={mix.substitution}
              onChange={(e) =>
                onUpdateMixField('substitution', Number(e.target.value))
              }
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-500 mr-1">
                Titik uji cepat:
              </span>
              {SUBSTITUTION_PRESETS.map((pct) => {
                const active = mix.substitution === pct;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onUpdateMixField('substitution', pct)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer border ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport Distance Control */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="env-transport-distance-input"
                className="text-xs font-bold text-slate-800"
              >
                Jarak Transportasi Residu (km)
              </label>
              <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                Aktif:{' '}
                {transportDistanceKm != null
                  ? `${transportDistanceKm} km`
                  : 'DATA_REQUIRED'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="env-transport-distance-input"
                type="number"
                min={0}
                step={1}
                placeholder={`Default skenario (${transportDistanceKm ?? 10} km)`}
                value={
                  economics.transportDistanceKm == null
                    ? ''
                    : economics.transportDistanceKm
                }
                onChange={(e) => {
                  const raw = e.target.value.trim();
                  if (raw === '') {
                    onUpdateEconomicsField('transportDistanceKm', null);
                    return;
                  }
                  const parsed = Number(raw);
                  if (Number.isFinite(parsed) && parsed >= 0) {
                    onUpdateEconomicsField('transportDistanceKm', parsed);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              {economics.transportDistanceKm != null && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEconomicsField('transportDistanceKm', null)
                  }
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
                >
                  Reset Skenario
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-500 mr-1">
                Preset jarak:
              </span>
              {DISTANCE_PRESETS.map((km) => {
                const active = transportDistanceKm === km;
                return (
                  <button
                    key={km}
                    type="button"
                    onClick={() =>
                      onUpdateEconomicsField('transportDistanceKm', km)
                    }
                    className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer border ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {km} km
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actual Mode Batch Inputs Reminder / Quick Input */}
        {studyMode === 'actual' && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-blue-950">
                Input Massa Batch Aktual (Mode ACTUAL)
              </div>
              <span className="text-[11px] text-blue-800">
                Diperlukan agar massa semen terhindarkan dan inventaris
                admixture dapat dihitung pada mode aktual.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-blue-900 mb-1">
                  Semen Kontrol per Batch (kg)
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Mis. 50"
                  value={batchInputs.cementKg ?? ''}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    onUpdateBatchInputsField(
                      'cementKg',
                      v === '' ? null : Number(v),
                    );
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-blue-900 mb-1">
                  Admixture Kimia per Batch (kg)
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Mis. 0"
                  value={batchInputs.admixtureKg ?? ''}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    onUpdateBatchInputsField(
                      'admixtureKg',
                      v === '' ? null : Number(v),
                    );
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-blue-900 mb-1">
                  Jumlah Blok per Batch (unit)
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Mis. 100"
                  value={batchInputs.batchBlocks ?? ''}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    onUpdateBatchInputsField(
                      'batchBlocks',
                      v === '' ? null : Number(v),
                    );
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Dekomposisi Inventaris Aktivitas Fisik & Komponen Emisi (FORM-011 s.d. FORM-013) */}
      <div
        data-testid="environment-inventory-section"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Dekomposisi Inventaris Fisik & Komponen Neraca Emisi (
                <code className="font-mono">calcEnvironment</code>)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Persamaan kanonik <code className="font-mono">FORM-013</code>:{' '}
              <code className="font-mono text-slate-700">
                net_CO2 = avoided_CO2 - process_CO2 - transport_CO2 -
                chemical_CO2
              </code>
            </p>
          </div>
          <ToneBadge tone={env.complete ? 'emerald' : 'amber'}>
            {env.complete
              ? 'Inventaris Lengkap (complete = true)'
              : 'Inventaris Parsial (complete = false)'}
          </ToneBadge>
        </div>

        {/* 4 Component Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Cement Avoided CO2 */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Factory className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    1. {env.avoidanceLabel}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    FORM-011 & FORM-012 · Suku Positif (+avoided_CO2)
                  </div>
                </div>
              </div>
              <ToneBadge
                tone={env.avoided != null ? 'emerald' : 'amber'}
              >
                {env.avoided != null ? 'TERHITUNG (SKRINING)' : 'DATA DIPERLUKAN'}
              </ToneBadge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-lg p-3 border border-emerald-100">
              <div>
                <div className="text-[11px] text-slate-500">
                  Massa Semen Terhindarkan
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {cementReplacedKg != null
                    ? `${formatNumber(cementReplacedKg, 2)} kg/batch`
                    : 'DATA_REQUIRED'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">
                  Faktor Emisi Semen (Asumsi)
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {cementEfBase != null
                    ? `${cementEfBase} kgCO₂e/kg`
                    : 'DATA_REQUIRED'}
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-900">
                  Potensi Penghindaran Kasar (`env.avoided`):
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-800">
                  {env.avoided != null
                    ? `${formatNumber(env.avoided, 2)} kgCO₂e/batch`
                    : 'DATA_REQUIRED'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dihitung dari selisih pemakaian semen kontrol terhadap kandidat (
              <code className="font-mono">{mix.substitution}%</code> substitusi
              massa semen). Menggunakan faktor skrining{' '}
              <code className="font-mono">0.85 kgCO₂e/kg</code> berstatus{' '}
              <code className="font-mono">
                {environmentalAssumptions.cement_emission_factor_status}
              </code>
              .
            </p>
          </div>

          {/* Card 2: Processing Energy CO2 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    2. Beban Emisi Energi Pemrosesan Residu
                  </div>
                  <div className="text-[11px] text-amber-800 font-mono">
                    FORM-007 & FORM-013 · Suku Pengurang (-process_CO2)
                  </div>
                </div>
              </div>
              <ToneBadge tone={env.process != null ? 'emerald' : 'amber'}>
                {env.process != null ? 'TERHITUNG' : 'DATA DIPERLUKAN'}
              </ToneBadge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-lg p-3 border border-amber-100">
              <div>
                <div className="text-[11px] text-slate-500">
                  Inventaris Energi Proses (`tea.processingEnergyKwh`)
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {processingEnergyKwh != null
                    ? `${formatNumber(processingEnergyKwh, 3)} kWh/batch`
                    : 'DATA_REQUIRED'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">
                  Faktor Emisi Listrik Grid (`electricityEF`)
                </div>
                <div className="font-mono font-bold text-amber-800">
                  {environmentalAssumptions.electricity_emission_factor_kgco2e_per_kwh !=
                  null
                    ? `${environmentalAssumptions.electricity_emission_factor_kgco2e_per_kwh} kgCO₂e/kWh`
                    : 'null (DATA_REQUIRED)'}
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Beban Emisi Pemrosesan (`env.process`):
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">
                  {env.process != null
                    ? `${formatNumber(env.process, 2)} kgCO₂e/batch`
                    : 'DATA_REQUIRED'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kuantitas energi pengeringan, penggilingan, dan klasifikasi residu
              sudah dihitung di TEA, tetapi faktor emisi jaringan listrik
              spesifik lokasi belum ditetapkan dalam registri kanonik sehingga
              emisi proses tidak dihitung sembarangan.
            </p>
          </div>

          {/* Card 3: Transport CO2 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    3. Beban Emisi Transportasi Residu
                  </div>
                  <div className="text-[11px] text-amber-800 font-mono">
                    FORM-013 · Suku Pengurang (-transport_CO2)
                  </div>
                </div>
              </div>
              <ToneBadge tone={env.transport != null ? 'emerald' : 'amber'}>
                {env.transport != null ? 'TERHITUNG' : 'DATA DIPERLUKAN'}
              </ToneBadge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-lg p-3 border border-amber-100">
              <div>
                <div className="text-[11px] text-slate-500">
                  Inventaris Angkut (`transportTonKm`)
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {transportTonKm != null
                    ? `${formatNumber(transportTonKm, 4)} ton-km/batch`
                    : 'DATA_REQUIRED'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">
                  Faktor Emisi Angkut (`transportEF`)
                </div>
                <div className="font-mono font-bold text-amber-800">
                  {environmentalAssumptions.transport_emission_factor_kgco2e_per_ton_km !=
                  null
                    ? `${environmentalAssumptions.transport_emission_factor_kgco2e_per_ton_km} kgCO₂e/t-km`
                    : 'null (DATA_REQUIRED)'}
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Beban Emisi Transportasi (`env.transport`):
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">
                  {env.transport != null
                    ? `${formatNumber(env.transport, 2)} kgCO₂e/batch`
                    : 'DATA_REQUIRED'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dihitung dari massa residu{' '}
              <code className="font-mono">
                {residueKg != null
                  ? `${formatNumber(residueKg, 2)} kg`
                  : '—'}
              </code>{' '}
              dan jarak angkut{' '}
              <code className="font-mono">
                {transportDistanceKm != null ? `${transportDistanceKm} km` : '—'}
              </code>
              . Faktor emisi moda truk lokal masih berstatus{' '}
              <code className="font-mono">DATA_REQUIRED</code>.
            </p>
          </div>

          {/* Card 4: Chemical / Admixture CO2 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    4. Beban Emisi Bahan Kimia / Admixture
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    FORM-013 · Suku Pengurang (-chemical_CO2)
                  </div>
                </div>
              </div>
              <ToneBadge tone={env.chemical != null ? 'emerald' : 'amber'}>
                {env.chemical != null ? 'TERHITUNG' : 'DATA DIPERLUKAN'}
              </ToneBadge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-lg p-3 border border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500">
                  Inventaris Bahan Kimia (`env.chemicalKg`)
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {chemicalKg != null
                    ? `${formatNumber(chemicalKg, 2)} kg/batch`
                    : 'DATA_REQUIRED'}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">
                  Faktor Emisi Bahan Kimia (`chemicalEF`)
                </div>
                <div className="font-mono font-bold text-amber-800">
                  {environmentalAssumptions.chemical_emission_factor_kgco2e_per_kg !=
                  null
                    ? `${environmentalAssumptions.chemical_emission_factor_kgco2e_per_kg} kgCO₂e/kg`
                    : 'null (DATA_REQUIRED)'}
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Beban Emisi Kimia (`env.chemical`):
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">
                  {env.chemical != null
                    ? `${formatNumber(env.chemical, 2)} kgCO₂e/batch`
                    : 'DATA_REQUIRED'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Apabila pra-pemrosesan atau campuran menggunakan bahan kimia
              ekstraksi/admixture (<code className="font-mono">&gt; 0 kg</code>
              ), faktor emisi bahan kimia wajib disertakan sebelum mengklaim
              manfaat karbon bersih.
            </p>
          </div>
        </div>

        {/* Missing Environmental Inventory / Factor Checklist */}
        {env.missing.length > 0 && (
          <div
            data-testid="environment-missing-list"
            className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Daftar Kebutuhan Data yang Menahan Klaim Emisi Bersih (
                <code className="font-mono">env.missing</code>):
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {env.missing.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white text-amber-900 border border-amber-300"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Sensitivitas Faktor Emisi Semen & Tabel Faktor Emisi Kanonik */}
      <div
        data-testid="environment-factors-section"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        {/* Cement EF Sensitivity Screening (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="space-y-1 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Sensitivitas Potensi Penghindaran CO₂ Semen
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Rentang faktor emisi semen dari{' '}
              <code className="font-mono">environmental_assumptions</code> untuk
              massa semen tergantikan saat ini (
              <code className="font-mono">
                {cementReplacedKg != null
                  ? `${formatNumber(cementReplacedKg, 2)} kg/batch`
                  : 'DATA_REQUIRED'}
              </code>
              ).
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Low Factor */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Batas Bawah (`cement_emission_factor_low`)
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Faktor: {cementEfLow} kgCO₂e / kg semen · Status: ASSUMPTION
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {avoidedLow != null
                    ? `${formatNumber(avoidedLow, 2)} kgCO₂e`
                    : 'DATA_REQUIRED'}
                </div>
                <div className="text-[10px] text-slate-500">per batch</div>
              </div>
            </div>

            {/* Base Factor (Active) */}
            <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-950">
                    Faktor Skrining Aktif (`cement_emission_factor`)
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-800 text-white rounded">
                    AKTIF
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-800">
                  Faktor: {cementEfBase} kgCO₂e / kg semen · Status:{' '}
                  {environmentalAssumptions.cement_emission_factor_status}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs sm:text-sm font-extrabold text-emerald-900">
                  {avoidedBase != null
                    ? `${formatNumber(avoidedBase, 2)} kgCO₂e`
                    : 'DATA_REQUIRED'}
                </div>
                <div className="text-[10px] text-emerald-700">per batch</div>
              </div>
            </div>

            {/* High Factor */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Batas Atas (`cement_emission_factor_high`)
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Faktor: {cementEfHigh} kgCO₂e / kg semen · Status: ASSUMPTION
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {avoidedHigh != null
                    ? `${formatNumber(avoidedHigh, 2)} kgCO₂e`
                    : 'DATA_REQUIRED'}
                </div>
                <div className="text-[10px] text-slate-500">per batch</div>
              </div>
            </div>
          </div>

          {/* Factor Note from master.json */}
          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 space-y-1 text-xs text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Catatan Metodologis Faktor Emisi (`factor_note`):</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {environmentalAssumptions.factor_note}
            </p>
          </div>
        </div>

        {/* Canonical Environmental Factors Registry Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <div className="space-y-1 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Registri Faktor Emisi Kanonik (
                <code className="font-mono">
                  environmental_assumptions.factors
                </code>
                )
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Daftar seluruh faktor emisi dalam basis data kanonik beserta
              status verifikasi, geografi, dan batas sistemnya.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-3">Parameter Faktor</th>
                  <th className="py-2.5 px-3">Nilai & Satuan</th>
                  <th className="py-2.5 px-3">Geografi / Cakupan</th>
                  <th className="py-2.5 px-3">Status Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {environmentalAssumptions.factors.map((f) => {
                  const isDataReq =
                    f.status === 'DATA_REQUIRED' || f.value == null;
                  return (
                    <tr key={f.factor} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        {f.factor}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {f.value != null ? (
                          <span className="font-bold text-slate-900">
                            {f.value} <span className="text-slate-500">{f.unit}</span>
                          </span>
                        ) : (
                          <span className="text-amber-800 font-semibold">
                            null ({f.unit})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 font-mono">
                        <div>{f.geography ?? 'Lokal (Belum Ditetapkan)'}</div>
                        <div className="text-slate-400">
                          {f.boundary ?? f.scope ?? '—'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <ToneBadge tone={isDataReq ? 'amber' : 'slate'}>
                          {evidenceLabel(f.status)}
                        </ToneBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Integrasi Jejak Audit DSS, Keterlacakan Formula & Referensi Ilmiah */}
      <div
        data-testid="environment-traceability-section"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Jejak Audit Keputusan Lingkungan, Formula Kanonik & Referensi
            Literatur
          </h3>
        </div>

        {/* DSS Environmental Trace */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-900">
              Implikasi Tahap 07 terhadap Keputusan DSS (`decisionEngine.ts` ·
              Aturan `DSS-007`)
            </h4>
            <ToneBadge tone={decisionTone}>
              Keputusan Saat Ini: {displayDecision(decisionResult.decision)}
            </ToneBadge>
          </div>
          <div className="space-y-1.5 text-xs text-slate-700">
            {envDecisionReasons.map((reason, idx) => (
              <div
                key={`reason-${idx}`}
                className="flex items-start gap-2 text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Alasan Penahan Validasi:</strong> {reason}
                </span>
              </div>
            ))}
            {envDecisionTraces.map((tr, idx) => (
              <div
                key={`trace-${idx}`}
                className="flex items-start gap-2 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-[11px]"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{tr}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Formula Registry */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Formula Skrining Lingkungan (`formula_registry`)
            </h4>
            <div className="space-y-2">
              {envFormulas.map((frm) => (
                <div
                  key={frm.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-emerald-800">
                      {frm.id} · {frm.name}
                    </span>
                    <ToneBadge
                      tone={
                        frm.status === 'CALCULATED' ? 'emerald' : 'amber'
                      }
                    >
                      {evidenceLabel(frm.status)}
                    </ToneBadge>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700">
                    {frm.formula}
                  </div>
                  {frm.limitations && frm.limitations.length > 0 && (
                    <div className="text-[10px] font-mono text-amber-800">
                      Batasan: {frm.limitations.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Source Registry */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Sumber Literatur & Referensi Emisi (`source_registry`)
            </h4>
            <div className="space-y-2">
              {envSourceIds.map((srcId) => {
                const src = sourceById(srcId);
                return (
                  <div
                    key={srcId}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {srcId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {src?.type ?? 'SOURCE'} · {src?.year ?? '—'}
                      </span>
                    </div>
                    <div className="font-medium text-slate-800">
                      {src?.title ?? 'Sumber Referensi Terdaftar'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {src?.authors ?? '—'} · Konteks: {src?.context ?? '—'} ·
                      Status: {evidenceLabel(src?.verification_status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
