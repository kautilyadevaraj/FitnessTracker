import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutPlan } from "@prisma/client";
import { Dumbbell, Plus, Star, Users } from "lucide-react";

interface WorkoutPlansProps {
  workoutPlans: WorkoutPlan[];
}

interface Exercise {
  name: string;
  benefits: string;
  videoURL: string;
  equipment: string;
  repsAndSets: string;
  targetedArea: string;
  estimatedTime: string;
}

const parseRepsAndSets = (
  repsAndSets: string
): { sets: number; reps: number } => {
  const match = repsAndSets.match(/(\d+) sets of (\d+) reps/);
  if (match) {
    return {
      sets: parseInt(match[1], 10),
      reps: parseInt(match[2], 10),
    };
  }
  return { sets: 0, reps: 0 };
};

export function WorkoutPlans({ workoutPlans }: WorkoutPlansProps) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-emerald-900/20 to-green-900/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Workout Plans
          </CardTitle>
          <CardDescription>Your created workout routines</CardDescription>
        </div>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Plan</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workoutPlans.map((plan) => {
            // Handle the exercises field dynamically
            let exercises: Exercise[] = [];
            if (typeof plan.exercises === "string") {
              // If it's a string, parse it as JSON
              try {
                exercises = JSON.parse(plan.exercises) as Exercise[];
              } catch (error) {
                console.error(
                  `Failed to parse exercises for plan ${plan.id}:`,
                  error
                );
              }
            } else if (Array.isArray(plan.exercises)) {
              // If it's already an array, use it directly
              exercises = plan.exercises as unknown as Exercise[];
            } else {
              console.warn(
                `plan.exercises is not an array or string:`,
                plan.exercises
              );
            }

            return (
              <div
                key={plan.id}
                className="rounded-lg border p-4 hover:bg-accent/50 transition-colors bg-gradient-to-r from-emerald-900/10 to-transparent"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {plan.routineName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{plan.noOfExercises} exercises</span>
                      <span>•</span>
                      <span>{plan.estimatedDuration}</span>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border-none">
                    {plan.category}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  {exercises.slice(0, 3).map((exercise, index) => {
                    const { sets, reps } = parseRepsAndSets(
                      exercise.repsAndSets
                    );
                    return (
                      <div
                        key={index}
                        className="bg-background/30 backdrop-blur-sm rounded-md p-3 border border-green-500/20"
                      >
                        <div className="font-medium text-emerald-400">
                          {exercise.name}
                        </div>
                        <div className="flex justify-between items-center mt-1 text-sm">
                          <span>{sets} sets</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            {reps} reps
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {exercises.length > 3 && (
                    <div className="bg-background/30 backdrop-blur-sm rounded-md p-3 border border-green-500/20 flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">
                        +{exercises.length - 3} more exercises
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/50 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(plan.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{plan.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{plan.noOfUsers} users</span>
                  </div>
                </div>
              </div>
            );
          })}

          {workoutPlans.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>You haven't created any workout plans yet</p>
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                <Plus className="h-4 w-4" />
                Create your first plan
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
