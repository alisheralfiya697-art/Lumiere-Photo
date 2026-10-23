import type { FavouritesAction } from '../types';

export const FAVOURITES_STORAGE_KEY = 'gallery_favourite_photo_ids';

/**
 * Lazy initializer function for the useReducer hook.
 * Safely reads previously saved favourite photo IDs from localStorage.
 */
export function getInitialFavourites(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to load favourites from localStorage:', error);
    return [];
  }
}

/**
 * Pure reducer function to manage favourites state.
 *
 * Why useReducer instead of useState?
 * 1. Predictable state transitions: Actions clearly express user intent ('TOGGLE_FAVOURITE').
 * 2. Separation of concerns: Component dispatches intent; reducer contains state logic.
 * 3. Testability and extensibility: Easy to add new actions in the future (e.g. CLEAR_ALL).
 */
export function favouritesReducer(
  state: string[],
  action: FavouritesAction
): string[] {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload;
      const isAlreadyFavourite = state.includes(photoId);

      // If already in favourites, remove it; otherwise add it
      if (isAlreadyFavourite) {
        return state.filter((id) => id !== photoId);
      } else {
        return [...state, photoId];
      }
    }

    case 'SET_FAVOURITES': {
      return action.payload;
    }

    default:
      return state;
  }
}
