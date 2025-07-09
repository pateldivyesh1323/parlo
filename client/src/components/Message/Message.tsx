import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Languages } from "lucide-react";
import { useState } from "react";

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

const receiverBox = (
  message: Message,
  userId: string,
  showTranslated: boolean,
  setShowTranslated: (show: boolean) => void,
) => {
  const userTranslation = message.translatedContents?.find(
    (tc) => tc.user.toString() === userId,
  );

  const displayContent =
    showTranslated && userTranslation
      ? userTranslation.content.value
      : message.originalContent.value;

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

      <div className="relative bg-muted rounded-lg rounded-tl-none p-2 max-w-[80%]">
        <div className="absolute top-0 left-0 w-0 h-0 border-r-[8px] border-r-muted border-b-[8px] border-b-transparent -translate-x-full"></div>

        <div className="flex items-end gap-4">
          <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
          <div className="flex items-center gap-2">
            <span className="text-tiny text-muted-foreground">
              {new Date(message?.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {userTranslation && (
              <button
                onClick={() => setShowTranslated(!showTranslated)}
                className="inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted/50 h-6 w-6 p-1"
                title={showTranslated ? "Show Original" : "Translate"}
              >
                <Languages
                  className={`h-4 w-4 transition-colors ${
                    showTranslated ? "text-blue-500" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Message({ message }: { message: Message }) {
  const { user } = useAuth();
  const [showTranslated, setShowTranslated] = useState(false);

  return (
    <div key={message._id} className="flex flex-col space-y-1">
      {message.sender._id === user?._id
        ? senderBox(message)
        : receiverBox(
            message,
            user?._id || "",
            showTranslated,
            setShowTranslated,
          )}
    </div>
  );
}
