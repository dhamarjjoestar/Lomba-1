export type PrimaryStage =
  | "overview"
  | "characterization"
  | "formulation"
  | "simulation"
  | "gate"
  | "economics"
  | "environment"
  | "recommendation";

export type SupportStage =
  | "evidence"
  | "dashboard"
  | "validation"
  | "traceability"
  | "data-gaps";

export type Stage = "start" | PrimaryStage | SupportStage;
