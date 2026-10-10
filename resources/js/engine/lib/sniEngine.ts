import {sniRequirements, type SNIClassRecord} from '../data/master';
import type {SNIResultState} from './contracts';

export type SNIResult={className:string;status:SNIResultState;details:{parameter:string;requirement:string;actual:number|null;result:'PRELIMINARY_PASS'|'PRELIMINARY_FAIL'|'UNKNOWN';evidence:string;validation:string}[];sourceId:string;standardId:string};

export function checkSNI(className:string, actual:{compressiveAvg?:number|null;compressiveMin?:number|null;absorption?:number|null;abrasionAvg?:number|null;abrasionMax?:number|null}) : SNIResult{
 const cls: SNIClassRecord | undefined=sniRequirements.classification.find((x:SNIClassRecord)=>x.class===className);
 const standardId=sniRequirements.standard_id;
 const sourceId=sniRequirements.source_id;
 if(!cls) return {className,status:'UNKNOWN',details:[],sourceId,standardId};
 const checks=[
  ['Compressive strength — average',`≥ ${cls.compressive_strength_avg_mpa} MPa`,actual.compressiveAvg??null,(v:number)=>v>=cls.compressive_strength_avg_mpa],
  ['Compressive strength — minimum',`≥ ${cls.compressive_strength_min_mpa} MPa`,actual.compressiveMin??null,(v:number)=>v>=cls.compressive_strength_min_mpa],
  ['Water absorption',`≤ ${cls.water_absorption_avg_max_pct}%`,actual.absorption??null,(v:number)=>v<=cls.water_absorption_avg_max_pct],
  ['Abrasion — average',`≤ ${cls.abrasion_avg_max_mm_min} mm/min`,actual.abrasionAvg??null,(v:number)=>v<=cls.abrasion_avg_max_mm_min],
  ['Abrasion — maximum',`≤ ${cls.abrasion_min_or_equivalent_max_mm_min} mm/min`,actual.abrasionMax??null,(v:number)=>v<=cls.abrasion_min_or_equivalent_max_mm_min]
 ] as const;
 const details=checks.map(([parameter,requirement,value,fn])=>({parameter,requirement,actual:value,result:(value==null?'UNKNOWN':(fn(value)?'PRELIMINARY_PASS':'PRELIMINARY_FAIL')) as 'UNKNOWN'|'PRELIMINARY_PASS'|'PRELIMINARY_FAIL',evidence:'SNI 03-0691-1996',validation:value==null?'Laboratory test required':'Mathematical preliminary comparison; verify method/replicates with the standard'}));
 const status=details.some(d=>d.result==='PRELIMINARY_FAIL')?'PRELIMINARY_FAIL':details.some(d=>d.result==='UNKNOWN')?'DATA_REQUIRED':'PRELIMINARY_PASS';
 return {className,status,details,sourceId,standardId};
}
