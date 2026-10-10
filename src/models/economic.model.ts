export interface MassBalanceRow {
  parameter: string;
  value: string;
  unit: string;
  status: string;
  isTotal?: boolean;
}

export interface CapexRow {
  component: string;
  basis: string;
  cost: string;
  status: string;
}

export interface OpexRow {
  component: string;
  basis: string;
  cost: string;
  status: string;
}

export interface ScenarioRow {
  parameter: string;
  conservative: string;
  baseline: string;
  optimistic: string;
  isBold?: boolean;
  isHighlight?: boolean;
}

export const MASS_BALANCE_DATA: MassBalanceRow[] = [
  { parameter: 'Geothermal Sludge Masuk', value: '1,00', unit: 'ton/hari', status: 'Skenario Fasilitas' },
  { parameter: 'Processing Yield', value: '90', unit: '%', status: 'Asumsi Uji Neraca' },
  { parameter: 'Silica-Rich Residue Tersedia', value: '0,90', unit: 'ton/hari', status: 'Hasil Turunan' },
  { parameter: 'Massa per Paving Block', value: '2,64', unit: 'kg/block', status: 'Hasil Turunan / Timbang' },
  { parameter: 'Kapasitas Produksi Harian', value: '5.000', unit: 'block/hari', status: 'Skenario Target' },
  { parameter: 'Total Massa Produk Akhir', value: '13,20', unit: 'ton/hari', status: 'Hasil Turunan', isTotal: true },
];

export const CAPEX_DATA: CapexRow[] = [
  { component: 'Rotary Dryer (1 unit; ±1 t/jam)', basis: '1 unit', cost: 'Rp 150.000.000', status: 'Engineering estimate' },
  { component: 'Ball Grinder Pulverizer (1 unit)', basis: '1 unit', cost: 'Rp 35.000.000', status: 'Engineering estimate' },
  { component: 'Vibrating Sieve Shaker (1 unit)', basis: '1 unit', cost: 'Rp 20.000.000', status: 'Engineering estimate' },
  { component: 'Material Handling + Hopper (1 sistem)', basis: '1 sistem', cost: 'Rp 25.000.000', status: 'Engineering estimate' },
  { component: 'Timbangan Presisi + QC Dasar (1 set)', basis: '1 set', cost: 'Rp 10.000.000', status: 'Engineering estimate' },
  { component: 'Instalasi & Electrical (15% equipment)', basis: '15% equipment', cost: 'Rp 36.000.000', status: 'Asumsi 15%' },
];

export const OPEX_DATA: OpexRow[] = [
  { component: 'Energi Pengeringan', basis: '80 kWh × Rp1.500', cost: 'Rp 120.000/t', status: 'Asumsi tarif listrik' },
  { component: 'Energi Grinding', basis: '35 kWh × Rp1.500', cost: 'Rp 52.500/t', status: 'Asumsi konsumsi' },
  { component: 'Sieving & Material Handling', basis: 'Allowance', cost: 'Rp 20.000/t', status: 'Allowance' },
  { component: 'Tenaga Kerja (2 Operator teralokasi)', basis: 'Alokasi proses', cost: 'Rp 120.000/t', status: 'Upah proporsional' },
  { component: 'Maintenance Rutin Mesin', basis: '5% CAPEX/tahun', cost: '≈Rp 46.000/t', status: 'Asumsi 5%/tahun' },
  { component: 'Air / Pembersihan', basis: 'Bila diperlukan', cost: 'Rp 20.000/t', status: 'Asumsi volume' },
  { component: 'Internal Transport PLTP → Fasilitas', basis: 'Radius 10 km', cost: 'Rp 50.000/t', status: 'Skenario jarak' },
  { component: 'QC Sampling & Uji Laboratorium', basis: 'Alokasi awal', cost: 'Rp 75.000/t', status: 'Alokasi awal' },
];

export const SCENARIO_DATA: ScenarioRow[] = [
  { parameter: 'Harga Jual Pasar per m²', conservative: 'Rp 70.000', baseline: 'Rp 80.000', optimistic: 'Rp 90.000' },
  { parameter: 'Harga Jual per Paving Block', conservative: 'Rp 1.400', baseline: 'Rp 1.600', optimistic: 'Rp 1.800' },
  { parameter: 'Estimasi Biaya Produksi per Block', conservative: 'Rp 1.350', baseline: 'Rp 1.250', optimistic: 'Rp 1.150' },
  { parameter: 'Margin Kotor Operasi per Block', conservative: 'Rp 50', baseline: 'Rp 350', optimistic: 'Rp 650', isBold: true },
  { parameter: 'Pendapatan Operasi Harian', conservative: 'Rp 7.000.000', baseline: 'Rp 8.000.000', optimistic: 'Rp 9.000.000' },
  { parameter: 'Total Biaya Produksi Harian', conservative: 'Rp 6.750.000', baseline: 'Rp 6.250.000', optimistic: 'Rp 5.750.000' },
  { parameter: 'Arus Kas Operasi / Hari', conservative: 'Rp 250.000', baseline: 'Rp 1.750.000', optimistic: 'Rp 3.250.000', isBold: true },
  { parameter: 'Arus Kas Operasi / Tahun (300 hari)', conservative: 'Rp 75.000.000', baseline: 'Rp 525.000.000', optimistic: 'Rp 975.000.000', isBold: true },
  { parameter: 'Perkiraan Payback Period (CAPEX Rp 276 Juta)', conservative: '~44,2 Bulan', baseline: '~6,3 Bulan', optimistic: '~3,4 Bulan', isHighlight: true },
];
