"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useChatStore } from "@/store/chatStore";
import { MessageSquare, Plus } from "lucide-react";
import { useTheme } from "next-themes";

export function AppSidebar(): React.ReactNode {
  const {conversations, activeConversationId, createConversation, setActiveConversation} = useChatStore();
  const { theme, setTheme } = useTheme();
  const createNewConversation = () => {
    const title = "New Chat " + Date.now().toString();
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if(currentConv && !currentConv.messages.length) {
      setActiveConversation(currentConv.id);
      return;
    }
    createConversation(title);
  }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup title="Welcome to Sudeshi" >
          <SidebarGroupLabel className="text-3xl">Sudeshi</SidebarGroupLabel>
          <SidebarGroupLabel className="text-sm text-gray-500">Your personal AI assistant</SidebarGroupLabel>
          <SidebarGroupLabel className="text-sm">Powered by Sarvam AI</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup title="New Chat" >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => createNewConversation()} className="bg-zinc-800 rounded text-white h-10"><Plus />New Conversation</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="Conversations">
          <SidebarMenu>
          {conversations.map(conv => (
            <SidebarMenuItem key={conv.id}>
              <SidebarMenuButton onClick={() => setActiveConversation(conv.id)} className={`p-2 m-1 cursor-pointer rounded-lg ${conv.id === activeConversationId ? 'bg-zinc-700 text-white' : 'bg-gray-200'}`}>
                <MessageSquare />{conv.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <button onClick={() => setTheme(theme === "dark"?"light":"dark")}>toggle theme</button>
      </SidebarFooter>
    </Sidebar>
  )
}