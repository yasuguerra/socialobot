# Social.Flow (socialobot) — Coding Standards

## 1. Core Development Rules

### 1.1 Strict Type Enforcement
*   **No `any`**: All parameters, variables, and returns must be explicitly typed using TypeScript interfaces in [types.ts](file:///c:/Users/yasu3/Documents/VS%20Projects/socialobot/src/types.ts).
*   **Schema Validation**: Every API payload input must be validated using Zod schemas defined in [validate.ts](file:///c:/Users/yasu3/Documents/VS%20Projects/socialobot/server/validate.ts).

### 1.2 Multi-Tenant Security & Isolation
*   **Credential Encryption**: OAuth tokens and access keys must be encrypted before database storage using algorithms defined in `server/crypto.ts`.
*   **Query Filtering**: Every Firestore retrieval or save operation *must* verify ownership using the authenticated request `userId` (i.e. `where("userId", "==", req.user.uid)`).

---

## 2. Frontend Guidelines (React 19 & Tailwind CSS v4)

### 2.1 React 19 Best Practices
*   Use functional components with modern hooks (`useState`, `useEffect`, `useMemo`).
*   Optimize visual render paths by loading simulated states instantly, avoiding blocking animations.
*   Isolate UI sections with clear semantic sections (e.g., placing the Space Remodeler exclusively under "Experimental Playgrounds").

### 2.2 Tailwind CSS v4 Styling
*   Utilize Tailwind CSS v4 design tokens for color consistency (e.g., warning/amber themes for mock elements: `text-amber-600 bg-amber-50 border border-amber-200`).
*   Keep layouts fully responsive, accommodating both desktop agency operator consoles and mobile views.

---

## 3. Backend Guidelines (Node.js & Express)

### 3.1 Routing & Validation
*   Keep route files clean. All input schemas must be parsed using Zod's `validateBody` middleware:
    ```typescript
    app.post("/api/posts", validateBody(PostsCreateSchema), async (req, res) => { ... });
    ```
*   Use `express-rate-limit` globally to blunt denial of service and credential scraping attacks (limit of 120 API requests/minute/IP).

### 3.2 Error Handling & Logging
*   All asynchronous routes must run inside try-catch blocks to prevent server crashes.
*   Return standard HTTP status codes:
    *   `400 Bad Request` for schema failures.
    *   `401 Unauthorized` / `403 Forbidden` for tenant authentication issues.
    *   `500 Internal Server Error` for upstream API issues (Google GenAI failures, Instagram Graph timeouts).
*   Log error traces locally (e.g., using `console.error`) but *never* expose detailed database stack traces or private user tokens to the client payload response.
