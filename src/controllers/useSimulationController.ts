import { useState, useMemo, useEffect } from 'react';
import {
  SimulationParams,
  SimulationOutput,
  calculateDssSimulation,
  RESIDUE_OPTIONS,
  SNI_MUTU_SPECS,
} from '../models/silica.model';
import {
  SimulationDestinationId,
  SimulationStageId,
  SIMULATION_WORKFLOW_STAGES,
  SIMULATION_DASHBOARD_META,
} from '../models/simulationWorkspace.model';
import {
  runStudy,
  demoDatasets,
  demoCharacterization,
  defaultMix,
  defaultEconomicControls,
  getDemoDataset,
  datasetLabel,
  formatIdr,
  type Characterization,
  type MixControls,
  type EconomicControls,
  type BatchProductionInputs,
  type DemoDatasetId,
  type StudyResult,
} from '../engine/study';
import {
  calcPaperResidueBridge,
  getPaperEconomicScenario,
  getPaperEconomicMeta,
  type PaperScenarioName,
  type PaperBridgeResult,
  type PaperEconomicScenario,
} from '../engine/lib/paperTeaEngine';
import {
  displayDecision,
  decisionClass,
  evidenceLabel,
} from '../utils/decision';

const DEFAULT_ACTUAL_BATCH_INPUTS: BatchProductionInputs = {
  cementKg: null,
  aggregateKg: null,
  waterKg: null,
  admixtureKg: 0,
  batchBlocks: null,
  batchesPerDay: null,
  densityKgM3: null,
};

