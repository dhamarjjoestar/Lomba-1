import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Database,
  Layers,
  Scale,
  Leaf,
  Coins,
} from 'lucide-react';
import type {
  Characterization,
  EconomicControls,
  MixControls,
  StudyResult,
} from '../../engine/study';
import type {
  PaperBridgeResult,
  PaperEconomicScenario,
  PaperScenarioName,
} from '../../engine/lib/paperTeaEngine';
import type { SimulationStageId } from '../../models/simulationWorkspace.model';

export interface RecommendationStageViewProps {
  study: StudyResult;
  characterization: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  studyMode: 'demo' | 'actual';
  paperScenarioName: PaperScenarioName;
  paperScenario: PaperEconomicScenario;
  paperBridge: PaperBridgeResult;
  onSelectStage: (stageId: SimulationStageId) => void;
  formatIdr: (value: number | null) => string;
  displayDecision: (decision: string) => string;
  evidenceLabel: (value: string | null | undefined) => string;
}

function hasText(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

export const RecommendationStageView: React.FC<RecommendationStageViewProps> = ({
  study,
  characterization,
  mix,
  economics,
  studyMode,
  paperScenarioName,
  paperScenario,
  paperBridge,
  onSelectStage,
  formatIdr,
  displayDecision,
  evidenceLabel,
}) => {
  const qualification = study.science.materialQualification;
  const massBalance = study.state.massBalance;
  const evidence = study.state.evidence;
  const sni = study.state.sni;
  const tea = study.state.tea;
  const environment = study.state.environment;
  const decision = study.state.decision;

  const totalRequiredFields = qualification.required.length;
  const completedFieldsCount =
    totalRequiredFields - qualification.missing.length;

  // Map canonical decision code to essay-aligned big status (GO / CONDITIONAL / DATA REQUIRED / NO-GO)
  const highLevelVerdict = (() => {
    if (
      decision.decision === 'NOT_SUPPORTED' ||
      sni.status === 'PRELIMINARY_FAIL'
    ) {
      return {
        shortCode: 'NO-GO',
        label: displayDecision(decision.decision),
        bannerTone: 'bg-rose-950 text-white border-rose-800',
        badgeTone: 'bg-rose-500 text-white',
        icon: XCircle,
        summary:
          'Batch atau proporsi campuran ini TIDAK DIDUKUNG untuk produksi karena gagal melewati gerbang kualifikasi kritis, batas mutu SNI, atau kelayakan dasar.',
      };
    }
    if (
      decision.decision === 'DATA_REQUIRED' ||
      qualification.status === 'INSUFFICIENT_DATA'
    ) {
      return {
        shortCode: 'DATA REQUIRED',
        label: displayDecision(decision.decision),
        bannerTone: 'bg-amber-950 text-white border-amber-800',
        badgeTone: 'bg-amber-500 text-slate-950',
        icon: Clock,
        summary:
          'Keputusan ditahan sementara. Sistem mendeteksi parameter karakterisasi batch atau hasil uji wajib SNI yang belum lengkap.',
      };
    }
    if (
      decision.decision === 'CONDITIONAL' ||
      qualification.status === 'CONDITIONAL' ||
      economics.scenario === 'conservative'
    ) {
      return {
        shortCode: 'CONDITIONAL',
        label: displayDecision(decision.decision),
        bannerTone: 'bg-teal-950 text-white border-teal-800',
        badgeTone: 'bg-teal-400 text-slate-950',
        icon: AlertTriangle,
        summary:
          'Secara teknis prospektif, namun berstatus BERSYARAT karena sebagian parameter karakterisasi/uji fisik atau efisiensi biaya logistik masih memerlukan verifikasi.',
      };
    }
    return {
      shortCode: 'GO (PRELIMINARY)',
      label: displayDecision(decision.decision),
      bannerTone: 'bg-emerald-950 text-white border-emerald-800',
      badgeTone: 'bg-emerald-400 text-slate-950',
      icon: CheckCircle2,
      summary:
        'Kandidat batch dan formulasi memenuhi gerbang skrining awal (Gate-First) dan siap dilanjutkan ke validasi fisik skala penuh.',
    };
  })();

  const VerdictIcon = highLevelVerdict.icon;

  // 7 Gate Evaluation Summary (Stages 01 to 07)
  const sevenGatesSummary = [
    {
      stageNo: '01',
      stageId: 'overview' as SimulationStageId,
      title: 'Identitas Batch & Konteks',
      status:
        hasText(characterization.batch) && hasText(characterization.source)
          ? 'LULUS'
          : 'DATA HILANG',
      tone:
        hasText(characterization.batch) && hasText(characterization.source)
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200',
      detail: `Batch: ${characterization.batch || 'Belum diisi'} · Sumber: ${
        characterization.source || 'Belum diisi'
      }`,
      icon: Database,
    },
    {
      stageNo: '02',
      stageId: 'characterization' as SimulationStageId,
      title: 'Kualifikasi Karakterisasi Material',
      status:
        qualification.status === 'QUALIFIED'
          ? `LULUS (${completedFieldsCount}/${totalRequiredFields})`
          : qualification.status === 'CONDITIONAL'
          ? `BERSYARAT (${completedFieldsCount}/${totalRequiredFields})`
          : `DATA HILANG (${completedFieldsCount}/${totalRequiredFields})`,
      tone:
        qualification.status === 'QUALIFIED'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : qualification.status === 'CONDITIONAL'
          ? 'bg-teal-50 text-teal-800 border-teal-200'
          : 'bg-rose-50 text-rose-800 border-rose-200',
      detail: `SiO₂: ${characterization.silica || '—'}% · Fase: ${
        characterization.phase || '—'
      } · D50: ${characterization.particle || '—'} μm · Air: ${
        characterization.moisture || '—'
      }%`,
      icon: ShieldCheck,
    },
    {
      stageNo: '03',
      stageId: 'formulation' as SimulationStageId,
      title: 'Formulasi & Neraca Massa',
      status:
        massBalance.status !== 'DATA_REQUIRED'
          ? 'TERHITUNG'
          : 'DATA HILANG',
      tone:
        massBalance.status !== 'DATA_REQUIRED'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200',
      detail: `Substitusi: ${mix.substitution}% · W/B: ${mix.waterRatio} · Dimensi: ${mix.blockLengthMm}×${mix.blockWidthMm}×${mix.blockThicknessMm} mm`,
      icon: Layers,
    },
    {
      stageNo: '04',
      stageId: 'simulation' as SimulationStageId,
      title: 'Pemetaan Bukti & Kandidat',
      status: evidenceLabel(evidence.evidenceClass ?? evidence.status),
      tone: evidence.direct
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-amber-50 text-amber-800 border-amber-200',
      detail:
        evidence.M7 !== null
          ? `Kuat tekan literatur 7d pada ${mix.substitution}%: ${evidence.M7} MPa (SRC-017)`
          : `Titik ${mix.substitution}% memerlukan interpolasi / pengujian langsung`,
      icon: FileCheck2,
    },
    {
      stageNo: '05',
      stageId: 'gate' as SimulationStageId,
      title: 'Gerbang Teknis SNI 03-0691-1996',
      status:
        sni.status === 'PRELIMINARY_PASS'
          ? 'LOLOS SKRINING AWAL'
          : sni.status === 'PRELIMINARY_FAIL'
          ? 'GAGAL GERBANG TEKNIS'
          : 'DATA UJI DIPERLUKAN',
      tone:
        sni.status === 'PRELIMINARY_PASS'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : sni.status === 'PRELIMINARY_FAIL'
          ? 'bg-rose-50 text-rose-800 border-rose-200'
          : 'bg-amber-50 text-amber-800 border-amber-200',
      detail: `${sni.className} · Kuat tekan 7d: ${
        evidence.M7 ?? 'Belum ada'
      } MPa · Serapan air & aus: wajib uji lab`,
      icon: Scale,
    },
    {
      stageNo: '06',
      stageId: 'economics' as SimulationStageId,
      title: 'Keekonomian (TEA & Benchmark)',
      status:
        tea.costPerBlock !== null
          ? 'BIAYA BATCH TERHITUNG'
          : `BENCHMARK (${paperScenarioName.toUpperCase()})`,
      tone:
        economics.scenario === 'conservative'
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      detail:
        tea.costPerBlock !== null
          ? `Biaya olah/batch: ${formatIdr(tea.costPerBlock)}/blok`
          : `Benchmark Paper (${paperScenarioName}): HPP ${formatIdr(
              paperScenario.productionCostPerBlock
            )}/blok · Margin ${formatIdr(
              paperScenario.marginPerBlock
            )}/blok · Payback ~${paperScenario.paybackMonths.toFixed(1)} bln`,
      icon: Coins,
    },
    {
      stageNo: '07',
      stageId: 'environment' as SimulationStageId,
      title: 'Skrining Lingkungan & Karbon',
      status:
        environment.status === 'CALCULATED'
          ? 'SEMEN TERKURANGI'
          : 'DATA FAKTOR EMISI DIPERLUKAN',
      tone:
        environment.status === 'CALCULATED'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200',
      detail:
        environment.avoided !== null
          ? `Potensi hindari CO₂ semen: ${environment.avoided.toFixed(
              1
            )} kg CO₂e/batch (emisi proses bersih masih memerlukan audit energi)`
          : `Pengurangan semen mengikuti substitusi ${mix.substitution}% · Emisi bersih memerlukan faktor energi & transpor`,
      icon: Leaf,
    },
  ];

  return (
    <div
      data-testid="recommendation-stage-content"
      className="space-y-6 min-w-0"
    >
      {/* 1. HERO KEPUTUSAN AKHIR (VERDICT BANNER) */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${highLevelVerdict.bannerTone}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider ${highLevelVerdict.badgeTone}`}
              >
                <VerdictIcon className="w-4 h-4" />
                <span>STATUS KEPUTUSAN: {highLevelVerdict.shortCode}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono text-white/90">
                {highLevelVerdict.label}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono text-white/80">
                Mode:{' '}
                {studyMode === 'demo'
                  ? 'Preset / Simulasi'
                  : 'Input Batch Aktual'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
              Rangkuman Keputusan Evaluasi Tahap 01 – 07
            </h2>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {highLevelVerdict.summary}
            </p>
          </div>

          <div className="bg-black/25 rounded-xl border border-white/15 p-4 shrink-0 space-y-2 min-w-[230px]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/70">
              Identitas Kandidat Aktif
            </div>
            <div className="text-sm font-bold text-white truncate">
              Batch: {characterization.batch || 'Belum Diisi'}
            </div>
            <div className="text-xs text-white/80">
              Substitusi:{' '}
              <strong className="text-white">{mix.substitution}%</strong> · W/B{' '}
              <strong className="text-white">{mix.waterRatio}</strong>
            </div>
            <div className="text-xs text-white/80">
              Target: <strong className="text-white">{sni.className}</strong> (SNI
              03-0691-1996)
            </div>
          </div>
        </div>
      </div>

      {/* 2. RANGKUMAN STATUS 7 GERBANG EVALUASI (STAGE 01 - 07) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
              Jejak Audit Gerbang (Gate-by-Gate Summary)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
              Hasil Evaluasi Berjenjang Tahap 01 hingga Tahap 07
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Klik tahap mana pun untuk memperbaiki inputnya
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sevenGatesSummary.map((gate) => {
            const GateIcon = gate.icon;
            return (
              <div
                key={gate.stageNo}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {gate.stageNo}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {gate.title}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${gate.tone}`}
                    >
                      {gate.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {gate.detail}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <GateIcon className="w-3.5 h-3.5" />
                    <span>Tahap {gate.stageNo}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectStage(gate.stageId)}
                    className="font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Periksa Tahap {gate.stageNo}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ALASAN KEPUTUSAN & DAFTAR DATA YANG HARUS DILENGKAPI BERIKUTNYA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Kiri: Alasan Keputusan (Reasons) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              Dasar Penetapan Status
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
              Alasan Keputusan (Traceable Reasons)
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {decision.reasons.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>

          {decision.warnings && decision.warnings.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Catatan &amp; Peringatan Batas Bukti:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {decision.warnings.map((warn: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Kanan: Daftar Data yang Harus Dilengkapi Berikutnya (Data Gaps & Next Steps) */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-amber-200/80">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
              Tindak Lanjut Wajib (Actionable Next Steps)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
              Daftar Data &amp; Pengujian yang Harus Dilengkapi Berikutnya
            </h3>
          </div>

          {qualification.missing.length > 0 && (
            <div className="rounded-xl bg-white border border-amber-200 p-3.5 space-y-2">
              <div className="text-xs font-bold text-amber-900">
                Parameter Karakterisasi Batch yang Belum Diisi (
                {qualification.missing.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {qualification.missing.map((field: string) => (
                  <span
                    key={field}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-mono font-semibold"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
            {study.state.validation.slice(0, 4).map((item, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-200/90"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span className="leading-relaxed">
                  <strong className="font-semibold text-slate-900">
                    {item.parameter}:
                  </strong>{' '}
                  {item.test} ({item.method})
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-2 text-xs text-amber-900/90 leading-relaxed">
            <strong>Catatan Umpan Balik Tertutup (Closed-Loop):</strong> Begitu data uji laboratorium di atas diperoleh dan diinputkan kembali ke GEOCEDS, status keputusan akan diperbarui secara otomatis dari skrining awal menuju tervalidasi.
          </div>
        </div>
      </div>

      {/* 4. RINGKASAN KUANTITATIF NERACA BAHAN & SKRINING FINANSIAL */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Ringkasan Kuantitatif Skenario Aktif (Kapasitas Benchmark{' '}
          {paperBridge.blocksPerDay.toLocaleString('id-ID')} Blok/Hari)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="text-slate-500">Kebutuhan Residu Harian</div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
              {paperBridge.residueRequiredPerDayT.toFixed(2)} ton/hari
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Per blok: {(paperBridge.residuePerBlockKg * 1000).toFixed(1)} g residu
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="text-slate-500">Utilisasi Kapasitas Olah</div>
            <div className="text-base font-extrabold text-emerald-700 font-mono mt-1">
              {paperBridge.capacityUtilizationPct.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Dari kapasitas {paperBridge.residueCapacityTPerDay} ton/hari
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="text-slate-500">
              HPP Benchmark ({paperScenarioName})
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
              {formatIdr(paperScenario.productionCostPerBlock)}/blok
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Harga jual: {formatIdr(paperScenario.sellingPricePerBlock)}/blok
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3.5">
            <div className="text-slate-500">Estimasi Payback CAPEX</div>
            <div className="text-base font-extrabold text-emerald-700 font-mono mt-1">
              ~{paperScenario.paybackMonths.toFixed(1)} Bulan
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              CAPEX peralatan Rp 276 Juta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
