import {
  directPavingEvidence,
} from "../data/master";
import { buildDoePlan, type DoePlan } from "./doe";

export type MaterialQualificationStatus =
  | "QUALIFIED"
  | "CONDITIONAL"
  | "INSUFFICIENT_DATA";

export type EvidenceStatus =
  | "VALIDATED"
  | "LITERATURE_SUPPORTED"
  | "SCREENING_ESTIMATE"
  | "INSUFFICIENT_DATA";

export type ScienceEngine = {
  materialQualification: {
    status: MaterialQualificationStatus;
    completeness: number;
    required: string[];
    missing: string[];
    rationale: string[];
  };
  formulationSpace: {
    substitutionPct: {
      min: number | null;
      max: number | null;
      source: "DIRECT_LITERATURE" | "INSUFFICIENT_DATA";
      evidence: EvidenceStatus;
      rationale: string;
    };
    particleSizeUm: {
      min: number | null;
      max: number | null;
      source: "EXPLORATORY_UI_RANGE" | "INSUFFICIENT_DATA";
      evidence: EvidenceStatus;
      rationale: string;
    };
    activeCandidate: {
      substitutionPct: number;
      particleSizeUm: number;
      outsideDirectSubstitutionRange: boolean;
      warning: string | null;
    };
  };
  experimentPlan: {
    status: "READY_FOR_EXPERIMENT" | "BLOCKED_BY_DATA";
    factors: Array<{
      key: "substitutionPct" | "particleSizeUm";
      label: string;
      role: "PRIMARY_FACTOR";
      currentValue: number;
    }>;
    responses: Array<{
      key: string;
      label: string;
      role: "PRIMARY_RESPONSE" | "SUPPORTING_RESPONSE";
    }>;
    modelPath: Array<"DOE" | "ANOVA" | "RSM">;
    note: string;
  };
  doePlan: DoePlan;
};

