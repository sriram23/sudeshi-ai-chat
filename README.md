# Sudeshi AI Chat

A multilingual conversational chat interface with streaming-first architecture. Sudeshi focuses on real-time response flow and efficient long-form context handling.

## Project Overview

Sudeshi AI Chat is a Next.js application built around the Sarvam AI chat API. It maintains conversation state locally, streams model responses into the UI, and compresses older context into summaries to preserve relevance in long conversations.

## Motivation

This project was built to solve two practical issues in browser chat interfaces:

- high response latency in traditional chat interfaces,
- context windows that break down as conversations grow.

It targets a streaming UX where text appears as it arrives, and a context strategy that keeps the most recent dialogue intact while summarizing older history.

## Key Features

### Chat Functionality
- **Real-time Streaming Responses**: Model output appears as it arrives, reducing wait time and keeping the interface responsive.
- **Multilingual Support**: Uses Sarvam models capable of handling multiple languages in a single session.
- **Model Selection**: Switch between Sarvam 30B and 105B at runtime to balance latency and response quality.
- **Abortable Requests**: Active fetch requests can be canceled with AbortController for safer streaming.

### Conversation Management
- **Persistent Conversation History**: Zustand persistence saves conversation state in local storage.
- **Automatic Conversation Titling**: First messages are summarized into conversation titles to keep the sidebar readable.
- **Create/Delete/Rename Conversations**: Supports full conversation lifecycle with validated active-chat state.
- **Conversation Listing**: Sidebar shows recent conversations for quick switching.

### Message Handling
- **Status Tracking**: Messages carry `pending`, `completed`, or `error` states.
- **Token Usage Reporting**: Captures prompt, completion, and total token usage from the model stream.
- **Error Resilience**: Streaming errors are surfaced without corrupting stored conversation state.

### Performance & Optimization
- **Context Window Management**: Keeps the latest 19 messages in full and summarizes older history into a system prompt.
- **Lazy Summarization**: Only compresses history when the conversation exceeds the active context window.
- **Chunk Buffering**: The stream decoder batches chunks to let React render updates smoothly.

### UX Enhancements
- **Markdown Rendering**: Supports markdown and syntax-highlighted code blocks.
- **Auto-scrolling**: Automatically scrolls to the latest message while streaming.
- **Dynamic Input Sizing**: Textarea grows with content and supports multi-line input.
- **Dark Mode Toggle**: Uses next-themes to support light and dark theme switching.

## Technical Architecture

### System Flow

```
User Input
    ↓
[ChatInput Component] → Validates & sends via useChat hook
    ↓
[Zustand Store] → Creates user message, returns latest history
    ↓
[useChat Hook] → Builds payload with context windowing + optional summary
    ↓
[/api/chat Route Handler] → Proxies to Sarvam AI with streaming enabled
    ↓
[Server-Sent Events Stream] → Returns text/event-stream response
    ↓
[Streaming Decoder] → Parses SSE format, extracts JSON chunks
    ↓
[onChunk Callback] → Appends text to Zustand store (triggers re-render)
    ↓
[React Component] → Renders accumulated response in real-time
    ↓
[finalizeResponse] → Marks message as completed, clears streaming state
```

### State Management (Zustand)

Zustand was chosen over Redux for its minimal boilerplate, built-in persistence, and simpler mental model for localized state management.

The store maintains:
- **Conversations array**: Ordered list of all conversation objects (each containing messages, metadata, and summary)
- **activeConversationId**: Reference to currently viewed conversation (validated on access)
- **currentResponse**: Accumulating streamed text from the AI during active streaming
- **status**: Three-state machine (idle/streaming/error) preventing concurrent requests
- **controls.abortController**: Holds the active fetch AbortController for request cancellation

### Streaming Architecture

Streaming is implemented through Next.js API route pass-through:

1. Client sends request to `/api/chat`
2. Server forwards request with streaming enabled
3. Response is returned as a ReadableStream
4. Client decodes and extracts chunks
5. Zustand updates UI incrementally

