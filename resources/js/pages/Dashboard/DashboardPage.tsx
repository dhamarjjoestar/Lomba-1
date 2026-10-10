import {
  ArrowRight,
  Scale,
  Check,
  ClipboardCheck,
  Database,
  Gauge,
  Info,
  Layers3,
  Leaf,
  Mountain,
  Pencil,
  TestTube2,
} from "lucide-react";
import {
  Cell,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import Metric from "../../components/common/Metric";
import Panel from "../../components/ui/Panel";
import StatusBadge from "../../components/ui/StatusBadge";
import type { Stage } from "../../app/types/stage";
import type { MixControls, StudyResult } from "../../engine/study";
import { formatIdr } from "../../engine/study";
import {
  calcPaperResidueBridge,
  getPaperEconomicMeta,
} from "../../engine/lib/paperTeaEngine";

export default function DashboardPage({
  study,
  mix,
  setStage,
}: {
  study: StudyResult;
  mix: MixControls;
  setStage: (stage: Stage) => void;
}) {
  const { state } = study;
  const mass = state.massBalance;
  const tea = state.tea;
  const environment = state.environment;

  const volumeCm3 = mass.volumeM3 == null ? null : mass.volumeM3 * 1_000_000;
  const areaPerBlock =
    mass.blocksPerM2 && mass.blocksPerM2 > 0 ? 1 / mass.blocksPerM2 : 0.02;

  const paperProductionPerDay =
    getPaperEconomicMeta()?.production?.finished_block_production_per_day ??
    5000;

  const scenarioBlocksPerDay = paperProductionPerDay;
  const dailyArea = scenarioBlocksPerDay * areaPerBlock;

  const bridge = calcPaperResidueBridge({
    substitutionPct: mix.substitution,
    massPerBlockKg: mass.blockMassKg ?? undefined,
    blocksPerDay: scenarioBlocksPerDay,
  });

  const baseResiduePerDay = bridge.residueRequiredPerDayT;

  const totalSolid =
    (mass.components.cement ?? 0) +
    (mass.components.residue ?? 0) +
    (mass.components.aggregate ?? 0);

  const dimensions = `${mix.blockLengthMm} × ${mix.blockWidthMm} × ${mix.blockThicknessMm}`;

  const composition = [
    { name: "Semen", value: mass.components.cement ?? 0 },
    { name: "Residu silika", value: mass.components.residue ?? 0 },
    { name: "Agregat halus", value: mass.components.aggregate ?? 0 },
    { name: "Air", value: mass.components.water ?? 0 },
  ].filter((item) => item.value > 0);

  const evidenceTechnical = state.sni.details.some(
    (row) => row.actual != null,
  );

  const avoidedEmissions = environment.avoided;
  const hasAvoidedEmissions = avoidedEmissions != null;

  return (
    <div className="reveal dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow eyebrow-gold">
            SUPPORT / dashboard aplikasi & SDGs
          </p>

          <h2>Ringkasan kandidat dalam satu layar.</h2>

          <p className="page-description">
            Pantau konfigurasi aktif, geometri, sinyal teknis, pemanfaatan
            residu, dan economic screening dengan status evidence tetap
            terlihat.
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            className="dashboard-chip active"
            onClick={() => setStage("formulation")}
          >
            <Pencil size={14} /> Ubah formulasi
          </button>

          <button
            className="dashboard-chip"
            onClick={() => setStage("economics")}
          >
            <Database size={14} /> Ekonomi
          </button>
        </div>
      </div>

      <div className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <div className="dashboard-icon icon-green">
            <Scale size={20} />
          </div>

          <div>
            <span>Produksi harian skenario</span>
            <strong>{scenarioBlocksPerDay.toLocaleString("id-ID")}</strong>
            <small>block/hari · economic screening</small>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="dashboard-icon icon-blue">
            <Layers3 size={20} />
          </div>

          <div>
            <span>Potensi luas penutup</span>
            <strong>
              {dailyArea.toLocaleString("id-ID", {
                maximumFractionDigits: 1,
              })}
            </strong>
            <small>m²/hari · berdasarkan geometri nominal</small>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="dashboard-icon icon-gold">
            <Leaf size={20} />
          </div>

          <div>
            <span>Potensi emisi semen dihindari</span>
            <strong>
              {hasAvoidedEmissions
                ? avoidedEmissions!.toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </strong>

            <small>
              {hasAvoidedEmissions
                ? "kgCO₂e · cement substitution screening"
                : "belum dapat dihitung"}
            </small>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="dashboard-icon icon-sand">
            <Mountain size={20} />
          </div>

          <div>
            <span>Residu terolah / hari</span>
            <strong>
              {bridge.status === "DATA_REQUIRED"
                ? "—"
                : baseResiduePerDay.toLocaleString("id-ID", {
                    maximumFractionDigits: 3,
                  })}
            </strong>

            <small>
              {bridge.status === "OUTSIDE_EVIDENCE_RANGE"
                ? "t/hari · di luar rentang ilustratif"
                : "t/hari · terhubung ke formulasi aktif"}
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-section-head">
        <div>
          <h3>Spesifikasi Material Paving Block</h3>
          <p>
            Parameter aktif yang terhubung ke geometri dan gerbang teknis.
          </p>
        </div>

        <span className="standard-chip">
          <ClipboardCheck size={14} /> SNI 03-0691-1996
        </span>
      </div>

      <Panel className="dashboard-spec-panel">
        <div className="dashboard-gate-strip">
          <div
            className={`dashboard-check ${evidenceTechnical ? "" : "pending"}`}
          >
            {evidenceTechnical ? <Check size={21} /> : <Info size={20} />}
          </div>

          <div>
            <strong>
              {evidenceTechnical
                ? "Bukti teknis tersedia untuk ditinjau"
                : "Pengujian teknis aktual belum tersedia"}
            </strong>

            <span>
              Gerbang teknis adalah penyaringan, bukan sertifikasi.
            </span>
          </div>

          <StatusBadge
            status={evidenceTechnical ? "REPORTED" : "DATA_REQUIRED"}
          />
        </div>

        <div className="dashboard-table">
          <div className="dashboard-table-row dashboard-table-head">
            <span>Parameter</span>
            <span>Nilai</span>
            <span>Satuan</span>
            <span>Status</span>
          </div>

          <div className="dashboard-table-row">
            <span>
              <Gauge size={15} /> Dimensi (P × L × T)
            </span>
            <strong>{dimensions}</strong>
            <span>mm</span>
            <StatusBadge status="SIMULATION_INPUT" />
          </div>

          <div className="dashboard-table-row">
            <span>
              <Scale size={15} /> Volume nominal
            </span>

            <strong>
              {volumeCm3 == null
                ? "DATA DIPERLUKAN"
                : volumeCm3.toLocaleString("id-ID", {
                    maximumFractionDigits: 1,
                  })}
            </strong>

            <span>cm³</span>

            <StatusBadge
              status={volumeCm3 == null ? "DATA_REQUIRED" : "DERIVED"}
            />
          </div>

          <div className="dashboard-table-row">
            <span>
              <Mountain size={15} /> Massa nominal / block
            </span>

            <strong>
              {mass.blockMassKg == null
                ? "DATA DIPERLUKAN"
                : mass.blockMassKg.toFixed(3)}
            </strong>

            <span>kg</span>

            <StatusBadge
              status={
                mass.blockMassKg == null ? "DATA_REQUIRED" : "DERIVED"
              }
            />
          </div>

          <div className="dashboard-table-row">
            <span>
              <Gauge size={15} /> Densitas model
            </span>
            <strong>2.200</strong>
            <span>kg/m³</span>
            <StatusBadge status="ENGINEERING_ESTIMATE" />
          </div>

          <div className="dashboard-table-row">
            <span>
              <TestTube2 size={15} /> Kuat tekan
            </span>
            <strong>DATA DIPERLUKAN</strong>
            <span>MPa</span>
            <StatusBadge status="DATA_REQUIRED" />
          </div>

          <div className="dashboard-table-row">
            <span>
              <Leaf size={15} /> Penyerapan air
            </span>
            <strong>DATA DIPERLUKAN</strong>
            <span>%</span>
            <StatusBadge status="DATA_REQUIRED" />
          </div>
        </div>
      </Panel>

      <div className="dashboard-grid-two">
        <Panel>
          <div className="panel-head">
            <div>
              <h3>Komposisi input per batch (kg)</h3>
              <p>Basis simulasi aktif dari mesin neraca massa.</p>
            </div>

            <StatusBadge status={mass.status} />
          </div>

          <div className="dashboard-input-cards">
            <div>
              <span>SEMEN</span>
              <strong>{(mass.components.cement ?? 0).toFixed(2)}</strong>
              <small>kg</small>
            </div>

            <div>
              <span>RESIDU</span>
              <strong>{(mass.components.residue ?? 0).toFixed(2)}</strong>
              <small>kg</small>
            </div>

            <div>
              <span>AGREGAT</span>
              <strong>{(mass.components.aggregate ?? 0).toFixed(2)}</strong>
              <small>kg</small>
            </div>

            <div>
              <span>AIR</span>
              <strong>{(mass.components.water ?? 0).toFixed(2)}</strong>
              <small>kg</small>
            </div>
          </div>

          <div className="dashboard-composition-row">
            <div className="dashboard-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={composition}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={3}
                  >
                    {composition.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={
                          ["#78a87d", "#b58a36", "#74838a", "#81a7c7"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: number) =>
                      `${Number(value).toFixed(2)} kg`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-composition-legend">
              {composition.map((item, index) => (
                <div key={item.name}>
                  <span
                    className="legend-dot"
                    style={{
                      background:
                        ["#78a87d", "#b58a36", "#74838a", "#81a7c7"][
                          index % 4
                        ],
                    }}
                  />

                  <span>{item.name}</span>
                  <strong>{item.value.toFixed(2)} kg</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-footnote">
            Total padatan: <strong>{totalSolid.toFixed(2)} kg</strong> · W/B
            kandidat: <strong>{mix.waterRatio.toFixed(2)}</strong>
          </div>
        </Panel>

        <Panel className="tint-green">
          <div className="panel-head">
            <div>
              <h3>Geometri & potensi aplikasi</h3>
              <p>Turunan dari dimensi nominal aktif.</p>
            </div>

            <StatusBadge status="DERIVED" />
          </div>

          <div className="dashboard-geometry">
            <div>
              <span>Volume total</span>
              <strong>
                {volumeCm3 == null
                  ? "DATA DIPERLUKAN"
                  : `${volumeCm3.toLocaleString("id-ID", {
                      maximumFractionDigits: 1,
                    })} cm³`}
              </strong>
            </div>

            <div>
              <span>Volume solid</span>
              <strong>
                {volumeCm3 == null
                  ? "DATA DIPERLUKAN"
                  : `${volumeCm3.toLocaleString("id-ID", {
                      maximumFractionDigits: 1,
                    })} cm³`}
              </strong>
            </div>

            <div>
              <span>Volume rongga model</span>
              <strong>0 cm³</strong>
            </div>

            <div>
              <span>Luas per block</span>
              <strong>{areaPerBlock.toFixed(3)} m²</strong>
            </div>

            <div>
              <span>Block per m²</span>
              <strong>
                {mass.blocksPerM2 == null
                  ? "DATA DIPERLUKAN"
                  : mass.blocksPerM2.toFixed(1)}
              </strong>
            </div>

            <div>
              <span>Dimensi</span>
              <strong>{dimensions} mm</strong>
            </div>
          </div>

          <div className="dashboard-mini-callout">
            <Info size={15} />
            <span>
              Model menggunakan balok nominal penuh. Bevel, tekstur, atau
              rongga produk aktual harus diukur sebelum dipakai sebagai basis
              mass/block.
            </span>
          </div>
        </Panel>
      </div>

      <div className="dashboard-infra-panel">
        <Panel className="tint-green">
          <div className="panel-head">
            <div>
              <h3>Potensi infrastruktur harian</h3>
              <p>
                Turunan skenario produksi dan geometri nominal; bukan klaim
                proyek lapangan.
              </p>
            </div>

            <StatusBadge status="SCENARIO" />
          </div>

          <div className="dashboard-infra-grid">
            <div>
              <span>Luas penutup permukaan</span>
              <strong>
                {dailyArea.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                })}{" "}
                m²
              </strong>
            </div>

            <div>
              <span>Potensi luas trotoar</span>
              <strong>
                {dailyArea.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                })}{" "}
                m²
              </strong>
            </div>

            <div>
              <span>Residu yang dimanfaatkan</span>
              <strong>
                {baseResiduePerDay.toLocaleString("id-ID", {
                  maximumFractionDigits: 3,
                })}{" "}
                t/hari
              </strong>
            </div>

            <div>
              <span>Potensi emisi semen dihindari</span>
              <strong>
                {hasAvoidedEmissions
                  ? `${avoidedEmissions!.toFixed(2)} kgCO₂e`
                  : "—"}
              </strong>
            </div>
          </div>
        </Panel>
      </div>

      <div className="dashboard-bottom-grid">
        <Panel>
          <div className="panel-head">
            <div>
              <h3>Ringkasan ekonomi</h3>
              <p>Economic screening awal; bukan TEA penuh.</p>
            </div>

            <StatusBadge status="SCENARIO" />
          </div>

          <div className="dashboard-econ">
            <Metric
              label="Biaya / block"
              value={
                tea.costPerBlock == null
                  ? "DATA DIPERLUKAN"
                  : formatIdr(tea.costPerBlock)
              }
              note="costing batch"
            />

            <Metric
              label="Biaya / m²"
              value={
                tea.costPerM2 == null
                  ? "DATA DIPERLUKAN"
                  : formatIdr(tea.costPerM2)
              }
              note="turunan block/m²"
              tone="gold"
            />

            <Metric
              label="Energi proses"
              value={
                tea.processingEnergyKwh == null
                  ? "DATA DIPERLUKAN"
                  : tea.processingEnergyKwh.toFixed(2)
              }
              unit="kWh"
              note="estimasi"
              tone="green"
            />

            <Metric
              label="Kematangan ekonomi"
              value="PRELIMINARY"
              note="screening awal"
              tone="muted"
            />
          </div>

          <button
            className="text-button"
            onClick={() => setStage("economics")}
          >
            Buka detail ekonomi <ArrowRight size={15} />
          </button>
        </Panel>

        <Panel className="tint-sand">
          <div className="panel-head">
            <div>
              <h3>Kesenjangan data prioritas</h3>
              <p>Item yang perlu divalidasi sebelum keputusan dinaikkan.</p>
            </div>

            <StatusBadge status="DATA_REQUIRED" />
          </div>

          <div className="dashboard-gap-list">
            <div>
              <span>P0</span>
              <p>Fraksi substitusi aktual dari DOE/RSM</p>
            </div>

            <div>
              <span>P0</span>
              <p>CAPEX lini mixer–press–curing</p>
            </div>

            <div>
              <span>P0</span>
              <p>Billing energi, tenaga kerja, maintenance</p>
            </div>

            <div>
              <span>P1</span>
              <p>Berat dan dimensi aktual produk</p>
            </div>
          </div>

          <button
            className="button button-dark"
            onClick={() => setStage("validation")}
          >
            Lihat peta jalan <ArrowRight size={15} />
          </button>
        </Panel>
      </div>

      <div className="dashboard-source-note">
        <Info size={14} />

        <span>
          Catatan: produksi harian, bridge residu, CAPEX/OPEX, dan skenario
          ekonomi berasal dari economic screening awal. Indikator lingkungan
          pada dashboard dibatasi pada potensi avoided emissions dari
          substitusi semen; <strong>net emission reduction tidak ditampilkan</strong>{" "}
          karena inventory belum lengkap.
        </span>
      </div>
    </div>
  );
}