type CharacterizationInput = {
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

type MixInput = {
  substitution: number;
  particleSize: number;
};

function hasValue(value: string | number | undefined | null): boolean {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function parseFirstNumber(value: string): number | null {
  const match = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getDirectSubstitutionBounds(): { min: number | null; max: number | null } {
  const values = directPavingEvidence.flatMap((record) =>
    Array.isArray(record.replacement_values_pct)
      ? record.replacement_values_pct.filter(
          (value): value is number => typeof value === "number" && Number.isFinite(value),
        )
      : [],
  );

  if (!values.length) return { min: null, max: null };

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function buildMaterialQualification(
  characterization: CharacterizationInput,
): ScienceEngine["materialQualification"] {
  const requiredFields: Array<{ key: keyof CharacterizationInput; label: string }> = [
    { key: "batch", label: "ID batch" },
    { key: "sample", label: "ID sampel" },
    { key: "materialId", label: "ID material" },
    { key: "source", label: "Sumber material" },
    { key: "silica", label: "Kandungan SiO₂" },
    { key: "phase", label: "Fase material" },
    { key: "particle", label: "Ukuran partikel" },
    { key: "moisture", label: "Kadar air" },
    { key: "impurity", label: "Pengotor" },
    { key: "preprocessing", label: "Pra-pemrosesan" },
  ];

  const missing = requiredFields
    .filter(({ key }) => !hasValue(characterization[key]))
    .map(({ label }) => label);

  const completeness = Math.round(
    ((requiredFields.length - missing.length) / requiredFields.length) * 100,
  );

  const criticalIdentityKeys: Array<keyof CharacterizationInput> = [
    "batch",
    "materialId",
    "source",
  ];

  const criticalIdentityMissing = criticalIdentityKeys.some(
    (key) => !hasValue(characterization[key]),
  );

  let status: MaterialQualificationStatus;
  if (missing.length === 0) status = "QUALIFIED";
  else if (!criticalIdentityMissing) status = "CONDITIONAL";
  else status = "INSUFFICIENT_DATA";

  const rationale = [
    "Material qualification menilai kecukupan identitas dan karakterisasi batch sebelum material masuk ke ruang formulasi.",
    "Kadar SiO₂ tidak diperlakukan sebagai satu-satunya indikator kelayakan.",
  ];

  if (characterization.silica) {
    const silicaValue = parseFirstNumber(characterization.silica);
    if (silicaValue !== null) {
      rationale.push(
        `Nilai SiO₂ terdeteksi sebesar ${silicaValue}% sebagai informasi karakterisasi, bukan keputusan kelayakan tunggal.`,
      );
    }
  }

  if (missing.length) {
    rationale.push(`Data yang masih terbuka: ${missing.join(", ")}.`);
  }

  return {
    status,
    completeness,
    required: requiredFields.map(({ label }) => label),
    missing,
    rationale,
  };
}

export function buildScienceEngine(
  characterization: CharacterizationInput,
  mix: MixInput,
): ScienceEngine {
  const materialQualification = buildMaterialQualification(characterization);
  const directBounds = getDirectSubstitutionBounds();

  const outsideDirectSubstitutionRange =
    directBounds.min !== null &&
    directBounds.max !== null &&
    (mix.substitution < directBounds.min || mix.substitution > directBounds.max);

  const substitutionWarning =
    directBounds.min === null || directBounds.max === null
      ? "Rentang literatur langsung belum tersedia. Kandidat belum dapat dibatasi berdasarkan evidence langsung."
      : outsideDirectSubstitutionRange
        ? `Substitusi ${mix.substitution}% berada di luar rentang literatur paving langsung ${directBounds.min}–${directBounds.max}%. Perlakukan sebagai ruang eksplorasi, bukan evidence tervalidasi.`
        : null;

  const experimentBlocked =
    materialQualification.status === "INSUFFICIENT_DATA";

  const measuredParticleSizeUm = parseFirstNumber(characterization.particle);
  const doePlan = buildDoePlan({
    substitutionMin: directBounds.min,
    substitutionMax: directBounds.max,
    measuredParticleSizeUm,
    qualificationStatus: materialQualification.status,
  });

  return {
    materialQualification,
    formulationSpace: {
      substitutionPct: {
        min: directBounds.min,
        max: directBounds.max,
        source: directBounds.min === null ? "INSUFFICIENT_DATA" : "DIRECT_LITERATURE",
        evidence:
          directBounds.min === null
            ? "INSUFFICIENT_DATA"
            : "LITERATURE_SUPPORTED",
        rationale:
          directBounds.min === null
            ? "Tidak ada rentang substitusi langsung yang dapat diambil dari evidence yang tersedia."
            : "Rentang kandidat awal dibentuk dari evidence paving block langsung dan tidak diperlakukan sebagai nilai optimum universal.",
      },
      particleSizeUm: {
        min: null,
        max: null,
        source: "EXPLORATORY_UI_RANGE",
        evidence: "INSUFFICIENT_DATA",
        rationale:
          "Essay menetapkan ukuran partikel sebagai faktor utama, tetapi tidak memberikan rentang numerik evidence yang dapat digunakan sebagai batas ilmiah. Rentang UI 50–300 μm tetap diperlakukan sebagai ruang eksplorasi, bukan rentang tervalidasi.",
      },
      activeCandidate: {
        substitutionPct: mix.substitution,
        particleSizeUm: mix.particleSize,
        outsideDirectSubstitutionRange,
        warning: substitutionWarning,
      },
    },
    experimentPlan: {
      status: experimentBlocked
        ? "BLOCKED_BY_DATA"
        : "READY_FOR_EXPERIMENT",
      factors: [
        {
          key: "substitutionPct",
          label: "Kadar substitusi material",
          role: "PRIMARY_FACTOR",
          currentValue: mix.substitution,
        },
        {
          key: "particleSizeUm",
          label: "Ukuran partikel",
          role: "PRIMARY_FACTOR",
          currentValue: mix.particleSize,
        },
      ],
      responses: [
        {
          key: "compressiveStrength",
          label: "Kuat tekan",
          role: "PRIMARY_RESPONSE",
        },
        {
          key: "waterAbsorption",
          label: "Penyerapan air",
          role: "PRIMARY_RESPONSE",
        },
        {
          key: "workability",
          label: "Workability",
          role: "SUPPORTING_RESPONSE",
        },
      ],
      modelPath: ["DOE", "ANOVA", "RSM"],
      note: experimentBlocked
        ? "DOE/RSM belum boleh diperlakukan sebagai model prediktif karena material qualification belum memiliki data minimum yang cukup."
        : "DOE menjadi jalur eksperimen; ANOVA dan RSM hanya digunakan setelah jumlah dan struktur dataset memenuhi persyaratan statistik.",
    },
    doePlan,
  };
}
