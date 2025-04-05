"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WorkoutDetails, {
  WorkoutPlan,
} from "@/components/workout/WorkoutDetails";
import Loader from "@/components/Loader";

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params?.workout_id as string;

  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workoutId) return;

    const fetchWorkout = async () => {
      try {
        const res = await fetch("/api/workouts", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workout_id: workoutId }), 
        });

        if (!res.ok) {
          throw new Error("Failed to fetch workout data");
        }

        const data = await res.json();
        setWorkout(data);
      } catch (err: any) {
        console.error("Error fetching workout:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!workout) {
    router.push("/404");
    return null;
  }

  return <WorkoutDetails workout={workout} />;
}
