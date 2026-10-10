import {
  ArrowLeft,
  ArrowRight,
  Info,
} from "lucide-react";

import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import DoePlanCard from "../../components/science/DoePlanCard";

import type {
  BatchProductionInputs,
  MixControls,
  StudyResult,
} from "../../engine/study";

const ITERATION_STEP = 2;
const MAX_SUBSTITUTION = 30;
const ASSUMED_COMPACTED_DENSITY_KG_M3 = 2300;

function formatKg(value: number) {
  return `${value.toFixed(1)} kg`;
}

function clampSubstitution(value: number) {
  return Math.max(0, Math.min(MAX_SUBSTITUTION, value));
}

function parseNullableNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function SimulationPage({
  study,
  mix,
  batchInputs,
  setBatchInputs,
  studyMode,
  next,
  back,
}: {
  study: StudyResult;
  mix: MixControls;
  batchInputs: BatchProductionInputs;
  setBatchInputs: (
    value:
      | BatchProductionInputs
      | ((current: BatchProductionInputs) => BatchProductionInputs),
  ) => void;
  studyMode: "demo" | "actual";
  next: () => void;
  back: () => void;
}) {
  const { state } = study;
  const tea = state.tea;
  const mass = state.massBalance;
  const environment = state.environment;
  const literatureData = study.literaturePoints;

  const currentSubstitution = clampSubstitution(mix.substitution);

  const actualBatchInputs = {
    cementKg: batchInputs.cementKg,
    aggregateKg: batchInputs.aggregateKg,
    waterKg:
      batchInputs.waterKg ??
      (batchInputs.cementKg != null
        ? batchInputs.cementKg * mix.waterRatio
        : null),
    admixtureKg: batchInputs.admixtureKg ?? 0,
    batchBlocks: batchInputs.batchBlocks,
    batchesPerDay: batchInputs.batchesPerDay,
    densityKgM3: batchInputs.densityKgM3,
  };

  const batchWaterKg =
    studyMode === "demo"
      ? mass.components.water ?? 0
      : actualBatchInputs.waterKg ?? 0;

  const batchCementKg =
    studyMode === "demo"
      ? Math.max(
          0,
          (mass.components.cement ?? 0) + (mass.cementReplacedKg ?? 0),
        )
      : actualBatchInputs.cementKg ?? 0;

  const batchAggregateKg =
    studyMode === "demo"
      ? mass.components.aggregate ?? 0
      : actualBatchInputs.aggregateKg ?? 0;

  const batchAdmixtureKg =
    studyMode === "demo" ? 0 : actualBatchInputs.admixtureKg ?? 0;

  const batchTotalKg =
    studyMode === "demo"
      ? mass.totalBatchKg ?? 0
      : batchCementKg +
        batchAggregateKg +
        batchWaterKg +
        batchAdmixtureKg;

  const effectiveDensity =
    studyMode === "demo"
      ? ASSUMED_COMPACTED_DENSITY_KG_M3
      : actualBatchInputs.densityKgM3 ?? ASSUMED_COMPACTED_DENSITY_KG_M3;

  const blockVolumeM3 =
    (mix.blockLengthMm * mix.blockWidthMm * mix.blockThicknessMm) /
    1_000_000_000;

  const estimatedBlockMassKg = effectiveDensity * blockVolumeM3;

  const estimatedYield =
    estimatedBlockMassKg > 0 && batchTotalKg > 0
      ? Math.floor(batchTotalKg / estimatedBlockMassKg)
      : 0;

  const referenceCementKg = studyMode === "demo" ? 50 : actualBatchInputs.cementKg;
  const referenceAggregateKg =
    studyMode === "demo" ? 300 : actualBatchInputs.aggregateKg;

  const referenceWaterKg =
    studyMode === "demo"
      ? (referenceCementKg ?? 0) * mix.waterRatio
      : actualBatchInputs.waterKg ??
        (actualBatchInputs.cementKg != null
          ? actualBatchInputs.cementKg * mix.waterRatio
          : null);

  const iterationRows = Array.from(
    { length: MAX_SUBSTITUTION / ITERATION_STEP + 1 },
    (_, index) => {
      const substitution = index * ITERATION_STEP;
      const canCalculate =
        referenceCementKg != null &&
        referenceAggregateKg != null &&
        referenceWaterKg != null;

      if (!canCalculate) {
        return {
          id: `C-${String(substitution).padStart(2, "0")}`,
          substitution,
          cementKg: 0,
          residueKg: 0,
          aggregateKg: referenceAggregateKg ?? 0,
          waterKg: referenceWaterKg ?? 0,
          totalBatchKg: 0,
          yieldCount: 0,
          hasData: false,
        };
      }

      const residueKg = referenceCementKg * (substitution / 100);
      const cementKg = referenceCementKg - residueKg;
      const totalBatchKg =
        cementKg + residueKg + referenceAggregateKg + referenceWaterKg;

      const yieldCount =
        estimatedBlockMassKg > 0
          ? Math.floor(totalBatchKg / estimatedBlockMassKg)
          : 0;

      return {
        id: `C-${String(substitution).padStart(2, "0")}`,
        substitution,
        cementKg,
        residueKg,
        aggregateKg: referenceAggregateKg,
        waterKg: referenceWaterKg,
        totalBatchKg,
        yieldCount,
        hasData: true,
      };
    },
  );

  const composition = [
    {
      name: studyMode === "actual" ? "Semen aktual" : "Semen kandidat",
      value: Math.max(0, mass.components.cement ?? 0),
      className: "cement",
    },
    {
      name: "Residu",
      value: mass.residueKg ?? 0,
      className: "residue",
    },
    {
      name: "Agregat",
      value: batchAggregateKg,
      className: "aggregate",
    },
    {
      name: "Air",
      value: batchWaterKg,
      className: "water",
    },
    ...(batchAdmixtureKg > 0
      ? [
          {
            name: "Admixture",
            value: batchAdmixtureKg,
            className: "admixture",
          },
        ]
      : []),
  ];

  const perBlockYield = estimatedYield > 0 ? estimatedYield : null;

  const perBlockComposition = [
    {
      name: "Semen",
      value:
        perBlockYield != null
          ? (mass.components.cement ?? 0) / perBlockYield
          : null,
    },
    {
      name: "Residu",
      value:
        perBlockYield != null
          ? (mass.residueKg ?? 0) / perBlockYield
          : null,
    },
    {
      name: "Agregat",
      value:
        perBlockYield != null
          ? (mass.components.aggregate ?? 0) / perBlockYield
          : null,
    },
    {
      name: "Air",
      value:
        perBlockYield != null
          ? (mass.components.water ?? 0) / perBlockYield
          : null,
    },
    ...(batchAdmixtureKg > 0
      ? [
          {
            name: "Admixture",
            value:
              perBlockYield != null
                ? batchAdmixtureKg / perBlockYield
                : null,
          },
        ]
      : []),
    {
      name: "Total",
      value:
        perBlockYield != null && mass.totalBatchKg != null
          ? mass.totalBatchKg / perBlockYield
          : null,
    },
  ];

  const candidatePoint = literatureData.find(
    (point) => point.replacement === mix.substitution,
  );

  const actualBatchComplete =
    studyMode === "actual" &&
    actualBatchInputs.cementKg != null &&
    actualBatchInputs.aggregateKg != null &&
    actualBatchInputs.batchBlocks != null &&
    actualBatchInputs.densityKgM3 != null;

  const hasAvoidedEmissions = environment.avoided != null;

  return (
    <div className="reveal simulation-premium">
      <PageHead
        title="Analisis Kandidat"
        description="Gunakan iterasi substitusi sebagai screening awal untuk melihat perubahan massa dan estimasi yield. Analisis performa tetap membutuhkan evidence dan pengujian laboratorium."
        action={
          <StatusBadge
            status={
              studyMode === "actual"
                ? actualBatchComplete
                  ? "DATA AKTUAL"
                  : "DATA AKTUAL BELUM LENGKAP"
                : "ESTIMASI PENYARINGAN"
            }
          />
        }
      />

      {studyMode === "actual" && (
        <section className="simulation-formula-card">
          <div className="simulation-formula-head">
            <div>
              <span className="eyebrow">INPUT BATCH AKTUAL</span>
              <h3>Data produksi yang digunakan</h3>
            </div>
            <span className="simulation-formula-status">
              AKTUAL / USER INPUT
            </span>
          </div>

          <div className="simulation-formula-grid">
            {[
              ["cementKg", "Semen (kg)", "0.01"],
              ["aggregateKg", "Agregat (kg)", "0.01"],
              ["waterKg", "Air aktual (kg)", "0.01"],
              ["admixtureKg", "Admixture (kg)", "0.01"],
              ["batchBlocks", "Block / batch", "1"],
              ["batchesPerDay", "Batch / hari", "1"],
              ["densityKgM3", "Densitas aktual (kg/m³)", "1"],
            ].map(([key, label, step]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  min="0"
                  step={step}
                  value={batchInputs[key as keyof BatchProductionInputs] ?? ""}
                  onChange={(event) =>
                    setBatchInputs((current) => ({
                      ...current,
                      [key]: parseNullableNumber(event.target.value),
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="simulation-impact-note">
            <Info size={15} />
            <span>
              Nilai yang belum tersedia tetap dianggap sebagai data gap. Sistem
              tidak menggantinya dengan batch demo.
            </span>
          </div>
        </section>
      )}

      <section className="simulation-formula-card">
        <div className="simulation-formula-head">
          <div>
            <span className="eyebrow">FORMULASI SAAT INI</span>
            <h3>Resep kandidat paving block</h3>
          </div>
          <span className="simulation-formula-status">ASUMSI KANDIDAT</span>
        </div>

        <div className="simulation-formula-grid">
          <div className="simulation-formula-main">
            <strong>{mix.substitution}%</strong>
            <span>substitusi residu</span>
          </div>
          <div>
            <span>Ukuran partikel</span>
            <strong>{mix.particleSize} μm</strong>
          </div>
          <div>
            <span>Rasio air / pengikat</span>
            <strong>{mix.waterRatio.toFixed(2)}</strong>
          </div>
          <div>
            <span>Kelas paving</span>
            <strong>{mix.targetClass}</strong>
          </div>
          <div>
            <span>Dimensi</span>
            <strong>
              {mix.blockLengthMm} × {mix.blockWidthMm} × {mix.blockThicknessMm} mm
            </strong>
          </div>
        </div>
      </section>

      <section className="simulation-impact-card">
        <div className="simulation-section-head">
          <div>
            <span className="eyebrow">DAMPAK FORMULASI</span>
            <h3>Apa yang berubah?</h3>
          </div>
          <span className="simulation-section-caption">
            dari input → hasil hitungan
          </span>
        </div>

        <div className="simulation-impact-flow">
          <div className="impact-step">
            <span className="impact-step-number">01</span>
            <strong>{mix.substitution}%</strong>
            <small>substitusi</small>
          </div>
          <div className="impact-arrow"><ArrowRight size={17} /></div>
          <div className="impact-step">
            <span className="impact-step-number">02</span>
            <strong>
              {mass.cementReplacedKg == null
                ? "—"
                : `${mass.cementReplacedKg.toFixed(2)} kg`}
            </strong>
            <small>semen dihindari</small>
          </div>
          <div className="impact-arrow"><ArrowRight size={17} /></div>
          <div className="impact-step">
            <span className="impact-step-number">03</span>
            <strong>
              {mass.residueKg == null ? "—" : `${mass.residueKg.toFixed(2)} kg`}
            </strong>
            <small>residu masuk</small>
          </div>
          <div className="impact-arrow"><ArrowRight size={17} /></div>
          <div className="impact-step impact-final">
            <span className="impact-step-number">04</span>
            <strong>
              {estimatedBlockMassKg > 0
                ? `${estimatedBlockMassKg.toFixed(2)} kg`
                : "—"}
            </strong>
            <small>estimasi massa / block</small>
          </div>
        </div>

        <div className="simulation-impact-note">
          <Info size={15} />
          <span>
            Estimasi massa/block memakai densitas
            {studyMode === "actual" &&
            actualBatchInputs.densityKgM3 != null
              ? " aktual "
              : " asumsi "}
            {effectiveDensity.toLocaleString("id-ID")} kg/m³. Nilai aktual harus
            dikalibrasi dari hasil pemadatan/laboratorium.
          </span>
        </div>
      </section>

      <div className="simulation-results-grid">
        <Panel className="simulation-result-panel">
          <div className="simulation-section-head">
            <div>
              <span className="eyebrow">NERACA MASSA</span>
              <h3>Komposisi batch kandidat aktif</h3>
            </div>
          </div>

          <div className="simulation-mass-list">
            {composition.map((item) => (
              <div className="simulation-mass-row" key={item.name}>
                <div className="simulation-mass-name">
                  <span className={`simulation-mass-dot ${item.className}`} />
                  <span>{item.name}</span>
                </div>
                <strong>{item.value.toFixed(1)} kg</strong>
              </div>
            ))}
          </div>

          <div className="simulation-total-grid">
            <div className="simulation-total">
              <span>Total batch</span>
              <strong>
                {batchTotalKg <= 0 ? "—" : `${batchTotalKg.toFixed(1)} kg`}
              </strong>
            </div>
            <div className="simulation-total simulation-total-gold">
              <span>Estimasi yield</span>
              <strong>{estimatedYield} block</strong>
            </div>
          </div>

          <div className="simulation-per-block">
            <div className="simulation-section-head">
              <div>
                <span className="eyebrow">SATUAN PRODUK</span>
                <h3>Komposisi per 1 paving block</h3>
              </div>
              <span className="simulation-section-caption">
                massa batch ÷ estimasi yield
              </span>
            </div>

            <div className="simulation-per-block-table-wrap">
              <table className="simulation-per-block-table">
                <thead>
                  <tr>
                    <th>Komponen</th>
                    <th>Massa / paving block</th>
                    <th>Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {perBlockComposition.map((item) => (
                    <tr
                      key={item.name}
                      className={item.name === "Total" ? "is-active" : ""}
                    >
                      <td><strong>{item.name}</strong></td>
                      <td>
                        <strong>
                          {item.value == null
                            ? "DATA REQUIRED"
                            : item.value.toFixed(4)}
                        </strong>
                      </td>
                      <td>kg/block</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="candidate-iteration-note">
              <Info size={14} />
              <span>
                Nilai per paving block merupakan hasil pembagian massa komponen
                batch kandidat dengan estimasi jumlah block. Nilai ini adalah
                hasil screening dan bukan komposisi hasil penimbangan produk
                fisik.
              </span>
            </div>
          </div>
        </Panel>

        <Panel className="simulation-result-panel">
          <div className="simulation-section-head">
            <div>
              <span className="eyebrow">SINYAL LITERATUR</span>
              <h3>Bukti pembanding</h3>
            </div>
            <StatusBadge status="LITERATUR" />
          </div>

          <div className="simulation-literature-highlight">
            <span>SUBSTITUSI KANDIDAT</span>
            <strong>{mix.substitution}%</strong>
            <small>
              {candidatePoint
                ? `${candidatePoint.strength} MPa · 7 hari`
                : "belum memiliki titik literatur langsung"}
            </small>
          </div>

          <div className="simulation-literature-list">
            {literatureData.map((point) => {
              const active = point.replacement === mix.substitution;
              return (
                <div
                  key={point.replacement}
                  className={
                    active
                      ? "simulation-literature-row is-active"
                      : "simulation-literature-row"
                  }
                >
                  <span>{point.replacement}%</span>
                  <strong>{point.strength} MPa</strong>
                  {active && (
                    <span className="simulation-candidate-label">kandidat</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="simulation-literature-note">
            <Info size={14} />
            <span>
              Titik literatur digunakan sebagai pembanding langsung. Sistem tidak
              menginterpolasikan atau memprediksi kuat tekan di antara titik
              evidence.
            </span>
          </div>
        </Panel>
      </div>

      <section className="candidate-iteration-section">
        <div className="candidate-iteration-head">
          <div>
            <span className="eyebrow">CANDIDATE MATRIX</span>
            <h3>Iterasi substitusi 2%</h3>
            <p>
              Ruang screening dari 0% sampai 30% dengan interval 2%. Substitusi
              residu menggantikan semen 1:1 berdasarkan massa.
              {studyMode === "demo"
                ? " Demo memakai agregat 300 kg sebagai basis referensi."
                : " Pada mode aktual, matriks menggunakan data batch aktual yang tersedia."}
            </p>
          </div>

          <div className="candidate-iteration-summary">
            <span>YIELD SAAT INI</span>
            <strong>{estimatedYield} block</strong>
            <small>
              {mix.blockLengthMm} × {mix.blockWidthMm} × {mix.blockThicknessMm} mm
            </small>
          </div>
        </div>

        <Panel className="candidate-iteration-panel">
          <div className="candidate-iteration-meta">
            <div>
              <span>Basis semen awal</span>
              <strong>
                {referenceCementKg == null ? "DATA REQUIRED" : `${referenceCementKg} kg`}
              </strong>
            </div>
            <div>
              <span>Agregat batch</span>
              <strong>
                {referenceAggregateKg == null
                  ? "DATA REQUIRED"
                  : `${referenceAggregateKg} kg`}
              </strong>
            </div>
            <div>
              <span>W/B</span>
              <strong>{mix.waterRatio.toFixed(2)}</strong>
            </div>
            <div>
              <span>Densitas</span>
              <strong>
                {effectiveDensity.toLocaleString("id-ID")} kg/m³
              </strong>
            </div>
          </div>

          <div className="candidate-iteration-table-wrap">
            <table className="candidate-iteration-table">
              <thead>
                <tr>
                  <th>Kandidat</th>
                  <th>Substitusi</th>
                  <th>Semen</th>
                  <th>Residu</th>
                  <th>Agregat</th>
                  <th>Air</th>
                  <th>Total batch</th>
                  <th>Est. paving</th>
                </tr>
              </thead>
              <tbody>
                {iterationRows.map((row) => {
                  const active = row.substitution === currentSubstitution;
                  return (
                    <tr key={row.id} className={active ? "is-active" : ""}>
                      <td><strong>{row.id}</strong></td>
                      <td><strong>{row.substitution}%</strong></td>
                      <td>{row.hasData ? formatKg(row.cementKg) : "—"}</td>
                      <td>{row.hasData ? formatKg(row.residueKg) : "—"}</td>
                      <td>
                        {referenceAggregateKg == null
                          ? "—"
                          : formatKg(row.aggregateKg)}
                      </td>
                      <td>
                        {referenceWaterKg == null ? "—" : formatKg(row.waterKg)}
                      </td>
                      <td>{row.hasData ? formatKg(row.totalBatchKg) : "—"}</td>
                      <td>
                        <strong>
                          {row.hasData ? `${row.yieldCount} block` : "—"}
                        </strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="candidate-iteration-note">
            <Info size={14} />
            <span>
              Yield adalah screening geometrik berdasarkan massa batch dan asumsi
              densitas. Matriks kandidat tidak menyatakan bahwa kandidat memenuhi
              SNI; kelayakan teknis tetap ditentukan dari pengujian kuat tekan,
              penyerapan air, ketahanan aus, dan parameter relevan lainnya.
            </span>
          </div>
        </Panel>
      </section>

      <section className="simulation-screening">
        <div className="simulation-screening-head">
          <div>
            <span className="eyebrow">SCREENING</span>
            <h3>Bagaimana membaca hasil ini?</h3>
          </div>
        </div>

        <div className="simulation-screening-grid">
          <div className="simulation-screening-card is-technical">
            <span>TEKNIS</span>
            <strong>Validasi diperlukan</strong>
            <p>
              Kuat tekan, penyerapan air, dan ketahanan aus aktual belum tersedia.
            </p>
          </div>

          <div className="simulation-screening-card is-economic">
            <span>EKONOMI</span>
            <strong>
              {tea.status === "CALCULATED" ? "Estimasi" : "Data diperlukan"}
            </strong>
            <p>
              Biaya dan energi masih merupakan hasil screening, bukan biaya
              produksi aktual.
            </p>
          </div>

          <div className="simulation-screening-card is-environment">
            <span>LINGKUNGAN</span>
            <strong>
              {hasAvoidedEmissions
                ? `${environment.avoided!.toFixed(2)} kgCO₂e`
                : "—"}
            </strong>
            <p>
              Menunjukkan potensi avoided emissions terkait substitusi semen.
              Net emission reduction belum disimpulkan.
            </p>
          </div>
        </div>
      </section>

      <DoePlanCard plan={study.science.doePlan} />

      <div className="page-actions">
        <button
          data-testid="button-back-simulation"
          className="text-button"
          onClick={back}
        >
          <ArrowLeft size={15} />
          Kembali
        </button>

        <button
          data-testid="button-next-simulation"
          className="button button-dark"
          onClick={next}
        >
          Buka gerbang teknis
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
