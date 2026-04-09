# Sudeshi AI Chat

AI-powered multilingual chat application with real-time streaming, built using Sarvam AI.

## Features

### Core Chat Functionality
- **Real-time Streaming Responses** - Live streaming responses from Sarvam AI models with instant updates
- **Multilingual Support** - Supports multiple languages including English, Tamil, and Hindi with example prompts
- **Model Switching** - Seamlessly switch between Sarvam 30B and 105B models for different use cases
- **Abortable Requests** - Cancel ongoing AI responses mid-stream with a single click
- **Smart Token Optimization** - Automatically summarizes conversation history every 20 messages to preserve context while minimizing token usage

### Conversation Management
- **Multiple Conversations** - Create, manage, and switch between unlimited conversations
- **Auto-generated Titles** - Automatically generates descriptive conversation titles based on first message
- **Manual Renaming** - Rename conversations with custom titles for better organization
- **Conversation Deletion** - Permanently delete unwanted conversations with confirmation
- **Persistent Storage** - All conversations saved locally using Zustand persistence middleware

### Message Features
- **Message Editing** - Edit your last sent message and regenerate AI response
- **Message Regeneration** - Regenerate AI responses for any user message with one click
- **Copy to Clipboard** - Copy AI responses to clipboard with visual feedback notifications
- **Markdown Rendering** - Full markdown support with syntax highlighting for code blocks
- **Token Usage Tracking** - Real-time display of prompt, completion, and total token usage

### User Interface & Experience
- **Dark/Light Theme Toggle** - Switch between dark and light modes with system preference detection
- **Responsive Design** - Mobile-friendly interface with collapsible sidebar navigation
- **Auto-scroll** - Automatically scrolls to bottom on new messages
- **Dynamic Textarea** - Auto-resizing input field that grows with content
- **Keyboard Shortcuts** - Enter to send messages, Shift+Enter for new lines
- **Status Indicators** - Visual indicators for "Thinking...", "Responding...", and idle states
- **Welcome Guide** - Interactive welcome screen with example conversation starters in multiple languages

### Error Handling & Reliability
- **Comprehensive Error Handling** - User-friendly error messages with retry capabilities
- **Network Error Recovery** - Graceful handling of connection issues and API failures
- **Request Cancellation** - Properly abort ongoing requests to prevent resource waste
- **Data Validation** - Input validation and sanitization for secure operation

### Developer Experience
- **TypeScript** - Full type safety with comprehensive type definitions
- **ESLint Integration** - Code quality enforcement with Next.js ESLint configuration
- **Modern React** - Built with React 19 and Next.js 16 App Router
- **Component Architecture** - Modular component structure with reusable UI components
- **State Management** - Efficient state management using Zustand with persistence

### Performance & Optimization
- **Streaming Delay Control** - Optimized 50ms delay between chunks for smooth UI updates
- **Memory Efficient** - Smart conversation summarization prevents memory bloat
- **Font Optimization** - Google Fonts (Nunito) with optimized loading
- **CSS Optimization** - Tailwind CSS 4 with efficient styling and dark mode support

### Accessibility & Usability
- **Feedback System** - Thumbs up/down buttons for response quality feedback
- **Alert Notifications** - Non-intrusive notifications for user actions
- **Focus Management** - Proper focus handling for keyboard navigation
- **Color Contrast** - High contrast design for better readability
- **Loading States** - Clear visual feedback during API calls and processing

## Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features and automatic batching
- **Next.js 16.2** - App Router with server components and optimized performance
- **TypeScript 5** - Full type safety and modern JavaScript features

### State Management & Storage
- **Zustand 5** - Lightweight state management with persistence middleware
- **Local Storage** - Client-side persistence for conversation data

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework with dark mode support
- **shadcn/ui** - High-quality, accessible component library
- **Base UI** - Additional UI primitives for enhanced functionality
- **Lucide React** - Beautiful, consistent icon library
- **next-themes** - Theme management with system preference detection

### Markdown & Syntax Highlighting
- **react-markdown** - Markdown rendering with GitHub Flavored Markdown support
- **react-syntax-highlighter** - Code syntax highlighting with Prism.js
- **remark-gfm** - GitHub Flavored Markdown plugin

### Development Tools
- **ESLint 9** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Type checking and compilation

### AI Integration
- **Sarvam AI API** - Streaming chat completions with multiple model support
- **Custom API Routes** - Dedicated Next.js API routes for chat, summarization, and title generation

## API Architecture

### Chat API (`/api/chat`)
- Handles streaming chat completions
- Supports model selection (30B/105B)
- Implements proper error handling and response streaming

### Summarization API (`/api/summarize`)
- Generates conversation summaries for token optimization
- Uses structured prompts for consistent summarization
- Fallback to original text for short conversations

### Title Generation API (`/api/title`)
- Automatically generates conversation titles
- Analyzes conversation content for descriptive titles
- Handles API errors gracefully with fallbacks

## Project Structure

```
sudeshi/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Streaming chat API
│   │   ├── summarize/route.ts # Conversation summarization
│   │   └── title/route.ts     # Title generation
│   ├── features/chat/
│   │   ├── components/        # Chat UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client services
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Utility functions
│   ├── components/ui/        # Reusable UI components
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main chat interface
├── store/
│   └── chatStore.ts          # Zustand state management
├── hooks/
│   └── use-mobile.ts         # Mobile detection hook
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sudeshi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   SARVAM_API_KEY=your_sarvam_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `SARVAM_API_KEY` - Your Sarvam AI API key (required)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Status
🚧 Work in progress
🚧 Actively building — frequent updates in commits

Total Efforts
[![wakatime](https://wakatime.com/badge/user/7a0302c7-7c32-4ab2-bb19-b45a39437ed8/project/73d5b990-ddb9-45fb-a62e-336bbf634a3b.svg)](https://wakatime.com/badge/user/7a0302c7-7c32-4ab2-bb19-b45a39437ed8/project/73d5b990-ddb9-45fb-a62e-336bbf634a3b)