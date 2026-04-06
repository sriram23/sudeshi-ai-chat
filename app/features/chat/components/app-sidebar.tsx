"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useChatStore } from "@/store/chatStore";

export function AppSidebar(): React.ReactNode {
  const {conversations, activeConversationId, createConversation, setActiveConversation} = useChatStore();
  const createNewConversation = () => {
    const title = "New Chat " + Date.now().toString();
    createConversation(title);
  }
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup title="Welcome to Sudeshi" >
          <h1 className="text-3xl">Sudeshi</h1>
          <p className="text-sm text-gray-500">Your personal AI assistant</p>
          <p className="text-sm">Powered by Sarvam AI</p>
        </SidebarGroup>
        <SidebarGroup title="New Chat" >
          <button onClick={() => createNewConversation()} className="bg-zinc-800 rounded text-white h-10">New Conversation</button>
        </SidebarGroup>
        <SidebarGroup title="Conversations">
          {conversations.map(conv => (
            <div onClick={() => setActiveConversation(conv.id)} key={conv.id} className={`p-2 m-1 cursor-pointer rounded-lg ${conv.id === activeConversationId ? 'bg-zinc-700 text-white' : 'bg-gray-200'}`}>
              {conv.title}
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}