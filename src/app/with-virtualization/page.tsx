"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { List, RowComponentProps, useDynamicRowHeight } from "react-window";
import { MovieCard } from "../components/MovieCard";
import { MovieCardSkeleton } from "../components/MovieCardSkeleton";

type MovieData = {
  id: number;
  original_title: string;
  overview: string;
  vote_average: number;
  poster_path: string;
};

// Mirrors Tailwind's default breakpoints
function getColumnCount(width: number): number {
  if (width >= 1280) return 4; // xl
  if (width >= 1024) return 3; // lg
  if (width >= 640) return 2; // sm
  return 1;
}

function useColumnCount(): number {
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    function update() {
      setColumnCount(getColumnCount(window.innerWidth));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columnCount;
}

function MovieRow({
  index,
  movies,
  columnCount,
  style,
}: RowComponentProps<{
  movies: MovieData[];
  columnCount: number;
}>) {
  const startIndex = index * columnCount;
  const rowMovies = movies.slice(startIndex, startIndex + columnCount);

  return (
    <div style={style}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-2">
        {rowMovies.map((movie, i) => (
          <MovieCard
            key={`${movie.id}-${startIndex + i}`}
            title={movie.original_title}
            description={movie.overview}
            rating={movie.vote_average}
            imageURL={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}

export default function WithVirtualization() {
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isFetchingRef = useRef(false);

  const columnCount = useColumnCount();
  const rowCount = Math.ceil(movies.length / columnCount);

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 420,
    key: columnCount,
  });

  const fetchMovies = useCallback(async (pageNum: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNum}`;
      const rsp = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = rsp.data;
      setMovies((prev) => [...prev, ...data.results]);
      if (pageNum >= data.total_pages) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page, fetchMovies]);

  // Use onRowsRendered to detect when the user is near the last row
  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (!hasMore || loading) return;
      // If the last visible row is within 2 rows of the end, load more
      if (visibleRows.stopIndex >= rowCount - 2) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading, rowCount],
  );

  if (error) {
    return (
      <div className="text-center bg-gray-800 min-h-screen flex flex-col items-center pt-4 text-white text-base sm:text-lg md:text-xl lg:text-2xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center pt-4 text-white">
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2">
        Popular movies according to Tmdb (Virtualized)
      </p>

      <p className="text-md mb-4">Displaying {movies.length} movies</p>

      <div
        className="w-full max-w-7xl px-0"
        style={{ height: "calc(100vh - 100px)" }}
      >
        {movies.length > 0 && (
          <List
            rowComponent={MovieRow}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowProps={{ movies, columnCount }}
            onRowsRendered={handleRowsRendered}
          />
        )}
        {loading && (
          <div className="px-4 py-2">
            <MovieCardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