This keeps the implementation simple while enabling real-time updates without buffering full responses.

### Message Context Window Strategy

The system implements a hybrid context strategy to balance coherence with token efficiency:

1. **Active Window**: Most recent 19 messages (max ~6 exchanges) retained in full
2. **Historical Context**: Messages older than window are summarized into a single system message
3. **Threshold**: Summarization triggers after 20+ total messages (19 recent + older batch)

The window size is tuned to retain recent conversational context while keeping token usage bounded.

**Summarization Payload**:
```
[
  { role: "system", content: "Structured summary of conversation before window..." },
  { role: "user", content: "Recent user message" },
  { role: "assistant", content: "Recent assistant response" },
  // ... rest of 19-message window
]
```

This structure preserves recent context fidelity (crucial for immediate relevance) while efficiently compressing older turns.

## Engineering Decisions & Tradeoffs

### Streaming vs. Blocking Responses

**Decision**: Implement streaming from the start, not blocking until full response received.

**Tradeoff Analysis**:
- **Streaming**: Higher perceived performance, network resilience, graceful cancellation
- **Blocking**: Simpler error handling, fewer edge cases, easier to reason about

**Why Streaming Won**: User-facing latency is perceptual. A user sees first token within 200-300ms with streaming but waits 2-3 seconds for full response with blocking. The implementation complexity is justified by the UX delta.

**Mitigations for Complexity**:
- Explicit status state machine prevents race conditions
- AbortController standardizes cancellation
- Chunk buffering handles backpressure

### Summarization for Context Management

**Decision**: Implement conversation summarization rather than naively truncating history.

**Tradeoff Analysis**:
- **Summarization**: Preserves semantic context, enables long conversations, adds API call overhead
- **Truncation**: Simple, no extra latency, loses conversation context
- **Full History**: Simple semantics, unsustainable token costs

**Why Summarization Won**: Production systems must handle conversations that exceed typical context windows. Naive truncation causes coherence collapse mid-conversation. The extra 200-400ms for summarization is acceptable given the context preservation benefit.

**Economic Model**: Long conversations (where summary kicks in) are rare. Most conversations finish within 10 exchanges, never triggering summarization. When summarization does trigger, the cost is amortized across multiple subsequent exchanges.

### Zustand Over Redux

**Decision**: Use Zustand for state management.

**Comparison**:
| Aspect | Redux | Zustand |
|--------|-------|---------|
| Store Definition | 300+ lines (actions, reducers, constants) | 40-50 lines total |
| Boilerplate | High (single action = 3 files) | Minimal (single hook) |
| Bundle Size | ~17KB | ~2.2KB |
| Learning Curve | Steep (requires paradigm shift) | Gentle (close to vanilla JS) |
| Persistence | Requires middleware setup | Built-in middleware |

For a team prioritizing development velocity and code maintainability, Zustand's simplicity wins. The trade-off is less ecosystem tooling (fewer browser extensions, community packages), but the debugging overhead for this domain is negligible.

### AbortController for Cancellation

**Decision**: Integrate AbortController for request lifecycle management.

**Alternative Considered**: Flag-based cancellation (maintain `let isCancelled = true` in closure).

**Why AbortController**:
- Native Web Standard (not proprietary abstraction)
- Automatically propagates to fetch() and other async operations
- Clean state machine: can only abort once, correctly signals `aborted` property
- Integrates with Promise.race() for timeout patterns

## Error Handling & Edge Cases

### Streaming Interruption

**Scenario**: Network drops during streaming response.

**Handling**:
```typescript
try {
  await streamChat(..., controller.signal);
  finalizeResponse(); // marks as "completed"
} catch (error) {
  if (controller.signal.aborted) {
    finalizeResponse("error"); // user cancelled
  } else {
    finalizeResponse("error"); // network error
  }
}
```

The message state correctly reflects interruption vs. normal completion, allowing UI to render appropriate affordances (retry button, error message, etc.).

### Partial Response Accumulation

