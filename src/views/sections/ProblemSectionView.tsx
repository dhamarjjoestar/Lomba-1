import React, { useState } from 'react';
import { Flame, AlertTriangle, Layers } from 'lucide-react';

export const ProblemSectionView: React.FC = () => {
  const [selectedResidue, setSelectedResidue] = useState<number>(0);

  const residueTypes = [
    {
      title: 'Geothermal Sludge Mentah',
      source: 'Endapan Kolam & Pemeliharaan Brine PLTP Dieng',
      sio2: '60% – 85%',
      surfaceArea: '30 – 80 m²/g',
      behavior: 'Kadar air tinggi (hingga 50-60%), masih bercampur garam & pengotor mineral. Memerlukan dewatering, pengeringan, dan penggilingan sebelum evaluasi pozzolan.',
      risks: 'Variabilitas batch tinggi; tidak dapat langsung dicampur semen tanpa pengeringan terstandar.',
      verdict: 'Wajib Gate Karakterisasi Awal',
    },
    {
      title: 'Silika Xerogel Amorf',
      source: 'Ekstraksi Alkali - Presipitasi Asam (Widiyandari et al., 2021)',
      sio2: '88% – 94%',
      surfaceArea: 'Hingga 302,87 m²/g',
      behavior: 'Struktur mikropori amorf murni dengan reaktivitas tinggi. Mampu bereaksi dengan Ca(OH)₂ membentuk gel C-S-H tambahan.',
      risks: 'Kebutuhan air adukan meningkat drastis; risiko retak susut jika W/C ratio tidak dikompensasi superplasticizer.',
      verdict: 'Kandidat Kuat Formulasi Mutu B/A',
    },
    {
      title: 'Silika Mesopori SBA-15',
      source: 'Sintesis Termal & Template Kopolimer (H.S.N et al., 2023)',
      sio2: '95,70 wt.%',
      surfaceArea: '500 – 750 m²/g',
      behavior: 'Pori seragam berukuran heksagonal 6-10 nm, kemurnian ultra tinggi.',
      risks: 'Biaya sintesis tinggi untuk aplikasi massal material paving block biasa; lebih tepat untuk material fungsional spesifik.',
      verdict: 'Ekonomi Memerlukan Screening Khusus',
    },
    {
      title: 'Silica Scaling Pipa',
      source: 'Kerak Pipa Re-injeksi & Separator (Agustinus et al., 2018)',
      sio2: '80% – 92%',
      surfaceArea: '10 – 40 m²/g',
      behavior: 'Padatan sangat keras dan kompak. Jika mengalami panas tinggi geothermal terus menerus, dapat mengalami kristalisasi kuarsa/kristobalit.',
      risks: 'Aktivitas pozzolanik rendah jika sudah mengkristal (Mulyana et al., 2022); biaya grinding mekanik tinggi.',
      verdict: 'Wajib Cek Indeks Pozzolanik',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 3 Core Dilemma Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Silica Scaling & Timbulan Residu
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Brine bertemperatur tinggi di Dieng mengandung konsentrasi silika dan garam terlarut tinggi. Penurunan tekanan mendepositkan kerak silika masif yang mengganggu kontinuitas operasi (Pambudi et al., 2015; Utami et al., 2014).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Akumulasi: ±165 ton sludge padat / bulan
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Research Gap: Potensi ≠ Kelayakan
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kandungan SiO₂ tinggi dan struktur amorf sering disalahartikan sebagai jaminan kelayakan semen. Faktanya, perlakuan termal dapat memicu kristalisasi yang merusak aktivitas pozzolanik (Mulyana et al., 2022).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Risiko: Kristalisasi & hilangnya reaktivitas
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Respons Multidimensi Campuran
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Substitusi silika pada semen dapat menaikkan kuat tekan, tetapi dosis berlebih memicu aglomerasi dan menurunkan <em className="italic">workability</em> secara drastis (López-Perales et al., 2024; Chen et al., 2024).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Solusi: Evaluasi terukur Gate-First, Rank-Second
          </div>
        </div>
      </div>

      {/* Interactive Comparison of Geothermal Residue Types */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Analisis Karakteristik Material
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Mengapa Setiap Jenis Residu Harus Diperlakukan Berbeda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pilih varian material geothermal untuk melihat perbedaan struktur dan implikasinya pada sistem semen:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-xl shrink-0 w-full sm:w-64">
            {residueTypes.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedResidue(idx)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  selectedResidue === idx
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {item.title.split(' ')[1] || item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                {residueTypes[selectedResidue].title}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                [ID: RES-{selectedResidue + 1}]
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {residueTypes[selectedResidue].behavior}
            </p>

            <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
              <strong className="font-semibold block mb-1">Tantangan & Resiko Rekayasa:</strong>
              {residueTypes[selectedResidue].risks}
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Sumber & Rujukan</div>
              <div className="text-xs font-medium text-slate-800 mt-0.5">
                {residueTypes[selectedResidue].source}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Kandungan SiO₂</div>
                <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {residueTypes[selectedResidue].sio2}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Luas Permukaan</div>
                <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {residueTypes[selectedResidue].surfaceArea}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Status Gate GEOCEDS</div>
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded inline-block mt-1">
                {residueTypes[selectedResidue].verdict}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
