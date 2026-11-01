import Link from "next/link";
import { SearchBar } from "~/components/SearchBar";
import { TrendingGrid } from "~/components/TrendingGrid";
import { getTrendingMovies, searchMovies } from "~/lib/api";

// Renders per-request rather than being statically generated at build time,
// since this page depends on the .NET API being reachable — which it isn't
// during `next build` in CI.
export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const { query, page } = await searchParams;
  const searchQuery = query?.trim() ?? "";
  const currentPage = Number(page ?? "1");

  const searchResponse = searchQuery
    ? await searchMovies(searchQuery, currentPage)
    : null;

  const movies = searchResponse
    ? searchResponse.results
    : await getTrendingMovies();

  function getPageUrl(pageNumber: number) {
    const params = new URLSearchParams({
      query: searchQuery,
      page: String(pageNumber),
    });

    return `/?${params.toString()}`;
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Movie Search Case
        </h1>
        <SearchBar query={searchQuery} />
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-foreground">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Trending this week"}
        </h2>
        {searchResponse && (
          <p className="text-sm text-muted">
            {searchResponse.totalResults} movies found
          </p>
        )}
        <TrendingGrid movies={movies} />

        {searchResponse && searchResponse.totalPages > 1 && (
          <nav
            aria-label="Search results pages"
            className="flex items-center justify-center gap-4 pt-6"
          >
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-md border border-border px-4 py-2 text-sm opacity-50">
                Previous
              </span>
            )}

            <span className="text-sm text-muted">
              Page {currentPage} of {searchResponse.totalPages}
            </span>

            {currentPage < searchResponse.totalPages ? (
              <Link
                href={getPageUrl(currentPage + 1)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-border px-4 py-2 text-sm opacity-50">
                Next
              </span>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
