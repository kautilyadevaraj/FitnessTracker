"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, Utensils, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion } from "framer-motion";

export function RecentActivities() {
  const [filter, setFilter] = useState<"all" | "workout" | "diet">("all");

  // In a real app, this data would come from your database
  const allActivities = [
    {
      id: "1",
      type: "workout",
      name: "Full Body HIIT",
      date: "Today, 9:30 AM",
      calories: 450,
      duration: "45 min",
    },
    {
      id: "2",
      type: "diet",
      name: "Breakfast",
      date: "Today, 8:00 AM",
      calories: 520,
      items: "Oatmeal, Banana, Protein Shake",
    },
    {
      id: "3",
      type: "workout",
      name: "Upper Body Strength",
      date: "Yesterday, 6:15 PM",
      calories: 380,
      duration: "50 min",
    },
    {
      id: "4",
      type: "diet",
      name: "Lunch",
      date: "Yesterday, 1:30 PM",
      calories: 650,
      items: "Chicken Salad, Whole Grain Bread",
    },
    {
      id: "5",
      type: "diet",
      name: "Dinner",
      date: "Yesterday, 7:30 PM",
      calories: 720,
      items: "Salmon, Brown Rice, Vegetables",
    },
  ];

  const filteredActivities =
    filter === "all"
      ? allActivities
      : allActivities.filter((activity) => activity.type === filter);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest workouts and meals</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="h-8"
            >
              All
            </Button>
            <Button
              variant={filter === "workout" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("workout")}
              className="h-8"
            >
              Workouts
            </Button>
            <Button
              variant={filter === "diet" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("diet")}
              className="h-8"
            >
              Diet
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex items-start group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="mr-4 mt-0.5">
                {activity.type === "workout" ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <Utensils className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {activity.name}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
                <div className="flex items-center pt-1">
                  {activity.type === "workout" ? (
                    <p className="text-xs text-muted-foreground">
                      {activity.duration} • {activity.calories} calories burned
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {activity.calories} calories • {activity.items}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
