import { trendingMovies } from "~/lib/mock/movies";

export async function GET() {
  return Response.json(trendingMovies);
}
