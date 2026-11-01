import { trendingMovies } from "~/lib/mock/movies";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const movie = trendingMovies.find((item) => item.id === Number(id));

  if (!movie) {
    return Response.json(
      {
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: `Movie with ID ${id} was not found.`,
      },
      {
        status: 404,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }

  return Response.json({
    ...movie,
  });
}
