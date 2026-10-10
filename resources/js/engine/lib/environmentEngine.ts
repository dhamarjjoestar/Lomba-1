import type { ValueStatus } from "./contracts";

export function calcEnvironment(p: {
  cementAvoidedKg: number | null;
  cementEF: number | null;
  cementEFSourceId?: string | null;
  cementEFStatus?: string | null;
  processingEnergyKwh: number | null;
  electricityEF: number | null;
  transportTonKm: number | null;
  transportEF: number | null;
  chemicalKg: number | null;
  chemicalEF: number | null;
}) {
  const missing: string[] = [];

  if (p.cementAvoidedKg == null) missing.push("cement avoided mass");
  if (p.cementEF == null) missing.push("cement emission factor");
  if (
    p.cementEF != null &&
    p.cementEFStatus !== "ASSUMPTION" &&
    !p.cementEFSourceId
  ) {
    missing.push("asal faktor emisi semen");
  }

  if (p.processingEnergyKwh == null)
    missing.push("processing energy inventory");
  if (
    p.processingEnergyKwh != null &&
    p.processingEnergyKwh > 0 &&
    p.electricityEF == null
  ) {
    missing.push("electricity emission factor");
  }

  if (p.transportTonKm == null) {
    missing.push("transport distance / transport inventory");
  }

  if (
    p.transportTonKm != null &&
    p.transportTonKm > 0 &&
    p.transportEF == null
  ) {
    missing.push("transport emission factor");
  }

  if (p.chemicalKg == null) missing.push("chemical inventory");

  if (p.chemicalKg != null && p.chemicalKg > 0 && p.chemicalEF == null) {
    missing.push("chemical emission factor");
  }

  const avoided =
    p.cementAvoidedKg == null || p.cementEF == null
      ? null
      : p.cementAvoidedKg * p.cementEF;

  const process =
    p.processingEnergyKwh == null || p.electricityEF == null
      ? null
      : p.processingEnergyKwh * p.electricityEF;

  const transport =
    p.transportTonKm == null || p.transportEF == null
      ? null
      : p.transportTonKm * p.transportEF;

  const chemical =
    p.chemicalKg == null || p.chemicalEF == null
      ? null
      : p.chemicalKg * p.chemicalEF;

  const complete = missing.length === 0;

  const net = complete ? avoided! - process! - transport! - chemical! : null;

  const status: ValueStatus = complete ? "CALCULATED" : "DATA_REQUIRED";

  return {
    complete,
    missing,
    avoided,
    process,
    transport,
    chemical,
    chemicalKg: p.chemicalKg,
    net,
    status,
    boundary: "PRELIMINARY_GATE_TO_GATE_SCREENING",
    avoidanceLabel: "POTENSI PENGHINDARAN CO₂ TERKAIT SEMEN",
  };
}
