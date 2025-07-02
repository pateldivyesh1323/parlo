import { useChat } from "@/context/ChatContext";
import Message from "./Message";

export default function MessageBox() {
  const { messages } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
}
