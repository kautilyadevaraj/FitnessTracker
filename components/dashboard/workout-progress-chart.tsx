"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "../ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WorkoutProgressChart() {
  const [period, setPeriod] = useState("weekly");
  const [dateRange, setDateRange] = useState("This Week");

  // In a real app, this data would come from your database
  const weeklyData = [
    { name: "Mon", workouts: 1, calories: 320 },
    { name: "Tue", workouts: 1, calories: 280 },
    { name: "Wed", workouts: 0, calories: 0 },
    { name: "Thu", workouts: 1, calories: 350 },
    { name: "Fri", workouts: 1, calories: 410 },
    { name: "Sat", workouts: 0, calories: 0 },
    { name: "Sun", workouts: 1, calories: 390 },
  ];

  const monthlyData = [
    { name: "Week 1", workouts: 4, calories: 1250 },
    { name: "Week 2", workouts: 5, calories: 1600 },
    { name: "Week 3", workouts: 3, calories: 950 },
    { name: "Week 4", workouts: 6, calories: 1850 },
  ];

  const handlePrevious = () => {
    if (period === "weekly") {
      setDateRange("Last Week");
    } else {
      setDateRange("Last Month");
    }
  };

  const handleNext = () => {
    if (period === "weekly") {
      setDateRange("This Week");
    } else {
      setDateRange("This Month");
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Workout Progress
            </CardTitle>
            <CardDescription>
              Track your workout frequency and calories burned
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{dateRange}</span>
            </div>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="workouts"
                    name="Workouts"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="calories"
                    name="Calories"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ChartContainer>
            
      </CardContent>
    </Card>
  );
}
