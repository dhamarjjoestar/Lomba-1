import {
  directPavingEvidence,
  evidenceBySource,
  literaturePerformance,
  materialEvidence,
  sourceById,
  silica2conExperimentalRecords,
  hasValidatedSilica2ConExperiment,
  type EvidenceRecord,
  type SourceRecord,
} from "../data/master";

import type {
  EvidenceClass,
  ProductType,
  SourceType,
  ValueStatus,
} from "./contracts";
import type { ScienceEngine } from "./scienceEngine";

export type EvidenceGrade =
  | "VALIDATED"
  | "LITERATURE_SUPPORTED"
  | "SCREENING_ESTIMATE"
  | "INSUFFICIENT_DATA";

export type EvidenceProvenance = {
  sourceId: string | null;
  sourceType: SourceType | null;
  evidenceClass: EvidenceClass | null;
  valueStatus: ValueStatus | null;
  sourceTitle: string | null;
  authors: string | null;
  year: number | null;
  material: string | null;
  materialId: string | null;
  productType: ProductType | null;
  application: string | null;
  replacementValue: number | null;
  replacementBasis: string | null;
  testingAge: string | null;
  method: string | null;
  limitations: string[];
};

export type EvidenceItem = {
  id: string;
  subject: string;
  grade: EvidenceGrade;
  provenance: EvidenceProvenance;
  applicability: "DIRECT" | "RELATED" | "INDIRECT" | "UNKNOWN";
  claim: string;
  limitations: string[];
};

export type EvidenceEngine = {
  candidate: {
    substitutionPct: number;
    directPavingMatch: EvidenceItem | null;
    literatureSupport: EvidenceItem[];
    grade: EvidenceGrade;
    status: "SUPPORTED" | "CONDITIONAL" | "INSUFFICIENT_DATA";
    warnings: string[];
  };
  material: {
    items: EvidenceItem[];
    availableCount: number;
    missingContext: string[];
  };
  summary: {
    total: number;
    validated: number;
    literatureSupported: number;
    screeningEstimate: number;
    insufficientData: number;
    dominantGrade: EvidenceGrade;
  };
  trace: EvidenceItem[];
  decisionRules: string[];
};

function sourceProvenance(sourceId: string | null): EvidenceProvenance {
  const source = sourceId ? sourceById(sourceId) : undefined;

  return {
    sourceId,
    sourceType: null,
    evidenceClass: null,
    valueStatus: null,
    sourceTitle: source?.title ?? null,
    authors: source?.authors ?? null,
    year: source?.year ?? null,
    material: null,
    materialId: null,
    productType: null,
    application: null,
    replacementValue: null,
    replacementBasis: null,
    testingAge: null,
    method: null,
    limitations: [],
  };
}

function evidenceItemFromRecord(
  record: EvidenceRecord,
  subject: string,
  claim: string,
  applicability: EvidenceItem["applicability"],
  grade: EvidenceGrade,
): EvidenceItem {
  const source = sourceProvenance(record.source_id);

  return {
    id: record.id,
    subject,
    grade,
    applicability,
    claim,
    provenance: {
      ...source,
      sourceType: record.source_type ?? null,
      evidenceClass: record.evidence_class ?? null,
      valueStatus: record.status ? (record.status as ValueStatus) : null,
      material: record.material ?? null,
      materialId: record.material_id ?? null,
      productType: record.product_type ?? null,
      application: record.application ?? null,
      replacementValue:
        record.replacement_value ?? record.replacement_pct ?? null,
      replacementBasis: record.replacement_basis ?? null,
      testingAge: record.testing_age ?? null,
      method: record.method ?? null,
      limitations: record.limitations ?? [],
    },
    limitations: record.limitations ?? [],
  };
}

