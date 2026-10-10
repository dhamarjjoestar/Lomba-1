import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  Database,
  FileCheck2,
  Leaf,
  Recycle,
  ShieldCheck,
} from "lucide-react";

import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  decisionClass,
  displayDecision,
  evidenceLabel,
} from "../../utils/decision";
import { paperEconomicScreening } from "../../engine/data/master";
import type { Characterization, StudyResult } from "../../engine/study";

function display(value: unknown, fallback = "DATA DIPERLUKAN"): string {
  return value == null || value === "" ? fallback : String(value);
}

function decisionHeading(decision: string): string {
  switch (decision) {
    case "VALIDATED":
      return "Direkomendasikan";
    case "PRELIMINARY_PROMISING":
      return "Bersyarat";
    case "CONDITIONAL":
      return "Bersyarat";
    case "NOT_SUPPORTED":
      return "Tidak Direkomendasikan";
    default:
      return "Data Tidak Mencukupi";
  }
}

function decisionDescription(decision: string): string {
  switch (decision) {
    case "VALIDATED":
      return "Gerbang keputusan mendukung kandidat berdasarkan evidence dan validasi eksperimental yang tercatat.";
    case "PRELIMINARY_PROMISING":
      return "Kandidat menunjukkan sinyal awal yang menjanjikan, tetapi masih membutuhkan penutupan gap validasi sebelum keputusan final.";
    case "CONDITIONAL":
      return "Kandidat dapat dipertimbangkan secara terbatas, dengan sejumlah kondisi atau data pendukung yang masih harus dipenuhi.";
    case "NOT_SUPPORTED":
      return "Kandidat gagal pada gerbang teknis atau standar awal yang diperlukan sehingga belum didukung untuk diteruskan.";
    default:
      return "Mesin keputusan belum memiliki data yang cukup untuk mendukung rekomendasi kandidat ini.";
  }
}

