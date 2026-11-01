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
  searchParams: { query?: string };
}) {
  const { query } = await searchParams;
  const searchQuery = query?.trim() ?? "";

  const movies =
    searchQuery && searchQuery !== ""
      ? (await searchMovies(searchQuery, 1)).results
      : await getTrendingMovies();

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
        <TrendingGrid movies={movies} />
      </section>
    </main>
  );
}
