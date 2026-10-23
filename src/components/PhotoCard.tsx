import { useState } from 'react';
import type { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

export function PhotoCard({
  photo,
  isFavourite,
  onToggleFavourite,
}: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // We request an optimized 800x600 thumbnail from Picsum rather than the raw 5000x3333 file.
  // This drastically reduces network transfer while maintaining retina-grade clarity.
  const optimizedUrl = `https://picsum.photos/id/${photo.id}/800/600`;

  return (
    <article className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300">
      {/* Visual Image Container with fixed 4:3 aspect ratio to prevent CLS */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {/* Shimmer Placeholder while image is loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200/50 animate-pulse" />
        )}

        {imageError ? (
          /* Graceful Fallback if image fails to load */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-400 text-center">
            <svg
              className="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-sans text-stone-500">Image Preview Unavailable</span>
          </div>
        ) : (
          <img
            src={optimizedUrl}
            alt={`Photograph captured by ${photo.author}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Try fallback to original download_url once, otherwise trigger error state
              setImageError(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Ambient Subtle Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Card Content & Action Bar */}
      <div className="flex items-center justify-between p-4 gap-3 bg-white">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 font-sans font-medium">
            Photographer
          </p>
          <h3
            title={photo.author}
            className="font-serif text-base text-stone-900 font-normal truncate tracking-tight mt-0.5"
          >
            {photo.author}
          </h3>
        </div>

        {/* Heart / Favourite Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          aria-pressed={isFavourite}
          className={`shrink-0 p-2.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 ${
            isFavourite
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-stone-50 text-stone-400 hover:text-stone-700 hover:bg-stone-100'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 active:scale-80 ${
              isFavourite ? 'scale-110' : 'scale-100'
            }`}
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isFavourite ? 1.5 : 1.75}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
