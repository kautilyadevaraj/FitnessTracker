"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Dumbbell, Timer, Flame } from "lucide-react";
import YouTubeEmbed from "@/components/YoutubeEmbed";

// Define a type for a single exercise in the workout plan
type Exercise = {
  name: string;
  equipment: string;
  estimatedTime: string;
  targetedArea: string;
  benefits: string;
  videoURL: string
};

// Define the structure of the workout plan
type WorkoutPlan = {
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: { [key: string]: Exercise };
};

export default function WorkoutPlanDisplay() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const res = await fetch("/api/workout-generator", { method: "POST" });
        if (!res.ok) {
          throw new Error("Failed to fetch workout plan");
        }
        const data = await res.json();
        // Expecting data.plan.text to contain the workout plan wrapped in code fences
        const rawText: string = data.plan.text; // e.g. "```json\n{...}\n```"
        const jsonText = rawText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
        const parsedPlan: WorkoutPlan = JSON.parse(jsonText);
        setPlan(parsedPlan);
      } catch (err: any) {
        console.error("Error fetching workout plan:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, []);

  const handleMarkAsDone = (exerciseName: string) => {
    if (!completedExercises.includes(exerciseName)) {
      setCompletedExercises([...completedExercises, exerciseName]);
    }
  };

  if (loading)
    return <p className="text-center text-lg">Loading workout plan...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!plan) return <p className="text-center">No workout plan available.</p>;

  const progress = (completedExercises.length / plan.noOfExercises) * 100;

  return (
    <div className="min-h-screen py-10 px-4 md:px-20 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{plan.routineName}</h1>
          <p className="text-muted-foreground">
            Complete all exercises to finish your workout.
          </p>
        </div>

        <Progress value={progress} className="h-3 bg-muted" />
        <p className="text-sm text-muted-foreground text-center">
          {completedExercises.length} of {plan.noOfExercises} exercises done (
          {Math.round(progress)}%)
        </p>

        <div className="grid gap-6">
          {Object.keys(plan.exercises).map((key) => {
            const exercise = plan.exercises[key];
            const isDone = completedExercises.includes(exercise.name);
            return (
              <Card
                key={exercise.name}
                className={`${
                  isDone
                    ? "border-green-500 bg-green-500/10"
                    : "border-border bg-muted"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Dumbbell />
                    </div>
                    <CardTitle>{exercise.name}</CardTitle>
                  </div>
                  {isDone && <CheckCircle className="text-green-500 h-5 w-5" />}
                </CardHeader>
                <CardContent className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    {exercise.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    {exercise.benefits}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleMarkAsDone(exercise.name)}
                    disabled={isDone}
                  >
                    {isDone ? "Done" : "Mark as Done"}
                  </Button>
                </CardContent>
                {exercise.videoURL && (
                  <YouTubeEmbed videoUrl={exercise.videoURL}></YouTubeEmbed>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
