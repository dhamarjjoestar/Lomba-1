import {
  AlertTriangle,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  Layers3,
  Leaf,
  Network,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import type { PrimaryStage, Stage, SupportStage } from "../types/stage";

export type StageConfig<T extends Stage = Stage> = {
  id: T;
  label: string;
  short: string;
  icon: typeof Gauge;
};

export const primaryStages: StageConfig<PrimaryStage>[] = [
  {
    id: "overview",
    label: "Overview",
    short: "00",
    icon: Gauge,
  },
  {
    id: "characterization",
    label: "Karakterisasi Material",
    short: "01",
    icon: TestTube2,
  },
  {
    id: "formulation",
    label: "Formulasi Kandidat",
    short: "02",
    icon: Layers3,
  },
  {
    id: "simulation",
    label: "Analisis Kandidat",
    short: "03",
    icon: Gauge,
  },
  {
    id: "gate",
    label: "Gerbang Teknis",
    short: "04",
    icon: ClipboardCheck,
  },
  {
    id: "economics",
    label: "Ekonomi",
    short: "05",
    icon: Database,
  },
  {
    id: "environment",
    label: "Lingkungan",
    short: "06",
    icon: Leaf,
  },
  {
    id: "recommendation",
    label: "Keputusan",
    short: "07",
    icon: ShieldCheck,
  },
];

export const supportStages: StageConfig<SupportStage>[] = [
  {
    id: "evidence",
    label: "Metodologi",
    short: "—",
    icon: FileText,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    short: "—",
    icon: Gauge,
  },
  {
    id: "validation",
    label: "Peta Jalan Validasi",
    short: "—",
    icon: Network,
  },
  {
    id: "traceability",
    label: "Material Passport",
    short: "—",
    icon: Network,
  },
  {
    id: "data-gaps",
    label: "Kesenjangan Data",
    short: "—",
    icon: AlertTriangle,
  },
];

export const stages: StageConfig[] = [
  ...primaryStages,
  ...supportStages,
];

export function primaryStageIndex(stage: Stage): number {
  return primaryStages.findIndex((item) => item.id === stage);
}

export function stageConfig(stage: Stage): StageConfig | undefined {
  return stages.find((item) => item.id === stage);
}