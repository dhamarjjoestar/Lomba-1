export const UNITS = {
  MASS_KG: 'kg', MASS_G: 'g', MASS_KG_BATCH: 'kg/batch', VOLUME_M3: 'm3', BLOCK: 'block', DENSITY_KG_M3: 'kg/m3',
  ENERGY_KWH: 'kWh', ENERGY_KWH_T: 'kWh/t', TIME_H: 'h', TIME_H_PER_1000_BLOCK: 'h/1000_block', TIME_H_YEAR: 'h/year',
  CURRENCY_IDR: 'IDR', PRICE_IDR_KG: 'IDR/kg', PRICE_IDR_KWH: 'IDR/kWh', PRICE_IDR_BLOCK: 'IDR/block', PRICE_IDR_TON_KM: 'IDR/t-km', PRICE_IDR_M3: 'IDR/m3', PRICE_IDR_L: 'IDR/L', PRICE_IDR_DAY: 'IDR/day', PRICE_IDR_YEAR: 'IDR/year',
  EMISSION_KGCO2E: 'kgCO2e', EMISSION_KGCO2E_PER_KG: 'kgCO2e/kg', EMISSION_KGCO2E_PER_KWH: 'kgCO2e/kWh', EMISSION_KGCO2E_PER_TON_KM: 'kgCO2e/t-km',
  STRENGTH_MPA: 'MPa', STRENGTH_KGF_CM2: 'kgf/cm²', PERCENT: '%', PERCENT_ABSORPTION: '% absorption', PERCENT_PER_YEAR: '%/year',
  LENGTH_MM: 'mm', SPEED_ABRASION_MM_MIN: 'mm/min', LENGTH_UM: 'um', SURFACE_AREA_M2_G: 'm2/g', DISTANCE_KM: 'km', MASS_RATE_TON_MONTH: 'ton/month',
  VOLUME_RATE_L_1000_BLOCK: 'L/1000_block', FRACTION: 'fraction', DIMENSIONLESS: 'dimensionless', CATEGORICAL: 'categorical', TEST_SPECIFIC: 'test-specific', SCORE: 'score', YEAR: 'year', WT_PERCENT: 'wt.%'
} as const;

export type UnitCode = (typeof UNITS)[keyof typeof UNITS];

export const UNIT_DIMENSION: Record<UnitCode, 'mass'|'volume'|'density'|'energy'|'time'|'currency'|'price'|'emission'|'strength'|'percentage'|'dimension'|'distance'|'surface_area'|'rate'|'dimensionless'|'categorical'|'other'> = {
  kg:'mass', g:'mass', 'kg/batch':'mass', m3:'volume', block:'other', 'kg/m3':'density', kWh:'energy', 'kWh/t':'energy', h:'time', 'h/1000_block':'time', 'h/year':'time',
  IDR:'currency', 'IDR/kg':'price', 'IDR/kWh':'price', 'IDR/block':'price', 'IDR/t-km':'price', 'IDR/m3':'price', 'IDR/L':'price', 'IDR/day':'price', 'IDR/year':'price',
  kgCO2e:'emission', 'kgCO2e/kg':'emission', 'kgCO2e/kWh':'emission', 'kgCO2e/t-km':'emission', MPa:'strength', 'kgf/cm²':'strength', '%':'percentage', '% absorption':'percentage', '%/year':'percentage', mm:'dimension', 'mm/min':'rate', um:'dimension', 'm2/g':'surface_area', km:'distance', 'ton/month':'rate', 'L/1000_block':'rate', fraction:'dimensionless', dimensionless:'dimensionless', categorical:'categorical', 'test-specific':'other', score:'other', year:'other', 'wt.%':'percentage'
};

export function assertKnownUnit(unit: string): asserts unit is UnitCode {
  if (!(Object.values(UNITS) as string[]).includes(unit)) throw new Error(`UNKNOWN_UNIT:${unit}`);
}

export function assertCompatibleUnit(unit: string, expectedDimension: keyof typeof UNIT_DIMENSION): void {
  assertKnownUnit(unit);
  const dimension = UNIT_DIMENSION[unit];
  if (dimension !== expectedDimension) throw new Error(`INCOMPATIBLE_UNIT:${unit}:${expectedDimension}`);
}
