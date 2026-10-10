export type EvidenceLevel = 'Validated' | 'Literature-supported' | 'Screening Estimate' | 'Insufficient Data';

export type DecisionStatus = 'Recommended' | 'Bersyarat' | 'Not Recommended' | 'Data Diperlukan';

export type PageId = 'beranda' | 'simulasi' | 'metopen' | 'tim-kami';

export interface ResidueOption {
  id: string;
  name: string;
  sio2: number;
  surfaceArea: number;
  phase: string;
  provenance: string;
  status: string;
}

export interface SniSpec {
  minCompressive: number;
  maxAbsorption: number;
  label: string;
}

export interface SimulationParams {
  selectedResidueId: string;
  substitutionRate: number; // 0 - 30%
  targetMutu: 'A' | 'B' | 'C' | 'D';
  dailyCapacity: number; // blocks / day
  sellingPricePerM2: number; // IDR / m2
}

export interface SimulationOutput {
  predictedCompressiveStrength: number;
  requiredCompressiveStrength: number;
  waterAbsorption: number;
  maxWaterAbsorption: number;
  slumpWorkability: number;
  clinkerSavedPerDay: number;
  co2SavedPerDay: number;
  costPerBlock: number;
  sellingPricePerBlock: number;
  grossMarginPerBlock: number;
  dailyOperatingCashFlow: number;
  annualOperatingCashFlow: number;
  paybackMonths: number;
  technicalGatePassed: boolean;
  agglomerationRisk: boolean;
  decisionStatus: DecisionStatus;
  evidenceStrength: EvidenceLevel;
  verdictReason: string;
  identifiedDataGaps: string[];
}

export const RESIDUE_OPTIONS: ResidueOption[] = [
  {
    id: 'xerogel',
    name: 'Silika Xerogel Amorf (PLTP Dieng)',
    sio2: 95.7,
    surfaceArea: 302.8,
    phase: 'Amorf Terkonfirmasi',
    provenance: 'Widiyandari et al. (2021) / H.S.N et al. (2023)',
    status: 'Lolos Kualifikasi',
  },
  {
    id: 'sludge_treated',
    name: 'Geothermal Sludge Kering & Tergiling (Dieng)',
    sio2: 78.4,
    surfaceArea: 64.2,
    phase: 'Semi-Amorf',
    provenance: 'Meiyati et al. (2015) / Agustinus et al. (2018)',
    status: 'Lolos Bersyarat',
  },
  {
    id: 'nanosilica_waste',
    name: 'Geothermal Nano-SiO₂ Waste (Olahan)',
    sio2: 98.2,
    surfaceArea: 420.0,
    phase: 'Nano-Amorf',
    provenance: 'López-Perales et al. (2024)',
    status: 'Lolos Kualifikasi',
  },
];

export const SNI_MUTU_SPECS: Record<'A' | 'B' | 'C' | 'D', SniSpec> = {
  A: { minCompressive: 40, maxAbsorption: 3, label: 'Mutu A (Jalan Raya / Beban Berat)' },
  B: { minCompressive: 20, maxAbsorption: 6, label: 'Mutu B (Pelataran Parkir / Trotoar)' },
  C: { minCompressive: 15, maxAbsorption: 8, label: 'Mutu C (Taman & Pejalan Kaki)' },
  D: { minCompressive: 10, maxAbsorption: 10, label: 'Mutu D (Lain-lain / Non-Struktural)' },
};

/**
 * Domain Logic: Science & Decision Calculation Engine
 */
