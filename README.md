# Marble Glittering ✨

A full-stack Reddit-style web application built with **Next.js**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**. It features a polished pixel UI and supports post creation, community building, and a powerful memory album system.
🎯 The vision is to build a platform that combines **social interaction** and **personal digital archiving** — enabling users to engage in communities while also privately recording thoughts, inspirations, and life moments.

## 🌟 Features

- 🧱 Framework & Core Stack
      - ⚛️ Built with **Next.js App Router** for modern, file-based routing
      - 💎 Type-safe backend with **tRPC** (if used) and **TypeScript**
      - 💾 Database: **PostgreSQL** with **Prisma ORM**
      - 📦 Ready for deployment on **Vercel**, **AWS**, or self-hosted
      - ♻️ Performance optimization with Redis, including support for SSR response caching
- 🔐 Authentication & Session
      - 🔐 Secure login & session management via NextAuth.js
      - 🔄 Session management with `getServerAuthSession()`
      - 🚫 Redirect unauthenticated users via `useSession` + router
      - 🔑 Protected server-side rendering (SSR) via `notFound()` or redirects
- 📝 Create, comment, and vote on posts
      - 💬 Fully nested and lazy loading of child comments
      - 🎛️ Toggleable reply threads
      - 📷 Create posts with optional images with **UploadThing**
      - 📉 vote on posts and comments with live state update
      - 🔍 Built-in search bar with live filtering
      - 🧠 Global layout with metadata, SEO tags, and OpenGraph config for social sharing
- 🏘 Community(Marbles) creation
      - 🏠 Join/leave communities (subscription logic)
      - 🧭 automatic timestamping
      - 📂 View posts scoped to a community (`/m/[marble]`)
      - 🧰 Admin dashboard for managing users and communities
- 🧷 Memory Albums (save posts, write notes, visibility control)
      - 🪄 Drag-and-drop reordering
      - 📝 Album item notes with server actions
      - ✏️ Album editing with pre-filled forms
      - 🔒 Per-album visibility: private / friends / public
- 🌐 Navigation & Routing
      - 🔗 Consistent navigation with `<Link>` and dynamic routes
      - 🧭 CSR redirections after actions (e.g. save, login)
      - 🚦 Permission control both on server & client side
      - 🧱 Clear route structure for `/post/[id]`, `/m/[marble]`, `/me/albums`
- 🧪 Developer Experience
      - 🧪 Type-safe APIs using Next.js server actions and routes
      - 🧩 Modular support for feature extensions via <Providers> wrapper
      - 📚 Modular and reusable **component architecture**
      - 🧪 Component-driven architecture for reusability and clean structure
      - 📂 RESTful API routes for album management
      - 📊 Analytics component for tracking user interaction
      - 🧼 Clean data modeling with automatic `createdAt`, `updatedAt` timestamps
      - 🔔 Toast notifications using a custom Toaster component for UX feedback
      - 🔄 Optimistic UI updates and loading fallbacks with **React Suspense**
      - 🧪 Integrated **unit and integration testing** with Jest + Testing Library
- 🌙 UI/UX Design
      - 🌑 Dual **light/dark mode** support in pixel-art style
      - ✨ Minimalist, intuitive layout with focus on content
      - ✨ Animated pixel-style **loading states** and UI feedback for smoother transitions
      - 🎨 Custom global styles using Tailwind CSS
      - 📱 Responsive design for mobile and desktop
      - 💬 Hover states, animations, microinteractions, and error feedback



## 📦 Tech Stack

