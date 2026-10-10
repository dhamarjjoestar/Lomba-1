import {
  hasValidatedExperimentRecord,
  type EvidenceResult,
} from "./evidenceEngine";
import type { ScienceEngine } from "./scienceEngine";
import type {
  DSSDecision,
  ReplacementBasis,
  SNIResultState,
  ValueStatus,
} from "./contracts";

export type DecisionInput = {
  mixValid: boolean;
  replacementValue: number | null;
  replacementBasis: ReplacementBasis;
  // Computed once in simulation.ts and passed in here so the decision trail
  // and every page that reads it (Evidence, Traceability, Recommendation)
  // agree on a single EvidenceResult. Do not recompute evidence internally —
  // that previously caused Evidence/Traceability and Recommendation to show
  // different evidence data whenever replacementValue was null.
  evidence: EvidenceResult;
  sniStatus: SNIResultState;
  economicStatus: ValueStatus | string;
  environmentStatus: ValueStatus | string;
  validationStatus: ValueStatus | string;
  materialId?: string;
  batchId?: string;
  sampleId?: string;
  materialQualification: ScienceEngine["materialQualification"];
  economicCostPerBlock?: number | null;
  economicBenchmarkCostPerBlock?: number | null;
  environmentalNet?: number | null;
  characterization?: { phase?: string; particle?: string; silica?: string };
  technicalFail: boolean;
  outsideEvidenceRange?: boolean;
};

export type DecisionResult = {
  decision: DSSDecision;
  reasons: string[];
  evidence: EvidenceResult;
  material: ScienceEngine["materialQualification"];
  warnings: string[];
  trace: string[];
  technicalGate: { passed: boolean; reason: string | null };
};

