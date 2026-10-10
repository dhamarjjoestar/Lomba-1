export function displayDecision(
  decision: string,
):
  | "Direkomendasikan"
  | "Bersyarat"
  | "Tidak Direkomendasikan"
  | "Data Tidak Mencukupi" {
  if (decision === "NOT_SUPPORTED") return "Tidak Direkomendasikan";
  if (decision === "DATA_REQUIRED") return "Data Tidak Mencukupi";
  if (decision === "VALIDATED") return "Direkomendasikan";
  return "Bersyarat";
}

export function decisionClass(decision: string): string {
  const label = displayDecision(decision);
  if (label === "Direkomendasikan") return "success";
  if (label === "Tidak Direkomendasikan") return "danger";
  if (label === "Data Tidak Mencukupi") return "muted";
  return "gold";
}

export function evidenceLabel(value: string | null | undefined): string {
  if (!value) return "DATA DIPERLUKAN";
  const labels: Record<string, string> = {
    DATA_REQUIRED: "DATA DIPERLUKAN",
    LITERATURE_SUPPORTED: "DIDUKUNG LITERATUR",
    ASSUMPTION: "ASUMSI",
    DEMO: "DEMO",
    SIMULATION_INPUT: "INPUT SIMULASI",
    DIRECT_LITERATURE: "LANGSUNG / LITERATUR",
    VALIDATION_REQUIRED: "VALIDASI DIPERLUKAN",
    ENVIRONMENTAL_SCREENING_ONLY: "PENYARINGAN LINGKUNGAN SAJA",
    TRACE_COMPLETE: "JEJAK LENGKAP",
    REPORTED: "DILAPORKAN",
    VALIDATED: "TERVALIDASI",
    NOT_SUPPORTED: "TIDAK DIDUKUNG",
    CONDITIONAL: "BERSYARAT",
    LULUS: "LULUS",
    GAGAL: "GAGAL",
    MEASURED: "TERUKUR",
    LITERATURE: "LITERATUR",
    ENGINEERING_ESTIMATE: "ESTIMASI ENGINEERING",
    SCENARIO: "SKENARIO",
    DERIVED: "TERTURUNKAN",
    CALCULATED: "TERHITUNG",
    OUTSIDE_EVIDENCE_RANGE: "DI LUAR RENTANG BUKTI",
    EXTRAPOLATION: "EKSTRAPOLASI",
    RELATED: "TERKAIT",
    CONTEXT_DEPENDENT: "TERGANTUNG KONTEKS",
    PRELIMINARY_PROMISING: "AWAL MENJANJIKAN",
    EXPERIMENT_REQUIRED: "EKSPERIMEN DIPERLUKAN",
    UNKNOWN: "TIDAK DIKETAHUI",
    PRELIMINARY_PASS: "LULUS AWAL",
    PRELIMINARY_FAIL: "GAGAL AWAL",
    INPUT_SIMULASI: "INPUT SIMULASI",
    INPUT_PENGGUNA: "INPUT PENGGUNA",
  };
  return labels[value] ?? String(value).replaceAll("_", " ");
}

