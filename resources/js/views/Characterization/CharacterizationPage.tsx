import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  BookOpen,
  CircleHelp,
  ClipboardCheck,
  Database,
  FileText,
  Info,
} from "lucide-react";

import type { Characterization } from "../../engine/study";
import { demoCharacterization } from "../../engine/study";

import Field from "../../components/common/Field";
import Metric from "../../components/common/Metric";
import SelectField from "../../components/common/SelectField";
import StatusBadge from "../../components/common/StatusBadge";

import type { ReactNode } from "react";

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function PageHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <p className="eyebrow eyebrow-gold">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  );
}

function CharacterizationPage({
  fields,
  setFields,
  next,
}: {
  fields: Characterization;
  setFields: (fields: Characterization) => void;
  next: () => void;
}) {
  const update = (key: keyof Characterization) => (value: string) =>
    setFields({ ...fields, [key]: value });

  const sampleReady = Boolean(fields.sample.trim());

  const phaseForDisplay =
    fields.phase === "Amorphous" ? "Amorf" : fields.phase;

  const actualDataCount = [
    fields.sample,
    fields.particle,
    fields.moisture,
    fields.impurity,
  ].filter((value) => value.trim() !== "").length;

  const qualificationStatus = "DATA DIPERLUKAN";

  return (
    <div className="reveal">
      <PageHead
        eyebrow="01 / karakterisasi material"
        title="Karakterisasi material"
        description="Pisahkan konteks literatur dari data batch aktual sebelum material digunakan dalam evaluasi formulasi dan kelayakan."
        action={
          <div className="status-pair">
            <StatusBadge status="DEMO" />
            <StatusBadge status="DIDUKUNG LITERATUR" />
          </div>
        }
      />

      <div className="two-column wide-left">
        <Panel>
          <div className="panel-head">
            <div>
              <h3>Identitas material</h3>
              <p>
                Paspor material mengikuti setiap perhitungan berikutnya.
              </p>
            </div>

            <button
              data-testid="button-load-demo-data"
              className="button button-demo"
              onClick={() => setFields(demoCharacterization)}
            >
              <Database size={14} /> Gunakan data contoh
            </button>
          </div>

          <div className="form-grid">
            <Field
              label="ID Batch"
              value={fields.batch}
              onChange={update("batch")}
              hint="Pengenal studi yang ditentukan pengguna"
              testId="input-batch-id"
            />

            <Field
              label="ID Sampel"
              value={fields.sample}
              onChange={update("sample")}
              hint={
                sampleReady
                  ? "Identitas sampel telah diisi pengguna"
                  : "Wajib untuk menghubungkan data karakterisasi aktual"
              }
              testId="input-sample-id"
            />

            <Field
              label="Sumber material"
              value={fields.source}
              onChange={update("source")}
              hint="PLTP / aliran fluida panas bumi"
              testId="input-residu-source"
            />

            <Field
              label="ID registri material"
              value={fields.materialId}
              onChange={update("materialId")}
              hint="Referensi material · bukan validasi sampel aktual"
              testId="input-material-id"
            />
          </div>

          <div className="notice notice-info">
            <BookOpen size={15} />
            <span>
              Identitas dan nilai literatur digunakan sebagai konteks awal.
              Nilai tersebut tidak otomatis menjadi hasil karakterisasi batch
              aktual.
            </span>
          </div>
          
        <div className="panel-head" style={{ marginTop: "16px" }}>
          <div>
            <h3>Data karakteristik material</h3>
            <p>
              Tandai dengan jelas mana yang berasal dari literatur dan mana
              yang harus diukur pada batch aktual.
            </p>
          </div>
        </div>

       <div className="form-grid">
  <Field
    label="SiO₂ · konteks literatur"
    value={fields.silica}
    onChange={update("silica")}
    suffix="wt.%"
    hint="Literatur · SRC-005 · bukan hasil XRF batch aktual"
    testId="input-silica"
  />

  <SelectField
    label="Fase · konteks literatur"
    value={phaseForDisplay}
    options={[
      "Amorf",
      "Campuran",
      "Kristalin",
      "Tidak diketahui / data diperlukan",
    ]}
    onChange={(value) =>
      update("phase")(
        value === "Amorf" ? "Amorphous" : value,
      )
    }
    hint="Konteks literatur kecuali telah dikonfirmasi melalui XRD batch"
    testId="select-phase"
  />
</div>


<div
  style={{
    marginTop: "24px",
    padding: "16px",
    border: "1px solid rgba(180, 140, 60, 0.28)",
    borderRadius: "12px",
    background: "rgba(180, 140, 60, 0.05)",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "14px",
    }}
  >
    <div>
      <h3 style={{ margin: 0 }}>Evidence Required</h3>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: "13px",
          opacity: 0.72,
        }}
      >
        Parameter berikut harus berasal dari karakterisasi batch aktual.
      </p>
    </div>

    <span className="live-label">DATA DIPERLUKAN</span>
  </div>

  <div className="form-grid">
    <div
      style={{
        padding: "16px",
        border: "1px dashed rgba(180, 140, 60, 0.45)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.55)",
      }}
    >
      <div className="panel-icon-title">
        <Beaker size={16} />
        <h3>Ukuran partikel (D50)</h3>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        Data belum tersedia
      </strong>

      <p className="body-copy">
        Diperlukan hasil Particle Size Distribution (PSD) dari batch aktual.
      </p>

      <span className="live-label">EVIDENCE REQUIRED</span>
    </div>

    <div
      style={{
        padding: "16px",
        border: "1px dashed rgba(180, 140, 60, 0.45)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.55)",
      }}
    >
      <div className="panel-icon-title">
        <Beaker size={16} />
        <h3>Kadar air</h3>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        Data belum tersedia
      </strong>

      <p className="body-copy">
        Diperlukan hasil pengukuran kadar air dari batch aktual.
      </p>

      <span className="live-label">EVIDENCE REQUIRED</span>
    </div>

    <div
      style={{
        padding: "16px",
        border: "1px dashed rgba(180, 140, 60, 0.45)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.55)",
      }}
    >
      <div className="panel-icon-title">
        <Beaker size={16} />
        <h3>Pengotor</h3>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        Data belum tersedia
      </strong>

      <p className="body-copy">
        Diperlukan karakterisasi kimia untuk menentukan kandungan pengotor
        batch aktual.
      </p>

      <span className="live-label">EVIDENCE REQUIRED</span>
    </div>

    <div
      style={{
        padding: "16px",
        border: "1px dashed rgba(180, 140, 60, 0.45)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.55)",
      }}
    >
      <div className="panel-icon-title">
        <Beaker size={16} />
        <h3>Pra-pemrosesan</h3>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        Rute belum ditetapkan
      </strong>

      <p className="body-copy">
        Kondisi pengeringan, penggilingan, atau perlakuan awal harus
        ditetapkan sebelum validasi.
      </p>

      <span className="live-label">EVIDENCE REQUIRED</span>
    </div>
  </div>

  <div
    className="notice notice-info"
    style={{ marginTop: "14px" }}
  >
    <CircleHelp size={15} />
    <span>
      Kartu ini menunjukkan <strong>evidence gap</strong>, bukan kolom
      input yang boleh diisi dengan nilai asumsi atau data literatur.
      Setelah hasil pengukuran batch tersedia, parameter dapat dimasukkan
      sebagai data aktual.
    </span>
  </div>
