# Technical Decisions – Movie Search Frontend

## 1. Understanding and Prioritization

The primary objective was to build a movie discovery application with trending movies, search functionality, server-driven pagination, and a structure that can integrate with the actual .NET backend.

I prioritized:
- Core movie discovery and search functionality.
- URL-driven pagination.
- Loading, empty and error states.
- API contract compatibility.
- Movie detail pages and YouTube trailer integration.
- Accessibility and reusable UI components.

TV/series search and additional performance optimizations were deferred due to personal time constraints and the assessment deadline. I prioritized completing the core requirements and movie detail experience within the available time.

## 2. Technical Decisions and Rationale

### Next.js App Router and Rendering

I used Next.js App Router with Server Components for data-driven pages.

- The home page reads URL search parameters and fetches trending movies or search results on the server.
- The movie detail page fetches movie details and videos in parallel using `Promise.all`.
- The search bar is a Client Component because it handles user input and browser interactions.

This approach keeps data fetching on the server and limits client-side JavaScript to interactive functionality.

### API Communication

API communication is centralized in `lib/api.ts`.

A shared API fetch function handles HTTP requests and response errors. The API base URL is configurable through `NEXT_PUBLIC_API_BASE_URL`.

This separates the frontend from the backend implementation and allows switching between the mock API and actual .NET API without changing UI components.

### Mock API

I implemented mock endpoints using Next.js Route Handlers and local JSON fixtures.

The mock API supports trending movies, search, movie details and movie videos. It also simulates loading delays, empty results, validation errors and server errors.

Fixed fixtures provide predictable responses and make it possible to test different application states without depending on an external service.

### Search and Pagination

Search uses a native GET form, keeping the search query and page number in the URL.

The API provides pagination metadata (`page`, `totalPages`, and `totalResults`), and the frontend uses those values to display results and navigate between pages.

This keeps pagination state consistent with the URL and supports direct links to search results.

### Movie Details and Videos

Movie details and video information are retrieved separately through their respective API endpoints.

The detail page fetches both resources in parallel. A YouTube trailer is embedded only when a suitable trailer is available. Movies without videos still display their detail information.

## 3. Assumptions

- The actual backend will follow the API response structures defined in the assessment.
- Movie identifiers are unique and can be used to retrieve individual movie details.
- Search pagination metadata is provided by the API.
- Video records may be empty when a movie has no available trailer.
- The backend will support the same endpoint paths and compatible error responses.

## 4. Trade-offs and Limitations

- Local JSON fixtures were used instead of a live backend to keep frontend development independent.
- The mock API uses predefined scenarios rather than implementing production search behaviour.
- TV/series search was not implemented because it was outside the prioritized scope.
- Additional performance optimizations were deferred to focus on the required functionality and delivery timeline.

## 5. Accessibility Considerations

Accessibility was considered throughout the UI implementation.

The application uses semantic HTML, accessible form labels, keyboard-accessible navigation and visible focus indicators. Interactive elements are designed to support keyboard interaction, and empty and error states provide meaningful feedback.

## 6. Problem-Solving Approach

I separated API communication, shared types, mock data and UI components to keep responsibilities clear.

I used predictable mock scenarios to validate normal responses and edge cases, including empty results, delayed responses, invalid input and server errors.

The implementation was developed incrementally, prioritizing the core user experience before adding movie details and trailer functionality.

## 7. AI Assistance

AI tools were used as development assistance during implementation and problem-solving. I reviewed and tested the generated suggestions and take responsibility for understanding and explaining the submitted code.
