import React from 'react';
import { useEconomicController } from '../../controllers/useEconomicController';

export const EconomicSectionView: React.FC = () => {
  const { activeTab, setActiveTab, massBalanceData, capexData, opexData, scenarioData } =
    useEconomicController();

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl shrink-0 max-w-fit">
        <button
          onClick={() => setActiveTab('neraca')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'neraca'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Neraca Massa
        </button>
        <button
          onClick={() => setActiveTab('capex_opex')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'capex_opex'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          CAPEX & OPEX
        </button>
        <button
          onClick={() => setActiveTab('skenario')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'skenario'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Skenario Sensitivitas
        </button>
      </div>

      {/* Tab 1: Neraca Massa dan Basis Produksi */}
      {activeTab === 'neraca' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Tabel 1. Neraca Massa & Basis Produksi Harian (Studi Kasus Dieng)
              </span>
              <span className="text-xs text-slate-500 font-mono">5.000 Block / Hari</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/60 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-4 text-right">Nilai</th>
                    <th className="py-3 px-4">Satuan</th>
                    <th className="py-3 px-4">Status Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {massBalanceData.map((row, idx) => (
                    <tr key={idx} className={row.isTotal ? 'bg-slate-50/80 font-bold' : ''}>
                      <td className="py-3 px-4">{row.parameter}</td>
                      <td className={`py-3 px-4 text-right font-mono ${row.isTotal ? 'text-emerald-700 font-bold' : 'font-bold'}`}>
                        {row.value}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{row.unit}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          row.status.includes('Skenario') ? 'text-blue-700 bg-blue-50' :
                          row.status.includes('Asumsi') ? 'text-amber-700 bg-amber-50' :
                          'text-emerald-700 bg-emerald-50'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Konversi Geometri & Volume
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paving block bata beton standar mengacu pada SNI 03-0691-1996 dengan spesifikasi geometri persegi panjang:
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Dimensi Nominal:</span>
                <span className="font-mono font-semibold text-slate-900">200 × 100 × 60 mm</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Luas Permukaan per Blok:</span>
                <span className="font-mono font-semibold text-slate-900">0,02 m² (50 blok / m²)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="text-slate-600">Densitas Rata-rata:</span>
                <span className="font-mono font-semibold text-slate-900">2.200 kg/m³</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg flex justify-between font-semibold text-emerald-900">
                <span>Konsumsi Semen per Blok:</span>
                <span className="font-mono">±0,44 kg / block</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CAPEX & OPEX */}
      {activeTab === 'capex_opex' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Tabel 2. Preliminary CAPEX
                </div>
                <div className="text-xs text-slate-500">Peralatan Pengolahan Residu Dieng</div>
              </div>
              <div className="text-sm font-extrabold text-slate-900 font-mono">
                Rp 276.000.000
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  {capexData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.component}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{row.cost}</td>
                      <td className="py-2.5 px-3 text-right text-[11px] text-slate-500">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Tabel 3. Preliminary OPEX
                </div>
                <div className="text-xs text-slate-500">Biaya Operasional per Ton Residu</div>
              </div>
              <div className="text-sm font-extrabold text-emerald-700 font-mono">
                ≈Rp 503.000 / ton
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  {opexData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{row.component}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{row.cost}</td>
                      <td className="py-2.5 px-3 text-right text-[11px] text-slate-500">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Skenario Sensitivitas & Payback */}
      {activeTab === 'skenario' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 bg-slate-50 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Tabel 6. Skenario Analisis Tekno-Ekonomi untuk GEOCEDS
            </div>
            <div className="text-xs text-slate-500">
              Perbandingan Skenario Konservatif, Dasar (EE), dan Optimistis pada Utilisasi 5.000 Blok/Hari
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Parameter Finansial</th>
                  <th className="py-3 px-4 text-right">Konservatif</th>
                  <th className="py-3 px-4 text-right bg-emerald-50/70 text-emerald-950">Dasar (EE)</th>
                  <th className="py-3 px-4 text-right">Optimistis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {scenarioData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      row.isHighlight
                        ? 'bg-emerald-100/40 text-slate-900 font-extrabold text-sm'
                        : row.isBold
                        ? 'bg-slate-50/50 font-bold'
                        : ''
                    }
                  >
                    <td className="py-3 px-4">{row.parameter}</td>
                    <td className={`py-3 px-4 text-right font-mono ${row.isHighlight ? 'text-amber-800' : ''}`}>
                      {row.conservative}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${row.isHighlight ? 'text-emerald-800 font-bold bg-emerald-100/60' : 'bg-emerald-50/30 text-emerald-900 font-bold'}`}>
                      {row.baseline}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${row.isHighlight ? 'text-emerald-800' : ''}`}>
                      {row.optimistic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
