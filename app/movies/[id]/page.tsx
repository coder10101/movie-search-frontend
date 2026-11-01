import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiError, getMovieDetails, getMovieVideos } from "~/lib/api";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId < 1) {
    notFound();
  }

  let movie;
  let videos;

  try {
    [movie, videos] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <Link
        href="/"
        className="w-fit text-sm text-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
      >
        ← Back to movies
      </Link>

      <section className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
          {movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={`${movie.title} poster`}
              fill
              priority
              sizes="(min-width: 768px) 240px, 80vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              No poster available
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              {movie.title}
              {releaseYear && (
                <span className="ml-2 text-xl font-normal text-muted">
                  ({releaseYear})
                </span>
              )}
            </h1>

            {movie.tagline && (
              <p className="mt-2 text-muted italic">{movie.tagline}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted">
            <span>★ {movie.voteAverage.toFixed(1)} / 10</span>
            {movie.runtime !== null && <span>{movie.runtime} min</span>}
            {movie.releaseDate && <span>{movie.releaseDate}</span>}
          </div>

          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div>
            <h2 className="mb-2 text-lg font-medium text-foreground">
              Overview
            </h2>
            <p className="text-sm leading-7 text-muted">
              {movie.overview || "No overview available."}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Trailer</h2>

        {trailer ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-surface">
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}`}
              title={`${movie.title} - ${trailer.name}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <p className="rounded-lg bg-surface p-6 text-sm text-muted">
            No YouTube trailer is currently available for this movie.
          </p>
        )}
      </section>
    </main>
  );
}
