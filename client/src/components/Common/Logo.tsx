interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}
      >
        <span
          className={`text-primary-foreground font-bold ${iconSizeClasses[size]}`}
        >
          P
        </span>
      </div>
      {showText && (
        <h1 className={`font-bold text-foreground ${textSizeClasses[size]}`}>
          Parlo
        </h1>
      )}
    </div>
  );
}
