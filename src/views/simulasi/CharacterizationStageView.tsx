import React from 'react';
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  AlertCircle,
  Database,
  Info,
  TestTube2,
  Sparkles,
} from 'lucide-react';
import type {
  Characterization,
  DemoDataset,
  DemoDatasetId,
  StudyResult,
} from '../../engine/study';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface CharacterizationStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  studyMode: 'demo' | 'actual';
  datasetId: DemoDatasetId;
  demoDatasets: DemoDataset[];
  onSelectDemoDataset: (id: DemoDatasetId) => void;
  onUpdateField: <K extends keyof Characterization>(
    field: K,
    value: Characterization[K]
  ) => void;
  onSelectStage: (stageId: SimulationStageId) => void;
  evidenceLabel: (value: string | null | undefined) => string;
}

const CANONICAL_PHASE_OPTIONS = ['Amorf', 'Campuran', 'Kristalin'] as const;

const PHASE_GUIDANCE: Record<
  string,
  {
    label: string;
    badgeTone: string;
    boxTone: string;
    description: string;
  }
> = {
  Amorf: {
    label: 'Fase yang diprioritaskan',
    badgeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    boxTone: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
    description:
      'Indikator awal yang paling relevan untuk skrining sementisius karena silika amorf cenderung lebih reaktif. Tetap perlu didukung karakterisasi dan bukti eksperimental lain.',
  },
  Campuran: {
    label: 'Perlu verifikasi lebih lanjut',
    badgeTone: 'bg-amber-100 text-amber-800 border-amber-200',
    boxTone: 'bg-amber-50/70 border-amber-200 text-amber-950',
    description:
      'Material mengandung kombinasi fase. Kelayakan tidak dapat ditentukan dari label campuran saja; fraksi amorf dan bukti aktivitas tetap perlu diperiksa.',
  },
  Kristalin: {
    label: 'Prioritas reaktivitas lebih rendah',
    badgeTone: 'bg-rose-100 text-rose-800 border-rose-200',
    boxTone: 'bg-rose-50/70 border-rose-200 text-rose-950',
    description:
      'Fase kristalin dominan bukan indikasi utama untuk reaktivitas pozolanik. Perlakuan dan bukti tambahan perlu dipertimbangkan sebelum formulasi.',
  },
};

