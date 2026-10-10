import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
} from 'lucide-react';
import type {
  Characterization,
  DemoDatasetId,
  EconomicControls,
  MixControls,
  StudyResult,
} from '../../engine/study';
import type {
  PaperEconomicScenario,
  PaperScenarioName,
} from '../../engine/lib/paperTeaEngine';
import type {
  SimulationStageId,
  SimulationStageMeta,
} from '../../models/simulationWorkspace.model';

export interface QuickDecisionSplitViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  datasetId: DemoDatasetId;
  paperScenarioName: PaperScenarioName;
  paperScenario: PaperEconomicScenario;
  workflowStages: SimulationStageMeta[];
  onSelectDemoDataset: (id: DemoDatasetId) => void;
  onUpdateCharacterizationField: <K extends keyof Characterization>(
    field: K,
    value: Characterization[K]
  ) => void;
  onUpdateMixField: <K extends keyof MixControls>(
    field: K,
    value: MixControls[K]
  ) => void;
  onUpdateEconomicsField: <K extends keyof EconomicControls>(
    field: K,
    value: EconomicControls[K]
  ) => void;
  onSelectStage: (stageId: SimulationStageId) => void;
  formatIdr: (value: number | null) => string;
  displayDecision: (decision: string) => string;
}

function hasText(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

export const QuickDecisionSplitView: React.FC<QuickDecisionSplitViewProps> = ({
  study,
  characterization,
  mix,
  economics,
  paperScenarioName,
  paperScenario,
  onSelectDemoDataset,
  onUpdateCharacterizationField,
  onUpdateMixField,
  onUpdateEconomicsField,
  onSelectStage,
  formatIdr,
  displayDecision,
}) => {
  // Local test checklist for supplementary SNI physical tests (water absorption, abrasion, TCLP safety)
  const [testChecklist, setTestChecklist] = useState({
    compressiveTested: true,
    waterAbsorptionTested: false,
    abrasionTested: false,
    safetyTclpTested: false,
  });

  const [activeScenarioPreset, setActiveScenarioPreset] = useState<
    'A' | 'B' | 'C' | 'D'
  >('C');

  const qualification = study.science.materialQualification;
  const sni = study.state.sni;
  const evidence = study.state.evidence;
  const decision = study.state.decision;

  const totalRequiredFields = qualification.required.length;
  const completedFieldsCount =
    totalRequiredFields - qualification.missing.length;

  // Apply Scenario Presets (1-Click for Jury Demonstration)
  const applyScenarioA = () => {
    // Skenario A: Batch Belum Terkarakterisasi -> DATA REQUIRED
    setActiveScenarioPreset('A');
    onSelectDemoDataset('incomplete');
    onUpdateCharacterizationField('batch', 'DIENG-RAW-2026-A');
    onUpdateCharacterizationField('source', 'PLTP Dieng · Kolam Lumpur');
    onUpdateCharacterizationField('materialId', 'Sludge Padat Mentah');
    onUpdateMixField('substitution', 10);
    onUpdateEconomicsField('scenario', 'baseline');
    setTestChecklist({
      compressiveTested: false,
      waterAbsorptionTested: false,
      abrasionTested: false,
      safetyTclpTested: false,
    });
  };

  const applyScenarioB = () => {
    // Skenario B: Lulus Teknis, Logistik/Biaya Mahal -> CONDITIONAL
    setActiveScenarioPreset('B');
    onSelectDemoDataset('conditional');
    onUpdateCharacterizationField('batch', 'DIENG-SCL-2026-B');
    onUpdateCharacterizationField('source', 'PLTP Dieng · Pipa Reinjeksi');
    onUpdateCharacterizationField('materialId', 'Silica Scaling Pipa');
    onUpdateCharacterizationField('silica', '84.5');
    onUpdateCharacterizationField('phase', 'Campuran');
    onUpdateMixField('substitution', 10);
    onUpdateEconomicsField('scenario', 'conservative');
    onUpdateEconomicsField('transportDistanceKm', 95);
    setTestChecklist({
      compressiveTested: true,
      waterAbsorptionTested: false,
      abrasionTested: false,
      safetyTclpTested: false,
    });
  };

  const applyScenarioC = () => {
    // Skenario C: Batch Terkualifikasi & Optimal -> GO / PRELIMINARY PROMISING
    setActiveScenarioPreset('C');
    onSelectDemoDataset('qualified');
    onUpdateCharacterizationField('batch', 'DIENG-XRG-2026-C');
    onUpdateCharacterizationField('source', 'PLTP Dieng · Unit Ekstraksi');
    onUpdateCharacterizationField('materialId', 'Silika Xerogel Amorf');
    onUpdateMixField('substitution', 10);
    onUpdateEconomicsField('scenario', 'optimistic');
    onUpdateEconomicsField('transportDistanceKm', 25);
    setTestChecklist({
      compressiveTested: true,
      waterAbsorptionTested: true,
      abrasionTested: true,
      safetyTclpTested: true,
    });
  };

  const applyScenarioD = () => {
    // Skenario D: Dosis Substitusi Berlebih / Gagal Teknis -> NO-GO
    setActiveScenarioPreset('D');
    onSelectDemoDataset('qualified');
    onUpdateCharacterizationField('batch', 'DIENG-OVR-2026-D');
    onUpdateCharacterizationField('materialId', 'Sludge Padat Olahan');
    onUpdateCharacterizationField('phase', 'Kristalin');
    onUpdateMixField('substitution', 25);
    onUpdateEconomicsField('scenario', 'conservative');
    setTestChecklist({
      compressiveTested: true,
      waterAbsorptionTested: false,
      abrasionTested: false,
      safetyTclpTested: false,
    });
  };

  // Select Material Type quick helper
  const handleSelectMaterialType = (
    type: 'sludge' | 'scaling' | 'xerogel'
  ) => {
    if (type === 'sludge') {
      onUpdateCharacterizationField('materialId', 'Sludge Padat PLTP');
      onUpdateCharacterizationField('moisture', '48.0');
      onUpdateCharacterizationField('particle', '65');
      onUpdateCharacterizationField('silica', '76.4');
      onUpdateCharacterizationField('phase', 'Amorf');
      onUpdateCharacterizationField(
        'preprocessing',
        'Dewatering + Pengeringan 110°C + Grinding'
      );
    } else if (type === 'scaling') {
      onUpdateCharacterizationField('materialId', 'Silica Scaling Pipa');
      onUpdateCharacterizationField('moisture', '12.5');
      onUpdateCharacterizationField('particle', '120');
      onUpdateCharacterizationField('silica', '85.2');
      onUpdateCharacterizationField('phase', 'Campuran');
      onUpdateCharacterizationField(
        'preprocessing',
        'Crushing Mekanik + Ball Milling + Sieving'
      );
    } else {
      onUpdateCharacterizationField('materialId', 'Silika Xerogel Amorf');
      onUpdateCharacterizationField('moisture', '4.2');
      onUpdateCharacterizationField('particle', '18');
      onUpdateCharacterizationField('silica', '91.8');
      onUpdateCharacterizationField('phase', 'Amorf');
      onUpdateCharacterizationField(
        'preprocessing',
        'Presipitasi Terkontrol + Pengeringan Ringan'
      );
    }
  };

  // Determine Big Status Badge (GO / CONDITIONAL / DATA REQUIRED / NO-GO)
  const allPhysicalTestsChecked =
    testChecklist.compressiveTested &&
    testChecklist.waterAbsorptionTested &&
    testChecklist.abrasionTested &&
    testChecklist.safetyTclpTested;

  const outputVerdict = (() => {
    if (
      decision.decision === 'NOT_SUPPORTED' ||
      sni.status === 'PRELIMINARY_FAIL' ||
      characterization.phase === 'Kristalin'
    ) {
      return {
        statusText: 'NO-GO',
        subLabel: 'TIDAK DIDUKUNG UNTUK PRODUKSI',
        tone: 'bg-rose-600 text-white border-rose-700',
        softTone: 'bg-rose-50 border-rose-200 text-rose-950',
        icon: XCircle,
        headline:
          'Gagal Gerbang Teknis / Fase Material Tidak Reaktif pada Formulasi Ini',
      };
    }

    if (
      decision.decision === 'DATA_REQUIRED' ||
      qualification.status === 'INSUFFICIENT_DATA' ||
      !testChecklist.compressiveTested
    ) {
      return {
        statusText: 'DATA REQUIRED',
        subLabel: 'KEPUTUSAN DITAHAN — DATA WAJIB BELUM LENGKAP',
        tone: 'bg-amber-500 text-slate-950 border-amber-600',
        softTone: 'bg-amber-50 border-amber-300 text-amber-950',
        icon: Clock,
        headline:
          'Sistem Menolak Menebak: Lengkapi Karakterisasi Batch & Uji Dasar Terlebih Dahulu',
      };
    }

    if (
      qualification.status === 'CONDITIONAL' ||
      economics.scenario === 'conservative' ||
      !allPhysicalTestsChecked
    ) {
      return {
        statusText: 'CONDITIONAL',
        subLabel: 'LOLOS BERSYARAT — PERLU TINDAK LANJUT SPESIFIK',
        tone: 'bg-teal-600 text-white border-teal-700',
        softTone: 'bg-teal-50 border-teal-300 text-teal-950',
        icon: AlertTriangle,
        headline:
          'Lulus Skrining Teknis Kuat Tekan, Namun Logistik/Biaya atau Uji Durabilitas Bersyarat',
      };
    }

    return {
      statusText: 'GO',
      subLabel: 'TERKUALIFIKASI & SIAP PRODUKSI PILOT',
      tone: 'bg-emerald-600 text-white border-emerald-700',
      softTone: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      icon: CheckCircle2,
      headline:
        'Seluruh Gerbang Karakterisasi, Mutu SNI, dan Margin Ekonomi Terpenuhi',
    };
  })();

  const StatusIcon = outputVerdict.icon;

  // Gate status list for right output panel
  const gateCheckItems = [
    {
      name: 'Gerbang 1 · Identitas Batch & Sumber PLTP',
      state:
        hasText(characterization.batch) && hasText(characterization.source)
          ? 'LULUS'
          : 'DATA HILANG',
      stageId: 'overview' as SimulationStageId,
    },
    {
      name: 'Gerbang 2 · Karakterisasi Fisik & Mineralogi',
      state:
        characterization.phase === 'Kristalin'
          ? 'GAGAL'
          : qualification.status === 'QUALIFIED'
          ? 'LULUS'
          : qualification.status === 'CONDITIONAL'
          ? 'BERSYARAT'
          : 'DATA HILANG',
      stageId: 'characterization' as SimulationStageId,
    },
    {
      name: 'Gerbang 3 · Formulasi & Neraca Massa Paving',
      state: mix.substitution <= 20 ? 'LULUS' : 'GAGAL',
      stageId: 'formulation' as SimulationStageId,
    },
    {
      name: 'Gerbang 4 · Bukti Kuat Tekan SNI Mutu C (≥12,5 MPa)',
      state: !testChecklist.compressiveTested
        ? 'DATA HILANG'
        : sni.status === 'PRELIMINARY_PASS'
        ? 'LULUS'
        : sni.status === 'PRELIMINARY_FAIL'
        ? 'GAGAL'
        : 'DATA HILANG',
      stageId: 'gate' as SimulationStageId,
    },
    {
      name: 'Gerbang 5 · Uji Serapan Air, Aus & Keamanan TCLP',
      state:
        testChecklist.waterAbsorptionTested &&
        testChecklist.abrasionTested &&
        testChecklist.safetyTclpTested
          ? 'LULUS'
          : 'DATA HILANG',
      stageId: 'gate' as SimulationStageId,
    },
    {
      name: 'Gerbang 6 · Kelayakan Biaya Produksi & Logistik (TEA)',
      state: economics.scenario === 'conservative' ? 'BERSYARAT' : 'LULUS',
      stageId: 'economics' as SimulationStageId,
    },
  ];

  // Dynamic Missing Data & Next Action items
  const missingDataFollowUp: string[] = [];
  if (qualification.missing.length > 0) {
    missingDataFollowUp.push(
      `Lengkapi data karakterisasi batch yang kosong: ${qualification.missing.join(
        ', '
      )}.`
    );
  }
  if (!testChecklist.compressiveTested) {
    missingDataFollowUp.push(
      'Lakukan uji kuat tekan bata beton (SNI 03-0691-1996) pada benda uji paving aktual.'
    );
  }
  if (!testChecklist.waterAbsorptionTested) {
    missingDataFollowUp.push(
      'Lengkapi uji penyerapan air rata-rata (syarat Mutu C Maks. 8%).'
    );
  }
  if (!testChecklist.abrasionTested) {
    missingDataFollowUp.push(
      'Lengkapi uji ketahanan aus mekanis (syarat Mutu C Maks. 0,160 mm/menit).'
    );
  }
  if (!testChecklist.safetyTclpTested) {
    missingDataFollowUp.push(
      'Lengkapi uji pelindian logam berat (TCLP) untuk memastikan keamanan lingkungan & akhir masa pakai.'
    );
  }
  if (economics.scenario === 'conservative') {
    missingDataFollowUp.push(
      `Optimasi biaya pengeringan/transportasi (jarak saat ini ${
        economics.transportDistanceKm ?? 45
      } km; HPP skenario konservatif Rp 1.490/blok membuat payback melambat ke ~${paperScenario.paybackMonths.toFixed(
        1
      )} bulan).`
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. BAR SKENARIO PRESET (YANG PALING MENJUAL UNTUK DEMO JURI) */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5 border border-slate-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>
              Skenario Preset Demo Cepat (Klik untuk Menguji Sistem Keputusan)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Data Batch Masuk → Melewati Gerbang → Keluar Keputusan &amp; Tindak Lanjut
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Skenario A */}
          <button
            type="button"
            onClick={applyScenarioA}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              activeScenarioPreset === 'A'
                ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-amber-300">
                SKENARIO A
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                → DATA REQUIRED
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Batch Belum Terkarakterisasi
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Sludge mentah masuk tanpa data SiO₂, D50, dan fase mineralogi.
              </div>
            </div>
          </button>

          {/* Skenario B */}
          <button
            type="button"
            onClick={applyScenarioB}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              activeScenarioPreset === 'B'
                ? 'bg-teal-500/20 border-teal-400 ring-1 ring-teal-400'
                : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-teal-300">
                SKENARIO B
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-400 text-slate-950">
                → CONDITIONAL
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Lulus Teknis, Logistik Mahal
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Kuat tekan lulus Mutu C, tapi biaya olah/logistik berat &amp; uji aus belum lengkap.
              </div>
            </div>
          </button>

          {/* Skenario C */}
          <button
            type="button"
            onClick={applyScenarioC}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              activeScenarioPreset === 'C'
                ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-emerald-300">
                SKENARIO C
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-400 text-slate-950">
                → GO
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Batch Terkualifikasi Penuh
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Silika amorf 10%, karakterisasi &amp; checklist uji lengkap, ekonomi efisien.
              </div>
            </div>
          </button>

          {/* Skenario D */}
          <button
            type="button"
            onClick={applyScenarioD}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              activeScenarioPreset === 'D'
                ? 'bg-rose-500/20 border-rose-400 ring-1 ring-rose-400'
                : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-rose-300">
                SKENARIO D
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                → NO-GO
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Dosis Berlebih / Kristalin
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Substitusi 25% (lewat batas aglomerasi) &amp; fase kristalin tidak reaktif.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. DUA SISI: PANEL INPUT (KIRI) & PANEL OUTPUT KEPUTUSAN (KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL KIRI: INPUT BATCH, MATERIAL, KARAKTERISASI, FORMULASI & CHECKLIST UJI (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                Sisi Kiri · Panel Input
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Data Batch &amp; Parameter Pengujian
              </h2>
            </div>
            <Database className="w-5 h-5 text-emerald-700" />
          </div>

          {/* A. Identitas Batch */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>1. Identitas Batch Material</span>
              <span className="text-[11px] font-mono text-slate-400">Tahap 01</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sumber PLTP
                </label>
                <input
                  type="text"
                  value={characterization.source}
                  onChange={(e) =>
                    onUpdateCharacterizationField('source', e.target.value)
                  }
                  placeholder="Misal: PLTP Dieng"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nomor / Kode Batch
                </label>
                <input
                  type="text"
                  value={characterization.batch}
                  onChange={(e) =>
                    onUpdateCharacterizationField('batch', e.target.value)
                  }
                  placeholder="Misal: DIENG-2026-01"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* B. Jenis Material */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                2. Jenis Material Residu Geothermal
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Membedakan perilaku bahan
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSelectMaterialType('sludge')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  characterization.materialId.toLowerCase().includes('sludge')
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Sludge Padat
              </button>
              <button
                type="button"
                onClick={() => handleSelectMaterialType('scaling')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  characterization.materialId.toLowerCase().includes('scaling')
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Scaling Pipa
              </button>
              <button
                type="button"
                onClick={() => handleSelectMaterialType('xerogel')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  characterization.materialId.toLowerCase().includes('xerogel')
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Silika Xerogel
              </button>
            </div>
            <div className="text-[11px] text-slate-500">
              Terpilih:{' '}
              <strong className="text-slate-800">
                {characterization.materialId || 'Belum dipilih'}
              </strong>
            </div>
          </div>

          {/* C. Checklist Data Karakterisasi */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                3. Checklist Data Karakterisasi Batch
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                Terisi: {completedFieldsCount}/{totalRequiredFields}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {/* Kadar Air */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-800">Kadar Air</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {hasText(characterization.moisture)
                      ? `${characterization.moisture}%`
                      : 'Belum ada'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCharacterizationField(
                      'moisture',
                      hasText(characterization.moisture) ? '' : '6.5'
                    )
                  }
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    hasText(characterization.moisture)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {hasText(characterization.moisture) ? '✓ Ada' : '+ Isi'}
                </button>
              </div>

              {/* Ukuran Partikel D50 */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-800">Partikel (D50)</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {hasText(characterization.particle)
                      ? `${characterization.particle} μm`
                      : 'Belum ada'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCharacterizationField(
                      'particle',
                      hasText(characterization.particle) ? '' : '45'
                    )
                  }
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    hasText(characterization.particle)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {hasText(characterization.particle) ? '✓ Ada' : '+ Isi'}
                </button>
              </div>

              {/* Komposisi SiO2 */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-800">Komposisi SiO₂</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {hasText(characterization.silica)
                      ? `${characterization.silica} wt.%`
                      : 'Belum ada'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCharacterizationField(
                      'silica',
                      hasText(characterization.silica) ? '' : '86.4'
                    )
                  }
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    hasText(characterization.silica)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {hasText(characterization.silica) ? '✓ Ada' : '+ Isi'}
                </button>
              </div>

              {/* Fase Mineral */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-800">Fase Mineral</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {hasText(characterization.phase)
                      ? characterization.phase
                      : 'Belum ada'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCharacterizationField(
                      'phase',
                      hasText(characterization.phase) ? '' : 'Amorf'
                    )
                  }
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                    hasText(characterization.phase)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {hasText(characterization.phase) ? '✓ Ada' : '+ Isi'}
                </button>
              </div>
            </div>
          </div>

          {/* D. Formulasi Kandidat & Ekonomi */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                4. Formulasi Kandidat &amp; Skenario Biaya
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                Target: Paving Mutu C
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">
                  Persentase Substitusi Semen:
                </span>
                <span className="font-mono font-extrabold text-emerald-800">
                  {mix.substitution}% (W/B {mix.waterRatio})
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {[0, 5, 10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onUpdateMixField('substitution', pct)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      mix.substitution === pct
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium">
                Kondisi Biaya &amp; Logistik:
              </span>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'optimistic', label: 'Efisien' },
                    { id: 'baseline', label: 'Dasar' },
                    { id: 'conservative', label: 'Logistik Mahal' },
                  ] as const
                ).map((scen) => (
                  <button
                    key={scen.id}
                    type="button"
                    onClick={() => onUpdateEconomicsField('scenario', scen.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                      economics.scenario === scen.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {scen.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* E. Checklist Hasil Uji Fisik & Keamanan */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                5. Checklist Hasil Uji Produk (SNI &amp; Keamanan)
              </span>
              <span className="text-[11px] text-slate-500">
                Klik untuk simulasi bukti uji
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testChecklist.compressiveTested}
                  onChange={(e) =>
                    setTestChecklist((prev) => ({
                      ...prev,
                      compressiveTested: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  <strong className="text-slate-800 block">Kuat Tekan (MPa)</strong>
                  <span className="text-[10px] text-slate-500">
                    {evidence.M7 !== null
                      ? `Data: ${evidence.M7} MPa (Syarat ≥12,5)`
                      : 'Interpolasi / Uji Lab'}
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testChecklist.waterAbsorptionTested}
                  onChange={(e) =>
                    setTestChecklist((prev) => ({
                      ...prev,
                      waterAbsorptionTested: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  <strong className="text-slate-800 block">Penyerapan Air</strong>
                  <span className="text-[10px] text-slate-500">
                    Syarat Mutu C ≤ 8%
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testChecklist.abrasionTested}
                  onChange={(e) =>
                    setTestChecklist((prev) => ({
                      ...prev,
                      abrasionTested: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  <strong className="text-slate-800 block">Ketahanan Aus</strong>
                  <span className="text-[10px] text-slate-500">
                    Syarat ≤ 0,160 mm/menit
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testChecklist.safetyTclpTested}
                  onChange={(e) =>
                    setTestChecklist((prev) => ({
                      ...prev,
                      safetyTclpTested: e.target.checked,
                    }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  <strong className="text-slate-800 block">Uji Keamanan (TCLP)</strong>
                  <span className="text-[10px] text-slate-500">
                    Bebas pelindian B3
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: OUTPUT KEPUTUSAN TERTELUSUR (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                Sisi Kanan · Panel Output Keputusan
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Keputusan GEOCEDS &amp; Tindak Lanjut
              </h2>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>

          {/* 1. STATUS BESAR BERWARNA */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 space-y-3 ${outputVerdict.tone}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest opacity-90">
                {outputVerdict.subLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-black/20 text-[11px] font-mono">
                Engine: {displayDecision(decision.decision)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <StatusIcon className="w-9 h-9 shrink-0" />
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
                  {outputVerdict.statusText}
                </div>
                <div className="text-xs sm:text-sm font-medium opacity-95 mt-0.5">
                  {outputVerdict.headline}
                </div>
              </div>
            </div>
          </div>

          {/* 2. DAFTAR GERBANG MANA YANG LULUS, GAGAL, ATAU DATANYA HILANG */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Status Pemeriksaan Gerbang (Gate-by-Gate)
            </div>

            <div className="space-y-2">
              {gateCheckItems.map((gate, idx) => {
                const badgeStyle =
                  gate.state === 'LULUS'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : gate.state === 'BERSYARAT'
                    ? 'bg-teal-100 text-teal-800 border-teal-300'
                    : gate.state === 'GAGAL'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300';

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="font-semibold text-slate-800">
                      {gate.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeStyle}`}
                      >
                        {gate.state}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectStage(gate.stageId)}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Detail →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. ALASAN KEPUTUSAN */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-700 uppercase">
              Alasan Keputusan (Traceable Rationale)
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {decision.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span className="leading-relaxed">
                  <strong>Ringkasan Ekonomi ({paperScenarioName}):</strong> HPP{' '}
                  {formatIdr(paperScenario.productionCostPerBlock)}/blok, margin{' '}
                  {formatIdr(paperScenario.marginPerBlock)}/blok, payback ~
                  {paperScenario.paybackMonths.toFixed(1)} bulan.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. DAFTAR DATA YANG HARUS DILENGKAPI BERIKUTNYA */}
          <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-amber-900 uppercase">
              Daftar Data &amp; Tindak Lanjut Berikutnya
            </div>
            {missingDataFollowUp.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-amber-950">
                {missingDataFollowUp.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-amber-700">
                      {idx + 1}.
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-900 font-medium">
                ✓ Seluruh parameter karakterisasi dan checklist uji produk telah terverifikasi pada simulasi ini. Batch siap dilanjutkan ke pencetakan pilot.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
