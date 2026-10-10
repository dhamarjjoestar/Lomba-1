import {
  Beaker,
  Database,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import Field from "../../components/common/Field";
import SelectField from "../../components/common/SelectField";
import Panel from "../../components/ui/Panel";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type {
  Characterization,
  DemoDatasetId,
  StudyResult,
} from "../../engine/study";
import { demoDatasets } from "../../engine/study";

const FIXED_SOURCE = "Dieng geothermal silica-rich residue";
const PHASE_OPTIONS = ["Amorf", "Kristalin", "Campuran"];

const PHASE_GUIDANCE: Record<
  string,
  { label: string; tone: "preferred" | "conditional" | "lower"; description: string }
> = {
  Amorf: {
    label: "Fase yang diprioritaskan",
    tone: "preferred",
    description:
      "Indikator awal yang paling relevan untuk screening sementisius karena silika amorf cenderung lebih reaktif. Tetap perlu didukung karakterisasi dan evidence lain.",
  },
  Campuran: {
    label: "Perlu verifikasi lebih lanjut",
    tone: "conditional",
    description:
      "Material mengandung kombinasi fase. Kelayakan tidak dapat ditentukan dari label campuran saja; fraksi amorf dan bukti aktivitas tetap perlu diperiksa.",
  },
  Kristalin: {
    label: "Prioritas lebih rendah",
    tone: "lower",
    description:
      "Fase kristalin dominan bukan indikasi utama yang kita cari untuk reaktivitas pozzolanik. Perlakuan dan evidence tambahan perlu dipertimbangkan sebelum formulasi.",
  },
};

function getParticleClass(value: string) {
  const parsed = Number(value.replace(",", "."));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return {
      label: "Belum terklasifikasi",
      range: "Masukkan ukuran partikel",
      description: "Klasifikasi akan muncul setelah ukuran partikel diisi.",
    };
  }

  if (parsed < 0.1) {
    return {
      label: "Nanoscale",
      range: "< 0,1 μm",
      description:
        "Skala nano. Dapat memiliki reaktivitas tinggi, tetapi efek aglomerasi dan workability tetap perlu diperhatikan.",
    };
  }

  if (parsed <= 100) {
    return {
      label: "Microscale",
      range: "0,1–100 μm",
      description:
        "Skala mikrometer. Gunakan sebagai klasifikasi ukuran, bukan sebagai verdict kualitas material.",
    };
  }

  return {
    label: "Larger particle",
    range: "> 100 μm",
    description:
      "Partikel relatif kasar. Dampak ukuran perlu dibaca bersama proses penghalusan, dispersi, dan target formulasi.",
  };
}

