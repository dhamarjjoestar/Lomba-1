export const VALUE_STATUSES = [
  'REPORTED',
  'DERIVED',
  'CALCULATED',
  'ASSUMPTION',
  'EXTRAPOLATED',
  'UNKNOWN',
  'DATA_REQUIRED',
  'VALIDATION_REQUIRED',
  'EXPERIMENT_REQUIRED',
  'OUTSIDE_EVIDENCE_RANGE',
  'VALIDATED',
] as const;
export type ValueStatus = (typeof VALUE_STATUSES)[number];

export const EVIDENCE_CLASSES = [
  'DIRECT',
  'RELATED',
  'EXTRAPOLATION',
  'UNKNOWN',
  'CONTRADICTORY',
  'CONTEXT_DEPENDENT',
] as const;
export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number];

export const SOURCE_TYPES = [
  'LITERATURE',
  'PRIMARY_EXPERIMENT',
  'SILICA2CON_EXPERIMENT',
  'NORMATIVE_STANDARD',
  'GOVERNMENT',
  'INDUSTRY',
  'MARKET',
  'USER_INPUT',
  'ASSUMPTION',
  'CALCULATED',
  'UNKNOWN',
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const DSS_STATES = [
  'NOT_SUPPORTED',
  'DATA_REQUIRED',
  'CONDITIONAL',
  'PRELIMINARY_PROMISING',
  'VALIDATED',
] as const;
export type DSSDecision = (typeof DSS_STATES)[number];

export const SNI_RESULT_STATES = [
  'PRELIMINARY_PASS',
  'PRELIMINARY_FAIL',
  'UNKNOWN',
  'DATA_REQUIRED',
  'NOT_APPLICABLE',
] as const;
export type SNIResultState = (typeof SNI_RESULT_STATES)[number];

export const PRODUCT_TYPES = [
  'PAVING_BLOCK',
  'CONCRETE',
  'MORTAR',
  'GEOPOLYMER',
  'OTHER',
  'UNKNOWN',
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const REPLACEMENT_BASES = [
  'CEMENT MASS',
  'BINDER_MASS',
  'TOTAL_DRY_MIX_MASS',
  'VOLUME',
  'OTHER',
  'UNKNOWN',
] as const;
export type ReplacementBasis = (typeof REPLACEMENT_BASES)[number];

export const AGGREGATE_TYPES = ['FINE', 'COARSE'] as const;
export type AggregateType = (typeof AGGREGATE_TYPES)[number];

export interface ScientificValue<T = number | string | null> {
  value: T;
  unit: string | null;
  currency: string | null;
  basis: string | null;
  original_value?: T;
  original_unit?: string | null;
  status: ValueStatus;
  source_id?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  limitations?: string[];
  material_id?: string;
  batch_id?: string;
  product_type?: ProductType;
  replacement_value?: number;
  replacement_basis?: ReplacementBasis;
  testing_age?: string;
  method?: string;
  page?: string | number;
  table?: string;
  section?: string;
}

export interface MaterialIdentity {
  material_id: string;
  material_identity: string;
  material_category: string;
  material_form?: string;
  source_identity?: string;
  origin?: string;
  plant?: string;
  batch_id?: string;
  sample_id?: string;
  sampling_date?: string;
  processing_state?: string;
}

export interface FormulationContract {
  mix_id: string;
  replacement_value?: number;
  replacement_basis?: ReplacementBasis;
  cement_pct?: number | null;
  fine_aggregate_pct?: number | null;
  coarse_aggregate_pct?: number | null;
  water_pct_or_ratio?: number | null;
  admixture_pct?: number | null;
  particle_class?: string | null;
  curing_condition?: string | null;
  target_application: ProductType;
}

export interface MaterialSelection {
  materialId: string | null;
  batchId: string | null;
  sampleId: string | null;
}

export interface TEAInputValue {
  name: string;
  value: number | null;
  unit: string;
  currency: string | null;
  basis: string;
  status: ValueStatus;
  source_id?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  limitations?: string[];
}

export interface EnvironmentalFactor {
  factor: string;
  value: number | null;
  unit: string;
  source_id?: string;
  year?: number;
  geography?: string;
  boundary?: string;
  scope?: string;
  status: ValueStatus;
  limitations?: string[];
}

export interface DSSResult {
  decision: DSSDecision;
  status: DSSDecision;
  evidenceStatus: ValueStatus | EvidenceClass;
  materialStatus: ValueStatus | string;
  sniStatus: SNIResultState | string;
  teaStatus: ValueStatus | string;
  environmentStatus: ValueStatus | string;
  validationStatus: ValueStatus | string;
  warnings: string[];
  limitations: string[];
  trace: string[];
}


export function isSourceType(value: unknown): value is SourceType {
  return typeof value === 'string' && (SOURCE_TYPES as readonly string[]).includes(value);
}

export function isProductType(value: unknown): value is ProductType {
  return typeof value === 'string' && (PRODUCT_TYPES as readonly string[]).includes(value);
}

export function isDssDecision(value: unknown): value is DSSDecision {
  return typeof value === 'string' && (DSS_STATES as readonly string[]).includes(value);
}

export function isSniResultState(value: unknown): value is SNIResultState {
  return typeof value === 'string' && (SNI_RESULT_STATES as readonly string[]).includes(value);
}

export function isValueStatus(value: unknown): value is ValueStatus {
  return typeof value === 'string' && (VALUE_STATUSES as readonly string[]).includes(value);
}

export function isEvidenceClass(value: unknown): value is EvidenceClass {
  return typeof value === 'string' && (EVIDENCE_CLASSES as readonly string[]).includes(value);
}

export function isReplacementBasis(value: unknown): value is ReplacementBasis {
  return typeof value === 'string' && (REPLACEMENT_BASES as readonly string[]).includes(value);
}
