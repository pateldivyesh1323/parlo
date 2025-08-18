import { AuroraText } from "@/components/magicui/aurora-text";
import { useAuth } from "../context/AuthContext";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useNavigate } from "react-router";
import FeatureSectionWithHoverEffects from "@/components/ui/feature-section-with-hover-effects";
import {
  BrainIcon,
  MessageCircleIcon,
  MicIcon,
  CpuIcon,
  Github,
  UserPlus,
  MessageCircle,
  Zap,
  Users,
} from "lucide-react";
import { Footer } from "@/components/Footer/footer";
import { Logo } from "@/components/Common";
import StepCard from "@/components/ui/steps";

const features = [
  {
    title: "Real-time Chat Translation",
    description:
      "Send messages in your language and recipients receive them in theirs. Seamless communication across language barriers.",
    icon: <MessageCircleIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Voice Message Translation",
    description:
      "Record voice messages that are automatically translated and can be played back in the recipient's preferred language.",
    icon: <MicIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Message Generation",
    description:
      "Generate messages in the recipient's preferred language using AI-powered language models.",
    icon: <CpuIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "AI-Powered Intelligence",
    description:
      "Advanced AI ensures accurate translations with context awareness, preserving meaning and tone across languages.",
    icon: <BrainIcon className="w-6 h-6 text-primary" />,
  },
];

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description:
      "Create your account and set your preferred language with just a few clicks",
    icon: <UserPlus className="w-full h-full" />,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
  {
    number: "2",
    title: "Start Chatting",
    description:
      "Send text or voice messages in your native language naturally and get them translated",
    icon: <MessageCircle className="w-full h-full" />,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
  {
    number: "3",
    title: "AI Translation",
    description:
      "Our advanced AI instantly translates your messages with perfect accuracy",
    icon: <Zap className="w-full h-full" />,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
  {
    number: "4",
    title: "Connect",
    description:
      "Recipients receive messages in their preferred language seamlessly",
    icon: <Users className="w-full h-full" />,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
];

export default function Introduction() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-br from-background to-muted min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-foreground mb-6">
            <AuroraText>Welcome to Parlo</AuroraText>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Break language barriers with AI-powered voice translation. Chat with
            anyone, anywhere, in any language with real-time translation of text
            and voice messages.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <InteractiveHoverButton
                onClick={() => {
                  navigate("/signin");
                }}
              >
                <span>✨ Get Started</span>
              </InteractiveHoverButton>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 my-24">
          <div className="text-center text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Features
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureSectionWithHoverEffects
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 my-24">
          <div className="text-center text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How it works
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-[85%] mx-auto">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Join thousands of users already connecting globally
          </div>
        </div>

        <Footer
          logo={<Logo />}
          brandName=""
          socialLinks={[
            {
              icon: <Github />,
              href: "https://github.com/pateldivyesh1323/parlo",
              label: "GitHub",
            },
          ]}
          mainLinks={[]}
          legalLinks={[]}
          copyright={{ text: "© 2025 Parlo. All rights reserved." }}
        />
      </div>
    </div>
  );
}
