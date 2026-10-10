import { ArrowLeft, ArrowRight, AlertTriangle, Info } from "lucide-react";
import Metric from "../../components/common/Metric";
import PageHead from "../../components/ui/PageHead";
import StatusBadge from "../../components/ui/StatusBadge";
import type {
  EconomicControls,
  MixControls,
  StudyResult,
} from "../../engine/study";
import RangeField from "../../components/ui/RangeField";
import type { PaperScenarioName } from "../../engine/lib/paperTeaEngine";
import { formatIdr } from "../../engine/study";
import {
  normalizedEconomicScenario,
  economicAssumptions,
} from "../../engine/data/master";
import {
  calcPaperResidueBridge,
  getPaperEconomicMeta,
  getPaperEconomicScenario,
} from "../../engine/lib/paperTeaEngine";

export default function EconomicsPage({
  study,
  mix,
  next,
  back,
  economics,
  setEconomics,
}: {
  study: StudyResult;
  mix: MixControls;
  next: () => void;
  back: () => void;
  economics: EconomicControls;
  setEconomics: (
    value: EconomicControls | ((current: EconomicControls) => EconomicControls),
  ) => void;
}) {
  const tea = study.state.tea;

  const scenarioName: PaperScenarioName =
    economics.scenario === "baseline" ? "base" : economics.scenario;

  // Paper values remain a benchmark; current-study controls drive the web model.
  const scenario = normalizedEconomicScenario(economics.scenario);
  const paperMeta = getPaperEconomicMeta();
  const paperScenario = getPaperEconomicScenario(scenarioName);
  const economicSourceNotes = Array.isArray(
    (economicAssumptions as { source_notes?: unknown }).source_notes,
  )
    ? (economicAssumptions as { source_notes: string[] }).source_notes
    : [];
  const dailyBlocks = study.estimatedBlocksPerDay;

  const sellingPricePerBlock =
    economics.sellingPricePerBlock ?? paperScenario.sellingPricePerBlock;
  const dynamicCostPerBlock = tea.costPerBlock;
  const dynamicMarginPerBlock =
    dynamicCostPerBlock != null
      ? sellingPricePerBlock - dynamicCostPerBlock
      : null;
  const dynamicOperatingCashPerDay =
    dynamicMarginPerBlock != null ? dynamicMarginPerBlock * dailyBlocks : null;
  const dynamicOperatingCashPerYear =
    dynamicOperatingCashPerDay != null
      ? dynamicOperatingCashPerDay *
        Number(paperMeta?.production?.annual_operating_days ?? 300)
      : null;
  const dynamicPaybackMonths =
    dynamicOperatingCashPerYear != null &&
    dynamicOperatingCashPerYear > 0 &&
    paperMeta?.capex?.total_idr
      ? paperMeta.capex.total_idr / (dynamicOperatingCashPerYear / 12)
      : null;

  const money = (value: number | null | undefined) =>
    formatIdr(value == null ? null : value);
  const dynamicReturn =
    dynamicOperatingCashPerDay == null
      ? "DATA DIPERLUKAN"
      : dynamicOperatingCashPerDay <= 0
        ? "TIDAK EKONOMIS DALAM SKENARIO"
        : money(dynamicOperatingCashPerDay);

  const bridge = calcPaperResidueBridge({
    substitutionPct: mix.substitution,
    massPerBlockKg: study.state.massBalance.blockMassKg ?? undefined,
  });

  const keys = [
    "cement_pc_idr_kg",
    "fine_sand_idr_kg",
    "residu_acquisition_idr_kg",
    "electricity_idr_kwh",
    "transport_distance_km",
    "labor_hours_per_1000_blocks",
    "equipment_capex_idr",
  ];

  const labels: Record<string, string> = {
    cement_pc_idr_kg: "Harga semen web saat ini",
    fine_sand_idr_kg: "Pasir halus web saat ini",
    residu_acquisition_idr_kg: "Biaya perolehan residu web saat ini",
    electricity_idr_kwh: "Listrik web saat ini",
    transport_distance_km: "Jarak transportasi web saat ini",
    labor_hours_per_1000_blocks: "Intensitas tenaga kerja web saat ini",
    equipment_capex_idr: "CAPEX peralatan web saat ini",
  };

  const currentScenarioValue = (key: string) => {
    if (key === "cement_pc_idr_kg" && economics.cementPriceIdrKg != null)
      return {
        value: economics.cementPriceIdrKg,
        unit: "IDR/kg",
        status: "ASSUMPTION",
      };
    if (
      key === "transport_distance_km" &&
      economics.transportDistanceKm != null
    )
      return {
        value: economics.transportDistanceKm,
        unit: "km",
        status: "ASSUMPTION",
      };
    if (
      key === "electricity_idr_kwh" &&
      economics.electricityPriceIdrKwh != null
    )
      return {
        value: economics.electricityPriceIdrKwh,
        unit: "IDR/kWh",
        status: "ASSUMPTION",
      };
    return scenario[key];
  };

  const scenarioLabels: Record<PaperScenarioName, string> = {
    conservative: "Konservatif",
    base: "Dasar",
    optimistic: "Optimistis",
  };

  return (
    <div className="reveal economics-premium">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <PageHead
        title="Ekonomi"
        description="Ekonomi berbasis paper terhubung ke formulasi aktif, dengan estimasi awal, asumsi, dan kesenjangan data tetap dipisahkan secara jelas."
        action={<StatusBadge status="AWAL / SKENARIO" />}
      />

      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="economics-hero">
        <div className="economics-hero-main">
          <div className="economics-hero-kicker">ECONOMIC SCREENING</div>

          <h3>Analisis Tekno-Ekonom (TEA)</h3>

          <p>
            Benchmark paper tetap tersedia sebagai pembanding. KPI di bawah
            merespons formulasi, neraca massa, dan kontrol asumsi active study;
            hasilnya tetap economic screening, bukan TEA penuh.
          </p>

          {/* SCENARIO */}
          <div
            className="economics-scenario-switch"
            role="group"
            aria-label="Skenario ekonomi"
          >
            {(Object.keys(scenarioLabels) as PaperScenarioName[]).map(
              (name) => (
                <button
                  key={name}
                  type="button"
                  className={scenarioName === name ? "selected" : ""}
                  aria-pressed={scenarioName === name}
                  onClick={() =>
                    setEconomics((current) => ({
                      ...current,
                      scenario: name === "base" ? "baseline" : name,
                      cementPriceIdrKg: null,
                      processingCostIdrTon: null,
                      transportDistanceKm: null,
                      electricityPriceIdrKwh: null,
                    }))
                  }
                >
                  {scenarioLabels[name]}
                </button>
              ),
            )}
          </div>
        </div>

        {/* KPI */}
        <div className="economics-kpi-grid">
          <div className="economics-kpi">
            <span>HARGA JUAL</span>
            <strong>{money(sellingPricePerBlock)}</strong>
            <small>per block</small>
          </div>

          <div className="economics-kpi">
            <span>BIAYA / BLOCK</span>

            <strong>{money(dynamicCostPerBlock)}</strong>

            <small>per block</small>
          </div>

          <div className="economics-kpi kpi-payback">
            <span>PAYBACK</span>

            <strong>
              {dynamicPaybackMonths == null
                ? "—"
                : dynamicPaybackMonths.toFixed(1)}
            </strong>

            <small>bulan</small>
          </div>
        </div>
      </section>

      {/* =====================================================
          SCOPE
          ===================================================== */}
      <section className="economics-section">
        <div className="economics-section-head">
          <div>
            <span className="eyebrow">MODEL SCOPE</span>

            <h3>Ringkasan skenario aktif</h3>

            <p>
              Parameter utama yang membentuk hasil ekonomi pada skenario{" "}
              {scenarioLabels[scenarioName]}.
            </p>
          </div>

          <span className="economics-section-tag">
            {scenarioLabels[scenarioName].toUpperCase()}
          </span>
        </div>

        <div className="tea-scope-strip">
          <div>
            <span className="mono-label">CAPEX DALAM MODEL</span>

            <strong>{money(paperMeta?.capex?.total_idr ?? 0)}</strong>

            <small>hanya lini pengolahan residu</small>
          </div>

          <div>
            <span className="mono-label">OPEX / RESIDU</span>

            <strong>≈ {money(paperMeta?.opex?.reported_per_t_idr ?? 0)}</strong>

            <small>per ton residu yang diproses</small>
          </div>

          <div>
            <span className="mono-label">PRODUKSI BLOCK</span>

            <strong>{study.estimatedBlocksPerDay} / hari</strong>

            <small>asumsi skenario</small>
          </div>
        </div>
      </section>

      <section className="economics-section">
        <div className="economics-section-head">
          <div>
            <span className="eyebrow">ACTIVE STUDY ASSUMPTIONS</span>
            <h3>Kontrol asumsi yang memengaruhi model web</h3>
            <p>
              Perubahan di sini langsung dihitung ulang dari formulasi dan
              neraca massa active study.
            </p>
          </div>
          <StatusBadge status="ASSUMPTION" />
        </div>
        <div className="economics-control-grid">
          <div>
            <span className="mono-label">SKENARIO</span>
            <div className="economics-scenario-switch">
              {(Object.keys(scenarioLabels) as PaperScenarioName[]).map(
                (name) => {
                  const mapped = name === "base" ? "baseline" : name;
                  return (
                    <button
                      key={name}
                      type="button"
                      className={
                        economics.scenario === mapped ? "selected" : ""
                      }
                      onClick={() =>
                        setEconomics((current) => ({
                          ...current,
                          scenario: mapped as EconomicControls["scenario"],
                          cementPriceIdrKg: null,
                          processingCostIdrTon: null,
                          transportDistanceKm: null,
                          electricityPriceIdrKwh: null,
                        }))
                      }
                    >
                      {scenarioLabels[name]}
                    </button>
                  );
                },
              )}
            </div>
          </div>
          <RangeField
            label="Harga semen"
            value={
              economics.cementPriceIdrKg ??
              scenario["cement_pc_idr_kg"]?.value ??
              0
            }
            min={1000}
            max={2200}
            step={50}
            suffix=" IDR/kg"
            onChange={(value) =>
              setEconomics((current) => ({
                ...current,
                cementPriceIdrKg: value,
              }))
            }
            hint="Perubahan memengaruhi biaya semen setelah substitution."
            testId="economics-cement-price"
          />
          <RangeField
            label="Biaya pengolahan tambahan"
            value={economics.processingCostIdrTon ?? 0}
            min={0}
            max={1000000}
            step={25000}
            suffix=" IDR/t"
            onChange={(value) =>
              setEconomics((current) => ({
                ...current,
                processingCostIdrTon: value,
              }))
            }
            hint="Allowance eksplisit untuk proses residu; bukan TEA penuh."
            testId="economics-processing-cost"
          />
          <RangeField
            label="Jarak transportasi"
            value={
              economics.transportDistanceKm ??
              scenario["transport_distance_km"]?.value ??
              0
            }
            min={0}
            max={100}
            step={1}
            suffix=" km"
            onChange={(value) =>
              setEconomics((current) => ({
                ...current,
                transportDistanceKm: value,
              }))
            }
            hint="Jarak residu ke area proses; memengaruhi OPEX transport."
            testId="economics-transport-distance"
          />
          <RangeField
            label="Tarif listrik"
            value={
              economics.electricityPriceIdrKwh ??
              scenario["electricity_idr_kwh"]?.value ??
              0
            }
            min={1000}
            max={3000}
            step={50}
            suffix=" IDR/kWh"
            onChange={(value) =>
              setEconomics((current) => ({
                ...current,
                electricityPriceIdrKwh: value,
              }))
            }
            hint="Memengaruhi biaya energi pemrosesan."
            testId="economics-electricity-price"
          />

          <RangeField
            label="Harga jual per block"
            value={
              economics.sellingPricePerBlock ??
              paperScenario.sellingPricePerBlock ??
              0
            }
            min={1000}
            max={50000}
            step={500}
            suffix=" IDR/block"
            onChange={(value) =>
              setEconomics((current) => ({
                ...current,
                sellingPricePerBlock: value,
              }))
            }
            hint="Harga jual asumsi untuk menghitung margin, revenue, dan payback."
            testId="economics-selling-price"
          />
        </div>
        <div className="economics-control-impact">
          <div>
            <span>BIAYA / BLOCK</span>
            <strong>{money(dynamicCostPerBlock)}</strong>
            <small>berubah mengikuti kontrol aktif</small>
          </div>
          <div>
            <span>MARGIN / BLOCK</span>
            <strong>{money(dynamicMarginPerBlock)}</strong>
            <small>harga jual − biaya current model</small>
          </div>
          <div>
            <span>OCF / HARI</span>
            <strong>{dynamicReturn}</strong>
            <small>screening scenario, bukan TEA penuh</small>
          </div>
          <div>
            <span>PAYBACK</span>
            <strong>
              {dynamicPaybackMonths == null
                ? "—"
                : `${dynamicPaybackMonths.toFixed(1)} bln`}
            </strong>
            <small>CAPEX lini pengolahan dalam model</small>
          </div>
        </div>
      </section>

      {/* =====================================================
          MASS BRIDGE
          ===================================================== */}
      <section className="economics-section">
        <div className="economics-section-head">
          <div>
            <span className="eyebrow">MATERIAL → OUTPUT</span>

            <h3>Residue → block mass bridge</h3>

            <p>
              Terhitung langsung dari substitusi formulasi dan massa block saat
              ini.
            </p>
          </div>

          <span className="economics-section-tag">CALCULATED</span>
        </div>

        <div className="geometry-summary-inline">
          <span>Geometri block</span>

          <strong>
            {mix.blockLengthMm} × {mix.blockWidthMm} × {mix.blockThicknessMm} mm
          </strong>

          <small>
            Volume {(study.state.massBalance.volumeM3 ?? 0).toFixed(6)} m³ ·
            perkiraan massa{" "}
            {(study.state.massBalance.blockMassKg ?? 0).toFixed(3)} kg/block
            pada 2.200 kg/m³
          </small>
        </div>

        <div className="economics-bridge">
          <div className="economics-bridge-item">
            <span>SUBSTITUSI</span>

            <strong>{bridge.substitutionPct}%</strong>

            <small>dari massa semen</small>
          </div>

          <div className="economics-bridge-arrow">→</div>

          <div className="economics-bridge-item">
            <span>RESIDU / BLOCK</span>

            <strong>{bridge.residuePerBlockKg.toFixed(4)} kg</strong>

            <small>kebutuhan per produk</small>
          </div>

          <div className="economics-bridge-arrow">→</div>

          <div className="economics-bridge-item">
            <span>RESIDU / HARI</span>

            <strong>{bridge.residueRequiredPerDayT.toFixed(3)} t</strong>

            <small>kebutuhan harian</small>
          </div>

          <div className="economics-bridge-arrow">→</div>

          <div className="economics-bridge-item economics-bridge-capacity">
            <span>KAPASITAS TERPAKAI</span>

            <strong>{bridge.capacityUtilizationPct.toFixed(0)}%</strong>

            <small>
              dari {bridge.residueCapacityTPerDay.toFixed(1)} t/hari
            </small>
          </div>
        </div>

        {!bridge.withinIllustrativeLiteratureWindow ? (
          <div className="notice notice-warning">
            <AlertTriangle size={14} />

            <span>
              <strong>Di luar rentang ilustratif literatur.</strong> Jembatan
              pematangan menggunakan 12–30% hanya sebagai rentang skenario
              berbasis literatur; substitusi SILICA2CON aktual harus berasal
              dari DOE/RSM.
            </span>
          </div>
        ) : (
          <div className="notice notice-info">
            <Info size={14} />

            <span>
              Berada dalam rentang ilustratif literatur 12–30%. Hal ini tidak
              menjadikan formulasi tervalidasi.
            </span>
          </div>
        )}
      </section>

      {/* =====================================================
          CAPEX + OPEX
          ===================================================== */}
      <div className="economics-cost-grid">
        <section className="economics-cost-card economics-capex">
          <div className="economics-cost-head">
            <div>
              <span className="eyebrow">INVESTMENT</span>

              <h3>CAPEX</h3>
            </div>

            <strong className="economics-cost-value">
              {money(paperMeta?.capex?.total_idr ?? 0)}
            </strong>
          </div>

          <div className="economics-cost-list">
            <div>
              <span>Termasuk</span>

              <strong>Dryer · grinder · sieve · handling · QC</strong>
            </div>

            <div>
              <span>Belum tersedia</span>

              <strong>Mixer · mesin press · cetakan · curing · conveyor</strong>
            </div>

            <div>
              <span>Belum tersedia</span>

              <strong>Kuotasi vendor aktual + pekerjaan sipil</strong>
            </div>
          </div>

          <div className="economics-cost-note">
            <AlertTriangle size={14} />

            <span>CAPEX produksi paving block belum tercakup penuh.</span>
          </div>
        </section>

        <section className="economics-cost-card economics-opex">
          <div className="economics-cost-head">
            <div>
              <span className="eyebrow">OPERATING COST</span>

              <h3>OPEX</h3>
            </div>

            <strong className="economics-cost-value">
              ≈ {money(paperMeta?.opex?.reported_per_t_idr ?? 0)}
            </strong>
          </div>

          <div className="economics-cost-list">
            <div>
              <span>Basis</span>

              <strong>per ton residu</strong>
            </div>

            <div>
              <span>Energi aktual</span>

              <strong>DATA DIPERLUKAN</strong>
            </div>

            <div>
              <span>Tenaga kerja & maintenance</span>

              <strong>DATA DIPERLUKAN</strong>
            </div>
          </div>

          <div className="economics-cost-note">
            <Info size={14} />

            <span>
              Billing aktual dan biaya operasi batch masih diperlukan.
            </span>
          </div>
        </section>
      </div>

      {/* =====================================================
          RETURN PROFILE
          ===================================================== */}
      <section className="economics-return">
        <div className="economics-return-main">
          <span className="eyebrow">RETURN PROFILE</span>

          <h3>
            {dynamicPaybackMonths == null
              ? "—"
              : dynamicPaybackMonths.toFixed(1)}
            <small> bulan payback</small>
          </h3>

          <p>
            Payback menggunakan CAPEX dalam lingkup model saat ini. CAPEX
            lengkap lini produksi paving block belum tersedia.
          </p>

          <div className="economics-payback-track">
            <span
              style={{
                width: `${Math.min(
                  92,
                  Math.max(12, 100 / Math.max(dynamicPaybackMonths ?? 1, 1)),
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="economics-return-side">
          <div>
            <span>REVENUE / HARI</span>

            <strong>{money(sellingPricePerBlock * dailyBlocks)}</strong>
          </div>

          <div>
            <span>OCF / HARI</span>

            <strong>{dynamicReturn}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          PAPER MODEL + WEB MODEL
          ===================================================== */}
      <div className="economics-model-grid">
        {/* PAPER */}
        <section className="economics-model-card paper-model">
          <div className="economics-model-head">
            <div>
              <span className="eyebrow">PAPER BENCHMARK</span>

              <h3>Ekonomi skenario</h3>
            </div>

            <span className="economics-model-tag">
              {scenarioLabels[scenarioName].toUpperCase()}
            </span>
          </div>

          <div className="economics-detail-table">
            <div>
              <span>Pendapatan / hari</span>

              <strong>{money(paperScenario.revenuePerDay)}</strong>
            </div>

            <div>
              <span>Biaya produksi / hari</span>

              <strong>{money(paperScenario.productionCostPerDay)}</strong>
            </div>

            <div>
              <span>Arus kas operasi / hari</span>

              <strong>{money(paperScenario.operatingCashFlowPerDay)}</strong>
            </div>

            <div>
              <span>Arus kas operasi / tahun</span>

              <strong>{money(paperScenario.operatingCashFlowPerYear)}</strong>
            </div>

            <div className="detail-highlight">
              <span>Margin bruto / block</span>

              <strong>{money(paperScenario.marginPerBlock)}</strong>
            </div>
          </div>

          <div className="economics-small-note">
            NPV / IRR / ROI tidak tersedia dalam model sumber.
          </div>
        </section>

        {/* WEB */}
        <section className="economics-model-card web-model">
          <div className="economics-model-head">
            <div>
              <span className="eyebrow">CURRENT MODEL</span>

              <h3>Model web</h3>
            </div>

            <StatusBadge status={tea.status} />
          </div>

          <div className="economics-web-kpis">
            <Metric
              label="Total batch"
              value={formatIdr(tea.total)}
              note="mesin formula saat ini"
              tone="green"
            />

            <Metric
              label="Biaya / block"
              value={formatIdr(tea.costPerBlock)}
              note="dasar batch saat ini"
              tone="gold"
            />
          </div>

          <div className="assumption-list compact-list">
            {keys.map((key) => {
              const value = currentScenarioValue(key);

              return (
                <div key={key}>
                  <span>{labels[key]}</span>

                  <strong>
                    {value ? `${value.value} ${value.unit}` : "DATA DIPERLUKAN"}
                  </strong>

                  <StatusBadge status={value?.status ?? "DATA DIPERLUKAN"} />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="economics-provenance-note">
        <strong>PROVENANCE & STATUS DATA</strong>
        <p>
          Parameter yang berasal dari skenario master digunakan sebagai
          <b> ASSUMPTION </b>
          untuk economic screening, bukan sebagai biaya produksi aktual. Nilai
          yang diubah melalui kontrol active study merupakan asumsi input
          pengguna.
        </p>

        {economicSourceNotes.length > 0 && (
          <ul>
            {economicSourceNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>

      {/* =====================================================
          DATA GAP
          ===================================================== */}
      <section className="economics-gap-panel">
        <div className="economics-section-head">
          <div>
            <span className="eyebrow">DATA READINESS</span>

            <h3>Yang masih menahan TEA penuh</h3>

            <p>
              Gap berikut menjadi batas interpretasi hasil ekonomi saat ini.
            </p>
          </div>

          <span className="economics-section-tag warning">P0 / P1</span>
        </div>

        <div className="economics-gap-grid">
          {(paperMeta?.maturation?.critical_gaps ?? []).map(
            (gap: string, index: number) => (
              <div key={gap}>
                <span>{String(index + 1).padStart(2, "0")}</span>

                <strong>{gap}</strong>

                <p>
                  Data diperlukan untuk meningkatkan tingkat kematangan ekonomi.
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          DISCLAIMER
          ===================================================== */}
      <div className="economics-disclaimer">
        <AlertTriangle size={14} />

        <span>
          Hasil di halaman ini adalah <strong>economic screening awal</strong>{" "}
          dan bukan TEA penuh atau keputusan investasi final.
        </span>
      </div>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}
      <div className="page-actions">
        <button className="text-button" onClick={back}>
          <ArrowLeft size={15} />
          Kembali
        </button>

        <button className="button button-dark" onClick={next}>
          Tinjau lingkungan
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
