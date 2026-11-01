# Movie Search Frontend

A movie discovery and search application built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

The application provides trending movies, movie search, and server-driven pagination. It also includes individual movie detail pages with additional metadata and YouTube trailer integration.

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

The frontend consumes four endpoints.

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
### Movie detail
`GET /movies/{id}`

Returns the base movie information along with runtime, tagline and genres. Returns 404 when the movie is not found.

### Movie Video
`GET /movies/{id}/videos`

Returns available video records, including YouTube trailer information. Returns an empty array when no videos are available.


The API owns pagination metadata. The frontend uses the returned values to render results and navigate between pages.

API errors use the `application/problem+json` response format.

## 4. Mock API

The mock API is implemented using Next.js Route Handlers under:

`app/api/mock/v1/movies/`

`movies.json`: Contains the movie dataset and additional detail metadata.
`movie-videos.json`: Contains video fixtures mapped to their corresponding movie IDs.

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


## 5. Backend Integration

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


## 6. Implementation Summary

### What I Prioritized

The main focus was implementing the core movie search experience while maintaining the existing project architecture and centralized API communication.

### What I Deferred

- **P3:** TV/Series Search and Additional Performance Optimizations: Deferred due to personal time constraints and the assessment deadline. I prioritized completing the core movie search experience and the additional movie detail and trailer functionality within the available time.

### Rendering Strategy

The application uses Next.js Server Components for data-driven pages and Client Components only where browser interaction is required.

- **Home page (`app/page.tsx`):** A Server Component that reads URL search parameters, fetches trending movies or search results, and renders the movie grid.
- **Movie detail page (`app/movies/[id]/page.tsx`):** A Server Component that fetches movie details and video information in parallel. It renders the movie metadata and embeds the YouTube trailer when an available trailer exists. Invalid IDs and API 404 responses are handled using Next.js.
- **Search bar:** A Client Component that handles user input and submits searches through a native GET form, updating the URL search parameters.

This approach keeps data fetching and page rendering on the server, reduces unnecessary client-side JavaScript, and uses client-side interactivity only where needed.
