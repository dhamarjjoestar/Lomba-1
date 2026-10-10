import type {ValueStatus, TEAInputValue} from './contracts';

export type TeaScenarioValue = TEAInputValue;
export type TeaScenario = Record<string, TeaScenarioValue>;
export type AggregateType = 'FINE'|'COARSE';

function v(s: TeaScenario, k: string) { return s[k]?.value ?? null; }
function required(s: TeaScenario, k: string) { return s[k] && Number.isFinite(s[k].value) ? true : false; }

export function calcTea(p: {
  scenario: TeaScenario;
  cementKg: number;
  aggregateKg: number;
  aggregateType?: AggregateType;
  residueKg: number;
  waterKg: number;
  admixtureKg: number;
  batchBlocks: number | null;
  blocksPerM2?: number | null;
  processingCostIdrTon?: number | null;
  cementPriceOverrideIdrKg?: number | null;
  transportDistanceOverrideKm?: number | null;
  electricityPriceOverrideIdrKwh?: number | null;
}) {
  const s = p.scenario;
  const aggregatePriceKey = p.aggregateType === 'COARSE' ? 'coarse_aggregate_idr_kg' : 'fine_sand_idr_kg';
  const requiredKeys = [
    'cement_pc_idr_kg', aggregatePriceKey, 'residue_acquisition_idr_kg', 'water_idr_l',
    'admixture_idr_kg', 'process_loss_pct', 'drying_energy_kwh_t', 'grinding_energy_kwh_t',
    'classification_energy_kwh_t', 'electricity_idr_kwh', 'transport_distance_km',
    'transport_idr_ton_km', 'labor_hours_per_1000_blocks', 'general_worker_idr_day'
  ];
  const missing = requiredKeys.filter(k => !required(s, k));
  if (p.batchBlocks == null || !Number.isFinite(p.batchBlocks) || p.batchBlocks <= 0) missing.push('batch_blocks');
  if (missing.length) {
    return { raw:null, processingEnergyKwh:null, energy:null, transport:null, labor:null, processingAllowance:null, total:null, costPerBlock:null, costPerM2:null, status:'DATA_REQUIRED' as ValueStatus, missing, assumptions:{} };
  }

  const cementPrice = p.cementPriceOverrideIdrKg ?? v(s,'cement_pc_idr_kg')!;
  const electricityPrice = p.electricityPriceOverrideIdrKwh ?? v(s,'electricity_idr_kwh')!;
  const transportDistance = p.transportDistanceOverrideKm ?? v(s,'transport_distance_km')!;
  const raw = p.cementKg * cementPrice + p.aggregateKg * v(s,aggregatePriceKey)! + p.residueKg * v(s,'residue_acquisition_idr_kg')! + p.waterKg * v(s,'water_idr_l')! + p.admixtureKg * v(s,'admixture_idr_kg')!;
  const lossFraction = v(s,'process_loss_pct')!/100;
  if (lossFraction < 0 || lossFraction >= 1) {
    return { raw:null, processingEnergyKwh:null, energy:null, transport:null, labor:null, processingAllowance:null, total:null, costPerBlock:null, costPerM2:null, status:'DATA_REQUIRED' as ValueStatus, missing:['process_loss_pct'], assumptions:{invalidProcessLoss:true} };
  }

  const processMassT = (p.residueKg / 1000) / (1 - lossFraction);
  const processingEnergyKwh = processMassT * (v(s,'drying_energy_kwh_t')! + v(s,'grinding_energy_kwh_t')! + v(s,'classification_energy_kwh_t')!);
  const energy = processingEnergyKwh * electricityPrice;
  const transport = (p.residueKg / 1000) * transportDistance * v(s,'transport_idr_ton_km')!;
  const labor = (v(s,'labor_hours_per_1000_blocks')!/8) * (p.batchBlocks!/1000) * v(s,'general_worker_idr_day')!;
  const processingAllowance = p.processingCostIdrTon == null ? 0 : processMassT * p.processingCostIdrTon;
  const total = raw + energy + transport + labor + processingAllowance;
  const costPerBlock = total / p.batchBlocks!;
  const costPerM2 = p.blocksPerM2 && costPerBlock != null ? costPerBlock * p.blocksPerM2 : null;

  return {
    raw, processingEnergyKwh, energy, transport, labor, processingAllowance, total, costPerBlock, costPerM2,
    status:'CALCULATED' as ValueStatus,
    missing: [],
    assumptions:{ processLoss:v(s,'process_loss_pct'), transportDistanceKm:transportDistance, electricity:electricityPrice, cementPrice, processingCostIdrTon:p.processingCostIdrTon },
  };
}
