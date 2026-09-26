# Sudeshi AI Chat

A multilingual AI chat application built with **Next.js**, focused on real-time streaming, provider abstraction, conversation memory, frontend performance, and AI request lifecycle management.

🌐 **Live Demo:** https://sudeshi-ai-chat.vercel.app

[![Testing](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/testing.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/testing.yml)
[![CodeQL](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/codeql.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/codeql.yml)
[![WebVitals](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/webvitals.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/webvitals.yml)
[![TruffleHog](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/trufflehog.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/trufflehog.yml)

---

# What is Sudeshi?

Sudeshi is an AI chat application that provides a common chat experience across hosted and self-hosted AI models.

The application is built around a provider adapter layer so that provider-specific APIs and streaming formats remain isolated from the UI.

The project explores:

- Streaming responses and incremental rendering
- Provider abstraction
- Conversation context management
- Token-aware summarization
- Long-conversation rendering performance
- Request cancellation and lifecycle management
- Runtime token, cost, and performance metrics
- Safe connections to user-configured Ollama endpoints

Sudeshi does not host or run the AI models itself. Sarvam models are accessed through Sarvam's API, while Ollama models can be accessed through a user-configured Ollama endpoint.

---

# Screenshots

### Real-Time Streaming

<img width="1916" height="948" alt="Real-time streaming" src="https://github.com/user-attachments/assets/606753cb-f168-4a98-a467-6bfd6ea04106" />

### Code Generation

<img width="1920" height="947" alt="Code generation" src="https://github.com/user-attachments/assets/0af99977-1f99-41c1-b867-d7976930d91d" />

### Rich Markdown & Tables

<img width="1920" height="947" alt="Rich markdown and tables" src="https://github.com/user-attachments/assets/49cc091d-c322-4f38-b6f1-8131d39b226f" />

### Modern Chat Experience

<img width="1920" height="947" alt="Modern chat experience" src="https://github.com/user-attachments/assets/2dd03627-4403-419b-874b-9731ce03d814" />

---

# Features

## Multi-Provider Support

### Sarvam AI

The current application exposes:

- **Sarvam 105B (Conversation)**
- **Sarvam 105B (Reasoning)**

Sarvam requests are sent through the application's Next.js API route, keeping the API key on the server side.

### Ollama

Sudeshi can connect to an Ollama server through a user-configured endpoint.

The application queries the endpoint for available models and populates the model selector dynamically. This allows the same chat interface to work with models running on a local machine, private network, or another user-controlled server.

---

## Real-Time Streaming

The streaming layer handles:

- Server-Sent Events (SSE) from Sarvam
- JSONL responses from Ollama
- Incremental text rendering
- Thinking/reasoning chunks where supported
- Chunk buffering across network boundaries
- Stream completion
- AbortController-based cancellation

Provider-specific formats are parsed into a common flow before the response reaches the chat state.

---

## Thinking / Reasoning Output

For compatible Ollama models, Sudeshi can receive and display thinking/reasoning content separately from the final response.

The streaming parser understands common reasoning fields such as `thinking` and `reasoning_content`.

---

## Conversation Memory

Sudeshi uses **token-aware conversation summarization** rather than relying only on message count.

When accumulated assistant token usage exceeds the configured threshold:

1. Older conversation history is selected for summarization.
2. The most recent messages are preserved.
3. The older context is summarized through a dedicated API route.
4. The generated summary becomes part of the next model context.
5. The preserved recent messages remain available directly.

The current configuration uses a **4,500-token threshold** and preserves the **six most recent messages**.

---

## Automatic Conversation Titles

New conversations are automatically given a concise title based on the first user message using a dedicated Sarvam 105B API route.

---

## Multiple Conversations

Users can:

- Create new conversations
- Switch between conversations
- Rename conversations
- Delete conversations
- Continue conversations independently

Conversation state is persisted in the browser using Zustand persistence. There is currently no server-side conversation database.

---

## Markdown and Code Rendering

AI responses support:

- Headings
- Lists
- Links
- Tables
- Code blocks
- Syntax highlighting

GitHub-flavoured Markdown is supported through `remark-gfm`.

---

## Runtime Usage and Performance Metrics

Sudeshi exposes request-level information including:

- Prompt tokens
- Completion tokens
- Total tokens
- Estimated input/output cost where supported
- Total response time
- Time to first token/chunk
- Streaming duration
- Token throughput

Sarvam 105B cost calculations use pricing constants configured in the application. Providers without configured pricing do not display an estimated cost.

---

## High-Performance Conversation Rendering

Sudeshi uses:

- **React Virtuoso** for message virtualization
- `React.memo` for component memoization
- Zustand state management
- Granular state updates
- Incremental streaming updates

---

## Request Lifecycle Management

Sudeshi handles:

- Request cancellation
- AbortController integration
- Streaming state
- Response finalization
- Cancelled responses
- Error responses
- Concurrent request guards
- Cleanup after completion

A new message cannot be submitted while another response is actively streaming.

---

## Responsive Chat Experience

The UI includes:

- Conversation sidebar
- Mobile navigation
- Model selection
- Settings
- Dark/light themes
- Empty-state guidance
- Guided prompts
- Offline state handling
- Responsive chat input

---

# Architecture

Sudeshi uses a feature-oriented Next.js structure with an adapter layer between the chat experience and AI providers.

```text
                         Chat UI
                            │
                            ▼
                      useChat Hook
                            │
                            ▼
                      Zustand Store
                            │
                            ▼
                      Adapter Manager
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
            SarvamAdapter        OllamaAdapter
                  │                   │
                  ▼                   ▼
              /api/chat          /api/ollama
                  │                   │
                  ▼                   ▼
             Sarvam API          Ollama Server
                  │                   │
                  └─────────┬─────────┘
                            ▼
                     Streaming Parser
                       SSE / JSONL
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
              Text chunks        Thinking chunks
                 │                     │
                 └──────────┬──────────┘
                            ▼
                       Chat State
                            │
                            ▼
                          UI
```

The provider adapters implement a shared `AIAdapter` interface.

---

# Supporting API Routes

| Route | Purpose |
| --- | --- |
| `/api/chat` | Streams Sarvam chat completions |
| `/api/ollama` | Proxies streaming requests to a configured Ollama endpoint |
| `/api/checkOllama` | Checks an Ollama endpoint and retrieves available models |
| `/api/summarize` | Generates compact conversation summaries using Sarvam 105B |
| `/api/title` | Generates conversation titles using Sarvam 105B |

---

# Conversation Context Flow

```text
User message
     │
     ▼
Add to active conversation
     │
     ▼
Read conversation history
     │
     ▼
Calculate accumulated assistant token usage
     │
     ▼
Threshold exceeded?
     │
 ┌───┴────┐
 │        │
 No       Yes
 │        │
 ▼        ▼
Use      Summarize
history  older context
 │        │
 │        ▼
 │     Preserve recent
 │       messages
 │        │
 └───┬────┘
     ▼
Select provider adapter
     │
     ▼
Start streaming request
     │
     ▼
Update response incrementally
     │
     ▼
Capture usage & metrics
     │
     ▼
Finalize assistant message
```

---

# Security

Sudeshi supports user-configured Ollama endpoints. Current validation includes:

- HTTP and HTTPS protocol checks
- HTTPS requirement for remote endpoints
- HTTP allowed for local/private network endpoints
- Blocking credentials embedded in endpoint URLs
- Endpoint URL construction through the URL API
- Request timeouts for Ollama model discovery
- Disabled redirect following for Ollama requests

These controls reduce unsafe endpoint and request behavior but are not a complete security boundary for untrusted deployments.

---

# Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5
- **Styling/UI:** Tailwind CSS 4, shadcn/ui, Lucide React, next-themes
- **State:** Zustand
- **Rendering:** React Virtuoso, React Markdown, remark-gfm, React Syntax Highlighter
- **AI:** Sarvam AI, Ollama
- **Streaming:** Web Fetch API, ReadableStream, SSE, JSONL
- **Testing:** Vitest, Testing Library, jsdom
- **Tooling:** ESLint 9, Husky
- **Deployment:** Vercel, Docker, Next.js standalone output, Node.js 24 Alpine

---

# Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── chat/
│   │   ├── checkOllama/
│   │   ├── ollama/
│   │   ├── summarize/
│   │   └── title/
│   │
│   └── features/
│       └── chat/
│           ├── components/
│           ├── hooks/
│           ├── services/
│           │   └── adapters/
│           ├── types/
│           └── utils/
│
├── components/
│   └── ui/
├── hooks/
├── lib/
├── store/
├── tests/
├── public/
├── scripts/
├── Dockerfile
├── next.config.ts
├── package.json
└── vitest.config.ts
```

---

# Local Development

## Prerequisites

- Node.js 24
- npm
- A Sarvam API key if using Sarvam models
- An accessible Ollama server if using Ollama models

## Installation

```bash
git clone https://github.com/sriram23/sudeshi-ai-chat.git
cd sudeshi-ai-chat
npm install
```

## Environment Variables

Create `.env.local`:

```env
SARVAM_API_KEY=your_api_key
SARVAM_SUBSCRIPTION_KEY=your_subscription_key
```

`SARVAM_SUBSCRIPTION_KEY` is used by the summarization route when required by the configured Sarvam account.

Do not commit API keys or other secrets.

## Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

# Development Commands

```bash
npm run dev
npm run test
npm run test:ci
npm run lint
npm run build
npm run start
```

---

# Docker

The project supports a multi-stage Docker build using Next.js standalone output.

```bash
docker build -t sudeshi .
docker run -p 3000:3000 --env-file .env.local sudeshi
```

The runtime image uses Node.js 24 Alpine and runs the generated standalone server as the non-root `node` user.

---

# Adding a New Provider

Provider integrations are built around the shared `AIAdapter` interface.

1. Implement the `AIAdapter` interface.
2. Add the provider-specific adapter.
3. Add or reuse a streaming parser for the provider's response format.
4. Register the provider in `AdapterManager`.
5. Add the model to the UI/model discovery flow as appropriate.

The chat UI and core streaming state should not need to understand provider-specific API details.

---

# Current Limitations

- Conversations are persisted locally in the browser rather than on a server.
- There is no user authentication or server-side account system.
- Multimodal input is not currently implemented.
- Provider capabilities are not completely uniform.
- Ollama requires a reachable user-configured endpoint.
- Conversation summarization can lose fine-grained details from older context.
- Some model/provider behavior is determined from the selected model name.

---

# Engineering Focus

Sudeshi explores the engineering problems behind AI-powered interfaces:

### Provider abstraction

Provider-specific APIs and protocols are kept behind adapters so the rest of the application can remain provider-agnostic.

### Streaming

Streaming introduces buffering, parsing, cancellation, completion, and lifecycle problems that are absent from a simple request/response integration.

### Conversation memory

Token-aware summarization provides a more useful context-management strategy than a fixed message-count heuristic.

### Frontend performance

Virtualization and targeted React updates become increasingly important as conversations grow and responses stream continuously.

### Observability

Token usage, estimated cost, time-to-first-token, streaming duration, and throughput provide visibility into runtime AI behavior.

---

# Further Reading

- [Why I Started Building Sudeshi AI Chat](https://medium.com/@Sriram23/why-i-started-building-sudeshi-ai-chat-cf23033bf74f)
- [Sudeshi AI Chat on GitHub](https://github.com/sriram23/sudeshi-ai-chat)

---

# License

See the repository for licensing information.
