# 💠 Streamline - Frontend

This is a modern **Vite + React + TypeScript** project for a **task management dashboard**.  
It uses **shadcn/ui**, **TailwindCSS**, **Tiptap** for rich text editing, **DND Kit** for drag-and-drop,  
and includes a modular structure with authentication, tasks, Kanban board, timeline, and reusable UI components.

## ⚡️ Tech Stack

- **[Vite](https://vitejs.dev/)** — Fast dev server with HMR
- **[React](https://react.dev/)** — Modern UI library
- **[Redux](https://redux-toolkit.js.org/)** — State Management library
- **[TypeScript](https://www.typescriptlang.org/)** — Static typing
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** — Accessible UI components
- **[Tiptap](https://tiptap.dev/)** — Rich text editor
- **[DND Kit](https://dndkit.com/)** — Drag & drop for Kanban
- **[Lucide Icons](https://lucide.dev/)** — Icon system
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** — Data fetching

## 📂 Project Structure

```
src/
├─ components/ # Shared UI components (Navbar, Sidebar, Modals, Dropdowns)
├─ features/ # RTK Query slices for Auth, Tasks, etc.
├─ pages/ # Route pages (Dashboard, Profile)
├─ hooks/ # Reusable hooks (e.g., useDebounce, useAuth)
├─ api/ # API call utilities and Axios instances
├─ utils/ # Helper functions and utilities
├─ types/ # Shared TypeScript types
├─ styles/ # Global Tailwind styles
├─ App.tsx # Main app entry
└─ main.tsx # Vite entry
```

## ✅ Development

### Install dependencies

```bash
npm install
# or yarn or npm
```

### Start local dev server

```bash
npm run dev
# http://localhost:5173
```

### Build for production

```bash
npm build
```

### Preview production build locally

```bash
npm preview
```

## 🧹 Linting & Type Checking

Run:
```bash
npm run lint
```

Run:
```bash
npm run format
```

## 🌱 Environment Variables

Use `.env` files for local development:

```env
VITE_API_BASE_URL= app_backend_url(HTTP://localhost:5000/api)

## ✨ Features

- ✅ **Profile + Notification Menu** — uses reusable dropdown logic
- ✅ **Tiptap Rich Text Editor** — for task descriptions with bold, italic, underline, lists, emojis
- ✅ **Kanban & Timeline Boards** — switchable views with drag-and-drop
- ✅ **Dark mode ready** — easily extend with shadcn/ui theming
- ✅ **Fully typed API hooks** — RTK Query for Auth, Tasks, and Roles

## 🔗 Useful Scripts

```bash
pnpm format    # Format code with Prettier
pnpm lint      # Run ESLint
pnpm dev       # Start dev server
pnpm build     # Build for production
```

## 🗂️ Tips for Contributors

- Keep shared logic in `/components` and `/hooks` reusable.
- Use `ConfirmDialog` and `UserDropdownMenu` for consistent UI patterns.
- Use Lucide icons for consistency.
- Tailwind: use consistent `px-4 py-2` spacing and `rounded` for clean layout.

## 🏆 License

This project is MIT licensed.
