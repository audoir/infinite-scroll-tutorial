# Infinite Scroll Tutorial

A Next.js application demonstrating infinite scroll functionality using The Movie Database (TMDB) API. Based on [this tutorial](https://dev.to/surajondev/building-an-infinite-scroll-component-in-react-1ljb).

## Features

- **Infinite Scroll**: Automatically loads more movies as you scroll down
- **Movie Cards**: Displays popular movies with posters, titles, descriptions, and ratings
- **Loading States**: Shows skeleton loading cards while fetching data
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first responsive grid layout
- **Debounced Scrolling**: Optimized scroll event handling to prevent excessive API calls

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Axios** - HTTP client for API requests
- **Lodash** - Utility functions (debounce)
- **TMDB API** - The Movie Database API for movie data

## Project Structure

```
src/app/
├── page.tsx                    # Main page with infinite scroll logic
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
└── components/
    ├── MovieCard.tsx           # Individual movie card component
    └── MovieCardSkeleton.tsx   # Loading skeleton component
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

## How It Works

### Infinite Scroll Implementation

The infinite scroll functionality is implemented in `src/app/page.tsx`:

1. **State Management**: Uses React hooks to manage:
   - `page`: Current page number for API pagination
   - `data`: Array of movie data
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

### Components

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

- React hooks (useState, useEffect)
- Event handling and cleanup
- API integration with error handling
- Performance optimization (debouncing)
- Responsive design patterns
- TypeScript in React applications

## License

This project is for educational purposes based on the DEV Community tutorial.
