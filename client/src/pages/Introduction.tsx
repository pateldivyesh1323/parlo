import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Introduction() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">Parlo</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Break language barriers with AI-powered voice translation. Chat with
            anyone, anywhere, in any language with real-time translation of text
            and voice messages.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              Real-time Chat Translation
            </h3>
            <p className="text-muted-foreground">
              Send messages in your language and recipients receive them in
              theirs. Seamless communication across language barriers.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-chart-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              Voice Message Translation
            </h3>
            <p className="text-muted-foreground">
              Record voice messages that are automatically translated and can be
              played back in the recipient's preferred language.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-chart-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              AI-Powered Intelligence
            </h3>
            <p className="text-muted-foreground">
              Advanced AI ensures accurate translations with context awareness,
              preserving meaning and tone across languages.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-12 shadow-xl border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with people worldwide through our intelligent translation
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Create your account and set your preferred language
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chart-2">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">
                Start Chatting
              </h4>
              <p className="text-sm text-muted-foreground">
                Send text or voice messages in your native language
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chart-3">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">
                AI Translation
              </h4>
              <p className="text-sm text-muted-foreground">
                Our AI instantly translates your messages
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chart-4">4</span>
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Recipients receive messages in their preferred language
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Break Language Barriers?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users connecting across cultures and languages
          </p>
          {!user && (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg">
              Start Your Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
