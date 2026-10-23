import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  getInitialFavourites,
  FAVOURITES_STORAGE_KEY,
} from '../reducers/favouritesReducer';
import { PhotoCard } from './PhotoCard';
import { SearchInput } from './SearchInput';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface GalleryProps {
  onFavouritesCountChange?: (count: number) => void;
}

export function Gallery({ onFavouritesCountChange }: GalleryProps) {
  // 1. Fetching photos via the required custom hook
  const { photos, loading, error, refetch } = useFetchPhotos();

  // 2. Search query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Favourites managed strictly with useReducer (initialized from localStorage)
  const [favourites, dispatchFavourites] = useReducer(
    favouritesReducer,
    undefined,
    getInitialFavourites
  );

  // Sync favourites to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(favourites)
      );
    } catch (e) {
      console.warn('Unable to persist favourites to localStorage:', e);
    }

    if (onFavouritesCountChange) {
      onFavouritesCountChange(favourites.length);
    }
  }, [favourites, onFavouritesCountChange]);

  /**
   * 4. useCallback for search filter handler.
   *
   * Why useCallback?
   * It memoizes this callback function reference across re-renders, preventing
   * unnecessary recreation of the handler on every render (such as when toggling favourites).
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  /**
   * Helper to clear search query with useCallback
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Handler to toggle favourite dispatched to useReducer
   */
  const handleToggleFavourite = useCallback((id: string) => {
    dispatchFavourites({ type: 'TOGGLE_FAVOURITE', payload: id });
  }, []);

  /**
   * 5. useMemo to compute filtered photos list.
   *
   * Why useMemo?
   * It caches the derived filtered array and only re-runs when 'photos' or 'searchQuery' changes.
   * If the user toggles a favourite, 'photos' and 'searchQuery' haven't changed, so
   * useMemo skips recalculating the 30-item array filter.
   */
  const filteredPhotos = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    );
  }, [photos, searchQuery]);

  return (
    <section aria-label="Curated photo archive" className="w-full">
      {/* Search Input placed above the grid */}
      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        totalResults={filteredPhotos.length}
        totalPhotos={photos.length}
      />

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={refetch} />
      )}

      {/* Empty State when search has no matches */}
      {!loading && !error && filteredPhotos.length === 0 && photos.length > 0 && (
        <div className="text-center py-20 px-4 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="font-serif text-lg text-stone-900 mb-1.5">
            No matching photographers
          </h4>
          <p className="text-sm text-stone-500 mb-5 font-sans">
            No works found matching &ldquo;{searchQuery}&rdquo;. Try another name or clear your search query.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Responsive Grid: 4 columns desktop, 2 columns tablet, 1 column mobile */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
