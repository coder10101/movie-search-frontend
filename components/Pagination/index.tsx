
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
}

export function Pagination({
  currentPage,
  totalPages,
  query,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function getPageUrl(pageNumber: number) {
    const params = new URLSearchParams({
      query,
      page: String(pageNumber),
    });

    return `?${params.toString()}`;
  }

  const linkClassName =
    "rounded-md border border-border px-4 py-2 text-sm hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

  const disabledClassName =
    "rounded-md border border-border px-4 py-2 text-sm opacity-50";

  return (
    <nav
      aria-label="Search results pages"
      className="flex items-center justify-center gap-4 pt-6"
    >
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={linkClassName}
        >
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      )}

      <span className="text-sm text-muted" aria-current="page">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={linkClassName}
        >
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      )}
    </nav>
  );
}
