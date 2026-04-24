import { Check, Pencil, RotateCcw, X } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRender";
import { useState, memo } from "react";

const UserChatBubble = memo(({ message, showEdit=false, onEditSave }: { message: string, showEdit?: boolean, onEditSave: (newMessage: string) => void }) => {
    const [edit, setEdit] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const handleSave = () => {
        onEditSave(editedMessage);
        setEdit(false);
    }
    return (
        <div className="flex justify-end max-w-3xl">
            <div className="flex">
                {/* Reusing the onEditSave function for refresh as well */}
                <button aria-label="Retry Message" className="m-1" onClick={() => onEditSave(message)}><RotateCcw size={16} /></button>
                {showEdit && (
                    <button aria-label="Edit Message" className="m-1" onClick={() => setEdit(true)}><Pencil size={16} /></button>
                )}
                {!edit && (
                    <div className="bg-zinc-300 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 p-2 m-1 rounded-lg max-w-3xl w-contain">
                        <MarkdownRenderer content={message} />
                    </div>
                )}
                {edit && (
                    <div>
                        <textarea value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} className="border p-1 rounded" />
                        <button aria-label="Save Edited Message" onClick={handleSave} className="ml-2 p-1 bg-green-500 text-white rounded"><Check size={16} /></button>
                        <button aria-label="Cancel Edit Message" onClick={() => setEdit(false)} className="ml-2 p-1 bg-red-500 text-white rounded"><X size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
})

UserChatBubble.displayName = "UserChatBubble"

export default UserChatBubble