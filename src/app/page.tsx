"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MovieCard } from "./components/MovieCard";
import { MovieCardSkeleton } from "./components/MovieCardSkeleton";
import { debounce } from "lodash";

type MovieData = {
  id: number;
  original_title: string;
  overview: string;
  vote_average: number;
  poster_path: string;
};

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const URL = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
      const rsp = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });
      const data = rsp.data;
      setData((prevData) => [...prevData, ...data.results]);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [page]);

  // set new page when scroll position (window.scrollY + window.innerHeight) is near the bottom of the content (document.body.scrollHeight)
  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 500);
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  if (error) {
    return (
      <div className="text-center bg-gray-800 min-h-screen flex flex-col items-center pt-4 text-white text-base sm:text-lg md:text-xl lg:text-2xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center bg-gray-800 min-h-screen flex flex-col items-center pt-4 text-white text-base sm:text-lg md:text-xl lg:text-2xl">
      Popular movies according to Tmdb
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {data.length > 1 &&
          data.map((item, index) => {
            return (
              <MovieCard
                key={`${item.id}-${index}`}
                title={item.original_title}
                description={item.overview}
                rating={item.vote_average}
                imageURL={item.poster_path}
              />
            );
          })}
        {loading && <MovieCardSkeleton />}
      </div>
    </div>
  );
}
