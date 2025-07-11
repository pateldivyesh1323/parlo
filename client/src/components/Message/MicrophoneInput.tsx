import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Square, Play, Pause, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MicrophoneInputProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  onClear?: () => void;
}

export default function MicrophoneInput({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  onError,
  disabled = false,
  className,
  onClear,
}: MicrophoneInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalRecordingTime = useRef(0);

  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const onLoadedMetadata = () => {
        if (audioRef.current) {
          if (
            isFinite(audioRef.current.duration) &&
            !isNaN(audioRef.current.duration) &&
            audioRef.current.duration > 0
          ) {
            setAudioDuration(audioRef.current.duration);
          }
        }
      };

      const onTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      const onEnded = () => {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
        }
      };

      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);

      return () => {
        URL.revokeObjectURL(audioUrl);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("ended", onEnded);
        audio.pause();
        audioRef.current = null;
        setAudioDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
      };
    }
  }, [audioBlob]);

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setHasPermission(permission.state === "granted");

      permission.addEventListener("change", () => {
        setHasPermission(permission.state === "granted");
      });
    } catch {
      // Fallback for browsers that don't support permissions API
      setHasPermission(null);
    }
  }, []);

  useEffect(() => {
    checkMicrophonePermission();
  }, [checkMicrophonePermission]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setCurrentTime(0);
    setAudioDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    onClear?.();
  }, [onClear]);

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;
      setHasPermission(true);
      return stream;
    } catch (error) {
      setHasPermission(false);
      const errorMessage =
        error instanceof Error ? error.message : "Microphone access denied";
      onError?.(errorMessage);
      throw error;
    }
  }, [onError]);

  const startRecording = useCallback(async () => {
    try {
      const stream = streamRef.current || (await requestMicrophoneAccess());

      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);

        // Initialize audio duration
        const audioUrl = URL.createObjectURL(audioBlob);
        const tempAudio = new Audio(audioUrl);

        // Set a timeout fallback in case metadata doesn't load
        const timeoutId = setTimeout(() => {
          setAudioDuration(finalRecordingTime.current);
          URL.revokeObjectURL(audioUrl);
        }, 2000);

        tempAudio.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          if (
            isFinite(tempAudio.duration) &&
            !isNaN(tempAudio.duration) &&
            tempAudio.duration > 0
          ) {
            setAudioDuration(tempAudio.duration);
          } else {
            // Fallback to recording time if duration is invalid
            setAudioDuration(finalRecordingTime.current);
          }
          URL.revokeObjectURL(audioUrl);
        };

        tempAudio.onerror = () => {
          clearTimeout(timeoutId);
          setAudioDuration(finalRecordingTime.current);
          URL.revokeObjectURL(audioUrl);
        };

        onRecordingComplete?.(audioBlob);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      startTimer();
      onRecordingStart?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start recording";
      onError?.(errorMessage);
    }
  }, [
    requestMicrophoneAccess,
    onRecordingComplete,
    onRecordingStart,
    onError,
    startTimer,
  ]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [isRecording, stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [isRecording, isPaused, startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      finalRecordingTime.current = recordingTime;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      onRecordingStop?.();
    }
  }, [onRecordingStop, stopTimer, recordingTime]);

  const handleMicClick = useCallback(() => {
    if (audioBlob) {
      clearRecording();
    }
    startRecording();
  }, [audioBlob, clearRecording, startRecording]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seekToTime = useCallback((time: number) => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.currentTime = time;
      setCurrentTime(time);

      if (wasPlaying) {
        audioRef.current.play().catch(() => {
          // Handle play promise rejection
        });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTimer();
    };
  }, [stopTimer]);

  if (hasPermission === false) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-4 border border-destructive/20 rounded-md bg-destructive/5",
          className,
        )}
      >
        <MicOff className="size-4 text-destructive" />
        <span className="text-sm text-destructive">
          Microphone access denied
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={requestMicrophoneAccess}
          disabled={disabled}
        >
          Request Access
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 border-t", className)}>
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicClick}
            disabled={disabled}
            className="hover:bg-red-50 hover:border-red-200"
          >
            <Mic className="size-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={isPaused ? resumeRecording : pauseRecording}
              disabled={disabled}
              className="hover:bg-blue-50 hover:border-blue-200"
            >
              {isPaused ? (
                <Play className="size-4" />
              ) : (
                <Pause className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={stopRecording}
              disabled={disabled}
              className="hover:bg-red-50 hover:border-red-200"
            >
              <Square className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2 rounded-full",
              isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse",
            )}
          />
          <span className="text-sm font-mono text-gray-600">
            {formatTime(recordingTime)}
          </span>
          <span className="text-xs text-gray-500">
            {isPaused ? "Paused" : "Recording"}
          </span>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex flex-col gap-2 border-l pl-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              disabled={disabled}
              className="hover:bg-green-50 hover:border-green-200"
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="link"
              size="icon"
              onClick={clearRecording}
              disabled={disabled}
              className="hover:cursor-pointer"
            >
              <Trash2 className="size-4" color="red" />
            </Button>
            <div className="flex items-center gap-2 w-[400px]">
              <Slider
                max={audioDuration || recordingTime}
                value={[currentTime]}
                onValueChange={(value) => seekToTime(value[0])}
                disabled={disabled || !audioBlob}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(Math.floor(currentTime))} /{" "}
              {formatTime(Math.floor(audioDuration || recordingTime))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
