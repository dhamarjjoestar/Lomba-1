import raw from './master.json';
import {isDssDecision, isEvidenceClass, isProductType, isReplacementBasis, isSniResultState, isSourceType, isValueStatus} from '../lib/contracts';
import type {DSSDecision, EvidenceClass, ProductType, ReplacementBasis, SNIResultState, SourceType, ValueStatus, TEAInputValue} from '../lib/contracts';

export type MasterDataset = typeof raw;
export type SourceRecord = MasterDataset['source_registry'][number];

export interface EvidenceRecord {
  id: string;
  source_id: string;
  material?: string;
  origin?: string;
  application?: string;
  parameter?: string;
  value?: number | string | null;
  unit?: string | null;
  reported_value?: number | string | null;
  reported_unit?: string | null;
  original_value?: number | string | null;
  original_unit?: string | null;
  derived_value?: number | string | null;
  derived_unit?: string | null;
  converted_value?: number | string | null;
  converted_unit?: string | null;
  derived_status?: 'DERIVED' | ValueStatus;
  replacement_pct?: number;
  replacement_value?: number;
  replacement_basis?: ReplacementBasis;
  test_age_days?: number;
  testing_age?: string;
  compressive_strength_7d_mpa?: number | null;
  compressive_strength_28d_mpa?: number | null;
  slump_mm?: number | null;
  status?: ValueStatus | string;
  transferability?: string;
  allowed_use?: string;
  evidence_class?: EvidenceClass;
  source_type?: SourceType;
  product_type?: ProductType;
  material_id?: string;
  material_identity?: string;
  material_category?: string;
  processing_state?: string;
  method?: string;
  limitations?: string[];
}

export interface CharacterizationRecord {
  id: string;
  variable: string;
  unit: string | null;
  required: boolean;
  default_value: number | string | null;
  status: ValueStatus | string;
}

export type ProcessingRouteRecord = MasterDataset['processing_routes'][number];

export interface LiteraturePerformanceRecord extends EvidenceRecord {
  source_id: string;
  material?: string;
  application?: string;
  replacement_pct?: number;
  replacement_value?: number;
  replacement_basis?: ReplacementBasis;
  test_age_days?: number;
  testing_age?: string;
}

export type MaterialEvidenceRecord = EvidenceRecord;

export interface DirectPavingEvidenceRecord {
  id: string;
  source_id: string;
  material: string;
  product: string;
  replacement_basis: ReplacementBasis;
  replacement_values_pct: number[];
  mix: string;
  water: string;
  dimensions_mm: { length: number; width: number; thickness: number };
  production: string;
  replicates_per_mix: number;
  test_age_days: number;
  status: ValueStatus | string;
  control_included: boolean;
  evidence_class: EvidenceClass;
  source_type: SourceType;
  product_type: ProductType;
  testing_age: string;
  limitations: string[];
}

export interface SNIClassRecord {
  class: string;
  intended_use: string;
  compressive_strength_avg_mpa: number;
  compressive_strength_min_mpa: number;
  abrasion_avg_max_mm_min: number;
  abrasion_min_or_equivalent_max_mm_min: number;
  water_absorption_avg_max_pct: number;
}

export interface EnvironmentFactorRecord {
  factor: string;
  value: number | null;
  unit: string;
  source_id: string | null;
  year: number | null;
  geography: string | null;
  boundary: string | null;
  scope: string | null;
  status: ValueStatus | string;
  limitations?: string[];
}

export type ValidationRoadmapRecord = MasterDataset['validation_roadmap'][number];
export type DecisionStatusRecord = MasterDataset['decision_status'][number];
export type FormulaRecord = MasterDataset['formula_registry'][number];
export type DSSRuleRecord = MasterDataset['dss_rules'][number];
export type ReferenceRecord = {
  author: string;
  year: number;
  title: string;
  publisher: string;
  doi: string;
  type: string;
  url: string | null;
};

export type TeaScenarioValue = TEAInputValue;
export type NormalizedEconomicScenario = Record<string, TeaScenarioValue>;

export type {DSSDecision, EvidenceClass, ProductType, ReplacementBasis, SNIResultState, SourceType, ValueStatus};

