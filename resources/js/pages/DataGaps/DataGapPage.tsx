import {
  ArrowLeft,
  ArrowRight,
  Info
} from "lucide-react";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type { Stage } from "../../app/types/stage";
import type { Characterization, MixControls, StudyResult } from "../../engine/study";

export default function DataGapPage({
  study,
  fields,
  mix,
  setStage,
}: {
  study: StudyResult;
  fields: Characterization;
  mix: MixControls;
  setStage: (stage: Stage) => void;
}) {
  const gaps = [
    {
      id: "P0-EXP-001",
      priority: "P0",
      title: "Validasi eksperimen SILICA2CON",
      reason:
        "Belum ada rekaman eksperimen SILICA2CON tervalidasi di dataset kanonik.",
      impact: "Keputusan tidak dapat naik ke status tervalidasi.",
      stage: "validation" as Stage,
    },
    {
      id: "P0-TEA-001",
      priority: "P0",
      title: "CAPEX lini produksi paving block",
      reason: "Model paper hanya mencakup lini pengolahan residu.",
      impact:
        "Payback belum dapat diperlakukan sebagai kelayakan investasi final.",
      stage: "economics" as Stage,
    },
    {
      id: "P0-TEA-002",
      priority: "P0",
      title: "Biaya operasi aktual",
      reason:
        "Billing energi, tenaga kerja, maintenance, dan data batch belum tersedia.",
      impact: "OPEX masih berada pada tingkat estimasi/skenario.",
      stage: "economics" as Stage,
    },
    {
  id: "P1-GEO-001",
  priority: "P1",
  title: "Massa dan dimensi aktual produk",
  reason: `Geometri aktif ${mix.blockLengthMm} × ${mix.blockWidthMm} × ${mix.blockThicknessMm} mm masih nominal.`,
  impact: "Perlu verifikasi massa dan dimensi produk fisik.",
  stage: "formulation" as Stage,
},
    {
      id: "P1-MAT-001",
      priority: "P1",
      title: "Karakterisasi batch lengkap",
      reason:
        "Ukuran partikel, kadar air, dan pengotor batch aktual belum terisi.",
      impact: "Kelayakan material belum dapat dipastikan dari data batch.",
      stage: "characterization" as Stage,
    },
  ];

  const p0 = gaps.filter((gap) => gap.priority === "P0");
  const p1 = gaps.filter((gap) => gap.priority === "P1");

  const openStage = (stage: Stage) => setStage(stage);

  const stageLabel: Record<Stage, string> = {
    start: "Mulai",
    overview: "Overview",
    characterization: "Karakterisasi",
    formulation: "Formulasi",
    simulation: "Simulasi",
    dashboard: "Dashboard",
    evidence: "Bukti",
    gate: "Gerbang teknis",
    economics: "Ekonomi",
    environment: "Lingkungan",
    recommendation: "Keputusan",
    validation: "Validasi",
    traceability: "Keterlacakan",
    "data-gaps": "Kesenjangan Data",
  };

  const GapCard = ({
    gap,
    featured = false,
  }: {
    gap: (typeof gaps)[number];
    featured?: boolean;
  }) => (
    <article
      className={`gap-control-card ${
        gap.priority === "P0" ? "gap-p0" : "gap-p1"
      } ${featured ? "gap-featured" : ""}`}
    >
      <div className="gap-card-top">
        <span className="gap-priority">{gap.priority}</span>

        <span className="gap-id">{gap.id}</span>
      </div>

      <h3>{gap.title}</h3>

      <div className="gap-detail">
        <span>KENAPA TERJADI</span>
        <p>{gap.reason}</p>
      </div>

      <div className="gap-detail gap-impact">
        <span>DAMPAK KE KEPUTUSAN</span>
        <p>{gap.impact}</p>
      </div>

      <button className="gap-route" onClick={() => openStage(gap.stage)}>
        <span>Perlu ditindaklanjuti di</span>
        <strong>{stageLabel[gap.stage]}</strong>
        <ArrowRight size={14} />
      </button>
    </article>
  );

  return (
    <div className="reveal gap-control-room">
      <PageHead
        eyebrow="control room"
        title="Kesenjangan yang masih menahan keputusan."
        description="Pusat prioritas data yang menunjukkan apa yang belum tersedia, dampaknya terhadap keputusan, dan bagian studi yang perlu ditindaklanjuti."
        action={<StatusBadge status="DATA DIPERLUKAN" />}
      />

      {/* OVERVIEW */}
      <section className="gap-command-bar">
        <div className="gap-command-title">
          <span className="eyebrow">DATA READINESS</span>
          <h3>Control room</h3>
        </div>

        <div className="gap-command-metrics">
          <div>
            <strong>{gaps.length}</strong>
            <span>GAP AKTIF</span>
          </div>

          <div className="is-p0">
            <strong>{p0.length}</strong>
            <span>PRIORITAS P0</span>
          </div>

          <div>
            <strong>{p1.length}</strong>
            <span>PRIORITAS P1</span>
          </div>
        </div>
      </section>

      {/* P0 */}
      {p0.length > 0 && (
        <section className="gap-priority-section">
          <div className="gap-section-heading">
            <div>
              <span className="eyebrow">PRIORITAS TERTINGGI</span>
              <h3>Hal yang paling menahan keputusan</h3>
            </div>

            <span className="gap-section-count">{p0.length} item P0</span>
          </div>

          <div className="gap-control-grid gap-grid-p0">
            {p0.map((gap) => (
              <GapCard key={gap.id} gap={gap} featured />
            ))}
          </div>
        </section>
      )}

      {/* P1 */}
      {p1.length > 0 && (
        <section className="gap-priority-section">
          <div className="gap-section-heading">
            <div>
              <span className="eyebrow">PRIORITAS BERIKUTNYA</span>
              <h3>Data yang perlu dilengkapi</h3>
            </div>

            <span className="gap-section-count">{p1.length} item P1</span>
          </div>

          <div className="gap-control-grid gap-grid-p1">
            {p1.map((gap) => (
              <GapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </section>
      )}

      {/* FOOT NOTE */}
      <section className="gap-control-note">
        <div className="gap-note-icon">
          <Info size={17} />
        </div>

        <div>
          <span>INTERPRETASI</span>
          <strong>Kesenjangan bukan kegagalan model.</strong>
          <p>
            Item di atas menunjukkan bukti atau data yang masih diperlukan agar
            status studi dapat dinaikkan dengan dasar yang lebih kuat.
          </p>
        </div>
      </section>

      <div className="page-actions">
        <button
          className="text-button"
          onClick={() => setStage("recommendation")}
        >
          <ArrowLeft size={15} />
          Kembali ke keputusan
        </button>
      </div>
    </div>
  );
}
