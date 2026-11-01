import { trendingMovies } from "~/lib/mock/movies";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return Response.json(
      {
        type: "about:blank",
        title: "Bad Request",
        status: 400,
        detail: "Query parameter is required.",
      },
      {
        status: 400,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }

  const matches = trendingMovies.filter((movie) =>
    `${movie.title} ${movie.overview ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return Response.json({
    results: matches,
  });
}
