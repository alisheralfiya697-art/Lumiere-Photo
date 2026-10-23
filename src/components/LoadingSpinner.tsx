export function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-28 px-4 text-center"
    >
      {/* Refined double-ring spinner with subtle opacity */}
      <div className="relative w-12 h-12 mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
        <div className="absolute inset-0 rounded-full border-2 border-stone-800 border-t-transparent animate-spin" />
      </div>

      <p className="font-serif text-lg tracking-wide text-stone-800">
        Curating Exhibition Archive
      </p>
      <p className="text-xs tracking-wider uppercase text-stone-600 mt-1.5 font-sans">
        Fetching 30 high-resolution works from Picsum
      </p>
      <span className="sr-only">Loading photographs, please wait...</span>
    </div>
  );
}
