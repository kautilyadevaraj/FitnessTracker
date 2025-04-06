import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Award, Medal, Target, Flame, Zap } from "lucide-react";

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "award" | "medal" | "target" | "flame" | "zap";
  color: string;
  earned: boolean;
  progress?: number;
}

const mockAchievements: AchievementBadge[] = [
  {
    id: "1",
    name: "First Workout",
    description: "Completed your first workout",
    icon: "trophy",
    color: "amber",
    earned: true,
  },
  {
    id: "2",
    name: "Diet Master",
    description: "Created 5 diet plans",
    icon: "award",
    color: "green",
    earned: true,
  },
  {
    id: "3",
    name: "Consistency King",
    description: "Workout 5 days in a row",
    icon: "flame",
    color: "red",
    earned: true,
  },
  {
    id: "4",
    name: "Muscle Builder",
    description: "Complete 10 strength workouts",
    icon: "zap",
    color: "purple",
    earned: false,
    progress: 70,
  },
  {
    id: "5",
    name: "Weight Goal",
    description: "Reach your target weight",
    icon: "target",
    color: "blue",
    earned: false,
    progress: 85,
  },
  {
    id: "6",
    name: "Community Leader",
    description: "Have 100 users follow your plans",
    icon: "medal",
    color: "cyan",
    earned: false,
    progress: 45,
  },
];

export function AchievementBadges() {
  const renderIcon = (icon: string, color: string) => {
    const className = `h-6 w-6 text-${color}-500`;

    switch (icon) {
      case "trophy":
        return <Trophy className={className} />;
      case "award":
        return <Award className={className} />;
      case "medal":
        return <Medal className={className} />;
      case "target":
        return <Target className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "zap":
        return <Zap className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
        <CardDescription>Your fitness milestones and badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mockAchievements.map((badge) => (
            <div
              key={badge.id}
              className={`relative rounded-lg p-3 border transition-all ${
                badge.earned
                  ? `bg-${badge.color}-500/10 border-${badge.color}-500/30`
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`rounded-full p-3 mb-2 ${
                    badge.earned ? `bg-${badge.color}-500/20` : "bg-gray-700/30"
                  }`}
                >
                  {renderIcon(badge.icon, badge.earned ? badge.color : "gray")}
                </div>
                <h3 className="font-medium text-sm">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>

                {!badge.earned && badge.progress !== undefined && (
                  <div className="w-full mt-2">
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${badge.color}-500 rounded-full`}
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.progress}%
                    </p>
                  </div>
                )}
              </div>

              {!badge.earned && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                  <div className="text-xs font-medium text-muted-foreground">
                    In Progress
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
