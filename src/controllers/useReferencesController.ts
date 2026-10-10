import { useState, useMemo } from 'react';
import { SCIENTIFIC_REFERENCES, ScientificReference } from '../models/references.model';

export type ReferenceCategory = 'All' | 'Dieng' | 'Material' | 'Standar';

export function useReferencesController() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReferenceCategory>('All');

  const filteredReferences = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return SCIENTIFIC_REFERENCES.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(query) ||
        item.authors.toLowerCase().includes(query) ||
        item.keyPoint.toLowerCase().includes(query) ||
        (item.sourceId ? item.sourceId.toLowerCase().includes(query) : false) ||
        (item.doi ? item.doi.toLowerCase().includes(query) : false);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredReferences,
  };
}
