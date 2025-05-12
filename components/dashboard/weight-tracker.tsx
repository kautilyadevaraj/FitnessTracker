"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../ui/chart";

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


export function WeightTracker() {
  const [timeRange, setTimeRange] = useState("6months");

  // In a real app, this data would come from your database
  const weightData = {
    "3months": [
      { date: "Apr 1", weight: 78.9 },
      { date: "Apr 15", weight: 78.5 },
      { date: "May 1", weight: 78.0 },
      { date: "May 15", weight: 77.6 },
      { date: "Jun 1", weight: 77.2 },
      { date: "Jun 15", weight: 76.8 },
    ],
    "6months": [
      { date: "Jan 1", weight: 82.5 },
      { date: "Jan 15", weight: 81.8 },
      { date: "Feb 1", weight: 81.2 },
      { date: "Feb 15", weight: 80.5 },
      { date: "Mar 1", weight: 79.8 },
      { date: "Mar 15", weight: 79.3 },
      { date: "Apr 1", weight: 78.9 },
      { date: "Apr 15", weight: 78.5 },
      { date: "May 1", weight: 78.0 },
      { date: "May 15", weight: 77.6 },
      { date: "Jun 1", weight: 77.2 },
      { date: "Jun 15", weight: 76.8 },
    ],
    "1year": [
      { date: "Jul 1", weight: 85.2 },
      { date: "Aug 1", weight: 84.5 },
      { date: "Sep 1", weight: 83.8 },
      { date: "Oct 1", weight: 83.2 },
      { date: "Nov 1", weight: 82.9 },
      { date: "Dec 1", weight: 82.7 },
      { date: "Jan 1", weight: 82.5 },
      { date: "Feb 1", weight: 81.2 },
      { date: "Mar 1", weight: 79.8 },
      { date: "Apr 1", weight: 78.9 },
      { date: "May 1", weight: 78.0 },
      { date: "Jun 1", weight: 77.2 },
    ],
  };

  const currentData = weightData[timeRange as keyof typeof weightData];
  const startWeight = currentData[0].weight;
  const currentWeight = currentData[currentData.length - 1].weight;
  const weightLoss = startWeight - currentWeight;
  const percentageLoss = ((weightLoss / startWeight) * 100).toFixed(1);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Weight Tracker</CardTitle>
          <CardDescription>
            Track your weight progress over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 Months</SelectItem>
            <SelectItem value="6months">6 Months</SelectItem>
            <SelectItem value="1year">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Starting</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {startWeight} kg
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {currentWeight} kg
            </p>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Lost</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {weightLoss.toFixed(1)} kg
            </p>
          </div>
        </div>
        <div className="h-[220px]">
          <ChartContainer config={chartConfig}>
            <LineChart
              data={currentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
              <ChartTooltip content={<ChartTooltipContent/>}/>
              <Legend />
              <defs>
                <linearGradient id="weightColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="url(#weightColor)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8b5cf6" }}
                activeDot={{ r: 6, fill: "#d946ef" }}
                animationDuration={1500}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
