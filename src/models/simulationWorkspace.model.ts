import {
  Gauge,
  TestTube2,
  Layers3,
  FlaskConical,
  ShieldCheck,
  Coins,
  Leaf,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SimulationStageId =
  | 'overview'
  | 'characterization'
  | 'formulation'
  | 'simulation'
  | 'gate'
  | 'economics'
  | 'environment'
  | 'recommendation';

export type SimulationDestinationId = SimulationStageId | 'dashboard';

export interface SimulationStageMeta {
  id: SimulationStageId;
  stageNumber: string;
  stepOrder: number;
  title: string;
  shortLabel: string;
  technicalName: string;
  purpose: string;
  placeholderNotice: string;
  icon: LucideIcon;
}

export interface SimulationDashboardMeta {
  id: 'dashboard';
  title: string;
  shortLabel: string;
  technicalName: string;
  purpose: string;
  placeholderNotice: string;
  icon: LucideIcon;
}

export const SIMULATION_WORKFLOW_STAGES: SimulationStageMeta[] = [
  {
    id: 'overview',
    stageNumber: '01',
    stepOrder: 1,
    title: 'Overview',
    shortLabel: 'Ringkasan alur & konteks studi',
    technicalName: 'Overview',
    purpose:
      'Memperkenalkan konteks studi pemanfaatan residu silika panas bumi Dieng, ruang lingkup produk paving block, serta urutan delapan tahapan evaluasi dari karakterisasi material hingga rekomendasi keputusan.',
    placeholderNotice:
      'Konten terperinci untuk tahap Overview (konteks batch aktif, ringkasan kesiapan studi, dan peta alur kerja) akan diintegrasikan pada fase berikutnya.',
    icon: Gauge,
  },
  {
    id: 'characterization',
    stageNumber: '02',
    stepOrder: 2,
    title: 'Karakterisasi Material',
    shortLabel: 'Identitas batch & kualifikasi awal',
    technicalName: 'Material Characterization',
    purpose:
      'Mencatat identitas sampel serta parameter fisik dan kimia bahan baku residu silika (seperti kandungan SiO₂, fase mineralogi, ukuran partikel, kadar air, dan pengotor) untuk memastikan kelayakan data sebelum masuk ke tahap peracikan.',
    placeholderNotice:
      'Formulir input karakterisasi laboratorium, pemilih dataset studi, dan evaluasi kelengkapan kualifikasi material akan diintegrasikan pada fase berikutnya.',
    icon: TestTube2,
  },
  {
    id: 'formulation',
    stageNumber: '03',
    stepOrder: 3,
    title: 'Formulasi Kandidat',
    shortLabel: 'Proporsi campuran & geometri blok',
    technicalName: 'Candidate Formulation',
    purpose:
      'Menentukan komposisi kandidat campuran paving block, meliputi persentase substitusi semen oleh residu silika, rasio air terhadap pengikat, target ukuran partikel, kelas mutu SNI sasaran, serta ukuran dimensi blok.',
    placeholderNotice:
      'Kontrol parameter formulasi kandidat, pratinjau proporsi material, dan perhitungan neraca massa dasar akan diintegrasikan pada fase berikutnya.',
    icon: Layers3,
  },
  {
    id: 'simulation',
    stageNumber: '04',
    stepOrder: 4,
    title: 'Analisis Kandidat',
    shortLabel: 'Neraca massa, bukti literatur & DOE',
    technicalName: 'Candidate Analysis & Simulation',
    purpose:
      'Menganalisis perubahan komposisi massa per batch dan per blok berdasarkan formulasi aktif, membandingkannya dengan data literatur yang relevan, serta menyusun rancangan eksperimen (Design of Experiments) untuk pengujian laboratorium.',
    placeholderNotice:
      'Modul perhitungan neraca massa batch, matriks iterasi substitusi, pembanding sinyal literatur, dan kartu rancangan eksperimen (DOE) akan diintegrasikan pada fase berikutnya.',
    icon: FlaskConical,
  },
  {
    id: 'gate',
    stageNumber: '05',
    stepOrder: 5,
    title: 'Gerbang Teknis',
    shortLabel: 'Evaluasi syarat mutu SNI 03-0691-1996',
    technicalName: 'Technical Gate (SNI Evaluation)',
    purpose:
      'Memeriksa kesesuaian kandidat terhadap batas persyaratan teknis standar SNI 03-0691-1996 sesuai kelas mutu sasaran, mencakup kuat tekan, penyerapan air, dan ketahanan aus, serta menandai parameter yang masih membutuhkan uji fisik.',
    placeholderNotice:
      'Tabel evaluasi persyaratan SNI 03-0691-1996 dan status verifikasi parameter gerbang teknis akan diintegrasikan pada fase berikutnya.',
    icon: ShieldCheck,
  },
  {
    id: 'economics',
    stageNumber: '06',
    stepOrder: 6,
    title: 'Ekonomi',
    shortLabel: 'Skrining biaya produksi & keekonomian',
    technicalName: 'Techno-Economic Assessment (TEA)',
    purpose:
      'Menghitung estimasi awal biaya bahan baku, kebutuhan energi pemrosesan residu, transportasi, dan tenaga kerja untuk menilai kelayakan biaya produksi per blok maupun per meter persegi dibandingkan skenario acuan.',
    placeholderNotice:
      'Kontrol skenario keekonomian, rincian komponen biaya produksi (TEA), dan analisis sensitivitas harga akan diintegrasikan pada fase berikutnya.',
    icon: Coins,
  },
  {
    id: 'environment',
    stageNumber: '07',
    stepOrder: 7,
    title: 'Lingkungan',
    shortLabel: 'Skrining jejak karbon & emisi',
    technicalName: 'Environmental Screening',
    purpose:
      'Meninjau potensi pengurangan emisi CO₂ dari penghematan pemakaian semen Portland serta memperhitungkan beban emisi tambahan dari proses pengeringan, penggilingan, dan pengangkutan residu.',
    placeholderNotice:
      'Kalkulator inventaris emisi lingkungan, rincian faktor emisi, dan evaluasi batas klaim karbon bersih akan diintegrasikan pada fase berikutnya.',
    icon: Leaf,
  },
  {
    id: 'recommendation',
    stageNumber: '08',
    stepOrder: 8,
    title: 'Keputusan',
    shortLabel: 'Rekomendasi akhir berbasis bukti',
    technicalName: 'DSS Decision & Recommendation',
    purpose:
      'Merangkum hasil dari seluruh tahapan evaluasi untuk memberikan status rekomendasi sistem pendukung keputusan (DSS) secara transparan, lengkap dengan jejak alasan ilmiah, peringatan keterbatasan, dan langkah validasi lanjutan.',
    placeholderNotice:
      'Panel keputusan akhir DSS, rincian jejak pertimbangan (decision trace), dan daftar peringatan validasi akan diintegrasikan pada fase berikutnya.',
    icon: CheckCircle2,
  },
];

export const SIMULATION_DASHBOARD_META: SimulationDashboardMeta = {
  id: 'dashboard',
  title: 'Dashboard Simulasi',
  shortLabel: 'Ringkasan lintas tahap dari simulasi aktif',
  technicalName: 'Simulation Summary Dashboard',
  purpose:
    'Halaman pendukung ini menyajikan ringkasan terpadu dari hasil simulasi yang sedang aktif, sehingga pengguna dapat memantau status kualifikasi material, komposisi kandidat, gerbang teknis, ekonomi, lingkungan, dan rekomendasi keputusan dalam satu tampilan.',
  placeholderNotice:
    'Panel ringkasan lintas tahap untuk merangkum hasil dari simulasi aktif akan diintegrasikan pada fase berikutnya setelah seluruh mesin perhitungan dihubungkan.',
  icon: LayoutDashboard,
};