export const dataset: MasterDataset = raw;
export const sources: MasterDataset['source_registry'] = dataset.source_registry ?? [];
function normalizedEvidenceRecord(rawRecord: MasterDataset['material_evidence'][number] | MasterDataset['literature_performance'][number]): EvidenceRecord {
  const raw: Record<string, unknown> = Object.assign({}, rawRecord);
  const replacementBasis = typeof raw.replacement_basis === 'string' ? canonicalReplacementBasis(raw.replacement_basis) : undefined;
  return {
    id: String(raw.id),
    source_id: String(raw.source_id),
    material: typeof raw.material === 'string' ? raw.material : undefined,
    origin: typeof raw.origin === 'string' ? raw.origin : undefined,
    application: typeof raw.application === 'string' ? raw.application : undefined,
    parameter: typeof raw.parameter === 'string' ? raw.parameter : undefined,
    value: (typeof raw.value === 'number' || typeof raw.value === 'string' || raw.value === null) ? raw.value : undefined,
    unit: typeof raw.unit === 'string' || raw.unit === null ? raw.unit : undefined,
    reported_value: (typeof raw.reported_value === 'number' || typeof raw.reported_value === 'string' || raw.reported_value === null) ? raw.reported_value : undefined,
    reported_unit: typeof raw.reported_unit === 'string' || raw.reported_unit === null ? raw.reported_unit : undefined,
    original_value: (typeof raw.original_value === 'number' || typeof raw.original_value === 'string' || raw.original_value === null) ? raw.original_value : undefined,
    original_unit: typeof raw.original_unit === 'string' || raw.original_unit === null ? raw.original_unit : undefined,
    derived_value: (typeof raw.derived_value === 'number' || typeof raw.derived_value === 'string' || raw.derived_value === null) ? raw.derived_value : undefined,
    derived_unit: typeof raw.derived_unit === 'string' || raw.derived_unit === null ? raw.derived_unit : undefined,
    converted_value: (typeof raw.converted_value === 'number' || typeof raw.converted_value === 'string' || raw.converted_value === null) ? raw.converted_value : undefined,
    converted_unit: typeof raw.converted_unit === 'string' || raw.converted_unit === null ? raw.converted_unit : undefined,
    derived_status: typeof raw.derived_status === 'string' ? canonicalStatus(raw.derived_status) : undefined,
    replacement_pct: typeof raw.replacement_pct === 'number' ? raw.replacement_pct : undefined,
    replacement_value: typeof raw.replacement_value === 'number' ? raw.replacement_value : undefined,
    replacement_basis: replacementBasis,
    test_age_days: typeof raw.test_age_days === 'number' ? raw.test_age_days : undefined,
    testing_age: typeof raw.testing_age === 'string' ? raw.testing_age : undefined,
    compressive_strength_7d_mpa: typeof raw.compressive_strength_7d_mpa === 'number' ? raw.compressive_strength_7d_mpa : null,
    compressive_strength_28d_mpa: typeof raw.compressive_strength_28d_mpa === 'number' ? raw.compressive_strength_28d_mpa : null,
    slump_mm: typeof raw.slump_mm === 'number' ? raw.slump_mm : null,
    status: canonicalStatus(String(raw.status ?? 'UNKNOWN')),
    transferability: typeof raw.transferability === 'string' ? raw.transferability : undefined,
    allowed_use: typeof raw.allowed_use === 'string' ? raw.allowed_use : undefined,
    evidence_class: typeof raw.evidence_class === 'string' ? canonicalEvidenceClass(raw.evidence_class) : undefined,
    source_type: typeof raw.source_type === 'string' ? canonicalSourceType(raw.source_type) : undefined,
    product_type: typeof raw.product_type === 'string' ? canonicalProductType(raw.product_type) : undefined,
    material_id: typeof raw.material_id === 'string' ? raw.material_id : undefined,
    material_identity: typeof raw.material_identity === 'string' ? raw.material_identity : undefined,
    material_category: typeof raw.material_category === 'string' ? raw.material_category : undefined,
    processing_state: typeof raw.processing_state === 'string' ? raw.processing_state : undefined,
    method: typeof raw.method === 'string' ? raw.method : undefined,
    limitations: Array.isArray(raw.limitations) ? raw.limitations.filter((v): v is string => typeof v === 'string') : undefined,
  };
}

function parseDimensions(value: string | {length:number;width:number;thickness:number}): {length:number;width:number;thickness:number} {
  if (typeof value !== 'string') return value;
  const parts = value.split('x').map(Number);
  if (parts.length !== 3 || parts.some((v) => !Number.isFinite(v) || v <= 0)) {
    throw new Error(`INVALID_DIRECT_PAVING_DIMENSIONS:${value}`);
  }
  return { length: parts[0], width: parts[1], thickness: parts[2] };
}

