import {
  normalizedEconomicScenario,
  normalizedEnvironmentalFactors,
  hasValidatedSilica2ConExperiment,
  paperEconomicScreening,
  type NormalizedEconomicScenario,
} from "../data/master";
import {
  massBalance,
  type MixInput,
  type MassBalanceResult,
} from "./massBalance";
import { evidenceForPaving, type EvidenceResult } from "./evidenceEngine";
import { checkSNI, type SNIResult } from "./sniEngine";
import { calcTea, type TeaScenario } from "./teaEngine";
import { calcEnvironment } from "./environmentEngine";
import { validationRoadmap } from "./validationEngine";
import { decide } from "./decisionEngine";
import type { ReplacementBasis } from "./contracts";
import type { ScienceEngine } from "./scienceEngine";
import type { Characterization, EconomicControls } from "../study";

export type SimulationInput = MixInput & {
  targetClass?: string;
  materialId?: string;
  batchId?: string;
  sampleId?: string;
  aggregateType?: "FINE" | "COARSE";
  actualSNI?: Parameters<typeof checkSNI>[1];
  teaScenario?: "baseline" | "conservative" | "optimistic";
  economicOverrides?: EconomicControls;
};

export type SimulationState = {
  formulation: {
    replacementValue: number | null;
    replacementBasis: ReplacementBasis;
    targetClass: string;
  };
  massBalance: MassBalanceResult;
  evidence: EvidenceResult;
  sni: SNIResult;
  tea: ReturnType<typeof calcTea>;
  environment: ReturnType<typeof calcEnvironment>;
  validation: ReturnType<typeof validationRoadmap>;
  decision: ReturnType<typeof decide>;
  material: ScienceEngine["materialQualification"];
};

export function buildSimulationState(
  input: SimulationInput,
  science: ScienceEngine,
  characterization?: Characterization,
): SimulationState {
  const targetClass = input.targetClass ?? "C";
  const mass = massBalance(input);
  const evidence = evidenceForPaving(
    input.replacementValue,
    input.replacementBasis,
  );
  const sni = checkSNI(targetClass, input.actualSNI ?? {});
  const scenario: TeaScenario = normalizedEconomicScenario(
    input.teaScenario ?? "baseline",
  );
  let tea: ReturnType<typeof calcTea>;
  if (
    mass.status === "CALCULATED" &&
    input.cementKg != null &&
    input.aggregateKg != null &&
    input.waterKg != null &&
    mass.residueKg != null
  ) {
    const cementKg = input.cementKg;
    const aggregateKg = input.aggregateKg;
    const residueKg = mass.residueKg;
    const waterKg = input.waterKg;
    tea = calcTea({
      scenario,
      cementKg: mass.cementFinalKg ?? cementKg,
      aggregateKg,
      aggregateType: input.aggregateType ?? "FINE",
      residueKg,
      waterKg,
      admixtureKg: input.admixtureKg ?? 0,
      batchBlocks: input.batchBlocks ?? null,
      blocksPerM2: mass.blocksPerM2,
      processingCostIdrTon:
        input.economicOverrides?.processingCostIdrTon ?? null,
      cementPriceOverrideIdrKg:
        input.economicOverrides?.cementPriceIdrKg ?? null,
      transportDistanceOverrideKm:
        input.economicOverrides?.transportDistanceKm ?? null,
      electricityPriceOverrideIdrKwh:
        input.economicOverrides?.electricityPriceIdrKwh ?? null,
    });
  } else {
    tea = {
      raw: null,
      processingEnergyKwh: null,
      energy: null,
      transport: null,
      labor: null,
      processingAllowance: null,
      total: null,
      costPerBlock: null,
      costPerM2: null,
      status: "DATA_REQUIRED",
      missing: ["MASS_BALANCE_REQUIRED"],
      assumptions: {},
    };
  }
  const factors = normalizedEnvironmentalFactors;
  const factor = (name: string) =>
    factors.find((x) => x.factor === name)?.value ?? null;
  const transportDistanceValue =
    input.economicOverrides?.transportDistanceKm ??
    scenario.transport_distance_km?.value;
  const transportDistanceKm =
    typeof transportDistanceValue === "number" ? transportDistanceValue : null;
  const residueForEnvironment =
    mass.status === "CALCULATED" ? mass.residueKg : null;
  const environment = calcEnvironment({
    cementAvoidedKg:
      mass.status === "CALCULATED" && mass.cementReplacedKg != null
        ? mass.cementReplacedKg
        : null,
    cementEF:
      mass.status === "CALCULATED"
        ? factor("cement_emission_factor_kgco2e_per_kg")
        : null,
    cementEFStatus:
      mass.status === "CALCULATED"
        ? (factors.find(
            (x) => x.factor === "cement_emission_factor_kgco2e_per_kg",
          )?.status ?? null)
        : null,
    cementEFSourceId:
      mass.status === "CALCULATED"
        ? (factors.find(
            (x) => x.factor === "cement_emission_factor_kgco2e_per_kg",
          )?.source_id ?? null)
        : null,
    processingEnergyKwh:
      mass.status === "CALCULATED" ? tea.processingEnergyKwh : null,
    electricityEF: factor("electricity_emission_factor_kgco2e_per_kwh"),
    transportTonKm:
      mass.status === "CALCULATED" &&
      residueForEnvironment != null &&
      residueForEnvironment > 0
        ? transportDistanceKm == null
          ? null
          : (residueForEnvironment / 1000) * transportDistanceKm
        : 0,
    transportEF: factor("transport_emission_factor_kgco2e_per_ton_km"),
    chemicalKg: input.admixtureKg ?? null,
    chemicalEF: factor("chemical_emission_factor_kgco2e_per_kg"),
  });
  const material = science.materialQualification;
  const validation = validationRoadmap();
  const economicBenchmarkCostPerBlock =
    paperEconomicScreening?.scenarios?.[
      input.teaScenario === "baseline" ? "base" : (input.teaScenario ?? "base")
    ]?.production_cost_per_block ?? null;
  const decision = decide({
    mixValid:
      mass.errors.length === 0 &&
      mass.totalBatchKg != null &&
      mass.totalBatchKg > 0,
    replacementValue: input.replacementValue,
    replacementBasis: input.replacementBasis,
    evidence,
    sniStatus: sni.status,
    economicStatus: tea.status,
    environmentStatus: environment.status,
    validationStatus: hasValidatedSilica2ConExperiment()
      ? "VALIDATED"
      : "VALIDATION_REQUIRED",
    materialId: input.materialId,
    batchId: input.batchId,
    sampleId: input.sampleId,
    materialQualification: science.materialQualification,
    technicalFail: sni.status === "PRELIMINARY_FAIL",
    outsideEvidenceRange:
      science.formulationSpace.activeCandidate.outsideDirectSubstitutionRange,
    economicCostPerBlock: tea.costPerBlock,
    economicBenchmarkCostPerBlock,
    environmentalNet: environment.net,
    characterization,
  });
  return {
    formulation: {
      replacementValue: input.replacementValue,
      replacementBasis: input.replacementBasis,
      targetClass,
    },
    massBalance: mass,
    evidence,
    sni,
    tea,
    environment,
    validation,
    decision,
    material,
  };
}
