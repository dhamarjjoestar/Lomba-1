import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Info,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import SelectField from "../../components/common/SelectField";
import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import NumberField from "../../components/ui/NumberField";
import RangeField from "../../components/ui/RangeField";

import type { MixControls, StudyResult } from "../../engine/study";
import { DEMO_BATCH_INPUTS } from "../../engine/study";

type ParticleMaterial = "residue" | "cement" | "aggregate" | "binder";

type Particle = {
  id: number;
  material: ParticleMaterial;
  x: number;
  y: number;
  z: number;
  size: number;
};

export default function FormulationPage({
  values,
  setValues,
  next,
  back,
  study,
}: {
  values: MixControls;
  setValues: (values: MixControls) => void;
  next: () => void;
  back: () => void;
  study: StudyResult;
}) {
  const [labelsOn, setLabelsOn] = useState(true);
  const [sectionOn, setSectionOn] = useState(true);
  const [rotation, setRotation] = useState({ x: 14, y: -24 });
  const [zoom, setZoom] = useState(1);

  const update =
    <K extends keyof MixControls>(key: K) =>
    (value: MixControls[K]) =>
      setValues({ ...values, [key]: value });

  const mass = study.state.massBalance;

  // The formulation uses two different bases on purpose:
  // 1) Binder basis = 100% initial cement mass, split into actual cement + residue.
  // 2) Aggregate is a separate batch-mass component and must not be forced into the binder percentage.
  const composition = useMemo(() => {
    const substitution = Math.max(0, Math.min(30, values.substitution));
    const cementInitialKg = DEMO_BATCH_INPUTS.cementKg;
    const residueKg = cementInitialKg * (substitution / 100);
    const cementFinalKg = cementInitialKg - residueKg;
    const aggregateKg = DEMO_BATCH_INPUTS.aggregateKg;
    const solidTotalKg = cementFinalKg + residueKg + aggregateKg;

    return {
      substitution,
      binder: 100,
      cement: 100 - substitution,
      residue: substitution,
      cementFinalKg,
      residueKg,
      aggregateKg,
      aggregateRatio: aggregateKg / cementInitialKg,
      aggregateSolidPct: (aggregateKg / solidTotalKg) * 100,
      cementSolidPct: (cementFinalKg / solidTotalKg) * 100,
      residueSolidPct: (residueKg / solidTotalKg) * 100,
    };
  }, [values.substitution]);

  const particles = useMemo<Particle[]>(() => {
    const total = 52;
    const weights: Array<[ParticleMaterial, number]> = [
      ["residue", Math.max(0.5, composition.residueKg)],
      ["cement", Math.max(0.5, composition.cementFinalKg)],
      ["aggregate", Math.max(1, composition.aggregateKg)],
      ["binder", Math.max(4, values.waterRatio * 8)],
    ];

    const weightSum = weights.reduce((sum, [, weight]) => sum + weight, 0);
    let seed = 472917;

    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const size: Record<ParticleMaterial, number> = {
      residue: 5.6,
      cement: 4.4,
      aggregate: 7.2,
      binder: 3.8,
    };

    const output: Particle[] = [];
    let id = 0;

    for (const [material, weight] of weights) {
      const count = Math.max(3, Math.round((weight / weightSum) * total));

      for (let i = 0; i < count; i += 1) {
        output.push({
          id: id++,
          material,
          x: 10 + random() * 80,
          y: 10 + random() * 76,
          z: -28 + random() * 56,
          size: size[material] * (0.88 + random() * 0.34),
        });
      }
    }

    return output;
  }, [composition, values.waterRatio]);

  const volumeCm3 =
    (values.blockLengthMm * values.blockWidthMm * values.blockThicknessMm) /
    1000;

  const zoomIn = () =>
    setZoom((current) =>
      Math.min(1.4, Number((current + 0.08).toFixed(2))),
    );

  const zoomOut = () =>
    setZoom((current) =>
      Math.max(0.75, Number((current - 0.08).toFixed(2))),
    );

  const resetView = () => {
    setRotation({ x: 12, y: -18 });
    setZoom(1);
  };

  return (
    <div className="reveal candidate-formulation-page">
      <PageHead
        title="Formulasi kandidat"
        description="%, parameter, geometri, dan neraca massa."
        action={
          <div className="basis-chip">
            <SlidersHorizontal size={14} />
            BERDASARKAN MASSA SEMEN
          </div>
        }
      />

      <div className="candidate-studio">
        <aside className="candidate-control-column">
          <Panel className="candidate-control-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">01 · INPUT KANDIDAT</span>
                <h3>%</h3>
              </div>
              <StatusBadge status="ASSUMPTION" />
            </div>

            <div className="candidate-composition-card">
  <div className="candidate-composition-head">
    <div>
      <span className="eyebrow">KOMPOSISI KANDIDAT</span>
      <strong>Visualisasi relatif</strong>
    </div>

    <div className="composition-total">
      <small>VIEW</small>
      <b>100%</b>
    </div>
  </div>

  <div className="composition-highlight">
    <div className="composition-highlight-icon">
      ●
    </div>

    <div>
      <span>SUBSTITUSI RESIDU</span>
      <strong>{composition.residue}%</strong>
      <p>terhadap massa semen</p>
    </div>
  </div>

  <div className="composition-list">

    <div className="composition-item">
      <div className="composition-item-top">
        <span>
          <i className="composition-dot residue-dot" />
          Residu silika geothermal
        </span>

        <strong>{values.substitution}%</strong>
      </div>

      <div className="composition-track">
        <span
          className="composition-fill residue-fill"
          style={{
            width: `${composition.residue}%`,
          }}
        />
      </div>

      
    </div>


    <div className="composition-item">
      <div className="composition-item-top">
        <span>
          <i className="composition-dot cement-dot" />
          Semen Portland
        </span>

        <strong>{composition.cement}%</strong>
      </div>

      <div className="composition-track">
        <span
          className="composition-fill cement-fill"
          style={{ width: `${composition.cement}%` }}
        />
      </div>

    </div>


    <div className="composition-item">
      <div className="composition-item-top">
        <span>
          <i className="composition-dot aggregate-dot" />
          Agregat / pasir
        </span>

        <strong>{composition.aggregateRatio.toFixed(1)}×</strong>
      </div>

      <div className="composition-track">
        <span
          className="composition-fill aggregate-fill"
          style={{ width: `${Math.min(100, composition.aggregateRatio * 10)}%` }}
        />
      </div>

      <small>{composition.aggregateKg.toFixed(0)} kg</small>
    </div>

  </div>

  <div className="composition-warning">
    <Info size={14} />

    <p>Representasi visual · bukan mix design final.</p>
  </div>
</div>
          </Panel>
        </aside>

        <section className="candidate-model-panel">
          <div className="candidate-model-toolbar">
            <div>
              <span className="eyebrow">02 · CANDIDATE MODEL</span>
              <strong>Model kandidat</strong>
            </div>

            <div className="candidate-model-toolbar-actions">
              <button
                type="button"
                className={`candidate-toggle ${labelsOn ? "is-on" : ""}`}
                onClick={() => setLabelsOn((current) => !current)}
              >
                Label
              </button>

              <button
                type="button"
                className={`candidate-toggle ${sectionOn ? "is-on" : ""}`}
                onClick={() => setSectionOn((current) => !current)}
              >
                Penampang
              </button>
            </div>
          </div>

          <div
            className="candidate-scene"
            onWheel={(event) => {
              event.preventDefault();
              event.deltaY < 0 ? zoomIn() : zoomOut();
            }}
            onMouseMove={(event) => {
              if ((event.buttons & 1) !== 1) return;

              const rect = event.currentTarget.getBoundingClientRect();
              const x =
                ((event.clientY - rect.top) / rect.height - 0.5) * -24;
              const y =
                ((event.clientX - rect.left) / rect.width - 0.5) * 34;

              setRotation({
                x: 14 + x,
                y: -24 + y,
              });
            }}
          >
            <div className="candidate-scene-grid" />
            <div className="candidate-ground" />
            <div className="candidate-block-shadow" />

            <div className="candidate-block-anchor">
              <div
                className="candidate-block-wrap"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                }}
              >
                <div className="candidate-block-3d">
                  <div className="candidate-face candidate-back" />
                  <div className="candidate-face candidate-left" />
                  <div className="candidate-face candidate-bottom" />
                  <div className="candidate-face candidate-top" />
                  <div className="candidate-face candidate-right" />

                  <div className="candidate-particles">
                    {particles.map((particle) => (
                      <span
                        key={particle.id}
                        className={`candidate-particle ${particle.material}`}
                        style={{
                          left: `${particle.x}%`,
                          top: `${particle.y}%`,
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          transform: `translateZ(${particle.z}px)`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="candidate-face candidate-front" />

                  {sectionOn && <div className="candidate-section-plane" />}
                </div>
              </div>
            </div>

            {labelsOn && (
              <>
                <div className="candidate-label-callout">
                  <span />
                  Partikel / fase
                </div>

                <div className="candidate-model-dimensions">
                  <span>MODEL SPACE</span>
                  <strong>
                    {values.blockLengthMm} × {values.blockWidthMm} ×{" "}
                    {values.blockThicknessMm} mm
                  </strong>
                </div>
              </>
            )}

            <div className="candidate-scene-disclaimer">
              Visual demo · bukan SEM
            </div>
          </div>

          <div className="candidate-model-footer">
            <div className="candidate-legend">
              <strong>Fase</strong>

              <span>
                <i className="candidate-dot residue-dot" />
                Residu {composition.residue}%
              </span>

              <span>
                <i className="candidate-dot cement-dot" />
                Semen {composition.cement}%
              </span>

              <span>
                <i className="candidate-dot aggregate-dot" />
                Agregat {composition.aggregateRatio.toFixed(1)}×
              </span>

              <span>
                <i className="candidate-dot binder-dot" />
                Binder
              </span>
            </div>

            <div className="candidate-view-tools">
              <button
                type="button"
                onClick={resetView}
                aria-label="Reset view"
              >
                <RotateCcw size={13} />
              </button>

              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
              >
                −
              </button>

              <span>{Math.round(zoom * 100)}%</span>

              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <div className="candidate-parameters-row">
          <Panel className="candidate-parameters-panel">
            <div className="candidate-parameters-head">
              <div>
                <span className="eyebrow">03 · CANDIDATE PARAMETERS</span>
                <h3>Parameter kandidat</h3>
                <p>Kontrol formulasi aktif.</p>
              </div>
              <div className="candidate-parameter-badge">LIVE INPUT</div>
            </div>

            <div className="candidate-parameter-section">
              <div className="candidate-section-label">KOMPOSISI &amp; PARTIKEL</div>

              <div className="candidate-parameter-grid candidate-parameter-grid--top">
                <RangeField
                  label="Substitusi residu silika"
                  value={values.substitution}
                  min={0}
                  max={30}
                  step={1}
                  suffix="%"
                  onChange={update("substitution")}
                  hint="% dari massa semen"
                  testId="slider-residu"
                />

                <RangeField
                  label="Target ukuran partikel"
                  value={values.particleSize}
                  min={50}
                  max={300}
                  step={5}
                  suffix=" μm"
                  onChange={update("particleSize")}
                  hint="Target partikel"
                  testId="slider-particle-size"
                />

                <RangeField
                  label="Rasio air / pengikat"
                  value={values.waterRatio}
                  min={0.35}
                  max={0.8}
                  step={0.01}
                  suffix=""
                  onChange={update("waterRatio")}
                  hint="Air / binder"
                  testId="slider-water-binder"
                />

                <SelectField
                  label="Kelas paving target"
                  value={values.targetClass}
                  options={["A", "B", "C", "D"]}
                  onChange={(value) =>
                    update("targetClass")(value as MixControls["targetClass"])
                  }
                  hint="Perlu verifikasi"
                  testId="select-target-class"
                />
              </div>
            </div>

            <div className="candidate-parameter-section candidate-parameter-section--geometry">
              <div className="candidate-section-label">GEOMETRI</div>

              <div className="candidate-dimension-grid">
                <NumberField
                  label="Panjang"
                  value={values.blockLengthMm}
                  min={50}
                  max={500}
                  step={1}
                  suffix="mm"
                  onChange={update("blockLengthMm")}
                  hint="200"
                  testId="input-block-length"
                />

                <NumberField
                  label="Lebar"
                  value={values.blockWidthMm}
                  min={50}
                  max={300}
                  step={1}
                  suffix="mm"
                  onChange={update("blockWidthMm")}
                  hint="100"
                  testId="input-block-width"
                />

                <NumberField
                  label="Tebal"
                  value={values.blockThicknessMm}
                  min={20}
                  max={150}
                  step={1}
                  suffix="mm"
                  onChange={update("blockThicknessMm")}
                  hint="60"
                  testId="input-block-thickness"
                />

                
              </div>
            </div>
          </Panel>
        </div>

        <aside className="candidate-summary-column">
          <div className="candidate-summary-hero">
            <div className="candidate-summary-hero-top">
              <span>LIVE CANDIDATE</span>
              <strong>F-03</strong>
            </div>

            <h3>Paving block</h3>
            <p>Kelas {values.targetClass} · aktif</p>
          </div>

          <Panel className="candidate-summary-panel">
            <div className="candidate-summary-head">
              <strong>CANDIDATE READOUT</strong>
            </div>

            <div className="candidate-summary-row">
              <span>Residu</span>
              <strong>{values.substitution}%</strong>
            </div>

            <div className="candidate-summary-row">
              <span>Binder split</span>
              <strong>{composition.cement}% semen · {composition.residue}% residu</strong>
            </div>

            <div className="candidate-summary-row">
              <span>Agregat</span>
              <strong>{composition.aggregateKg.toFixed(0)} kg · {composition.aggregateRatio.toFixed(1)}×</strong>
            </div>

            <div className="candidate-summary-row">
              <span>Partikel</span>
              <strong>{values.particleSize} μm</strong>
            </div>

            <div className="candidate-summary-row">
              <span>W/B</span>
              <strong>{values.waterRatio.toFixed(2)}</strong>
            </div>

            <div className="candidate-summary-row">
              <span>Dimensi</span>
              <strong>
                {values.blockLengthMm / 10} × {values.blockWidthMm / 10} ×{" "}
                {values.blockThicknessMm / 10} cm
              </strong>
            </div>

            <div className="candidate-summary-metric">
              <span>VOLUME BLOCK</span>
              <strong>
                {volumeCm3.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                })} cm³
              </strong>
            </div>
          </Panel>

          <Panel className="candidate-composition-block-panel">
            <div className="candidate-summary-head">
              <strong>KOMPOSISI / BLOCK</strong>
            </div>

            <div className="candidate-block-composition-table-wrap">
              <table className="candidate-block-composition-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>kg / block</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Semen", "cement"],
                      ["Agregat / pasir", "aggregate"],
                      ["Residu silika", "residue"],
                      ["Air", "water"],
                      ["Admixture", "admixture"],
                    ] as const
                  ).map(([label, key]) => {
                    const blockMass = mass.massPerBlock?.[key] ?? null;
                    const batchMass = mass.components[key] ?? null;
                    const totalBatchMass = mass.totalBatchKg ?? null;

                    const percentage =
                      totalBatchMass !== null &&
                      batchMass !== null &&
                      totalBatchMass > 0
                        ? (batchMass / totalBatchMass) * 100
                        : null;

                    return (
                      <tr key={key}>
                        <td>{label}</td>
                        <td>
                          {blockMass == null
                            ? "DATA DIPERLUKAN"
                            : `${blockMass.toFixed(3)} kg`}
                        </td>
                        <td>
                          {percentage == null
                            ? "—"
                            : `${percentage.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="composition-block-total">
                    <td>Total</td>
                    <td>
                      {mass.blockMassKg == null
                        ? "DATA DIPERLUKAN"
                        : `${mass.blockMassKg.toFixed(3)} kg`}
                    </td>
                    <td>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="candidate-block-composition-note">
              % diturunkan dari neraca massa kandidat aktif. Massa per
              block memerlukan densitas dan geometri yang tersedia.
            </div>
          </Panel>

          <div className="candidate-engine-card">
            <div className="candidate-summary-head">
              <Check size={14} />
              <strong>MASS BALANCE</strong>
            </div>

            <div className="candidate-engine-row">
              <span>Semen diganti</span>
              <strong>
                {mass.cementReplacedKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.cementReplacedKg.toFixed(2)} kg`}
              </strong>
            </div>

            <div className="candidate-engine-row">
              <span>Residu</span>
              <strong>
                {mass.residueKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.residueKg.toFixed(2)} kg`}
              </strong>
            </div>

            <div className="candidate-engine-row">
              <span>Total batch</span>
              <strong>
                {mass.totalBatchKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.totalBatchKg.toFixed(2)} kg`}
              </strong>
            </div>

            <StatusBadge status={mass.status} />
          </div>

          <div className="candidate-summary-note">
            <Info size={13} />
            <span>
              Parameter aktif memperbarui kandidat.
            </span>
          </div>
        </aside>
      </div>

      <div className="candidate-mass-panel">
        <Panel className="neraca-panel">
          <div className="neraca-header">
            <div>
              <p className="eyebrow eyebrow-light">03 · MASS BALANCE</p>
              <h3>Mass balance</h3>
            </div>

            <StatusBadge status={mass.status} />
          </div>

          <div className="neraca-meta">
            <div>
              <span>Semen batch</span>
              <strong>{DEMO_BATCH_INPUTS.cementKg} kg</strong>
            </div>

            <div>
              <span>Agregat batch</span>
              <strong>{composition.aggregateKg.toFixed(0)} kg</strong>
            </div>

            <div>
              <span>Air batch</span>
              <strong>
                {(DEMO_BATCH_INPUTS.cementKg * values.waterRatio).toFixed(1)} kg
              </strong>
            </div>

            <div>
              <span>Target class</span>
              <strong>{values.targetClass}</strong>
            </div>
          </div>

          <div className="candidate-mass-grid">
            <div className="candidate-mass-card">
              <span>RESIDU DITAMBAHKAN</span>
              <strong>
                {mass.residueKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.residueKg.toFixed(2)} kg`}
              </strong>
              <small>
                {mass.residueKg == null ? "Perlu data input" : "Calculated"}
              </small>
            </div>

            <div className="candidate-mass-card">
              <span>SEMEN AKTUAL</span>
              <strong>
                {mass.cementFinalKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.cementFinalKg.toFixed(2)} kg`}
              </strong>
              <small>{composition.cement}% dari basis semen awal</small>
            </div>

            <div className="candidate-mass-card">
              <span>SEMEN DIHINDARI</span>
              <strong>
                {mass.cementReplacedKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.cementReplacedKg.toFixed(2)} kg`}
              </strong>
              <small>
                {mass.cementReplacedKg == null ? "Perlu data input" : "Calculated"}
              </small>
            </div>

            <div className="candidate-mass-card">
              <span>TOTAL MASSA BATCH</span>
              <strong>
                {mass.totalBatchKg == null
                  ? "DATA DIPERLUKAN"
                  : `${mass.totalBatchKg.toFixed(2)} kg`}
              </strong>
              <small>Hasil engine</small>
            </div>
          </div>

          <div className="neraca-foot">
            <span>
              <Check size={14} />
              {mass.status === "CALCULATED"
                ? "Neraca massa terhitung."
                : "Data tambahan diperlukan."}
            </span>

            <button
              data-testid="button-apply-formulation"
              className="button button-gold"
              onClick={next}
            >
              Analisis kandidat <Play size={14} />
            </button>
          </div>
        </Panel>
      </div>

      <div className="page-actions">
        <button
          data-testid="button-back-formulation"
          className="text-button"
          onClick={back}
        >
          <ArrowLeft size={15} /> Kembali
        </button>

        <div className="candidate-page-status">
          <span />
          Kandidat aktif
        </div>
      </div>
    </div>
  );
}
