import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Clock,
  X,
  Compass,
} from 'lucide-react';
import { useSimulationController } from '../../controllers/useSimulationController';
import { OverviewStageView } from '../simulasi/OverviewStageView';
import { CharacterizationStageView } from '../simulasi/CharacterizationStageView';
import { FormulationStageView } from '../simulasi/FormulationStageView';
import { CandidateAnalysisStageView } from '../simulasi/CandidateAnalysisStageView';
import { TechnicalGateStageView } from '../simulasi/TechnicalGateStageView';

interface SimulasiPageViewProps {
  onBackToHome: () => void;
}

export const SimulasiPageView: React.FC<SimulasiPageViewProps> = ({
  onBackToHome,
}) => {
  const {
    workflowStages,
    dashboardMeta,
    activeDestination,
    isDashboardActive,
    currentStageIndex,
    currentStageMeta,
    hasPreviousStage,
    hasNextStage,
    isSidebarCollapsed,
    isMobileStageSelectorOpen,
    selectStage,
    openDashboard,
    returnToActiveStage,
    goToPreviousStage,
    goToNextStage,
    toggleSidebarCollapse,
    openMobileStageSelector,
    closeMobileStageSelector,
    studyMode,
    datasetId,
    demoDatasets,
    selectDemoDataset,
    characterization,
    updateCharacterizationField,
    mix,
    setMix,
    updateMixField,
    study,
    datasetLabel,
    displayDecision,
    evidenceLabel,
  } = useSimulationController();

  const previousStage = hasPreviousStage
    ? workflowStages[currentStageIndex - 1]
    : null;
  const nextStage = hasNextStage
    ? workflowStages[currentStageIndex + 1]
    : null;

  const ActiveStageIcon = currentStageMeta.icon;
  const DashboardIcon = dashboardMeta.icon;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Top Context & Workspace Utility Strip */}
        <div className="pb-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white px-3 py-2 min-h-[38px] rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
              <span className="font-semibold text-slate-800">
                Ruang Kerja Simulasi
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600">
                {isDashboardActive
                  ? 'Halaman Pendukung (Dashboard)'
                  : `Tahap ${currentStageMeta.stepOrder} dari ${workflowStages.length}`}
              </span>
            </div>
          </div>

          <div className="hidden sm:block text-xs text-slate-500 shrink-0">
            <span>Alur Evaluasi Bertahap GEOCEDS</span>
          </div>
        </div>

        {/* Mobile Compact Stage Indicator & Touch-Friendly Selector Trigger (< md) */}
        <div className="md:hidden mt-3.5 space-y-2">
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {isDashboardActive
                  ? 'Tampilan Pendukung Aktif'
                  : `Tahap Aktif · ${currentStageMeta.stageNumber} dari 08`}
              </div>
              <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
                {isDashboardActive
                  ? dashboardMeta.title
                  : `${currentStageMeta.stageNumber}. ${currentStageMeta.title}`}
              </div>
            </div>

            <button
              type="button"
              onClick={openMobileStageSelector}
              aria-expanded={isMobileStageSelectorOpen}
              data-testid="mobile-stage-selector-trigger"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <span>Pilih Tahap</span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Mobile Supporting Dashboard Access Bar */}
          <div className="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0 flex-1">
              <LayoutDashboard className="w-4 h-4 text-teal-700 shrink-0" />
              <span className="truncate font-medium">
                {isDashboardActive
                  ? 'Di luar urutan 8 tahapan evaluasi'
                  : 'Dashboard Simulasi (Ringkasan)'}
              </span>
            </div>
            {isDashboardActive ? (
              <button
                type="button"
                onClick={returnToActiveStage}
                className="px-3 py-2 min-h-[40px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Ke Tahap {currentStageMeta.stageNumber}
              </button>
            ) : (
              <button
                type="button"
                onClick={openDashboard}
                className="px-3 py-2 min-h-[40px] text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Buka Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Main Workspace Container (Desktop & Tablet Sidebar + Main Content Area) */}
        <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-stretch md:items-start gap-6">
          {/* Vertical Stage Sidebar (Visible on Tablet & Desktop) */}
          <aside
            aria-label="Navigasi Tahapan Simulasi"
            className={`hidden md:flex flex-col bg-white rounded-2xl border border-slate-200 shrink-0 transition-all duration-200 ${
              isSidebarCollapsed ? 'w-20 p-3' : 'w-64 lg:w-72 p-4'
            }`}
          >
            {/* Sidebar Header & Collapse Toggle */}
            <div
              className={`flex items-center pb-3 mb-3 border-b border-slate-200 ${
                isSidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              {!isSidebarCollapsed && (
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Tahapan Evaluasi
                  </div>
                  <div className="text-[11px] text-slate-500">
                    8 Tahap Utama Berurutan
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={toggleSidebarCollapse}
                title={
                  isSidebarCollapsed
                    ? 'Perluas panel tahapan'
                    : 'Ringkas panel tahapan'
                }
                aria-label={
                  isSidebarCollapsed
                    ? 'Perluas panel tahapan'
                    : 'Ringkas panel tahapan'
                }
                data-testid="sidebar-collapse-toggle"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* 8 Primary Workflow Stages List */}
            <nav aria-label="8 Tahap Utama Simulasi" className="space-y-1">
              {workflowStages.map((stage) => {
                const isStageSelected =
                  !isDashboardActive && activeDestination === stage.id;
                const isLastVisitedWhileOnDashboard =
                  isDashboardActive && currentStageMeta.id === stage.id;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => selectStage(stage.id)}
                    title={`${stage.stageNumber}. ${stage.title}`}
                    data-testid={`nav-stage-${stage.id}`}
                    aria-current={isStageSelected ? 'step' : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                    } ${
                      isStageSelected
                        ? 'bg-emerald-700 text-white font-semibold'
                        : isLastVisitedWhileOnDashboard
                        ? 'bg-emerald-50/80 text-emerald-900 border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold tabular-nums flex items-center justify-center shrink-0 ${
                        isStageSelected
                          ? 'bg-emerald-800 text-white'
                          : isLastVisitedWhileOnDashboard
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {stage.stageNumber}
                    </span>

                    {!isSidebarCollapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm leading-snug truncate">
                          {stage.title}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isStageSelected
                              ? 'text-emerald-100'
                              : 'text-slate-500'
                          }`}
                        >
                          {stage.shortLabel}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Visually Distinct Supporting View: Dashboard Simulasi */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              {!isSidebarCollapsed && (
                <div className="px-1 mb-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    Halaman Pendukung
                  </span>
                  <span>Di luar urutan tahap</span>
                </div>
              )}

              <button
                type="button"
                onClick={openDashboard}
                title="Dashboard Simulasi (Halaman Pendukung)"
                data-testid="nav-supporting-dashboard"
                aria-current={isDashboardActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-left transition-colors cursor-pointer border ${
                  isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-3'
                } ${
                  isDashboardActive
                    ? 'bg-teal-800 text-white border-teal-800 font-semibold'
                    : 'bg-teal-50/60 hover:bg-teal-100/70 text-teal-950 border-teal-200'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isDashboardActive
                      ? 'bg-teal-900 text-teal-100'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  <DashboardIcon className="w-4 h-4" />
                </span>

                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold truncate">
                      {dashboardMeta.title}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isDashboardActive ? 'text-teal-100' : 'text-teal-700'
                      }`}
                    >
                      Ringkasan simulasi aktif
                    </div>
                  </div>
                )}
              </button>
            </div>
          </aside>

          {/* Main Workspace Content Area */}
          <div className="flex-1 w-full min-w-0">
            {isDashboardActive ? (
              /* SUPPORTING PAGE: DASHBOARD SIMULASI */
              <section
                aria-labelledby="dashboard-heading"
                data-testid="workspace-dashboard-view"
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200">
                  <div className="space-y-2 max-w-3xl min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-teal-800 font-semibold">
                      <DashboardIcon className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Halaman Pendukung Ruang Kerja</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-normal text-slate-500">
                        Bukan tahap ke-9 dalam urutan alur kerja
                      </span>
                    </div>

                    <h1
                      id="dashboard-heading"
                      className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight break-words"
                    >
                      {dashboardMeta.title}
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      {dashboardMeta.purpose}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={returnToActiveStage}
                    data-testid="button-return-active-stage"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer sm:shrink-0 text-center"
                  >
                    <Compass className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      Kembali ke Tahap {currentStageMeta.stageNumber}:{' '}
                      {currentStageMeta.title}
                    </span>
                  </button>
                </div>

                {/* Clearly Marked Phase 1 Placeholder Box */}
                <div
                  data-testid="dashboard-placeholder-notice"
                  className="rounded-xl sm:rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-4 sm:p-6 md:p-8 space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-teal-800">
                    <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Placeholder Fase 1 · Struktur Dashboard Simulasi</span>
                  </div>

                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                    Ringkasan Hasil Simulasi Aktif Akan Ditampilkan di Sini
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {dashboardMeta.placeholderNotice} Pada tampilan ini nantinya
                    pengguna dapat memantau ringkasan status dari setiap tahap
                    tanpa harus berpindah halaman satu per satu, maupun langsung
                    melompat ke tahap tertentu yang membutuhkan penyesuaian input.
                  </p>

                  {/* Structural Stage Links Overview (No invented metrics or values) */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-700 mb-3">
                      Pintasan ke 8 Tahap Evaluasi Utama:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                      {workflowStages.map((stage) => (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => selectStage(stage.id)}
                          className="p-3 min-h-[44px] rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left transition-colors cursor-pointer flex flex-col justify-between gap-1.5"
                        >
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              Tahap {stage.stageNumber}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              Buka →
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            {stage.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-2">
                            {stage.shortLabel}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              /* PRIMARY WORKFLOW STAGE VIEW (01 - 08) */
              <section
                aria-labelledby="stage-heading"
                data-testid={`workspace-stage-view-${currentStageMeta.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
              >
                {/* Stage Header */}
                <div className="pb-5 sm:pb-6 border-b border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        TAHAP {currentStageMeta.stageNumber} DARI 08
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">
                        {currentStageMeta.technicalName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={openDashboard}
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 transition-colors cursor-pointer shrink-0"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                      <span>Lihat Dashboard Simulasi</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ActiveStageIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 max-w-3xl min-w-0 flex-1">
                      <h1
                        id="stage-heading"
                        className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug break-words"
                      >
                        {currentStageMeta.stageNumber}. {currentStageMeta.title}
                      </h1>
                      <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                        {currentStageMeta.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage Content Area */}
                {currentStageMeta.id === 'overview' ? (
                  <OverviewStageView
                    study={study}
                    characterization={characterization}
                    mix={mix}
                    studyMode={studyMode}
                    datasetId={datasetId}
                    datasetLabel={datasetLabel}
                    workflowStages={workflowStages}
                    onSelectStage={selectStage}
                    displayDecision={displayDecision}
                    evidenceLabel={evidenceLabel}
                  />
                ) : currentStageMeta.id === 'characterization' ? (
                  <CharacterizationStageView
                    study={study}
                    characterization={characterization}
                    studyMode={studyMode}
                    datasetId={datasetId}
                    demoDatasets={demoDatasets}
                    onSelectDemoDataset={selectDemoDataset}
                    onUpdateField={updateCharacterizationField}
                    onSelectStage={selectStage}
                    evidenceLabel={evidenceLabel}
                  />
                ) : currentStageMeta.id === 'formulation' ? (
                  <FormulationStageView
                    mix={mix}
                    setMix={setMix}
                    onUpdateMixField={updateMixField}
                    study={study}
                    studyMode={studyMode}
                    onSelectStage={selectStage}
                    evidenceLabel={evidenceLabel}
                  />
                ) : currentStageMeta.id === 'simulation' ? (
                  <CandidateAnalysisStageView
                    study={study}
                    characterization={characterization}
                    mix={mix}
                    studyMode={studyMode}
                    onUpdateMixField={updateMixField}
                    onSelectStage={selectStage}
                    displayDecision={displayDecision}
                    evidenceLabel={evidenceLabel}
                  />
                ) : currentStageMeta.id === 'gate' ? (
                  <TechnicalGateStageView
                    study={study}
                    characterization={characterization}
                    mix={mix}
                    studyMode={studyMode}
                    onUpdateMixField={updateMixField}
                    onSelectStage={selectStage}
                    displayDecision={displayDecision}
                    evidenceLabel={evidenceLabel}
                  />
                ) : (
                  /* Clearly Marked Stage Content Placeholder (Stages 06 - 08) */
                  <div
                    data-testid="stage-placeholder-notice"
                    className="rounded-xl sm:rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-4 sm:p-6 md:p-8 space-y-2.5 sm:space-y-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Placeholder Fase 1 · Tahap {currentStageMeta.stageNumber}{' '}
                        ({currentStageMeta.title})
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug">
                      Area Konten Interaktif Tahap {currentStageMeta.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {currentStageMeta.placeholderNotice}
                    </p>
                  </div>
                )}

                {/* Sequential Stage Footer Navigation */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div className="min-w-0">
                    {previousStage ? (
                      <button
                        type="button"
                        onClick={goToPreviousStage}
                        data-testid="button-prev-stage"
                        className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          Sebelumnya: {previousStage.stageNumber}.{' '}
                          {previousStage.title}
                        </span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 block py-1 sm:py-2 text-center sm:text-left">
                        Awal dari urutan 8 tahapan evaluasi
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    {nextStage ? (
                      <button
                        type="button"
                        onClick={goToNextStage}
                        data-testid="button-next-stage"
                        className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-end gap-2 px-4 sm:px-5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <span className="truncate">
                          Selanjutnya: {nextStage.stageNumber}.{' '}
                          {nextStage.title}
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={openDashboard}
                        data-testid="button-finish-to-dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 min-h-[44px] text-xs font-semibold text-teal-900 bg-teal-100 hover:bg-teal-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          Buka Dashboard Simulasi
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Touch-Friendly Stage Selector Bottom Sheet (< md) */}
      {isMobileStageSelectorOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Pilih tahapan simulasi"
          onClick={closeMobileStageSelector}
        >
          <div
            className="bg-white rounded-t-2xl border-t border-slate-200 w-full max-h-[85vh] flex flex-col overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate">
                  Navigasi Ruang Kerja Simulasi
                </div>
                <div className="text-xs text-slate-500 truncate">
                  Pilih salah satu dari 8 tahapan atau Dashboard
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileStageSelector}
                aria-label="Tutup pemilih tahap"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Scrollable List */}
            <div className="p-3.5 sm:p-4 overflow-y-auto overscroll-contain space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2 px-0.5">
                  8 Tahapan Evaluasi Utama
                </div>
                <div className="space-y-1.5">
                  {workflowStages.map((stage) => {
                    const isStageSelected =
                      !isDashboardActive && activeDestination === stage.id;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => selectStage(stage.id)}
                        className={`w-full flex items-center gap-3 p-3 min-h-[52px] rounded-xl text-left transition-colors cursor-pointer ${
                          isStageSelected
                            ? 'bg-emerald-700 text-white font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-bold tabular-nums flex items-center justify-center shrink-0 ${
                            isStageSelected
                              ? 'bg-emerald-800 text-white'
                              : 'bg-white border border-slate-200 text-slate-700'
                          }`}
                        >
                          {stage.stageNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-semibold truncate">
                            {stage.title}
                          </div>
                          <div
                            className={`text-[11px] truncate ${
                              isStageSelected
                                ? 'text-emerald-100'
                                : 'text-slate-500'
                            }`}
                          >
                            {stage.shortLabel}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Separate Supporting Dashboard Section in Mobile Sheet */}
              <div className="pt-3 border-t border-slate-200 pb-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 px-0.5">
                  <span className="font-semibold text-slate-700">
                    Halaman Pendukung
                  </span>
                  <span className="text-[11px]">Di luar urutan 8 tahap</span>
                </div>

                <button
                  type="button"
                  onClick={openDashboard}
                  className={`w-full flex items-center gap-3 p-3.5 min-h-[52px] rounded-xl text-left transition-colors cursor-pointer border ${
                    isDashboardActive
                      ? 'bg-teal-800 text-white border-teal-800 font-semibold'
                      : 'bg-teal-50/70 hover:bg-teal-100/70 text-teal-950 border-teal-200'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isDashboardActive
                        ? 'bg-teal-900 text-teal-100'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    <DashboardIcon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold truncate">
                      {dashboardMeta.title}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isDashboardActive ? 'text-teal-100' : 'text-teal-700'
                      }`}
                    >
                      Ringkasan terpadu dari simulasi aktif
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

