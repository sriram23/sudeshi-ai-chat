# Sudeshi AI Chat

A high-performance, real-time AI chat application built with Next.js, designed to deliver low-latency streaming experiences and efficiently handle long-running conversations at scale.

---

## 🔥 Key Highlights

- Built a **real-time streaming chat system** with ~300–500ms first-token latency using SSE
- Designed a **state-machine-driven architecture** to manage async streaming safely
- Implemented **context compression (summarization)** to handle long conversations without token explosion
- Engineered **resilient streaming pipelines** with graceful error recovery and request abortion
- Optimized rendering using **virtualization and memoization** for large chat histories

---

## ⚡ Core Features

### 💬 Chat & Conversation Management
- Real-time AI responses via **ReadableStream + SSE parsing**
- Multi-conversation support (create, rename, delete, switch)
- Automatic **AI-generated conversation titles**
- Persistent chat history using Zustand (survives refresh)

### 🧠 AI Capabilities
- Integration with **Sarvam AI (30B & 150B models)**
- Multilingual support (Tamil, Hindi, English)
- Token usage tracking (prompt / completion / total)
- Context-aware summarization (retains last 19 messages)

### 🎨 User Experience
- Virtualized chat rendering using **react-virtuoso**
- Markdown + syntax-highlighted responses
- Auto-resizing input with keyboard shortcuts
- Dark/Light theme (system-aware)
- Responsive UI (mobile + desktop)
- Loading states, streaming indicators, and welcome prompts

---

## 🧱 Architecture & Engineering

### State Machine Design
- Enforced lifecycle: **idle → streaming → error**
- Prevents race conditions and inconsistent UI states
- Ensures safe async transitions and request isolation

### Streaming Engine
- Custom SSE parser with:
  - Chunk buffering
  - Boundary-safe JSON parsing
  - Multi-event handling per chunk
- Handles incomplete streams and missing termination signals (`[DONE]`)

### Context Management
- Sliding window of active messages (last 19)
- Older messages compressed via summarization API
- Reduces payload size while preserving semantic continuity

### Code Organization
- Feature-based modular architecture
- Custom hooks (`useChat`) for reusable logic
- Utility-driven design for message creation and stream handling
- Fully typed with TypeScript for maintainability

---

## ⚙️ Performance Optimizations

- Virtual scrolling for large chat histories
- Streaming UI updates to avoid blocking renders
- Optimized re-renders using `React.memo`
- Efficient global state updates with Zustand
- Reduced API payload via context summarization

---

## 💣 Complex Problems Solved

- Reliable SSE parsing across fragmented network chunks
- Handling partial AI responses without breaking UI
- Preventing stale updates during concurrent async streams
- Safe cancellation of in-flight requests using AbortController
- Maintaining UI consistency during failures and retries

---

## 🧪 Testing & Code Quality

- Unit testing with **Vitest**
- Component testing using **React Testing Library**
- Store and stream-processing test coverage
- ESLint for code quality enforcement
- Husky pre-commit hooks for consistency

---

## 🧰 Tech Stack

### Frontend
- Next.js (App Router), React, TypeScript
- Tailwind CSS, shadcn/ui, Lucide Icons

### State & Performance
- Zustand (with persistence middleware)
- react-virtuoso (virtualization)

### AI & Streaming
- Sarvam AI APIs
- ReadableStream + Server-Sent Events (SSE)

### Rendering
- react-markdown + remark-gfm
- react-syntax-highlighter

### Testing & Tooling
- Vitest, jsdom
- ESLint, Husky

---

## 🔌 API Endpoints

- `/api/chat` → Streaming AI responses
- `/api/summarize` → Conversation compression
- `/api/title` → AI-generated titles

---

## 🚀 Deployment

- Vercel-ready (serverless)
- Environment-based configuration (`SARVAM_API_KEY`)
- Optimized Next.js production build

---

## 🔗 Live Demo

https://sudeshi-ai-chat.vercel.app
