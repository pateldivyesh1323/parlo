import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateChatDialog } from "./CreateChatDialog";

export function ChatSidebar({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 border-r", className)}>
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Your chats</h3>
        <CreateChatDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          trigger={
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <Plus className="w-4 h-4 text-red-500" />
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats to show</p>
            <p className="text-xs">Create a new one</p>
          </div>
        </div>
      </div>
    </div>
  );
}
