"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Timer, Flame, HeartPulse, StretchHorizontal, Play } from "lucide-react";
import { useRouter } from 'next/navigation';
import { JSX } from "react";

export default function WorkoutsPage() {
  const allWorkouts = [
    { name: "Full Body Blast", duration: "45 mins", calories: "400 kcal", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "HIIT Madness", duration: "30 mins", calories: "350 kcal", icon: <HeartPulse className="h-5 w-5" /> },
    { name: "Yoga Flow", duration: "60 mins", calories: "250 kcal", icon: <StretchHorizontal className="h-5 w-5" /> },
    { name: "Core Crusher", duration: "20 mins", calories: "150 kcal", icon: <Dumbbell className="h-5 w-5" /> },
  ];

  const strengthWorkouts = [
    { name: "Leg Day Supreme", duration: "50 mins", calories: "500 kcal", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Upper Body Power", duration: "40 mins", calories: "450 kcal", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Glute Gains", duration: "35 mins", calories: "400 kcal", icon: <Dumbbell className="h-5 w-5" /> },
  ];

  const cardioWorkouts = [
    { name: "Morning Run", duration: "30 mins", calories: "300 kcal", icon: <HeartPulse className="h-5 w-5" /> },
    { name: "Jump Rope Blast", duration: "25 mins", calories: "280 kcal", icon: <HeartPulse className="h-5 w-5" /> },
    { name: "Cycling Burn", duration: "45 mins", calories: "450 kcal", icon: <HeartPulse className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Workouts</h1>

      <div className="flex justify-center mb-8">
        <Input placeholder="Search workouts..." className="w-full max-w-md bg-muted text-foreground" />
      </div>

      <Tabs defaultValue="all" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-muted border border-border rounded-lg mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <WorkoutList workouts={allWorkouts} />
        </TabsContent>

        <TabsContent value="strength">
          <WorkoutList workouts={strengthWorkouts} />
        </TabsContent>

        <TabsContent value="cardio">
          <WorkoutList workouts={cardioWorkouts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutList({
  workouts,
}: {
  workouts: { name: string; duration: string; calories: string; icon: JSX.Element }[];
}) {
  return (
    <ScrollArea className="h-[500px] mt-4 pr-2">
      <div className="grid gap-5">
        {workouts.map((workout, index) => (
          <WorkoutCard key={index} workout={workout} />
        ))}
      </div>
    </ScrollArea>
  );
}

function WorkoutCard({
  workout,
}: {
  workout: { name: string; duration: string; calories: string; icon: JSX.Element };
}) {
  const router = useRouter(); // Initialize the router

  function handleStart() {
    router.push(`/${workout.name.toLowerCase().replace(/\s+/g, '-')}`);
  }


  return (
    <Card className="hover:shadow-xl transition bg-muted border-border text-foreground">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-full">{workout.icon}</div>
          <CardTitle>{workout.name}</CardTitle>
        </div>
        <Button variant="default" size="sm" onClick={handleStart}>
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            {workout.duration}
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-500" />
            {workout.calories}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
