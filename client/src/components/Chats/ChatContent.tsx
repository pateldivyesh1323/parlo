import MessageBox from "../Message/MessageBox";
import MessageInput from "../Message/MessageInput";
import ChatHeader from "./ChatHeader";

export default function ChatContent() {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <div className="flex-1 min-h-0">
        <MessageBox />
      </div>
      <MessageInput />
    </div>
  );
}
