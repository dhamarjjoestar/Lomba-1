import { useEffect, useMemo, useState } from "react";

import LandingPage from "./views/Landing/LandingPage";
import AppShell from "./components/layout/AppShell";
import StageRouter from "./app/StageRouter";

import type {
  Characterization,
  EconomicControls,
  MixControls,
  DemoDatasetId,
  BatchProductionInputs,
} from "./engine/study";

import {
  defaultEconomicControls,
  defaultMix,
  demoCharacterization,
  getDemoDataset,
  runStudy,
} from "./engine/study";

import type { Stage } from "./app/types/stage";
import { primaryStageIndex } from "./app/config/stages";
import { api } from "./lib/api";

const blankCharacterization: Characterization = {
  batch: "",
  sample: "",
  materialId: "",
  source: "Dieng geothermal silica-rich residue",
  silica: "",
  phase: "",
  particle: "",
  moisture: "",
  impurity: "",
  preprocessing: "",
};

const blankBatchInputs: BatchProductionInputs = {
  cementKg: null,
  aggregateKg: null,
  waterKg: null,
  admixtureKg: null,
  batchBlocks: null,
  batchesPerDay: null,
  densityKgM3: null,
};

const STORAGE_KEY = "silica2con-active-study-v2";

type PersistedStudy = {
  stage: Stage;
  studyMode: "demo" | "actual";
  datasetId: DemoDatasetId;
  fields: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  maxPrimaryIndex: number;
};

function loadPersistedStudy(): PersistedStudy | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as PersistedStudy;
  } catch {
    return null;
  }
}

