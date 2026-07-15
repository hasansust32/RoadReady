import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  score: number;
  total: number;
  language: "en" | "bn";
}

export default function ProgressTracker({
  score,
  total,
  language,
}: ProgressTrackerProps) {
  const percentage = total > 0 ? (score / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          {language === "en" ? "Score" : "স্কোর"}
        </p>
        <p className="text-sm font-bold text-blue-600">
          {score}/{total}
        </p>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-gray-500 mt-2">
        {language === "en"
          ? `${Math.round(percentage)}% correct`
          : `${Math.round(percentage)}% সঠিক`}
      </p>
    </div>
  );
}