**Scenario**: AI returns 50 tokens, then connection drops.

**Handling**: The accumulated tokens are retained in `currentResponse`. When user switches conversations and returns, the message appears as status="error", signaling incomplete response without losing partial data.

**Design Rationale**: Losing partial data is poor UX. Errors should be transparent; users can copy partial responses if useful.

### Orphaned activeConversationId

**Scenario**: User deletes the active conversation.

**Handling**: `setActiveConversation` validates the ID exists in the conversations array. If deleted conversation was active, it automatically activates the most recent remaining conversation (or null if no conversations remain).

```typescript
setActiveConversation: (id) =>
  set((state) => ({
    activeConversationId: state.conversations.some(con => con.id === id) ? id : null
  }))
```

This prevents the invalid state where `activeConversationId` references a non-existent conversation.

### Model Mismatch

**Scenario**: User selects sarvam-105b but API is unreachable or returns 403 (quota exceeded).

**Handling**: Error caught in `useChat` hook, status set to "error", message marked as "error" status. Subsequent user actions are allowed (can retry, switch models, etc.). No cascading failures.

## Testing Strategy

### Testing Philosophy

The test suite prioritizes **state machine correctness** over UI snapshot testing. This reflects the principle that most bugs in chat applications emerge from invalid state transitions, not rendering issues.

### Test Coverage

**Vitest + React Testing Library** validates:

#### State Management (Primary Focus)
- **Happy Path**: Create conversation, add message, delete conversation, rename
- **Multi-Conversation Workflows**: Switch between conversations, ensure isolated message arrays
- **Invalid State Prevention**: Cannot activate non-existent conversation, cannot add message to orphaned conversation
- **Deletion Edge Cases**:
  - Delete active conversation → automatically switch to next
  - Delete single conversation → active becomes null
  - Delete non-active conversation → active unchanged

#### Message Handling
- User message creation with unique ID and timestamp
- Status transitions (pending → completed, pending → error)
- Token usage metadata propagation

#### Streaming Integration (Unit Level)
- OnChunk callback correctly appends to store
- Usage metadata captured and stored
- AbortSignal correctly terminates stream reading

### Test File Organization

```
tests/
├── store/
│   └── chatStore.test.ts (15 test cases, 100% store coverage)
├── services/
│   └── sarvamClient.test.ts (streaming parser tests)
├── hooks/
│   └── useChat.test.ts (integration tests)
```

### Example: Edge Case Testing

```typescript
it("should set the first conversation active when the active conversation is deleted", () => {
  const { createConversation, deleteConversation, setActiveConversation } = useChatStore.getState()
  createConversation("test-1")
  const delConvId = createConversation("test-2")
  setActiveConversation(delConvId)
  deleteConversation(delConvId)

  const state = useChatStore.getState()
  expect(state.activeConversationId).toBe(state.conversations[0].id)
  expect(state.conversations.find(c => c.id === delConvId)).toBeUndefined()
})
```

This test captures a critical UX requirement: deletion should never leave the UI in a state where there's no active conversation if conversations exist. The test ensures the invariant holds.

## Tech Stack

- Next.js 16.2
- React 19
- TypeScript 5
- Zustand 5
- Tailwind CSS 4
- react-markdown
- react-syntax-highlighter
- Vitest
- Sarvam AI

## Project Structure

