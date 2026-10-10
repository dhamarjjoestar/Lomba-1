import { buildSimulationState, type SimulationState } from "./lib/simulation";

import {
  dataset,
  directPavingReplacementRange,
  literaturePerformance,
  sourceById,
  type SourceRecord,
} from "./data/master";

import type { ReplacementBasis } from "./lib/contracts";
import { buildScienceEngine, type ScienceEngine } from "./lib/scienceEngine";
import { buildEvidenceEngine, type EvidenceEngine } from "./lib/evidenceEngine";

export type Characterization = {
  batch: string;
  sample: string;
  materialId: string;
  source: string;
  silica: string;
  phase: string;
  particle: string;
  moisture: string;
  impurity: string;
  preprocessing: string;
};

export type MixControls = {
  substitution: number;
  particleSize: number;
  waterRatio: number;
  targetClass: "A" | "B" | "C" | "D";
  blockLengthMm: number;
  blockWidthMm: number;
  blockThicknessMm: number;
};

export type EconomicControls = {
  scenario: "baseline" | "conservative" | "optimistic";
  cementPriceIdrKg: number | null;
  processingCostIdrTon: number | null;
  transportDistanceKm: number | null;
  electricityPriceIdrKwh: number | null;
  sellingPricePerBlock: number | null;
};

export type BatchProductionInputs = {
  cementKg: number | null;
  aggregateKg: number | null;
  waterKg: number | null;
  admixtureKg: number | null;
  batchBlocks: number | null;
  batchesPerDay: number | null;
  densityKgM3: number | null;
};

export type DemoDatasetId = "qualified" | "conditional" | "incomplete";

export type DemoDataset = {
  id: DemoDatasetId;
  label: string;
  description: string;
  characterization: Characterization;
};

export const demoDatasets: DemoDataset[] = [
  {
    id: "qualified",
    label: "Qualified",
    description:
      "Rekam demo dengan seluruh field karakterisasi terisi. Bukan hasil eksperimen tervalidasi.",
    characterization: {
      batch: "DEMO-Q-001",
      sample: "DEMO-Q-001",
      materialId: "DEMO-Q-001",
      source: "Dieng geothermal silica-rich residue ",
      silica: "90",
      phase: "Amorf",
      particle: "125",
      moisture: "4.5",
      impurity: "6.0",
      preprocessing: "Drying + size classification",
    },
  },

  {
    id: "conditional",
    label: "Conditional",
    description:
      "Identitas tersedia, tetapi sebagian karakterisasi belum tersedia.",
    characterization: {
      batch: "DEMO-C-001",
      sample: "DEMO-C-001",
      materialId: "DEMO-C-001",
      source: "Dieng geothermal silica-rich residue",
      silica: "86",
      phase: "Amorf",
      particle: "",
      moisture: "",
      impurity: "",
      preprocessing: "Drying required",
    },
  },

  {
    id: "incomplete",
    label: "Incomplete",
    description: "Rekam belum cukup untuk mengidentifikasi batch material.",
    characterization: {
      batch: "",
      sample: "",
      materialId: "",
      source: "",
      silica: "",
      phase: "",
      particle: "",
      moisture: "",
      impurity: "",
      preprocessing: "",
    },
  },
];

export const demoCharacterization: Characterization =
  demoDatasets[0].characterization;

export const NOMINAL_DENSITY_KG_M3 = 2200;

/**
 * Demo-only production inputs.
 *
 * IMPORTANT:
 * These values are used only when studyMode === "demo".
 * Actual mode MUST provide its own batchInputs.
 */
export const DEMO_BATCH_INPUTS = Object.freeze({
  cementKg: 50,
  aggregateKg: 300,
  batchBlocks: 100,
  batchesPerDay: 50,
  admixtureKg: 0,
});

export const defaultMix: MixControls = {
  substitution: 8,
  particleSize: 125,
  waterRatio: 0.6,
  targetClass: "C",
  blockLengthMm: 200,
  blockWidthMm: 100,
  blockThicknessMm: 60,
};

export const defaultEconomicControls: EconomicControls = {
  scenario: "baseline",
  cementPriceIdrKg: null,
  processingCostIdrTon: null,
  transportDistanceKm: null,
  electricityPriceIdrKwh: null,
  sellingPricePerBlock: null,
};

export type StudyResult = {
  state: SimulationState;
  evidenceSource: SourceRecord | undefined;
  directRange: string;
  literaturePoints: Array<{
    replacement: number;
    strength: number;
    age: string;
  }>;
  science: ScienceEngine;
  evidence: EvidenceEngine;
  economics: EconomicControls;
  estimatedBlocksPerDay: number;
};

