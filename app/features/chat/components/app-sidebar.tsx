"use client";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { Ellipsis, Moon, Pencil, Plus, Sun, Trash } from "lucide-react";
import { useTheme } from "next-themes";

export function AppSidebar(): React.ReactNode {
  const {conversations, activeConversationId, createConversation, setActiveConversation, status, renameConversation, deleteConversation} = useChatStore();
  const { theme, setTheme } = useTheme();
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if(!mounted) return null

  const createNewConversation = () => {
    const title = "New Chat " + Date.now().toString();
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if(currentConv && !currentConv.messages.length) {
      setActiveConversation(currentConv.id);
      return;
    }
    createConversation(title);
  }

  const handleDelete = (id: string) => {
    if (status === "streaming") return;
    deleteConversation(id);
    setDeleteDialogId(null);
  };

  const handleEdit = (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    if(status === "streaming") return;
    e.stopPropagation()
    const newTitle = window.prompt("Enter new title for the conversation");
    if(newTitle) {
      // Implement rename logic here
      renameConversation(id, newTitle);
    }
  };
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
              <SidebarMenuButton disabled={status === "streaming"} onClick={() => createNewConversation()} className="bg-zinc-900 rounded text-white h-10"><Plus />New Conversation</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="Conversations">
          <SidebarMenu>
          {conversations.map(conv => (
            <SidebarMenuItem key={conv.id}>
              <SidebarMenuButton title={conv.title} disabled={status === "streaming"} onClick={() => setActiveConversation(conv.id)} className={`p-2 m-1 cursor-pointer rounded-lg ${conv.id === activeConversationId ? 'bg-zinc-900 text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                <SidebarGroupLabel className="text-sm">{conv.title.length > 18 ? conv.title.slice(0, 18) + "..." : conv.title}</SidebarGroupLabel>
                <div className="flex-1 justify-end flex gap-2 text-transparent hover:text-zinc-900 hover:dark:text-white">
                  <DropdownMenu>
                    <DropdownMenuTrigger nativeButton={false} render={<div role="presentation"/>}><Ellipsis className="text-white"/></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-zinc-900">
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="hover:bg-yellow-300" onClick={(e) => handleEdit(e, conv.id)}><Pencil/> Rename</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-red-500" onClick={() => setDeleteDialogId(conv.id)}><Trash/> Delete Chat</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <span onClick={(e) => handleEdit(e, conv.id)} className="cursor-pointer rounded border border-transparent hover:border-white hover:bg-white hover:dark:bg-zinc-950 p-1"><Pencil /></span>
                  <span onClick={(e) => handleDelete(e, conv.id)} className="cursor-pointer rounded border border-transparent hover:border-white hover:bg-white hover:dark:bg-zinc-950 p-1"><Trash /></span> */}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {deleteDialogId ? (
        <AlertDialog
          open={Boolean(deleteDialogId)}
          onOpenChange={(open) => {
            if (!open) setDeleteDialogId(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your chat.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteDialogId && handleDelete(deleteDialogId)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      <SidebarFooter>
        <div>
          <button className="border p-1 border-zinc-900 dark:border-zinc-600 rounded" onClick={() => setTheme(theme === "dark"?"light":"dark")}>{theme === "dark" ? <Sun /> : <Moon />} </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}