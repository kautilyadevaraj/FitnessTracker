"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dumbbell, Utensils, Weight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function UserStatsCards() {
  // In a real app, this data would come from your database
  const stats = {
    workoutsCompleted: 24,
    workoutStreak: 5,
    caloriesBurned: 12450,
    weightLost: 3.2,
  };

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 },
    },
    initial: {
      scale: 1,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      transition: { duration: 0.2 },
    },
  };

  const cards = [
    {
      id: "workouts",
      title: "Workouts Completed",
      value: stats.workoutsCompleted,
      subtext: "+3 from last month",
      icon: Dumbbell,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-500",
    },
    {
      id: "streak",
      title: "Current Streak",
      value: `${stats.workoutStreak} days`,
      subtext: "Your best: 14 days",
      icon: Activity,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-500",
    },
    {
      id: "calories",
      title: "Calories Burned",
      value: stats.caloriesBurned,
      subtext: "This month",
      icon: Utensils,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-orange-500",
    },
    {
      id: "weight",
      title: "Weight Progress",
      value: `-${stats.weightLost} kg`,
      subtext: "Since you started",
      icon: Weight,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-500",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={cardVariants}
          initial="initial"
          animate={hoveredCard === card.id ? "hover" : "initial"}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="transition-all duration-200"
        >
          <Card className="overflow-hidden border-none">
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${
                  card.color.split(" ")[2]
                }, ${card.color.split(" ")[3]})`,
              }}
            ></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${card.color} text-white`}
              >
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.subtext}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}
