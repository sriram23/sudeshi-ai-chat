Sudeshi AI Chat

Sudeshi AI Chat is a multi-provider AI chat client built with Next.js,
supporting both hosted (Sarvam) and self-hosted (Ollama) models. It
delivers low-latency streaming responses and is designed with a
pluggable architecture for future AI integrations.

------------------------------------------------------------------------

🔥 Key Highlights

-   Real-time streaming chat with ~300–500ms first-token latency using
    SSE
-   Multi-provider support: Sarvam (hosted) + Ollama (self-hosted /
    remote)
-   Pluggable adapter architecture for integrating AI providers
-   Context compression via summarization to manage long conversations
-   Virtualized rendering for performance with large chat histories

------------------------------------------------------------------------

⚡ Core Features

💬 Chat & Conversation Management

-   Real-time AI responses via ReadableStream + SSE parsing
-   Multi-conversation support (create, rename, delete, switch)
-   AI-generated conversation titles
-   Persistent chat history using Zustand

🔌 Multi-Provider AI Support

-   Supports Sarvam AI and Ollama models
-   Dynamic model fetching from Ollama /api/tags
-   Configurable Ollama endpoint via user-provided base URL
-   Provider selection handled via adapter system

🧠 AI Capabilities

-   Token usage tracking (prompt / completion / total)
-   Context-aware summarization (sliding window + compression)

------------------------------------------------------------------------

🧱 Architecture & Engineering

AI Provider Architecture

-   AIAdapter interface standardizes provider behavior
-   SarvamAdapter and OllamaAdapter implement provider-specific logic
-   AdapterManager dynamically selects provider at runtime

Streaming Engine

-   Handles different streaming formats:
    -   Sarvam: SSE-based structured responses
    -   Ollama: JSON-line streaming responses
-   Shared processStream pipeline normalizes responses

State Management

-   Zustand store with persistence
-   Stores model and endpoint configuration
-   Provider inferred from selected model

Context Management

-   Sliding window of recent messages (last 19)
-   Older messages compressed via summarization API

------------------------------------------------------------------------

⚙️ Performance Optimizations

-   Virtual scrolling using react-virtuoso
-   Streaming UI updates to avoid blocking renders
-   Optimized re-renders using React.memo
-   Efficient global state updates with Zustand

------------------------------------------------------------------------

💣 Complex Problems Solved

-   Normalizing different provider response formats into a unified
    stream
-   Handling fragmented streaming responses safely
-   Managing async state transitions with a state-machine approach
-   Preventing stale updates during concurrent streams
-   Safe request cancellation using AbortController

------------------------------------------------------------------------

🧪 Testing & Code Quality

-   Unit testing with Vitest
-   Component testing using React Testing Library
-   ESLint for code quality
-   Husky pre-commit hooks

------------------------------------------------------------------------

🧰 Tech Stack

Frontend

-   Next.js (App Router), React, TypeScript
-   Tailwind CSS, shadcn/ui

State & Performance

-   Zustand (with persistence middleware)
-   react-virtuoso

AI & Streaming

-   Sarvam AI APIs
-   Ollama (self-hosted / remote models)
-   ReadableStream + Server-Sent Events (SSE)

Rendering

-   react-markdown + remark-gfm
-   react-syntax-highlighter

------------------------------------------------------------------------

🔌 API Endpoints

-   /api/chat → Sarvam streaming responses
-   /api/ollama → Ollama proxy streaming
-   /api/checkOllama → Fetch available models from Ollama
-   /api/summarize → Conversation compression
-   /api/title → AI-generated titles

------------------------------------------------------------------------

🧩 Extensibility

The system is designed to support additional AI providers.

To add a new provider: 1. Implement the AIAdapter interface 2. Register
it in AdapterManager 3. Handle provider-specific streaming logic

------------------------------------------------------------------------

⚠️ Current Limitations

-   Provider detection is based on model naming conventions
-   No strict validation for custom Ollama endpoints
-   Error handling is generic across providers

------------------------------------------------------------------------

🚀 Deployment

-   Vercel-ready (serverless)
-   Environment-based configuration for Sarvam API key

------------------------------------------------------------------------

🔗 Live Demo

https://sudeshi-ai-chat.vercel.app
