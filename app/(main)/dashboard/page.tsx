import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UserStatsCards } from "@/components/dashboard/user-stats-cards";
import { WorkoutProgressChart } from "@/components/dashboard/workout-progress-chart";
import { DietProgressChart } from "@/components/dashboard/diet-progress-chart";
import { WeightTracker } from "@/components/dashboard/weight-tracker";
import { CalorieBalanceChart } from "@/components/dashboard/calorie-balance.chart";
import { TopWorkoutsTable } from "@/components/dashboard/top-workouts-table";
import { RecentActivities } from "@/components/dashboard/recent-activites";

export const metadata: Metadata = {
  title: "Dashboard | Fitness Tracker",
  description: "Track your fitness progress and achievements",
};

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 px-4 md:px-8">
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Track your fitness journey and progress"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UserStatsCards />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <WorkoutProgressChart />
          </div>
          <div className="col-span-3">
            <DietProgressChart />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-3">
            <WeightTracker />
          </div>
          <div className="col-span-4">
            <CalorieBalanceChart />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TopWorkoutsTable />
          <RecentActivities />
        </div>
      </DashboardShell>
    </div>
  );
}
