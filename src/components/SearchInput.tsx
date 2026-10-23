import type { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  totalResults: number;
  totalPhotos: number;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  totalResults,
  totalPhotos,
}: SearchInputProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-700 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search photographs by author name…"
          aria-label="Filter photographs by author name"
          className="w-full pl-11 pr-11 py-3.5 bg-white/90 border border-stone-200/90 rounded-full text-stone-900 placeholder:text-stone-500 text-sm shadow-xs transition-all duration-200 focus:outline-none focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200/60"
        />

        {/* Clear Button (Visible only when text exists) */}
        {value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear author search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-xs text-stone-600 transition-colors">
              ✕
            </span>
          </button>
        )}
      </div>

      {/* Subtle, unboxed count indicator */}
      <div className="mt-2.5 flex items-center justify-between px-3 text-xs text-stone-600">
        <span>
          {value ? (
            <>
              Found <strong className="font-medium text-stone-800">{totalResults}</strong> of {totalPhotos} photographs
            </>
          ) : (
            <span>Filtering applies instantly without network reload</span>
          )}
        </span>

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Reset filter
          </button>
        )}
      </div>
    </div>
  );
}
