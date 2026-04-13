export type MessageStatus = "pending" | "completed" | "error";
export type Role = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status: MessageStatus;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  summary?: string;
  summaryIndex?: number;
};

// Commenting for later use when we implement conversation management
// export type Conversation = {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: number;
// };