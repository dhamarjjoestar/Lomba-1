export interface AlurEvaluasiStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  row: 1 | 2;
  category: string;
  detailBadge?: string;
  iconType: 'flask' | 'layers' | 'sync' | 'analytics' | 'shield' | 'currency' | 'leaf-globe' | 'document' | 'check-circle' | 'traceability';
}

export interface AlurEvaluasiHeader {
  tag: string;
  title: string;
  subtitle: string;
}

export const ALUR_EVALUASI_HEADER: AlurEvaluasiHeader = {
  tag: 'ALUR EVALUASI',
  title: 'Dari data hingga keputusan.',
  subtitle: 'Pendekatan sistematis, transparan, dan berbasis bukti, untuk memastikan setiap material layak dikembangkan.',
};

export const ALUR_EVALUASI_STEPS: AlurEvaluasiStep[] = [
  {
    id: 'step-01',
    stepNumber: '01',
    title: 'Characterization',
    description: 'Analisis sifat fisik, kimia, dan mineralogi residu.',
    row: 1,
    category: 'Karakterisasi Awal',
    detailBadge: 'XRF / XRD / SEM',
    iconType: 'flask',
  },
  {
    id: 'step-02',
    stepNumber: '02',
    title: 'Material Qualification',
    description: 'Evaluasi kesesuaian dengan standar dan kebutuhan.',
    row: 1,
    category: 'Kualifikasi Bahan',
    detailBadge: 'SNI / ASTM',
    iconType: 'layers',
  },
  {
    id: 'step-03',
    stepNumber: '03',
    title: 'Candidate Formulation',
    description: 'Penentuan komposisi campuran optimal.',
    row: 1,
    category: 'Formulasi Campuran',
    detailBadge: 'Substitusi 5–25%',
    iconType: 'sync',
  },
  {
    id: 'step-04',
    stepNumber: '04',
    title: 'Analysis',
    description: 'Evaluasi kinerja teknis, ekonomi, dan lingkungan.',
    row: 1,
    category: 'Uji & Analisis',
    detailBadge: 'Kuat Tekan & Resapan',
    iconType: 'analytics',
  },
  {
    id: 'step-05',
    stepNumber: '05',
    title: 'Technical Gate',
    description: 'Memastikan kelayakan teknis sebelum tahap berikutnya.',
    row: 1,
    category: 'Gate Teknis',
    detailBadge: 'Kelayakan Mutu B/A',
    iconType: 'shield',
  },
  {
    id: 'step-06',
    stepNumber: '06',
    title: 'Economic Screening',
    description: 'Analisis biaya dan nilai ekonomi.',
    row: 2,
    category: 'Skrining Ekonomi',
    detailBadge: 'NPV, IRR & Payback',
    iconType: 'currency',
  },
  {
    id: 'step-07',
    stepNumber: '07',
    title: 'Environmental Screening',
    description: 'Analisis dampak lingkungan.',
    row: 2,
    category: 'Skrining Lingkungan',
    detailBadge: 'Pengurangan CO2 & TCLP',
    iconType: 'leaf-globe',
  },
  {
    id: 'step-08',
    stepNumber: '08',
    title: 'Decision',
    description: 'Rekomendasi berdasarkan evidence dan multi-kriteria.',
    row: 2,
    category: 'Keputusan Multi-Kriteria',
    detailBadge: 'Status Rekomendasi',
    iconType: 'document',
  },
  {
    id: 'step-09',
    stepNumber: '09',
    title: 'Validation',
    description: 'Validasi melalui pengujian lebih lanjut.',
    row: 2,
    category: 'Validasi Uji',
    detailBadge: 'Uji Skala Produksi',
    iconType: 'check-circle',
  },
  {
    id: 'step-10',
    stepNumber: '10',
    title: 'Traceability',
    description: 'Dokumentasi dan keterlacakan seluruh proses.',
    row: 2,
    category: 'Keterlacakan Data',
    detailBadge: 'Audit Trail & Sitasi',
    iconType: 'traceability',
  },
];
