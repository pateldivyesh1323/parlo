import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateChatDialog } from "./CreateChatDialog";
import ChatList from "./ChatList";
import { QRScannerForCreateChat } from "../Misc/QRScannerForCreateChat";

export function ChatSidebar({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={cn("flex flex-col h-full bg-background border-r", className)}
    >
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Your chats</h3>
        <div className="flex items-center gap-2">
          <QRScannerForCreateChat />
          <CreateChatDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <Button size="sm" variant="ghost">
                <Plus />
              </Button>
            }
          />
        </div>
      </div>
      <ChatList />
    </div>
  );
}
