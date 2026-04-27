"use client";
import { useEffect, useState, memo, useMemo } from "react";
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
import { ArrowUpRight, Ellipsis, Moon, Pencil, Plus, Settings, Sun, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import LOGO from "@/app/assets/images/Sudeshi_Chat.png"
import Link from "next/link";
import CustomDialog from "./Dialog";
import SettingsComponent from "./SettingsComponent";
const AppSidebar = memo((): React.ReactNode => {
  const conversationsRaw = useChatStore(s => s.conversations)
  const activeConversationId = useChatStore(s => s.activeConversationId)
  const createConversation = useChatStore(s => s.createConversation)
  const setActiveConversation = useChatStore(s => s.setActiveConversation)
  const renameConversation = useChatStore(s => s.renameConversation)
  const deleteConversation = useChatStore(s => s.deleteConversation)

  const isStreaming = useChatStore(s => s.status === "streaming")

  const conversations = useMemo(() => {
    return conversationsRaw.map(c => ({
      id: c.id,
      title: c.title,
      messagesLength: c.messages.length
    }))
  }, [conversationsRaw])

  const { theme, setTheme } = useTheme();
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [editDialogId, setEditDialogId] = useState<string | null>(null);
  const [newName, setNewName] = useState("")

  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if(!mounted) return null

  const createNewConversation = () => {
    const title = "New Chat " + Date.now().toString();
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if(currentConv && !currentConv.messagesLength) {
      setActiveConversation(currentConv.id);
      return;
    }
    createConversation(title);
  }

  const handleDelete = (id: string) => {
    if (isStreaming) return;
    deleteConversation(id);
    setDeleteDialogId(null);
  };

  const handleEdit = (id: string) => {
    if(isStreaming) return;
    if(newName.trim()) {
      renameConversation(id, newName.trim());
      setEditDialogId(null);
      setNewName("");
    }
  };
  return (
    // <div className="bg-gradient-to-br  from-orange-400 via-white to-green-700 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <Sidebar collapsible="icon" className="bg-white/10 backdrop-blur-lg dark:bg-transparent dark:backdrop-blur-none border-zinc-300">
        <SidebarHeader>
          <SidebarContent>
            <SidebarGroup title="Welcome to Sudeshi" >
            <SidebarGroupLabel className="flex items-center justify-center mt-2">
              <div className="m-2 flex flex-col items-center">
                <Image className="m-1 dark:invert" src={LOGO} alt="Sudeshi Logo" width={30} height={30} />
                <p className="text-lg font-extrabold">Sudeshi</p>
              </div>
              {/* <h2 className="text-2xl font-bold">Sudeshi</h2> */}
            </SidebarGroupLabel>
            <SidebarGroupLabel className="text-sm text-zinc-600 text-center mt-2">
              <span className="flex items-center justify-center w-full">Your personal AI assistant</span>
            </SidebarGroupLabel>
            <SidebarGroupLabel className="text-sm text-center">
              <div className="flex items-center justify-center w-full">
                Powered by
                <Link className="border-b border-dashed mx-2 flex items-center" href="https://www.sarvam.ai/">
                  Sarvam AI <ArrowUpRight size={16}/>
                </Link>
              </div>
            </SidebarGroupLabel>
          </SidebarGroup>
          </SidebarContent>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="New Chat" >
            <SidebarMenu className={isStreaming? "pointer-events-none opacity-70" : ""}>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createNewConversation()} className="bg-zinc-700 rounded text-white h-10"><Plus />New Conversation</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup title="Conversations">
            <SidebarMenu className={isStreaming? "pointer-events-none opacity-70": ""}>
            {conversations.map(conv => (
              <SidebarMenuItem key={conv.id}>
                <SidebarMenuButton title={conv.title} onClick={() => setActiveConversation(conv.id)} className={`p-2 m-1 cursor-pointer rounded-lg ${conv.id === activeConversationId ? 'bg-zinc-700 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                  <SidebarGroupLabel className="text-sm">{conv.title.length > 18 ? conv.title.slice(0, 17) + "..." : conv.title}</SidebarGroupLabel>
                  <div className="flex-1 justify-end flex gap-2 text-transparent hover:text-zinc-900 hover:dark:text-white">
                    <DropdownMenu>
                      <DropdownMenuTrigger nativeButton={false} render={<div onClick={(e) => e.stopPropagation()} role="presentation"/>}><Ellipsis className={`${conv.id === activeConversationId ? 'text-white' : 'text-zinc-950 dark:text-white'}`}/></DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-zinc-900">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="hover:bg-yellow-300" onClick={(e) => {
                            setNewName(conv.title);
                            setEditDialogId(conv.id);
                            e.stopPropagation();
                          }}><Pencil/> Rename</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-red-500" onClick={(e) => {
                            setDeleteDialogId(conv.id);
                            e.stopPropagation();
                          }}><Trash/> Delete Chat</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            <AlertDialogContent className="bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your chat.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteDialogId && handleDelete(deleteDialogId)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
        {editDialogId ? (
          <Dialog
            open={Boolean(editDialogId)}
            onOpenChange={(open) => {
              if (!open) {
                setEditDialogId(null);
                setNewName("");
              }
            }}
          >
            <DialogContent className="bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
              <DialogHeader>
                <DialogTitle>Rename Chat</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <label htmlFor="chat-title" className="text-sm font-medium">New Chat Title</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  id="chat-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="Enter new chat title"
                />
              </div>
              <DialogFooter>
                <DialogClose render={
                  <button aria-label="Close Dialog" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                } />
                <button
                  aria-label="Rename Chat"
                  onClick={() => editDialogId && handleEdit(editDialogId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  Rename
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
        <SidebarFooter>
          <div className="flex gap-2">
            <button aria-label="Theme toggle" className="border p-1 border-zinc-900 dark:border-zinc-600 rounded" onClick={() => setTheme(theme === "dark"?"light":"dark")}>{theme === "dark" ? <Sun /> : <Moon />} </button>
            <button aria-label="Theme toggle" className="border p-1 border-zinc-900 dark:border-zinc-600 rounded" onClick={() => setShowSettings(true)}><Settings /></button>
            {/* TODO: Yet to write the dialog open close logic */}
            <CustomDialog title="Settings" shouldOpen={showSettings} onDialogOpenChange={(o)=>setShowSettings(o)}>
                <SettingsComponent />
            </CustomDialog>
          </div>
        </SidebarFooter>
      </Sidebar>
    // </div>
  )
})
AppSidebar.displayName="App Side bar"
export default AppSidebar