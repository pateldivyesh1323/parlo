const getNormalChatDetails = (
  chat: Chat | null,
  user: User,
  selectedChat: Chat | null,
) => {
  console.log("Chat", chat);

  const chatDetails = chat?.isGroupChat
    ? chat
    : chat?.users.find((participant) => participant.email !== user.email);

  const chatTitle =
    chatDetails && "email" in chatDetails
      ? chatDetails.name || chatDetails.email
      : chatDetails?.name;
  const chatPhotoURL = chatDetails?.photoURL;
  const latestMessage = chat?.latestMessage;

  const latestMessageContent =
    latestMessage?.originalContent.value &&
    latestMessage?.originalContent.value.length > 20
      ? latestMessage?.originalContent.value.slice(0, 20) + "..."
      : latestMessage?.originalContent.value || "No messages yet";

  const isSelected = selectedChat?._id === chat?._id;

  return {
    chatTitle,
    chatPhotoURL,
    latestMessageContent,
    isSelected,
  };
};

export { getNormalChatDetails };
