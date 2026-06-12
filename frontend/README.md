# CodebaseOS Frontend

The frontend for CodebaseOS is a sophisticated "Command Center" designed for repository intelligence and risk management. It provides a rich, interactive dashboard to assess codebase health, visualize architecture, and manage automated agent workflows.

## Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Client state), [TanStack Query](https://tanstack.com/query/latest) (Server state preparation)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)

## Features

The interface is structured into specialized views:

*   **Repository Survival Dashboard:** A high-level overview of critical metrics:
    *   **Survivability Score™:** Assesses the repository's ability to evolve without its original creator.
    *   **Recoverability Score™:** Evaluates the cost-benefit analysis of refactoring versus rebuilding.
    *   **Bus Factor™:** Identifies critical single points of failure in team knowledge.
    *   **Ownership Health:** Visualizes the distribution of knowledge across modules.
*   **Intelligence Suite:**
    *   **Memory Engine:** Visualizes contextual memory extracted from the codebase.
    *   **Architecture Graph:** Maps module complexities and interdependencies.
    *   **Knowledge Graph:** Displays relationships between concepts, files, and contributors.
*   **Risk Mitigation Agent:**
    *   **Automated Documentation:** Generates documentation for identified high-risk modules.
    *   **GitLab Integration:** Automatically creates issues for detected risks.
    *   **Learning Missions:** Provides personalized onboarding paths for siloed codebase areas.
    *   **Knowledge Interviews:** Interactive AI sessions designed to capture implicit expertise.

## Current Architecture & State

This application is currently in a **prototype phase**.

*   **Mock Data:** The UI is fully functional but currently powered entirely by mock data located in the `src/mock/` directory.
*   **Routing:** It uses a Single Page Application (SPA) style routing approach managed by Zustand (`src/store/app-store.ts`), swapping views within `src/app/page.tsx` rather than utilizing Next.js native file-system routing.

## Transitioning to Production

To move this frontend into a production-ready state connected to a MongoDB backend, the following steps are required:

1.  **Remove Mock Data Artifacts:**
    *   Delete the `src/mock/` directory.
    *   Remove unused AI scaffolding folders: `.zscripts/`, `tool-results/`, `examples/`, `mini-services/`.
    *   Remove Prisma-specific folders (`db/`, `prisma/`) unless retaining Prisma as the ORM for MongoDB.

2.  **Implement Data Fetching:**
    *   Replace direct mock data imports in components with React hooks.
    *   Utilize the existing `@tanstack/react-query` dependency to manage server state, caching, and loading states.
    *   Create an API client (e.g., in `src/lib/api.ts`) using `fetch` or `axios` to communicate with the backend.

3.  **Backend Integration (MongoDB):**
    *   Configure the backend API to return data matching the TypeScript interfaces defined in `src/types/index.ts`.
    *   Update environment variables (`NEXT_PUBLIC_API_URL`) to point to the live backend.

4.  **Production Refinements:**
    *   **Authentication:** Implement actual authentication flows using the included `next-auth` library and a MongoDB adapter.
    *   **Error Handling:** Add robust React Error Boundaries.
    *   **Data Validation:** Implement `zod` schemas to validate incoming API responses.
    *   **Asset Loading:** Refactor dynamic icon loading and overly aggressive lazy-loading in `page.tsx` for optimal performance.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18+)
*   [Bun](https://bun.sh/) (Recommended package manager)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Start the development server:
    ```bash
    bun run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.
