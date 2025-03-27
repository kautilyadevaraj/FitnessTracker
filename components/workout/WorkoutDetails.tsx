"use client";
import { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import YouTubeEmbed from "@/components/YoutubeEmbed";

type Exercise = {
  name: string;
  equipment: string;
  category: string;
  targetedArea: string;
  videoURL: string;
  estimatedTime: string;
  repsAndSets?: string;
};

export interface WorkoutPlan {
  id: string;
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: any; // JsonValue type (needs parsing)
  noOfUsers: number;
  rating: number;
  category: string;
  userEmail: string;
}

interface WorkoutDetailsProps {
  workout: WorkoutPlan;
}

export default function WorkoutDetails({ workout }: WorkoutDetailsProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // ✅ Parse exercises from JSON
  const parsedExercises: Record<string, Exercise> =
    typeof workout.exercises === "string"
      ? JSON.parse(workout.exercises)
      : workout.exercises;

  const handleMarkAsDone = (exerciseName: string) => {
    if (!completedExercises.includes(exerciseName)) {
      setCompletedExercises([...completedExercises, exerciseName]);
    }
  };

  const progress = (completedExercises.length / workout.noOfExercises) * 100;

  return (
    <div className="min-h-screen pb-10 bg-background text-foreground">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b py-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">
            {workout.routineName}
          </h1>
          <div className="space-y-2">
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-sm text-muted-foreground text-center">
              {completedExercises.length} of {workout.noOfExercises} exercises
              done ({Math.round(progress)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 space-y-8">
        <p className="text-muted-foreground text-center">
          Complete all exercises to finish your workout. Estimated duration:{" "}
          {workout.estimatedDuration}
        </p>

        <Accordion type="multiple" className="w-full">
          {Object.keys(parsedExercises).map((key) => {
            const exercise = parsedExercises[key];
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
                          <p className="font-medium">
                            {exercise.repsAndSets || "N/A"}
                          </p>
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
                    </div>

                    {exercise.videoURL && (
                      <div className="mt-6">
                        <p className="text-sm font-medium mb-2">
                          Exercise Tutorial:
                        </p>
                        <YouTubeEmbed videoUrl={exercise.videoURL} />
                      </div>
                    )}

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
