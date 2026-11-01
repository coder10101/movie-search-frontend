import { trendingMovies } from "~/lib/mock/movies";
import movieVideos from "~/lib/mock/movie-videos.json";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const movieExists = trendingMovies.some((movie) => movie.id === Number(id));

  if (!movieExists) {
    return Response.json([]);
  }

  return Response.json(movieVideos[id as keyof typeof movieVideos] ?? []);
}