function buildMaterialEvidence(characterization: {
  materialId: string;
  batch: string;
  sample: string;
  source: string;
  silica: string;
  phase: string;
  particle: string;
  moisture: string;
  impurity: string;
}): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const fields: Array<{ key: keyof typeof characterization; label: string }> = [
    { key: "materialId", label: "ID material" },
    { key: "batch", label: "ID batch" },
    { key: "sample", label: "ID sampel" },
    { key: "source", label: "Sumber material" },
    { key: "silica", label: "Kandungan SiO₂" },
    { key: "phase", label: "Fase material" },
    { key: "particle", label: "Ukuran partikel" },
    { key: "moisture", label: "Kadar air" },
    { key: "impurity", label: "Pengotor" },
  ];

  for (const field of fields) {
    const value = String(characterization[field.key] ?? "").trim();
    if (!value) continue;

    items.push({
      id: `INPUT-${String(field.key).toUpperCase()}`,
      subject: field.label,
      grade: "SCREENING_ESTIMATE",
      applicability: "DIRECT",
      claim: `${field.label} tersedia sebagai input pengguna untuk batch studi.`,
      provenance: {
        sourceId: null,
        sourceType: "USER_INPUT",
        evidenceClass: null,
        valueStatus: "REPORTED",
        sourceTitle: "Input pengguna",
        authors: null,
        year: null,
        material: characterization.source || null,
        materialId: characterization.materialId || null,
        productType: null,
        application: null,
        replacementValue: null,
        replacementBasis: null,
        testingAge: null,
        method: null,
        limitations: [
          "Input pengguna belum otomatis dianggap sebagai hasil validasi laboratorium.",
        ],
      },
      limitations: [
        "Input pengguna belum otomatis dianggap sebagai hasil validasi laboratorium.",
      ],
    });
  }

  return items;
}

function bestDirectPavingMatch(substitutionPct: number): EvidenceItem | null {
  const directRecords = directPavingEvidence.filter(
    (record) =>
      record.product_type === "PAVING_BLOCK" &&
      record.evidence_class === "DIRECT" &&
      record.replacement_values_pct.includes(substitutionPct),
  );

  if (!directRecords.length) return null;
  const record = directRecords[0];

  return {
    id: record.id,
    subject: "Kandidat paving block",
    grade: record.status === "VALIDATED" ? "VALIDATED" : "LITERATURE_SUPPORTED",
    applicability: "DIRECT",
    claim: `Evidence langsung tersedia pada substitusi ${substitutionPct}% untuk paving block.`,
    provenance: {
      ...sourceProvenance(record.source_id),
      sourceType: record.source_type,
      evidenceClass: record.evidence_class,
      valueStatus: record.status as ValueStatus,
      productType: record.product_type,
      replacementValue: substitutionPct,
      replacementBasis: record.replacement_basis,
      testingAge: record.testing_age,
      limitations: record.limitations,
    },
    limitations: record.limitations,
  };
}

function buildRelatedLiterature(substitutionPct: number): EvidenceItem[] {
  return literaturePerformance
    .filter(
      (record) =>
        record.product_type === "PAVING_BLOCK" ||
        record.product_type === "MORTAR" ||
        record.product_type === "CONCRETE",
    )
    .filter(
      (record) =>
        record.source_id !== "SRC-017" ||
        record.replacement_value !== substitutionPct,
    )
    .slice(0, 8)
    .map((record) =>
      evidenceItemFromRecord(
        record,
        "Literatur pembanding",
        `Evidence literatur tersedia untuk ${record.product_type ?? "produk terkait"}; applicability terhadap kandidat SILICA2CON perlu ditafsirkan berdasarkan konteks material dan produk.`,
        record.product_type === "PAVING_BLOCK" ? "RELATED" : "INDIRECT",
        "LITERATURE_SUPPORTED",
      ),
    );
}

function dominantGrade(items: EvidenceItem[]): EvidenceGrade {
  if (items.some((item) => item.grade === "VALIDATED")) return "VALIDATED";
  if (items.some((item) => item.grade === "LITERATURE_SUPPORTED"))
    return "LITERATURE_SUPPORTED";
  if (items.some((item) => item.grade === "SCREENING_ESTIMATE"))
    return "SCREENING_ESTIMATE";
  return "INSUFFICIENT_DATA";
}

