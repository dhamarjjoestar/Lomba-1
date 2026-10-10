import { validationRoadmap as canonicalValidationRoadmap, directPavingReplacementRange } from '../data/master';
import type {ValueStatus} from './contracts';

export type Priority='CRITICAL'|'HIGH'|'MEDIUM'|'LOW';
export interface ValidationStep { parameter:string; why:string; test:string; method:string; status:Extract<ValueStatus,'VALIDATION_REQUIRED'|'DATA_REQUIRED'>; priority:Priority }

const priorityForPhase: Record<number, Priority> = {1:'CRITICAL',2:'HIGH',3:'CRITICAL',4:'CRITICAL',5:'MEDIUM',6:'HIGH',7:'MEDIUM'};

export function validationRoadmap(): ValidationStep[]{
 const directRange=directPavingReplacementRange();
 return canonicalValidationRoadmap.map((step) => ({
   parameter: step.name,
   why: explanationFor(step.name),
   test: step.required_outputs.join(', '),
   method: methodFor(step.name),
   status: step.roadmap_status === 'VALIDATION_REQUIRED' ? 'VALIDATION_REQUIRED' : 'DATA_REQUIRED',
   priority: priorityForPhase[step.phase] ?? 'MEDIUM',
 }));

 function explanationFor(name:string):string {
   if(name==='Candidate mix matrix') return `Menyusun formulasi terkontrol di sekitar rentang literatur paving langsung ${directRange} tanpa menganggap adanya nilai optimum.`;
   if(name==='Material characterization') return 'Confirms the actual residue identity and whether the SILICA2CON sample is comparable to literature context.';
   if(name==='Pengujian paving block') return 'Menghasilkan data kinerja tingkat produk aktual yang diperlukan untuk kesimpulan teknis dan SNI awal yang lebih kuat.';
   if(name==='Pre-processing study') return 'Quantifies yield and processing burden instead of treating processing losses/energy as hidden constants.';
   if(name==='TEA/LCA update') return 'Replaces scenario proxies with measured/local economic and environmental inputs.';
   if(name==='Model calibration') return 'Prevents unsupported prediction by requiring a sufficient paired experimental dataset and validation.';
   if(name==='Prototype/pilot') return 'Tests production consistency and field-relevant performance beyond laboratory screening.';
   return 'Diperlukan untuk mengurangi ketidakpastian sebelum keputusan engineering yang lebih kuat dapat dibuat.';
 }
 function methodFor(name:string):string {
   if(name==='Material characterization') return 'Laboratory characterization';
   if(name==='Pre-processing study') return 'Process data collection';
   if(name==='Candidate mix matrix') return 'Rancangan eksperimen';
   if(name==='Pengujian paving block') return 'Metode SNI/pengujian yang berlaku';
   if(name==='Model calibration') return 'Model calibration + cross-validation';
   if(name==='TEA/LCA update') return 'Measured/local data collection';
   return 'Pilot/field validation';
 }
}
