import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, selectedChat, socketConnected } = useChat();

  const handleSend = () => {
    if (!message.trim() || !selectedChat || !socketConnected) return;

    sendMessage(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !selectedChat || !socketConnected || !message.trim();

  return (
    <div className="flex gap-2 p-4 border-t bg-neutral-200">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={
          !selectedChat
            ? "Select a chat to start messaging"
            : !socketConnected
            ? "Connecting..."
            : "Type a message..."
        }
        disabled={!selectedChat || !socketConnected}
        className="flex-1 bg-white"
      />
      <Button onClick={handleSend} disabled={isDisabled} size="default">
        Send
      </Button>
    </div>
  );
}
