import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateChatDialog } from "./CreateChatDialog";
import ChatList from "./ChatList";

export function ChatSidebar({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={cn("flex flex-col h-full bg-background border-r", className)}
    >
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Your chats</h3>
        <CreateChatDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          trigger={
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <Plus className="w-4 h-4 text-primary" />
            </Button>
          }
        />
      </div>
      <ChatList />
    </div>
  );
}