export function getDemoDataset(id: DemoDatasetId): DemoDataset {
  return demoDatasets.find((item) => item.id === id) ?? demoDatasets[0];
}

export function runStudy(
  characterization: Characterization,
  mix: MixControls,
  economics: EconomicControls = defaultEconomicControls,
  batchInputs?: BatchProductionInputs,
  studyMode: "demo" | "actual" = "demo",
): StudyResult {
  const science = buildScienceEngine(characterization, {
    substitution: mix.substitution,
    particleSize: mix.particleSize,
  });

  const evidence = buildEvidenceEngine(
    characterization,
    { substitution: mix.substitution },
    science,
  );

  /**
   * Resolve production inputs according to study mode.
   *
   * DEMO:
   *   Uses explicit demo values.
   *
   * ACTUAL:
   *   Uses only actual batch inputs.
   *   Missing values remain null and are NOT replaced by demo values.
   */
  const inputs: BatchProductionInputs =
    studyMode === "demo"
      ? {
          cementKg: DEMO_BATCH_INPUTS.cementKg,
          aggregateKg: DEMO_BATCH_INPUTS.aggregateKg,
          waterKg:
            DEMO_BATCH_INPUTS.cementKg * mix.waterRatio,
          admixtureKg: DEMO_BATCH_INPUTS.admixtureKg,
          batchBlocks: DEMO_BATCH_INPUTS.batchBlocks,
          batchesPerDay: DEMO_BATCH_INPUTS.batchesPerDay,
          densityKgM3: NOMINAL_DENSITY_KG_M3,
        }
      : {
          cementKg: batchInputs?.cementKg ?? null,
          aggregateKg: batchInputs?.aggregateKg ?? null,

          /**
           * If actual water mass is unavailable, deriving it from the
           * actual cement mass and water ratio is acceptable as a calculation.
           * It does NOT fall back to DEMO_BATCH_INPUTS.
           */
          waterKg:
            batchInputs?.waterKg ??
            (batchInputs?.cementKg != null
              ? batchInputs.cementKg * mix.waterRatio
              : null),

          admixtureKg: batchInputs?.admixtureKg ?? 0,
          batchBlocks: batchInputs?.batchBlocks ?? null,
          batchesPerDay: batchInputs?.batchesPerDay ?? null,
          densityKgM3: batchInputs?.densityKgM3 ?? null,
        };

  const state = buildSimulationState(
    {
      cementKg: inputs.cementKg,
      aggregateKg: inputs.aggregateKg,
      waterKg: inputs.waterKg,
      admixtureKg: inputs.admixtureKg,
      batchBlocks: inputs.batchBlocks,

      replacementValue: mix.substitution,
      replacementBasis:
        "CEMENT MASS" satisfies ReplacementBasis,

      targetClass: mix.targetClass,

      materialId:
        characterization.materialId || undefined,

      batchId:
        characterization.batch || undefined,

      sampleId:
        characterization.sample || undefined,

      aggregateType: "FINE",

      blockDimensionsMm: {
        length: mix.blockLengthMm,
        width: mix.blockWidthMm,
        thickness: mix.blockThicknessMm,
      },

      densityKgM3: inputs.densityKgM3,

      teaScenario: economics.scenario,

      economicOverrides: economics,
    },
    science,
    characterization,
  );

  const literaturePoints = literaturePerformance
    .filter(
      (record) =>
        record.source_id === "SRC-017" &&
        record.product_type === "PAVING_BLOCK" &&
        record.parameter === "compressive_strength" &&
        typeof record.replacement_value === "number" &&
        typeof record.value === "number",
    )
    .map((record) => ({
      replacement: record.replacement_value as number,
      strength: record.value as number,
      age: record.testing_age ?? "7 days",
    }));

  const estimatedBlocksPerDay =
    inputs.batchBlocks != null &&
    inputs.batchesPerDay != null
      ? inputs.batchBlocks * inputs.batchesPerDay
      : 0;

  return {
    state,
    evidenceSource: sourceById(
      state.evidence.sources[0] ?? "SRC-017",
    ),
    directRange: directPavingReplacementRange(),
    literaturePoints,
    science,
    evidence,
    economics,
    estimatedBlocksPerDay,
  };
}

export function datasetLabel(): string {
  const meta = dataset.dataset_meta as Record<string, unknown> | undefined;

  return String(
    meta?.dataset_id ??
      meta?.project ??
      "SILICA2CON master dataset",
  );
}

export function formatIdr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) {
    return "DATA REQUIRED";
  }

  return (
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(value) + " IDR"
  );
}