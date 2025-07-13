# Marble Glittering ✨

A full-stack Reddit-style web application built with **Next.js**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**. It features a polished pixel UI and supports post creation, community building, and a powerful memory album system.
🎯 The vision is to build a platform that combines **social interaction** and **personal digital archiving** — enabling users to engage in communities while also privately recording thoughts, inspirations, and life moments.

## 🌟 Features

- ⚛️ Built with **Next.js App Router**
- 🧁 Fully customized **Neumorphism UI**
- 🔐 User authentication with **NextAuth.js**
- 📝 Create, comment, and vote on posts
- 🏘 Community (marble-style) creation
- 📷 Upload images with **UploadThing**
- 🌑 Light and dark themes both follow Neumorphism
- 🔍 Built-in search bar with live filtering
- 💾 PostgreSQL + Prisma ORM
- 🧠 Memory Albums (save posts, write notes, visibility control)
- 📦 Easy deployment to Vercel, AWS, etc.

---

## 📦 Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Frontend     | React, Next.js, Tailwind CSS, shadcn/ui |
| Backend      | App Router, tRPC-style handlers        |
| Database     | PostgreSQL + Prisma ORM                |
| Auth         | NextAuth.js                            |
| UI Style     | Neumorphism (custom CSS + Tailwind)    |
| Upload       | UploadThing                            |
| Caching      | Redis (local or Upstash, optional)     |

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



## UI Style
- Unified look for Button, Input, Card, Vote, etc.
- Light & Dark modes with consistent styling

## 🧭 Future Enhancements

Planned features to enhance user experience, improve system scalability, and increase platform engagement.


- 🔄 **Asynchronous Message Queue** : Route all post and comment operations through a message queue for eventual database writes. Improves performance under heavy load. | Kafka, Redis Streams, RabbitMQ

- 🧠 **Recommendation System** : Provide personalized post suggestions using collaborative filtering based on user-post interaction data.    | Python, Matrix Factorization

- 📝 **Structured Post Templates**: Enable users to create posts using predefined templates like to-do lists, daily journals, or Q&A formats.   | Dynamic form engine → Post parser

- 🤖 **In-App Content Bots** : Deploy smart bots to suggest content, send reminders, or boost engagement through conversational prompts.   | Webhooks, Bot Service Layer, OpenAI

