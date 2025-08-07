import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateChatDialog } from "./CreateChatDialog";
import ChatList from "./ChatList";
import { QRScannerForCreateChat } from "../Misc/QRScannerForCreateChat";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useCreateChatFromQR } from "@/hooks/useChat";

export function ChatSidebar({ className }: { className?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: createChatFromQR } = useCreateChatFromQR();

  const handleScan = (result: IDetectedBarcode[]) => {
    const data = JSON.parse(result[0].rawValue);
    if (!data || data.type !== "user") {
      toast.error("Invalid QR code");
      return;
    }
    createChatFromQR({ participantId: data.id });
  };

  return (
    <div
      className={cn("flex flex-col h-full bg-background border-r", className)}
    >
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Your chats</h3>
        <div className="flex items-center gap-2">
          <QRScannerForCreateChat onScan={handleScan} />
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
