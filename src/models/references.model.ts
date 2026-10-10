export interface ScientificReference {
  authors: string;
  year: string;
  title: string;
  source: string;
  category: 'Dieng' | 'Material' | 'Standar';
  keyPoint: string;
  sourceId?: string;
  doi?: string;
}

export const SCIENTIFIC_REFERENCES: ScientificReference[] = [
  {
    sourceId: 'SRC-004',
    authors: 'Widiyandari, H., Adhani, S. H., Subagio, A., & Purwanto, A.',
    year: '2021',
    title: 'Synthesis of Silica Xerogel from Geothermal Sludge by Ultrasonic Assisted Alkali Extraction-Acid Precipitation',
    source: 'Journal of Physics: Conference Series, 1825(1), 012071',
    doi: '10.1088/1742-6596/1825/1/012071',
    category: 'Dieng',
    keyPoint: 'Melaporkan 165 ton sludge/bulan di PLTP Dieng & sintesis silika xerogel amorf dengan luas permukaan hingga 302,87 m²/g.',
  },
  {
    authors: 'H. S. N, M. I., Panatarani, C., Faizal, F., Mulyana, C., & Joni, I. M.',
    year: '2023',
    title: 'Synthesis of mesoporous Silica SBA-15 from geothermal sludge',
    source: 'Materialia, 27, 101637',
    doi: '10.1016/j.mtla.2022.101637',
    category: 'Dieng',
    keyPoint: 'Transformasi geothermal sludge Dieng menjadi silika mesopori SBA-15 dengan kadar SiO₂ mencapai 95,70 wt.%.',
  },
  {
    sourceId: 'SRC-001',
    authors: 'Pambudi, N. A., Itoi, R., Yamashiro, R., Syah Alam, B. Y. C., et al.',
    year: '2015',
    title: 'The Behavior of Silica in Geothermal Brine from Dieng Geothermal Power Plant, Indonesia',
    source: 'Geothermics, 54, 109–114',
    doi: '10.1016/j.geothermics.2014.12.003',
    category: 'Dieng',
    keyPoint: 'Perubahan termodinamika memicu polimerisasi silika dan pembentukan endapan silika scaling pada sistem re-injeksi Dieng.',
  },
  {
    sourceId: 'SRC-002',
    authors: 'Utami, W. S., Herdianita, N. R., & Atmaja, R. W.',
    year: '2014',
    title: 'The Effect of Temperature and pH on the Formation of Silica Scaling of Dieng Geothermal Field',
    source: 'Proceedings, 39th Workshop on Geothermal Reservoir Engineering, Stanford University',
    category: 'Dieng',
    keyPoint: 'Kinetika pembentukan kerak silika pada fasilitas permukaan PLTP Dieng dipengaruhi temperatur dan keasaman pH fluida.',
  },
  {
    sourceId: 'SRC-017',
    authors: 'Fikroni, A., Juara, A., & Suharto',
    year: '2023',
    title: 'Inovasi Paving Block Ramah Lingkungan dengan Memanfaatkan Limbah Geodipa Sebagai Pengganti Sebagian Semen',
    source: 'Jurnal Civil Engineering Study',
    doi: '10.34001/ces.v3i02.736',
    category: 'Dieng',
    keyPoint: 'Benchmark langsung paving block limbah Geodipa dengan variasi substitusi 0%, 3%, 5%, 8%, 10%, dan 12% massa semen (uji kuat tekan 7 hari: 11,33–16,13 MPa).',
  },
  {
    sourceId: 'SRC-005',
    authors: 'Mulyana, C., Mahmudah, & Faizal, F.',
    year: '2022',
    title: 'Analysis of Silica Activity Index from Geothermal Silica Scaling',
    source: 'Journal of Physics: Conference Series, 2344(1), 012016',
    doi: '10.1088/1742-6596/2344/1/012016',
    category: 'Material',
    keyPoint: 'Perlakuan termal berlebih mendorong kristalisasi silika dan menurunkan indeks aktivitas pozzolaniknya.',
  },
  {
    sourceId: 'SRC-007',
    authors: 'López-Perales, J. F., Alonso-Alonso, M. C., Vázquez-Rodríguez, F. J., et al.',
    year: '2024',
    title: 'Geothermal Nano-SiO₂ Waste as a Supplementary Cementitious Material for Concrete Exposed at High Critical Temperatures',
    source: 'Materials, 17(17), 4381',
    doi: '10.3390/ma17174381',
    category: 'Material',
    keyPoint: 'Residu nano-silika geothermal meningkatkan kuat tekan tetapi menurunkan workability slump beton.',
  },
  {
    sourceId: 'SRC-006',
    authors: 'Meiyati, I. N., Agustin, R. S., & Murtiono, E. S.',
    year: '2015',
    title: 'Pemanfaatan Lumpur Geothermal untuk Pengganti Sebagian Semen terhadap Kuat Tekan Mortar',
    source: 'Indonesian Journal of Civil Engineering Education, 2(2)',
    doi: '10.20961/ijcee.v2i2.17936',
    category: 'Material',
    keyPoint: 'Substitusi 20% geothermal sludge pada mortar memberikan performa mekanis tertinggi dalam sistem yang diuji.',
  },
  {
    authors: 'Chen, G., Pu, T., Ma, J., Zhang, Q., Li, Z., & Cheng, Z.',
    year: '2024',
    title: 'Use of Nano-Silica as a Supplementary Cementitious Material in Recycled Aggregate Concrete',
    source: 'Waste and Biomass Valorization, 15(11), 6267–6279',
    doi: '10.1007/s12649-024-02541-0',
    category: 'Material',
    keyPoint: 'Penggunaan 3% nano-SiO₂ menaikkan kuat tekan 28 hari 25,9% serta menurunkan porositas penetrasi klorida.',
  },
  {
    authors: 'Xiaohan, Z., Ahmad, J., Jebur, Y. M., & Deifalla, A. F.',
    year: '2024',
    title: 'A Review on Partial Substitution of Nanosilica in Concrete',
    source: 'Reviews on Advanced Materials Science, 63(1), 20230157',
    doi: '10.1515/rams-2023-0157',
    category: 'Material',
    keyPoint: 'Tinjauan komprehensif rentang optimum nano-silika serta bahaya aglomerasi dan peningkatan kebutuhan air adukan.',
  },
  {
    sourceId: 'SRC-DUR-01/02',
    authors: 'Han, Y., Jia, Z., Yang, X., & Jiang, X.',
    year: '2026',
    title: 'Graded Utilization of Asphalt Mixing Plant Dust in Alkali-Activated Concrete Paving Blocks: Mechanical Performance and Sustainability Assessment',
    source: 'Coatings, 16(5), 541',
    doi: '10.3390/coatings16050541',
    category: 'Material',
    keyPoint: 'Benchmark lintas-material untuk struktur evidence durabilitas paving block (penyerapan air 4,1–5,3 wt.% dan ketahanan aus 24,7–29,2 mm pada 28 hari; bukan bukti residu geothermal).',
  },
  {
    sourceId: 'SRC-010',
    authors: 'Badan Standardisasi Nasional (BSN)',
    year: '1996',
    title: 'SNI 03-0691-1996: Bata Beton (Paving Block)',
    source: 'Standar Nasional Indonesia, Badan Standardisasi Nasional',
    category: 'Standar',
    keyPoint: 'Standar acuan evaluasi mutu kuat tekan (Mutu A: 40 MPa, Mutu B: 20 MPa, Mutu C: 15 MPa, Mutu D: 10 MPa) dan daya serap air.',
  },
];
