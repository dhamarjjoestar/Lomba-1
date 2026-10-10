import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  ShieldCheck,
  Table2,
  Workflow,
} from "lucide-react";
import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import type { StudyResult } from "../../engine/study";
import {
  directPavingEvidence,
  literaturePerformance,
  sources,
  validationRoadmap,
} from "../../engine/data/master";

function sourceById(id: string) {
  return sources.find((source) => source.id === id);
}

const methodologySteps = [
  {
    no: "01",
    title: "Identifikasi material",
    copy: "Kunci identitas sumber, asal, kondisi proses, dan konteks material sebelum data digunakan.",
  },
  {
    no: "02",
    title: "Qualification gate",
    copy: "Periksa kimia/mineralogi, fisik, pengotor, kadar air, ukuran partikel, dan kebutuhan karakterisasi.",
  },
  {
    no: "03",
    title: "Formulasi kandidat",
    copy: "Susun replacement level, replacement basis, W/B, ukuran partikel, dan geometri produk.",
  },
  {
    no: "04",
    title: "Evidence mapping",
    copy: "Petakan hasil literatur berdasarkan material, produk, basis substitusi, umur uji, dan transferability.",
  },
  {
    no: "05",
    title: "Technical gate",
    copy: "Bandingkan performa terhadap kebutuhan teknis dan standar; literatur tidak menggantikan validasi.",
  },
  {
    no: "06",
    title: "Economic + environmental",
    copy: "Screening ekonomi dan lingkungan dilakukan sesudah dasar teknis kandidat cukup kuat.",
  },
  {
    no: "07",
    title: "Keputusan & validasi",
    copy: "Hasil menjadi rekomendasi berbatas, lalu dikonfirmasi melalui eksperimen dan loop pembaruan evidence.",
  },
];

const fikroni = literaturePerformance
  .filter(
    (item) =>
      item.source_id === "SRC-017" &&
      item.product_type === "PAVING_BLOCK" &&
      item.compressive_strength_7d_mpa != null,
  )
  .sort((a, b) => (a.replacement_pct ?? 0) - (b.replacement_pct ?? 0));

const lopez = literaturePerformance
  .filter(
    (item) =>
      item.source_id === "SRC-007" &&
      item.compressive_strength_28d_mpa != null,
  )
  .sort((a, b) => (a.replacement_pct ?? 0) - (b.replacement_pct ?? 0));

const maxFikroni = Math.max(
  ...fikroni.map((item) => item.compressive_strength_7d_mpa ?? 0),
  1,
);
const maxLopez = Math.max(
  ...lopez.map((item) => item.compressive_strength_28d_mpa ?? 0),
  1,
);

/**
 * Cross-domain paving durability benchmark.
 *
 * IMPORTANT:
 * These are NOT geothermal-residue results.
 * They are included to demonstrate how SILICA2CON should visualize
 * durability variables before the target geothermal experiment exists.
 *
 * Source:
 * Han, Y., Jia, Z., Yang, X., & Jiang, X. (2026).
 * Graded Utilization of Asphalt Mixing Plant Dust in Alkali-Activated
 * Concrete Paving Blocks: Mechanical Performance and Sustainability Assessment.
 * Coatings, 16(5), 541.
 * DOI: 10.3390/coatings16050541
 */
const durabilityBenchmark = [
  {
    mix: "S-0-0",
    waterAbsorption: 5.3,
    abrasionPit: 29.2,
  },
  {
    mix: "L-10-10",
    waterAbsorption: 4.7,
    abrasionPit: 27.5,
  },
  {
    mix: "B-15-20",
    waterAbsorption: 4.4,
    abrasionPit: 25.8,
  },
  {
    mix: "M-10-20",
    waterAbsorption: 4.1,
    abrasionPit: 24.7,
  },
];

const maxWaterAbsorption = Math.max(
  ...durabilityBenchmark.map((item) => item.waterAbsorption),
  1,
);

const maxAbrasionPit = Math.max(
  ...durabilityBenchmark.map((item) => item.abrasionPit),
  1,
);

