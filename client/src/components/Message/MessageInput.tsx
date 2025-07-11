import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import MicrophoneInput from "./MicrophoneInput";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [activeInput, setActiveInput] = useState<"text" | "voice" | "">("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    sendMessage,
    selectedChat,
    socketConnected,
    startTyping,
    stopTyping,
  } = useChat();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!message.trim() || !selectedChat || !socketConnected) return;

    sendMessage(message.trim());
    setMessage("");
    stopTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // Max height in pixels (about 5-6 lines)
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const debouncedStopTyping = useCallback(() => {
    stopTyping();
  }, [stopTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    startTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      debouncedStopTyping();
    }, 2000);
  };

  const handleRecordingStart = () => {
    setActiveInput("voice");
  };

  const handleRecordingClear = () => {
    setActiveInput("");
  };

  useEffect(() => {
    if (message.length > 0) {
      setActiveInput("text");
    } else if (activeInput !== "voice") {
      setActiveInput("");
    }
  }, [message, activeInput]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const isDisabled = !selectedChat || !socketConnected || !message.trim();

  return (
    <div className="flex gap-2 p-4 border-t bg-neutral-200">
      {(activeInput === "text" || activeInput === "") && (
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={
              !selectedChat
                ? "Select a chat to start messaging"
                : !socketConnected
                ? "Connecting..."
                : "Type a message..."
            }
            disabled={!selectedChat || !socketConnected}
            rows={1}
            spellCheck={true}
            autoCapitalize="sentences"
            autoCorrect="on"
            inputMode="text"
            enterKeyHint="send"
            className={cn(
              "min-h-[40px] max-h-[120px] resize-none bg-white transition-all duration-200",
              "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
              "focus-visible:ring-2 focus-visible:ring-blue-500",
            )}
            style={{
              lineHeight: "1.4",
              fontFamily: "inherit",
              overflow: "hidden",
            }}
          />
        </div>
      )}
      {(activeInput === "voice" || activeInput === "") && (
        <MicrophoneInput
          onRecordingStart={handleRecordingStart}
          onClear={handleRecordingClear}
        />
      )}
      <Button onClick={handleSend} disabled={isDisabled} size="default">
        Send
      </Button>
    </div>
  );
}
