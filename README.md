# Lumière — Curated Photo Gallery

An understated, luxury photo gallery built with React, Vite, and Tailwind CSS. The application showcases 30 curated photographs fetched from the Picsum API, featuring real-time client-side author filtering, persistent favourites management via `useReducer` and `localStorage`, and responsive grid presentation with editorial typography.

---

## Table of Contents

- [Features & Requirements Overview](#features--requirements-overview)
- [Tech Stack](#tech-stack)
- [Local Setup & Run Instructions](#local-setup--run-instructions)
- [Architecture & Core Concepts](#architecture--core-concepts)
  - [1. Custom Hook: `useFetchPhotos`](#1-custom-hook-usefetchphotos)
  - [2. Favourites State: `useReducer` & `localStorage`](#2-favourites-state-usereducer--localstorage)
  - [3. Optimization: `useCallback` & `useMemo`](#3-optimization-usecallback--usememo)
  - [4. Solved Challenge: Layout Stability & Asset Bandwidth](#4-solved-challenge-layout-stability--asset-bandwidth)
- [Five-Minute Screen Recording Checklist & Script](#five-minute-screen-recording-checklist--script)
- [Recording & Sharing Guidance](#recording--sharing-guidance)
- [Pushing to a Public GitHub Repository](#pushing-to-a-public-github-repository)

---

## Features & Requirements Overview

- **Custom Fetching Hook (`useFetchPhotos`)**: Encapsulates asynchronous data fetching from `https://picsum.photos/v2/list?limit=30`, returning `{ photos, loading, error }`.
- **Refined Loading & Error States**: An elegant, subtle double-ring spinner while fetching and a styled fallback card with retry capabilities if the request fails.
- **Responsive Four-Column Grid**:
  - Desktop: 4 columns (`lg:grid-cols-4`)
  - Tablet: 2 columns (`md:grid-cols-2`)
  - Mobile: 1 column (`grid-cols-1`)
- **Interactive Photo Cards**: Each card displays the curated image (fixed 4:3 aspect ratio to eliminate layout shift), the author's name, and an accessible heart toggle button.
- **Instant Author Search**: Real-time client-side filtering by author name as you type without triggering additional network requests or page reloads.
- **Hook Discipline**:
  - `useCallback` for search filter event handling.
  - `useMemo` for computing the filtered photo list.
  - `useReducer` for managing favourites state instead of `useState`.
- **Persistence**: Favourites automatically persist in `localStorage` across page reloads.
- **Aesthetic Direction**: Understated luxury palette (warm ivory `#FAF8F5`, deep charcoal `#1C1917`, soft stone borders, and Playfair Display serif typography).

---

## Tech Stack

- **React 19** (Functional components, custom hooks, `useReducer`, `useMemo`, `useCallback`)
- **TypeScript** (Strict type safety for Photos and Action contracts)
- **Vite** (Lightning-fast development server and production bundler)
- **Tailwind CSS v4** (Modern utility-first styling with zero third-party component libraries)

---

## Local Setup & Run Instructions

Follow these steps to run the application on your local machine:

### Prerequisites

Ensure you have Node.js (version 18 or newer) and npm installed:

```bash
node -v
npm -v
```

### Installation & Launch

1. **Clone the repository or open the project folder**:
   ```bash
   cd photo-gallery
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` (or the port displayed in your terminal).

5. **Build for production**:
   ```bash
   npm run build
   ```
   To preview the production build locally:
   ```bash
   npm run preview
   ```

---

## Architecture & Core Concepts

### 1. Custom Hook: `useFetchPhotos`

Located at: `src/hooks/useFetchPhotos.ts`

- **Purpose**: Separates data-fetching logic entirely from presentation components. The `Gallery` component consumes this hook rather than initiating API calls itself.
- **Return Signature**:
  ```ts
  {
    photos: Photo[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }
  ```
- **Error & Cleanup Handling**:
  - Uses an `AbortController` signal to safely cancel in-flight requests if the component unmounts, preventing memory leaks and state updates on unmounted trees.
  - Catches HTTP non-200 responses as well as network failures, providing human-readable error messages.

### 2. Favourites State: `useReducer` & `localStorage`

Located at: `src/reducers/favouritesReducer.ts`

- **Why `useReducer` instead of `useState`?**
  - **Predictable Transitions**: All state mutations are centralized into explicit, named actions (e.g., `TOGGLE_FAVOURITE`).
  - **Separation of Concerns**: The UI only dispatches an intention with a payload; the reducer handles the business logic (checking membership and immutably adding or removing the item).
  - **Extensibility**: If you later need actions like `CLEAR_ALL` or `IMPORT_FAVOURITES`, you can add them without altering component code.
- **Action Schema**:
  ```ts
  export type FavouritesAction =
    | { type: 'TOGGLE_FAVOURITE'; payload: string }
    | { type: 'SET_FAVOURITES'; payload: string[] };
  ```
- **Persistence Pattern**:
  1. **Lazy Initialization**: `useReducer(favouritesReducer, undefined, getInitialFavourites)` reads from `localStorage` once on initialization without slowing down subsequent renders.
  2. **Synchronization**: A `useEffect` watches `favourites` and writes the updated array back to `localStorage` as JSON whenever it changes.

### 3. Optimization: `useCallback` & `useMemo`

Located at: `src/components/Gallery.tsx`

#### `useCallback`
```tsx
const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
}, []);
```
- **What it does**: Memoizes the function definition across re-renders.
- **What changes if removed?**: A new function instance is instantiated every time `Gallery` renders (e.g. whenever a favourite is toggled). By keeping the reference stable, child components (like `SearchInput`) do not receive new prop references unnecessarily.

#### `useMemo`
```tsx
const filteredPhotos = useMemo(() => {
  const trimmed = searchQuery.trim().toLowerCase();
  if (!trimmed) return photos;
  return photos.filter((photo) =>
    photo.author.toLowerCase().includes(trimmed)
  );
}, [photos, searchQuery]);
```
- **What it does**: Computes and caches the filtered list of photos. It only recalculates when either `photos` or `searchQuery` changes.
- **What changes if removed?**: The `.filter()` loop over the 30 photo items would execute on **every single render** — including when the user clicks a favourite heart on any card, even though the search input and photo list did not change. `useMemo` isolates filtering to search input changes only.

### 4. Solved Challenge: Layout Stability & Asset Bandwidth

- **The Challenge**: The Picsum API returns `download_url` pointing to raw photographic files measuring up to **5000 × 3333 pixels** (~4–6 MB each). Loading 30 of these raw files simultaneously would download over **120 MB of data**, causing significant network latency, high CPU usage, and severe Cumulative Layout Shift (CLS) as variable-height images popped into the grid.
- **The Solution**:
  1. Configured responsive URL sizing via `https://picsum.photos/id/{id}/800/600`, reducing data weight by over 90% while delivering crisp retina quality.
  2. Applied an explicit `aspect-[4/3]` container on every card paired with a subtle shimmer placeholder. The container geometry is reserved immediately, resulting in **zero layout shifts (CLS = 0)**.
  3. Added an `onError` fallback mechanism to ensure the interface never displays broken browser image icons.

---

## Five-Minute Screen Recording Checklist & Script

Use this structured timeline during your 5-minute recording:

| Time | Topic | Demonstration & Speaking Points |
| :--- | :--- | :--- |
| **0:00 – 1:00** | **App Walkthrough & Core Flow** | • Open the browser at `http://localhost:3000`.<br>• Show initial load with the refined spinner.<br>• Demonstrate responsive 4-column desktop layout.<br>• Type an author's name (e.g., "Paul" or "Alejandro") into the search box: highlight instant filtering with no network request or page refresh.<br>• Toggle the heart on 2–3 photos: show the header counter and heart state change.<br>• Refresh the browser page: show that favourited items remain selected from `localStorage`. |
| **1:00 – 2:00** | **`useFetchPhotos` Custom Hook** | • Switch to VS Code and open `src/hooks/useFetchPhotos.ts`.<br>• Explain the return object: `{ photos, loading, error, refetch }`.<br>• Point out `AbortController` in `useEffect` for clean unmounting.<br>• Explain that `Gallery.tsx` consumes this hook rather than doing its own fetching, keeping the component declarative and clean.<br>• Show the graceful error state in `ErrorMessage.tsx` and retry capability. |
| **2:00 – 3:00** | **Favourites with `useReducer`** | • Open `src/reducers/favouritesReducer.ts`.<br>• Explain `TOGGLE_FAVOURITE` action: toggles the ID by filtering out or appending.<br>• Explain **why `useReducer`**: enforces predictable state transitions, separates state logic from the UI, and simplifies persistence.<br>• Point out `getInitialFavourites` lazy initialization and the `useEffect` sync to `localStorage`. |
| **3:00 – 4:00** | **`useCallback` & `useMemo`** | • Open `src/components/Gallery.tsx`.<br>• Explain `handleSearchChange` wrapped in `useCallback`: caches the function reference to prevent recreation on unrelated renders.<br>• Explain `filteredPhotos` wrapped in `useMemo`: caches the filtered array so toggling a favourite doesn't re-run the search filter loop.<br>• Clarify what changes if removed: plain function recreated every render; filter recalculated on every favourite toggle. |
| **4:00 – 5:00** | **Challenge & Wrap-up** | • Explain the challenge: handling Picsum's 5000x3333 raw images and preventing layout shift.<br>• Show the solution in `PhotoCard.tsx`: requesting 800x600 thumbnails, fixed `aspect-[4/3]` container, and smooth image fade-in.<br>• Conclude with a quick summary of the tech stack and code cleanliness. |

---

## Recording & Sharing Guidance

### Recommended Recording Tools
1. **Loom** (Web / Desktop): Quickest option. Automatically generates an unlisted share link as soon as you finish recording.
2. **OBS Studio** (Free & Open Source): Excellent for capturing both your screen and microphone with high fidelity.
3. **QuickTime Player** (macOS built-in): `File > New Screen Recording`.

### Step-by-Step Recording Instructions
1. Set screen resolution to 1080p (1920x1080) or scale your browser to ~125% for high legibility.
2. Have the browser open on one side and your code editor open on the other, or use `Cmd+Tab` / `Alt+Tab` to switch smoothly.
3. Keep your microphone close and test audio levels for 10 seconds before starting.
4. Follow the 5-minute checklist above.

### Sharing Your Recording
- If using **Loom**: Copy the provided video link and verify permissions are set to "Anyone with the link can view".
- If using **Google Drive**: Upload the `.mp4` file, right click > **Share** > change access from "Restricted" to **"Anyone with the link can view"**.
- If using **YouTube**: Upload as **"Unlisted"** so anyone with the link can watch without it being indexed publicly.

---

## Pushing to a Public GitHub Repository

Run these commands in your project root to publish the code to GitHub:

```bash
# 1. Initialize git repository (if not already initialized)
git init

# 2. Add all files to staging
git add .

# 3. Commit changes
git commit -m "feat: complete luxury photo gallery with hooks and persistence"

# 4. Rename main branch
git branch -M main

# 5. Add your GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/photo-gallery.git

# 6. Push to GitHub
git push -u origin main
```

*(Make sure your repository visibility is set to **Public** on GitHub so reviewers can view your code.)*
