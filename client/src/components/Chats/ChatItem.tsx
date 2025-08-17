import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getNormalChatDetails } from "@/helpers/Chat";
import { CONTENT_TYPES } from "@/constants";
import { AudioWaveform, Circle } from "lucide-react";
import { useSearchParams } from "react-router";

const ChatItem = ({ chat }: { chat: Chat }) => {
  const { user } = useAuth();
  const { selectedChat, setSelectedChat, onlineUsers } = useChat();

  const [searchParams, setSearchParams] = useSearchParams();

  if (!user) return null;

  const { chatDetails, chatTitle, chatPhotoURL, latestMessage, isSelected } =
    getNormalChatDetails(chat, user, selectedChat);

  const latestMessageContent =
    latestMessage?.originalContent.value &&
    latestMessage?.originalContent.value.length > 20
      ? latestMessage?.originalContent.value.slice(0, 20) + "..."
      : latestMessage?.originalContent.value || "No messages yet";

  const isOnline =
    !chat.isGroupChat && onlineUsers.includes(chatDetails?._id as string);

  const handleSelectChat = () => {
    if (!isSelected) setSelectedChat(chat);
    const params = new URLSearchParams(searchParams);
    params.set("selected_chat", chat._id);
    setSearchParams(params);
  };

  return (
    <div className="border-b border-border last:border-b-0 p-2">
      <div
        className={cn(
          "flex items-center p-2 cursor-pointer transition-colors gap-2 rounded-md relative",
          isSelected && "bg-accent",
        )}
        onClick={handleSelectChat}
      >
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatPhotoURL || ""} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
              {chatTitle?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5">
              <Circle className="h-2.5 w-2.5" fill="green" stroke="white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={cn(
              "text-sm font-semibold text-foreground truncate w-full",
              isSelected && "text-accent-foreground",
            )}
          >
            {chatTitle}
          </div>
          <div className="text-xs text-muted-foreground truncate w-full">
            {CONTENT_TYPES.AUDIO ? (
              <div className="flex items-center">
                <AudioWaveform className="h-3" />
                <div>Audio</div>
              </div>
            ) : (
              latestMessageContent
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
