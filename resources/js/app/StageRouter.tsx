import OverviewPage from "../views/Overview/OverviewPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import CharacterizationPage from "../pages/Characterization/CharacterizationPage";
import FormulationPage from "../pages/Formulation/FormulationPage";
import SimulationPage from "../pages/Simulation/SimulationPage";
import MethodologyPage from "../pages/Evidence/MethodologyPage";
import GatePage from "../pages/Gate/GatePage";
import EconomicsPage from "../pages/Economics/EconomicsPage";
import EnvironmentPage from "../pages/Environment/EnvironmentPage";
import RecommendationPage from "../pages/Recommendation/RecommendationPage";
import ValidationPage from "../pages/Validation/ValidationPage";
import TraceabilityPage from "../pages/Traceability/TraceabilityPage";
import DataGapPage from "../pages/DataGaps/DataGapPage";

import type { Stage } from "./types/stage";

import type {
  Characterization,
  EconomicControls,
  MixControls,
  StudyResult,
  DemoDatasetId,
  BatchProductionInputs,
} from "../engine/study";

interface StageRouterProps {
  stage: Stage;
  study: StudyResult;

  fields: Characterization;
  mix: MixControls;
  economics: EconomicControls;
  batchInputs: BatchProductionInputs;
  datasetId: DemoDatasetId;

  setFields: (
    value:
      | Characterization
      | ((current: Characterization) => Characterization),
  ) => void;

  setMix: (
    value:
      | MixControls
      | ((current: MixControls) => MixControls),
  ) => void;

  setEconomics: (
    value:
      | EconomicControls
      | ((current: EconomicControls) => EconomicControls),
  ) => void;

  setBatchInputs: (
    value:
      | BatchProductionInputs
      | ((current: BatchProductionInputs) => BatchProductionInputs),
  ) => void;

  setStage: (stage: Stage) => void;
  selectDataset: (id: DemoDatasetId) => void;
  studyMode?: "demo" | "actual";
}

export default function StageRouter({
  stage,
  study,
  fields,
  mix,
  economics,
  batchInputs,
  datasetId,
  setFields,
  setMix,
  setEconomics,
  setBatchInputs,
  setStage,
  selectDataset,
  studyMode = "demo",
}: StageRouterProps) {
  const next = (target: Stage) => () => setStage(target);

  switch (stage) {
    case "overview":
      return (
        <OverviewPage
          study={study}
          fields={fields}
          mix={mix}
          next={next("characterization")}
          studyMode={studyMode}
        />
      );

    case "characterization":
      return (
        <CharacterizationPage
          fields={fields}
          setFields={setFields}
          study={study}
          next={
            studyMode === "actual" &&
            study.science.materialQualification.status === "INSUFFICIENT_DATA"
              ? next("data-gaps")
              : next("formulation")
          }
          studyMode={studyMode}
          datasetId={datasetId}
          selectDataset={selectDataset}
        />
      );

    case "formulation":
      return (
        <FormulationPage
          values={mix}
          setValues={setMix}
          study={study}
          next={next("simulation")}
          back={next("characterization")}
        />
      );

    case "simulation":
      return (
        <SimulationPage
          study={study}
          mix={mix}
          batchInputs={batchInputs}
          setBatchInputs={setBatchInputs}
          studyMode={studyMode}
          next={next("gate")}
          back={next("formulation")}
        />
      );

    case "evidence":
      return (
        <MethodologyPage
          study={study}
          next={next("gate")}
          back={next("simulation")}
        />
      );

    case "dashboard":
      return (
        <DashboardPage
          study={study}
          mix={mix}
          setStage={setStage}
        />
      );

    case "gate":
      return (
        <GatePage
          study={study}
          mix={mix}
          next={next("economics")}
          back={next("simulation")}
        />
      );

    case "economics":
      return (
        <EconomicsPage
          study={study}
          mix={mix}
          next={next("environment")}
          back={next("gate")}
          economics={economics}
          setEconomics={setEconomics}
        />
      );

    case "environment":
      return (
        <EnvironmentPage
          study={study}
          next={next("recommendation")}
          back={next("economics")}
        />
      );

    case "recommendation":
      return (
        <RecommendationPage
          study={study}
          fields={fields}
          next={next("validation")}
          back={next("environment")}
        />
      );

    case "validation":
      return (
        <ValidationPage
          study={study}
          next={next("traceability")}
          back={next("recommendation")}
        />
      );

    case "traceability":
      return (
        <TraceabilityPage
          study={study}
          fields={fields}
          mix={mix}
          setStage={setStage}
        />
      );

    case "data-gaps":
      return (
        <DataGapPage
          study={study}
          fields={fields}
          mix={mix}
          setStage={setStage}
        />
      );

    default:
      return null;
  }
}
