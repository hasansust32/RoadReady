import { Button } from "@/components/ui/button";

interface Week {
  week: string;
  title: string;
}

interface WeekSelectorProps {
  weeks: Week[];
  selectedWeek: string;
  onSelectWeek: (week: string) => void;
}

export default function WeekSelector({
  weeks,
  selectedWeek,
  onSelectWeek,
}: WeekSelectorProps) {
  return (
    <div className="space-y-2">
      {weeks.map((week) => (
        <Button
          key={week.week}
          variant={selectedWeek === week.week ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onSelectWeek(week.week)}
        >
          <span className="font-semibold">Week {week.week}</span>
          <span className="text-xs ml-2 opacity-70">{week.title}</span>
        </Button>
      ))}
    </div>
  );
}