export const materialEvidence: MaterialEvidenceRecord[] = dataset.material_evidence.map(normalizedEvidenceRecord);
export const processingRoutes: MasterDataset['processing_routes'] = dataset.processing_routes ?? [];
export const literaturePerformance: LiteraturePerformanceRecord[] = dataset.literature_performance.map(normalizedEvidenceRecord);
export const FIKRONI_SOURCE_ID = 'SRC-017';
export const directPavingEvidence: DirectPavingEvidenceRecord[] = dataset.direct_paving_evidence.map((r) => ({
  ...r,
  dimensions_mm: parseDimensions(r.dimensions_mm),
  replacement_basis: canonicalReplacementBasis(String(r.replacement_basis)),
  status: canonicalStatus(String(r.status)),
  evidence_class: canonicalEvidenceClass(String(r.evidence_class)),
  source_type: canonicalSourceType(String(r.source_type)),
  product_type: canonicalProductType(String(r.product_type)),
}));
export const sniRequirements = dataset.sni_requirements ?? {classification: []};
export const economicAssumptions = dataset.economic_assumptions ?? {};

export interface PaperEconomicScreeningRecord {
  estimate_class: string;
  full_tea_supported: boolean;
  source_id: string;
  system_boundary: { included: string[]; excluded: string[]; notes: string[] };
  bridge: {
    cement_fraction_pct: number;
    illustrative_substitution_window_pct: [number, number];
    formula: string;
    daily_formula: string;
    status: string;
  };
  capex: {
    equipment_subtotal_idr: number;
    installation_rate_pct: number;
    installation_idr: number;
    total_idr: number;
    status: string;
    items: Array<{ name: string; cost_idr: number }>;
  };
  opex: { reported_per_t_idr: number; components: Array<{ name: string; value: number; unit: string; status: string; driver: string }> };
  production: {
    residue_processing_capacity_t_per_day: number;
    operating_days_per_month: number;
    annual_operating_days: number;
    processing_yield_pct: number;
    finished_block_production_per_day: number;
    mass_per_block_kg: number;
    area_per_block_m2: number;
    blocks_per_m2: number;
  };
  material_inputs: {
    cement_price_idr_per_kg: number;
    residue_acquisition_idr_per_kg: number;
    sand_aggregate_price_placeholder_idr_per_kg: [number, number];
    sand_aggregate_placeholder_midpoint_idr_per_kg: number;
  };
  scenarios: Record<'conservative' | 'base' | 'optimistic', {
    selling_price_per_m2: number;
    selling_price_per_block: number;
    production_cost_per_block: number;
    blocks_per_day: number;
    annual_operating_days: number;
    capex_idr: number;
  }>;
  sensitivity: Array<Record<string, string | number | null>>;
  financial_metrics: { supported: string[]; not_supported: string[] };
  maturation: { level: number; status: string; critical_gaps: string[]; npv_irr_roi_disallowed: boolean };
}

export const paperEconomicScreening = (dataset as unknown as { economic_assumptions?: { paper_economic_screening?: PaperEconomicScreeningRecord } }).economic_assumptions?.paper_economic_screening;
export const environmentalAssumptions = dataset.environmental_assumptions ?? {};
function normalizedEnvironmentFactor(rawRecord: MasterDataset['environmental_assumptions']['factors'][number]): EnvironmentFactorRecord {
  return {
    ...rawRecord,
    source_id: rawRecord.source_id ?? null,
    year: rawRecord.year ?? null,
    geography: rawRecord.geography ?? null,
    boundary: rawRecord.boundary ?? null,
    scope: rawRecord.scope ?? null,
    status: canonicalStatus(String(rawRecord.status ?? 'UNKNOWN')),
  };
}

export const normalizedEnvironmentalFactors: EnvironmentFactorRecord[] = (environmentalAssumptions.factors ?? []).map(normalizedEnvironmentFactor);
export const formulaRegistry: MasterDataset['formula_registry'] = dataset.formula_registry ?? [];
export const dssRules: MasterDataset['dss_rules'] = dataset.dss_rules ?? [];
export const validationRoadmap: MasterDataset['validation_roadmap'] = dataset.validation_roadmap ?? [];
export const decisionStatus: MasterDataset['decision_status'] = dataset.decision_status ?? [];

export function sourceById(id: string): SourceRecord | undefined {
  return sources.find((s) => s.id === id);
}

export function recordById(id: string): EvidenceRecord | undefined {
  return [...literaturePerformance, ...materialEvidence, ...directPavingEvidence].find((r) => r.id === id);
}

export function materialById(id: string): MaterialEvidenceRecord | undefined {
  return materialEvidence.find((m) => m.id === id);
}

export function evidenceBySource(sourceId: string): EvidenceRecord[] {
  return [...literaturePerformance, ...materialEvidence].filter((r) => r.source_id === sourceId);
}