export function calculateDssSimulation(params: SimulationParams): SimulationOutput {
  const activeResidue =
    RESIDUE_OPTIONS.find((r) => r.id === params.selectedResidueId) || RESIDUE_OPTIONS[0];
  const spec = SNI_MUTU_SPECS[params.targetMutu];

  const baseStrength = 21.0;
  let strengthMultiplier = 1.0;
  let agglomeration = false;

  if (params.substitutionRate <= 5) {
    strengthMultiplier = 1.0 + (params.substitutionRate / 5) * 0.12;
  } else if (params.substitutionRate <= 15) {
    strengthMultiplier = 1.12 + ((params.substitutionRate - 5) / 10) * 0.16;
  } else if (params.substitutionRate <= 20) {
    strengthMultiplier = 1.28 + ((params.substitutionRate - 15) / 5) * 0.04;
  } else {
    const penalty = (params.substitutionRate - 20) * 0.035;
    strengthMultiplier = Math.max(0.7, 1.32 - penalty);
    agglomeration = true;
  }

  const materialFactor = activeResidue.sio2 / 95.0;
  const predictedStrength = Number((baseStrength * strengthMultiplier * materialFactor).toFixed(1));

  let absorption = 7.2 - params.substitutionRate * 0.1;
  if (agglomeration) absorption += (params.substitutionRate - 20) * 0.25;
  absorption = Math.max(3.5, Number(absorption.toFixed(1)));

  const baseSlump = 140;
  const slump = Math.max(30, Math.round(baseSlump - params.substitutionRate * 3.8));

  const cementPerBlock = 0.44;
  const silicaPerBlock = (cementPerBlock * params.substitutionRate) / 100;
  const clinkerSavedPerDay = Math.round(params.dailyCapacity * silicaPerBlock);
  const co2SavedPerDay = Math.round(clinkerSavedPerDay * 0.85);

  const sellingPricePerBlock = Math.round(params.sellingPricePerM2 / 50);
  const cementCostPerKg = 1.6;
  const residueCostPerKg = 0.503;
  const rawMaterialSavingsPerBlock = silicaPerBlock * (cementCostPerKg - residueCostPerKg) * 1000;
  const costPerBlock = Math.max(1050, Math.round(1250 - rawMaterialSavingsPerBlock));
  const grossMarginPerBlock = sellingPricePerBlock - costPerBlock;
  const dailyOperatingCashFlow = params.dailyCapacity * grossMarginPerBlock;
  const annualOperatingCashFlow = dailyOperatingCashFlow * 25 * 12;

  const capex = 276000000;
  const paybackMonths = Number((capex / (dailyOperatingCashFlow * 25)).toFixed(1));

  const technicalGatePassed =
    predictedStrength >= spec.minCompressive && absorption <= spec.maxAbsorption;

  let decisionStatus: DecisionStatus = 'Recommended';
  let evidenceStrength: EvidenceLevel = 'Validated';
  let verdictReason = '';
  const identifiedDataGaps: string[] = [];

  if (!technicalGatePassed) {
    decisionStatus = 'Not Recommended';
    evidenceStrength = 'Validated';
    verdictReason = `Gagal pada Technical Gate: Kuat tekan (${predictedStrength} MPa) di bawah ambang batas minimum SNI ${params.targetMutu} (${spec.minCompressive} MPa).`;
    identifiedDataGaps.push('Formulasi tidak memenuhi kuat tekan minimum SNI 03-0691-1996.');
  } else if (agglomeration || params.substitutionRate > 15) {
    decisionStatus = 'Bersyarat';
    evidenceStrength = 'Screening Estimate';
    verdictReason = `Lolos persyaratan teknis, namun substitusi tinggi (${params.substitutionRate}%) berisiko aglomerasi dan menurunkan slump workability (${slump} mm). Membutuhkan superplasticizer dan uji batch laboratorium.`;
    identifiedDataGaps.push('Diperlukan pengujian workability & porositas aktual dengan superplasticizer.');
    identifiedDataGaps.push('Validasi ketahanan aus (abrasion resistance) prototipe cetak.');
  } else {
    decisionStatus = 'Recommended';
    evidenceStrength = 'Literature-supported';
    verdictReason = `Lolos seluruh gate: Kuat tekan (${predictedStrength} MPa) melampaui standar SNI ${params.targetMutu}, margin ekonomi sehat (Rp ${grossMarginPerBlock}/blok), dan payback cepat (~${paybackMonths} bulan).`;
    identifiedDataGaps.push('Konfirmasi kestabilan pasokan sludge antar-musim di lapangan Dieng.');
  }

  return {
    predictedCompressiveStrength: predictedStrength,
    requiredCompressiveStrength: spec.minCompressive,
    waterAbsorption: absorption,
    maxWaterAbsorption: spec.maxAbsorption,
    slumpWorkability: slump,
    clinkerSavedPerDay,
    co2SavedPerDay,
    costPerBlock,
    sellingPricePerBlock,
    grossMarginPerBlock,
    dailyOperatingCashFlow,
    annualOperatingCashFlow,
    paybackMonths,
    technicalGatePassed,
    agglomerationRisk: agglomeration,
    decisionStatus,
    evidenceStrength,
    verdictReason,
    identifiedDataGaps,
  };
}
