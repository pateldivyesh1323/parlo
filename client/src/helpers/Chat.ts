const getNormalChatDetails = (
  chat: Chat | null,
  user: User,
  selectedChat: Chat | null,
) => {
  const chatDetails = chat?.isGroupChat
    ? chat
    : chat?.users.find((participant) => participant.email !== user.email);

  const chatTitle =
    chatDetails && "email" in chatDetails
      ? chatDetails.name || chatDetails.email
      : chatDetails?.name;
  const chatPhotoURL = chatDetails?.photoURL;
  const latestMessage = chat?.latestMessage;

  const isSelected = selectedChat?._id === chat?._id;

  return {
    chatTitle,
    chatPhotoURL,
    isSelected,
    latestMessage,
  };
};

export { getNormalChatDetails };
