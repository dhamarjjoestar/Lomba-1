import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { MetopenSectionView } from '../sections/MetopenSectionView';
import { ReferencesSectionView } from '../sections/ReferencesSectionView';

interface MetopenPageViewProps {
  onBackToHome: () => void;
}

export const MetopenPageView: React.FC<MetopenPageViewProps> = ({ onBackToHome }) => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb / Back Button */}
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Beranda</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-800 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Page Khusus: Metodologi Penelitian &amp; Validasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Metodologi Closed-Loop, DOE, RSM &amp; Provenance Data
              </h1>
            </div>
          </div>
        </div>

        {/* Modular Metopen View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <MetopenSectionView />
        </div>

        {/* Modular References View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Landasan Pustaka &amp; Rujukan Ilmiah</h2>
            <p className="text-xs text-slate-500 mt-1">Daftar literatur primer pendukung data provenance GEOCEDS.</p>
          </div>
          <ReferencesSectionView />
        </div>
      </div>
    </div>
  );
};