| **Layer**          | **Technology & Description**                                                                 |
|--------------------|----------------------------------------------------------------------------------------------|
| **Frontend**        | **React** + **Next.js (App Router)** — Hybrid SSR/CSR rendering with file-based routing     |
|                    | **Tailwind CSS** — Utility-first CSS framework for rapid styling                            |
|                    | **shadcn/ui** — Accessible, customizable, headless component primitives                      |
|                    | **Framer Motion** — Declarative animations and smooth UI transitions                         |
|                    | **Lucide Icons** — Modern, open-source icon set for UI consistency                           |
| **Backend**         | App Router-based API routes (`app/api/*`) with REST-like handlers                           |
|                    | Custom logic following **tRPC-style** patterns (structured & type-safe)                      |
|                    | **Zod** — Runtime type validation and schema enforcement                                     |
| **Database**        | **PostgreSQL** — Scalable relational database for structured content                        |
|                    | **Prisma ORM** — Type-safe DB access, migrations, and query builder                         |
| **Authentication**  | **NextAuth.js** — Pluggable authentication (OAuth, Email, Credentials)                      |
| **Authorization**   | Custom middleware + SSR route guards (`notFound`, `redirect`, `getServerAuthSession`)       |
| **Image Upload**    | **UploadThing** — Simple, secure file upload with auth-aware handling                       |
| **Data Caching**    | **Redis** — (optional) Used for SSR caching or session optimization (e.g., Upstash)         |
| **Search**          | Client-side in-memory live filtering; architecture supports **Algolia**, **Lunr.js**, etc.  |
| **UI Style**        | **Pixel-style UI** with **Neumorphism-inspired design**, powered by Tailwind & custom CSS   |
| **Deployment**      | Optimized for **Vercel**, also supports **AWS**, **Render**, **Docker**, or self-hosting    |
| **Developer Tools** | **TypeScript (strict)** for full type safety across stack                                   |
|                    | **ESLint**, **Prettier**, **Husky**, **lint-staged** for code quality and consistency        |
|                    | **GitHub Actions** *(recommended)* for CI/CD automation                                      |
|                    | **pnpm** for fast, efficient dependency management                                           |

---

## 🚀 Getting Started

To run it locally, follow the steps below:

1. Clone repository and install the dependencies:

   ```bash
   # Clone repository
   git clone https://github.com/jocelynplaygames/marble-glittering.git

   # Install dependencies
   pnpm i
   ```

