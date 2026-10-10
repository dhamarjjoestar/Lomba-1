import type {ReplacementBasis, ValueStatus} from './contracts';

export type BlockDimensionsMm = { length: number; width: number; thickness: number };

export type MixInput = {
  cementKg: number | null;
  aggregateKg: number | null;
  replacementValue: number | null;
  replacementBasis: ReplacementBasis;
  binderKg?: number | null;
  waterKg: number | null;
  admixtureKg?: number | null;
  batchBlocks?: number | null;
  blockDimensionsMm?: BlockDimensionsMm | null;
  densityKgM3?: number | null;
};

export type MassBalanceResult = {
  components: { cement: number|null; aggregate: number|null; residue: number|null; water: number|null; admixture: number|null };
  residueKg: number | null;
  cementFinalKg: number | null;
  cementReplacedKg: number | null;
  totalBatchKg: number | null;
  dryTotalKg: number | null;
  dryFractions: Record<string, number> | null;
  volumeM3: number | null;
  blockMassKg: number | null;
  massPerBlock: Record<string, number> | null;
  blocksPerM2: number | null;
  status: ValueStatus;
  errors: string[];
  warnings: string[];
  replacementBasis: ReplacementBasis;
  replacementValue: number | null;
  densityRequired: boolean;
  dimensionRequired: boolean;
};

function isFiniteNonNegative(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value >= 0;
}

function invalidResult(input: MixInput, errors: string[], warnings: string[] = []): MassBalanceResult {
  const densityRequired = input.densityKgM3 == null;
  const dimensionRequired = !input.blockDimensionsMm;
  return {
    components: {
      cement: input.cementKg,
      aggregate: input.aggregateKg,
      residue: null,
      water: input.waterKg,
      admixture: input.admixtureKg ?? null,
    },
    residueKg: null,
    cementFinalKg: null,
    cementReplacedKg: null,
    totalBatchKg: null,
    dryTotalKg: null,
    dryFractions: null,
    volumeM3: null,
    blockMassKg: null,
    massPerBlock: null,
    blocksPerM2: null,
    status: 'DATA_REQUIRED',
    errors,
    warnings,
    replacementBasis: input.replacementBasis,
    replacementValue: input.replacementValue,
    densityRequired,
    dimensionRequired,
  };
}

