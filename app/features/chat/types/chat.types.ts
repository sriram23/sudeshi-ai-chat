export type MessageStatus = "pending" | "completed";
export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status: MessageStatus;
};

// Commenting for later use when we implement conversation management
// export type Conversation = {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: number;
// };