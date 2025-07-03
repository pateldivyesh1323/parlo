import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const senderBox = (message: Message) => {
  return (
    <div className="flex flex-col gap-2 text-muted-foreground items-end">
      <div className="relative bg-secondary-foreground text-secondary rounded-lg rounded-tr-none p-2 max-w-[80%] flex items-end gap-4">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[8px] border-l-secondary-foreground border-b-[8px] border-b-transparent translate-x-full"></div>

        <p className="text-sm whitespace-pre-wrap">
          {message.originalContent.value}
        </p>
        <span className="text-tiny">
          {new Date(message?.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

const receiverBox = (message: Message) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={message.sender.photoURL || ""} />
            <AvatarFallback className="text-secondary-foreground text-xs">
              {message.sender.name?.charAt(0)?.toUpperCase() ||
                message.sender.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {message.sender.name || message.sender.email}
        </span>
      </div>

      <div className="relative bg-muted rounded-lg rounded-tl-none p-2 max-w-[80%] flex items-end gap-4">
        <div className="absolute top-0 left-0 w-0 h-0 border-r-[8px] border-r-muted border-b-[8px] border-b-transparent -translate-x-full"></div>
        <p className="text-sm whitespace-pre-wrap">
          {message.originalContent.value}
        </p>
        <span className="text-tiny text-muted-foreground">
          {new Date(message?.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default function Message({ message }: { message: Message }) {
  const { user } = useAuth();

  return (
    <div key={message._id} className="flex flex-col space-y-1">
      {message.sender._id === user?._id
        ? senderBox(message)
        : receiverBox(message)}
    </div>
  );
}