function hasText(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

function sanitizeDecimalInput(raw: string): string {
  const normalized = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  if (!normalized || /^\.+$/.test(normalized)) {
    return '';
  }
  const [head, ...tail] = normalized.split('.');
  if (tail.length === 0) {
    return head;
  }
  const fractional = tail.join('').slice(0, 6);
  const integerPart = head === '' ? '0' : head;
  return `${integerPart}.${fractional}`;
}

function parseNumericValue(raw: string): number | null {
  if (!hasText(raw)) return null;
  const normalized = raw.trim().replace(/,/g, '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getPercentageNotice(raw: string, fieldLabel: string): string | null {
  const num = parseNumericValue(raw);
  if (num === null) return null;
  if (num > 100) {
    return `Nilai ${fieldLabel} (${num}%) melebihi 100%. Periksa kembali satuan input.`;
  }
  return null;
}

function getParticleClassification(raw: string): {
  label: string;
  range: string;
  description: string;
  isClassified: boolean;
} {
  const parsed = parseNumericValue(raw);

  if (parsed === null || parsed <= 0) {
    return {
      label: 'Belum terklasifikasi',
      range: 'Masukkan nilai D50 (> 0 μm)',
      description:
        'Klasifikasi ukuran partikel akan muncul setelah nilai D50 numerik positif diisi.',
      isClassified: false,
    };
  }

  if (parsed < 0.1) {
    return {
      label: 'Nanoscale',
      range: '< 0,1 μm',
      description:
        'Skala nano. Dapat memiliki reaktivitas permukaan tinggi, tetapi efek aglomerasi dan kebutuhan air campuran perlu diperhatikan.',
      isClassified: true,
    };
  }

  if (parsed <= 100) {
    return {
      label: 'Microscale',
      range: '0,1–100 μm',
      description:
        'Skala mikrometer. Gunakan sebagai klasifikasi ukuran partikel awal, bukan sebagai klaim mutu tunggal.',
      isClassified: true,
    };
  }

  return {
    label: 'Partikel Lebih Kasar (Larger Particle)',
    range: '> 100 μm',
    description:
      'Partikel relatif kasar. Dampak ukuran perlu dibaca bersama proses penggilingan (grinding), pengayakan, dan target formulasi.',
    isClassified: true,
  };
}

export const CharacterizationStageView: React.FC<
  CharacterizationStageViewProps
> = ({
  study,
  characterization,
  studyMode,
  datasetId,
  demoDatasets,
  onSelectDemoDataset,
  onUpdateField,
  onSelectStage,
  evidenceLabel,
}) => {
  const qualification = study.science.materialQualification;
  const phaseGuidance = hasText(characterization.phase)
    ? PHASE_GUIDANCE[characterization.phase.trim()] ?? null
    : null;
  const particleClass = getParticleClassification(characterization.particle);

  const silicaNotice = getPercentageNotice(
    characterization.silica,
    'Kandungan SiO₂'
  );
  const moistureNotice = getPercentageNotice(
    characterization.moisture,
    'Kadar air'
  );
  const impurityNotice = getPercentageNotice(
    characterization.impurity,
    'Fraksi pengotor'
  );

  const qualificationBadgeTone =
    qualification.status === 'QUALIFIED'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : qualification.status === 'CONDITIONAL'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-rose-50 text-rose-800 border-rose-200';

  const qualificationBarTone =
    qualification.status === 'QUALIFIED'
      ? 'bg-emerald-600'
      : qualification.status === 'CONDITIONAL'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  const qualificationSummaryHeadline =
    qualification.status === 'QUALIFIED'
      ? 'Data karakterisasi minimum terpenuhi (10/10 parameter)'
      : qualification.status === 'CONDITIONAL'
      ? 'Identitas kritis terisi, namun sebagian parameter lab belum lengkap'
      : 'Identitas kritis material belum lengkap untuk kualifikasi awal';

  const activePreset = demoDatasets.find((d) => d.id === datasetId);
  const isModifiedFromPreset =
    studyMode === 'demo' &&
    activePreset !== undefined &&
    (Object.keys(activePreset.characterization) as Array<keyof Characterization>).some(
      (key) => activePreset.characterization[key] !== characterization[key]
    );

  // Include custom phase option if characterization.phase holds a non-standard non-empty string
  const phaseSelectOptions =
    hasText(characterization.phase) &&
    !CANONICAL_PHASE_OPTIONS.includes(
      characterization.phase as (typeof CANONICAL_PHASE_OPTIONS)[number]
    )
      ? [...CANONICAL_PHASE_OPTIONS, characterization.phase]
      : [...CANONICAL_PHASE_OPTIONS];

  return (
    <div
      data-testid="characterization-stage-content"
      className="space-y-5 sm:space-y-6 min-w-0"
    >
      {/* 1. Top Active Material & Qualification Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              IDENTITAS BATCH AKTIF
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
              {studyMode === 'demo'
                ? isModifiedFromPreset
                  ? `Demo (${datasetId} · disesuaikan)`
                  : `Preset Demo (${datasetId})`
                : 'Input Aktual'}
            </span>
          </div>
          <div className="min-w-0">
            {hasText(characterization.batch) ? (
              <strong className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                {characterization.batch}
              </strong>
            ) : (
              <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1 inline-block">
                BATCH DIPERLUKAN
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 break-words">
            {hasText(characterization.source)
              ? characterization.source.trim()
              : 'Sumber material belum ditetapkan'}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              STATUS KUALIFIKASI MATERIAL
            </span>
            <TestTube2 className="w-4 h-4 text-emerald-700 shrink-0" />
          </div>
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span
              data-testid="characterization-status-badge"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${qualificationBadgeTone}`}
            >
              {evidenceLabel(qualification.status)}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {qualification.completeness}% Lengkap
            </span>
          </div>
          <span className="text-[11px] text-slate-500 break-words">
            {qualification.missing.length === 0
              ? '10 dari 10 parameter karakterisasi tersedia'
              : `${qualification.missing.length} parameter masih kosong`}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between gap-1.5 min-w-0 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              KONTEKS DATA & VALIDASI
            </span>
            <Info className="w-4 h-4 text-teal-700 shrink-0" />
          </div>
          <strong className="text-xs sm:text-sm font-bold text-slate-900 break-words">
            {studyMode === 'demo'
              ? 'Mode Demonstrasi Interaktif'
              : 'Mode Input Batch Aktual'}
          </strong>
          <span className="text-[11px] text-slate-500 leading-relaxed break-words">
            Perubahan nilai langsung diperbarui ke mesin evaluasi, namun tidak
            menggantikan bukti pengujian fisik produk.
          </span>
        </div>
      </div>

      {/* 2. Demo Preset Selector (Shown when studyMode === 'demo') */}
      {studyMode === 'demo' && (
        <div className="rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200 p-3.5 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>PRESET REKAM DEMONSTRASI</span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Pilih Preset Dataset untuk Menguji Perilaku Kualifikasi Engine
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Anda tetap dapat mengedit setiap kolom secara langsung di bawah
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {demoDatasets.map((preset) => {
              const isSelected = datasetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectDemoDataset(preset.id)}
                  data-testid={`preset-dataset-${preset.id}`}
                  aria-pressed={isSelected}
                  className={`p-3 min-h-[48px] rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-emerald-50/60 text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        isSelected
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {preset.id}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-emerald-100">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold break-words">
                    {preset.label}
                  </div>
                  <p
                    className={`text-[11px] leading-snug break-words ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Interactive Area: Left Forms (Identity + Characteristics) & Right Qualification Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Form Groups A & B */}
        <div className="xl:col-span-7 space-y-5 sm:space-y-6 min-w-0">
          {/* Group A: Identitas Sampel */}
          <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 min-w-0">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  A · IDENTITAS SAMPEL
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Identitas Batch, Sampel, dan Sumber Material
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  ID batch, ID material, dan sumber material merupakan 3
                  identitas kritis yang wajib terisi agar material dapat dinilai
                  pada tahap formulasi.
                </p>
              </div>
              <Database className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Field 1: Batch material */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-batch"
                    className="text-xs font-bold text-slate-800"
                  >
                    Batch Material (ID Batch)
                  </label>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Wajib · Kritis
                  </span>
                </div>
                <input
                  id="char-input-batch"
                  data-testid="input-batch"
                  type="text"
                  value={characterization.batch}
                  onChange={(e) => onUpdateField('batch', e.target.value)}
                  placeholder="Contoh: DEMO-Q-001"
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.batch)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <p className="text-[11px] text-slate-500 leading-snug">
                  {hasText(characterization.batch)
                    ? 'Kode pelacakan batch material aktif.'
                    : 'Diperlukan untuk mengidentifikasi batch material.'}
                </p>
              </div>

              {/* Field 2: ID sampel */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-sample"
                    className="text-xs font-bold text-slate-800"
                  >
                    ID Sampel
                  </label>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    Wajib Kualifikasi
                  </span>
                </div>
                <input
                  id="char-input-sample"
                  data-testid="input-sample"
                  type="text"
                  value={characterization.sample}
                  onChange={(e) => onUpdateField('sample', e.target.value)}
                  placeholder="Contoh: DEMO-Q-001"
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.sample)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <p className="text-[11px] text-slate-500 leading-snug">
                  Identitas spesimen laboratorium yang diuji.
                </p>
              </div>

              {/* Field 3: ID material */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-materialId"
                    className="text-xs font-bold text-slate-800"
                  >
                    ID Material
                  </label>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Wajib · Kritis
                  </span>
                </div>
                <input
                  id="char-input-materialId"
                  data-testid="input-materialId"
                  type="text"
                  value={characterization.materialId}
                  onChange={(e) => onUpdateField('materialId', e.target.value)}
                  placeholder="Contoh: DEMO-Q-001"
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.materialId)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <p className="text-[11px] text-slate-500 leading-snug">
                  Kode registri material untuk pencocokan basis bukti.
                </p>
              </div>

              {/* Field 4: Sumber material */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-source"
                    className="text-xs font-bold text-slate-800"
                  >
                    Sumber Material
                  </label>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    Wajib · Kritis
                  </span>
                </div>
                <input
                  id="char-input-source"
                  data-testid="input-source"
                  type="text"
                  value={characterization.source}
                  onChange={(e) => onUpdateField('source', e.target.value)}
                  placeholder="Contoh: Dieng geothermal silica-rich residue"
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.source)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <p className="text-[11px] text-slate-500 leading-snug">
                  Asal bahan baku residu silika yang sedang dievaluasi.
                </p>
              </div>
            </div>
          </div>

          {/* Group B: Karakteristik Material */}
          <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 min-w-0">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  B · KARAKTERISTIK MATERIAL
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Parameter Fisik, Kimia, dan Pra-pemrosesan Batch
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Masukkan hasil karakterisasi batch dengan satuan yang sesuai.
                  Nilai angka <span className="font-mono font-semibold">0</span>{' '}
                  diperlakukan sebagai nilai terukur nol, berbeda dari kolom
                  kosong (<span className="font-semibold">DATA DIPERLUKAN</span>
                  ).
                </p>
              </div>
              <Beaker className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Field 5: Kandungan SiO2 */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-silica"
                    className="text-xs font-bold text-slate-800"
                  >
                    Kandungan SiO₂
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    wt.%
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="char-input-silica"
                    data-testid="input-silica"
                    type="text"
                    inputMode="decimal"
                    value={characterization.silica}
                    onChange={(e) =>
                      onUpdateField(
                        'silica',
                        sanitizeDecimalInput(e.target.value)
                      )
                    }
                    placeholder="Contoh: 90"
                    className={`w-full min-h-[42px] pl-3 pr-14 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      hasText(characterization.silica)
                        ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                        : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    wt.%
                  </span>
                </div>
                {silicaNotice ? (
                  <p className="text-[11px] text-amber-800 font-medium leading-snug">
                    {silicaNotice}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Fraksi berat silika (XRF/setara). Bukan penentu tunggal
                    kelayakan.
                  </p>
                )}
              </div>

              {/* Field 6: Fase material */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-phase"
                    className="text-xs font-bold text-slate-800"
                  >
                    Fase Material
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500">
                    XRD / Mineralogi
                  </span>
                </div>
                <select
                  id="char-input-phase"
                  data-testid="input-phase"
                  value={characterization.phase}
                  onChange={(e) => onUpdateField('phase', e.target.value)}
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.phase)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                >
                  <option value="">— Pilih fase material —</option>
                  {phaseSelectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Menentukan konteks reaktivitas pozolanik dan peringatan
                  keputusan.
                </p>
              </div>

              {/* Field 7: Ukuran partikel (D50) */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-particle"
                    className="text-xs font-bold text-slate-800"
                  >
                    Ukuran Partikel (D50)
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    μm
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="char-input-particle"
                    data-testid="input-particle"
                    type="text"
                    inputMode="decimal"
                    value={characterization.particle}
                    onChange={(e) =>
                      onUpdateField(
                        'particle',
                        sanitizeDecimalInput(e.target.value)
                      )
                    }
                    placeholder="Contoh: 125"
                    className={`w-full min-h-[42px] pl-3 pr-12 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      hasText(characterization.particle)
                        ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                        : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    μm
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Diameter median partikel terukur (digunakan pula pada domain
                  faktor DOE).
                </p>
              </div>

              {/* Field 8: Kadar air */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-moisture"
                    className="text-xs font-bold text-slate-800"
                  >
                    Kadar Air
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    %
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="char-input-moisture"
                    data-testid="input-moisture"
                    type="text"
                    inputMode="decimal"
                    value={characterization.moisture}
                    onChange={(e) =>
                      onUpdateField(
                        'moisture',
                        sanitizeDecimalInput(e.target.value)
                      )
                    }
                    placeholder="Contoh: 4.5"
                    className={`w-full min-h-[42px] pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      hasText(characterization.moisture)
                        ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                        : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
                {moistureNotice ? (
                  <p className="text-[11px] text-amber-800 font-medium leading-snug">
                    {moistureNotice}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Kadar air bahan baku sebelum pencampuran.
                  </p>
                )}
              </div>

              {/* Field 9: Fraksi pengotor */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-impurity"
                    className="text-xs font-bold text-slate-800"
                  >
                    Fraksi Pengotor
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    %
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="char-input-impurity"
                    data-testid="input-impurity"
                    type="text"
                    inputMode="decimal"
                    value={characterization.impurity}
                    onChange={(e) =>
                      onUpdateField(
                        'impurity',
                        sanitizeDecimalInput(e.target.value)
                      )
                    }
                    placeholder="Contoh: 6.0"
                    className={`w-full min-h-[42px] pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      hasText(characterization.impurity)
                        ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                        : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
                {impurityNotice ? (
                  <p className="text-[11px] text-amber-800 font-medium leading-snug">
                    {impurityNotice}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Persentase senyawa non-silika / pengotor terukur.
                  </p>
                )}
              </div>

              {/* Field 10: Pra-pemrosesan */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="char-input-preprocessing"
                    className="text-xs font-bold text-slate-800"
                  >
                    Pra-pemrosesan
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Rute Perlakuan
                  </span>
                </div>
                <input
                  id="char-input-preprocessing"
                  data-testid="input-preprocessing"
                  type="text"
                  value={characterization.preprocessing}
                  onChange={(e) =>
                    onUpdateField('preprocessing', e.target.value)
                  }
                  placeholder="Contoh: Drying + size classification"
                  className={`w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    hasText(characterization.preprocessing)
                      ? 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-500/20'
                      : 'border-amber-300 bg-amber-50/30 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <p className="text-[11px] text-slate-500 leading-snug">
                  Tahapan pengeringan, penggilingan, atau klasifikasi ukuran.
                </p>
              </div>
            </div>

            {/* Scientific Context Cards: Phase Guidance & Particle Classification */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Phase Assessment */}
              <div
                className={`rounded-xl border p-3.5 space-y-1.5 min-w-0 ${
                  phaseGuidance
                    ? phaseGuidance.boxTone
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-75">
                    INTERPRETASI FASE
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      phaseGuidance
                        ? phaseGuidance.badgeTone
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {phaseGuidance
                      ? phaseGuidance.label
                      : 'Fase belum dipilih'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed break-words">
                  {phaseGuidance
                    ? phaseGuidance.description
                    : 'Pilih fase material (Amorf, Campuran, atau Kristalin) untuk melihat konteks reaktivitas pozolanik.'}
                </p>
              </div>

              {/* Particle Classification */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    KLASIFIKASI UKURAN PARTIKEL
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white text-slate-700 border border-slate-200">
                    {particleClass.range}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 break-words">
                  {particleClass.label}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {particleClass.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Group C — Ringkasan Kualifikasi (Canonical Engine Output) */}
        <div className="xl:col-span-5 space-y-5 sm:space-y-6 min-w-0">
          <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800">
                  C · RINGKASAN KUALIFIKASI ENGINE
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Evaluasi Kelengkapan & Kualifikasi Material
                </h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 ${qualificationBadgeTone}`}
              >
                {evidenceLabel(qualification.status)}
              </span>
            </div>

            {/* Completeness Score & Progress Bar */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Status Kualifikasi Kanonik
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 break-words">
                    {qualificationSummaryHeadline}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    data-testid="qualification-completeness-value"
                    className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 tabular-nums"
                  >
                    {qualification.completeness}%
                  </span>
                  <div className="text-[10px] text-slate-500">kelengkapan</div>
                </div>
              </div>

              <div
                className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={qualification.completeness}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full transition-all duration-300 ${qualificationBarTone}`}
                  style={{ width: `${qualification.completeness}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Status kualifikasi ini mengukur kecukupan data identitas dan
                karakterisasi batch awal, bukan sertifikasi kelulusan mutu
                produk paving block.
              </p>
            </div>

            {/* Missing Data Alert (if any) */}
            {qualification.missing.length > 0 && (
              <div
                data-testid="qualification-missing-list"
                className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Daftar Data yang Masih Diperlukan (
                    {qualification.missing.length})
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed break-words">
                  {qualification.missing.join(' · ')}
                </p>
              </div>
            )}

            {/* 10-Item Canonical Checklist from qualification.required & qualification.missing */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Status 10 Parameter Wajib Engine:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2">
                {qualification.required.map((label) => {
                  const isMissing = qualification.missing.includes(label);
                  return (
                    <div
                      key={label}
                      className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 text-xs min-w-0 ${
                        isMissing
                          ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                      }`}
                    >
                      <span className="font-medium truncate">{label}</span>
                      {isMissing ? (
                        <span className="text-[10px] font-bold text-amber-800 shrink-0">
                          Kosong
                        </span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scientific Rationale from Engine (qualification.rationale) */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Catatan Ilmiah & Alasan Kualifikasi Engine:
              </div>
              <ul className="space-y-1.5">
                {qualification.rationale.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 leading-relaxed break-words"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Stage CTA Card: Proceed to Stage 03 (Formulasi Kandidat) */}
          <div className="rounded-xl sm:rounded-2xl bg-emerald-900 text-white p-4 sm:p-5 space-y-3">
            <div className="space-y-1 min-w-0">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                LANGKAH SELANJUTNYA · TAHAP 03
              </div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight break-words">
                Lanjutkan ke Formulasi Kandidat
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed break-words">
                Setelah memeriksa identitas dan karakterisasi material, atur
                proporsi substitusi semen, rasio air-pengikat (W/B), kelas mutu
                SNI sasaran, dan dimensi blok pada Tahap 03.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectStage('formulation')}
              data-testid="characterization-next-formulation-button"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <span>Lanjut ke Formulasi Kandidat</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
