import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../types';

interface FetchPhotosResult {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PICSUM_API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom hook to fetch a list of 30 curated photographs from the Picsum API.
 * Encapsulates asynchronous fetching, loading state, error handling,
 * and cleanup via AbortController.
 *
 * @returns {photos, loading, error, refetch}
 */
export function useFetchPhotos(): FetchPhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(PICSUM_API_URL, { signal });

      if (!response.ok) {
        throw new Error(
          `Unable to load gallery archive (Server responded with HTTP ${response.status})`
        );
      }

      const data: Photo[] = await response.json();
      setPhotos(data);
    } catch (err: unknown) {
      // Ignore AbortError when component unmounts
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected network error occurred while retrieving photographs.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(controller.signal);

    // Cleanup abort controller on component unmount
    return () => {
      controller.abort();
    };
  }, [fetchPhotos]);

  const refetch = useCallback(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, error, refetch };
}
