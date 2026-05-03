# Sudeshi AI Chat

Real-time AI chat application with multi-provider support and low-latency streaming architecture.

Supports both hosted (Sarvam) and self-hosted (Ollama) models with a pluggable system for future integrations.

🔗 Live: https://sudeshi-ai-chat.vercel.app

---

## 🔥 Highlights

- ~300–500ms time-to-first-token using SSE streaming
- Multi-provider architecture (Sarvam + Ollama)
- Pluggable adapter system for AI integrations
- Virtualized rendering for large chat histories
- Context compression for long conversations

---

## 💣 Engineering Challenges Solved

- Normalized different provider streaming formats (SSE vs JSON stream)
- Handled fragmented streaming responses safely
- Designed state-machine-based async handling for streaming flows
- Prevented stale updates during concurrent requests
- Implemented safe request cancellation using AbortController

---

## 🧱 Architecture

### AI Provider Layer
- `AIAdapter` interface standardizes provider behavior  
- `SarvamAdapter` and `OllamaAdapter` handle provider-specific logic  
- `AdapterManager` dynamically selects provider at runtime  

### Streaming Engine
- Unified streaming pipeline for different response formats  
- Normalizes structured SSE and JSON-line streams  

### State Management
- Zustand store with persistence  
- Handles conversations, models, and provider configuration  

### Context Handling
- Sliding window for recent messages  
- Older messages compressed via summarization API  

---

## ⚡ Performance

- Virtualized rendering using `react-virtuoso`
- Optimized re-renders using `React.memo`
- Streaming UI updates to avoid blocking renders
- Efficient global state updates with Zustand

---

## 🧰 Tech Stack

- Next.js (App Router), React, TypeScript  
- Zustand, react-virtuoso  
- Tailwind CSS, shadcn/ui  
- Sarvam AI APIs, Ollama  
- SSE, ReadableStream  

---

## ⚠️ Limitations

- Provider detection based on model naming  
- Limited validation for custom endpoints  
- Generic error handling across providers  

---

## 🚀 Extensibility

To add a new provider:
1. Implement `AIAdapter`  
2. Register in `AdapterManager`  
3. Handle provider-specific streaming logic  