2. Copy `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

3. Sync the Prisma schema with your database

   ```bash
   pnpm prisma db push
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```


## Project Status

The project has **completed its core features and initial requirements**.  
Future enhancements are planned but development has not yet started.

## Project Structure
   ### 🧱 App Directory Structure
      ```bash
      app/
      ├── layout.tsx                           # 🧱 Base layout
      ├── page.tsx                             # 🏠 Homepage

      ├── me/                                  # 👤 Current user routes
      │   └── albums/                          # 📁 User's memory albums
      │       ├── page.tsx                     # 📁 Album list page
      │       ├── create/
      │       │   └── page.tsx                 # ✏️ Create new album
      │       └── [albumId]/                  
      │           ├── page.tsx                 # 🔍 View album content
      │           └── edit/                    # ✏️ Edit album and form


      ├── u/                                   # 🌍 Public user routes
      │   └── [username]/albums/              
      │       └── page.tsx                     # 🔓 View other users' public albums

      ├── m/                                   # 🧑‍🤝‍🧑 Community (Marble)
      │   ├── [marble]/                        # 👀 View community
      │   │   └── post/
      │   │       └── [postId]/                # 💬 View post detail
      │   ├── create/                          # ✏️ Create community
      │   └── new/                             # 📝 Create new post

      ├── api/
      │   ├── memory/                          # ⚙️ Album-related API endpoints
      │   ├── post/                            # 📝 Post-related APIs (create, edit, delete)
      │   ├── auth/                            # 🔐 Auth/session endpoints
      │   └── uploadthing/                     # 📷 Upload image support
      ```

   ### 🧩 Shared Components
      ```bash
      components/
      ├── ui/
      │   ├── SaveToAlbumButton.tsx            # 📌 Save post to album button
      │   ├── button.tsx / input.tsx / dialog.tsx / textarea.tsx  # 🎨 UI primitives

      ├── user-account-nav.tsx                 # 👤 User avatar dropdown menu
      ├── post-card.tsx                        # 📝 Post preview card (optional)
      ├── community-sidebar.tsx                # 🧑‍🤝‍🧑 Sidebar: joined communities
      ```

   ### 🧬 Prisma Schema & Models
      ```bash
      prisma/
      ├── schema.prisma                        # 🧬 Prisma schema
      ├── migrations/                          # 🛠️ DB migrations
      ```


# 🔧 System Event Flow (Key Functional Events)

## Business Event

### 🔐 1. User Session & Auth

| Event                 | Description                                 |
|----------------------|---------------------------------------------|
| 🧑‍💼 Login/Register   | NextAuth-based login                        |
| 🔄 Get Session        | `getServerAuthSession()`                    |
| 🚫 Redirect Unauth    | `useSession()` + `router.push("/login")`    |

**Used in**: `/server/auth.ts`, `/me/albums/*`, user navbar



### 📄 2. Posts & Album Items
The **Post** module is a core part of the Marble app. Each post belongs to a community (Marble), can be viewed in detail, commented on, saved to an album, and voted on.

#### ✅ Feature Overview

| Event                  | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 📝 Create post         | Users can create a new post within a selected community (optional feature). |
| 💬 View post detail    | Clicking a post opens the detail page at `/m/[slug]/post/[postId]`.         |
| 📌 Save post to album  | Users can click `SaveToAlbumButton` to save the post to their album with a note. |
| 👥 Display community   | Each post displays the community (Marble) it belongs to, with a link to that page. |


#### 🧩 Related Components

| Component              | Responsibility                                                                 |
|------------------------|----------------------------------------------------------------------------------|
| `PostItem`             | Renders the post preview: title, summary, author, time, and community name.     |
| `PostDetailPage`       | Displays the full content of a post, including the comment section.             |
| `SaveToAlbumButton`    | A button for saving posts to the user's album, with optional notes.             |
| `CommentSection`       | Handles post comments and input, part of `PostDetailPage`.                      |
| `PostVoteServer`       | Handles voting (upvote/downvote) on posts, implemented as a server component with Redis support. |
| `EditorOutput`         | Renders rich text content of a post.                                            |



### 👥 3. Community (Marble)

| Event                | Description              |
|---------------------|--------------------------|
| 🏠 Join community    | Save to subscription     |
| 👀 View community    | `/m/[marble]`            |
| ✏️ Create community  | `/m/create`              |


## Implicit Function
### 💾 4. Data Behavior

| Event               | Description                              |
|--------------------|------------------------------------------|
| 📅 Auto timestamps  | `createdAt`, `updatedAt`                 |
| 🔄 UI sync          | `router.refresh()` / `revalidatePath()` |
| 🧹 Cascade delete   | Delete albums → remove items             |


### 🌐 5. Routing & Navigation

| Event             | Description                                      |
|------------------|--------------------------------------------------|
| 🔗 Navigation      | `<Link>` used sitewide                          |
| 🚦 SSR permission | `notFound()` or `redirect()`                    |
| 🧭 CSR redirects   | After API calls or saves                        |


### 📥 6. Memory Album API Routes

| Method  | Path                      | Description                      |
|---------|---------------------------|----------------------------------|
| POST    | `/api/memory/create`      | Create album                     |
| PATCH   | `/api/memory/update`      | Update album                     |
| DELETE  | `/api/memory/delete`      | Delete album                     |
| GET     | `/api/memory/list`        | List user albums                 |
| POST    | `/api/memory/add-item`    | Add post to album                |
| PATCH   | `/api/memory/reorder`     | Reorder album items (future)     |



## 🌱 7. Exploratory Directions & Future Learning
Planned features to enhance user experience, improve system scalability, and increase platform engagement.

🔄 Asynchronous Message Queue using Kafka, Redis Streams, RabbitMQ
📝 Structured Post Templates: Create posts using predefined templates such as to-do lists with selectable options
🫧 Private Reactions: Only you see what moved you — no public like count (data retained for recommendation system)
📈 User Behavior Analytics: Analyze user behavior logs using PostgreSQL, ClickHouse, Supabase Realtime
🎞️ Downloadable & Editable Memory Journals
❤️ Personalized Recommendation System: Suggest posts based on “shared collections” and “tag similarity” using Collaborative filtering, tag similarity
🤖 In-App Content Bots & AI-Generated Pixel Aesthetics