export function buildEvidenceEngine(
  characterization: {
    materialId: string;
    batch: string;
    sample: string;
    source: string;
    silica: string;
    phase: string;
    particle: string;
    moisture: string;
    impurity: string;
  },
  mix: { substitution: number },
  science: ScienceEngine,
): EvidenceEngine {
  const materialItems = buildMaterialEvidence(characterization);
  const directMatch = bestDirectPavingMatch(mix.substitution);
  const relatedLiterature = buildRelatedLiterature(mix.substitution);
  const experimentRecords = silica2conExperimentalRecords();
  const matchingValidatedExperiment = experimentRecords.find((record) => {
    const materialMatches = !record.material_id || record.material_id === characterization.materialId;
    const replacementMatches = record.replacement_value == null || record.replacement_value === mix.substitution;
    return materialMatches && replacementMatches && record.status === "VALIDATED";
  });
  const hasValidatedExperiment = Boolean(matchingValidatedExperiment);
  const warnings: string[] = [];

  if (!directMatch) {
    warnings.push(
      `Tidak ditemukan evidence paving block langsung pada substitusi ${mix.substitution}%. Kandidat belum memiliki dukungan langsung pada titik tersebut.`,
    );
  }

  if (!hasValidatedExperiment) {
    warnings.push(
      "Belum tersedia eksperimen SILICA2CON yang berstatus VALIDATED; literatur tidak boleh diperlakukan sebagai pengganti validasi produk aktual.",
    );
  }

  if (science.formulationSpace.activeCandidate.outsideDirectSubstitutionRange) {
    warnings.push(
      science.formulationSpace.activeCandidate.warning ??
        "Kandidat berada di luar rentang evidence langsung.",
    );
  }

  const candidateGrade: EvidenceGrade = hasValidatedExperiment
    ? "VALIDATED"
    : directMatch
      ? "LITERATURE_SUPPORTED"
      : "INSUFFICIENT_DATA";

  const candidateStatus: EvidenceEngine["candidate"]["status"] =
    hasValidatedExperiment
      ? "SUPPORTED"
      : directMatch
        ? "CONDITIONAL"
        : "INSUFFICIENT_DATA";

  const trace = [
    ...(directMatch ? [directMatch] : []),
    ...relatedLiterature,
    ...materialItems,
  ];

  if (experimentRecords.length) {
    for (const record of experimentRecords) {
      trace.push(
        evidenceItemFromRecord(
          record,
          "Eksperimen SILICA2CON",
          "Rekaman eksperimen internal SILICA2CON yang dapat menaikkan tingkat evidence bila statusnya tervalidasi.",
          "DIRECT",
          record.status === "VALIDATED" ? "VALIDATED" : "SCREENING_ESTIMATE",
        ),
      );
    }
  }

  const counts = {
    VALIDATED: trace.filter((item) => item.grade === "VALIDATED").length,
    LITERATURE_SUPPORTED: trace.filter(
      (item) => item.grade === "LITERATURE_SUPPORTED",
    ).length,
    SCREENING_ESTIMATE: trace.filter(
      (item) => item.grade === "SCREENING_ESTIMATE",
    ).length,
    INSUFFICIENT_DATA: trace.filter(
      (item) => item.grade === "INSUFFICIENT_DATA",
    ).length,
  };

  const missingContext: string[] = [];
  if (!characterization.sample.trim()) missingContext.push("ID sampel aktual");
  if (!characterization.particle.trim())
    missingContext.push("ukuran partikel batch aktual");
  if (!characterization.moisture.trim())
    missingContext.push("kadar air batch aktual");
  if (!characterization.impurity.trim())
    missingContext.push("pengotor batch aktual");

  const materialDatabaseMatches = materialEvidence.filter((record) => {
    const materialIdMatch =
      characterization.materialId &&
      record.material_id === characterization.materialId;
    const materialNameMatch =
      characterization.source &&
      record.material
        ?.toLowerCase()
        .includes(characterization.source.toLowerCase());
    return Boolean(materialIdMatch || materialNameMatch);
  });

  if (!materialDatabaseMatches.length) {
    missingContext.push(
      "kecocokan material terhadap evidence material registry",
    );
  }

  return {
    candidate: {
      substitutionPct: mix.substitution,
      directPavingMatch: directMatch,
      literatureSupport: relatedLiterature,
      grade: candidateGrade,
      status: candidateStatus,
      warnings,
    },
    material: {
      items: materialItems,
      availableCount: materialItems.length,
      missingContext: [...new Set(missingContext)],
    },
    summary: {
      total: trace.length,
      validated: counts.VALIDATED,
      literatureSupported: counts.LITERATURE_SUPPORTED,
      screeningEstimate: counts.SCREENING_ESTIMATE,
      insufficientData: counts.INSUFFICIENT_DATA,
      dominantGrade: dominantGrade(trace),
    },
    trace,
    decisionRules: [
      "Validated hanya diberikan ketika evidence eksperimen SILICA2CON telah berstatus VALIDATED.",
      "Literature-supported tidak sama dengan validasi paving block aktual.",
      "Evidence indirect/related tidak boleh diperlakukan sebagai direct evidence.",
      "Kandidat di luar rentang evidence langsung harus ditandai sebagai ruang eksplorasi.",
      "Kekurangan provenance atau konteks material menurunkan kepastian keputusan.",
    ],
  };
}