export function canonicalStatus(value: string): ValueStatus {
  if (isValueStatus(value) && (dataset.dataset_meta?.statuses ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_STATUS:${value}`);
}

export function canonicalEvidenceClass(value: string): EvidenceClass {
  if (isEvidenceClass(value) && (dataset.dataset_meta?.evidence_levels ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_EVIDENCE_CLASS:${value}`);
}

export function canonicalSourceType(value: string): SourceType {
  if (isSourceType(value) && (dataset.dataset_meta?.source_types ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_SOURCE_TYPE:${value}`);
}

export function canonicalReplacementBasis(value: string): ReplacementBasis {
  if (isReplacementBasis(value) && (dataset.dataset_meta?.replacement_bases ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_REPLACEMENT_BASIS:${value}`);
}

export function canonicalProductType(value: string): ProductType {
  if (isProductType(value) && (dataset.dataset_meta?.product_types ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_PRODUCT_TYPE:${value}`);
}

export function canonicalDssState(value: string): DSSDecision {
  if (isDssDecision(value) && (dataset.dataset_meta?.dss_states ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_DSS_STATE:${value}`);
}

export function canonicalSniResult(value: string): SNIResultState {
  if (isSniResultState(value) && (dataset.dataset_meta?.sni_result_states ?? []).includes(value)) return value;
  throw new Error(`NON_CANONICAL_SNI_RESULT:${value}`);
}

export function directPavingReplacementValues(): number[] {
  const points = literaturePerformance.filter((r) =>
    r.source_id === FIKRONI_SOURCE_ID &&
    r.product_type === 'PAVING_BLOCK' &&
    r.evidence_class === 'DIRECT' &&
    r.replacement_basis === 'CEMENT MASS' &&
    typeof r.replacement_value === 'number'
  );
  return [...new Set(points.map((r) => r.replacement_value).filter((v): v is number => typeof v === 'number' && v > 0))].sort((a,b) => a-b);
}

export function directPavingReplacementRange(): string {
  const values = directPavingReplacementValues();
  return values.length ? `${Math.min(...values)}–${Math.max(...values)}%` : 'DATA REQUIRED';
}

export function directPavingControlValues(): number[] {
  const points = literaturePerformance.filter((r) =>
    r.source_id === FIKRONI_SOURCE_ID &&
    r.product_type === 'PAVING_BLOCK' &&
    r.evidence_class === 'DIRECT' &&
    r.replacement_basis === 'CEMENT MASS' &&
    typeof r.replacement_value === 'number' &&
    r.replacement_value === 0
  );
  return [...new Set(points.map((r) => r.replacement_value).filter((v): v is number => typeof v === 'number'))];
}

export function silica2conExperimentalRecords(): LiteraturePerformanceRecord[] {
  return literaturePerformance.filter((r) =>
    r.source_type === 'SILICA2CON_EXPERIMENT' &&
    r.product_type === 'PAVING_BLOCK'
  );
}

export function hasValidatedSilica2ConExperiment(): boolean {
  return silica2conExperimentalRecords().some((r) => r.status === 'VALIDATED');
}

export function normalizedEconomicScenario(name: 'baseline'|'conservative'|'optimistic'): NormalizedEconomicScenario {
  const key = `${name}_normalized`;
  const candidate = Object.entries(economicAssumptions).find(([entryKey]) => entryKey === key)?.[1];
  if (!candidate || typeof candidate !== 'object') return {};
  const normalized: NormalizedEconomicScenario = {};
  for (const [name, entry] of Object.entries(candidate)) {
    if (!entry || typeof entry !== 'object' || !('value' in entry) || typeof entry.value !== 'number') continue;
    const unit = 'unit' in entry && typeof entry.unit === 'string' ? entry.unit : null;
    const currency = 'currency' in entry && (typeof entry.currency === 'string' || entry.currency === null) ? entry.currency : null;
    const basis = 'basis' in entry && (typeof entry.basis === 'string' || entry.basis === null) ? entry.basis : null;
    const statusValue = 'status' in entry && typeof entry.status === 'string' ? entry.status : 'ASSUMPTION';
    normalized[name] = {name, value: entry.value, unit: unit ?? '', currency, basis: basis ?? '', status: canonicalStatus(statusValue), source_id: 'source_id' in entry && typeof entry.source_id === 'string' ? entry.source_id : undefined};
  }
  return normalized;
}

export function referenceRecords(): ReferenceRecord[] {
  return sources.map((r) => ({
    author: r.authors,
    year: r.year,
    title: r.title,
    publisher: r.journal ?? r.type,
    doi: r.doi ?? '—',
    type: r.type,
    url: r.url,
  }));
}
