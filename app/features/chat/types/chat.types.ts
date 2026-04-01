export type MessageStatus = "pending" | "sent" | "received";
export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status: MessageStatus;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};