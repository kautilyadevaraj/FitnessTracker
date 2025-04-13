"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  Dumbbell,
  Timer,
  Flame,
  Info,
  Repeat,
  Save,
  Edit,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import YouTubeEmbed from "@/components/YoutubeEmbed";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExerciseEditForm from "./exercise-edit-form";
import { useMediaQuery } from "@/lib/hooks";

// Define a type for a single exercise
export type Exercise = {
  name: string;
  equipment: string;
  estimatedTime: string;
  targetedArea: string;
  benefits: string;
  videoURL: string;
  repsAndSets: string;
};

// Define the structure of the workout plan
export type WorkoutPlan = {
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: { [key: string]: Exercise };
  category: string;
  calories: number;
};

interface WorkoutPlanProps {
  workoutPlan: WorkoutPlan;
  onSave?: () => void;
  onUpdate?: (updatedPlan: WorkoutPlan) => void;
}

export default function WorkoutPlanComponent({
  workoutPlan,
  onSave,
  onUpdate,
}: WorkoutPlanProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEditExercise = (exercise: Exercise, key: string) => {
    setEditingExercise(exercise);
    setEditingKey(key);
  };

  const handleSaveExercise = (updatedExercise: Exercise) => {
    if (editingKey && onUpdate && workoutPlan) {
      const updatedWorkoutPlan = {
        ...workoutPlan,
        exercises: {
          ...workoutPlan.exercises,
          [editingKey]: updatedExercise,
        },
      };
      onUpdate(updatedWorkoutPlan);
      toast.success("Exercise updated successfully!");
    }
    setEditingExercise(null);
    setEditingKey(null);
  };

  const handleSaveWorkout = () => {
    if (onSave) {
      onSave();
    }
  };

  const progress =
    workoutPlan && workoutPlan.noOfExercises
      ? (completedExercises.length / workoutPlan.noOfExercises) * 100
      : 0;

  return (
    <div className="h-full text-foreground mt-6">
      {/* Sticky header with progress */}
      <div className="border-b py-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">
              {workoutPlan.routineName}
            </h1>
            <Button
              onClick={handleSaveWorkout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Workout
            </Button>
          </div>
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

                    <div className="flex justify-end gap-2">
                      {isDesktop ? (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditExercise(exercise, key)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-md">
                            <SheetHeader>
                              <SheetTitle>Edit Exercise</SheetTitle>
                            </SheetHeader>
                            {editingExercise && (
                              <ExerciseEditForm
                                exercise={editingExercise}
                                onSave={handleSaveExercise}
                              />
                            )}
                          </SheetContent>
                        </Sheet>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditExercise(exercise, key)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Exercise</DialogTitle>
                            </DialogHeader>
                            {editingExercise && (
                              <ExerciseEditForm
                                exercise={editingExercise}
                                onSave={handleSaveExercise}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                      
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
