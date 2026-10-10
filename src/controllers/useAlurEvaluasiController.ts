import { useState, useMemo } from 'react';
import {
  AlurEvaluasiStep,
  ALUR_EVALUASI_STEPS,
  ALUR_EVALUASI_HEADER,
  AlurEvaluasiHeader,
} from '../models/alurEvaluasi.model';

export interface UseAlurEvaluasiControllerReturn {
  header: AlurEvaluasiHeader;
  steps: AlurEvaluasiStep[];
  row1Steps: AlurEvaluasiStep[];
  row2Steps: AlurEvaluasiStep[];
  selectedStepId: string | null;
  selectedStep: AlurEvaluasiStep | null;
  setSelectedStepId: (id: string | null) => void;
  hoveredStepId: string | null;
  setHoveredStepId: (id: string | null) => void;
}

export function useAlurEvaluasiController(): UseAlurEvaluasiControllerReturn {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  const steps = ALUR_EVALUASI_STEPS;
  const header = ALUR_EVALUASI_HEADER;

  const row1Steps = useMemo(() => steps.filter((s) => s.row === 1), [steps]);
  const row2Steps = useMemo(() => steps.filter((s) => s.row === 2), [steps]);

  const selectedStep = useMemo(() => {
    const targetId = hoveredStepId || selectedStepId;
    if (!targetId) return null;
    return steps.find((s) => s.id === targetId) || null;
  }, [steps, hoveredStepId, selectedStepId]);

  return {
    header,
    steps,
    row1Steps,
    row2Steps,
    selectedStepId,
    selectedStep,
    setSelectedStepId,
    hoveredStepId,
    setHoveredStepId,
  };
}
