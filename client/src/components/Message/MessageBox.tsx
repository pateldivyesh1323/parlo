import { useChat } from "@/context/ChatContext";
import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageBox() {
  const { messages, typingUsers, selectedChat } = useChat();

  const filteredTypingUsers = typingUsers.find(
    (tu) => tu.chatId === selectedChat?._id,
  )?.users;

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
      {filteredTypingUsers && filteredTypingUsers.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-sm font-medium">
              {filteredTypingUsers.map((user, index) => {
                const userName =
                  selectedChat?.users.find((u) => u._id === user)?.name ||
                  selectedChat?.users.find((u) => u._id === user)?.email;
                return (
                  <span key={user}>
                    {userName}
                    {index < filteredTypingUsers.length - 1 && ", "}
                  </span>
                );
              })}
              {filteredTypingUsers.length === 1 ? " is typing" : " are typing"}
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
