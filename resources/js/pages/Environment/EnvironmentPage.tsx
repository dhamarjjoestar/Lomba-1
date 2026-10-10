import { ArrowLeft, ArrowRight, Info, Leaf } from "lucide-react";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type { StudyResult } from "../../engine/study";
import { normalizedEnvironmentalFactors } from "../../engine/data/master";

export default function EnvironmentPage({
  study,
  next,
  back,
}: {
  study: StudyResult;
  next: () => void;
  back: () => void;
}) {
  const environment = study.state.environment;

  const cementFactor = normalizedEnvironmentalFactors.find(
    (factor) => factor.factor === "cement_emission_factor_kgco2e_per_kg",
  );

  const hasAvoided = environment.avoided != null;

  return (
    <div className="reveal environment-page">
      <PageHead
        title="Lingkungan"
        description="Screening lingkungan pada batas gate-to-gate berdasarkan hasil yang benar-benar dapat dihitung dari studi aktif."
        action={<StatusBadge status="SCREENING LINGKUNGAN" />}
      />

      <section className="environment-hero">
        <div className="environment-hero-main">
          <div className="environment-hero-icon" aria-hidden="true">
            <Leaf size={24} />
          </div>
          <div>
            <span className="eyebrow">BATAS ANALISIS</span>
            <h3>Screening gate-to-gate</h3>
            <p>
              Hanya output yang memiliki basis perhitungan aktif yang ditampilkan.
              Halaman ini bukan LCA penuh.
            </p>
          </div>
        </div>
        <div className="environment-hero-status">
          <span>STATUS STUDI</span>
          <strong>PARTIAL SCREENING</strong>
          <small>1 output kuantitatif tersedia</small>
        </div>
      </section>

      <section className="environment-section environment-results-panel">
        <div className="environment-section-head">
          <div>
            <span className="eyebrow">HASIL YANG DAPAT DIHITUNG</span>
            <h3>Emisi semen yang berpotensi dihindari</h3>
            <p>
              Diturunkan dari massa semen yang digantikan pada formulasi aktif
              dan faktor emisi semen yang saat ini tersimpan di master dataset.
            </p>
          </div>
          <span className="environment-available-count">
            {hasAvoided ? "TERSEDIA" : "BELUM TERSEDIA"}
          </span>
        </div>

        <div className="environment-result-hero">
          <div>
            <span>AVOIDED CEMENT-RELATED EMISSIONS</span>
            <strong>
              {hasAvoided ? `${environment.avoided!.toFixed(2)} kgCO₂e` : "—"}
            </strong>
            <p>
              Potensi penghindaran dari penggunaan semen yang lebih rendah pada
              kandidat saat ini. Nilai ini bukan pengurangan emisi bersih.
            </p>
          </div>
        </div>
      </section>

      <section className="environment-section environment-coverage-panel">
        <div className="environment-section-head">
          <div>
            <span className="eyebrow">INVENTORY COVERAGE</span>
            <h3>Apa yang benar-benar masuk ke screening</h3>
            <p>
              Coverage dibatasi pada komponen yang mempunyai nilai dan basis yang
              tersedia di studi aktif.
            </p>
          </div>
          <span className="environment-section-tag">CEMENT SUBSTITUTION</span>
        </div>

        <div className="environment-coverage-grid">
          <div className="environment-coverage-item is-available">
            <div className="environment-coverage-icon">✓</div>
            <div>
              <strong>Faktor emisi semen</strong>
              <span>
                {cementFactor?.value != null
                  ? `${cementFactor.value} ${cementFactor.unit}`
                  : "Nilai tidak tersedia"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="environment-section environment-factor-panel">
        <div className="environment-section-head">
          <div>
            <span className="eyebrow">PROVENANCE FAKTOR</span>
            <h3>Faktor yang dipakai</h3>
            <p>
              Nilai ditampilkan bersama konteks sumber agar angka screening tidak
              disalahartikan sebagai data LCA terverifikasi.
            </p>
          </div>
        </div>

        <div className="environment-factor-card">
          <div>
            <strong>Faktor emisi semen</strong>
            <span>
              {cementFactor?.unit ?? "kgCO₂e/kg"} ·{" "}
              {cementFactor?.geography ?? "GLOBAL/SCREENING"}
            </span>
          </div>
          <strong className="environment-factor-number">
            {cementFactor?.value ?? "—"}
          </strong>
        </div>

        <div className="environment-factor-note">
          <Info size={15} />
          <span>
            Faktor ini digunakan sebagai <strong>screening reference</strong>.
            Nilai tersebut bukan faktor LCA terverifikasi untuk klaim final.
          </span>
        </div>
      </section>

      <section className="environment-net-panel">
        <div className="environment-net-left">
          <span className="eyebrow">NET ENVIRONMENTAL IMPACT</span>
          <h3>Belum ditampilkan sebagai angka</h3>
          <p>
            Sistem tidak mengubah potensi penghindaran semen menjadi klaim emisi
            bersih karena inventaris proses dan aktivitas transportasi lengkap
            belum menjadi bagian dari basis perhitungan aktif.
          </p>
        </div>
        <div className="environment-net-badge">
          <span>INTERPRETASI</span>
          <strong>SCREENING PARTIAL</strong>
        </div>
      </section>

      <div className="environment-warning-box">
        <Info size={15} />
        <span>
          <strong>
            Jangan samakan avoided emissions dengan net emission reduction.
          </strong>{" "}
          Nilai di halaman ini hanya menunjukkan komponen penghindaran semen yang
          dapat dihitung pada konfigurasi studi saat ini.
        </span>
      </div>

      <div className="page-actions">
        <button className="text-button" onClick={back}>
          <ArrowLeft size={15} />
          Kembali
        </button>
        <button className="button button-dark" onClick={next}>
          Buka keputusan
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
