# Infinite Scroll Tutorial

A Next.js application demonstrating infinite scroll functionality using The Movie Database (TMDB) API. Based on [this tutorial](https://dev.to/surajondev/building-an-infinite-scroll-component-in-react-1ljb).

## Features

- **Infinite Scroll**: Automatically loads more movies as you scroll down
- **Movie Cards**: Displays popular movies with posters, titles, descriptions, and ratings
- **Loading States**: Shows skeleton loading cards while fetching data
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first responsive grid layout (1–4 columns)
- **Debounced Scrolling**: Optimized scroll event handling to prevent excessive API calls
- **Virtualization**: Renders only visible rows for improved performance with large lists

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API requests
- **Lodash** - Utility functions (debounce)
- **react-window** - Virtualized list rendering
- **TMDB API** - The Movie Database API for movie data

## Project Structure

```
src/app/
├── page.tsx                        # Home page with links to demos
├── layout.tsx                      # Root layout
├── globals.css                     # Global styles
├── basic-infinite-scroll/
│   └── page.tsx                    # Basic infinite scroll implementation
├── with-virtualization/
│   └── page.tsx                    # Virtualized infinite scroll implementation
└── components/
    ├── MovieCard.tsx               # Individual movie card component
    └── MovieCardSkeleton.tsx       # Loading skeleton component
```

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd infinite-scroll-tutorial
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory and add your TMDB API key:

   ```
   NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here
   ```

   Get your API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implementations

### 1. Basic Infinite Scroll (`/basic-infinite-scroll`)

The classic approach: renders all loaded items into the DOM and listens to the window scroll event.

**How it works:**

1. **State Management**: Uses React hooks to manage:
   - `page`: Current page number for API pagination
   - `data`: Array of all loaded movie data
   - `loading`: Loading state indicator
   - `error`: Error state handling

2. **Scroll Detection**:

   ```typescript
   const handleScroll = () => {
     if (
       document.body.scrollHeight - 300 <
       window.scrollY + window.innerHeight
     ) {
       setPage((prevPage) => prevPage + 1);
     }
   };
   ```

   Triggers when user scrolls within 300px of the bottom.

3. **Debounced Events**: Uses lodash debounce to limit scroll event frequency:

   ```typescript
   const debouncedHandleScroll = debounce(handleScroll, 500);
   ```

4. **Data Fetching**: Automatically fetches new data when page state changes:
   ```typescript
   useEffect(() => {
     fetchMovie();
   }, [page]);
   ```

**Trade-off**: As more pages are loaded, all movie cards remain mounted in the DOM, which can degrade performance over time.

---

### 2. With Virtualization (`/with-virtualization`)

Uses `react-window` to render only the rows currently visible in the viewport, keeping DOM node count constant regardless of how many movies have been loaded.

**How it works:**

1. **Responsive Grid Rows**: Movies are grouped into rows based on the current column count (responsive breakpoints matching Tailwind's `sm`/`lg`/`xl`). Each row is a `MovieRow` component rendered inside the virtualized `List`.

2. **Dynamic Row Heights**: Uses `useDynamicRowHeight` to measure actual rendered row heights (since movie cards can vary). The `key: columnCount` prop resets measurements when the column layout changes.

   ```typescript
   const rowHeight = useDynamicRowHeight({
     defaultRowHeight: 420,
     key: columnCount,
   });
   ```

3. **Infinite Scroll via `onRowsRendered`**: Instead of listening to window scroll events, the `onRowsRendered` callback fires whenever the visible row range changes. When the last visible row is within 2 rows of the total row count, the next page is fetched.

   ```typescript
   const handleRowsRendered = useCallback(
     (visibleRows: { startIndex: number; stopIndex: number }) => {
       if (!hasMore || loading) return;
       if (visibleRows.stopIndex >= rowCount - 2) {
         setPage((prev) => prev + 1);
       }
     },
     [hasMore, loading, rowCount]
   );
   ```

4. **Duplicate Fetch Prevention**: An `isFetchingRef` ref guard prevents concurrent fetches when state updates trigger multiple renders.

**Trade-off**: Only visible rows are mounted in the DOM at any time, making this approach much more performant for large datasets.

---

## Components

- **MovieCard**: Displays movie information with poster, title, description, and rating
- **MovieCardSkeleton**: Loading placeholder with animated skeleton effect

## API Integration

Uses TMDB's popular movies endpoint:

```
https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}
```

Authentication via Bearer token in request headers.

## Styling

- **Tailwind CSS** for utility-first styling
- **Dark theme** with gray color scheme
- **Responsive grid**: Adapts from 1 column on mobile to 4 columns on desktop
- **Hover effects** and smooth transitions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learning Resources

This project demonstrates key concepts:

- React hooks (useState, useEffect, useCallback, useRef)
- Event handling and cleanup
- API integration with error handling
- Performance optimization (debouncing, virtualization)
- Responsive design patterns
- TypeScript in React applications
- List virtualization with react-window

## License

This project is for educational purposes based on the DEV Community tutorial.
