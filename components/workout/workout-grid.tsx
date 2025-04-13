"use client";
import { useEffect, useState } from "react";
import { JsonValue } from "next-auth/adapters";
import WorkoutCard from "./workout-card";
import WorkoutGridSkeleton from "@/components/skeleton/workout-grid-skeleton";

interface Workout {
  id: string;
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: JsonValue;
  noOfUsers: number;
  rating: number;
  category: string;
  userEmail: string;
  calories: number;
}

export default function WorkoutGrid() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        setLoading(true);
        const response = await fetch("/api/workouts/recent");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setWorkouts(data.workouts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  if (loading) {
    return <WorkoutGridSkeleton />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout, index) => (
        <WorkoutCard key={workout.id} workout={workout} index={index}/>
      ))}
    </div>
  );
}