// -----------------------------------------------------------------------------
// Backward-compatible API
// Existing Decision/Simulation engines in the project consume these exports.
// These adapters are intentionally strongly typed so the evidence refactor does
// not leak unknown/null values into the existing engine contracts or page UIs.
// -----------------------------------------------------------------------------

export type EvidenceResult = {
  status: ValueStatus | string;
  evidenceClass: EvidenceClass | null;
  sourceId: string | null;
  source?: SourceRecord;
  record?: EvidenceRecord;
  direct: boolean;
  applicable: boolean;
  limitations: string[];
  substitutionPct: number;
  replacementValue: number | null;
  replacementBasis: string;
  productType: ProductType;
  explanation: string;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  testingAge: string | null;
  details: string[];
  sources: string[];
  // 0% substitution is the literature control point (see direct_paving_evidence
  // control_included), not a "real" replacement level — decisionEngine.ts uses
  // this to explain why it's excluded from the replacement evidence range.
  isControlPoint: boolean;
  // The replacement basis and testing age actually recorded on the matched
  // direct-evidence record (null when there was no direct match). Distinct
  // from replacementBasis/testingAge above, which fall back to a default so
  // downstream display code always has a value to show.
  matchedReplacementBasis: string | null;
  matchedTestingAge: string | null;
  [key: string]: unknown;
};

function resolveSubstitutionArg(...args: unknown[]): number {
  for (const arg of args) {
    if (typeof arg === "number" && Number.isFinite(arg)) return arg;
    if (arg && typeof arg === "object") {
      const candidate = arg as Record<string, unknown>;
      const values = [
        candidate.substitutionPct,
        candidate.substitution,
        candidate.replacementValue,
        candidate.replacement_pct,
      ];
      for (const value of values) {
        if (typeof value === "number" && Number.isFinite(value)) return value;
      }
    }
  }
  return 0;
}

function directPavingRecord(
  substitutionPct: number,
): EvidenceRecord | undefined {
  const direct = directPavingEvidence.find(
    (item) =>
      item.product_type === "PAVING_BLOCK" &&
      item.evidence_class === "DIRECT" &&
      item.replacement_values_pct.includes(substitutionPct),
  );

  if (!direct) return undefined;

  return {
    id: direct.id,
    source_id: direct.source_id,
    replacement_value: substitutionPct,
    replacement_pct: substitutionPct,
    replacement_basis: direct.replacement_basis,
    testing_age: direct.testing_age,
    status: direct.status,
    evidence_class: direct.evidence_class,
    source_type: direct.source_type,
    product_type: direct.product_type,
    limitations: direct.limitations,
  };
}

