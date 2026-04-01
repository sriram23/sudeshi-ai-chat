import { Message, Role, MessageStatus } from "../types/chat.types";
import { v4 as uuidv4 } from "uuid";

export const createMessage = (role: Role, content: string, status: MessageStatus = "pending"): Message => {
  return {
    id: uuidv4(),
    role,
    content,
    createdAt: Date.now(),
    status,
  };
}