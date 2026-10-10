import {
  ArrowRight,
  Check,
  Database,
  FileCheck2,
  FlaskConical,
  Lightbulb,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import type { Stage } from "../../app/types/stage";
import {
  primaryStages,
  supportStages,
} from "../../app/config/stages";

type Guide = {
  objective: string;
  input: string;
  output: string;
  next?: string;
};

const guides: Partial<Record<Stage, Guide>> = {


 
};

const supportGuides: Partial<Record<Stage, Guide>> = {
  
};

const icons = {
  overview: Target,
  characterization: FlaskConical,
  formulation: SlidersHorizontal,
  simulation: Lightbulb,
  gate: ShieldCheck,
  economics: Database,
  environment: FileCheck2,
  recommendation: ShieldCheck,
} as const;

export default function WorkflowGuide({
  stage,
}: {
  stage: Stage;
}) {
  const primaryIndex = primaryStages.findIndex(
    (item) => item.id === stage,
  );

  const isPrimary = primaryIndex >= 0;

  const item = isPrimary
    ? primaryStages[primaryIndex]
    : supportStages.find(
        (supportStage) => supportStage.id === stage,
      );

  const guide = (
    isPrimary
      ? guides[stage]
      : supportGuides[stage]
  ) as Guide | undefined;

  if (!item || !guide) {
    return null;
  }

  const Icon = isPrimary
    ? icons[stage as keyof typeof icons] ?? Target
    : item.icon;

  return (
    <section
      className={`workflow-guide ${
        isPrimary ? "is-primary" : "is-support"
      }`}
    >
      <div className="workflow-guide-heading">
        <span className="workflow-guide-step">
          {isPrimary
            ? `${item.short} / ${primaryStages.length - 1}`
            : "SUPPORT"}
        </span>

        <Icon size={16} />

        <div>
          <strong>{item.label}</strong>
          <span>{guide.objective}</span>
        </div>
      </div>

      <div className="workflow-guide-flow">
        <div>
          <span>INPUT</span>
          <strong>{guide.input}</strong>
        </div>

        <ArrowRight size={15} />

        <div>
          <span>OUTPUT</span>
          <strong>{guide.output}</strong>
        </div>

        {guide.next && (
          <>
            <ArrowRight size={15} />

            <div className="workflow-guide-next">
              <span>NEXT</span>

              <strong>
                <Check size={12} />
                {guide.next}
              </strong>
            </div>
          </>
        )}
      </div>
    </section>
  );
}