export function decide(input: DecisionInput): DecisionResult {
  const evidence = input.evidence;
  const material = input.materialQualification;
  const validatedExperiment = hasValidatedExperimentRecord();
  const reasons: string[] = [];
  const warnings: string[] = [];
  const trace: string[] = [];
  const technicalGateFailed =
    input.technicalFail || input.sniStatus === "PRELIMINARY_FAIL";
  const technicalGate = {
    passed: !technicalGateFailed,
    reason: technicalGateFailed
      ? "Gerbang teknis atau standar awal yang diperlukan gagal."
      : null,
  };
  if (!input.mixValid || input.replacementBasis === "UNKNOWN") {
    const reason =
      "Input formulasi belum lengkap atau dasar substitusi belum ditetapkan.";
    trace.push(reason);
    return {
      decision: "DATA_REQUIRED",
      reasons: [reason],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  if (technicalGateFailed) {
    const reason = "Gerbang teknis atau standar awal yang diperlukan gagal.";
    trace.push(reason);
    return {
      decision: "NOT_SUPPORTED",
      reasons: [reason],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  if (
    evidence.evidenceClass === "EXTRAPOLATION" ||
    input.outsideEvidenceRange
  ) {
    const outOfRangeReason = input.outsideEvidenceRange
      ? "Kandidat berada di luar rentang substitusi yang didukung evidence paving block langsung (Science Engine); diperlakukan sebagai ruang eksplorasi, bukan evidence tervalidasi."
      : evidence.explanation;
    warnings.push(outOfRangeReason);
    trace.push(
      "Tidak tersedia dasar literatur paving langsung pada tingkat substitusi ini.",
    );
    return {
      decision: "DATA_REQUIRED",
      reasons: [outOfRangeReason],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  if (material.status === "INSUFFICIENT_DATA") {
    const reason =
      "Kualifikasi material/batch/sampel SILICA2CON aktual belum lengkap; karakterisasi literatur hanya menjadi konteks.";
    trace.push(reason);
    return {
      decision: "DATA_REQUIRED",
      reasons: [reason],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  if (evidence.status === "DATA_REQUIRED") {
    trace.push(evidence.explanation);
    return {
      decision: "DATA_REQUIRED",
      reasons: [evidence.explanation],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  if (evidence.evidenceClass === "DIRECT")
    trace.push(
      "Bukti literatur paving block langsung tersedia pada kondisi substitusi yang dipilih.",
    );
  if (evidence.isControlPoint)
    trace.push(
      "0% is treated as the literature control and is excluded from the replacement evidence range.",
    );
  if (evidence.matchedReplacementBasis === input.replacementBasis)
    trace.push(
      "Dasar substitusi sesuai dengan dasar literatur yang relevan secara langsung.",
    );
  if (evidence.matchedTestingAge)
    trace.push(
      `Bukti langsung dilaporkan pada usia pengujian ${evidence.matchedTestingAge}; hasil tersebut tidak diubah menjadi usia pengujian yang berbeda.`,
    );
  trace.push(
    "Bukti literatur tetap merupakan bukti eksternal, bukan validasi eksperimental SILICA2CON.",
  );
  if (material.missing.length > 0)
    trace.push("Sebagian karakterisasi batch/sampel aktual masih diperlukan.");
  if (
    !validatedExperiment ||
    input.validationStatus === "VALIDATION_REQUIRED" ||
    input.validationStatus === "EXPERIMENT_REQUIRED"
  ) {
    const reason =
      "Validasi paving block eksperimental SILICA2CON belum lengkap.";
    reasons.push(reason);
    trace.push(reason);
  }
  if (input.sniStatus === "DATA_REQUIRED" || input.sniStatus === "UNKNOWN") {
    const reason = "Parameter SNI masih belum terverifikasi.";
    reasons.push(reason);
    trace.push(
      "Parameter SNI masih belum terverifikasi; penyaringan awal bukan sertifikasi.",
    );
  }
  if (
    input.characterization?.phase &&
    /kristal/i.test(input.characterization.phase)
  ) {
    reasons.push(
      "Fase material dicatat sebagai kristalin; literatur menunjukkan perlakuan/struktur material dapat memengaruhi aktivitas sehingga validasi batch tetap diperlukan.",
    );
    trace.push(
      "Fase material aktif digunakan sebagai konteks keputusan dan tidak diubah menjadi klaim performa.",
    );
  }
  if (
    input.economicCostPerBlock != null &&
    Number.isFinite(input.economicCostPerBlock)
  ) {
    trace.push(
      `Economic screening current study: biaya indikatif ${Math.round(
        input.economicCostPerBlock,
      )} IDR/block.`,
    );

    if (
      input.economicBenchmarkCostPerBlock != null &&
      Number.isFinite(input.economicBenchmarkCostPerBlock)
    ) {
      const delta =
        input.economicCostPerBlock - input.economicBenchmarkCostPerBlock;

      if (delta <= 0) {
        trace.push(
          `Biaya current study berada pada atau di bawah benchmark skenario (${Math.round(
            input.economicBenchmarkCostPerBlock,
          )} IDR/block).`,
        );
      } else {
        trace.push(
          `Biaya current study berada di atas benchmark skenario sebesar ${Math.round(
            delta,
          )} IDR/block.`,
        );
      }
    }
  }
  if (input.environmentalNet == null) {
    trace.push(
      "Environmental screening belum memiliki inventaris lengkap untuk menentukan dampak bersih.",
    );
  } else if (Number.isFinite(input.environmentalNet)) {
    if (input.environmentalNet > 0) {
      trace.push(
        `Environmental screening menunjukkan potensi penghindaran CO₂ bersih sebesar ${input.environmentalNet.toFixed(
          2,
        )} kgCO₂e pada boundary screening.`,
      );
    } else if (input.environmentalNet < 0) {
      trace.push(
        `Environmental screening menunjukkan beban emisi bersih sebesar ${Math.abs(
          input.environmentalNet,
        ).toFixed(2)} kgCO₂e pada boundary screening.`,
      );
    } else {
      trace.push(
        "Environmental screening menunjukkan hasil bersih sekitar nol pada boundary screening.",
      );
    }
  }
  if (
    input.economicStatus === "DATA_REQUIRED" ||
    input.economicStatus === "UNKNOWN"
  ) {
    const reason = "Input ekonomi masih berbasis skenario atau belum lengkap.";
    reasons.push(reason);
    trace.push("Input ekonomi masih berbasis skenario atau belum lengkap.");
  }
  if (
    input.economicCostPerBlock != null &&
    input.economicBenchmarkCostPerBlock != null &&
    Number.isFinite(input.economicCostPerBlock) &&
    Number.isFinite(input.economicBenchmarkCostPerBlock) &&
    input.economicCostPerBlock > input.economicBenchmarkCostPerBlock
  ) {
    const reason =
      "Biaya current study berada di atas benchmark skenario ekonomi.";
    reasons.push(reason);
    trace.push(reason);
  }
  if (
    input.environmentStatus === "DATA_REQUIRED" ||
    input.environmentStatus === "UNKNOWN"
  ) {
    const reason =
      "Inventaris lingkungan atau faktor emisi masih belum lengkap.";
    reasons.push(reason);
    trace.push(
      "Inventaris lingkungan atau faktor emisi masih belum lengkap; tidak ada klaim CO₂ bersih tanpa dukungan bukti.",
    );
  }
  if (
    input.environmentalNet != null &&
    Number.isFinite(input.environmentalNet) &&
    input.environmentalNet < 0
  ) {
    const reason =
      "Environmental screening menunjukkan beban emisi bersih pada boundary screening.";
    reasons.push(reason);
    trace.push(reason);
  }
  if (reasons.length)
    return {
      decision: "CONDITIONAL",
      reasons,
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  if (validatedExperiment && input.validationStatus === "VALIDATED") {
    trace.push(
      "Rekam validasi eksperimental SILICA2CON kanonik tersedia dan ditandai TERVALIDASI.",
    );
    return {
      decision: "VALIDATED",
      reasons: [
        "Validasi eksperimental SILICA2CON yang diperlukan telah lengkap dalam lingkup yang ditetapkan.",
      ],
      evidence,
      material,
      warnings,
      trace,
      technicalGate,
    };
  }
  trace.push(
    "Bukti dan gerbang penyaringan mendukung, tetapi validasi SILICA2CON belum lengkap.",
  );
  return {
    decision: "PRELIMINARY_PROMISING",
    reasons: [
      "Bukti dan gerbang penyaringan mendukung, tetapi validasi SILICA2CON belum lengkap.",
    ],
    evidence,
    material,
    warnings,
    trace,
    technicalGate,
  };
}
