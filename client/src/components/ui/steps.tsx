interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  title,
  description,
  icon,
  colorClass,
  bgColorClass,
}) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-chart-2/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 ${bgColorClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className={`${colorClass} w-8 h-8`}>{icon}</div>
          </div>
          <div
            className={`absolute -top-2 -right-2 w-8 h-8 ${colorClass} rounded-full flex items-center justify-center text-sm font-bold`}
          >
            {number}
          </div>
        </div>
        <h4 className="font-bold text-lg mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StepCard;
