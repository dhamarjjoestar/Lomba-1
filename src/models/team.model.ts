export interface TeamMember {
  name: string;
  nim: string;
  batch: string;
  program: string;
  role: string;
  roleBadge: string;
  isLecturer: boolean;
  focus: string;
  isPlaceholder?: boolean;
  email?: string;
  instagram?: string;
  github?: string;
  phone?: string;
  location?: string;
  iconColor: string;
  avatarUrl?: string;
  faculty?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Aditya Kusuma Wardana',
    nim: '2505020081',
    batch: '2025',
    program: 'Teknik Sipil',
    faculty: 'Fakultas Teknik UNNES',
    role: 'Ketua Tim',
    roleBadge: 'Ketua Tim',
    isLecturer: false,
    focus: 'Karakterisasi Residu Geothermal, Analisis Mutu SNI 03-0691-1996, Formulasi Adukan Sementisius, & Neraca Massa',
    email: 'adityakusuma@students.unnes.ac.id',
    instagram: 'https://instagram.com',
    location: 'Banyumas / Semarang, Jawa Tengah',
    iconColor: 'bg-emerald-100 text-emerald-800',
    avatarUrl: '/images/a.jpg',
  },
  {
    name: 'Dhamar Firdaus Esa Mahendra',
    nim: '2405110008',
    batch: '2024',
    program: 'Teknik Komputer',
    faculty: 'Fakultas Teknik UNNES',
    role: 'Anggota Tim',
    roleBadge: 'Anggota Tim',
    isLecturer: false,
    focus: 'Arsitektur DSS, Evidence Classification Engine, Algoritma Decision Pipeline, & Antarmuka Interaktif',
    iconColor: 'bg-blue-100 text-blue-800',
    email: 'dhamar@students.unnes.ac.id',
    instagram: 'https://instagram.com',
    github: 'https://github.com',
    avatarUrl: '/images/i.jpg',
  },
  {
    name: 'Adita Azril Akbar',
    nim: '2405020152',
    batch: '2024',
    program: 'Teknik Sipil',
    faculty: 'Fakultas Teknik UNNES',
    role: 'Anggota Tim',
    roleBadge: 'Anggota Tim',
    isLecturer: false,
    focus: 'Eksperimen Laboratorium, Pengujian Sifat Mekanis & Validasi Data Pozzolanik Residu Geothermal',
    isPlaceholder: false,
    iconColor: 'bg-teal-100 text-teal-800',
    email: 'aditaazril@students.unnes.ac.id',
    instagram: 'https://instagram.com',
    avatarUrl: '/images/iel.jpg',
  },
  {
    name: 'Alan Riski Rio Ardian, S.T., M.T.',
    nim: '1996122020260612001',
    batch: 'Dosen Pembimbing',
    program: 'S1 Teknik Sipil',
    faculty: 'Fakultas Teknik UNNES',
    role: 'Dosen Pembimbing',
    roleBadge: 'Dosen Pembimbing',
    isLecturer: true,
    focus: 'Supervisi Riset Ilmiah, Validasi Metodologi Material Konstruksi, Bimbingan Penulisan & Arah Kebijakan Inovasi',
    isPlaceholder: false,
    iconColor: 'bg-amber-100 text-amber-900',
    avatarUrl: '/images/dosen.jpg',
  },
];
