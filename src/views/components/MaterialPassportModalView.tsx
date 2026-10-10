import React from 'react';
import { X, Printer } from 'lucide-react';

interface MaterialPassportModalViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialPassportModalView: React.FC<MaterialPassportModalViewProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-mono font-bold">
              ID
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold">PASSPORT MATERIAL RESIDU</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">DEMO-Q-001</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Silika Xerogel Amorf (PLTP Dieng)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup passport"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Section 1: Identitas & Riwayat Pemrosesan */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
              1. Identitas & Silsilah Pemrosesan (Provenance)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Asal Residu:</span>
                <span className="font-semibold text-slate-900">PLTP Dieng, Jateng</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Metode Olah:</span>
                <span className="font-semibold text-slate-900">Alkali-Asam Ultrasonic</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Drying & Grinding:</span>
                <span className="font-semibold text-slate-900">105°C (2 jam) + Ball Mill</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Ukuran Partikel (d50):</span>
                <span className="font-semibold text-slate-900 font-mono">14,2 µm (Mesh #200)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Karakteristik Kimia & Mineralogi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
              2. Karakteristik Kimia & Mineralogi (Science Engine)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Kadar SiO₂ (XRF)</div>
                <div className="text-base font-bold text-emerald-700 font-mono mt-0.5">95,70 wt.%</div>
                <div className="text-[10px] text-slate-400">Status: Validated</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Fase Mineral (XRD)</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">Amorf 98%</div>
                <div className="text-[10px] text-slate-400">Puncak lebar 2θ ≈ 22°</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Luas Permukaan (BET)</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">302,87 m²/g</div>
                <div className="text-[10px] text-slate-400">Mesopori terkontrol</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Kehilangan Pijar (LOI)</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">2,85%</div>
                <div className="text-[10px] text-slate-400">Batas SNI &lt; 5%</div>
              </div>
            </div>
          </div>

          {/* Section 3: Ringkasan Evaluasi 5-Gate SILICA2CON */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
              3. Hasil Evaluasi Gerbang Keputusan
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">Gate 1: Material Qualification</div>
                  <div className="text-[11px] text-slate-500">Kadar silika & struktur amorf memenuhi ambang batas aktivitas pozzolanik.</div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">PASSED</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">Gate 2: Technical Gate (SNI 03-0691-1996)</div>
                  <div className="text-[11px] text-slate-500">Kuat tekan 24,8 MPa (Syarat Mutu B: 20 MPa) · Penyerapan air 6,2%.</div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">MUTU B LULUS</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-xs">Gate 3: Economic Screening</div>
                  <div className="text-[11px] text-slate-500">Margin operasi Rp 350/blok · Payback ~6,3 bulan (CAPEX Rp 276jt).</div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">FEASIBLE</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-amber-950 text-xs">Status Akhir: Bersyarat (Conditional)</div>
                  <div className="text-[11px] text-amber-800">Menahan status rekomendasi penuh hingga pengujian abrasi fisik skala pabrik selesai.</div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">BERSYARAT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Terdaftar di basis data GEOCEDS DSS · UNNES 2026
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Passport</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
