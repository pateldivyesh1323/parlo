import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { getNormalChatDetails } from "@/helpers/Chat";

const ChatItem = ({ chat }: { chat: Chat }) => {
  const { user } = useAuth();

  const { selectedChat, setSelectedChat } = useChat();

  if (!user) return null;

  const { chatTitle, chatPhotoURL, latestMessageContent, isSelected } =
    getNormalChatDetails(chat, user, selectedChat);

  return (
    <div className="border-b border-border last:border-b-0 p-2">
      <div
        className={cn(
          "flex items-center p-2 cursor-pointer transition-colors gap-2 rounded-md",
          isSelected && "bg-accent",
        )}
        onClick={() => !isSelected && setSelectedChat(chat)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={chatPhotoURL || ""} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
            {chatTitle?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
            {latestMessageContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
