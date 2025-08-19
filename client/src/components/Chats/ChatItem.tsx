import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getNormalChatDetails } from "@/helpers/Chat";
import { CONTENT_TYPES } from "@/constants";
import { AudioWaveform, Circle } from "lucide-react";
import { useSearchParams } from "react-router";
import { getLatestMessageDate } from "@/lib/helpers";

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
    <div
      className={cn(
        "flex items-center p-3 cursor-pointer transition-colors gap-3 border-b border-border last:border-b-0 relative",
        isSelected && "bg-accent",
      )}
      onClick={handleSelectChat}
    >
      <div className="relative flex-shrink-0">
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
      <div className="flex flex-col min-w-0 flex-1">
        <div
          className={cn(
            "text-sm font-semibold text-foreground truncate",
            isSelected && "text-accent-foreground",
          )}
        >
          {chatTitle}
        </div>
        <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
          <div className="truncate flex-1 mr-2">
            {latestMessage?.originalContent.contentType ===
              CONTENT_TYPES.AUDIO ||
            latestMessage?.originalContent.contentType ===
              CONTENT_TYPES.AUDIO_MP3 ? (
              <div className="flex items-center gap-1">
                <AudioWaveform className="h-3 w-3 flex-shrink-0" />
                <span>Audio</span>
              </div>
            ) : (
              latestMessageContent
            )}
          </div>
          <div className="flex-shrink-0 text-muted-foreground">
            {latestMessage?.createdAt && getLatestMessageDate(latestMessage)()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
