import { ChatSidebar, ChatProvider, useChat } from "@/components/Chats";
import ChatContent from "@/components/Chats/ChatContent";
import NoChatSelectedHolder from "@/components/Chats/NoChatSelectedHolder";

function ChatsContent() {
  const { selectedChat } = useChat();

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar className="w-80" />
      <div className="container mx-auto">
        {selectedChat ? <ChatContent /> : <NoChatSelectedHolder />}
      </div>
    </div>
  );
}

export default function Chats() {
  return (
    <ChatProvider>
      <ChatsContent />
    </ChatProvider>
  );
}
