// FILE: frontend/src/pages/customer/CatalogPage.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { NavBar } from '@/components/shared/NavBar';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { CarCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCars } from '@/hooks/useCars';
import { useDebounce } from '@/hooks/useDebounce';
import type { CarFilters, CarCategory, Transmission, FuelType } from '@/types';
import { Search, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

const categories: CarCategory[] = [
  'ECONOMY',
  'COMPACT',
  'SUV',
  'LUXURY',
  'VAN',
  'ELECTRIC',
];
const transmissions: Transmission[] = ['AUTO', 'MANUAL'];
const fuelTypes: FuelType[] = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];

const CatalogPage = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 400);
  const [filters, setFilters] = useState<CarFilters>({});

  const { data, isLoading } = useCars({ ...filters, search, page, limit: 9 });
  const cars = data?.data || [];
  const meta = data?.meta;

  const updateFilter = <K extends keyof CarFilters>(
    key: K,
    value: CarFilters[K] | undefined,
  ) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === '') delete next[key];
      else next[key] = value;
      return next;
    });
    setPage(1);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => filters[k as keyof CarFilters] !== undefined,
  ).length;
  const clearAll = () => {
    setFilters({});
    setSearchRaw('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Browse Cars</h1>
          <p className="text-white/50">
            {meta ? `${meta.total} vehicles available` : 'Loading...'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside
            className={cn(
              'shrink-0 w-64 space-y-6 transition-all duration-300',
              !filtersOpen && 'hidden lg:block',
            )}
          >
            <div className="glass-card rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-brand-blue hover:underline"
                  >
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase mb-2">
                  Category
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        updateFilter(
                          'category',
                          filters.category === cat ? undefined : cat,
                        )
                      }
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                        filters.category === cat
                          ? 'bg-brand-blue/20 text-brand-blue font-medium'
                          : 'text-white/60 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase mb-2">
                  Price / Day
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder={`Min (e.g. 15000)`}
                    type="number"
                    value={filters.priceMin || ''}
                    onChange={(e) =>
                      updateFilter(
                        'priceMin',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                  <Input
                    placeholder={`Max (e.g. 95000)`}
                    type="number"
                    value={filters.priceMax || ''}
                    onChange={(e) =>
                      updateFilter(
                        'priceMax',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase mb-2">
                  Transmission
                </p>
                <div className="flex gap-2">
                  {transmissions.map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        updateFilter(
                          'transmission',
                          filters.transmission === t ? undefined : t,
                        )
                      }
                      className={cn(
                        'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
                        filters.transmission === t
                          ? 'bg-brand-blue text-white'
                          : 'glass-card text-white/50 hover:text-white border border-white/10',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase mb-2">
                  Fuel Type
                </p>
                <div className="space-y-1">
                  {fuelTypes.map((f) => (
                    <button
                      key={f}
                      onClick={() =>
                        updateFilter(
                          'fuelType',
                          filters.fuelType === f ? undefined : f,
                        )
                      }
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                        filters.fuelType === f
                          ? 'bg-brand-blue/20 text-brand-blue font-medium'
                          : 'text-white/60 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex-1 min-w-0 max-w-sm">
                <Input
                  placeholder="Search make, model..."
                  leftIcon={<Search className="w-4 h-4" />}
                  value={searchRaw}
                  onChange={(e) => {
                    setSearchRaw(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-white/10 text-sm text-white/70 hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="bg-brand-blue text-white border-0 ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </button>

              <div className="flex items-center gap-1 glass-card rounded-xl p-1 border border-white/10 ml-auto">
                <button
                  onClick={() => setLayout('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    layout === 'grid'
                      ? 'bg-brand-blue text-white'
                      : 'text-white/40 hover:text-white',
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    layout === 'list'
                      ? 'bg-brand-blue text-white'
                      : 'text-white/40 hover:text-white',
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <Badge
                    className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 cursor-pointer"
                    onClick={() => updateFilter('category', undefined)}
                  >
                    {filters.category} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {filters.transmission && (
                  <Badge
                    className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 cursor-pointer"
                    onClick={() => updateFilter('transmission', undefined)}
                  >
                    {filters.transmission} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {filters.fuelType && (
                  <Badge
                    className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 cursor-pointer"
                    onClick={() => updateFilter('fuelType', undefined)}
                  >
                    {filters.fuelType} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {(filters.priceMin || filters.priceMax) && (
                  <Badge
                    className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 cursor-pointer"
                    onClick={() => {
                      updateFilter('priceMin', undefined);
                      updateFilter('priceMax', undefined);
                    }}
                  >
                    {filters.priceMin ? formatCurrency(filters.priceMin) : '₦0'}{' '}
                    –{' '}
                    {filters.priceMax ? formatCurrency(filters.priceMax) : '∞'}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Cars grid/list */}
            {isLoading ? (
              <div
                className={cn(
                  'gap-6',
                  layout === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'space-y-4',
                )}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No cars found"
                description="Try adjusting your filters or search terms."
                action={
                  <Button variant="secondary" onClick={clearAll}>
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <div
                className={cn(
                  'gap-6',
                  layout === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'space-y-4',
                )}
              >
                {cars.map((car, i) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    layout={layout}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  page={page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
