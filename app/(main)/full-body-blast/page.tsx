"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Dumbbell,
  Timer,
  Flame,
  Info,
  Repeat,
} from "lucide-react";
import Loader from "@/components/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import YouTubeEmbed from "@/components/YoutubeEmbed";

// Define a type for a single exercise in the workout plan
type Exercise = {
  name: string;
  equipment: string;
  estimatedTime: string;
  targetedArea: string;
  benefits: string;
  videoURL: string;
  repsAndSets: string;
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
        console.log(parsedPlan)
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
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!plan) return <p className="text-center">No workout plan available.</p>;

  const progress = (completedExercises.length / plan.noOfExercises) * 100;

  return (
    <div className="min-h-screen pb-10 bg-background text-foreground">
      {/* Sticky header with progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b py-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">
            {plan.routineName}
          </h1>
          <div className="space-y-2">
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-sm text-muted-foreground text-center">
              {completedExercises.length} of {plan.noOfExercises} exercises done
              ({Math.round(progress)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 space-y-8">
        <p className="text-muted-foreground text-center">
          Complete all exercises to finish your workout. Estimated duration:{" "}
          {plan.estimatedDuration}
        </p>

        <Accordion type="multiple" className="w-full">
          {Object.keys(plan.exercises).map((key) => {
            const exercise = plan.exercises[key];
            const isDone = completedExercises.includes(exercise.name);
            const targetAreas = exercise.targetedArea
              .split(",")
              .map((area) => area.trim());

            return (
              <AccordionItem
                key={exercise.name}
                value={exercise.name}
                className={`mb-4 border rounded-lg ${
                  isDone ? "border-green-500 bg-green-500/10" : "border-border"
                }`}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-full">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-base md:text-lg truncate">
                        {exercise.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isDone && (
                        <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                      <div className="flex items-center h-fit gap-2 bg-muted/50 p-3 rounded-lg">
                        <Timer className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Duration
                          </p>
                          <p className="font-medium">
                            {exercise.estimatedTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center h-fit gap-2 bg-muted/50 p-3 rounded-lg">
                        <Repeat className="h-6 w-6 text-violet-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Sets & Reps
                          </p>
                          <p className="font-medium">{exercise.repsAndSets}</p>
                        </div>
                      </div>
                      <div className="flex items-center h-fit gap-2 bg-muted/50 p-3 rounded-lg">
                        <Info className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Equipment
                          </p>
                          <p className="font-medium">{exercise.equipment}</p>
                        </div>
                      </div>
                      <div className="flex items-center col-span-1 sm:col-span-2 lg:col-span-4 h-fit w-fit gap-2 bg-muted/50 p-3 rounded-lg">
                        <Flame className="h-6 w-6 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Benefits
                          </p>
                          <p className="font-medium">{exercise.benefits}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Targeted Areas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {targetAreas.map((area, index) => (
                          <Badge key={index} className="font-normal">
                            {area}
                          </Badge>
                        ))}
                      </div>

                      {exercise.videoURL && (
                        <div className="mt-6">
                          <p className="text-sm font-medium mb-2">
                            Exercise Tutorial:
                          </p>
                          <YouTubeEmbed videoUrl={exercise.videoURL} />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant={isDone ? "outline" : "default"}
                        onClick={() => handleMarkAsDone(exercise.name)}
                        disabled={isDone}
                        className={
                          isDone ? "border-green-500 text-green-500" : ""
                        }
                      >
                        {isDone ? "Completed" : "Mark as Done"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
