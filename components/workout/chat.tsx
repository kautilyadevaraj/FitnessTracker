"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import Loader from "@/components/Loader";
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

// Define a type for a single exercise
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

export default function Chat() {
  const [input, setInput] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const fetchWorkout = async () => {
    if (!input.trim()) {
      toast.error("Please enter some workout preferences.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/workout-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch workout plan");

      const data = await response.json();
      const rawText = data.plan.text;
      const jsonText = rawText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      const parsedPlan: WorkoutPlan = JSON.parse(jsonText);

      setWorkoutPlan(parsedPlan);
      toast.success("Workout plan generated!");
    } catch (error) {
      console.error("Error fetching workout:", error);
      toast.error("Something went wrong. Please try again.");
      setError("Failed to fetch workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = (exerciseName: string) => {
    if (!completedExercises.includes(exerciseName)) {
      setCompletedExercises([...completedExercises, exerciseName]);
    }
  };

  const progress =
    workoutPlan && workoutPlan.noOfExercises
      ? (completedExercises.length / workoutPlan.noOfExercises) * 100
      : 0;

  return (
    <div className="relative h-full w-full flex flex-col justify-end gap-4 m-2">
      {/* Loading State */}
      {loading && (
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500 mt-4">Error: {error}</p>}

      {/* Display AI-Generated Workout */}
      {workoutPlan && (
        <div className="h-full text-foreground mt-6">
          {/* Sticky header with progress */}
          <div className="border-b py-4 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">
                {workoutPlan.routineName}
              </h1>
              
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 space-y-8">
            

            <Accordion type="multiple" className="w-full">
              {Object.keys(workoutPlan.exercises).map((key) => {
                const exercise = workoutPlan.exercises[key];
                const isDone = completedExercises.includes(exercise.name);
                const targetAreas = exercise.targetedArea
                  .split(",")
                  .map((area) => area.trim());

                return (
                  <AccordionItem
                    key={exercise.name}
                    value={exercise.name}
                    className={`mb-4 border rounded-lg ${
                      isDone
                        ? "border-green-500 bg-green-500/10"
                        : "border-border bg-background"
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
                                {exercise.repsAndSets}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center h-fit gap-2 bg-muted/50 p-3 rounded-lg">
                            <Info className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Equipment
                              </p>
                              <p className="font-medium">
                                {exercise.equipment}
                              </p>
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
      )}
      <Textarea
        placeholder="What type of workout do you want?"
        className="min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded !text-base bg-muted pb-10 dark:border-zinc-700"
        rows={2}
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Submit Button */}
      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-center">
        <Button onClick={fetchWorkout} disabled={loading}>
          {loading ? <Loader /> : <ArrowRightIcon />}
        </Button>
      </div>
    </div>
  );
}
