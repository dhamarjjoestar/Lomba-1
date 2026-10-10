import { paperEconomicScreening } from '../data/master';

export type PaperScenarioName = 'conservative' | 'base' | 'optimistic';

export interface PaperBridgeInput {
  substitutionPct: number;
  cementFractionPct?: number;
  massPerBlockKg?: number;
  blocksPerDay?: number;
  residueCapacityTPerDay?: number;
}

export interface PaperEconomicScenario {
  sellingPricePerM2: number;
  sellingPricePerBlock: number;
  productionCostPerBlock: number;
  marginPerBlock: number;
  revenuePerDay: number;
  productionCostPerDay: number;
  operatingCashFlowPerDay: number;
  operatingCashFlowPerYear: number;
  paybackMonths: number;
}

export interface PaperBridgeResult {
  substitutionPct: number;
  cementFractionPct: number;
  massPerBlockKg: number;
  blocksPerDay: number;
  residuePerBlockKg: number;
  residueRequiredPerDayT: number;
  residueCapacityTPerDay: number;
  capacityUtilizationPct: number;
  withinIllustrativeLiteratureWindow: boolean;
  status: 'CALCULATED' | 'OUTSIDE_EVIDENCE_RANGE' | 'DATA_REQUIRED';
}

const paper = paperEconomicScreening;

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function calcPaperResidueBridge(input: PaperBridgeInput): PaperBridgeResult {
  const substitutionPct = input.substitutionPct;
  const defaults = paper
    ? {
        cementFractionPct: paper.bridge.cement_fraction_pct,
        massPerBlockKg: paper.production.mass_per_block_kg,
        blocksPerDay: paper.production.finished_block_production_per_day,
        residueCapacityTPerDay: paper.production.residue_processing_capacity_t_per_day,
      }
    : null;

  const cementFractionPct = input.cementFractionPct ?? defaults?.cementFractionPct;
  const massPerBlockKg = input.massPerBlockKg ?? defaults?.massPerBlockKg;
  const blocksPerDay = input.blocksPerDay ?? defaults?.blocksPerDay;
  const residueCapacityTPerDay = input.residueCapacityTPerDay ?? defaults?.residueCapacityTPerDay;

  if (
    !paper ||
    !finite(substitutionPct) ||
    !finite(cementFractionPct) ||
    !finite(massPerBlockKg) ||
    !finite(blocksPerDay) ||
    !finite(residueCapacityTPerDay)
  ) {
    return {
      substitutionPct,
      cementFractionPct: finite(cementFractionPct) ? cementFractionPct : 0,
      massPerBlockKg: finite(massPerBlockKg) ? massPerBlockKg : 0,
      blocksPerDay: finite(blocksPerDay) ? blocksPerDay : 0,
      residuePerBlockKg: 0,
      residueRequiredPerDayT: 0,
      residueCapacityTPerDay: finite(residueCapacityTPerDay) ? residueCapacityTPerDay : 0,
      capacityUtilizationPct: 0,
      withinIllustrativeLiteratureWindow: false,
      status: 'DATA_REQUIRED',
    };
  }

  const residuePerBlockKg = (substitutionPct / 100) * (cementFractionPct / 100) * massPerBlockKg;
  const residueRequiredPerDayT = (residuePerBlockKg * blocksPerDay) / 1000;
  const capacityUtilizationPct = residueCapacityTPerDay > 0
    ? (residueRequiredPerDayT / residueCapacityTPerDay) * 100
    : 0;
  const [low, high] = paper.bridge.illustrative_substitution_window_pct;
  const withinIllustrativeLiteratureWindow = substitutionPct >= low && substitutionPct <= high;

  return {
    substitutionPct,
    cementFractionPct,
    massPerBlockKg,
    blocksPerDay,
    residuePerBlockKg,
    residueRequiredPerDayT,
    residueCapacityTPerDay,
    capacityUtilizationPct,
    withinIllustrativeLiteratureWindow,
    status: withinIllustrativeLiteratureWindow ? 'CALCULATED' : 'OUTSIDE_EVIDENCE_RANGE',
  };
}

export function getPaperEconomicScenario(name: PaperScenarioName): PaperEconomicScenario {
  if (!paper) throw new Error('PAPER_TEA_DATA_MISSING');
  const row = paper.scenarios[name];
  if (!row) {
    throw new Error(`PAPER_TEA_SCENARIO_MISSING:${name}`);
  }
  const marginPerBlock = row.selling_price_per_block - row.production_cost_per_block;
  const operatingCashFlowPerDay = marginPerBlock * row.blocks_per_day;
  const operatingCashFlowPerYear = operatingCashFlowPerDay * row.annual_operating_days;
  const paybackMonths = row.capex_idr / (operatingCashFlowPerYear / 12);

  return {
    sellingPricePerM2: row.selling_price_per_m2,
    sellingPricePerBlock: row.selling_price_per_block,
    productionCostPerBlock: row.production_cost_per_block,
    marginPerBlock,
    revenuePerDay: row.selling_price_per_block * row.blocks_per_day,
    productionCostPerDay: row.production_cost_per_block * row.blocks_per_day,
    operatingCashFlowPerDay,
    operatingCashFlowPerYear,
    paybackMonths,
  };
}

export function getPaperEconomicMeta() {
  return paperEconomicScreening;
}
