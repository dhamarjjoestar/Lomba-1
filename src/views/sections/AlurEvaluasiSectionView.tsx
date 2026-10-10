import React from 'react';
import { useAlurEvaluasiController } from '../../controllers/useAlurEvaluasiController';
import { AlurEvaluasiStep } from '../../models/alurEvaluasi.model';

/**
 * StepIcon: Render ikon SVG semantik sesuai tipe langkah
 */
const StepIcon: React.FC<{ type: AlurEvaluasiStep['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'flask':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      );
    case 'sync':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      );
    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      );
    case 'currency':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    case 'leaf-globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    case 'document':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      );
    case 'check-circle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    case 'traceability':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
        </svg>
      );
    default:
      return null;
  }
};

/**
 * StepItemCard: Render kartu item langkah evaluasi
 */
interface StepItemCardProps {
  step: AlurEvaluasiStep;
  isLastInRow: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const StepItemCard: React.FC<StepItemCardProps> = ({
  step,
  isLastInRow,
  isSelected,
  onHover,
  onClick,
}) => {
  return (
    <div
      onMouseEnter={() => onHover(step.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(step.id)}
      className={`group relative flex flex-col items-start cursor-pointer transition-all duration-200 hover:-translate-y-0.5 rounded-xl p-1.5 sm:p-2 ${
        isSelected ? 'bg-emerald-50/90 ring-1 ring-emerald-400' : 'hover:bg-emerald-50/50'
      } ${!isLastInRow ? 'pr-1 sm:pr-2' : ''}`}
    >
      {/* Top Header: Badge nomor & Garis penghubung horizontal */}
      <div className="w-full flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-emerald-100 text-emerald-800 shadow-xs group-hover:bg-emerald-500 group-hover:text-white'
          }`}
        >
          {step.stepNumber}
        </div>

        {/* Panah konektor ke langkah berikutnya (khusus bukan elemen terakhir di baris) */}
        {!isLastInRow ? (
          <div className="flex flex-1 items-center px-1 sm:px-2">
            <div className="h-[1.5px] w-full bg-emerald-200"></div>
            <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[6px] border-l-emerald-400"></div>
          </div>
        ) : (
          <div className="flex-1"></div>
        )}
      </div>

      {/* Body: Ikon dan teks deskripsi langkah */}
      <div className="flex items-start gap-2.5 sm:gap-3 w-full">
        <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-emerald-600 pt-0.5 group-hover:text-emerald-700 transition-colors">
          <StepIcon type={step.iconType} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-xs text-gray-800 tracking-tight leading-tight">
              {step.title}
            </h3>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-600">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * AlurEvaluasiSectionView
 * Komponen Alur Evaluasi: Dari data hingga keputusan (10 Langkah Evaluasi Terstruktur)
 * Menggunakan MVC Pattern: Model (alurEvaluasi.model.ts) & Controller (useAlurEvaluasiController.ts)
 */
export const AlurEvaluasiSectionView: React.FC = () => {
  const {
    header,
    row1Steps,
    row2Steps,
    selectedStepId,
    selectedStep,
    setSelectedStepId,
    setHoveredStepId,
  } = useAlurEvaluasiController();

  const handleCardClick = (id: string) => {
    setSelectedStepId(selectedStepId === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-8 flex justify-center bg-slate-50 border-t border-slate-200">
      {/* MAIN CONTAINER: SECTION ALUR EVALUASI */}
      <div className="w-full max-w-[1240px] canvas-bg rounded-3xl sm:rounded-[2.5rem] border border-gray-200 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.12)] p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        
        {/* Latar Belakang Daun Botanik Transparan Organik */}
        <div className="absolute -top-10 -left-10 w-60 h-60 opacity-20 pointer-events-none -z-0">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#A4C8A8]">
            <path d="M40 160C40 80 120 40 180 20C180 100 100 180 40 160Z" fill="currentColor" />
            <path d="M40 160C90 120 140 70 180 20" stroke="#75AB7B" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute -bottom-14 -right-12 w-64 h-64 opacity-20 pointer-events-none -z-0">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#A4C8A8]">
            <path d="M160 40C80 40 40 120 20 180C100 180 180 100 160 40Z" fill="currentColor" />
            <path d="M160 40C110 80 60 130 20 180" stroke="#75AB7B" strokeWidth="2" />
          </svg>
        </div>

        {/* SECTION HEADER: Hierarki Teks */}
        <div id="alur-evaluasi" className="relative z-10 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
            {/* Sisi Kiri Header */}
            <div className="space-y-1.5">
              <span className="block text-[11px] sm:text-xs font-bold tracking-[0.22em] text-emerald-700 uppercase">
                {header.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] leading-tight text-gray-900 font-extrabold tracking-tight">
                {header.title}
              </h2>
            </div>

            {/* Sisi Kanan Header */}
            <p className="text-xs sm:text-[13px] text-gray-600 max-w-md leading-relaxed md:text-right">
              {header.subtitle}
            </p>
          </div>

          {/* Mobile swipe hint banner (khusus mobile/tablet agar pengguna mengetahui alur lengkap dapat digeser) */}
          <div className="flex lg:hidden items-center justify-between text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200 rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Alur Utuh 10 Langkah (Format Desktop)</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-white px-2.5 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
              Geser horizontal →
            </span>
          </div>

          {/* WORKFLOW DIAGRAM: 10 LANGKAH DENGAN PALET EMERALD GREEN */}
          <div className="relative py-2 overflow-x-auto pb-4 pt-1 touch-pan-x custom-scrollbar">
            <div className="min-w-[920px] lg:min-w-0">

              {/* ================= BARIS 1: LANGKAH 01 - 05 ================= */}
              <div className="grid grid-cols-5 gap-3 lg:gap-4 relative z-10">
                {row1Steps.map((step, index) => (
                  <StepItemCard
                    key={step.id}
                    step={step}
                    isLastInRow={index === row1Steps.length - 1}
                    isSelected={selectedStepId === step.id}
                    onHover={setHoveredStepId}
                    onClick={handleCardClick}
                  />
                ))}
              </div>

              {/* ================= S-CURVE CONNECTOR (DARI STEP 05 KE STEP 06) ================= */}
              <div className="block w-full my-3 sm:my-4 relative h-8 sm:h-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1000 40" preserveAspectRatio="none" fill="none">
                  <path 
                    d="M 900 -15 H 960 C 975 -15, 985 -5, 985 10 C 985 22, 975 24, 960 24 H 40 C 25 24, 15 28, 15 38 V 45" 
                    stroke="#10B981" 
                    strokeWidth="1.8" 
                    strokeLinecap="round"
                  />
                  <polygon points="11,43 19,43 15,50" fill="#10B981" />
                </svg>
              </div>

              {/* ================= BARIS 2: LANGKAH 06 - 10 ================= */}
              <div className="grid grid-cols-5 gap-3 lg:gap-4 relative z-10 pt-1 sm:pt-0">
                {row2Steps.map((step, index) => (
                  <StepItemCard
                    key={step.id}
                    step={step}
                    isLastInRow={index === row2Steps.length - 1}
                    isSelected={selectedStepId === step.id}
                    onHover={setHoveredStepId}
                    onClick={handleCardClick}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Info pill saat langkah diklik / aktif */}
          {selectedStep && (
            <div className="mt-4 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-slate-700 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {selectedStep.stepNumber}
                </span>
                <span className="font-semibold text-emerald-950">{selectedStep.title}</span>
                <span className="text-emerald-700 hidden sm:inline">— {selectedStep.category}</span>
                {selectedStep.detailBadge && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 font-medium text-[11px]">
                    {selectedStep.detailBadge}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedStepId(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
              >
                Tutup
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
