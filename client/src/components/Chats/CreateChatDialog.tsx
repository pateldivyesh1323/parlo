import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateChat } from "@/hooks/useChat";

interface CreateChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateChatDialog({
  isOpen,
  onOpenChange,
  trigger,
}: CreateChatDialogProps) {
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();

  const [newChatName, setNewChatName] = useState("");
  const [userEmails, setUserEmails] = useState<string[]>([""]);
  const [isGroupChat, setIsGroupChat] = useState(false);

  const addEmailField = () => {
    setUserEmails([...userEmails, ""]);
  };

  const removeEmailField = (index: number) => {
    if (userEmails.length > 1) {
      setUserEmails(userEmails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, email: string) => {
    const updatedEmails = [...userEmails];
    updatedEmails[index] = email;
    setUserEmails(updatedEmails);
  };

  const handleCreateChat = async () => {
    const validEmails = userEmails.filter(
      (email) => email.trim() && email.includes("@"),
    );

    const isValidSubmission =
      validEmails.length > 0 && (isGroupChat ? newChatName.trim() : true);

    if (isValidSubmission) {
      createChat({
        userEmails: validEmails,
        name: isGroupChat ? newChatName.trim() : undefined,
      });
      setNewChatName("");
      setUserEmails([""]);
      setIsGroupChat(false);
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateChat();
    }
  };

  const handleGroupChatChange = (isChecked: boolean) => {
    setIsGroupChat(isChecked);
    if (!isChecked) {
      setUserEmails([userEmails[0] || ""]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="group-mode" className="text-sm font-medium">
              Group Chat
            </Label>
            <Switch
              id="group-mode"
              checked={isGroupChat}
              onCheckedChange={handleGroupChatChange}
            />
          </div>

          {isGroupChat && (
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="col-span-3"
                placeholder="Enter group chat name..."
                autoFocus={true}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label className="text-sm font-medium">
              {isGroupChat ? "User Emails" : "User Email"}
            </Label>
            {userEmails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="Enter email address..."
                  type="email"
                  className="flex-1"
                />
                {isGroupChat && userEmails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {isGroupChat && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmailField}
                className="self-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Email
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={
              !userEmails.some(
                (email) => email.trim() && email.includes("@"),
              ) ||
              (isGroupChat && !newChatName.trim())
            }
          >
            {isCreatingChat ? "Creating..." : "Create Chat"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