function MethodologyPage({
  study,
  next,
  back,
}: {
  study: StudyResult;
  next: () => void;
  back: () => void;
}) {
  const qualification = study.science.materialQualification;
  const direct = directPavingEvidence[0];

  return (
    <div className="reveal methodology-page">
      <PageHead
        title="Metodologi SILICA2CON"
        description="Metodologi SILICA2CON menggabungkan qualification material, formulasi kandidat, pemetaan literatur, technical gate, screening ekonomi-lingkungan, dan validasi eksperimental dalam satu alur keputusan."
      />

      <Panel className="methodology-principle">
        <div className="methodology-principle-icon">
          <Workflow size={19} />
        </div>
        <div>
          <span className="mono-label">METODOLOGI UTAMA</span>
          <strong>Gate first · ranking second</strong>
          <p>
            Angka literatur dipakai untuk membentuk ruang kandidat dan konteks;
            status kelayakan tetap menunggu bukti yang sesuai dengan material dan
            produk yang dituju.
          </p>
        </div>
        <div className="methodology-principle-badges">
          <span>PROVENANCE</span>
          <span>CONTEXT</span>
          <span>VALIDATION</span>
        </div>
      </Panel>

      <Panel className="methodology-flow-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">01 · DECISION FLOW</span>
            <h3>Flowchart metodologi SILICA2CON</h3>
            <p>
              Urutan kerja dari identitas material hingga keputusan akhir dan
              pembaruan evidence.
            </p>
          </div>
          <GitBranch size={18} />
        </div>

        <div className="methodology-flow">
          {methodologySteps.map((step, index) => (
            <div className="methodology-flow-step" key={step.no}>
              <div className="methodology-flow-number">{step.no}</div>
              <div className="methodology-flow-copy">
                <strong>{step.title}</strong>
                <span>{step.copy}</span>
              </div>
              {index < methodologySteps.length - 1 && (
                <ArrowRight
                  className="methodology-flow-arrow"
                  size={15}
                />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <div className="methodology-grid-2">
        <Panel className="methodology-status-panel">
          <div className="panel-head">
            <div>
              <span className="mono-label">02 · CURRENT POSITION</span>
              <h3>Posisi studi saat ini</h3>
              <p>Status engine dibaca sebagai kondisi kerja, bukan klaim kepatuhan.</p>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="methodology-metrics">
            <div>
              <span>Qualification</span>
              <strong>{qualification.status ?? "INSUFFICIENT_DATA"}</strong>
            </div>
            <div>
              <span>Evidence class</span>
              <strong>{study.state.evidence.evidenceClass ?? "DATA_REQUIRED"}</strong>
            </div>
            <div>
              <span>Direct benchmark</span>
              <strong>{direct ? "AVAILABLE" : "DATA_REQUIRED"}</strong>
            </div>
            <div>
              <span>Validation roadmap</span>
              <strong>
                {
                  validationRoadmap.filter(
                    (item) => item.roadmap_status === "VALIDATION_REQUIRED",
                  ).length
                }{" "}
                GATE
              </strong>
            </div>
          </div>

          <div className="methodology-status-note">
            <CheckCircle2 size={15} />
            <span>
              Literatur dipakai sebagai benchmark/context. Validasi paving
              block tetap harus dilakukan pada konfigurasi target.
            </span>
          </div>
        </Panel>

        <Panel className="methodology-rule-panel">
          <div className="panel-head">
            <div>
              <span className="mono-label">03 · EVIDENCE RULES</span>
              <h3>Aturan pembacaan data</h3>
              <p>Setiap titik performa harus mempertahankan konteksnya.</p>
            </div>
            <BookOpen size={18} />
          </div>

          <div className="methodology-rule-list">
            <div>
              <b>01</b>
              <span>
                Replacement basis tidak boleh dihilangkan saat membandingkan
                persentase.
              </span>
            </div>
            <div>
              <b>02</b>
              <span>
                Mortar, concrete, dan paving block tidak diperlakukan sebagai
                dataset universal.
              </span>
            </div>
            <div>
              <b>03</b>
              <span>
                Nilai reported, derived, assumed, dan validated harus tetap
                dibedakan.
              </span>
            </div>
            <div>
              <b>04</b>
              <span>
                Evidence literatur tidak boleh dipindahkan menjadi klaim
                validasi eksperimen SILICA2CON.
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="methodology-chart-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">04 · PERFORMANCE EVIDENCE</span>
            <h3>Grafik evidence performa</h3>
            <p>
              Tiga konteks ditampilkan terpisah agar pola tidak disalahartikan
              sebagai satu kurva universal.
            </p>
          </div>
          <FlaskConical size={18} />
        </div>

        <div className="methodology-chart-grid">
          <div className="methodology-chart-card">
            <div className="methodology-chart-head">
              <div>
                <strong>Geodipa waste · paving block</strong>
                <span>
                  X: replacement (%) · Y: compressive strength (MPa) · 7 hari
                </span>
              </div>
              <span className="methodology-source-pill">SRC-017</span>
            </div>

            <div className="bar-chart">
              {fikroni.map((item) => {
                const value = item.compressive_strength_7d_mpa ?? 0;

                return (
                  <div className="bar-item" key={item.id}>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${Math.max(
                            8,
                            (value / maxFikroni) * 100,
                          )}%`,
                        }}
                      >
                        <span>{value.toFixed(2)}</span>
                      </div>
                    </div>
                    <small>{item.replacement_pct}%</small>
                  </div>
                );
              })}
            </div>

            <p className="methodology-chart-caption">
              Dalam studi ini titik tertinggi yang dilaporkan berada pada 8%
              replacement, tetapi bukan berarti 8% adalah optimum universal.
            </p>
          </div>

          <div className="methodology-chart-card">
            <div className="methodology-chart-head">
              <div>
                <strong>Geothermal nano-SiO₂ waste · concrete</strong>
                <span>
                  X: replacement (%) · Y: compressive strength (MPa) · 28 hari
                </span>
              </div>
              <span className="methodology-source-pill">SRC-007</span>
            </div>

            <div className="bar-chart">
              {lopez.map((item) => {
                const value = item.compressive_strength_28d_mpa ?? 0;

                return (
                  <div className="bar-item" key={item.id}>
                    <div className="bar-track">
                      <div
                        className="bar-fill bar-fill-alt"
                        style={{
                          height: `${Math.max(
                            8,
                            (value / maxLopez) * 100,
                          )}%`,
                        }}
                      >
                        <span>{value.toFixed(2)}</span>
                      </div>
                    </div>
                    <small>{item.replacement_pct}%</small>
                  </div>
                );
              })}
            </div>

            <div className="workability-row">
              {lopez.map((item) => (
                <span key={item.id}>
                  {item.replacement_pct}% → {item.slump_mm ?? "—"} mm
                </span>
              ))}
            </div>

            <p className="methodology-chart-caption">
              Kenaikan kuat tekan pada studi tersebut berjalan bersama
              penurunan slump; keputusan tidak cukup memakai satu metrik.
            </p>
          </div>
        </div>
      </Panel>

      {/* =========================================================
          05 · DURABILITY BENCHMARK
          Cross-domain paving reference — NOT geothermal evidence.
          ========================================================= */}
      <Panel className="methodology-durability-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">05 · DURABILITY BENCHMARK</span>
            <h3>Water absorption & abrasion</h3>
            <p>
              Benchmark paving block lintas-material untuk menunjukkan metrik
              durability yang perlu masuk ke technical gate SILICA2CON.
            </p>
          </div>
          <ShieldCheck size={18} />
        </div>

        <div
          className="methodology-durability-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {/* WATER ABSORPTION */}
          <div className="methodology-chart-card">
            <div className="methodology-chart-head">
              <div>
                <strong>Water absorption</strong>
                <span>
                  X: mix system · Y: water absorption (wt.%) · 28 hari
                </span>
              </div>
              <span className="methodology-source-pill">SRC-DUR-01</span>
            </div>

            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "32px minmax(0, 1fr)",
                gap: 8,
                height: 205,
                paddingTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingBottom: 26,
                  color: "#7c8982",
                  font: "700 7px var(--app-font-mono)",
                  textAlign: "right",
                }}
              >
                <span>6%</span>
                <span>4%</span>
                <span>2%</span>
                <span>0%</span>
              </div>

              <div
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  alignItems: "end",
                  gap: 10,
                  minWidth: 0,
                  padding: "0 6px 26px",
                  borderLeft: "1px solid #dce4de",
                  borderBottom: "1px solid #dce4de",
                  background:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 43px, rgba(35,72,56,.06) 44px)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${(6 / maxWaterAbsorption) * 174 + 26}px`,
                    borderTop: "1px dashed #b7c1bb",
                    pointerEvents: "none",
                  }}
                />

                {durabilityBenchmark.map((item) => (
                  <div
                    key={item.mix}
                    style={{
                      height: 170,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <strong
                      style={{
                        font: "800 8px var(--app-font-mono)",
                        color: "#2b5c48",
                      }}
                    >
                      {item.waterAbsorption.toFixed(1)}%
                    </strong>

                    <div
                      style={{
                        width: "min(42px, 70%)",
                        height: `${Math.max(
                          12,
                          (item.waterAbsorption / maxWaterAbsorption) * 150,
                        )}px`,
                        borderRadius: "7px 7px 2px 2px",
                        background:
                          "linear-gradient(180deg, #6c9c82, #2d6650)",
                      }}
                    />

                    <small
                      style={{
                        font: "700 7px var(--app-font-mono)",
                        color: "#78867f",
                      }}
                    >
                      {item.mix}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <p className="methodology-chart-caption">
              Reference study reported 5.3 → 4.1 wt.%. Garis putus-putus
              menunjukkan batas studi ≤6.0% dari GB/T 28635-2012, bukan batas
              SNI Indonesia.
            </p>

            <div
              style={{
                marginTop: 9,
                padding: "9px 10px",
                border: "1px solid #e0e7e2",
                borderRadius: 10,
                background: "#f8faf8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#214e3b",
                  fontSize: 9,
                }}
              >
                Source
              </strong>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  color: "#6f7d75",
                  fontSize: 7.5,
                  lineHeight: 1.45,
                }}
              >
                Han et al. (2026), Coatings 16(5), 541 · DOI:
                10.3390/coatings16050541
              </span>
            </div>
          </div>

          {/* ABRASION */}
          <div className="methodology-chart-card">
            <div className="methodology-chart-head">
              <div>
                <strong>Abrasion resistance</strong>
                <span>
                  X: mix system · Y: abrasion pit length (mm) · 28 hari
                </span>
              </div>
              <span className="methodology-source-pill">SRC-DUR-02</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px minmax(0, 1fr)",
                gap: 8,
                height: 205,
                paddingTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingBottom: 26,
                  color: "#7c8982",
                  font: "700 7px var(--app-font-mono)",
                  textAlign: "right",
                }}
              >
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              <div
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  alignItems: "end",
                  gap: 10,
                  minWidth: 0,
                  padding: "0 6px 26px",
                  borderLeft: "1px solid #dce4de",
                  borderBottom: "1px solid #dce4de",
                  background:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 43px, rgba(35,72,56,.06) 44px)",
                }}
              >
                {durabilityBenchmark.map((item) => (
                  <div
                    key={item.mix}
                    style={{
                      height: 170,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <strong
                      style={{
                        font: "800 8px var(--app-font-mono)",
                        color: "#a17828",
                      }}
                    >
                      {item.abrasionPit.toFixed(1)}
                    </strong>

                    <div
                      style={{
                        width: "min(42px, 70%)",
                        height: `${Math.max(
                          12,
                          (item.abrasionPit / maxAbrasionPit) * 150,
                        )}px`,
                        borderRadius: "7px 7px 2px 2px",
                        background:
                          "linear-gradient(180deg, #c9aa64, #9b762e)",
                      }}
                    />

                    <small
                      style={{
                        font: "700 7px var(--app-font-mono)",
                        color: "#78867f",
                      }}
                    >
                      {item.mix}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <p className="methodology-chart-caption">
              Abrasion pit length turun 29.2 → 24.7 mm; nilai yang lebih kecil
              menunjukkan ketahanan aus yang lebih baik. Reference limit studi
              ≤30.0 mm dari GB/T 28635-2012.
            </p>

            <div
              style={{
                marginTop: 9,
                padding: "9px 10px",
                border: "1px solid #e0e7e2",
                borderRadius: 10,
                background: "#f8faf8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "#214e3b",
                  fontSize: 9,
                }}
              >
                Source
              </strong>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  color: "#6f7d75",
                  fontSize: 7.5,
                  lineHeight: 1.45,
                }}
              >
                Han et al. (2026), Coatings 16(5), 541 · DOI:
                10.3390/coatings16050541
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 11,
            padding: "10px 11px",
            borderRadius: 10,
            background: "rgba(180,135,53,.07)",
            color: "#6f7d75",
            fontSize: 7.5,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#715625" }}>
            Cara membaca benchmark:
          </strong>{" "}
          data ini dipakai sebagai contoh struktur evidence untuk parameter
          durability paving block. Material pada sumber adalah asphalt mixing
          plant dust, bukan geothermal residue, sehingga tidak boleh dibaca
          sebagai performa SILICA2CON atau digabungkan dengan kurva geothermal.
        </div>
      </Panel>

      <Panel className="methodology-table-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">06 · EVIDENCE MATRIX</span>
            <h3>Tabel perbandingan evidence</h3>
            <p>
              Basis data dipertahankan agar pengguna dapat melihat jarak antara
              benchmark langsung dan evidence terkait.
            </p>
          </div>
          <Table2 size={18} />
        </div>

        <div className="methodology-table-wrap">
          <table className="methodology-table">
            <thead>
              <tr>
                <th>Studi</th>
                <th>Material</th>
                <th>Produk</th>
                <th>Replacement</th>
                <th>Performa</th>
                <th>Transfer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Fikroni et al. (2023)</strong>
                  <small>SRC-017</small>
                </td>
                <td>Geodipa waste</td>
                <td>Paving block</td>
                <td>
                  0–12%
                  <br />
                  <small>CEMENT MASS</small>
                </td>
                <td>
                  11.33–16.13 MPa
                  <br />
                  <small>7 hari</small>
                </td>
                <td>
                  <span className="matrix-badge direct">DIRECT BENCHMARK</span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>López-Perales et al. (2024)</strong>
                  <small>SRC-007</small>
                </td>
                <td>Geothermal nano-SiO₂ waste</td>
                <td>Concrete</td>
                <td>
                  0 / 20 / 30%
                  <br />
                  <small>BASIS: STUDY-SPECIFIC</small>
                </td>
                <td>
                  23.03 / 25.42 / 28.23 MPa
                  <br />
                  <small>28 hari</small>
                </td>
                <td>
                  <span className="matrix-badge related">RELATED</span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Meiyati et al. (2015)</strong>
                  <small>SRC-006</small>
                </td>
                <td>Geothermal sludge</td>
                <td>Mortar</td>
                <td>
                  20%
                  <br />
                  <small>CEMENT MASS</small>
                </td>
                <td>
                  27.093 kgf/cm²
                  <br />
                  <small>28 hari</small>
                </td>
                <td>
                  <span className="matrix-badge related">RELATED</span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Han et al. (2026)</strong>
                  <small>SRC-DUR-01/02</small>
                </td>
                <td>Asphalt mixing plant dust</td>
                <td>Alkali-activated paving block</td>
                <td>
                  Mix-system specific
                  <br />
                  <small>REPLACEMENT BY MASS</small>
                </td>
                <td>
                  4.1–5.3 wt.% absorption
                  <br />
                  <small>24.7–29.2 mm abrasion pit · 28 hari</small>
                </td>
                <td>
                  <span className="matrix-badge related">DURABILITY CONTEXT</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="methodology-source-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">07 · SOURCE REGISTRY</span>
            <h3>Sumber utama yang membentuk metodologi</h3>
            <p>
              Referensi ditampilkan sebagai provenance registry; verifikasi dan
              konteks tetap melekat pada penggunaannya.
            </p>
          </div>
          <BookOpen size={18} />
        </div>

        <div className="methodology-source-grid">
          {[
            "SRC-001",
            "SRC-004",
            "SRC-005",
            "SRC-006",
            "SRC-007",
            "SRC-017",
            "SRC-010",
          ].map((id) => {
            const source = sourceById(id);
            if (!source) return null;

            return (
              <article className="methodology-source-card" key={id}>
                <div className="methodology-source-card-top">
                  <span>{source.id}</span>
                  <span>{source.year}</span>
                </div>
                <strong>{source.title}</strong>
                <p>{source.authors}</p>
                <small>{source.journal ?? source.type}</small>
                {source.doi !== "—" && <code>{source.doi}</code>}
              </article>
            );
          })}
        </div>

        {/* Cross-domain durability source kept separate from master registry. */}
        <div
          style={{
            marginTop: 11,
            padding: 11,
            border: "1px dashed #d7e0da",
            borderRadius: 12,
            background: "#fafcfb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              className="mono-label"
              style={{ color: "#8a7040" }}
            >
              CROSS-DOMAIN DURABILITY SOURCE
            </span>
            <span className="methodology-source-pill">SRC-DUR-01/02</span>
          </div>
          <strong
            style={{
              display: "block",
              marginTop: 6,
              color: "#214e3b",
              fontSize: 10,
            }}
          >
            Han, Y., Jia, Z., Yang, X., & Jiang, X. (2026)
          </strong>
          <p
            style={{
              margin: "4px 0 0",
              color: "#6f7d75",
              fontSize: 7.5,
              lineHeight: 1.45,
            }}
          >
            “Graded Utilization of Asphalt Mixing Plant Dust in Alkali-Activated
            Concrete Paving Blocks: Mechanical Performance and Sustainability
            Assessment.” Coatings, 16(5), 541.
          </p>
          <code
            style={{
              display: "inline-block",
              marginTop: 5,
              fontSize: 7,
            }}
          >
            DOI 10.3390/coatings16050541
          </code>
        </div>
      </Panel>

      <Panel className="methodology-roadmap-panel">
        <div className="panel-head">
          <div>
            <span className="mono-label">08 · VALIDATION ROADMAP</span>
            <h3>Bagaimana evidence berubah menjadi data validasi?</h3>
            <p>
              Literatur membentuk hipotesis dan kandidat; eksperimen mengisi
              evidence yang masih kosong.
            </p>
          </div>
          <ArrowDown size={18} />
        </div>

        <div className="methodology-roadmap">
          {validationRoadmap.map((item) => (
            <div
              key={item.phase}
              className={`roadmap-item ${
                item.roadmap_status === "VALIDATION_REQUIRED"
                  ? "is-required"
                  : ""
              }`}
            >
              <div>
                <span>{String(item.phase).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
              </div>
              <p>{item.required_outputs.join(" · ")}</p>
              <em>{item.roadmap_status}</em>
            </div>
          ))}
        </div>
      </Panel>

      <div className="page-actions methodology-actions">
        <button className="button button-ghost" type="button" onClick={back}>
          Kembali
        </button>

        <button className="button button-primary" type="button" onClick={next}>
          Lanjut ke Technical Gate <ArrowRight size={15} />
        </button>
      </div>

      <p className="methodology-footnote">
        Catatan: benchmark Fikroni, López-Perales, dan Meiyati tetap dipisahkan
        berdasarkan material, produk, basis replacement, dan kondisi uji.
        Benchmark Han et al. (2026) hanya digunakan sebagai contoh evidence
        durability lintas-material, bukan sebagai bukti geothermal.
      </p>
    </div>
  );
}

export default MethodologyPage;
