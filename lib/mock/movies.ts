import type { Movie } from "~/types/movie";
import moviesData from "./movies.json";

export const trendingMovies = moviesData as Movie[];
