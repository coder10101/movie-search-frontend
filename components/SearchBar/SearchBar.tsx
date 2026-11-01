"use client";

export function SearchBar({ query = "" }: { query?: string }) {
  return (
    <form action="/" method="GET" className="flex w-full max-w-md gap-2">
      <label htmlFor="movie-search" className="sr-only">
        Search for a movie
      </label>
      <input
        id="movie-search"
        type="search"
        name="query"
        defaultValue={query}
        onChange={(event) => {
          if (event.target.value === "") {
            window.location.href = "/";
          }
        }}
        placeholder="Search for a movie…"
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
      >
        Search
      </button>
    </form>
  );
}
