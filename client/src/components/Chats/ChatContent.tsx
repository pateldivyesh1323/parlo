import { useChat } from "@/context/ChatContext";
import { getNormalChatDetails } from "@/helpers/Chat";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageBox from "../Message/MessageBox";
import MessageInput from "../Message/MessageInput";

export default function ChatContent() {
  const { selectedChat } = useChat();
  const { user } = useAuth();

  const { chatTitle, chatPhotoURL } = getNormalChatDetails(
    selectedChat,
    user as User,
    selectedChat,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-neutral-200">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatPhotoURL || ""} />
            <AvatarFallback className="text-secondary-foreground text-lg">
              {chatTitle?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {chatTitle}
        </div>
      </div>
      <MessageBox />
      <MessageInput />
    </div>
  );
}
