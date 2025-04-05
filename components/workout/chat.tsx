"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import WorkoutPlan, {
  type WorkoutPlan as WorkoutPlanType,
} from "./workout-plan";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat() {
  const [input, setInput] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkout = async () => {
    if (!input.trim()) {
      toast.error("Please enter some workout preferences.");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch("/api/workout-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: input }),
      });

       if (!response.ok) throw new Error("Failed to fetch workout plan");

      const data = await response.json();
      if (!data.plan || !data.plan.text)
        throw new Error("Invalid response from API");
      const rawText = data.plan.text;
      const jsonText = rawText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      const parsedPlan: WorkoutPlanType = JSON.parse(jsonText);

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

  const handleUpdateWorkout = (updatedPlan: WorkoutPlanType) => {
    setWorkoutPlan(updatedPlan);
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) {
      toast.error("No workout plan to save.");
      return;
    }

    try {
      const response = await fetch("/api/workouts/save-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutPlan),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to save workout plan.");
      }

      toast.success("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const examplePrompts = [
    {
      title: "Full-Body Strength",
      subtitle: "Build muscle with a balanced workout.",
      href: "#",
    },
    {
      title: "Home Workout Plan",
      subtitle: "No equipment? No problem!",
      href: "#",
    },
    {
      title: "Fat-Burning Routine",
      subtitle: "High-intensity exercises to shed fat.",
      href: "#",
    },
    {
      title: "Beginner Friendly",
      subtitle: "Start your fitness journey with ease.",
      href: "#",
    },
  ];


  return (
    <div className="flex flex-col h-fit w-full overflow-hidden">
      {/* Main content area - scrollable */}
      <div className="flex-1 relative">
        <ScrollArea className="h-[calc(80vh)]">
          {/* Loading State */}
          {loading ? (
            <div className="h-[calc(100vh-80px)] w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Display AI-Generated Workout */}
              {workoutPlan ? (
                <WorkoutPlan
                  workoutPlan={workoutPlan}
                  onSave={handleSaveWorkout}
                  onUpdate={handleUpdateWorkout}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 min-h-[80vh]">
                  <div className="text-center mb-8 max-w-2xl">
                    <h1 className="text-2xl font-bold mb-2">
                      AI-Powered Workout Generator
                    </h1>
                    <p className="text-muted-foreground">
                      Get a personalized workout plan tailored to your fitness
                      goals!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {examplePrompts.map((prompt, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          setInput(`${prompt.title} ${prompt.subtitle}`)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">{prompt.title}</div>
                            <div className="text-muted-foreground">
                              {prompt.subtitle}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error State */}
          {error && (
            <p className="text-center text-red-500 mt-4">Error: {error}</p>
          )}
        </ScrollArea>
      </div>

      {/* Fixed input area at bottom */}
      <div className="sticky bg-background border-t p-0.5">
        <div className="relative">
          <Textarea
            placeholder="What type of workout do you want?"
            className="min-h-[24px] max-h-[120px] overflow-y-auto resize-none rounded-b !text-base mt-1 bg-muted pb-10 dark:border-zinc-700"
            rows={2}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                fetchWorkout();
              }
            }}
          />

          {/* Submit Button */}
          <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-center">
            <Button onClick={fetchWorkout} disabled={loading}>
              {loading ? <Loader /> : <ArrowRightIcon />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
