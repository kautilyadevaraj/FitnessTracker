"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Dumbbell, Flame, Timer } from "lucide-react";

const workouts = [
  { name: "Jumping Jacks", duration: "3 mins", calories: "30 kcal", icon: <Dumbbell /> },
  { name: "Push-Ups", duration: "4 mins", calories: "50 kcal", icon: <Dumbbell /> },
  { name: "Squats", duration: "5 mins", calories: "60 kcal", icon: <Dumbbell /> },
  { name: "Mountain Climbers", duration: "3 mins", calories: "40 kcal", icon: <Dumbbell /> },
  { name: "Burpees", duration: "4 mins", calories: "70 kcal", icon: <Dumbbell /> },
  { name: "Plank", duration: "2 mins", calories: "20 kcal", icon: <Dumbbell /> },
];

export default function FullBodyBlast() {
  const [completed, setCompleted] = useState<string[]>([]);

  const handleMarkAsDone = (workoutName: string) => {
    if (!completed.includes(workoutName)) {
      setCompleted([...completed, workoutName]);
    }
  };

  const progress = (completed.length / workouts.length) * 100;

  return (
    <div className="min-h-screen py-10 px-4 md:px-20 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🔥 Full Body Blast</h1>
          <p className="text-muted-foreground">
            Complete all exercises to finish your workout. Let’s get moving!
          </p>
        </div>

        <Progress value={progress} className="h-3 bg-muted" />
        <p className="text-sm text-muted-foreground text-center">
          {completed.length} of {workouts.length} workouts done ({Math.round(progress)}%)
        </p>

        <div className="grid gap-6">
          {workouts.map((workout) => (
            <Card
              key={workout.name}
              className={`${
                completed.includes(workout.name)
                  ? "border-green-500 bg-green-500/10"
                  : "border-border bg-muted"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">{workout.icon}</div>
                  <CardTitle>{workout.name}</CardTitle>
                </div>
                {completed.includes(workout.name) && (
                  <CheckCircle className="text-green-500 h-5 w-5" />
                )}
              </CardHeader>
              <CardContent className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  {workout.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  {workout.calories}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMarkAsDone(workout.name)}
                  disabled={completed.includes(workout.name)}
                >
                  {completed.includes(workout.name) ? "Done" : "Mark as Done"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
