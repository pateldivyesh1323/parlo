import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Circle, Info, Users, MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { getNormalChatDetails } from "@/helpers/Chat";
import { Separator } from "../ui/separator";

export default function ChatHeader() {
  const { selectedChat, onlineUsers } = useChat();
  const { user } = useAuth();

  console.log(selectedChat);

  const isOnline =
    !selectedChat?.isGroupChat &&
    onlineUsers.includes(selectedChat?._id as string);

  const { chatTitle, chatPhotoURL } = getNormalChatDetails(
    selectedChat,
    user as User,
    selectedChat,
  );

  return (
    <div className="px-8 py-4 bg-neutral-200 flex justify-between items-center">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatPhotoURL || ""} />
            <AvatarFallback className="text-secondary-foreground text-lg">
              {selectedChat?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full p-0.5">
              <Circle className="h-2.5 w-2.5" fill="green" stroke="white" />
            </div>
          )}
        </div>
        {chatTitle}
      </div>
      <div className="cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <Info size="20" />
          </PopoverTrigger>
          <PopoverContent className="w-80 mx-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm text-center">
                {selectedChat?.isGroupChat ? (
                  <Users size={14} />
                ) : (
                  <MessageCircle size={14} />
                )}
                <span>
                  {selectedChat?.isGroupChat ? "Group Chat" : "Direct Message"}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={chatPhotoURL || ""} />
                    <AvatarFallback className="text-xs">
                      {chatTitle?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="leading-none font-medium">{chatTitle}</h4>
                </div>
              </div>

              {selectedChat?.isGroupChat && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Participants ({selectedChat?.users?.length || 0})
                        </span>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedChat?.users?.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="relative">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.photoURL || ""} />
                                <AvatarFallback className="text-xs">
                                  {user.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {onlineUsers.includes(user._id) && (
                                <div className="absolute -bottom-0.5 -right-0.5 rounded-full">
                                  <Circle
                                    className="h-2 w-2"
                                    fill="green"
                                    stroke="white"
                                  />
                                </div>
                              )}
                            </div>
                            <span className="text-gray-700">{user.name}</span>
                            {selectedChat?.admin === user._id && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                        )) || (
                          <span className="text-sm text-muted-foreground">
                            No participants
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
