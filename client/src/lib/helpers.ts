const getLatestMessageDate = (latestMessage: Message) => () => {
  const messageDate = new Date(latestMessage.createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return messageDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year:
      messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

export { getLatestMessageDate };