export default function CharacterizationPage({
  fields,
  setFields,
  next,
  study,
  studyMode = "demo",
  datasetId = "qualified",
  selectDataset,
}: {
  fields: Characterization;
  setFields: (fields: Characterization) => void;
  next: () => void;
  study: StudyResult;
  studyMode?: "demo" | "actual";
  datasetId?: DemoDatasetId;
  selectDataset?: (id: DemoDatasetId) => void;
}) {
  const update =
    (key: keyof Characterization) =>
    (value: string) => {
      setFields({ ...fields, [key]: value });
    };

  const updateBatch = (value: string) => {
    setFields({
      ...fields,
      batch: value,
      sample: value,
      materialId: value,
    });
  };

  const studyQualification = study.science.materialQualification;
  const batchReady = Boolean(fields.batch.trim());
  const phaseGuidance = fields.phase ? PHASE_GUIDANCE[fields.phase] : null;
  const particleClass = getParticleClass(fields.particle);

  const qualificationStatusLabel =
    studyQualification.status === "QUALIFIED"
      ? "QUALIFIED"
      : studyQualification.status === "CONDITIONAL"
        ? "CONDITIONAL"
        : "INCOMPLETE";

  const qualificationTitle =
    studyQualification.status === "QUALIFIED"
      ? "Data minimum terpenuhi"
      : studyQualification.status === "CONDITIONAL"
        ? "Data dapat dilanjutkan dengan catatan"
        : "Data belum cukup untuk qualification";

  return (
    <div className="reveal characterization-v2">
      <PageHead
        title="Karakterisasi material"
        description="Identifikasi material, catat hasil karakterisasi batch, lalu periksa status material qualification sebelum masuk ke formulasi."
        action={
          <div className="characterization-status">
            <span className={batchReady ? "is-ready" : ""}>
              {batchReady ? "BATCH TERISI" : "BATCH DIPERLUKAN"}
            </span>
            <StatusBadge status={studyQualification.status} />
          </div>
        }
      />

      <div className="characterization-overview-strip">
        <div>
          <span className="eyebrow">ACTIVE MATERIAL</span>
          <strong>{fields.batch || "BATCH BELUM DIISI"}</strong>
          <small>{fields.source || "Sumber belum ditetapkan"}</small>
        </div>

        <div>
          <span>STATUS QUALIFICATION</span>
          <strong>{qualificationStatusLabel}</strong>
          <small>{studyQualification.completeness}% data tersedia</small>
        </div>

        <div>
          <span>APLIKASI</span>
          <strong>PAVING BLOCK</strong>
          <small>platform validasi awal</small>
        </div>
      </div>

      <div className="characterization-grid">
        <Panel className="char-card char-identity">
          <div className="char-card-head">
            <div>
              <span className="eyebrow">01 · IDENTITAS</span>
              <h3>Identitas bahan &amp; batch</h3>
              <p>Batch menjadi kunci identitas material dan traceability.</p>
            </div>
            <Database size={19} />
          </div>

          {studyMode === "demo" && selectDataset && (
            <div className="demo-dataset-selector">
              <div>
                <span className="eyebrow">DATA DEMO</span>
                <strong>Pilih dataset</strong>
                <p>Dataset digunakan untuk demonstrasi alur sistem.</p>
              </div>

              <div className="demo-dataset-options">
                {demoDatasets.map((dataset) => (
                  <button
                    type="button"
                    key={dataset.id}
                    className={`demo-dataset-option demo-dataset-${dataset.id} ${
                      datasetId === dataset.id ? "selected" : ""
                    }`}
                    onClick={() => selectDataset(dataset.id)}
                  >
                    <span className="demo-dataset-pill">
                      {dataset.id.toUpperCase()}
                    </span>
                    <strong>{dataset.label}</strong>
                    <span>{dataset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="char-identity-grid">
            {studyMode === "demo" && selectDataset ? (
              <SelectField
                label="ID Batch"
                value={fields.batch}
                options={[
                  "",
                  ...demoDatasets
                    .map((item) => item.characterization.batch)
                    .filter(Boolean),
                ]}
                onChange={updateBatch}
                hint="Pilih batch demo."
                testId="input-batch-id"
              />
            ) : (
              <Field
                label="ID Batch"
                value={fields.batch}
                onChange={updateBatch}
                hint="ID utama studi."
                testId="input-batch-id"
              />
            )}

            <Field
              label="ID Sampel"
              value={fields.sample}
              readOnly
              hint="Mengikuti ID batch."
              testId="input-sample-id"
            />

            <Field
              label="Sumber material"
              value={fields.source || FIXED_SOURCE}
              readOnly
              hint="Domain riset SILICA2CON."
              testId="input-residu-source"
            />

            <Field
              label="ID registri material"
              value={fields.materialId}
              readOnly
              hint="Mengikuti ID batch."
              testId="input-material-id"
            />
          </div>

          <div className="char-lock-note">
            <LockKeyhole size={14} />
            <span>Identitas material dikunci untuk menjaga traceability.</span>
          </div>

          <div className="char-identity-readout">
            <div>
              <span>Material aktif</span>
              <strong>{fields.source || FIXED_SOURCE}</strong>
            </div>

            <div>
              <span>Trace key</span>
              <strong>{fields.batch || "BATCH BELUM DIISI"}</strong>
            </div>
          </div>
        </Panel>

        <Panel className="char-card char-lab">
          <div className="char-card-head">
            <div>
              <span className="eyebrow">02 · HASIL LAB</span>
              <h3>Karakterisasi batch</h3>
              <p>Masukkan hasil pengukuran batch aktual yang tersedia.</p>
            </div>

            <span className="char-lab-badge">
              <Beaker size={13} /> INPUT LAB
            </span>
          </div>

          <div className="char-lab-grid char-lab-grid-main">
            <Field
              label="SiO₂"
              value={fields.silica}
              onChange={update("silica")}
              suffix="wt.%"
              numericOnly
              hint="Kadar karakterisasi."
              testId="input-silica"
            />

            <SelectField
              label="Fase material"
              value={fields.phase}
              options={["", ...PHASE_OPTIONS]}
              onChange={update("phase")}
              hint="Pilih fase hasil karakterisasi."
              testId="input-phase"
            />

            <Field
              label="Ukuran partikel (D50)"
              value={fields.particle}
              onChange={update("particle")}
              suffix="μm"
              numericOnly
              hint="Nilai numerik untuk menentukan kelas ukuran."
              testId="input-particle"
            />

            <Field
              label="Kadar air"
              value={fields.moisture}
              onChange={update("moisture")}
              suffix="%"
              numericOnly
              hint="Kadar air batch."
              testId="input-moisture"
            />

            <Field
              label="Pengotor"
              value={fields.impurity}
              onChange={update("impurity")}
              suffix="%"
              numericOnly
              hint="Kadar pengotor."
              testId="input-impurity"
            />

            <Field
              label="Pra-pemrosesan"
              value={fields.preprocessing}
              onChange={update("preprocessing")}
              hint="Perlakuan awal material."
              testId="input-preprocessing"
            />
          </div>

          {phaseGuidance && (
            <div className={`phase-guidance phase-guidance-${phaseGuidance.tone}`}>
              <div>
                <span className="eyebrow">PHASE ASSESSMENT</span>
                <strong>{phaseGuidance.label}</strong>
              </div>
              <p>{phaseGuidance.description}</p>
            </div>
          )}

          <div className="particle-classification">
            <div>
              <span className="eyebrow">PARTICLE CLASS</span>
              <strong>{particleClass.label}</strong>
              <small>{particleClass.range}</small>
            </div>
            <p>{particleClass.description}</p>
          </div>
        </Panel>

        <Panel
          className={`char-card char-qualification science-qualification science-qualification-${studyQualification.status.toLowerCase()}`}
        >
          <div className="char-card-head">
            <div>
              <span className="eyebrow">03 · QUALIFICATION</span>
              <h3>Material Qualification</h3>
              <p>Menilai kecukupan data material sebelum formulasi.</p>
            </div>

            <StatusBadge status={studyQualification.status} />
          </div>

          <div className="qualification-hero-row">
            <div>
              <span className="qualification-kicker">STATUS</span>
              <h4>{qualificationStatusLabel}</h4>
              <p>
                {qualificationTitle}. Status ini bukan klaim kepatuhan produk.
              </p>
            </div>

            <div className="qualification-score">
              <strong>{studyQualification.completeness}%</strong>
              <span>data lengkap</span>
            </div>
          </div>

          <div className="qualification-progress">
            <span
              style={{
                width: `${studyQualification.completeness}%`,
              }}
            />
          </div>

          <div className="qualification-grid">
            <div>
              <span className="eyebrow">DATA YANG DINILAI</span>

              {studyQualification.required.map((item) => {
                const missing = studyQualification.missing.includes(item);

                return (
                  <div
                    className={`qualification-check ${
                      missing ? "missing" : "ready"
                    }`}
                    key={item}
                  >
                    <span>{missing ? "!" : "✓"}</span>
                    <strong>{item}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        <Panel className="char-card char-next">
          <div className="char-next-icon">
            <Layers3 size={20} />
          </div>

          <div>
            <span className="eyebrow">BERIKUTNYA</span>
            <h3>Formulasi paving block</h3>
            <p>
              Material yang memenuhi gate dapat diteruskan ke tahap formulasi;
              data yang belum cukup tetap ditahan sesuai status qualification.
            </p>

            <button className="button button-dark" onClick={next}>
              Lanjut ke formulasi <span>→</span>
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
