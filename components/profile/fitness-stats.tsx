import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Calendar,
  Dumbbell,
  MapPin,
  Target,
  User,
} from "lucide-react";
import { PhysicalFitness } from "@prisma/client";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 transition-all",
        `bg-${color}-500/10 border border-${color}-500/20`
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn(`text-${color}-500`)}>{icon}</div>
      </div>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

export function FitnessStats({ physicalFitness }: { physicalFitness: PhysicalFitness | null }) {
  if (!physicalFitness) return null;
  // Calculate BMI
  const heightInMeters = physicalFitness.height / 100;
  const bmi = (
    physicalFitness.weight /
    (heightInMeters * heightInMeters)
  ).toFixed(1);

  // Calculate weekly activity percentage
  const weeklyActivityPercentage = (physicalFitness.workoutsPerWeek / 7) * 100;

  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl gap-2">
          <Activity className="h-5 w-5" />
          Fitness Profile
        </CardTitle>
        <CardDescription>
          Last updated:{" "}
          {new Date(physicalFitness.lastUpdated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Height"
                value={`${physicalFitness.height} cm`}
                icon={<Activity className="h-4 w-4" />}
                color="blue"
              />
              <StatCard
                label="Weight"
                value={`${physicalFitness.weight} kg`}
                icon={<Activity className="h-4 w-4" />}
                color="green"
              />
              <StatCard
                label="BMI"
                value={bmi}
                icon={<Activity className="h-4 w-4" />}
                color="purple"
              />
              <StatCard
                label="Age"
                value={`${physicalFitness.age} years`}
                icon={<User className="h-4 w-4" />}
                color="amber"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Weekly Activity</p>
                <p className="text-sm font-medium">
                  {physicalFitness.workoutsPerWeek}/7 days
                </p>
              </div>
              <Progress
                value={weeklyActivityPercentage}
                className="h-2 bg-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {physicalFitness.gender.charAt(0).toUpperCase() +
                    physicalFitness.gender.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {physicalFitness.fitnessLevel.charAt(0).toUpperCase() +
                    physicalFitness.fitnessLevel.slice(1)}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Primary Goal</p>
                  <p className="text-sm text-muted-foreground">
                    {physicalFitness.primaryGoal.charAt(0).toUpperCase() +
                      physicalFitness.primaryGoal.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Workout Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {physicalFitness.workoutDuration} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Workout Location</p>
                  <p className="text-sm text-muted-foreground">
                    {physicalFitness.workoutLocation.charAt(0).toUpperCase() +
                      physicalFitness.workoutLocation.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Workouts Per Week</p>
                  <p className="text-sm text-muted-foreground">
                    {physicalFitness.workoutsPerWeek} days
                  </p>
                </div>
              </div>

              {physicalFitness.additionalInfo && (
                <div className="pt-2">
                  <p className="font-medium">Additional Info</p>
                  <p className="text-sm text-muted-foreground">
                    {physicalFitness.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
