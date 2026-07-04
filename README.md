# Sudeshi AI Chat

A production-style AI chat platform built with **Next.js**, focused on **real-time streaming**, **provider abstraction**, **high-performance rendering**, and **efficient conversation memory**.

Rather than being another LLM wrapper, Sudeshi explores the engineering challenges behind building scalable AI interfaces—including streaming protocols, request lifecycle management, token-aware context optimization, and frontend performance.

🌐 **Live Demo:** https://sudeshi-ai-chat.vercel.app

---
[![Testing](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/testing.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/testing.yml)
[![CodeQL](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/codeql.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/codeql.yml)
[![WebVitals](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/webvitals.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/webvitals.yml)
[![TruffleHog](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/trufflehog.yml/badge.svg)](https://github.com/sriram23/sudeshi-ai-chat/actions/workflows/trufflehog.yml)

---

# Screenshots

### ⚡ Real-Time Streaming

<img width="1916" height="948" alt="Streaming" src="https://github.com/user-attachments/assets/606753cb-f168-4a98-a467-6bfd6ea04106" />

---

### 💻 Code Generation

<img width="1920" height="947" alt="image" src="https://github.com/user-attachments/assets/0af99977-1f99-41c1-b867-d7976930d91d" />

---

### 📊 Rich Markdown & Tables

<img width="1920" height="947" alt="image" src="https://github.com/user-attachments/assets/49cc091d-c322-4f38-b6f1-8131d39b226f" />

---

### 🏠 Modern Chat Experience

<img width="1920" height="947" alt="image" src="https://github.com/user-attachments/assets/2dd03627-4403-419b-874b-9731ce03d814" />

---

# Engineering Highlights

- ⚡ Real-time streaming responses
- 🔌 Provider abstraction architecture
- 🧠 Automatic conversation summarization using configurable token thresholds
- 📈 Runtime performance metrics
- 🚀 Virtualized rendering for large conversations
- 🛑 Abortable requests with stale response protection
- 📦 Persistent conversations
- 🔒 Secure Ollama endpoint validation
- 🎯 React performance optimizations
- 🧪 Comprehensive testing pipeline

---

# Features

## Multi-Provider Support

Sudeshi separates the UI from model providers through an adapter-driven architecture.

Currently supports:

- Sarvam AI (30B & 105B)
- Self-hosted Ollama models

Adding a new provider only requires implementing the shared `AIAdapter` interface.

---

## Real-Time Streaming

Supports multiple streaming protocols through a unified pipeline.

- Server-Sent Events (SSE)
- JSONL streams
- Incremental rendering
- Safe chunk buffering
- Fragment reconstruction
- AbortController support

The UI remains completely provider-agnostic.

---

## High Performance Rendering

Long-running AI conversations can contain hundreds of messages.

Sudeshi keeps rendering performant through:

- React Virtuoso virtualization
- React.memo
- Granular Zustand selectors
- Incremental UI updates
- Minimal component re-renders

---

## Conversation Memory

Large conversations eventually exceed an LLM's context window.

Instead of relying on message count, Sudeshi monitors the conversation's cumulative token usage.

When a configurable token threshold is exceeded:

- older messages are summarized
- recent messages are preserved
- the generated summary becomes part of future context
- token usage is significantly reduced while maintaining conversational continuity

This allows long-running conversations without continuously increasing prompt size.

---

## Runtime Metrics

Every request captures useful runtime metrics including:

- Time to First Token (TTFT)
- Stream duration
- Total generation time
- Prompt tokens
- Completion tokens
- Total tokens
- Token throughput

These metrics help evaluate model responsiveness and streaming performance.

---

## Request Lifecycle Management

Streaming requests are notoriously difficult to manage correctly.

Sudeshi includes protections for:

- request cancellation
- stale responses
- overlapping requests
- race conditions
- async cleanup
- stream completion detection

---

# Architecture

```text
React UI
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
    ▼
AIAdapter
    │
 ┌───────────────┬───────────────┐
 │               │               │
 ▼               ▼               ▼
Sarvam      Ollama      Future Providers
 │               │
 └──────┬────────┘
        ▼
Streaming Parser
(SSE / JSONL)
        │
        ▼
Incremental UI Updates
```

---

# Engineering Decisions

## Why Provider Adapters?

Every provider exposes different APIs and streaming protocols.

The adapter layer isolates provider-specific logic from the UI, making future integrations significantly easier.

---

## Why Virtualization?

Rendering hundreds of React components quickly becomes expensive.

Virtualization ensures only visible messages are mounted, keeping rendering smooth even during long conversations.

---

## Why Token Threshold-Based Summarization?

Message count is a poor approximation of actual LLM context usage.

Instead, Sudeshi monitors cumulative token usage reported by the provider.

When the configured threshold is exceeded, older messages are summarized while preserving recent context, allowing conversations to continue within a manageable context window.

---

## Why Runtime Metrics?

Streaming latency differs across providers and models.

Capturing runtime metrics makes it easier to compare responsiveness and identify performance bottlenecks.

---

# Security

For self-hosted providers, Sudeshi includes multiple safeguards.

- HTTPS enforcement for remote endpoints
- Restricted port validation
- Request timeouts
- Endpoint validation
- Safe request cancellation

These checks help reduce common networking and SSRF risks.

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui

## State Management

- Zustand

## Rendering

- React Virtuoso

## AI

- Sarvam AI
- Ollama
- ReadableStream API
- Server-Sent Events

## Validation

- Zod

## Testing

- Vitest
- Testing Library

---

# Local Development

```bash
git clone https://github.com/sriram23/sudeshi-ai-chat.git

cd sudeshi-ai-chat

npm install

npm run dev
```

Create:

```env
SARVAM_API_KEY=your_api_key
```

---

# Adding a New Provider

Adding a provider requires only three steps.

1. Implement `AIAdapter`
2. Add streaming parser if necessary
3. Register the adapter

The UI requires no changes.

---

# Current Limitations

- Provider detection is currently model-based
- Conversation summaries may omit fine-grained details
- Conversations are stored locally
- No multimodal support
- No server-side conversation persistence

---

# Lessons Learned

Building Sudeshi reinforced several engineering lessons.

- Streaming protocols differ significantly across providers.
- Rendering performance often becomes a bottleneck before networking.
- Request cancellation is considerably harder than issuing requests.
- Provider abstraction greatly simplifies future integrations.
- Token threshold-based summarization scales better than message-count heuristics.
- Profiling real applications is more valuable than premature optimization.

---

# Roadmap

- Web Search
- Image Generation
- Multi-modal Support
- MCP Integration
- Shared Conversations
- Conversation Export
- IndexedDB Persistence
- Additional LLM Providers
- Advanced Observability Dashboard

---

# Why This Project

Sudeshi AI Chat was built to explore the engineering challenges behind production-grade AI interfaces, from streaming protocols and provider abstraction to rendering performance, request lifecycle management, and token-aware conversation memory.

The goal wasn't simply to build another AI chat application, but to design a maintainable, extensible, and performant frontend architecture capable of supporting modern AI workloads.
