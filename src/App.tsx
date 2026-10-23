import { useState } from 'react';
import { Gallery } from './components/Gallery';

export default function App() {
  const [favouriteCount, setFavouriteCount] = useState<number>(0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      {/* Refined Top Navigation Bar following the Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark in display serif */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="font-serif text-2xl tracking-widest uppercase text-stone-900 font-normal hover:text-stone-700 transition-colors whitespace-nowrap shrink-0"
            >
              Lumière
            </a>
            <span className="hidden sm:inline-block text-stone-300 font-light" aria-hidden="true">
              |
            </span>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-500 font-sans">
              Photo Archive
            </span>
          </div>

          {/* Zone 2: Editorial Collection Note (Clean, unboxed typography) */}
          <div className="hidden md:flex items-center gap-3 text-xs tracking-wider uppercase text-stone-500">
            <span>Volume I</span>
            <span aria-hidden="true">·</span>
            <span>Picsum Curated</span>
            <span aria-hidden="true">·</span>
            <span>30 Works</span>
          </div>

          {/* Zone 3: Favourites Status Counter */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                favouriteCount > 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  : 'bg-stone-100 text-stone-600 border border-stone-200/60'
              }`}
              title={`${favouriteCount} photograph${favouriteCount === 1 ? '' : 's'} saved to local storage`}
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  favouriteCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-stone-400'
                }`}
                fill={favouriteCount > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>
                {favouriteCount} {favouriteCount === 1 ? 'Favourite' : 'Favourites'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Editorial Section Header */}
        <section className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-600 mb-3 font-sans font-medium">
            Permanent Exhibition
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-normal tracking-tight mb-4 text-balance">
            Archival Photography
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
            A curated collection of thirty distinct visual perspectives. Filter instantaneously
            by author or preserve individual prints into your personal collection.
          </p>
        </section>

        {/* Gallery Section */}
        <Gallery onFavouritesCountChange={setFavouriteCount} />
      </main>

      {/* Understated Quiet Footer */}
      <footer className="border-t border-stone-200/80 bg-[#F6F3EE] py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600 font-sans">
          <p>
            Lumière Photo Gallery · Curated via Picsum Photos API
          </p>
          <p className="text-stone-600">
            Selections persist automatically across browser reloads
          </p>
        </div>
      </footer>
    </div>
  );
}
