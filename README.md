# Sudeshi AI Chat

Real-time streaming AI chat application focused on low-latency UX and efficient long-conversation handling.

---

## 🚀 Key Highlights

- Built a **streaming chat system** with incremental UI updates (no blocking responses)
- Achieves **~300–500ms first token latency** vs 2–3s traditional response wait
- Designed a **state-machine-driven architecture** to handle async streaming safely
- Implemented **context compression (summarization)** to support long conversations
- Handles **SSE streaming, aborts, and partial failures** without breaking UI state

---

## ⚡ Core Features

- Real-time streaming responses using `ReadableStream` + SSE parsing
- Multi-conversation management (create, delete, rename, switch)
- Abort in-flight requests using `AbortController`
- Automatic conversation summarization for long chats
- Markdown + syntax-highlighted responses
- Persistent chat state using Zustand

---

## 🧠 Engineering Depth

### Streaming & Async Handling

- Parses SSE streams with chunk buffering and boundary handling
- Handles multiple events per chunk and incomplete JSON safely
- Prevents race conditions using a strict `idle → streaming → error` state model
- Supports partial responses on failure without data loss

### State Management

- Global Zustand store with persistence
- Tracks:
  - active conversation
  - streaming response buffer (`currentResponse`)
  - request lifecycle status
- Ensures valid state transitions (no orphaned conversations)

### Context Management

- Keeps the last **19 messages** as active context
- Older messages summarized via API
- Prevents token explosion while maintaining conversation relevance

---

## ⚙️ Performance Considerations

- Streaming avoids blocking UI → faster perceived performance
- Chunk buffering reduces excessive re-renders
- UI actions are disabled during streaming to prevent duplicate requests
- Persistent store avoids rehydration overhead

---

## 💣 Hard Problems Solved

- SSE parsing across chunk boundaries
- Handling missing `[DONE]` stream termination
- Preventing stale state updates during async streaming
- Safely aborting in-flight requests without corrupting UI state
- Managing partial responses when streams fail mid-way

---

## 🧪 Testing

- Unit tests for:
  - stream processing (chunking, JSON parsing, edge cases)
  - Zustand store (state transitions, deletion, invalid states)
- Focused on **state consistency over UI snapshots**

---

## 🧰 Tech Stack

- Next.js, React, TypeScript
- Zustand (state management)
- Tailwind CSS
- react-markdown + syntax highlighter
- Vitest + React Testing Library

---

## 🔗 Live Demo

https://sudeshi-ai-chat.vercel.app