export function useSimulationController() {
  // Workspace Stage & Supporting Dashboard Navigation State (Phase 1)
  const [activeDestination, setActiveDestination] =
    useState<SimulationDestinationId>('overview');
  const [lastActiveStageId, setLastActiveStageId] =
    useState<SimulationStageId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileStageSelectorOpen, setIsMobileStageSelectorOpen] =
    useState<boolean>(false);

  // Close mobile stage selector on Escape key or when resizing to desktop/tablet (>= 768px)
  useEffect(() => {
    if (!isMobileStageSelectorOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileStageSelectorOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileStageSelectorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileStageSelectorOpen]);

  const selectStage = (stageId: SimulationStageId) => {
    setActiveDestination(stageId);
    setLastActiveStageId(stageId);
    setIsMobileStageSelectorOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDashboard = () => {
    setActiveDestination('dashboard');
    setIsMobileStageSelectorOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToActiveStage = () => {
    setActiveDestination(lastActiveStageId);
    setIsMobileStageSelectorOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStageIndex = useMemo(() => {
    const targetId =
      activeDestination === 'dashboard' ? lastActiveStageId : activeDestination;
    return SIMULATION_WORKFLOW_STAGES.findIndex((s) => s.id === targetId);
  }, [activeDestination, lastActiveStageId]);

  const currentStageMeta = useMemo(
    () =>
      SIMULATION_WORKFLOW_STAGES[currentStageIndex] ??
      SIMULATION_WORKFLOW_STAGES[0],
    [currentStageIndex]
  );

  const hasPreviousStage = currentStageIndex > 0;
  const hasNextStage = currentStageIndex < SIMULATION_WORKFLOW_STAGES.length - 1;

  const goToPreviousStage = () => {
    if (hasPreviousStage) {
      selectStage(SIMULATION_WORKFLOW_STAGES[currentStageIndex - 1].id);
    }
  };

  const goToNextStage = () => {
    if (hasNextStage) {
      selectStage(SIMULATION_WORKFLOW_STAGES[currentStageIndex + 1].id);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const openMobileStageSelector = () => {
    setIsMobileStageSelectorOpen(true);
  };

  const closeMobileStageSelector = () => {
    setIsMobileStageSelectorOpen(false);
  };

  // Canonical Scientific Engine State (Phase 2 Integration)
  const [studyMode, setStudyMode] = useState<'demo' | 'actual'>('demo');
  const [datasetId, setDatasetId] = useState<DemoDatasetId>('qualified');
  const [characterization, setCharacterization] = useState<Characterization>(
    demoCharacterization
  );
  const [mix, setMix] = useState<MixControls>(defaultMix);
  const [economics, setEconomics] = useState<EconomicControls>(
    defaultEconomicControls
  );
  const [batchInputs, setBatchInputs] = useState<BatchProductionInputs>(
    DEFAULT_ACTUAL_BATCH_INPUTS
  );

  const selectDemoDataset = (id: DemoDatasetId) => {
    const preset = getDemoDataset(id);
    setDatasetId(preset.id);
    setCharacterization(preset.characterization);
  };

  const updateCharacterizationField = <K extends keyof Characterization>(
    field: K,
    value: Characterization[K]
  ) => {
    setCharacterization((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMixField = <K extends keyof MixControls>(
    field: K,
    value: MixControls[K]
  ) => {
    setMix((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEconomicsField = <K extends keyof EconomicControls>(
    field: K,
    value: EconomicControls[K]
  ) => {
    setEconomics((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBatchInputsField = <K extends keyof BatchProductionInputs>(
    field: K,
    value: BatchProductionInputs[K]
  ) => {
    setBatchInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const study: StudyResult = useMemo(
    () =>
      runStudy(
        characterization,
        mix,
        economics,
        batchInputs,
        studyMode
      ),
    [characterization, mix, economics, batchInputs, studyMode]
  );

  const paperScenarioName: PaperScenarioName =
    economics.scenario === 'baseline' ? 'base' : economics.scenario;

  const paperScenario: PaperEconomicScenario = useMemo(
    () => getPaperEconomicScenario(paperScenarioName),
    [paperScenarioName]
  );

  const paperBridge: PaperBridgeResult = useMemo(
    () =>
      calcPaperResidueBridge({
        substitutionPct: mix.substitution,
        massPerBlockKg: study.state.massBalance.blockMassKg ?? undefined,
      }),
    [mix.substitution, study.state.massBalance.blockMassKg]
  );

  const paperMeta = useMemo(() => getPaperEconomicMeta(), []);

  const resetStudyToDefaults = () => {
    setStudyMode('demo');
    setDatasetId('qualified');
    setCharacterization(demoCharacterization);
    setMix(defaultMix);
    setEconomics(defaultEconomicControls);
    setBatchInputs(DEFAULT_ACTUAL_BATCH_INPUTS);
  };

  // Existing Simulation State (preserved for HomeLandingPageView / SimulationSectionView compatibility)
  const [selectedResidueId, setSelectedResidueId] = useState<string>('xerogel');
  const [substitutionRate, setSubstitutionRate] = useState<number>(8); // 8% default from study case
  const [targetMutu, setTargetMutu] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [dailyCapacity, setDailyCapacity] = useState<number>(5000);
  const [sellingPricePerM2, setSellingPricePerM2] = useState<number>(80000);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);

  const simulationParams: SimulationParams = useMemo(
    () => ({
      selectedResidueId,
      substitutionRate,
      targetMutu,
      dailyCapacity,
      sellingPricePerM2,
    }),
    [selectedResidueId, substitutionRate, targetMutu, dailyCapacity, sellingPricePerM2]
  );

  const calculation: SimulationOutput = useMemo(
    () => calculateDssSimulation(simulationParams),
    [simulationParams]
  );

  const resetParams = () => {
    setSelectedResidueId('xerogel');
    setSubstitutionRate(8);
    setTargetMutu('B');
    setDailyCapacity(5000);
    setSellingPricePerM2(80000);
  };

  const openPassport = () => setIsPassportOpen(true);
  const closePassport = () => setIsPassportOpen(false);

  return {
    // Workspace navigation exports (Phase 1)
    workflowStages: SIMULATION_WORKFLOW_STAGES,
    dashboardMeta: SIMULATION_DASHBOARD_META,
    activeDestination,
    isDashboardActive: activeDestination === 'dashboard',
    lastActiveStageId,
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

    // Canonical Scientific Engine exports (Phase 2)
    studyMode,
    setStudyMode,
    datasetId,
    demoDatasets,
    selectDemoDataset,
    characterization,
    setCharacterization,
    updateCharacterizationField,
    mix,
    setMix,
    updateMixField,
    economics,
    setEconomics,
    updateEconomicsField,
    batchInputs,
    setBatchInputs,
    updateBatchInputsField,
    study,
    paperScenarioName,
    paperScenario,
    paperBridge,
    paperMeta,
    datasetLabel: datasetLabel(),
    formatIdr,
    displayDecision,
    decisionClass,
    evidenceLabel,
    resetStudyToDefaults,

    // Existing exports (HomeLandingPageView / SimulationSectionView compatibility)
    selectedResidueId,
    setSelectedResidueId,
    substitutionRate,
    setSubstitutionRate,
    targetMutu,
    setTargetMutu,
    dailyCapacity,
    setDailyCapacity,
    sellingPricePerM2,
    setSellingPricePerM2,
    isPassportOpen,
    openPassport,
    closePassport,
    resetParams,
    calculation,
    residueOptions: RESIDUE_OPTIONS,
    sniSpecs: SNI_MUTU_SPECS,
  };
}