</div>

 
      </Panel>

        <div className="stack">
          <Panel className="tint-green">
            <div className="panel-icon-title">
              <Beaker size={17} />
              <h3>Status kualifikasi</h3>
              <span className="live-label">{qualificationStatus}</span>
            </div>

            <div className="metric-grid two">
              <Metric
                label="SiO₂ · literatur"
                value={fields.silica || "—"}
                unit={fields.silica ? "wt.%" : undefined}
                tone="green"
                note="SRC-005 · konteks literatur"
              />

              <Metric
                label="Identitas sampel"
                value={sampleReady ? "Tersedia" : "Belum tersedia"}
                tone={sampleReady ? "green" : "muted"}
                note={
                  sampleReady
                    ? "diisi pengguna"
                    : "wajib untuk validasi batch"
                }
              />

              <Metric
                label="Data XRF / XRD"
                value="Diperlukan"
                tone="muted"
                note="belum ada hasil batch aktual"
              />

              <Metric
                label="Keamanan / pelindian"
                value="Diperlukan"
                tone="muted"
                note="bukti untuk penerapan"
              />
            </div>

            <div className="notice notice-info" style={{ marginTop: "16px" }}>
              <AlertTriangle size={15} />
              <span>
                Material belum dapat dikualifikasi sebagai material aktual
                karena bukti batch, XRF/XRD, dan pengujian keamanan belum
                lengkap.
              </span>
            </div>
          </Panel>

          <Panel className="tint-sand">
            <div className="panel-icon-title">
              <FileText size={17} />
              <h3>Konteks literatur</h3>
            </div>

            <p className="body-copy">
              Nilai berikut digunakan sebagai evidence context untuk eksplorasi
              awal. Mesin tidak mengubah evidence literatur menjadi validasi
              batch tanpa identitas sampel dan data karakterisasi aktual.
            </p>

            <div className="source-line">
              <span>SRC-005</span>
              <strong>
                Indeks Aktivitas Silika dari Silica Scaling Panas Bumi
              </strong>
            </div>
          </Panel>

          <Panel>
            <div className="panel-icon-title">
              <ClipboardCheck size={17} />
              <h3>Kesiapan data batch</h3>
            </div>

            <div className="dashboard-gap-list">
              <div>
                <span>{fields.sample ? "✓" : "01"}</span>
                <p>
                  {fields.sample
                    ? "Identitas sampel tersedia"
                    : "ID sampel masih diperlukan"}
                </p>
              </div>

              <div>
                <span>{fields.particle ? "✓" : "02"}</span>
                <p>
                  {fields.particle
                    ? "Ukuran partikel tersedia"
                    : "PSD / D50 masih diperlukan"}
                </p>
              </div>

              <div>
                <span>{fields.moisture ? "✓" : "03"}</span>
                <p>
                  {fields.moisture
                    ? "Kadar air tersedia"
                    : "Kadar air masih diperlukan"}
                </p>
              </div>

              <div>
                <span>{fields.impurity ? "✓" : "04"}</span>
                <p>
                  {fields.impurity
                    ? "Data pengotor tersedia"
                    : "Karakterisasi pengotor masih diperlukan"}
                </p>
              </div>

              <div>
                <span>05</span>
                <p>XRF / XRD batch masih diperlukan</p>
              </div>

              <div>
                <span>06</span>
                <p>Pengujian keamanan / pelindian masih diperlukan</p>
              </div>
            </div>

            <div className="notice notice-info" style={{ marginTop: "16px" }}>
              <Info size={15} />
              <span>
                {actualDataCount} dari 4 data batch utama telah diisi.
                Kelengkapan ini belum berarti material telah tervalidasi.
              </span>
            </div>
          </Panel>
        </div>
      </div>

      <div className="page-actions end">
        <button
          data-testid="button-next-characterization"
          className="button button-dark"
          onClick={next}
        >
          Lanjut ke formulasi <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}