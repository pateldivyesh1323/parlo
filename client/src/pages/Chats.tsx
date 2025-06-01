export default function Chats() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Conversations</h1>

          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary-foreground font-bold text-xl">
                  💬
                </span>
              </div>

              <h2 className="text-xl font-semibold">Welcome to Parlo Chats!</h2>

              <p className="text-muted-foreground max-w-md mx-auto">
                Start your first AI-powered voice translation conversation. This
                is where your chat history will appear.
              </p>

              <div className="pt-4">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium">
                  Start New Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
