# Sudeshi AI Chat

Production-style multilingual AI chat application focused on low-latency streaming, provider abstraction, and scalable frontend architecture.

Supports both hosted and self-hosted models through a unified streaming pipeline.

🔗 Live Demo: [Sudeshi AI Chat](https://sudeshi-ai-chat.vercel.app?utm_source=github.com)

---

## Overview

Sudeshi was built to explore the engineering challenges behind real-time AI chat systems:

* Streaming responses with low latency
* Normalizing multiple provider protocols
* Managing long-running conversations efficiently
* Preventing stale UI updates during concurrent requests
* Supporting self-hosted and hosted models through a unified interface

Unlike simple AI wrappers, Sudeshi focuses heavily on streaming architecture, extensibility, rendering performance, and runtime observability.

---

## Key Features

### Unified Multi-Provider Architecture

* Supports both hosted (`Sarvam AI`) and self-hosted (`Ollama`) models
* Adapter-driven architecture for future providers
* Runtime provider selection through a shared interface

### Real-Time Streaming

* Handles SSE and JSONL streaming formats
* Safe chunk buffering for fragmented responses
* Abortable requests using `AbortController`

### Scalable Chat Rendering

* Virtualized message rendering using `react-virtuoso`
* Optimized for long-running conversations
* Prevents DOM bloat and excessive re-renders

### Context Compression

* Sliding context window for recent messages
* Automatic summarization of older conversations
* Reduces token usage while preserving continuity

### Runtime Metrics

Tracks:

* Time-to-first-token
* Stream duration
* Token throughput
* Total generation time

### Security-Conscious Ollama Integration

* Endpoint validation
* Restricted ports
* HTTPS enforcement
* Timeout protection against hanging requests

---

## Engineering Challenges Solved

### Streaming Normalization

Different providers expose different streaming protocols:

| Provider | Format |
| -------- | ------ |
| Sarvam   | SSE    |
| Ollama   | JSONL  |

Sudeshi normalizes both into a unified streaming pipeline so the UI remains provider-agnostic.

### Fragmented Stream Handling

Streaming chunks may arrive partially or split mid-JSON.

The streaming engine:

* Buffers incomplete chunks
* Safely reconstructs payloads
* Prevents malformed parsing

### Concurrent Request Safety

Implemented protections against:

* stale stream updates
* race conditions
* overlapping requests
* incomplete cancellation flows

### Long Conversation Performance

Large chats can degrade rendering performance significantly.

Sudeshi mitigates this through:

* virtualization
* selective Zustand subscriptions
* memoized components
* streaming-based incremental rendering

---

## Architecture

```text
UI Components
    ↓
useChat Hook
    ↓
Zustand Store
    ↓
AdapterManager
    ↓
AIAdapter Interface
    ↓
┌───────────────┬───────────────┐
│ SarvamAdapter │ OllamaAdapter │
└───────────────┴───────────────┘
    ↓
Streaming Parser Layer
    ↓
SSE / JSONL Processing
```

---

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* shadcn/ui

### State & Rendering

* Zustand
* react-virtuoso

### Streaming & AI

* ReadableStream API
* Server-Sent Events (SSE)
* Ollama
* Sarvam AI APIs

### Testing

* Vitest
* Testing Library

---

## Performance Optimizations

### Rendering

* Virtualized message lists
* `React.memo` for isolated updates
* Granular Zustand selectors

### Streaming

* Incremental chunk rendering
* Non-blocking UI updates
* Buffered parsing pipeline

### State Management

* Optimistic updates
* Minimal state subscriptions
* Persistent conversations

---

## Security Considerations

### Ollama Endpoint Validation

To reduce SSRF risks:

* HTTPS enforced for remote endpoints
* Restricted allowed ports

### Request Lifecycle Safety

* Abortable streams
* Controlled cleanup
* Safe async state transitions

---

## Local Development

```bash
git clone <repo>
cd sudeshi-ai-chat

npm install
npm run dev
```

Create `.env.local`

```env
SARVAM_API_KEY=your_key
```

---

## Extending Providers

To add a new provider:

1. Implement `AIAdapter`
2. Add parser logic if required
3. Register adapter in `AdapterManager`

The UI layer remains unchanged.

---

## Tradeoffs & Current Limitations

* Provider detection is currently model-name driven
* Conversation summaries may lose fine-grained context
* No server-side conversation persistence
* Limited validation for custom provider schemas

---

## Future Improvements

* Web search integration
* Multi-modal support
* Conversation export
* Shared conversations
* IndexedDB persistence layer
* Advanced observability dashboard
* Streaming retry/recovery mechanisms

---

## Why This Project Matters

Sudeshi is primarily an exploration of:

* streaming systems
* frontend scalability
* provider abstraction
* runtime performance
* resilient async UI architecture

The goal was not just to build another AI chat UI, but to design a maintainable and extensible streaming platform.
