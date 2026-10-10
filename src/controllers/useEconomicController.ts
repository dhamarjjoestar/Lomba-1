import { useState } from 'react';
import {
  MASS_BALANCE_DATA,
  CAPEX_DATA,
  OPEX_DATA,
  SCENARIO_DATA,
} from '../models/economic.model';

export type EconomicTab = 'neraca' | 'capex_opex' | 'skenario';

export function useEconomicController() {
  const [activeTab, setActiveTab] = useState<EconomicTab>('neraca');

  return {
    activeTab,
    setActiveTab,
    massBalanceData: MASS_BALANCE_DATA,
    capexData: CAPEX_DATA,
    opexData: OPEX_DATA,
    scenarioData: SCENARIO_DATA,
  };
}
