import React from 'react';
import {
  TrendingUp,
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
  DollarSign,
  Sliders,
  Factory,
  RotateCcw,
  ShieldAlert,
  Calculator,
  Database,
} from 'lucide-react';
import type {
  StudyResult,
  Characterization,
  MixControls,
  EconomicControls,
  BatchProductionInputs,
} from '../../engine/study';
import {
  DEMO_BATCH_INPUTS,
  NOMINAL_DENSITY_KG_M3,
} from '../../engine/study';
import type {
  PaperScenarioName,
  PaperEconomicScenario,
  PaperBridgeResult,
} from '../../engine/lib/paperTeaEngine';
import {
  normalizedEconomicScenario,
  sourceById,
  formulaRegistry,
  type PaperEconomicScreeningRecord,
} from '../../engine/data/master';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface EconomicsStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  batchInputs: BatchProductionInputs;
  studyMode: 'demo' | 'actual';
  paperScenarioName: PaperScenarioName;
  paperScenario: PaperEconomicScenario;
  paperBridge: PaperBridgeResult;
  paperMeta: PaperEconomicScreeningRecord | undefined;
  onUpdateEconomicsField: <K extends keyof EconomicControls>(
    field: K,
    value: EconomicControls[K],
  ) => void;
  onUpdateBatchInputsField: <K extends keyof BatchProductionInputs>(
    field: K,
    value: BatchProductionInputs[K],
  ) => void;
  onSelectStage: (stageId: SimulationStageId) => void;
  formatIdr: (value: number | null) => string;
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

function getTeaStatusMeta(status: string): {
  label: string;
  tone: 'emerald' | 'amber' | 'rose' | 'slate';
  description: string;
} {
  switch (status) {
    case 'CALCULATED':
      return {
        label: 'CALCULATED · Perhitungan TEA Batch Aktif Tersedia',
        tone: 'emerald',
        description:
          'Biaya produksi per batch, per blok, dan per m² berhasil dihitung menggunakan neraca massa aktual dan skenario parameter ekonomi yang dipilih.',
      };
    case 'DATA_REQUIRED':
      return {
        label: 'DATA_REQUIRED · Menunggu Kelengkapan Input Produksi / Ekonomi',
        tone: 'amber',
        description:
          'Perhitungan TEA batch belum dapat diselesaikan karena sebagian data neraca massa atau parameter produksi batch belum terisi secara lengkap.',
      };
    default:
      return {
        label: `${status || 'UNKNOWN'} · Status Belum Terdefinisi`,
        tone: 'slate',
        description:
          'Status perhitungan ekonomi batch belum dapat diverifikasi pada konfigurasi saat ini.',
      };
  }
}

