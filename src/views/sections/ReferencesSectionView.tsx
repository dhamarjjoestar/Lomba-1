import React from 'react';
import { Search } from 'lucide-react';
import { useReferencesController, ReferenceCategory } from '../../controllers/useReferencesController';

export const ReferencesSectionView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredReferences,
  } = useReferencesController();

  const categories: ReferenceCategory[] = ['All', 'Dieng', 'Material', 'Standar'];

  return (
    <div className="space-y-6">
      {/* Search bar & Category filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari literatur / kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* References List */}
      <div className="space-y-4">
        {filteredReferences.map((item) => {
          const hasValidDoi = Boolean(
            item.doi && item.doi.trim() !== '' && item.doi.trim() !== '—'
          );

          return (
            <div
              key={`${item.sourceId ?? 'REF'}-${item.year}-${item.title}`}
              className="p-5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span>
                    {item.authors} ({item.year})
                  </span>
                  {item.sourceId && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {item.sourceId}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </div>
                <div className="text-xs text-slate-600 italic">
                  {item.source}
                </div>
                {hasValidDoi && (
                  <div className="pt-0.5">
                    <code className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      DOI: {item.doi}
                    </code>
                  </div>
                )}
                <div className="mt-2 text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/60">
                  <strong className="font-semibold">Relevansi GEOCEDS: </strong>
                  {item.keyPoint}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                  {item.category}
                </span>
              </div>
            </div>
          );
        })}

        {filteredReferences.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-500">
            Tidak ada literatur yang cocok dengan kata kunci pencarian.
          </div>
        )}
      </div>
    </div>
  );
};
