"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";

import { User, PhysicalFitness, WorkoutPlan, DietPlan } from "@prisma/client";

import {ProfileHeader} from "./profile-header";
import {FitnessStats} from "./fitness-stats";
import {AchievementBadges} from "./achievement-badges";
import {WorkoutPlans} from "./workout-plans";
import {DietPlans} from "./diet-plans";

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [physicalFitness, setPhysicalFitness] =
    useState<PhysicalFitness | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to load profile data");

        const data = await res.json();
        setUser(data.user);
        setPhysicalFitness(data.physicalFitness);
        setWorkoutPlans(data.workoutPlans || []);
        setDietPlans(data.dietPlans || []);
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return (
    <div className=" w-full min-h-[90dvh] flex items-center justify-center">
      <Loader />
    </div>
  );
  if (!user)
    return (
      <div className="text-center text-muted-foreground">No user found.</div>
    );

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <FitnessStats physicalFitness={physicalFitness} />
          <AchievementBadges />
        </div>
        <div className="space-y-8">
          <WorkoutPlans workoutPlans={workoutPlans} />
          <DietPlans dietPlans={dietPlans} />
        </div>
      </div>
    </div>
  );
}
