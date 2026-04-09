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
import { MessageSquare, Moon, Plus, Sun } from "lucide-react";
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
              <SidebarMenuButton onClick={() => createNewConversation()} className="bg-zinc-900 rounded text-white h-10"><Plus />New Conversation</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="Conversations">
          <SidebarMenu>
          {conversations.map(conv => (
            <SidebarMenuItem key={conv.id}>
              <SidebarMenuButton onClick={() => setActiveConversation(conv.id)} className={`p-2 m-1 cursor-pointer rounded-lg ${conv.id === activeConversationId ? 'bg-zinc-900 text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                <MessageSquare />{conv.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>
          <button className="border px-2 border-zinc-900 dark:border-zinc-600 rounded h-10" onClick={() => setTheme(theme === "dark"?"light":"dark")}>{theme === "dark" ? <Sun />: <Moon />} </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}