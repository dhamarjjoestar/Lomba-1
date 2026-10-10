import { ArrowLeft, ArrowRight, ClipboardCheck, Info, X } from "lucide-react";
import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type { MixControls, StudyResult } from "../../engine/study";

export default function GatePage({
  study,
  mix,
  next,
  back,
}: {
  study: StudyResult;
  mix: MixControls;
  next: () => void;
  back: () => void;
}) {
  const sni = study.state.sni;
  const technicalGate = study.state.decision.technicalGate;

  const statusFor = (status: string) =>
    status === "PRELIMINARY_PASS"
      ? "LULUS"
      : status === "PRELIMINARY_FAIL"
        ? "GAGAL"
        : status === "UNKNOWN"
          ? "TIDAK DIKETAHUI"
          : "DATA DIPERLUKAN";

  const gateStatus = technicalGate.passed
    ? "Data diperlukan"
    : "Kegagalan awal";

  return (
    <div className="reveal gate-page">
      <PageHead
        title="Gerbang teknis"
        description={`Perbandingan awal terhadap ${
          mix.targetClass === "C"
            ? "Kelas C · pejalan kaki"
            : `Kelas SNI paving block ${mix.targetClass}`
        }. Hasil yang belum memiliki pengujian aktual tetap diperlakukan sebagai data yang diperlukan.`}
        action={
          <span className="standard-chip">
            <ClipboardCheck size={14} />
            {sni.standardId}
          </span>
        }
      />

      {/* STATUS GERBANG */}
      <Panel className="gate-status-card">
        <div className="gate-status-main">
          <div className="gate-status-icon">
            {technicalGate.passed ? (
              <ClipboardCheck size={22} />
            ) : (
              <X size={22} />
            )}{" "}
          </div>

          <div>
            <span className="eyebrow">STATUS GERBANG</span>
            <h3>{gateStatus}</h3>
            <p>
              {technicalGate.passed
                ? "Belum tersedia hasil pengujian paving block aktual untuk menutup gerbang teknis."
                : "Ada parameter yang berada di bawah ambang penyaringan awal."}
            </p>{" "}
          </div>
        </div>

        <div className="gate-status-meta">
          <div>
            <span>PARAMETER</span>
            <strong>{sni.details.length}</strong>
          </div>

          <div>
            <span>KANDIDAT</span>
            <strong>{mix.substitution}%</strong>
          </div>
        </div>
      </Panel>

      {/* TABEL SNI */}
      <Panel className="table-panel gate-table-panel">
        <div className="gate-table-head">
          <div>
            <span className="eyebrow">STANDARD REFERENCE</span>
            <h3>Persyaratan SNI</h3>
            <p>Ambang teknis yang digunakan sebagai acuan paving block.</p>
          </div>

          <span className="gate-standard-id">{sni.standardId}</span>
        </div>

        <div className="table-scroll gate-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Hasil</th>
                <th>Persyaratan</th>
                <th>Status</th>
                <th>Bukti</th>
              </tr>
            </thead>

            <tbody>
              {sni.details.map((row) => (
                <tr
                  data-testid={`row-gate-${row.parameter}`}
                  key={row.parameter}
                >
                  <td>
                    <strong>{row.parameter}</strong>
                  </td>

                  <td className="table-value">
                    {row.actual == null ? "—" : row.actual}
                  </td>

                  <td>
                    <strong>{row.requirement}</strong>
                  </td>

                  <td>
                    <StatusBadge status={statusFor(row.result)} />
                  </td>

                  <td>
                    {row.evidence}
                    <small>{row.validation}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="notice notice-info gate-table-note">
          <Info size={15} />
          <span>
            <strong>Catatan:</strong> gerbang teknis awal bukan pernyataan
            kepatuhan SNI. Pengujian laboratorium aktual tetap diperlukan.
          </span>
        </div>
      </Panel>

      {/* RINGKASAN */}
      <div className="three-column gate-summary-grid">
        <Panel className="tint-sand">
          <span className="eyebrow">STATUS SAAT INI</span>

          <h3>{gateStatus}</h3>

          <p className="body-copy">
            Semua parameter teknis harus memiliki bukti pengujian aktual sebelum
            status dapat dinaikkan.
          </p>
        </Panel>

        <Panel className="tint-green">
          <span className="eyebrow">YANG DIPERLUKAN</span>

          <h3>Pengujian produk</h3>

          <p className="body-copy">
            Kuat tekan 28 hari, penyerapan air, ketahanan aus, dan pengujian
            lain yang berlaku.
          </p>
        </Panel>

        <Panel>
          <span className="eyebrow">KANDIDAT SAAT INI</span>

          <h3>{mix.substitution}% substitusi massa semen</h3>

          <p className="body-copy">
            Formulasi kandidat belum dianggap sebagai bukti kinerja teknis.
          </p>
        </Panel>
      </div>

      {/* ACTION */}
      <div className="page-actions">
        <button className="text-button" onClick={back}>
          <ArrowLeft size={15} />
          Kembali
        </button>

        <button
          data-testid="button-next-gate"
          className="button button-dark"
          onClick={next}
        >
          Tinjau ekonomi
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
