import type { Metadata } from "next";
import { Suspense } from "react";
import FeaturedWorkouts from "@/components/workout/featured-workouts";
import WorkoutSearch from "@/components/workout/workout-search";
import WorkoutFilters from "@/components/workout/workout-filters";
import WorkoutGrid from "@/components/workout/workout-grid";
import FeaturedWorkoutsSkeleton from "@/components/skeleton/featured-workouts-skeleton";
import WorkoutGridSkeleton from "@/components/skeleton/workout-grid-skeleton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Workouts | Fitness App",
  description: "Discover and track your favorite workout routines",
};

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="container p-6 space-y-8 min-w-full">
      <FeaturedWorkouts />

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <WorkoutSearch />
          <Suspense fallback={<WorkoutGridSkeleton />}>
            <WorkoutGrid />
          </Suspense>
        </div>

        <div className="space-y-6">
          <WorkoutFilters />
        </div>
      </div>
    </div>
  );
}
