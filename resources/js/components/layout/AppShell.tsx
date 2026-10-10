import type { ReactNode } from "react";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  Menu,
  Mountain,
  RotateCcw,
  X,
} from "lucide-react";
import type { Characterization } from "../../engine/study";
import type { Stage } from "../../app/types/stage";
import {
  primaryStageIndex,
  primaryStages,
  stageConfig,
  supportStages,
} from "../../app/config/stages";
import StatusBadge from "../ui/StatusBadge";
import UtilityPortals, { type PortalId } from "./UtilityPortals";

export default function AppShell({
  stage,
  setStage,
  characterization,
  resetStudy,
  children,
  studyMode = "demo",
  maxPrimaryIndex = 0,
}: {
  stage: Stage;
  setStage: (stage: Stage) => void;
  characterization: Characterization;
  resetStudy: () => void;
  children: ReactNode;
  studyMode?: "demo" | "actual";
  maxPrimaryIndex?: number;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portal, setPortal] = useState<PortalId>("menu");
  const [portalOpen, setPortalOpen] = useState(false);

  const currentPrimaryIndex = primaryStageIndex(stage);
  const isPrimary = currentPrimaryIndex >= 0;

  const currentPrimary = isPrimary
    ? primaryStages[currentPrimaryIndex]
    : null;

  const progressIndex = Math.max(
    maxPrimaryIndex,
    currentPrimaryIndex,
    0,
  );

  const progressPercent = Math.round(
    (progressIndex / Math.max(primaryStages.length - 1, 1)) * 100,
  );

  const go = (next: Stage) => {
    const nextIndex = primaryStageIndex(next);

    if (nextIndex > maxPrimaryIndex) return;

    setStage(next);
    setMobileNav(false);
    setPortalOpen(false);
  };

  const forceGo = (next: Stage) => {
    setStage(next);
    setMobileNav(false);
    setPortalOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  const renderPrimaryItem = (
    item: (typeof primaryStages)[number],
  ) => {
    const itemIndex = primaryStageIndex(item.id);
    const current = stage === item.id;
    const completed = itemIndex < maxPrimaryIndex;
    const unlocked = itemIndex <= maxPrimaryIndex;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        data-testid={`nav-${item.id}`}
        className={`stage-link stage-link-primary ${
          current ? "active" : ""
        } ${!unlocked ? "is-locked" : ""}`}
        onClick={() => go(item.id)}
        disabled={!unlocked}
        title={
          unlocked
            ? item.label
            : `Selesaikan tahap sebelumnya terlebih dahulu: ${
                primaryStages[itemIndex - 1]?.label ??
                "tahap sebelumnya"
              }`
        }
        aria-current={current ? "step" : undefined}
      >
        <span className="stage-number">
          {completed ? "✓" : item.short}
        </span>

        {unlocked ? (
          <Icon size={15} />
        ) : (
          <Lock size={14} />
        )}

        <span className="stage-link-copy">
          <strong>{item.label}</strong>
        </span>
      </button>
    );
  };

  const renderSupportItem = (
    item: (typeof supportStages)[number],
  ) => {
    const current = stage === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        data-testid={`nav-${item.id}`}
        className={`stage-link stage-link-support ${
          current ? "active" : ""
        }`}
        onClick={() => forceGo(item.id)}
        title={item.label}
      >
        <span className="stage-number">{item.short}</span>

        <Icon size={15} />

        <span className="stage-link-copy">
          <strong>{item.label}</strong>
        </span>
      </button>
    );
  };

  return (
    <div
      className={`app-shell ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside
        className={`sidebar ${
          mobileNav ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <button
              className="brand brand-light"
              onClick={() => forceGo("overview")}
              title="Kembali ke workflow"
            >
              <span className="brand-mark brand-mark-gold">
                <Mountain size={17} />
              </span>

              <span className="brand-text">
                SILICA<span className="brand-accent">2</span>CON
              </span>
            </button>

            <div className="sidebar-brand-actions">
              <button
                type="button"
                className="sidebar-collapse-toggle"
                onClick={toggleSidebar}
                aria-label={
                  sidebarCollapsed
                    ? "Buka sidebar"
                    : "Tutup sidebar"
                }
                aria-expanded={!sidebarCollapsed}
                title={
                  sidebarCollapsed
                    ? "Buka sidebar"
                    : "Tutup sidebar"
                }
              >
                {sidebarCollapsed ? (
                  <ChevronRight size={17} />
                ) : (
                  <ChevronLeft size={17} />
                )}
              </button>

              <button
                type="button"
                className="close-menu"
                onClick={() => setMobileNav(false)}
                aria-label="Tutup navigasi"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="study-id">
            <p className="mono-label">Studi aktif</p>

            <div>
              <span className="rekam-pulse" />{" "}
              <span className="study-id-value">
                {characterization.batch || "BATCH BELUM DIISI"}
              </span>

              <StatusBadge
                status={
                  studyMode === "demo"
                    ? "DEMO"
                    : "DATA AKTUAL"
                }
              />
            </div>
          </div>

          <div className="workflow-sidebar-intro">
            <p className="mono-label">JALUR KEPUTUSAN</p>

            <strong>
              {currentPrimary
                ? `${currentPrimary.short} · ${currentPrimary.label}`
                : "Alat pendukung"}
            </strong>
          </div>

          <div
            className="workflow-sidebar-progress"
            aria-label="Kemajuan workflow"
          >
            <div>
              <span>PROGRESS</span>

              <strong>
                {String(progressIndex).padStart(2, "0")} /{" "}
                {String(primaryStages.length - 1).padStart(
                  2,
                  "0",
                )}
              </strong>
            </div>

            <div className="workflow-sidebar-progress-track">
              <span
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            <small>
              {progressIndex >= primaryStages.length - 1
                ? "Workflow utama sudah mencapai keputusan."
                : `Berikutnya: ${
                    primaryStages[
                      Math.min(
                        progressIndex + 1,
                        primaryStages.length - 1,
                      )
                    ].label
                  }`}
            </small>
          </div>

          <nav
            className="stage-nav"
            aria-label="Navigasi SILICA2CON"
          >
            <div className="nav-group nav-group-primary">
              <p className="nav-group-label">
                WORKFLOW UTAMA
              </p>

              {primaryStages.map(renderPrimaryItem)}
            </div>


          </nav>

          
        </div>
      </aside>

      {mobileNav && (
        <button
          aria-label="Tutup navigasi"
          className="menu-overlay"
          onClick={() => setMobileNav(false)}
        />
      )}

      <div className="shell-content">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="open-menu"
              onClick={() => setMobileNav(true)}
              aria-label="Buka navigasi"
            >
              <Menu size={20} />
            </button>

            <div className="topbar-context">
              <p className="mono-label">
                {isPrimary
                  ? "WORKFLOW UTAMA"
                  : "ALAT PENDUKUNG"}
              </p>

              <strong>
                {stage === "start"
                  ? "Studi baru"
                  : stageConfig(stage)?.label ??
                    "SILICA2CON"}
              </strong>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="topbar-help">
              <span>
                {isPrimary
                  ? `${String(progressIndex).padStart(2, "0")} / 07`
                  : "SUPPORT"}
              </span>

              <div className="topbar-progress">
                <span
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </div>

            <button
              data-testid="button-reset-study"
              className="reset-button"
              onClick={resetStudy}
              title="Reset active study"
            >
              <RotateCcw size={13} />
              Reset study
            </button>

            <div className="portal-dock">
              <button
                className={`portal-trigger ${
                  portalOpen ? "is-open" : ""
                }`}
                onClick={() => {
                  setPortalOpen((value) => !value);

                  if (!portalOpen) {
                    setPortal("menu");
                  }
                }}
                aria-expanded={portalOpen}
                aria-label="Buka portal pendukung"
              >
                <Menu size={17} />
                <span>Portal</span>
              </button>

              {portalOpen && (
                <div
                  className={`portal-popover ${
                    portal === "menu"
                      ? "is-menu"
                      : "is-detail"
                  }`}
                >
                  <div className="portal-popover-top">
                    <div>
                      <span className="portal-kicker">
                        SILICA2CON
                      </span>

                      <strong>
                        {portal === "menu"
                          ? "Portal Pendukung"
                          : "Portal"}
                      </strong>
                    </div>

                    {portal === "menu" ? (
                      <span className="portal-online">
                        <span /> aktif
                      </span>
                    ) : (
                      <button
                        className="portal-back"
                        onClick={() =>
                          setPortal("menu")
                        }
                      >
                        <ArrowLeft size={14} />
                        Menu
                      </button>
                    )}
                  </div>

                  <UtilityPortals
                    portal={portal}
                    setPortal={setPortal}
                    setStage={forceGo}
                  />
                </div>
              )}
            </div>

            <div className="avatar">S2C</div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}