export function massBalance(input: MixInput): MassBalanceResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isFiniteNonNegative(input.cementKg) || !isFiniteNonNegative(input.aggregateKg) || !isFiniteNonNegative(input.waterKg) || (input.admixtureKg != null && !isFiniteNonNegative(input.admixtureKg))) {
    errors.push('INVALID_INPUT');
  }
  if (!isFiniteNonNegative(input.replacementValue) || input.replacementValue > 100) {
    errors.push('INVALID_REPLACEMENT_VALUE');
  }
  if (input.replacementBasis === 'UNKNOWN') errors.push('REPLACEMENT_BASIS_REQUIRED');
  if (input.batchBlocks != null && (!Number.isFinite(input.batchBlocks) || input.batchBlocks <= 0)) errors.push('INVALID_BATCH_SIZE');
  if (input.densityKgM3 != null && (!Number.isFinite(input.densityKgM3) || input.densityKgM3 <= 0)) errors.push('INVALID_DENSITY');
  if (input.blockDimensionsMm && Object.values(input.blockDimensionsMm).some((v) => !Number.isFinite(v) || v <= 0)) errors.push('INVALID_GEOMETRY');
  if (errors.length) return invalidResult(input, errors, warnings);

  const cementKg = input.cementKg!;
  const aggregateKg = input.aggregateKg!;
  const waterKg = input.waterKg!;
  const admixtureKg = input.admixtureKg ?? 0;
  const replacementValue = input.replacementValue!;
  const originalDryMassKg = cementKg + aggregateKg + admixtureKg;

  let residueKg: number;
  let cementFinalKg = cementKg;
  let aggregateFinalKg = aggregateKg;
  let admixtureFinalKg = admixtureKg;
  let cementReplacedKg: number;

  switch (input.replacementBasis) {
    case 'CEMENT MASS':
      if (cementKg <= 0 && replacementValue > 0) return invalidResult(input, ['CEMENT MASS_REQUIRED_FOR_REPLACEMENT']);
      cementReplacedKg = cementKg * (replacementValue / 100);
      residueKg = cementReplacedKg;
      cementFinalKg = cementKg - cementReplacedKg;
      break;
    case 'BINDER_MASS':
      // A binder-mass percentage does not identify which binder constituents are displaced.
      // Refuse to collapse binder mass into cement mass without an explicit allocation rule.
      return invalidResult(input, ['BINDER_REPLACEMENT_ALLOCATION_RULE_REQUIRED']);
    case 'TOTAL_DRY_MIX_MASS': {
      if (originalDryMassKg <= 0) return invalidResult(input, ['DRY_MIX_MASS_REQUIRED_FOR_REPLACEMENT']);
      const fraction = replacementValue / 100;
      residueKg = originalDryMassKg * fraction;
      cementReplacedKg = residueKg;
      const keep = 1 - fraction;
      // Explicit proportional allocation keeps total dry mass invariant while avoiding silent cement equivalence.
      cementFinalKg = cementKg * keep;
      aggregateFinalKg = aggregateKg * keep;
      admixtureFinalKg = admixtureKg * keep;
      warnings.push('TOTAL_DRY_MIX_REPLACEMENT_USES_PROPORTIONAL_ALLOCATION');
      break;
    }
    case 'VOLUME':
      return invalidResult(input, ['VOLUME_REPLACEMENT_REQUIRES_COMPONENT_ALLOCATION_AND_DENSITY']);
    case 'OTHER':
      return invalidResult(input, ['OTHER_REPLACEMENT_BASIS_REQUIRES_EXPLICIT_ALLOCATION_RULE']);
    default:
      return invalidResult(input, ['UNSUPPORTED_REPLACEMENT_BASIS']);
  }

  if (input.replacementBasis === 'CEMENT MASS' && cementReplacedKg > cementKg) {
    return invalidResult(input, ['REPLACEMENT_EXCEEDS_CEMENT MASS']);
  }

  const components = { cement: cementFinalKg, aggregate: aggregateFinalKg, residue: residueKg, water: waterKg, admixture: admixtureFinalKg };
  const totalBatchKg = Object.values(components).reduce((sum, value) => sum + value, 0);
  const dryTotalKg = cementFinalKg + aggregateFinalKg + residueKg + admixtureFinalKg;
  const dryFractions = dryTotalKg > 0
    ? Object.fromEntries(Object.entries({ cement: cementFinalKg, aggregate: aggregateFinalKg, residue: residueKg, admixture: admixtureFinalKg }).map(([k, v]) => [k, v / dryTotalKg * 100]))
    : null;

  const dims = input.blockDimensionsMm;
  const volumeM3 = dims
    ? (dims.length / 1000) * (dims.width / 1000) * (dims.thickness / 1000)
    : null;
  const blockMassKg = volumeM3 != null && input.densityKgM3 != null
    ? volumeM3 * input.densityKgM3
    : null;
  const massPerBlock = blockMassKg != null && totalBatchKg > 0
    ? Object.fromEntries(Object.entries(components).map(([k, v]) => [k, blockMassKg * v / totalBatchKg]))
    : null;
  const blocksPerM2 = dims
    ? 1 / ((dims.length / 1000) * (dims.width / 1000))
    : null;

  if (input.densityKgM3 == null) warnings.push('DENSITY_REQUIRED_FOR_ACTUAL_BLOCK_MASS');
  if (volumeM3 == null) warnings.push('GEOMETRY_REQUIRED_FOR_BLOCK_MASS');

  return {
    components,
    residueKg,
    cementFinalKg,
    cementReplacedKg,
    totalBatchKg,
    dryTotalKg,
    dryFractions,
    volumeM3,
    blockMassKg,
    massPerBlock,
    blocksPerM2,
    status: 'CALCULATED',
    errors: [],
    warnings,
    replacementBasis: input.replacementBasis,
    replacementValue,
    densityRequired: input.densityKgM3 == null,
    dimensionRequired: volumeM3 == null,
  };
}
