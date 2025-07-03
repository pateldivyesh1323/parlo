import { useChat } from "@/context/ChatContext";
import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageBox() {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
