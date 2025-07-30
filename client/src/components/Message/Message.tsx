import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Languages } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { CONTENT_TYPES } from "@/constants";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AudioPlayer = ({ url }: { url: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setMeta = () => setDuration(audio.duration);
    const setTime = () => setCurrentTime(audio.currentTime);
    const resetPlay = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("timeupdate", setTime);
    audio.addEventListener("ended", resetPlay);

    if (audio.readyState >= 1) setDuration(audio.duration);

    return () => {
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("timeupdate", setTime);
      audio.removeEventListener("ended", resetPlay);
    };
  }, [url]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center gap-1 w-full p-1 rounded-lg">
      <Button
        size="icon"
        variant="ghost"
        onClick={togglePlayPause}
        className="h-8 w-8 rounded-full"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1">
        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={0.1}
          onValueChange={handleSeek}
          className="w-[150px] !bg-gray-400"
          aria-label="Seek audio position"
        />
      </div>
      <div className="flex items-center gap-0.5 text-xs font-mono tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>/</span>
        <span>{formatTime(duration)}</span>
      </div>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  );
};

const senderBox = (message: Message) => {
  return (
    <div className="flex flex-col gap-2 text-muted-foreground items-end">
      <div className="relative bg-secondary-foreground text-secondary rounded-lg rounded-tr-none p-2 max-w-[80%] flex items-center justify-center gap-4">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[8px] border-l-secondary-foreground border-b-[8px] border-b-transparent translate-x-full"></div>
        {message.originalContent.contentType === CONTENT_TYPES.AUDIO ? (
          <AudioPlayer url={message.originalContent.value} />
        ) : (
          <p className="text-sm whitespace-pre-wrap">
            {message.originalContent.value}
          </p>
        )}
        <span className="text-tiny whitespace-nowrap">
          {new Date(message?.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

const receiverBox = (
  message: Message,
  userId: string,
  showTranslated: boolean,
  setShowTranslated: (show: boolean) => void,
) => {
  const userTranslation = message.translatedContents?.find(
    (tc) => tc.user.toString() === userId,
  );

  const displayContent =
    showTranslated && userTranslation
      ? userTranslation.content.value
      : message.originalContent.value;

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={message.sender.photoURL || ""} />
            <AvatarFallback className="text-secondary-foreground text-xs">
              {message.sender.name?.charAt(0)?.toUpperCase() ||
                message.sender.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {message.sender.name || message.sender.email}
        </span>
      </div>

      <div className="relative bg-muted rounded-lg rounded-tl-none p-2 max-w-[80%]">
        <div className="absolute top-0 left-0 w-0 h-0 border-r-[8px] border-r-muted border-b-[8px] border-b-transparent -translate-x-full"></div>
        <div className="flex items-center gap-4">
          {displayContent &&
            message.originalContent.contentType !== CONTENT_TYPES.AUDIO && (
              <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
            )}
          {message.originalContent.contentType === CONTENT_TYPES.AUDIO && (
            <AudioPlayer url={message.originalContent.value} />
          )}
          <div className="flex items-center gap-2">
            <span className="text-tiny text-muted-foreground whitespace-nowrap">
              {new Date(message?.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {userTranslation && (
              <button
                onClick={() => setShowTranslated(!showTranslated)}
                className="inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted/50 h-6 w-6 p-1"
                title={showTranslated ? "Show Original" : "Translate"}
              >
                <Languages
                  className={`h-4 w-4 transition-colors ${
                    showTranslated ? "text-blue-500" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Message({ message }: { message: Message }) {
  const { user } = useAuth();
  const [showTranslated, setShowTranslated] = useState(false);

  return (
    <div key={message._id} className="flex flex-col space-y-1">
      {message.sender._id === user?._id
        ? senderBox(message)
        : receiverBox(
            message,
            user?._id || "",
            showTranslated,
            setShowTranslated,
          )}
    </div>
  );
}
