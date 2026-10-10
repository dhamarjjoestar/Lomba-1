import { ArrowLeft, ArrowRight, Scale, Info, Network, X } from "lucide-react";
import Field from "../../components/common/Field";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type { StudyResult } from "../../engine/study";

export default function ValidationPage({
  study,
  next,
  back,
}: {
  study: StudyResult;
  next: () => void;
  back: () => void;
}) {
  const sourceCards = {
    material: [
      {
        year: "2014",
        authors: "Utami, W. S., Herdianita, N. R., & Atmaja, R. W.",
        title:
          "The Effect of Temperature and pH on the Formation of Silica Scaling of Dieng Geothermal Field, Central Java, Indonesia",
        journal:
          "Proceedings, Thirty-Ninth Workshop on Geothermal Reservoir Engineering",
        doi: "—",
        url: null,
      },
      {
        year: "2015",
        authors: "Pambudi, N. A., Itoi, R., Yamashiro, R., et al.",
        title:
          "The Behavior of Silica in Geothermal Brine from Dieng Geothermal Power Plant, Indonesia",
        journal: "Geothermics, 54, 109–114",
        doi: "10.1016/j.geothermics.2014.12.003",
        url: "https://doi.org/10.1016/j.geothermics.2014.12.003",
      },
      {
        year: "2018",
        authors:
          "Agustinus, E. T. S., Syafri, I., Rosana, M. F., & Zulkarnain, I.",
        title:
          "Scale Prevention Technique to Minimized Scaling on Re-Injection Pipes in Dieng Geothermal Field, Central Java Province, Indonesia",
        journal: "Indonesian Journal on Geoscience, 5(2), 129–136",
        doi: "10.17014/ijog.5.2.129-136",
        url: "https://doi.org/10.17014/ijog.5.2.129-136",
      },
      {
        year: "2022",
        authors: "Mulyana, C., Mahmudah, & Faizal, F.",
        title:
          "Analysis of Silica Activity Index from Geothermal Silica Scaling",
        journal: "Journal of Physics: Conference Series, 2344(1), 012016",
        doi: "10.1088/1742-6596/2344/1/012016",
        url: "https://doi.org/10.1088/1742-6596/2344/1/012016",
      },
      {
        year: "2023",
        authors: "Ilman, M. H. S. N. et al.",
        title: "Synthesis of Mesoporous Silica SBA-15 from Geothermal Sludge",
        journal: "Materialia, 27, 101637",
        doi: "10.1016/j.mtla.2022.101637",
        url: "https://doi.org/10.1016/j.mtla.2022.101637",
      },
      {
        year: "2021",
        authors: "Widiyandari, H., Adhani, S. H., Subagio, A., & Purwanto, A.",
        title:
          "Synthesis of Silica Xerogel from Geothermal Sludge by Ultrasonic Assisted Alkali Extraction-Acid Precipitation",
        journal: "—",
        doi: "—",
        url: null,
      },
    ],

    cement: [
      {
        year: "2015",
        authors: "Meiyati, I. N., Agustin, R. S., & Murtiono, E. S.",
        title:
          "Pemanfaatan Lumpur Geothermal (Geothermal Sludge) untuk Pengganti Sebagian Semen terhadap Kuat Tekan Mortar",
        journal: "Indonesian Journal of Civil Engineering Education, 2(2)",
        doi: "10.20961/ijcee.v2i2.17936",
        url: "https://doi.org/10.20961/ijcee.v2i2.17936",
      },
      {
        year: "2019",
        authors: "Salim, M. F., Diastyari, D. E., & Widodo, L. U. W.",
        title: "Pemanfaatan Geothermal Sludge untuk Pembuatan Bata Ringan",
        journal: "Jurnal Teknik Kimia, 13(2), 57–60",
        doi: "10.33005/tekkim.v13i2.1411",
        url: "https://doi.org/10.33005/tekkim.v13i2.1411",
      },
      {
        year: "2023",
        authors: "Samudera, B., Maulana, A. I., & Wahyudi, B.",
        title:
          "The Effect of Geothermal Sludge Silica on the Characteristics of Concrete Brick",
        journal:
          "International Journal of Research Publications, 127(1), 327–330",
        doi: "10.47119/IJRP1001271620235159",
        url: "https://doi.org/10.47119/IJRP1001271620235159",
      },
      {
        year: "2021",
        authors: "Petrus, H. T. B. M. et al.",
        title:
          "Green Geopolymer Cement with Dry Activator from Geothermal Sludge and Sodium Hydroxide",
        journal: "Journal of Cleaner Production, 293, 126143",
        doi: "10.1016/j.jclepro.2021.126143",
        url: "https://doi.org/10.1016/j.jclepro.2021.126143",
      },
    ],

    performance: [
      {
        year: "2021",
        authors:
          "Liu, C., Su, X., Wu, Y., Zheng, Z., Yang, B., Luo, Y., Yang, J., & Yang, J.",
        title:
          "Effect of Nano-Silica as Cementitious Materials-Reducing Admixtures on the Workability, Mechanical Properties and Durability of Concrete",
        journal: "Nanotechnology Reviews, 10(1), 1395–1409",
        doi: "10.1515/ntrev-2021-0097",
        url: "https://doi.org/10.1515/ntrev-2021-0097",
      },
      {
        year: "2024",
        authors: "Chen, G., Pu, T., Ma, J., Zhang, Q., Li, Z., & Cheng, Z.",
        title:
          "Use of Nano-Silica as a Supplementary Cementitious Material in Recycled Aggregate Concrete",
        journal: "Waste and Biomass Valorization, 15(11), 6267–6279",
        doi: "10.1007/s12649-024-02541-0",
        url: "https://doi.org/10.1007/s12649-024-02541-0",
      },
      {
        year: "2024",
        authors:
          "López-Perales, J. F., Alonso-Alonso, M. C., Vázquez-Rodríguez, F. J., et al.",
        title:
          "Geothermal Nano-SiO₂ Waste as a Supplementary Cementitious Material for Concrete Exposed at High Critical Temperatures",
        journal: "Materials, 17(17), 4381",
        doi: "10.3390/ma17174381",
        url: "https://doi.org/10.3390/ma17174381",
      },
      {
        year: "2024",
        authors: "Xiaohan, Z., Ahmad, J., Jebur, Y. M., & Deifalla, A. F.",
        title: "A Review on Partial Substitution of Nanosilica in Concrete",
        journal: "Reviews on Advanced Materials Science, 63(1), 20230157",
        doi: "10.1515/rams-2023-0157",
        url: "https://doi.org/10.1515/rams-2023-0157",
      },
      {
        year: "2026",
        authors:
          "Affan, H., Fehr, L., Al-Massri, G., Alassaad, F., Yaghi, A., & Ghanem, H.",
        title:
          "Strength, Transport Properties, and Life Cycle Impacts of Mortar Containing German Natural Pozzolan",
        journal: "Infrastructures, 11(2), 67",
        doi: "10.3390/infrastructures11020067",
        url: "https://doi.org/10.3390/infrastructures11020067",
      },
    ],
  };

  const SourceCard = ({
    source,
  }: {
    source: (typeof sourceCards.material)[number];
  }) => (
    <article className="roadmap-source-card">
      <div className="roadmap-source-top">
        <span className="roadmap-source-year">{source.year}</span>

        <span className="roadmap-source-type">LITERATUR</span>
      </div>

      <h4>{source.title}</h4>

      <p className="roadmap-source-authors">{source.authors}</p>

      <p className="roadmap-source-journal">{source.journal}</p>

      {source.doi !== "—" && (
        <div className="roadmap-source-bottom">
          <code>{source.doi}</code>

          {source.url && (
            <a href={source.url} target="_blank" rel="noreferrer">
              Buka DOI
              <ArrowRight size={12} />
            </a>
          )}
        </div>
      )}
    </article>
  );

  const Milestone = ({
    number,
    eyebrow,
    title,
    description,
    stage,
    sources,
    tone = "green",
  }: {
    number: string;
    eyebrow: string;
    title: string;
    description: string;
    stage: string;
    sources: typeof sourceCards.material;
    tone?: "green" | "gold";
  }) => (
    <section className={`roadmap-milestone roadmap-${tone}`}>
      <div className="roadmap-milestone-index">{number}</div>

      <div className="roadmap-milestone-body">
        <div className="roadmap-milestone-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>

            <h3>{title}</h3>

            <p>{description}</p>
          </div>

          <span className="roadmap-stage-tag">{stage}</span>
        </div>

        <div className="roadmap-source-heading">
          <span>SUMBER YANG MENDASARI</span>
          <strong>{sources.length} publikasi</strong>
        </div>

        <div className="roadmap-source-grid">
          {sources.map((source) => (
            <SourceCard
              key={`${source.year}-${source.title}`}
              source={source}
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="reveal validation-roadmap">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <PageHead
        eyebrow="SUPPORT / peta jalan penelitian"
        title="Dari literatur menuju validasi paving block."
        description="Roadmap ini menghubungkan basis literatur, kesenjangan penelitian, eksperimen, dan verifikasi teknis menjadi satu jalur kerja yang dapat ditelusuri."
        action={<StatusBadge status="LITERATURE → EXPERIMENT → VALIDATION" />}
      />

      <section className="roadmap-command validation-active-study">
        <div className="roadmap-command-main">
          <span className="eyebrow">ACTIVE STUDY LINK</span>
          <h3>
            {study.state.formulation.targetClass} ·{" "}
            {study.state.formulation.replacementValue ?? "—"}% substitution
          </h3>
          <p>
            Validasi yang dicatat nanti harus merujuk pada batch, sampel, dan
            formulasi aktif ini; literatur di bawah tetap bukan hasil validasi
            internal.
          </p>
        </div>
        <div className="roadmap-command-status">
          <span>BATCH / SAMPLE</span>
          <strong>{study.state.material.status}</strong>
          <small>
            Qualification active study: {study.state.material.completeness}%
            lengkap
          </small>
        </div>
      </section>

      {/* =====================================================
          ROADMAP INTRO
          ===================================================== */}
      <section className="roadmap-command">
        <div className="roadmap-command-main">
          <span className="eyebrow">RESEARCH CONTROL ROOM</span>

          <h3>Evidence → Gap → Experiment → Gate</h3>

          <p>
            Literatur digunakan untuk membangun ruang kandidat. Eksperimen
            aktual kemudian diperlukan untuk mengubah kandidat menjadi bukti
            yang dapat diverifikasi.
          </p>
        </div>

        <div className="roadmap-command-status">
          <span>DOMAIN</span>
          <strong>PAVING BLOCK</strong>

          <small>Fokus validasi utama SILICA2CON</small>
        </div>
      </section>

      {/* =====================================================
          TIMELINE
          ===================================================== */}
      <div className="roadmap-flow">
        <Milestone
          number="01"
          eyebrow="FOUNDATION"
          title="Basis material geothermal"
          stage="MATERIAL"
          description="Bangun konteks material dari literatur geothermal Dieng dan jalur pengolahan silica/sludge."
          sources={sourceCards.material}
          tone="green"
        />

        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        <Milestone
          number="02"
          eyebrow="APPLICATION"
          title="Substitusi material semen"
          stage="MATERIAL → BINDER"
          description="Gunakan literatur yang membahas geothermal sludge, silica, mortar, brick, dan geopolymer sebagai basis pengembangan."
          sources={sourceCards.cement}
          tone="gold"
        />

        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        <Milestone
          number="03"
          eyebrow="PERFORMANCE"
          title="Kinerja material"
          stage="MECHANICAL / DURABILITY"
          description="Gunakan literatur pendukung untuk memahami aspek workability, mekanik, durability, dan dampak siklus hidup."
          sources={sourceCards.performance}
          tone="green"
        />

        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        {/* ===================================================
            GAP
            =================================================== */}
        <section className="roadmap-gap-panel">
          <div className="roadmap-gap-mark">GAP</div>

          <div>
            <span className="eyebrow">RESEARCH GAP</span>

            <h3>Literatur belum menggantikan validasi paving block aktual.</h3>

            <p>
              Bukti yang tersedia berasal dari konteks material, mortar,
              concrete, brick, dan literatur nano-silica. Langkah berikutnya
              adalah membuktikan kandidat SILICA2CON pada produk paving block
              aktual.
            </p>
          </div>
        </section>

        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        {/* ===================================================
            EXPERIMENT
            =================================================== */}
        <section className="roadmap-experiment-panel">
          <div className="roadmap-experiment-head">
            <div>
              <span className="eyebrow">04 · EXPERIMENT</span>

              <h3>Matriks eksperimen paving block</h3>

              <p>
                Jalankan matriks terkontrol di sekitar rentang bukti langsung{" "}
                {study.directRange}.
              </p>
            </div>

            <span className="roadmap-experiment-badge">
              VALIDASI DIPERLUKAN
            </span>
          </div>

          <div className="roadmap-experiment-grid">
            {study.state.validation.map((step, index) => (
              <div key={step.parameter}>
                <span>{String(index + 1).padStart(2, "0")}</span>

                <strong>{step.parameter}</strong>

                <p>{step.why}</p>

                <small>
                  {step.status === "VALIDATION_REQUIRED"
                    ? "VALIDASI DIPERLUKAN"
                    : "DATA DIPERLUKAN"}{" "}
                  · PRIORITAS {step.priority}
                </small>
              </div>
            ))}
          </div>
        </section>

        <div className="roadmap-connector"></div>
        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        {/* ===================================================
            TECHNICAL GATE
            =================================================== */}
        <section className="roadmap-gate-panel">
          <div>
            <span className="eyebrow">05 · TECHNICAL GATE</span>

            <h3>Verifikasi terhadap SNI 03-0691-1996</h3>

            <p>
              Hasil eksperimen aktual dibandingkan dengan persyaratan teknis
              paving block sebelum status dapat dinaikkan.
            </p>
          </div>

          <div className="roadmap-gate-status">
            <span>STATUS SAAT INI</span>
            <strong>
              {study.state.sni.status === "PRELIMINARY_PASS"
                ? "PRELIMINARY PASS"
                : study.state.sni.status === "PRELIMINARY_FAIL"
                  ? "PRELIMINARY FAIL"
                  : study.state.sni.status === "DATA_REQUIRED"
                    ? "DATA DIPERLUKAN"
                    : "UNKNOWN"}
            </strong>
          </div>
        </section>

        <div className="roadmap-connector">
          <span />
          <ArrowRight size={15} />
        </div>

        {/* ===================================================
            SCALE UP
            =================================================== */}
        <section className="roadmap-scale-panel">
          <div>
            <span className="eyebrow">06 · SCALE-UP</span>

            <h3>Dari validasi menuju kesiapan implementasi</h3>

            <p>
              Setelah performa teknis tervalidasi, hasil dapat dibawa ke
              evaluasi ekonomi, lingkungan, dan keterlacakan batch.
            </p>
          </div>

          <div className="roadmap-scale-grid">
            <span>TEKNIS</span>
            <span>EKONOMI</span>
            <span>LINGKUNGAN</span>
            <span>KETERLACAKAN</span>
          </div>
        </section>
      </div>

      {/* =====================================================
          NOTE
          ===================================================== */}
      <section className="roadmap-literature-note">
        <Info size={16} />

        <div>
          <strong>Posisi literatur</strong>

          <p>
            Kartu sumber di atas berfungsi sebagai landasan literatur. Literatur
            tidak otomatis menjadi hasil eksperimen SILICA2CON dan tidak
            digunakan sebagai pengganti validasi batch aktual.
          </p>
        </div>
      </section>

      {/* =====================================================
          ACTION
          ===================================================== */}
      <div className="page-actions">
        <button className="text-button" onClick={back}>
          <ArrowLeft size={15} />
          Kembali
        </button>

        <button className="button button-dark" onClick={next}>
          Buka keterlacakan lengkap
          <Network size={15} />
        </button>
      </div>
    </div>
  );
}
