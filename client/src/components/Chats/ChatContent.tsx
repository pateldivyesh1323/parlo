import { useChat } from "@/context/ChatContext";
import { getNormalChatDetails } from "@/helpers/Chat";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageBox from "../Message/MessageBox";
import MessageInput from "../Message/MessageInput";
import { Circle } from "lucide-react";

export default function ChatContent() {
  const { selectedChat, onlineUsers } = useChat();
  const { user } = useAuth();

  const { chatTitle, chatPhotoURL, chatDetails } = getNormalChatDetails(
    selectedChat,
    user as User,
    selectedChat,
  );

  const isOnline =
    !selectedChat?.isGroupChat &&
    onlineUsers.includes(chatDetails?._id as string);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-neutral-200">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chatPhotoURL || ""} />
              <AvatarFallback className="text-secondary-foreground text-lg">
                {chatTitle?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5">
                <Circle className="h-2.5 w-2.5" fill="green" stroke="white" />
              </div>
            )}
          </div>
          {chatTitle}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <MessageBox />
      </div>
      <MessageInput />
    </div>
  );
}
