import { MessageSquare } from "lucide-react";
import ChatItem from "./ChatItem";
import { useChat } from "@/context/ChatContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

const ChatList = () => {
  const { chats, setSelectedChat, selectedChat } = useChat();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChat) {
      setSelectedChat(
        chats.find((chat) => chat._id === searchParams.get("selected_chat")) ||
          chats[0],
      );
    }
  }, [chats, setSelectedChat, selectedChat, searchParams]);

  return (
    <div className="flex-1 overflow-y-auto">
      {chats?.length === 0 ? (
        <div className="p-2 space-y-1">
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats to show</p>
            <p className="text-xs">Create a new one</p>
          </div>
        </div>
      ) : (
        <div>
          {chats?.map((chat) => (
            <ChatItem key={chat._id} chat={chat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
