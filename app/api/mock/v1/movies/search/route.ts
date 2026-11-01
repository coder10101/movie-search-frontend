import { trendingMovies } from "~/lib/mock/movies";

const PAGE_SIZE = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query")?.trim() ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  if (!query || !Number.isInteger(page) || page < 1) {
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

  // slow API response (3 seconds).
  if (query.toLowerCase() === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // server error
  if (query.toLowerCase() === "error") {
    return Response.json(
      {
        type: "about:blank",
        title: "Service Unavailable",
        status: 503,
        detail: " API temporarily unavailable.",
      },
      {
        status: 503,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }

  const matches =
    query.toLowerCase() === "noresults"
      ? []
      : trendingMovies.filter((movie) =>
          `${movie.title} ${movie.overview ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

  const totalResults = matches.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  if (page > Math.max(totalPages, 1)) {
    return Response.json(
      {
        type: "about:blank",
        title: "Bad Request",
        status: 400,
        detail: "Requested page is out of range.",
      },
      {
        status: 400,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }
  const results = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return Response.json({
    page,
    totalPages,
    totalResults,
    results,
  });
}
