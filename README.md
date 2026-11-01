# Movie Search Frontend

A movie discovery and search application built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

The application provides trending movies, movie search, and server-driven pagination.

## 1. Getting Started

### Prerequisites

- Node.js (compatible with the project's Next.js version)
- npm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and copy `.env.example` into it.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run TypeScript validation |
| `npm run build` | Create production build |

## 2. Project Architecture

The application separates UI rendering, API communication, mock implementation, and shared types.

- **App layer:** Handles page rendering, URL search parameters, and route-level loading and error states.
- **Components:** Provide reusable search, movie card, and movie grid UI.
- **API client:** Centralizes HTTP requests and response/error handling.
- **Mock API:** Implements local endpoints using fixed movie fixtures.
- **Types:** Defines the shared movie and search response contracts.

## 3. API Contract

The frontend consumes two endpoints.

### Trending movies

`GET /movies/trending`

Returns a list of movies using the shared `Movie` data structure.

### Movie search

`GET /movies/search?query=batman&page=1`

| Parameter | Description |
|---|---|
| `query` | Required, non-empty search term |
| `page` | Optional page number; defaults to 1 and must be between 1 and 500 |

Search responses contain:

```ts
interface MovieSearchResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
}
```

The API owns pagination metadata. The frontend uses the returned values to render results and navigate between pages.

API errors use the `application/problem+json` response format.

## 4. Mock API

The mock API is implemented using Next.js Route Handlers under:

`app/api/mock/v1/movies/`

It uses a fixed local movie fixture dataset and follows the expected API response structure. This allows frontend development and testing without depending on the availability of the actual backend.

### Scenarios

| Trigger | Behaviour | What it tests |
|---|---|---|
| `batman` | Returns matching movies | Normal search |
| `a` | Returns 30 matching results across 3 pages | Pagination |
| `noresults` | Returns HTTP 200 with an empty result list | Empty state |
| `slow` | Delays the response by approximately 3 seconds | Loading state |
| `error` | Returns HTTP 503 | API error handling |
| Empty query | Returns HTTP 400 | Query validation |
| `query=a&page=4` | Returns HTTP 400 | Page validation |

The special values are reserved testing triggers within the mock implementation. They do not represent production search behaviour.

### Why this approach?

- Provides predictable responses for development.
- Allows different API states to be tested without external dependencies.
- Validates the frontend against the expected backend contract.
- Keeps mock-specific logic isolated from the application UI.

## 5. Rendering Strategy

The application uses a combination of Next.js Server Components and Client Components.

### Server Components

The home page (`app/page.tsx`) is a Server Component.

It reads the URL search parameters, requests trending movies or search results through the API client, and renders the response.

### Client Components

The search bar is a Client Component because it handles browser interactions and input changes.

Search submission uses a native GET form, which updates the URL and allows the server-rendered page to fetch the corresponding results.

### Loading and error states

- `app/loading.tsx` provides loading feedback during route rendering.
- `app/error.tsx` provides a route-level error fallback.
- Empty search results are handled separately from API failures.

## 6. Backend Integration

The mock API and actual backend share the same intended API.

The API base URL is configurable through:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/mock/v1
```

When the .NET backend is available, update it to:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5080/api/v1
```

Restart the application after changing the environment variable.

The frontend expects the backend to provide:

- Matching endpoint paths.
- Compatible movie response fields.
- The same paginated search response structure.
- Compatible validation and error response formats.

The API client is responsible for HTTP communication, so the UI does not need to know whether its data comes from the mock or the actual backend.

The current API requests are made from the Next.js server. Therefore, the backend must be reachable from the Next.js server; browser-side CORS configuration is not required for these server-to-server requests.


## 7. Implementation Summary

### What I Prioritized

The main focus was implementing the core movie search experience while maintaining the existing project architecture and centralized API communication.

### What I Deferred

- **P2:** Movie detail pages and YouTube trailer integration were deferred to prioritize the core search and pagination requirements.
- **P3:** TV/series search and additional performance optimizations were skipped because they were stretch enhancements rather than essential functionality.

### Rendering Strategy
Retained the existing Next.js rendering architecture:

- **Server Component:** The home page fetches search data on the server and renders the results.
- **Client Component:** The search bar handles browser-side input interactions and submits searches through a native GET form.

This approach keeps data fetching on the server while limiting client-side JavaScript to interactive functionality.
