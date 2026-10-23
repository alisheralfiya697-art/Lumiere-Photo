/**
 * Data model for a photo returned by the Picsum API
 */
export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

/**
 * Action definitions for the favourites useReducer
 */
export type FavouritesAction =
  | { type: 'TOGGLE_FAVOURITE'; payload: string }
  | { type: 'SET_FAVOURITES'; payload: string[] };
