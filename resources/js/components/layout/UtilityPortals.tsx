import {
  ArrowRight,
  Beaker,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Quote,
  Database,
  FileText,
  Info,
  Network,
  Pencil,
  X
} from "lucide-react";
import Metric from "../../components/common/Metric";
import type { Stage } from "../../app/types/stage";
import {
  referenceRecords
} from "../../engine/data/master";

export type PortalId =
  "menu" | "metodologi" | "sitasi" | "dokumentasi" | "ekonomi" | "pengembang";

export default function UtilityPortals({
  portal,
  setPortal,
  setStage,
}: {
  portal: PortalId;
  setPortal: (portal: PortalId) => void;
  setStage: (stage: Stage) => void;
}) {
  const closePortal = () => setPortal("menu");
  const openStage = (stage: Stage) => {
    setStage(stage);
    setPortal("menu");
  };
  if (portal === "menu") {
    return (
      <div className="portal-menu" role="menu" aria-label="Portal pendukung">
        <button
          className="portal-menu-item"
          onClick={() => openStage("evidence")} 
        >
          <Beaker size={17} />
          <span>
            <strong>Metodologi</strong>
            <small>Alur penelitian & validasi</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item portal-roadmap-item"
          onClick={() => openStage("validation")}
        >
          <Network size={17} />
          <span>
            <strong>Peta Jalan Penelitian</strong>
            <small>Literatur → gap → eksperimen → validasi</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item"
          onClick={() => setPortal("sitasi")}
        >
          <Quote size={17} />
          <span>
            <strong>Sitasi & sumber</strong>
            <small>Referensi dan evidence</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item"
          onClick={() => openStage("data-gaps")}
        >
          <AlertTriangle size={17} />
          <span>
            <strong>Kesenjangan data</strong>
            <small>P0–P2 yang masih terbuka</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item"
          onClick={() => setPortal("dokumentasi")}
        >
          <FileText size={17} />
          <span>
            <strong>Dokumentasi</strong>
            <small>Definisi model & keterlacakan</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item"
          onClick={() => {
            openStage("economics");
          }}
        >
          <Database size={17} />
          <span>
            <strong>Ekonomi / TEA</strong>
            <small>CAPEX, OPEX & skenario</small>
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          className="portal-menu-item"
          onClick={() => setPortal("pengembang")}
        >
          <Pencil size={17} />
          <span>
            <strong>Pengembang</strong>
            <small>Informasi instrumen</small>
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  const titles: Record<Exclude<PortalId, "menu">, string> = {
    metodologi: "Portal Metodologi",
    sitasi: "Portal Sitasi & Sumber",
    dokumentasi: "Portal Dokumentasi",
    ekonomi: "Portal Ekonomi / TEA",
    pengembang: "Portal Pengembang",
  };

  return (
    <div
      className="portal-detail"
      role="dialog"
      aria-label={titles[portal as Exclude<PortalId, "menu">]}
    >
      <div className="portal-detail-head">
        <div>
          <p className="mono-label">Portal pendukung</p>
          <strong>{titles[portal as Exclude<PortalId, "menu">]}</strong>
        </div>
        <button
          className="portal-close"
          onClick={closePortal}
          aria-label="Kembali ke menu"
        >
          <X size={17} />
        </button>
      </div>
      {portal === "metodologi" && (
        <div className="portal-detail-body">
          <div className="portal-callout">
            <Beaker size={17} />
            <div>
              <strong>Metodologi berbasis bukti</strong>
              <p>
                Literatur membentuk ruang kandidat. Karakterisasi, eksperimen,
                dan validasi menentukan bukti untuk keputusan.
              </p>
            </div>
          </div>
          <div className="portal-flow">
            {[
              [
                "01",
                "Karakterisasi",
                "Identitas batch, SiO₂, fase, ukuran partikel, kadar air, pengotor.",
              ],
              [
                "02",
                "Formulasi",
                "Kadar substitusi dan ukuran partikel sebagai faktor kandidat.",
              ],
              [
                "03",
                "Eksperimen",
                "DOE/RSM bila struktur data memenuhi syarat pemodelan.",
              ],
              [
                "04",
                "Gerbang teknis",
                "Uji terhadap persyaratan SNI sebelum peringkat ekonomi.",
              ],
              [
                "05",
                "Keputusan",
                "Ekonomi dan lingkungan digunakan setelah gerbang teknis.",
              ],
            ].map(([no, title, copy]) => (
              <div className="portal-flow-row" key={no}>
                <span>{no}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="portal-primary-action"
            onClick={() => openStage("validation")}
          >
            <BookOpen size={15} /> Buka peta jalan penelitian
          </button>
        </div>
      )}
      {portal === "sitasi" && (
        <div className="portal-detail-body reference-library">
          <div className="reference-library-head">
            <div className="portal-callout reference-library-intro">
              <Quote size={19} />

              <div>
                <span className="portal-section-kicker">
                  RESEARCH REFERENCE SYSTEM
                </span>

                <strong>Reference Library</strong>

                <p>
                  Registri sumber yang digunakan untuk membangun konteks
                  literatur, evidence, dan keputusan SILICA2CON.
                </p>
              </div>
            </div>

            <div className="reference-library-meta">
              <span>REGISTERED SOURCES</span>
              <strong>{referenceRecords().length}</strong>
            </div>
          </div>

          <div className="reference-library-toolbar">
            <div>
              <span className="reference-toolbar-label">SOURCE REGISTRY</span>

              <p>
                Sumber disimpan sebagai rekam referensi, bukan sebagai validasi
                eksperimental otomatis.
              </p>
            </div>

            <span className="reference-library-status">
              LITERATURE / EVIDENCE
            </span>
          </div>

          <div className="portal-reference-list reference-library-list">
            {referenceRecords().map((ref) => (
              <article
                className="portal-reference reference-library-card"
                key={`${ref.author}-${ref.year}-${ref.title}`}
              >
                <div className="reference-card-top">
                  <div className="portal-reference-meta">
                    <span>{ref.year}</span>
                    <span>{ref.type}</span>
                  </div>

                  <span className="reference-source-code">SOURCE</span>
                </div>

                <strong className="reference-library-title">{ref.title}</strong>

                <p className="reference-library-author">{ref.author}</p>

                <p className="reference-library-publisher">{ref.publisher}</p>

                <div className="reference-library-footer">
                  {ref.doi !== "—" ? (
                    <code>{ref.doi}</code>
                  ) : (
                    <span className="reference-no-doi">DOI tidak tersedia</span>
                  )}

                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="reference-open-link"
                    >
                      Buka sumber
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="reference-library-note">
            <Info size={15} />

            <div>
              <strong>Cara membaca Reference Library</strong>

              <p>
                Reference Library adalah repositori sumber. Keterkaitan jurnal
                dengan milestone penelitian dijelaskan di Peta Jalan, sedangkan
                status bukti dan validasi tetap ditentukan oleh mesin
                SILICA2CON.
              </p>
            </div>
          </div>

          <button
            className="portal-primary-action"
            onClick={() => openStage("evidence")}
          >
            <Quote size={15} />
            Buka metodologi
          </button>
        </div>
      )}
      {portal === "dokumentasi" && (
        <div className="portal-detail-body">
          <div className="portal-callout">
            <FileText size={17} />
            <div>
              <strong>Dokumentasi instrumen</strong>
              <p>
                SILICA2CON menjaga pemisahan antara literatur, asumsi, estimasi
                engineering, data terukur, dan validasi.
              </p>
            </div>
          </div>
          <div className="portal-doc-grid">
            <Metric label="Rekaman bukti" value="39" />
            <Metric label="Lapisan mesin" value="08" />
            <Metric label="Status keputusan" value="04" />
          </div>
          <div className="portal-note">
            Keluaran tetap bersifat penyaringan berbatas dan tidak otomatis
            menjadi klaim kepatuhan atau full TEA.
          </div>
          <button
            className="portal-primary-action"
            onClick={() => openStage("traceability")}
          >
            <Network size={15} /> Buka keterlacakan
          </button>
        </div>
      )}
      {portal === "ekonomi" && (
        <div className="portal-detail-body">
          <div className="portal-callout">
            <Database size={17} />
            <div>
              <strong>Penyaringan ekonomi</strong>
              <p>
                CAPEX, OPEX, unit economics, scenario, dan sensitivity dibaca
                setelah gerbang teknis.
              </p>
            </div>
          </div>
          <div className="portal-doc-grid">
            <Metric
              label="CAPEX"
              value="Rp276 jt"
              note="estimasi engineering"
            />
            <Metric label="OPEX" value="≈Rp503 rb/t" note="pemrosesan residu" />
            <Metric
              label="Payback Base"
              value="≈6,3 bln"
              note="skenario penyaringan"
            />
          </div>
          <div className="portal-note">
            Nilai ekonomi tetap preliminary; lini pencetakan block dan beberapa
            input biaya aktual masih merupakan data yang diperlukan.
          </div>
          <button
            className="portal-primary-action"
            onClick={() => openStage("economics")}
          >
            <ArrowRight size={15} /> Buka modul ekonomi
          </button>
        </div>
      )}
      {portal === "pengembang" && (
        <div className="portal-detail-body">
          <div className="developer-panel">
            <div className="developer-header">
              <div>
                <span className="eyebrow">DEVELOPER / CREDITS</span>

                <h3>Pengembang SILICA2CON</h3>

                <p>
                  Tim pengembang aplikasi pendukung keputusan berbasis bukti
                  untuk SILICA2CON.
                </p>
              </div>

              <span className="developer-badge">SILICA2CON</span>
            </div>

            <div className="developer-list">
              <div className="developer-card">
                <div className="developer-index">01</div>

                <div className="developer-info">
                  <strong>Dhamar Firdaus Esa Mahendra</strong>

                  <div className="developer-meta">
                    <span>2405110008</span>
                    <span>Teknik Komputer</span>
                  </div>
                </div>
              </div>

              <div className="developer-card">
                <div className="developer-index">02</div>

                <div className="developer-info">
                  <strong>Aditya Kusuma Wardana</strong>

                  <div className="developer-meta">
                    <span>2505020081</span>
                    <span>Teknik Sipil</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="developer-footer">
              <span>RESEARCH DECISION SUPPORT SYSTEM</span>
              <span>© SILICA2CON</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