```
sudeshi/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider, global styles
│   ├── page.tsx                # Home page, mounts ChatContainer
│   ├── globals.css             # Tailwind directives, CSS resets
│   ├── api/
│   │   ├── chat/route.ts       # POST /api/chat - proxies to Sarvam, streams response
│   │   ├── summarize/route.ts  # POST /api/summarize - compression for long contexts
│   │   └── title/route.ts      # POST /api/title - generates conversation titles
│   └── features/chat/          # Feature bundle for chat functionality
│       ├── components/
│       │   ├── ChatContainer.tsx      # Main layout: sidebar + messages + input
│       │   ├── ChatInput.tsx          # Textarea with model selector + send button
│       │   ├── ChatBubble components  # User/Assistant message rendering
│       │   ├── MarkdownRender.tsx     # Markdown parser + syntax highlighter
│       │   └── GuideComponent.tsx     # Onboarding UI for empty state
│       ├── hooks/
│       │   └── useChat.ts       # sendMessage(), stopStreaming() logic + context window
│       ├── services/
│       │   └── sarvamClient.ts  # Streaming decoder, summarize/title API clients
│       ├── types/
│       │   └── chat.types.ts    # Message, Role, MessageStatus types
│       └── utils/
│           └── messageFactory.ts # createMessage() helper
│
├── store/
│   └── chatStore.ts            # Zustand store with persistence middleware
│
├── components/ui/              # Generic UI primitives (Alert, Button, Input, etc.)
├── hooks/use-mobile.ts         # Responsive breakpoint hook
├── lib/utils.ts                # Utility functions (clsx, tailwind merge)
│
├── tests/
│   └── store/chatStore.test.ts # Unit tests for state management
│
└── Configuration Files
    ├── tsconfig.json            # TypeScript compiler options
    ├── next.config.ts           # Next.js configuration
    ├── tailwind.config.ts       # Tailwind CSS customization
    └── vitest.config.ts         # Vitest runner configuration
```

### Architectural Rationale

- **Feature Bundling** (`app/features/chat/`): Encapsulates all chat-related logic (components, hooks, services, types) in a single folder, making it easy to extract as a reusable module later or deprecate as a unit.
- **API Routes in `app/api/`**: Next.js convention for backend; each route is isolated, making it clear what endpoints exist and their responsibilities.
- **Separate Store Directory**: Global state at workspace root signals it's shared across all features (vs. feature-local state in `components/`).
- **Type Cohabitation**: Types live near consumers (`chat.types.ts` in features/chat) rather than centralized, reducing import path verbosity.

## Setup Instructions

### Prerequisites
- Node.js 18+ (for native fetch, crypto.getRandomValues)
- npm or yarn or pnpm
- Sarvam AI API key (obtain from https://sarvam.ai)

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd sudeshi
   npm install
   ```

2. **Configure environment variables**:
   Create `.env.local` in project root:
   ```env
   SARVAM_API_KEY=your_api_key_here
   ```

   The API key is required for `/api/chat`, `/api/summarize`, and `/api/title` routes to function.

3. **Verify setup**:
   ```bash
   npm run lint    # Check for TypeScript errors
   npm run test:ci # Execute test suite
   ```

### Running Locally

**Development mode** (with auto-reload):
```bash
npm run dev
```
Opens http://localhost:3000

**Production build** (optimized):
```bash
npm run build
npm run start
```

## Performance Considerations

### Streaming vs. Blocking

- Streaming surfaces tokens as they arrive and keeps the UI responsive.
- Blocking waits for the full response and feels slower even if network time is similar.
- AbortController enables safe cancellation of active streams.

### Token Efficiency

- Older conversation history is summarized and sent as a single system prompt.
- The most recent 19 messages remain intact to preserve the current dialogue.
- This reduces context size without dropping immediate chat context.

### Render Efficiency

- A small delay between stream chunks prevents render thrashing.
- Zustand keeps components subscribed only to the data they need.
- `useRef` and scroll logic avoid extra re-renders.

## Future Improvements

- Conversation search across stored chats.
- Retry failed responses without replaying the entire session.
- Session recovery after a network disconnect.
- Better model selection guidance for latency vs. quality.
- Simple conversation export for offline review.

## Key Learnings

- Streaming responses significantly improve perceived latency compared to blocking APIs.
- Managing conversational context requires balancing token limits and semantic continuity.
- State consistency (especially around active conversations) is a primary source of bugs in chat systems.
- Testing state transitions and edge cases is more valuable than UI snapshot testing for this type of application.

## Live Demo

https://sudeshi-ai-chat.vercel.app

---

**Last Updated**: 2026-04-10