function App() {
  const saved = useMemo(loadPersistedStudy, []);

  // Always start from landing page.
  const [stage, setStage] = useState<Stage>("start");

  const [studyMode, setStudyMode] = useState<"demo" | "actual">(
    saved?.studyMode ?? "demo",
  );

  const [datasetId, setDatasetId] = useState<DemoDatasetId>(
    saved?.datasetId ?? "qualified",
  );

  const [fields, setFields] = useState<Characterization>(
    saved?.fields ?? demoCharacterization,
  );

  const [mix, setMix] = useState<MixControls>(
    saved?.mix ?? defaultMix,
  );

  const [economics, setEconomics] = useState<EconomicControls>(
    saved?.economics ?? defaultEconomicControls,
  );

  /**
   * Production/batch inputs are intentionally kept separate
   * from material characterization.
   *
   * Demo mode may use explicit demo values inside runStudy().
   * Actual mode must receive actual user-provided values.
   */
  const [batchInputs, setBatchInputs] =
    useState<BatchProductionInputs>(blankBatchInputs);

  const [maxPrimaryIndex, setMaxPrimaryIndex] = useState(
    saved?.maxPrimaryIndex ?? 0,
  );

  const [backendStudyId, setBackendStudyId] = useState<number | null>(
    null,
  );

  /**
   * Scientific study calculation.
   *
   * DEMO:
   *   runStudy() uses DEMO_BATCH_INPUTS internally.
   *
   * ACTUAL:
   *   runStudy() receives batchInputs from this state.
   */
  const study = useMemo(
    () =>
      runStudy(
        fields,
        mix,
        economics,
        batchInputs,
        studyMode,
      ),
    [
      fields,
      mix,
      economics,
      batchInputs,
      studyMode,
    ],
  );

  // Optional Laravel persistence.
  // Disabled by default so the original UI remains usable standalone.
  useEffect(() => {
    if (
      !api.enabled ||
      stage === "start" ||
      backendStudyId !== null
    ) {
      return;
    }

    api
      .createStudy({
        name: `${studyMode === "demo" ? "Demo" : "Actual"} Study`,
        mode: studyMode,
        dataset_id: datasetId,
        status: "IN_PROGRESS",
        characterization: fields,
        mix_controls: mix,
        economics_controls: economics,
        metadata: {
          source: "SILICA2CON React UI",
        },
      })
      .then((created) => {
        setBackendStudyId(created.id);
      })
      .catch((error) => {
        console.error(
          "SILICA2CON backend persistence unavailable",
          error,
        );
      });
  }, [
    api.enabled,
    stage,
    backendStudyId,
    studyMode,
    datasetId,
  ]);

  useEffect(() => {
    if (
      !api.enabled ||
      backendStudyId === null ||
      stage === "start"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      api
        .updateStudy(backendStudyId, {
          mode: studyMode,
          dataset_id: datasetId,
          status: "IN_PROGRESS",
          characterization: fields,
          mix_controls: mix,
          economics_controls: economics,
          metadata: {
            current_stage: stage,
            max_primary_index: maxPrimaryIndex,
          },
        })
        .catch((error) =>
          console.error(
            "Failed to persist study",
            error,
          ),
        );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    api.enabled,
    backendStudyId,
    stage,
    studyMode,
    datasetId,
    fields,
    mix,
    economics,
    maxPrimaryIndex,
  ]);

  useEffect(() => {
    if (stage === "start") return;

    const payload: PersistedStudy = {
      stage,
      studyMode,
      datasetId,
      fields,
      mix,
      economics,
      maxPrimaryIndex,
    };

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
      // Persistence is best-effort.
    }
  }, [
    stage,
    studyMode,
    datasetId,
    fields,
    mix,
    economics,
    maxPrimaryIndex,
  ]);

  const resetBatchInputs = () => {
    setBatchInputs({
      cementKg: null,
      aggregateKg: null,
      waterKg: null,
      admixtureKg: null,
      batchBlocks: null,
      batchesPerDay: null,
      densityKgM3: null,
    });
  };

  const startStudy = (mode: "demo" | "actual") => {
    setStudyMode(mode);

    setDatasetId(
      mode === "demo"
        ? "qualified"
        : "incomplete",
    );

    setFields(
      mode === "demo"
        ? demoCharacterization
        : blankCharacterization,
    );

    setMix(defaultMix);
    setEconomics(defaultEconomicControls);

    /**
     * Always start a fresh batch input state.
     *
     * Actual mode starts empty.
     * Demo mode remains empty here because runStudy()
     * provides DEMO_BATCH_INPUTS internally.
     */
    resetBatchInputs();

    setMaxPrimaryIndex(0);
    setBackendStudyId(null);

    // Landing → Overview.
    setStage("overview");
  };

  const startMetopen = () => {
    // Initialize study state with demo mode, same as startStudy.
    setStudyMode("demo");
    setDatasetId("qualified");
    setFields(demoCharacterization);
    setMix(defaultMix);
    setEconomics(defaultEconomicControls);
    resetBatchInputs();
    setMaxPrimaryIndex(0);
    setBackendStudyId(null);

    // Landing → Metopen (Evidence/Methodology).
    setStage("evidence");
  };

  const selectDataset = (id: DemoDatasetId) => {
    setStudyMode("demo");
    setDatasetId(id);

    setFields(
      getDemoDataset(id).characterization,
    );

    // Dataset selection is demo-only.
    resetBatchInputs();

    setMaxPrimaryIndex((current) =>
      Math.max(
        current,
        primaryStageIndex("characterization"),
      ),
    );

    setStage("characterization");
  };

  const resetStudy = () => {
    setStage("start");

    setStudyMode("demo");
    setDatasetId("qualified");

    setFields(demoCharacterization);
    setMix(defaultMix);
    setEconomics(defaultEconomicControls);

    resetBatchInputs();

    setMaxPrimaryIndex(0);
    setBackendStudyId(null);

    try {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } catch {
      // Ignore storage errors.
    }
  };

  const changeStage = (next: Stage) => {
    const nextIndex = primaryStageIndex(next);

    if (nextIndex >= 0) {
      setMaxPrimaryIndex((current) =>
        Math.max(current, nextIndex),
      );
    }

    setStage(next);
  };

  // Landing page is the entry point.
  if (stage === "start") {
    return (
      <LandingPage onStart={startStudy} onOpenMetopen={startMetopen} />
    );
  }

  return (
    <AppShell
      stage={stage}
      setStage={changeStage}
      resetStudy={resetStudy}
      characterization={fields}
      studyMode={studyMode}
      maxPrimaryIndex={maxPrimaryIndex}
    >
      <StageRouter
  stage={stage}
  study={study}
  fields={fields}
  mix={mix}
  economics={economics}
  batchInputs={batchInputs}
  setBatchInputs={setBatchInputs}
  datasetId={datasetId}
  setFields={setFields}
  setMix={setMix}
  setEconomics={setEconomics}
  setStage={changeStage}
  selectDataset={selectDataset}
  studyMode={studyMode}
/>
    </AppShell>
  );
}

export default App;