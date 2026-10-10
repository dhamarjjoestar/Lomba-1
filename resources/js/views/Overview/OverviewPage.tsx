import {
  ArrowRight,
  Check,
  CircleHelp,
  FlaskConical,
  Info,
  Layers3,
  Leaf,
  Database,
  Gauge,
  ShieldCheck,
  TestTube2,
} from "lucide-react";

import type {
  Characterization,
  MixControls,
  StudyResult,
} from "../../engine/study";

type OverviewPageProps = {
  study: StudyResult;
  fields: Characterization;
  mix: MixControls;
  next: () => void;
  studyMode?: "demo" | "actual";
};

const workflow = [
  { number: "00", title: "Ringkasan", description: "Konteks studi", icon: Gauge },
  { number: "01", title: "Material", description: "Karakterisasi & qualification", icon: TestTube2 },
  { number: "02", title: "Formulasi", description: "Kandidat campuran", icon: Layers3 },
  { number: "03", title: "Analisis", description: "Hitungan, evidence & DOE", icon: FlaskConical },
  { number: "04", title: "Gerbang Teknis", description: "Persyaratan produk", icon: ShieldCheck },
  { number: "05", title: "Ekonomi", description: "Economic screening", icon: Database },
  { number: "06", title: "Lingkungan", description: "Environmental screening", icon: Leaf },
  { number: "07", title: "Keputusan", description: "Decision yang terlacak", icon: ShieldCheck },
];

