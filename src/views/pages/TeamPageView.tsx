import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { TeamSectionView } from '../sections/TeamSectionView';

interface TeamPageViewProps {
  onBackToHome: () => void;
}

export const TeamPageView: React.FC<TeamPageViewProps> = ({ onBackToHome }) => {
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
        <div className="bg-white rounded-xl border border-slate-200/90 py-4 px-6 shadow-xs max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50/90 border border-emerald-200/80 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Page Khusus: Identitas Tim Pengembang</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Tim Peneliti GEOCEDS Universitas Negeri Semarang
          </h1>
        </div>

        {/* Modular Team View */}
        <TeamSectionView />
      </div>
    </div>
  );
};