export function evidenceForPaving(...args: unknown[]): EvidenceResult {
  const substitutionPct = resolveSubstitutionArg(...args);
  const record = directPavingRecord(substitutionPct);
  const source = record ? sourceById(record.source_id) : undefined;
  const direct = Boolean(record);
  const replacementBasis = record?.replacement_basis ?? "CEMENT MASS";
  const testingAge = record?.testing_age ?? null;
  const details = record
    ? [
        "Evidence langsung tersedia pada domain paving block.",
        `Titik substitusi ${substitutionPct}% tercatat pada evidence registry.`,
        testingAge
          ? `Umur pengujian tercatat ${testingAge}.`
          : "Umur pengujian belum tersedia pada rekaman.",
      ]
    : [
        `Tidak ditemukan evidence paving block langsung pada substitusi ${substitutionPct}%.`,
        "Kandidat perlu diperlakukan sebagai ruang eksplorasi sampai evidence yang sesuai tersedia.",
      ];

  return {
    status: record?.status ?? "DATA_REQUIRED",
    evidenceClass: record?.evidence_class ?? null,
    sourceId: record?.source_id ?? null,
    source,
    record,
    direct,
    applicable: direct,
    limitations: record?.limitations ?? [
      "Tidak ditemukan evidence paving block langsung pada titik substitusi ini.",
    ],
    substitutionPct,
    replacementValue: record?.replacement_value ?? substitutionPct,
    replacementBasis,
    productType: "PAVING_BLOCK",
    explanation: direct
      ? "Kandidat memiliki dukungan evidence langsung pada titik substitusi yang dipilih; ini tetap merupakan bukti eksternal sampai eksperimen SILICA2CON tervalidasi tersedia."
      : "Kandidat belum memiliki evidence paving block langsung pada titik substitusi yang dipilih.",
    confidence: direct ? "MEDIUM" : "LOW",
    testingAge,
    details,
    sources: record?.source_id ? [record.source_id] : [],
    isControlPoint: substitutionPct === 0,
    matchedReplacementBasis: record?.replacement_basis ?? null,
    matchedTestingAge: record?.testing_age ?? null,
  };
}

export type MaterialQualificationResult = {
  status: "QUALIFIED" | "CONDITIONAL" | "DATA_REQUIRED";
  completeness: number;
  required: string[];
  missing: string[];
  rationale: string[];
  actualSampleStatus: string;
  batchStatus: string;
  materialStatus: string;
  readyForFormulation: boolean;
};

export function materialQualification(
  input: {
    batch?: string;
    batchId?: string;
    sample?: string;
    sampleId?: string;
    materialId?: string;
    source?: string;
    silica?: string;
    phase?: string;
    particle?: string;
    moisture?: string;
    impurity?: string;
    preprocessing?: string;
  } = {},
): MaterialQualificationResult {
  const norm = {
    ...input,
    batch: input.batch ?? input.batchId ?? "",
    sample: input.sample ?? input.sampleId ?? "",
  };

  const required = [
    ["batch", "ID batch"],
    ["sample", "ID sampel"],
    ["materialId", "ID material"],
    ["source", "Sumber material"],
    ["silica", "Kandungan SiO₂"],
    ["phase", "Fase material"],
    ["particle", "Ukuran partikel"],
    ["moisture", "Kadar air"],
    ["impurity", "Pengotor"],
    ["preprocessing", "Pra-pemrosesan"],
  ] as const;

  const missing = required
    .filter(([key]) => String(norm[key] ?? "").trim() === "")
    .map(([, label]) => label);

  const criticalIdentityMissing = (
    ["batch", "materialId", "source"] as const
  ).some((key) => String(norm[key] ?? "").trim() === "");

  const status: MaterialQualificationResult["status"] =
    missing.length === 0
      ? "QUALIFIED"
      : criticalIdentityMissing
        ? "DATA_REQUIRED"
        : "CONDITIONAL";

  const sampleReady = Boolean(String(norm.sample ?? "").trim());
  const batchReady = Boolean(String(norm.batch ?? "").trim());
  const materialReady = Boolean(
    String(norm.materialId ?? "").trim() && String(norm.source ?? "").trim(),
  );

  return {
    status,
    completeness: Math.round(
      ((required.length - missing.length) / required.length) * 100,
    ),
    required: required.map(([, label]) => label),
    missing,
    rationale: [
      "Material qualification menilai kecukupan identitas dan karakterisasi batch sebelum formulasi.",
      "Kadar SiO₂ tidak diperlakukan sebagai satu-satunya indikator kelayakan.",
      ...(missing.length
        ? [`Data yang masih terbuka: ${missing.join(", ")}.`]
        : ["Data karakterisasi yang diwajibkan telah tersedia."]),
    ],
    actualSampleStatus: sampleReady ? "SAMPLE_RECORDED" : "SAMPLE_REQUIRED",
    batchStatus: batchReady ? "BATCH_RECORDED" : "BATCH_REQUIRED",
    materialStatus: materialReady ? "MATERIAL_IDENTIFIED" : "MATERIAL_REQUIRED",
    readyForFormulation: status !== "DATA_REQUIRED",
  };
}

export function hasValidatedExperimentRecord(): boolean {
  return hasValidatedSilica2ConExperiment();
}