export default function OverviewPage({
  study,
  fields,
  mix,
  next,
  studyMode = "demo",
}: OverviewPageProps) {
  const characterization = fields;
  const evidenceClass = study.state.evidence.evidenceClass;
  const standard = study.state.sni.standardId || "SNI 03-0691-1996";

  return (
    <div className="reveal overview-page">
      <div className="overview-header">
        <div>

          <h2>Overview</h2>

          <p className="page-description">
            Pahami kondisi studi, material aktif, dan tahapan evaluasi sebelum
            masuk ke karakterisasi dan formulasi.
          </p>
        </div>

       
      </div>

      <section className="overview-context-grid">
        <div className="overview-context-card">
          <span className="mono-label">BATCH</span>
          <strong>{characterization.batch ||
                (studyMode === "demo" ? "B-2407-018" : "DATA DIPERLUKAN")}</strong>
          <span>Identitas batch material aktif</span>
        </div>

        <div className="overview-context-card">
          <span className="mono-label">MATERIAL</span>
          <strong>
            {characterization.source ||
                (studyMode === "demo"
                  ? "Dieng geothermal silica scaling"
                  : "DATA DIPERLUKAN")}
          </strong>
          <span>Sumber material yang sedang dinilai</span>
        </div>

        <div className="overview-context-card">
          <span className="mono-label">APLIKASI</span>
          <strong>Paving Block</strong>
          <span>Platform validasi utama</span>
        </div>

        <div className="overview-context-card">
          <span className="mono-label">STANDARD</span>
          <strong>{standard}</strong>
          <span>Referensi technical gate</span>
        </div>
      </section>

      <section className="overview-panel pipeline-overview-panel">
        <div className="overview-section-head">
          <div>
            <p className="eyebrow">WORKFLOW</p>
            <h3>Alur evaluasi SILICA2CON</h3>
          </div>

          <span className="overview-note">Material menjadi titik awal</span>
        </div>

        <div className="overview-workflow">
          {workflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                className={`overview-workflow-step ${index === 0 ? "is-current" : "is-upcoming"}`}
              >
                <div className="overview-workflow-top">
                  <span>{item.number}</span>
                  <Icon size={16} />
                </div>

                <strong>{item.title}</strong>
                <small>{item.description}</small>

                {index < workflow.length - 1 && (
                  <ArrowRight className="overview-workflow-arrow" size={15} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="overview-main-grid">
        <section className="overview-panel">
          <div className="overview-section-head">
            <div>
              <p className="eyebrow">MATERIAL SNAPSHOT</p>
              <h3>Karakterisasi awal</h3>
            </div>

            <span className={`overview-demo-badge ${studyMode === "actual" ? "is-actual" : ""}`}>
              {studyMode === "demo" ? "Data Demo" : "Batch Aktual"}
            </span>
          </div>

          <div className="overview-material-grid overview-material-grid-3x3">
            <div className="overview-material-item">
              <span>SiO₂</span>
              <strong>{characterization.silica || (studyMode === "demo" ? "95.7" : "DATA DIPERLUKAN")} <em>wt.%</em></strong>
              <small>kandungan silika</small>
            </div>

            <div className="overview-material-item">
              <span>Fase material</span>
              <strong>{characterization.phase || (studyMode === "demo" ? "Amorf" : "DATA DIPERLUKAN")}</strong>
              <small>status mineralogi</small>
            </div>

            <div className="overview-material-item">
              <span>Ukuran partikel</span>
              <strong>{characterization.particle || "DATA DIPERLUKAN"} <em>μm</em></strong>
              <small>D50 · batch aktual</small>
            </div>

            <div className="overview-material-item">
              <span>Kadar air</span>
              <strong>{characterization.moisture || "DATA DIPERLUKAN"} <em>%</em></strong>
              <small>moisture content</small>
            </div>

            <div className="overview-material-item">
              <span>Pengotor</span>
              <strong>{characterization.impurity || "DATA DIPERLUKAN"} <em>%</em></strong>
              <small>impurity fraction</small>
            </div>

            <div className="overview-material-item">
              <span>Pra-pemrosesan</span>
              <strong>{characterization.preprocessing || "DATA DIPERLUKAN"}</strong>
              <small>rute perlakuan material</small>
            </div>

            <div className="overview-material-item">
              <span>ID sampel</span>
              <strong>{characterization.sample || "DATA DIPERLUKAN"}</strong>
              <small>identitas spesimen</small>
            </div>

            <div className="overview-material-item">
              <span>Kelas evidence</span>
              <strong>{evidenceClass || "DATA DIPERLUKAN"}</strong>
              <small>bukti yang tersedia</small>
            </div>

            <div className="overview-material-item overview-material-item-accent">
              <span>Substitusi aktif</span>
              <strong>{mix.substitution} <em>%</em></strong>
              <small>basis massa semen</small>
            </div>
          </div>

          <div className="overview-inline-note">
            <Info size={14} />
            <span>
              {studyMode === "demo"
                ? "Nilai pada tampilan ini digunakan sebagai demonstrasi antarmuka dan belum menjadi bukti validasi eksperimen."
                : "Nilai yang tampil mengikuti input studi saat ini; keberadaan input tidak otomatis berarti validasi eksperimen."}
            </span>
          </div>
        </section>

        <section className="overview-panel overview-readiness-panel">
          <div className="overview-section-head">
            <div>
              <p className="eyebrow">READINESS</p>
              <h3>Kesiapan studi</h3>
            </div>

            <CircleHelp size={18} />
          </div>

          <div className="overview-readiness-item">
            <div className={`overview-readiness-icon ${characterization.batch && characterization.source ? "" : "muted"}`}>
              {characterization.batch && characterization.source ? <Check size={14} /> : <CircleHelp size={14} />}
            </div>

            <div>
              <strong>Material teridentifikasi</strong>
              <span>
                {characterization.batch && characterization.source
                  ? "Batch dan sumber material tersedia."
                  : "ID batch dan sumber material masih diperlukan."}
              </span>
            </div>
          </div>

          <div className="overview-readiness-item">
            <div className="overview-readiness-icon muted">
              <CircleHelp size={14} />
            </div>

            <div>
              <strong>Technical evidence</strong>
              <span>Literatur tersedia sebagai konteks; pengujian produk aktual belum lengkap.</span>
            </div>
          </div>

          <div className="overview-readiness-item">
            <div className="overview-readiness-icon muted">
              <CircleHelp size={14} />
            </div>

            <div>
              <strong>Validation status</strong>
              <span>Evidence: {evidenceClass || "DATA_REQUIRED"}; validasi eksperimen belum lengkap.</span>
            </div>
          </div>
        </section>
      </div>

      <section className="overview-next-panel">
        <div>
          <p className="eyebrow eyebrow-gold">NEXT ACTION</p>
          <h3>Mulai dari karakterisasi material</h3>
          <p>
            Lengkapi atau tinjau data batch sebelum SILICA2CON membentuk dan
            mengevaluasi kandidat formulasi.
          </p>
        </div>

        <button className="button button-dark button-large" onClick={next}>
          Mulai Karakterisasi
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