export default function RecommendationPage({
  study,
  fields,
  next,
  back,
}: {
  study: StudyResult;
  fields: Characterization;
  next: () => void;
  back: () => void;
}) {
  const decision = study.state.decision;
  const decisionLabel = displayDecision(decision.decision);
  const tone = decisionClass(decision.decision);
  const evidence = study.state.evidence;
  const sni = study.state.sni;
  const mass = study.state.massBalance;
  const tea = study.state.tea;
  const environment = study.state.environment;
  const benchmarkScenario =
    study.economics.scenario === "baseline" ? "base" : study.economics.scenario;

  const economicBenchmarkCostPerBlock =
    paperEconomicScreening?.scenarios?.[benchmarkScenario]
      ?.production_cost_per_block ?? null;

  const economicDelta =
    tea.costPerBlock != null && economicBenchmarkCostPerBlock != null
      ? tea.costPerBlock - economicBenchmarkCostPerBlock
      : null;

  const reasons =
    decision.reasons.length > 0
      ? decision.reasons
      : ["Tidak ada alasan tambahan yang dikembalikan oleh decision engine."];

  const nextAction =
    decision.decision === "VALIDATED"
      ? "Tinjau rekam validasi dan finalisasi keputusan."
      : decision.decision === "NOT_SUPPORTED"
        ? "Perbaiki gap teknis sebelum mengulang analisis kandidat."
        : decision.reasons.some((reason) =>
              /biaya current study berada di atas benchmark/i.test(reason),
            )
          ? "Tinjau kembali biaya formulasi dan asumsi ekonomi sebelum kandidat diprioritaskan untuk validasi."
          : decision.reasons.some((reason) =>
                /parameter sni masih belum terverifikasi/i.test(reason),
              )
            ? "Lengkapi pengujian parameter SNI untuk menutup gerbang teknis kandidat."
            : decision.reasons.some((reason) =>
                  /inventaris lingkungan atau faktor emisi masih belum lengkap/i.test(
                    reason,
                  ),
                )
              ? "Lengkapi inventaris lingkungan dan faktor emisi sebelum menarik kesimpulan dampak."
              : decision.decision === "PRELIMINARY_PROMISING"
                ? "Prioritaskan kandidat untuk validasi eksperimental/lab sebelum keputusan final."
                : "Lengkapi validasi, data teknis, dan bukti yang masih diperlukan.";

  return (
    <div className={`reveal recommendation-page recommendation-${tone}`}>
      <PageHead
        title="Keputusan akhir kandidat harus tetap dapat ditelusuri."
        description="SILICA2CON memisahkan sinyal dukungan, kondisi, bukti literatur, dan kebutuhan validasi. Status di bawah berasal langsung dari decision engine dan tidak dinaikkan secara diam-diam."
        action={<StatusBadge status={decision.decision} />}
      />

      <section className="decision-hero">
        <div className="decision-hero-main">
          <div className="decision-eyebrow">HASIL DECISION ENGINE</div>
          <h3>{decisionHeading(decision.decision)}</h3>
          <p>{decisionDescription(decision.decision)}</p>

          <div className="decision-hero-meta">
            <div>
              <span>BATCH</span>
              <strong>{display(fields.batch)}</strong>
            </div>
            <div>
              <span>SUBSTITUSI</span>
              <strong>
                {display(study.state.formulation.replacementValue, "0")}%
              </strong>
            </div>
            <div>
              <span>DASAR</span>
              <strong>
                {display(study.state.formulation.replacementBasis)}
              </strong>
            </div>
          </div>
        </div>

        <div className="decision-hero-status">
          <div className="decision-status-mark">
            {tone === "success" ? (
              <Check size={27} />
            ) : tone === "danger" ? (
              <CircleAlert size={27} />
            ) : (
              <AlertTriangle size={27} />
            )}
          </div>
          <span>STATUS KANONIK</span>
          <strong>{decisionLabel}</strong>
        </div>
      </section>

      <Panel className="decision-reason-panel">
        <div className="decision-section-head">
                    <h3>Alasan yang membentuk keputusan</h3>
          <p>
            Setiap alasan dipertahankan sebagai bagian dari jejak keputusan.
          </p>
        </div>

        <div className="decision-reason-grid">
          {reasons.map((reason, index) => (
            <div className="decision-reason-item" key={`${reason}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{reason}</p>
            </div>
          ))}
        </div>

        {decision.warnings.length > 0 && (
          <div className="decision-warning">
            <AlertTriangle size={15} />
            <p>{decision.warnings.join(" ")}</p>
          </div>
        )}
      </Panel>

      <div className="decision-status-grid">
        <article className="decision-support-card decision-evidence-card">
          <div className="decision-support-head">
            <span className="eyebrow">EVIDENCE</span>
            <FileCheck2 size={16} />
          </div>
          <strong>{evidenceLabel(evidence.evidenceClass)}</strong>
          <p>
            {display(
              evidence.explanation,
              "Belum ada penjelasan evidence yang tersedia.",
            )}
          </p>
          <div className="decision-support-value">
            <span>Status evidence</span>
            <strong>{display(evidence.status)}</strong>
          </div>
        </article>

        <article className="decision-support-card decision-sni-card">
          <div className="decision-support-head">
            <span className="eyebrow">GERBANG TEKNIS</span>
            <ShieldCheck size={16} />
          </div>
          <strong>
            {decision.technicalGate.passed ? "Belum gagal" : "Gagal awal"}
          </strong>
          <p>
            {decision.technicalGate.reason ??
              "Tidak ditemukan kegagalan pada gerbang teknis awal."}
          </p>
          <div className="decision-support-value">
            <span>Status SNI</span>
            <strong>{display(sni.status)}</strong>
          </div>
        </article>
      </div>

      <div className="decision-status-grid">
        <article className="decision-support-card">
          <div className="decision-support-head">
            <span className="eyebrow">MASS BALANCE</span>
            <Database size={16} />
          </div>
          <strong>{display(mass.status)}</strong>
          <p>
            Massa residu:{" "}
            {mass.residueKg == null
              ? "DATA DIPERLUKAN"
              : `${mass.residueKg.toFixed(2)} kg`}
            {" · "}
            batch:{" "}
            {mass.totalBatchKg == null
              ? "DATA DIPERLUKAN"
              : `${mass.totalBatchKg.toFixed(2)} kg`}
          </p>
          <div className="decision-support-value">
            <span>Formulasi</span>
            <strong>
              {display(study.state.formulation.replacementValue, "0")}%
            </strong>
          </div>
        </article>

        <article className="decision-support-card">
          <div className="decision-support-head">
            <span className="eyebrow">SCREENING</span>
            <Check size={16} />
          </div>
          <strong>
            {tea.costPerBlock == null
              ? "Data diperlukan"
              : `${Math.round(tea.costPerBlock).toLocaleString("id-ID")} IDR/block`}
          </strong>
          <p>
            Benchmark:{" "}
            {economicBenchmarkCostPerBlock == null
              ? "DATA DIPERLUKAN"
              : `${Math.round(economicBenchmarkCostPerBlock).toLocaleString(
                  "id-ID",
                )} IDR/block`}
            {" · "}
            Selisih:{" "}
            {economicDelta == null
              ? "DATA DIPERLUKAN"
              : `${economicDelta >= 0 ? "+" : ""}${Math.round(
                  economicDelta,
                ).toLocaleString("id-ID")} IDR/block`}
            {" · "}
            Lingkungan:{" "}
            {environment.net == null
              ? "hasil bersih belum tersedia"
              : `${environment.net.toFixed(2)} kgCO₂e`}
            .
          </p>

          <div className="decision-support-value">
            <span>Material</span>
            <strong>{display(fields.materialId)}</strong>
          </div>
        </article>
      </div>

      {/* SDG IMPACT / ALIGNMENT — informasional, bukan decision gate */}
      <Panel className="sdg-impact-panel">
        <div className="sdg-impact-header">
          <div className="sdg-impact-heading">
            <span className="eyebrow">04 · SUSTAINABILITY ALIGNMENT</span>
            <h3>Potensi kontribusi terhadap SDGs</h3>
            <p>
              Bagian ini menerjemahkan jalur valorizasi residu ke dalam konteks
              SDGs. Alignment bersifat potensial pada tahap screening dan tidak
              digunakan untuk menaikkan status kelayakan teknis.
            </p>
          </div>
          <span className="sdg-impact-badge">IMPACT SCREENING</span>
        </div>

        <div className="sdg-grid">
          <article className="sdg-card">
            <div className="sdg-icon">
              <Building2 size={18} />
            </div>
            <div>
              <span className="sdg-number">SDG 9</span>
              <h4>Industry, Innovation &amp; Infrastructure</h4>
              <p>
                Pengembangan material konstruksi alternatif melalui pemanfaatan
                residu geothermal sebagai sumber bahan sekunder.
              </p>
              <span className="sdg-status">ALIGNMENT POTENSIAL</span>
            </div>
          </article>

          <article className="sdg-card">
            <div className="sdg-icon">
              <Leaf size={18} />
            </div>
            <div>
              <span className="sdg-number">SDG 11</span>
              <h4>Sustainable Cities &amp; Communities</h4>
              <p>
                Paving block menjadi platform validasi awal untuk aplikasi
                material konstruksi yang lebih berkelanjutan.
              </p>
              <span className="sdg-status">ALIGNMENT POTENSIAL</span>
            </div>
          </article>

          <article className="sdg-card sdg-card-featured">
            <div className="sdg-icon">
              <Recycle size={18} />
            </div>
            <div>
              <span className="sdg-number">SDG 12</span>
              <h4>Responsible Consumption &amp; Production</h4>
              <p>
                Valorisasi residu membuka jalur penggunaan kembali material dan
                mendukung pendekatan circular material.
              </p>
              <span className="sdg-status">ALIGNMENT TERKUAT</span>
            </div>
          </article>
        </div>

        <div className="sdg-impact-note">
          <Leaf size={14} />
          <span>
            <strong>Batas interpretasi:</strong> alignment SDG bukan bukti
            dampak aktual. Penilaian aktual tetap bergantung pada validasi
            material, energi pengolahan, transportasi, dan performa produk.
          </span>
        </div>
      </Panel>

      <section className="decision-next-panel">
        <div>
          <p className="eyebrow">05 · NEXT ACTION</p>
          <h3>{nextAction}</h3>
          <p>
            Rekomendasi berikutnya bukan klaim performa. Gunakan halaman setelah
            ini untuk menutup kebutuhan validasi yang masih terbuka dan
            mempertahankan keterlacakan setiap keputusan.
          </p>
        </div>
        <div className="decision-next-list">
          {decision.trace.slice(0, 4).map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <Panel className="decision-trace-panel">
        <div className="decision-section-head">
          <p className="eyebrow">06 · DECISION TRACE</p>
          <h3>Jejak mesin keputusan</h3>
          <p>
            Urutan alasan yang dibangun engine dan diteruskan ke traceability.
          </p>
        </div>
        <div className="engine-trace">
          {(decision.trace.length > 0
            ? decision.trace
            : ["Belum ada jejak keputusan tambahan."]
          ).map((item, index) => (
            <div key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="page-actions">
        <button className="text-button" onClick={back} type="button">
          <ArrowLeft size={15} /> Kembali
        </button>

        <button className="button button-gold" onClick={next} type="button">
          Lanjut ke validasi <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
