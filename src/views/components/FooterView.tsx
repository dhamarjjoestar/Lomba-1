import React from 'react';
import { PageId } from '../../models/silica.model';

interface FooterViewProps {
  onNavigate: (page: PageId) => void;
  onScrollToTop?: () => void;
}

export const FooterView: React.FC<FooterViewProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & SDGs Integration */}
          <div className="md:col-span-5 space-y-4">
            {/* Header: GEOCEDS Logo sejajar dengan Logo SDGs */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-white/10 p-0.5 border border-slate-700">
                  <img
                    src="/images/logo_project.png"
                    alt="Logo GEOCEDS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  GEO<span className="text-emerald-500">CEDS</span>
                </span>
              </div>

              {/* Garis pemisah halus */}
              <div className="hidden sm:block h-6 w-px bg-slate-700"></div>

              {/* Logo SDGs 9, 11, 12 Sejajar */}
              <div className="flex items-center gap-2">
                <img
                  src="/images/sdgs9.png"
                  alt="SDG 9 - Industri, Inovasi, dan Infrastruktur"
                  title="SDG 9: Industri, Inovasi & Infrastruktur"
                  className="w-8 h-8 rounded-md object-contain hover:scale-105 transition-transform shadow-sm"
                />
                <img
                  src="/images/sdgs11.png"
                  alt="SDG 11 - Kota dan Komunitas yang Berkelanjutan"
                  title="SDG 11: Kota & Komunitas Berkelanjutan"
                  className="w-8 h-8 rounded-md object-contain hover:scale-105 transition-transform shadow-sm"
                />
                <img
                  src="/images/sdgs12.png"
                  alt="SDG 12 - Konsumsi dan Produksi yang Bertanggung Jawab"
                  title="SDG 12: Konsumsi & Produksi Bertanggung Jawab"
                  className="w-8 h-8 rounded-md object-contain hover:scale-105 transition-transform shadow-sm"
                />
              </div>
            </div>

            {/* Tagline & Deskripsi */}
            <p className="text-slate-300 leading-relaxed font-medium">
              Evidence-Based Decision Support System untuk Transformasi Residu Geothermal Menjadi Material Konstruksi Berkelanjutan.
            </p>

            {/* Caption Keselarasan SDGs */}
            <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 space-y-1.5 text-[11px]">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Keselarasan SDGs 9, 11 & 12
              </div>
              <p className="text-slate-300 leading-relaxed">
                Platform web ini dirancang selaras dengan target global PBB: mendorong hilirisasi limbah silika geotermal untuk infrastruktur hijau (<span className="text-amber-400 font-medium">SDG 9</span>), mendukung ketahanan material paving perkotaan ramah lingkungan (<span className="text-orange-400 font-medium">SDG 11</span>), serta menerapkan ekonomi sirkular zero-waste (<span className="text-yellow-400 font-medium">SDG 12</span>).
              </p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Halaman Sistem
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Beranda (Rangkuman Essay)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulasi')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Simulasi (Page Terpisah)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('metopen')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Metopen (Page Terpisah)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tim-kami')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Tim Kami (Page Terpisah)
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Afiliasi & Kontak Penulis
            </div>
            <p className="text-slate-400 leading-relaxed">
              Fakultas Teknik, Universitas Negeri Semarang (UNNES)<br />
              Sekaran, Gunungpati, Kota Semarang, Jawa Tengah 50229
            </p>
            <div className="pt-1 text-[11px] text-slate-400 space-y-1">
              <div>Ketua Tim: Aditya Kusuma Wardana (Teknik Sipil)</div>
              <div>Anggota Tim: Dhamar Firdaus Esa Mahendra (Teknik Komputer)</div>
              <div>Anggota Tim: Adita Azril Akbar (Teknik Sipil)</div>
              <div className="text-emerald-400">Email: adityakusuma@students.unnes.ac.id</div>
            </div>
          </div>

          {/* Credit dimasukkan ke dalam frame atas */}
          <div className="md:col-span-12 pt-6 border-t border-slate-800 text-slate-500 text-left">
            © 2026 GEOCEDS · Universitas Negeri Semarang. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
};