function getBridgeStatusMeta(status: PaperBridgeResult['status']): {
  label: string;
  tone: 'emerald' | 'amber' | 'rose' | 'slate';
  description: string;
} {
  switch (status) {
    case 'CALCULATED':
      return {
        label: 'CALCULATED · Dalam Jendela Ilustratif Literatur (5–15%)',
        tone: 'emerald',
        description:
          'Kadar substitusi kandidat aktif berada di dalam jendela skrining literatur (5–15%) untuk jembatan perhitungan serapan residu skala pabrik.',
      };
    case 'OUTSIDE_EVIDENCE_RANGE':
      return {
        label: 'OUTSIDE_EVIDENCE_RANGE · Di Luar Jendela Ilustratif (5–15%)',
        tone: 'amber',
        description:
          'Kadar substitusi kandidat aktif berada di luar rentang jembatan ilustratif manuskrip (5–15% massa semen).',
      };
    case 'DATA_REQUIRED':
    default:
      return {
        label: 'DATA_REQUIRED · Parameter Jembatan Belum Lengkap',
        tone: 'rose',
        description:
          'Perhitungan jembatan kebutuhan residu harian memerlukan parameter produksi yang valid.',
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

function formatNumber(
  value: number | null | undefined,
  maxFractionDigits = 2,
): string {
  if (value == null || !Number.isFinite(value)) return 'DATA REQUIRED';
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

function parseNullableNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

const MISSING_KEY_LABELS: Record<string, string> = {
  MASS_BALANCE_REQUIRED:
    'Neraca massa belum terhitung (memerlukan massa semen, agregat, air, atau dimensi blok yang valid)',
  batch_blocks: 'Jumlah blok per batch (batchBlocks harus > 0)',
  process_loss_pct: 'Persentase kehilangan proses (0% ≤ loss < 100%)',
  cement_pc_idr_kg: 'Harga semen Portland (IDR/kg)',
  fine_sand_idr_kg: 'Harga pasir halus / agregat (IDR/kg)',
  coarse_aggregate_idr_kg: 'Harga agregat kasar (IDR/kg)',
  residue_acquisition_idr_kg: 'Biaya akuisisi residu silika (IDR/kg)',
  water_idr_l: 'Biaya air proses (IDR/L)',
  admixture_idr_kg: 'Harga bahan tambah kimia / admixture (IDR/kg)',
  drying_energy_kwh_t: 'Energi pengeringan residu (kWh/ton)',
  grinding_energy_kwh_t: 'Energi penggilingan residu (kWh/ton)',
  classification_energy_kwh_t: 'Energi klasifikasi ukuran partikel (kWh/ton)',
  electricity_idr_kwh: 'Tarif listrik industri (IDR/kWh)',
  transport_distance_km: 'Jarak transportasi residu (km)',
  transport_idr_ton_km: 'Tarif angkutan darat (IDR/ton-km)',
  labor_hours_per_1000_blocks: 'Jam kerja tenaga kerja per 1.000 blok',
  general_worker_idr_day: 'Upah pekerja harian (IDR/hari)',
};

const SCENARIO_OPTIONS: Array<{
  id: EconomicControls['scenario'];
  label: string;
  paperMapping: PaperScenarioName;
  shortDesc: string;
}> = [
  {
    id: 'conservative',
    label: 'Conservative (Konservatif)',
    paperMapping: 'conservative',
    shortDesc:
      'Asumsi biaya bahan baku/utilitas lebih tinggi dan harga jual benchmark bawah.',
  },
  {
    id: 'baseline',
    label: 'Baseline (Dasar / Base)',
    paperMapping: 'base',
    shortDesc:
      'Asumsi acuan dasar normalisasi biaya regional Jawa Tengah / Dieng.',
  },
  {
    id: 'optimistic',
    label: 'Optimistic (Optimistis)',
    paperMapping: 'optimistic',
    shortDesc:
      'Asumsi efisiensi rantai pasok dan harga jual benchmark lebih menguntungkan.',
  },
];

export const EconomicsStageView: React.FC<EconomicsStageViewProps> = ({
  study,
  characterization,
  mix,
  economics,
  batchInputs,
  studyMode,
  paperScenarioName,
  paperScenario,
  paperBridge,
  paperMeta,
  onUpdateEconomicsField,
  onUpdateBatchInputsField,
  onSelectStage,
  formatIdr,
  displayDecision,
  evidenceLabel,
}) => {
  const tea = study.state.tea;
  const massBalance = study.state.massBalance;
  const decisionResult = study.state.decision;

  const teaStatusMeta = getTeaStatusMeta(tea.status);
  const bridgeStatusMeta = getBridgeStatusMeta(paperBridge.status);
  const decisionBadgeText = displayDecision(decisionResult.decision);
  const decisionTone = getDecisionTone(decisionBadgeText);

  const activeNormalizedScenario = normalizedEconomicScenario(
    economics.scenario,
  );

  // Effective water mass in actual mode when derived from cementKg * waterRatio
  const derivedActualWaterKg =
    batchInputs.waterKg ??
    (batchInputs.cementKg != null
      ? Number((batchInputs.cementKg * mix.waterRatio).toFixed(2))
      : null);

  // Commercial simulation based on optional user sellingPricePerBlock
  const userSellingPrice = economics.sellingPricePerBlock;
  const activeCostPerBlock = tea.costPerBlock;
  const simulatedMarginPerBlock =
    userSellingPrice != null && activeCostPerBlock != null
      ? userSellingPrice - activeCostPerBlock
      : null;
  const simulatedRevenuePerBatch =
    userSellingPrice != null &&
    (studyMode === 'demo'
      ? DEMO_BATCH_INPUTS.batchBlocks
      : batchInputs.batchBlocks) != null
      ? userSellingPrice *
        (studyMode === 'demo'
          ? DEMO_BATCH_INPUTS.batchBlocks
          : batchInputs.batchBlocks!)
      : null;
  const simulatedDailyOperatingMargin =
    simulatedMarginPerBlock != null && study.estimatedBlocksPerDay > 0
      ? simulatedMarginPerBlock * study.estimatedBlocksPerDay
      : null;

  // Comparison between active batch costPerBlock and paper benchmark productionCostPerBlock
  const costDeltaVsBenchmark =
    activeCostPerBlock != null
      ? activeCostPerBlock - paperScenario.productionCostPerBlock
      : null;

  // TEA formulas from canonical formulaRegistry
  const teaFormulas = formulaRegistry.filter((f) =>
    ['FRM-004', 'FRM-005', 'FRM-006', 'FRM-007', 'FRM-008', 'FRM-009'].includes(
      f.id,
    ),
  );

  // Unique source IDs referenced in normalized scenario + paperMeta
  const scenarioSourceIds = Array.from(
    new Set(
      [
        ...Object.values(activeNormalizedScenario)
          .map((item) => item.source_id)
          .filter((id): id is string => Boolean(id)),
        paperMeta?.source_id,
      ].filter((id): id is string => Boolean(id)),
    ),
  );

  const hasAnyOverride =
    economics.cementPriceIdrKg !== null ||
    economics.electricityPriceIdrKwh !== null ||
    economics.transportDistanceKm !== null ||
    economics.processingCostIdrTon !== null ||
    economics.sellingPricePerBlock !== null;

  const handleResetOverrides = () => {
    onUpdateEconomicsField('cementPriceIdrKg', null);
    onUpdateEconomicsField('electricityPriceIdrKwh', null);
    onUpdateEconomicsField('transportDistanceKm', null);
    onUpdateEconomicsField('processingCostIdrTon', null);
    onUpdateEconomicsField('sellingPricePerBlock', null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Ringkasan Konteks & Status Keekonomian */}
      <div
        data-testid="economics-context-section"
        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone={studyMode === 'demo' ? 'blue' : 'emerald'}>
                {studyMode === 'demo'
                  ? 'Mode Studi: Demo Kanonik'
                  : 'Mode Studi: Input Produksi Aktual'}
              </ToneBadge>
              <ToneBadge tone={teaStatusMeta.tone}>
                {teaStatusMeta.label}
              </ToneBadge>
              {paperMeta && (
                <ToneBadge tone="amber">
                  Kelas Estimasi: {paperMeta.estimate_class}
                </ToneBadge>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Identitas Kandidat Aktif & Konteks Evaluasi Keekonomian (TEA)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {teaStatusMeta.description}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shrink-0 space-y-1.5 lg:min-w-[260px]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Status Keputusan DSS Saat Ini
            </div>
            <div className="flex items-center gap-2">
              <ToneBadge tone={decisionTone}>{decisionBadgeText}</ToneBadge>
              <span className="text-xs font-mono text-slate-500">
                ({decisionResult.decision})
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Status kalkulasi TEA:{' '}
              <span className="font-mono font-semibold text-slate-700">
                {tea.status}
              </span>{' '}
              ({evidenceLabel(tea.status)})
            </div>
          </div>
        </div>

        {/* Context Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-medium text-slate-500">
              Identitas Batch & Material
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {characterization.batch || 'Batch Belum Diisi'} ·{' '}
              {characterization.sample || 'Sampel Belum Diisi'}
            </div>
            <div className="text-[11px] font-mono text-slate-500 truncate">
              {characterization.source || 'Sumber belum diisi'} (
              {characterization.materialId || '—'})
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-medium text-slate-500">
              Formulasi Kandidat & Kelas SNI
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">
              Substitusi {mix.substitution}% · Kelas Mutu {mix.targetClass}
            </div>
            <div className="text-[11px] text-slate-500">
              w/c {mix.waterRatio} · Partikel {mix.particleSize} µm · Dimensi{' '}
              {mix.blockLengthMm}×{mix.blockWidthMm}×{mix.blockThicknessMm} mm
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-medium text-slate-500">
              Skenario Ekonomi Aktif
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
              {economics.scenario} (Benchmark: {paperScenarioName})
            </div>
            <div className="text-[11px] text-slate-500">
              Output harian:{' '}
              <span className="font-mono font-semibold text-slate-700">
                {formatNumber(study.estimatedBlocksPerDay, 0)} blok/hari
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1">
            <div className="text-[11px] font-medium text-slate-500">
              Biaya Produksi Kandidat vs Benchmark
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
              {formatIdr(activeCostPerBlock)}{' '}
              <span className="text-[11px] font-sans font-normal text-slate-500">
                / blok
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Benchmark ({paperScenarioName}):{' '}
              <span className="font-mono font-semibold text-slate-700">
                {formatIdr(paperScenario.productionCostPerBlock)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kontrol Skenario & Override Parameter Ekonomi */}
      <div
        data-testid="economics-controls-section"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Sliders className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>KONTROL PARAMETER EKONOMI & SKENARIO</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Pemilih Skenario & Override Biaya Satuan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pilih skenario kurva biaya terstandarisasi atau masukkan nilai
              override spesifik lokasi untuk menguji sensitivitas biaya batch.
            </p>
          </div>

          {hasAnyOverride && (
            <button
              type="button"
              onClick={handleResetOverrides}
              data-testid="reset-economic-overrides-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default Skenario</span>
            </button>
          )}
        </div>

        {/* Scenario Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Pilih Skenario Ekonomi Kanonik (`economics.scenario`)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIO_OPTIONS.map((option) => {
              const isSelected = economics.scenario === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onUpdateEconomicsField('scenario', option.id)}
                  data-testid={`scenario-btn-${option.id}`}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-600'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isSelected ? 'text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <ToneBadge tone="emerald">Aktif</ToneBadge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {option.shortDesc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Paper: {option.paperMapping}</span>
                    <span>
                      Semen:{' '}
                      {
                        normalizedEconomicScenario(option.id).cement_pc_idr_kg
                          ?.value
                      }{' '}
                      IDR/kg
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Override Numeric Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* 1. Cement Price Override */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="input-cement-price"
                className="text-xs font-semibold text-slate-800"
              >
                Harga Semen PC (IDR/kg)
              </label>
              <ToneBadge
                tone={economics.cementPriceIdrKg != null ? 'blue' : 'slate'}
              >
                {economics.cementPriceIdrKg != null
                  ? 'Override Pengguna'
                  : 'Default Skenario'}
              </ToneBadge>
            </div>
            <input
              id="input-cement-price"
              type="number"
              min={0}
              step="50"
              placeholder={`Default: ${activeNormalizedScenario.cement_pc_idr_kg?.value ?? '—'} IDR/kg`}
              value={economics.cementPriceIdrKg ?? ''}
              onChange={(e) =>
                onUpdateEconomicsField(
                  'cementPriceIdrKg',
                  parseNullableNumber(e.target.value),
                )
              }
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                Default skenario:{' '}
                <strong className="font-mono text-slate-700">
                  {activeNormalizedScenario.cement_pc_idr_kg?.value ?? '—'}{' '}
                  IDR/kg
                </strong>
              </span>
              {economics.cementPriceIdrKg != null && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEconomicsField('cementPriceIdrKg', null)
                  }
                  className="text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 2. Electricity Price Override */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="input-electricity-price"
                className="text-xs font-semibold text-slate-800"
              >
                Tarif Listrik Proses (IDR/kWh)
              </label>
              <ToneBadge
                tone={
                  economics.electricityPriceIdrKwh != null ? 'blue' : 'slate'
                }
              >
                {economics.electricityPriceIdrKwh != null
                  ? 'Override Pengguna'
                  : 'Default Skenario'}
              </ToneBadge>
            </div>
            <input
              id="input-electricity-price"
              type="number"
              min={0}
              step="10"
              placeholder={`Default: ${activeNormalizedScenario.electricity_idr_kwh?.value ?? '—'} IDR/kWh`}
              value={economics.electricityPriceIdrKwh ?? ''}
              onChange={(e) =>
                onUpdateEconomicsField(
                  'electricityPriceIdrKwh',
                  parseNullableNumber(e.target.value),
                )
              }
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                Default skenario:{' '}
                <strong className="font-mono text-slate-700">
                  {activeNormalizedScenario.electricity_idr_kwh?.value ?? '—'}{' '}
                  IDR/kWh
                </strong>
              </span>
              {economics.electricityPriceIdrKwh != null && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEconomicsField('electricityPriceIdrKwh', null)
                  }
                  className="text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 3. Transport Distance Override */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="input-transport-distance"
                className="text-xs font-semibold text-slate-800"
              >
                Jarak Angkut Residu (km)
              </label>
              <ToneBadge
                tone={economics.transportDistanceKm != null ? 'blue' : 'slate'}
              >
                {economics.transportDistanceKm != null
                  ? 'Override Pengguna'
                  : 'Default Skenario'}
              </ToneBadge>
            </div>
            <input
              id="input-transport-distance"
              type="number"
              min={0}
              step="1"
              placeholder={`Default: ${activeNormalizedScenario.transport_distance_km?.value ?? '—'} km`}
              value={economics.transportDistanceKm ?? ''}
              onChange={(e) =>
                onUpdateEconomicsField(
                  'transportDistanceKm',
                  parseNullableNumber(e.target.value),
                )
              }
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                Default skenario:{' '}
                <strong className="font-mono text-slate-700">
                  {activeNormalizedScenario.transport_distance_km?.value ?? '—'}{' '}
                  km
                </strong>
              </span>
              {economics.transportDistanceKm != null && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEconomicsField('transportDistanceKm', null)
                  }
                  className="text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 4. Processing Cost Allowance Override */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="input-processing-allowance"
                className="text-xs font-semibold text-slate-800"
              >
                Tunjangan Olah Residu (IDR/ton)
              </label>
              <ToneBadge
                tone={economics.processingCostIdrTon != null ? 'blue' : 'slate'}
              >
                {economics.processingCostIdrTon != null
                  ? 'Override Pengguna'
                  : 'Default (0 IDR/ton)'}
              </ToneBadge>
            </div>
            <input
              id="input-processing-allowance"
              type="number"
              min={0}
              step="10000"
              placeholder="Default: 0 IDR/ton (opsional)"
              value={economics.processingCostIdrTon ?? ''}
              onChange={(e) =>
                onUpdateEconomicsField(
                  'processingCostIdrTon',
                  parseNullableNumber(e.target.value),
                )
              }
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Biaya non-energi tambahan per ton umpan residu</span>
              {economics.processingCostIdrTon != null && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateEconomicsField('processingCostIdrTon', null)
                  }
                  className="text-emerald-700 hover:underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 5. Selling Price Per Block (Simulasi Komersial) */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5 sm:col-span-2 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="input-selling-price"
                className="text-xs font-semibold text-slate-800"
              >
                Simulasi Harga Jual per Blok (IDR/blok) — Opsional
              </label>
              <ToneBadge
                tone={economics.sellingPricePerBlock != null ? 'blue' : 'slate'}
              >
                {economics.sellingPricePerBlock != null
                  ? 'Simulasi Margin Aktif'
                  : `Acuan Paper (${paperScenarioName}): ${formatIdr(paperScenario.sellingPricePerBlock)}`}
              </ToneBadge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <input
                id="input-selling-price"
                type="number"
                min={0}
                step="100"
                placeholder={`Contoh acuan paper: ${paperScenario.sellingPricePerBlock} IDR/blok`}
                value={economics.sellingPricePerBlock ?? ''}
                onChange={(e) =>
                  onUpdateEconomicsField(
                    'sellingPricePerBlock',
                    parseNullableNumber(e.target.value),
                  )
                }
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="text-[11px] text-slate-600 leading-snug">
                {userSellingPrice != null && simulatedMarginPerBlock != null ? (
                  <span>
                    Estimasi margin kotor batch aktif:{' '}
                    <strong
                      className={`font-mono ${
                        simulatedMarginPerBlock >= 0
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {formatIdr(simulatedMarginPerBlock)} / blok
                    </strong>{' '}
                    (Pendapatan batch: {formatIdr(simulatedRevenuePerBatch)})
                  </span>
                ) : (
                  <span>
                    Tidak mengubah perhitungan biaya pokok `calcTea`; digunakan
                    untuk menyandingkan harga jual target terhadap biaya per
                    blok kandidat aktif.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Input Produksi Batch & Pemisahan Mode Demo vs Actual */}
      <div
        data-testid="economics-batch-inputs-section"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Factory className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>PARAMETER PRODUKSI BATCH & NERACA MASSA</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Basis Kuantitas Produksi Batch (`batchInputs`)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Perhitungan biaya TEA memerlukan kuantitas bahan per batch serta
              target jumlah blok per batch. Engine memisahkan secara ketat data
              demo ilustratif dari input pabrik aktual.
            </p>
          </div>

          <ToneBadge tone={studyMode === 'demo' ? 'blue' : 'emerald'}>
            {studyMode === 'demo'
              ? 'DEMO_BATCH_INPUTS (Terkunci)'
              : 'Input Batch Aktual (Interaktif)'}
          </ToneBadge>
        </div>

        {studyMode === 'demo' ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3.5 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed space-y-1">
                <p className="font-semibold">
                  Mode Demo Aktif — Menggunakan Konstanta Kanonik{' '}
                  <code className="font-mono">DEMO_BATCH_INPUTS</code>
                </p>
                <p>
                  Pada mode demo, engine menggunakan parameter batch standar
                  agar alur perhitungan dapat ditinjau secara utuh. Untuk
                  menginput kapasitas batch laboratorium/pabrik Anda sendiri,
                  ubah mode studi ke <strong>Actual</strong> pada Tahap 02
                  (Karakterisasi Material).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Semen Awal (`cementKg`)
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {DEMO_BATCH_INPUTS.cementKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Agregat (`aggregateKg`)
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {DEMO_BATCH_INPUTS.aggregateKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Air (`cementKg × w/c`)
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {formatNumber(DEMO_BATCH_INPUTS.cementKg * mix.waterRatio, 2)}{' '}
                  kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Admixture (`admixtureKg`)
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {DEMO_BATCH_INPUTS.admixtureKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Output (`batchBlocks`)
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {DEMO_BATCH_INPUTS.batchBlocks} blok/batch
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Frekuensi & Densitas
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {DEMO_BATCH_INPUTS.batchesPerDay} batch/hr ·{' '}
                  {NOMINAL_DENSITY_KG_M3} kg/m³
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed space-y-1">
                <p className="font-semibold">
                  Mode Studi Aktual — Tanpa Fallback ke Nilai Demo
                </p>
                <p>
                  Pada mode aktual, nilai kosong (<code className="font-mono">null</code>) tidak akan digantikan oleh angka demo. Pastikan{' '}
                  <strong>massa semen</strong>, <strong>massa agregat</strong>,
                  dan <strong>jumlah blok per batch</strong> diisi agar neraca
                  massa dan biaya TEA dapat dihitung (<code className="font-mono">CALCULATED</code>).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* cementKg */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-cement-kg"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Massa Semen Basis (kg/batch) *
                </label>
                <input
                  id="batch-cement-kg"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="Wajib diisi (mis. 50)"
                  value={batchInputs.cementKg ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'cementKg',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Basis sebelum dikurangi substitusi {mix.substitution}%
                </span>
              </div>

              {/* aggregateKg */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-aggregate-kg"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Massa Agregat Pasir (kg/batch) *
                </label>
                <input
                  id="batch-aggregate-kg"
                  type="number"
                  min={0}
                  step="5"
                  placeholder="Wajib diisi (mis. 300)"
                  value={batchInputs.aggregateKg ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'aggregateKg',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Agregat halus untuk campuran paving block
                </span>
              </div>

              {/* waterKg */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-water-kg"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Massa Air (kg atau L/batch)
                </label>
                <input
                  id="batch-water-kg"
                  type="number"
                  min={0}
                  step="0.5"
                  placeholder={
                    derivedActualWaterKg != null
                      ? `Otomatis w/c: ${derivedActualWaterKg} kg`
                      : 'Opsional (otomatis dari w/c)'
                  }
                  value={batchInputs.waterKg ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'waterKg',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Jika kosong, dihitung dari cementKg × w/c ({mix.waterRatio})
                </span>
              </div>

              {/* admixtureKg */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-admixture-kg"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Massa Admixture (kg/batch)
                </label>
                <input
                  id="batch-admixture-kg"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="Default: 0 kg"
                  value={batchInputs.admixtureKg ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'admixtureKg',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Bahan tambah kimia (opsional, default 0 kg)
                </span>
              </div>

              {/* batchBlocks */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-blocks-count"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Jumlah Blok per Batch (blok) *
                </label>
                <input
                  id="batch-blocks-count"
                  type="number"
                  min={1}
                  step="1"
                  placeholder="Wajib > 0 (mis. 100)"
                  value={batchInputs.batchBlocks ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'batchBlocks',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Pembagi biaya batch menjadi biaya per blok
                </span>
              </div>

              {/* batchesPerDay */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label
                  htmlFor="batch-per-day"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Jumlah Batch per Hari (batch/hari)
                </label>
                <input
                  id="batch-per-day"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="Opsional (mis. 50)"
                  value={batchInputs.batchesPerDay ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'batchesPerDay',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Menentukan estimasi kapasitas harian pabrik
                </span>
              </div>

              {/* densityKgM3 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 sm:col-span-2">
                <label
                  htmlFor="batch-density"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Densitas Campuran Terukur (kg/m³)
                </label>
                <input
                  id="batch-density"
                  type="number"
                  min={0}
                  step="10"
                  placeholder="Opsional (mis. 2200 kg/m³)"
                  value={batchInputs.densityKgM3 ?? ''}
                  onChange={(e) =>
                    onUpdateBatchInputsField(
                      'densityKgM3',
                      parseNullableNumber(e.target.value),
                    )
                  }
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-white border border-slate-300 rounded-lg"
                />
                <span className="block text-[11px] text-slate-500">
                  Digunakan pada estimasi jumlah blok dari volume cetakan pada
                  neraca massa
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mass Balance Output Strip */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-slate-700">
              Ringkasan Neraca Massa Batch Aktif (`study.state.massBalance`)
            </span>
            <ToneBadge
              tone={massBalance.status === 'CALCULATED' ? 'emerald' : 'amber'}
            >
              Status Neraca Massa: {massBalance.status}
            </ToneBadge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Semen Terpakai (`cementFinalKg`)
              </div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {formatNumber(massBalance.cementFinalKg, 2)} kg
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Residu Silika (`residueKg`)
              </div>
              <div className="font-mono font-bold text-emerald-800 mt-0.5">
                {formatNumber(massBalance.residueKg, 2)} kg
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Semen Tersubstitusi
              </div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {formatNumber(massBalance.cementReplacedKg, 2)} kg
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Total Massa Batch
              </div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {formatNumber(massBalance.totalBatchKg, 2)} kg
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Kebutuhan Blok / m²
              </div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {formatNumber(massBalance.blocksPerM2, 1)} blok/m²
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">
                Energi Olah Residu
              </div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {formatNumber(tea.processingEnergyKwh, 3)} kWh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hasil TEA Batch Aktif (`study.state.tea`) */}
      <div
        data-testid="economics-active-tea-section"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Calculator className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>HASIL PERHITUNGAN TEA BATCH AKTIF (`calcTea`)</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Rincian Komponen Biaya Produksi Batch & Unit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Dihitung secara deterministik dari neraca massa kandidat aktif dan
              parameter skenario{' '}
              <strong className="capitalize">{economics.scenario}</strong>.
            </p>
          </div>
          <ToneBadge tone={teaStatusMeta.tone}>{tea.status}</ToneBadge>
        </div>

        {/* Missing Inputs Warning when DATA_REQUIRED */}
        {tea.status !== 'CALCULATED' && (
          <div
            data-testid="tea-data-required-banner"
            className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Perhitungan TEA Batch Belum Dapat Diselesaikan (`DATA_REQUIRED`)
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Engine tidak mengganti data yang kosong dengan angka palsu.
              Lengkapi parameter berikut pada bagian input di atas untuk
              mengaktifkan kalkulasi biaya batch:
            </p>
            {tea.missing.length > 0 && (
              <ul className="list-disc list-inside text-xs text-amber-900 space-y-1 font-medium">
                {tea.missing.map((key) => (
                  <li key={key}>
                    <code className="font-mono bg-amber-100/80 px-1.5 py-0.5 rounded">
                      {key}
                    </code>{' '}
                    — {MISSING_KEY_LABELS[key] ?? 'Parameter wajib belum terisi'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Headline Unit Costs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1">
            <div className="text-xs font-semibold text-emerald-900">
              Total Biaya Produksi per Batch (`tea.total`)
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-950">
              {formatIdr(tea.total)}
            </div>
            <div className="text-[11px] text-emerald-800">
              Akumulasi bahan baku, energi, transpor, tenaga kerja & tunjangan
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-700">
              Biaya Pokok Produksi per Blok (`tea.costPerBlock`)
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900">
              {formatIdr(tea.costPerBlock)}
            </div>
            <div className="text-[11px] text-slate-500">
              Dibagi{' '}
              {studyMode === 'demo'
                ? DEMO_BATCH_INPUTS.batchBlocks
                : (batchInputs.batchBlocks ?? '—')}{' '}
              blok/batch
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
            <div className="text-xs font-semibold text-slate-700">
              Biaya Pokok Produksi per m² (`tea.costPerM2`)
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900">
              {formatIdr(tea.costPerM2)}
            </div>
            <div className="text-[11px] text-slate-500">
              Basis luasan blok ({formatNumber(massBalance.blocksPerM2, 1)}{' '}
              blok/m²)
            </div>
          </div>
        </div>

        {/* Cost Component Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3.5 font-semibold">Komponen Biaya</th>
                <th className="py-2.5 px-3.5 font-semibold">
                  Formula & Driver Kuantitas
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-right">
                  Nilai Biaya Batch
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-right">
                  Porsi (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {[
                {
                  key: 'raw',
                  name: '1. Biaya Bahan Baku Campuran (tea.raw)',
                  driver:
                    'Semen akhir + agregat pasir + akuisisi residu + air + admixture (FRM-004)',
                  value: tea.raw,
                },
                {
                  key: 'energy',
                  name: '2. Biaya Energi Pengolahan Residu (tea.energy)',
                  driver: `Umpan residu terkoreksi susut × (pengeringan + penggilingan + klasifikasi) = ${formatNumber(tea.processingEnergyKwh, 3)} kWh (FRM-005)`,
                  value: tea.energy,
                },
                {
                  key: 'transport',
                  name: '3. Biaya Transportasi Residu (tea.transport)',
                  driver:
                    'Massa residu (ton) × jarak angkut (km) × tarif ton-km (FRM-006)',
                  value: tea.transport,
                },
                {
                  key: 'labor',
                  name: '4. Biaya Tenaga Kerja Cetak (tea.labor)',
                  driver:
                    '(Jam kerja per 1.000 blok / 8) × (blok batch / 1.000) × upah harian (FRM-007)',
                  value: tea.labor,
                },
                {
                  key: 'processingAllowance',
                  name: '5. Tunjangan Pengolahan Tambahan (tea.processingAllowance)',
                  driver:
                    'Massa umpan residu terkoreksi susut (ton) × tunjangan pengolahan (IDR/ton)',
                  value: tea.processingAllowance,
                },
              ].map((row) => {
                const pct =
                  row.value != null && tea.total != null && tea.total > 0
                    ? (row.value / tea.total) * 100
                    : null;
                return (
                  <tr key={row.key} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      {row.driver}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-900">
                      {formatIdr(row.value)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                      {pct != null ? `${formatNumber(pct, 1)}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                <td className="py-2.5 px-3.5" colSpan={2}>
                  Total Biaya Produksi Batch (`tea.total` · FRM-008)
                </td>
                <td className="py-2.5 px-3.5 text-right font-mono text-emerald-800">
                  {formatIdr(tea.total)}
                </td>
                <td className="py-2.5 px-3.5 text-right font-mono">
                  {tea.total != null ? '100%' : '—'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Active Scenario Parameters & Source Traceability */}
        <details className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 group">
          <summary className="text-xs font-bold text-slate-800 cursor-pointer flex items-center justify-between">
            <span>
              Lihat Tabel Parameter Skenario Normalisasi Aktif (
              <span className="capitalize">{economics.scenario}</span>) & Asumsi
              Efektif
            </span>
            <span className="text-[11px] font-normal text-emerald-700 group-open:underline">
              Tampilkan / Sembunyikan
            </span>
          </summary>
          <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="py-2 px-3 font-semibold">Parameter</th>
                  <th className="py-2 px-3 font-semibold text-right">
                    Nilai Skenario
                  </th>
                  <th className="py-2 px-3 font-semibold">Satuan</th>
                  <th className="py-2 px-3 font-semibold">Basis / Catatan</th>
                  <th className="py-2 px-3 font-semibold">Status & Sumber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(activeNormalizedScenario).map(([key, item]) => (
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 font-mono font-medium text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {formatNumber(item.value, 2)}
                    </td>
                    <td className="py-1.5 px-3 font-mono text-slate-600">
                      {item.unit || '—'}
                    </td>
                    <td className="py-1.5 px-3 text-slate-600">
                      {item.basis || '—'}
                    </td>
                    <td className="py-1.5 px-3 text-slate-600">
                      <span className="font-mono font-semibold">
                        {item.status}
                      </span>{' '}
                      {item.source_id ? `(${item.source_id})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* 5. Benchmark Skrining Ekonomi Manuskrip & Jembatan Residu (`paperTeaEngine`) */}
      <div
        data-testid="economics-paper-benchmark-section"
        className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 sm:p-6 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone="amber">
                BENCHMARK SKRINING MANUSKRIP · {paperMeta?.source_id ?? 'SRC-018'}
              </ToneBadge>
              <ToneBadge tone="slate">
                Skenario Benchmark: {paperScenarioName.toUpperCase()}
              </ToneBadge>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Benchmark Skrining Pabrik Manuskrip & Jembatan Serapan Residu
              Harian
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              Data pada bagian ini berasal dari tabel skrining tekno-ekonomi
              manuskrip studi (<strong>{paperMeta?.estimate_class}</strong>) dan{' '}
              <strong>bukan hasil pengukuran langsung batch aktif Anda</strong>.
              Digunakan sebagai pembanding biaya per blok serta penghubung
              kebutuhan residu terhadap kapasitas olah harian pabrik.
            </p>
          </div>

          {/* Comparison Callout Box */}
          <div className="bg-white rounded-xl border border-amber-200 p-3.5 shrink-0 space-y-1 lg:min-w-[270px]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Selisih Biaya Kandidat vs Benchmark
            </div>
            {costDeltaVsBenchmark != null ? (
              <>
                <div
                  className={`text-sm sm:text-base font-extrabold font-mono ${
                    costDeltaVsBenchmark <= 0
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {costDeltaVsBenchmark > 0 ? '+' : ''}
                  {formatIdr(costDeltaVsBenchmark)} / blok
                </div>
                <div className="text-[11px] text-slate-600">
                  {costDeltaVsBenchmark <= 0
                    ? 'Biaya kandidat ≤ biaya benchmark manuskrip (memenuhi syarat gerbang ekonomi DSS)'
                    : 'Biaya kandidat > biaya benchmark manuskrip (perlu optimasi biaya/kuantitas)'}
                </div>
              </>
            ) : (
              <div className="text-xs font-mono text-amber-800">
                Menunggu `tea.costPerBlock` terhitung
              </div>
            )}
          </div>
        </div>

        {/* Sub-grid: Paper Scenario Metrics vs Residue Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Paper Scenario Metrics */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Metrik Skenario Benchmark Manuskrip (`paperScenario`)
              </h3>
              <ToneBadge tone="slate">{paperScenarioName}</ToneBadge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Harga Jual Acuan / m²
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatIdr(paperScenario.sellingPricePerM2)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Harga Jual Acuan / Blok
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatIdr(paperScenario.sellingPricePerBlock)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Biaya Produksi Benchmark / Blok
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatIdr(paperScenario.productionCostPerBlock)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Margin Kotor Benchmark / Blok
                </div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5">
                  {formatIdr(paperScenario.marginPerBlock)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Pendapatan Harian (5.000 blok)
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatIdr(paperScenario.revenuePerDay)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Biaya Produksi Harian
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatIdr(paperScenario.productionCostPerDay)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Arus Kas Operasi / Hari
                </div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5">
                  {formatIdr(paperScenario.operatingCashFlowPerDay)}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Arus Kas Operasi / Tahun (300 hr)
                </div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5">
                  {formatIdr(paperScenario.operatingCashFlowPerYear)}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-950">
                Simple Payback Period (Sederhana, Tanpa Diskonto):
              </span>
              <span className="font-mono font-extrabold text-amber-900">
                {formatNumber(paperScenario.paybackMonths, 2)} bulan
              </span>
            </div>
          </div>

          {/* Right: Paper Residue Bridge */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Jembatan Serapan Residu Harian (`paperBridge`)
              </h3>
              <ToneBadge tone={bridgeStatusMeta.tone}>
                {paperBridge.status}
              </ToneBadge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {bridgeStatusMeta.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Kadar Substitusi Aktif
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatNumber(paperBridge.substitutionPct, 1)}% semen
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Fraksi Semen & Massa Blok Acuan
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {paperBridge.cementFractionPct}% · {paperBridge.massPerBlockKg}{' '}
                  kg/blok
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Residu Terikat per Blok
                </div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5">
                  {formatNumber(paperBridge.residuePerBlockKg, 4)} kg/blok
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Kebutuhan Residu Harian
                </div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5">
                  {formatNumber(paperBridge.residueRequiredPerDayT, 3)} ton/hari
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Kapasitas Olah Residu Acuan
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatNumber(paperBridge.residueCapacityTPerDay, 1)} ton/hari
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Utilisasi Kapasitas Olah Residu
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {formatNumber(paperBridge.capacityUtilizationPct, 2)}%
                </div>
              </div>
            </div>

            {paperMeta && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 font-mono">
                <div>Formula: {paperMeta.bridge.formula}</div>
                <div>Harian: {paperMeta.bridge.daily_formula}</div>
              </div>
            )}
          </div>
        </div>

        {/* CAPEX & OPEX Breakdown from paperMeta */}
        {paperMeta && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* CAPEX Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Rincian CAPEX Skrining Awal (`paperMeta.capex`)
                </h3>
                <ToneBadge tone="slate">{paperMeta.capex.status}</ToneBadge>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2 px-3 font-semibold">
                        Peralatan / Komponen Modal
                      </th>
                      <th className="py-2 px-3 font-semibold text-right">
                        Estimasi Biaya (IDR)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paperMeta.capex.items.map((item) => (
                      <tr key={item.name}>
                        <td className="py-2 px-3 text-slate-800">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-900">
                          {formatIdr(item.cost_idr)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/70 text-slate-700">
                      <td className="py-2 px-3 font-medium">
                        Subtotal Peralatan Utama
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {formatIdr(paperMeta.capex.equipment_subtotal_idr)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/70 text-slate-700">
                      <td className="py-2 px-3 font-medium">
                        Instalasi & Komisioning (
                        {paperMeta.capex.installation_rate_pct}%)
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {formatIdr(paperMeta.capex.installation_idr)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-200">
                      <td className="py-2 px-3">Total CAPEX Skrining</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-800">
                        {formatIdr(paperMeta.capex.total_idr)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* OPEX & Sensitivity Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Komponen OPEX Pengolahan Residu (`paperMeta.opex`)
                </h3>
                <ToneBadge tone="slate">
                  Dilaporkan: {formatIdr(paperMeta.opex.reported_per_t_idr)}/ton
                </ToneBadge>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2 px-3 font-semibold">Komponen OPEX</th>
                      <th className="py-2 px-3 font-semibold">Driver</th>
                      <th className="py-2 px-3 font-semibold text-right">
                        Biaya (IDR/ton)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paperMeta.opex.components.map((comp) => (
                      <tr key={comp.name}>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {comp.name}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {comp.driver}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-900">
                          {formatIdr(comp.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sensitivity cases from paperMeta */}
              {paperMeta.sensitivity && paperMeta.sensitivity.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-800">
                    Kasus Sensitivitas Skrining Manuskrip (`paperMeta.sensitivity`)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {paperMeta.sensitivity.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5"
                      >
                        <div className="font-bold text-slate-800">
                          {String(item.case ?? `Kasus ${idx + 1}`)}
                        </div>
                        <div className="text-slate-600">
                          Perubahan: {String(item.parameter_change ?? '—')}
                        </div>
                        {typeof item.resulting_opex_per_t_idr === 'number' && (
                          <div className="font-mono text-slate-800">
                            OPEX: {formatIdr(item.resulting_opex_per_t_idr)}/ton
                          </div>
                        )}
                        {typeof item.payback_months === 'number' && (
                          <div className="font-mono text-emerald-800 font-semibold">
                            Payback: {formatNumber(item.payback_months, 2)} bln
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 6. Batas Sistem, Kematangan, dan Larangan Metrik Finansial */}
      {paperMeta && (
        <div
          data-testid="economics-boundaries-section"
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                <span>BATAS SISTEM, TINGKAT KEMATANGAN & PEMBATASAN METRIK</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Kejujuran Ilmiah & Keterbatasan Model Tekno-Ekonomi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Sesuai deklarasi kanonik pada{' '}
                <code className="font-mono">master.json</code>, evaluasi saat
                ini berada pada tingkat{' '}
                <strong>{paperMeta.estimate_class}</strong> (Maturation Level{' '}
                {paperMeta.maturation.level}:{' '}
                <code className="font-mono">{paperMeta.maturation.status}</code>
                ).
              </p>
            </div>
            <ToneBadge tone="rose">
              Full Bankable TEA:{' '}
              {paperMeta.full_tea_supported ? 'Didukung' : 'BELUM DIDUKUNG'}
            </ToneBadge>
          </div>

          {/* Disallowed Metrics Callout */}
          {paperMeta.maturation.npv_irr_roi_disallowed && (
            <div
              data-testid="disallowed-metrics-warning"
              className="rounded-xl bg-rose-50/80 border border-rose-200 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-950">
                <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  Metrik NPV, IRR, dan ROI Dilarang Ditampilkan sebagai Hasil
                  Kanonik (`npv_irr_roi_disallowed: true`)
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed">
                Aplikasi ini secara sengaja <strong>tidak menghitung</strong>{' '}
                Net Present Value (NPV), Internal Rate of Return (IRR), maupun
                Return on Investment (ROI) multi-tahun karena jadwal depresiasi,
                struktur pembiayaan/pajak, modal kerja, dan kurva ramp-up komersial
                belum divalidasi pada skala pilot.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                  <div className="font-semibold text-emerald-900 mb-1">
                    Metrik yang Didukung (`financial_metrics.supported`):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {paperMeta.financial_metrics.supported.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-rose-200">
                  <div className="font-semibold text-rose-900 mb-1">
                    Metrik Tidak Didukung (`financial_metrics.not_supported`):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {paperMeta.financial_metrics.not_supported.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono text-[11px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Boundary Included / Excluded / Critical Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Termasuk dalam Batas Sistem (`included`)</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 leading-relaxed">
                {paperMeta.system_boundary.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Di Luar Batas Sistem (`excluded`)</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 leading-relaxed">
                {paperMeta.system_boundary.excluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Kesenjangan Kritis (`critical_gaps`)</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 leading-relaxed">
                {paperMeta.maturation.critical_gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>

          {paperMeta.system_boundary.notes.length > 0 && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">
                Catatan Batas Sistem (`system_boundary.notes`):
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {paperMeta.system_boundary.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
