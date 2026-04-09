# Sudeshi AI Chat

AI-powered chat application with real-time streaming, built using Sarvam AI.

## Features
- **Real-time Streaming Responses** - Stream responses from Sarvam AI models with live updates
- **Conversation Management** - Create, rename, and delete multiple conversations
- **Persistent Storage** - All conversations saved locally using Zustand with persistence
- **Model Switching** - Switch between Sarvam 30B and 105B models
- **Abortable Requests** - Cancel ongoing requests mid-stream
- **Auto-conversation Titles** - Automatically generate titles for conversations
- **Smart token usage optimization** - For every 20 messages in a conversation, a summary of them generated and updated. This summary is stored in the state. In the API calls, the summary, along with the last 20 messages are sent, preserving the context of the conversation without sending all the messages. This incredibly saves the token usage.
- **Markdown Rendering** - Full markdown support with syntax highlighting for code blocks
- **Token Usage Tracking** - View prompt, completion, and total token usage
- **Dark/Light Theme Support** - Toggle between dark and light modes
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Responsive Sidebar** - Mobile-friendly navigation with collapsible sidebar

## Tech Stack
- **Frontend**: React 19, Next.js 16.2 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with persistence middleware
- **Styling**: Tailwind CSS 4, clsx, tailwind-merge
- **UI Components**: shadcn/ui, Base UI, Lucide React icons
- **Markdown**: react-markdown with remark-gfm, react-syntax-highlighter
- **Theme Management**: next-themes
- **Utilities**: uuid, class-variance-authority (CVA)
- **AI API**: Sarvam AI
- **Development**: ESLint, TypeScript, PostCSS

## Status
🚧 Work in progress
🚧 Actively building — frequent updates in commits

Total Efforts
[![wakatime](https://wakatime.com/badge/user/7a0302c7-7c32-4ab2-bb19-b45a39437ed8/project/73d5b990-ddb9-45fb-a62e-336bbf634a3b.svg)](https://wakatime.com/badge/user/7a0302c7-7c32-4ab2-bb19-b45a39437ed8/project/73d5b990-ddb9-45fb-a62e-336bbf634a3b)