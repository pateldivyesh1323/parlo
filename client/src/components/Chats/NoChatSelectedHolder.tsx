import Logo from "../Common/Logo";

export default function NoChatSelectedHolder() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center ">
            <Logo showText={false} size="lg" />
          </div>

          <h2 className="text-xl font-semibold">Welcome to Parlo Chats!</h2>

          <p className="text-muted-foreground max-w-md mx-auto">
            Start your AI-powered voice and text translation conversation.
          </p>

          <div className="pt-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium">
              Start New Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
