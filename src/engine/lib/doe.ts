export type DoeFactorKey = "substitutionPct" | "particleSizeUm";

export type DoeLevel = {
  value: number | null;
  label: "LOW" | "CENTER" | "HIGH";
  evidence: "LITERATURE_SUPPORTED" | "MEASURED" | "NOT_DEFINED";
};

export type DoeFactor = {
  key: DoeFactorKey;
  label: string;
  unit: string;
  role: "PRIMARY_FACTOR";
  levels: DoeLevel[];
  note: string;
};

export type DoeRun = {
  run: number;
  substitutionPct: number | null;
  particleSizeUm: number | null;
  status: "PLANNED" | "BLOCKED";
};

export type DoePlan = {
  status: "READY_FOR_DESIGN" | "BLOCKED_BY_FACTOR_DOMAIN";
  design: "TWO_FACTOR_SCREENING";
  factors: DoeFactor[];
  responses: Array<{
    key: "compressiveStrength" | "waterAbsorption" | "workability";
    label: string;
    role: "PRIMARY_RESPONSE" | "SUPPORTING_RESPONSE";
    unit: string;
  }>;
  runs: DoeRun[];
  runCount: number;
  model: {
    path: ["DOE", "ANOVA", "RSM"];
    status: "WAITING_FOR_EXPERIMENTAL_DATA" | "READY_FOR_ANALYSIS";
    note: string;
  };
  notes: string[];
};

function midpoint(min: number, max: number): number {
  return Number(((min + max) / 2).toFixed(2));
}

function threeLevels(min: number | null, max: number | null): DoeLevel[] {
  if (min == null || max == null || !Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [
      { value: null, label: "LOW", evidence: "NOT_DEFINED" },
      { value: null, label: "CENTER", evidence: "NOT_DEFINED" },
      { value: null, label: "HIGH", evidence: "NOT_DEFINED" },
    ];
  }

  return [
    { value: min, label: "LOW", evidence: "LITERATURE_SUPPORTED" },
    { value: midpoint(min, max), label: "CENTER", evidence: "LITERATURE_SUPPORTED" },
    { value: max, label: "HIGH", evidence: "LITERATURE_SUPPORTED" },
  ];
}

export function buildDoePlan(args: {
  substitutionMin: number | null;
  substitutionMax: number | null;
  measuredParticleSizeUm: number | null;
  qualificationStatus: "QUALIFIED" | "CONDITIONAL" | "INSUFFICIENT_DATA";
}): DoePlan {
  const substitutionLevels = threeLevels(args.substitutionMin, args.substitutionMax);

  // We intentionally do not invent a scientific PSD range. The essay establishes
  // particle size as a primary factor, but a numeric evidence-backed domain must
  // come from characterization/literature before the DOE matrix is executable.
  const particleLevels: DoeLevel[] = [
    { value: null, label: "LOW", evidence: "NOT_DEFINED" },
    {
      value: args.measuredParticleSizeUm,
      label: "CENTER",
      evidence: args.measuredParticleSizeUm == null ? "NOT_DEFINED" : "MEASURED",
    },
    { value: null, label: "HIGH", evidence: "NOT_DEFINED" },
  ];

  const factorDomainReady =
    substitutionLevels.every((level) => level.value != null) &&
    particleLevels.every((level) => level.value != null);

  const qualificationReady = args.qualificationStatus !== "INSUFFICIENT_DATA";
  const status = factorDomainReady && qualificationReady
    ? "READY_FOR_DESIGN"
    : "BLOCKED_BY_FACTOR_DOMAIN";

  const runs: DoeRun[] = [];
  const pairs = factorDomainReady
    ? substitutionLevels.flatMap((s) => particleLevels.map((p) => [s.value!, p.value!] as const))
    : [];

  pairs.forEach(([substitutionPct, particleSizeUm], index) => {
    runs.push({
      run: index + 1,
      substitutionPct,
      particleSizeUm,
      status: "PLANNED",
    });
  });

  if (!factorDomainReady) {
    runs.push({
      run: 1,
      substitutionPct: args.substitutionMin,
      particleSizeUm: args.measuredParticleSizeUm,
      status: "BLOCKED",
    });
  }

  const notes = [
    "DOE digunakan untuk menghasilkan evidence baru pada konfigurasi paving block yang dituju; literatur hanya membentuk ruang hipotesis.",
    "Kuat tekan dan penyerapan air adalah respons utama; workability merupakan respons pendukung.",
    "ANOVA dan RSM tidak dijalankan pada data sintetis. Keduanya menunggu dataset eksperimen aktual dengan struktur yang memadai.",
  ];

  if (!qualificationReady) {
    notes.push("Material qualification belum cukup untuk membuka rancangan eksperimen.");
  }
  if (!args.measuredParticleSizeUm) {
    notes.push("Ukuran partikel aktual belum tersedia; domain faktor kedua belum dapat dibentuk.");
  }
  if (args.substitutionMin == null || args.substitutionMax == null) {
    notes.push("Rentang substitusi berbasis evidence langsung belum tersedia.");
  }

  return {
    status,
    design: "TWO_FACTOR_SCREENING",
    factors: [
      {
        key: "substitutionPct",
        label: "Kadar substitusi material",
        unit: "% massa semen",
        role: "PRIMARY_FACTOR",
        levels: substitutionLevels,
        note: "Level awal diturunkan dari rentang evidence paving block langsung; bukan optimum universal.",
      },
      {
        key: "particleSizeUm",
        label: "Ukuran partikel",
        unit: "μm",
        role: "PRIMARY_FACTOR",
        levels: particleLevels,
        note: "Rentang numerik harus berasal dari karakterisasi/berkas evidence; sistem tidak mengarang domain faktor.",
      },
    ],
    responses: [
      { key: "compressiveStrength", label: "Kuat tekan", role: "PRIMARY_RESPONSE", unit: "MPa" },
      { key: "waterAbsorption", label: "Penyerapan air", role: "PRIMARY_RESPONSE", unit: "%" },
      { key: "workability", label: "Workability", role: "SUPPORTING_RESPONSE", unit: "mm" },
    ],
    runs,
    runCount: factorDomainReady ? runs.length : 0,
    model: {
      path: ["DOE", "ANOVA", "RSM"],
      status: "WAITING_FOR_EXPERIMENTAL_DATA",
      note: "Model hanya diaktifkan setelah data eksperimen aktual tersedia dan memenuhi persyaratan analisis.",
    },
    notes,
  };
}
