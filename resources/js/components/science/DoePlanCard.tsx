import { Beaker, Info } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import type { DoePlan } from "../../engine/lib/doe";

export default function DoePlanCard({ plan }: { plan: DoePlan }) {
  const ready = plan.status === "READY_FOR_DESIGN";

  return (
    <section className={`doe-plan-card ${ready ? "is-ready" : "is-blocked"}`}>
      <div className="doe-plan-head">
        <div>
          <span className="eyebrow">SCIENCE ENGINE · EXPERIMENT DESIGN</span>
          <h3>Rancangan DOE kandidat</h3>
          <p>
            Matriks ini menyiapkan eksperimen dua faktor tanpa membuat data hasil
            pengujian sintetis.
          </p>
        </div>
        <StatusBadge status={ready ? "READY FOR DESIGN" : "DATA_REQUIRED"} />
      </div>

      <div className="doe-factor-grid">
        {plan.factors.map((factor) => (
          <div className="doe-factor" key={factor.key}>
            <div className="doe-factor-top">
              <strong>{factor.label}</strong>
              <span>{factor.unit}</span>
            </div>
            <div className="doe-levels">
              {factor.levels.map((level) => (
                <div className="doe-level" key={level.label}>
                  <span>{level.label}</span>
                  <strong>{level.value == null ? "BELUM DITENTUKAN" : level.value}</strong>
                </div>
              ))}
            </div>
            <small>{factor.note}</small>
          </div>
        ))}
      </div>

      <div className="doe-response-grid">
        {plan.responses.map((response) => (
          <div key={response.key}>
            <span>{response.role === "PRIMARY_RESPONSE" ? "RESPONS UTAMA" : "RESPONS PENDUKUNG"}</span>
            <strong>{response.label}</strong>
            <small>{response.unit}</small>
          </div>
        ))}
      </div>

      <div className="doe-model-strip">
        <div>
          <span>MODEL PATH</span>
          <strong>DOE → ANOVA → RSM</strong>
        </div>
        <div>
          <span>STATUS DATA</span>
          <strong>{plan.model.status === "WAITING_FOR_EXPERIMENTAL_DATA" ? "MENUNGGU DATA EKSPERIMEN" : "SIAP ANALISIS"}</strong>
        </div>
      </div>

      {plan.runs.length > 0 && (
        <div className="doe-runs">
          <div className="doe-section-title">
            <div>
              <span>RUN PLAN</span>
              <strong>{plan.runCount || "—"} kombinasi terdefinisi</strong>
            </div>
            <Beaker size={16} />
          </div>
          <div className="doe-runs-table">
            <div className="doe-run-row doe-run-header">
              <span>Run</span><span>Substitusi</span><span>Partikel</span><span>Status</span>
            </div>
            {plan.runs.map((run) => (
              <div className="doe-run-row" key={`${run.run}-${run.status}`}>
                <span>{String(run.run).padStart(2, "0")}</span>
                <span>{run.substitutionPct == null ? "—" : `${run.substitutionPct}%`}</span>
                <span>{run.particleSizeUm == null ? "—" : `${run.particleSizeUm} μm`}</span>
                <span>{run.status === "PLANNED" ? "TERENCANA" : "TERBLOKIR"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="doe-notes">
        <Info size={14} />
        <div>{plan.notes.map((note) => <p key={note}>{note}</p>)}</div>
      </div>
    </section>
  );
}
