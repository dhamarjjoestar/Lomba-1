import React from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Leaf,
  FileText,
  Sliders,
} from 'lucide-react';
import { useSimulationController } from '../../controllers/useSimulationController';
import { MaterialPassportModalView } from '../components/MaterialPassportModalView';

export const SimulationSectionView: React.FC = () => {
  const {
    selectedResidueId,
    setSelectedResidueId,
    substitutionRate,
    setSubstitutionRate,
    targetMutu,
    setTargetMutu,
    dailyCapacity,
    setDailyCapacity,
    isPassportOpen,
    openPassport,
    closePassport,
    resetParams,
    calculation,
    residueOptions,
    sniSpecs,
  } = useSimulationController();

  return (
    <div className="space-y-8">
      {/* Action Header Strip */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="text-xs text-slate-500">
          Uji simulasi interaktif berdasarkan formula neraca massa & standar SNI 03-0691-1996.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetParams}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={openPassport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Material Passport</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (Left) */}
        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-bold text-sm">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Parameter Input Formulasi</span>
          </div>

          {/* Input 1: Residue Feedstock */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              1. Sumber Residu Geothermal
            </label>
            <div className="space-y-2">
              {residueOptions.map((res) => (
                <label
                  key={res.id}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedResidueId === res.id
                      ? 'bg-white border-emerald-600 shadow-xs ring-1 ring-emerald-600'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="residueOption"
                    value={res.id}
                    checked={selectedResidueId === res.id}
                    onChange={() => setSelectedResidueId(res.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{res.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {res.sio2}% SiO₂
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{res.phase} · {res.surfaceArea} m²/g</span>
                    <span className="italic">{res.provenance.split('(')[0]}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Input 2: Substitution Rate Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                2. Rasio Substitusi Semen (Massa)
              </label>
              <span className="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
                {substitutionRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={substitutionRate}
              onChange={(e) => setSubstitutionRate(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span>0% (Kontrol)</span>
              <span className="text-emerald-700 font-medium">8% (Studi Kasus)</span>
              <span>15%</span>
              <span className="text-amber-700 font-medium">20% (Batas Aglomerasi)</span>
              <span>30%</span>
            </div>
          </div>

          {/* Input 3: Target SNI Mutu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              3. Target Mutu SNI 03-0691-1996
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['B', 'A', 'C', 'D'] as const).map((m) => {
                const item = sniSpecs[m];
                const isSelected = targetMutu === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTargetMutu(m)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-600 text-slate-900 shadow-xs ring-1 ring-emerald-600'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Mutu {m}</span>
                      <span className="text-[10px] font-mono text-slate-500">≥{item.minCompressive} MPa</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      Maks abs {item.maxAbsorption}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input 4: Plant Capacity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              4. Kapasitas Fasilitas Harian
            </label>
            <select
              value={dailyCapacity}
              onChange={(e) => setDailyCapacity(Number(e.target.value))}
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={3000}>3.000 blok / hari (Skala Perintis)</option>
              <option value={5000}>5.000 blok / hari (Basis Studi Kasus Dieng)</option>
              <option value={10000}>10.000 blok / hari (Skala Komersial Penuh)</option>
            </select>
          </div>
        </div>

        {/* Results & Decision Evaluation Column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Verdict Banner */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              calculation.decisionStatus === 'Recommended'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : calculation.decisionStatus === 'Bersyarat'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                {calculation.decisionStatus === 'Recommended' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                {calculation.decisionStatus === 'Bersyarat' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                {calculation.decisionStatus === 'Not Recommended' && <XCircle className="w-6 h-6 text-rose-600" />}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider font-semibold opacity-70">
                    Keputusan Akhir GEOCEDS
                  </div>
                  <div className="text-xl font-extrabold tracking-tight">
                    {calculation.decisionStatus === 'Bersyarat' ? 'Bersyarat (Conditional)' : calculation.decisionStatus}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-70">Tingkat Evidence</div>
                <div className="text-xs font-bold font-mono">{calculation.evidenceStrength}</div>
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed">
              {calculation.verdictReason}
            </p>
          </div>

          {/* Technical Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Kuat Tekan 28 Hari
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {calculation.predictedCompressiveStrength}
                </span>
                <span className="text-xs text-slate-500 font-mono">MPa</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2">
                <span>SNI Syarat: ≥{calculation.requiredCompressiveStrength} MPa</span>
                <span className={`font-semibold ${calculation.predictedCompressiveStrength >= calculation.requiredCompressiveStrength ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {calculation.predictedCompressiveStrength >= calculation.requiredCompressiveStrength ? 'MEMENUHI' : 'GAGAL'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Penyerapan Air
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {calculation.waterAbsorption}
                </span>
                <span className="text-xs text-slate-500 font-mono">%</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2">
                <span>Maksimum: ≤{calculation.maxWaterAbsorption}%</span>
                <span className={`font-semibold ${calculation.waterAbsorption <= calculation.maxWaterAbsorption ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {calculation.waterAbsorption <= calculation.maxWaterAbsorption ? 'MEMENUHI' : 'GAGAL'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Workability (Slump)
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {calculation.slumpWorkability}
                </span>
                <span className="text-xs text-slate-500 font-mono">mm</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2">
                <span>Risiko Aglomerasi</span>
                <span className={`font-semibold ${calculation.agglomerationRisk ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {calculation.agglomerationRisk ? 'TINGGI' : 'RENDAH'}
                </span>
              </div>
            </div>
          </div>

          {/* Economic & Environmental Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Skrining Ekonomi & Lingkungan</span>
              <span className="text-[11px] font-normal text-slate-500">Tabel 6 & 7 Provenance</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] text-slate-500">Biaya Produksi</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                  Rp {calculation.costPerBlock.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400">per blok</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500">Harga Jual Pasar</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                  Rp {calculation.sellingPricePerBlock.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400">Rp 80.000/m²</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500">Margin Operasi</div>
                <div className="text-base font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
                  Rp {calculation.grossMarginPerBlock.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  +{((calculation.grossMarginPerBlock / calculation.costPerBlock) * 100).toFixed(0)}% margin
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500">Payback CAPEX</div>
                <div className="text-base font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
                  ~{calculation.paybackMonths} Bln
                </div>
                <div className="text-[10px] text-slate-400">Investasi Rp 276jt</div>
              </div>
            </div>

            {/* Carbon Reduction */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Reduksi Emisi Klinker Semen:</span>
              </div>
              <div className="font-mono font-bold text-emerald-800 tabular-nums">
                {calculation.co2SavedPerDay.toLocaleString('id-ID')} kg CO₂e / hari
              </div>
            </div>
          </div>

          {/* Identified Data Gaps */}
          {calculation.identifiedDataGaps.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span>Keterbatasan Evidence & Data Gap yang Teridentifikasi:</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {calculation.identifiedDataGaps.map((gap, gIdx) => (
                  <li key={gIdx}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Passport Dialog */}
      <MaterialPassportModalView isOpen={isPassportOpen} onClose={closePassport} />
    </div>
  );
};
