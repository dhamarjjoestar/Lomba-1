import {
  ArrowRight,
  Check,
  Info
} from "lucide-react";
import Metric from "../../components/common/Metric";
import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import { evidenceLabel } from "../../utils/decision";
import { displayDecision, decisionClass } from "../../utils/decision";
import type { Stage } from "../../app/types/stage";
import type { Characterization, MixControls, StudyResult } from "../../engine/study";
import { formatIdr } from "../../engine/study";

export default function TraceabilityPage({
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
  const decision = displayDecision(study.state.decision.decision);
  const nodes: {
    label: string;
    value: string;
    stage: Stage;
    status: string;
  }[] = [
    {
      label: "Material",
      value: fields.source || "DATA DIPERLUKAN",
      stage: "characterization",
      status: fields.source ? "INPUT PENGGUNA" : "DATA DIPERLUKAN",
    },
    {
      label: "Karakterisasi",
      value: fields.sample
        ? "identitas sampel tersedia"
        : "hanya konteks literatur",
      stage: "characterization",
      status: fields.sample ? "INPUT PENGGUNA" : "DATA DIPERLUKAN",
    },
    {
      label: "Formulasi",
      value: `${mix.substitution}% dari massa semen`,
      stage: "formulation",
      status: "ASSUMPTION",
    },
    {
      label: "Perhitungan",
      value: study.state.massBalance.status,
      stage: "simulation",
      status: study.state.massBalance.status,
    },
    {
      label: "Bukti",
      value: evidenceLabel(study.state.evidence.evidenceClass),
      stage: "evidence",
      status: study.state.evidence.status,
    },
    {
      label: "Gerbang teknis",
      value: study.state.sni.status?.replaceAll("_", " ") ?? "DATA DIPERLUKAN",
      stage: "gate",
      status: study.state.sni.status,
    },
    {
      label: "Ekonomi",
      value:
        study.state.tea.total == null
          ? "data diperlukan"
          : formatIdr(study.state.tea.total),
      stage: "economics",
      status: study.state.tea.status,
    },
    {
      label: "Lingkungan",
      value:
        study.state.environment.net == null
          ? "hasil bersih belum tersedia"
          : `${study.state.environment.net.toFixed(2)} kgCO₂e`,
      stage: "environment",
      status: study.state.environment.status,
    },
    {
      label: "Keputusan",
      value: decision,
      stage: "recommendation",
      status: study.state.decision.decision,
    },
  ];
  return (
    <div className="reveal">
      <PageHead
        eyebrow="rekam / keterlacakan"
        title="Telusuri setiap kesimpulan ke sumbernya."
        description="Pilih simpul apa pun untuk meninjau kembali rekam sumbernya. Jejak keputusan ini merupakan inovasi konseptual SILICA2CON."
        action={<StatusBadge status="JEJAK LENGKAP" />}
      />
      <Panel className="traceability-card">
        <div className="trace-heading">
          <span className="mono-label">
            Jalur keputusan / {fields.batch || "batch tanpa nama"}
          </span>
          <span className="mono-label">Paving block</span>
        </div>
        <div className="trace-nodes">
          {nodes.map((node, index) => (
            <button
              className="trace-node"
              key={node.label}
              onClick={() => setStage(node.stage)}
            >
              <span
                className={`trace-number ${index === nodes.length - 1 ? "trace-final" : ""}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="trace-node-copy">
                <strong>{node.label}</strong>
                <small>{node.value}</small>
              </span>
              <StatusBadge status={node.status} />
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </Panel>
      <div className="two-column">
        <Panel className="tint-green">
          <div className="panel-icon-title">
            <Check size={17} />
            <h3>Jejak lengkap</h3>
          </div>
          <p className="body-copy">
            Sembilan simpul menghubungkan rekomendasi saat ini dengan input
            tingkat batch dan kesenjangan validasi yang ditampilkan oleh mesin.
          </p>
        </Panel>
        <Panel className="tint-sand">
          <div className="panel-icon-title">
            <Info size={17} />
            <h3>Tidak ada peningkatan status diam-diam</h3>
          </div>
          <p className="body-copy">
            Status tidak diketahui, asumsi, literatur, dan validasi yang
            diperlukan tetap terlihat dan tidak otomatis berubah menjadi lulus.
          </p>
        </Panel>
      </div>
      <Panel className="passport-panel">
        <div className="panel-head">
          <div>
            <h3>Ringkasan paspor material</h3>
            <p>Struktur siap ekspor untuk rekam persisten di masa mendatang.</p>
          </div>
          <span className="mono-label">PAVING BLOCK</span>
        </div>
        <div className="passport-grid">
          <Metric label="ID Batch" value={fields.batch || "DATA DIPERLUKAN"} />
          <Metric label="Sumber" value={fields.source || "DATA DIPERLUKAN"} />
          <Metric
            label="Perlakuan"
            value={fields.preprocessing || "DATA DIPERLUKAN"}
          />
          <Metric
            label="Formulasi"
            value={`${mix.substitution}% massa semen`}
          />
          <Metric
            label="Target partikel"
            value={`${mix.particleSize} μm`}
          />
          <Metric
            label="Biaya / block"
            value={study.state.tea.costPerBlock == null ? "DATA DIPERLUKAN" : formatIdr(study.state.tea.costPerBlock)}
          />
          <Metric
            label="Bukti"
            value={evidenceLabel(study.state.evidence.evidenceClass)}
          />
          <Metric label="Validasi" value="DIPERLUKAN" tone="muted" />
        </div>
      </Panel>
    </div>
  );
}

