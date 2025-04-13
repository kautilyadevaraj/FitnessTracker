"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Area,
  AreaChart,
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


export function DietProgressChart() {
  const [activeTab, setActiveTab] = useState("weekly");

  // In a real app, this data would come from your database
  const weeklyData = [
    { name: "Mon", calories: 2100, target: 2200 },
    { name: "Tue", calories: 2050, target: 2200 },
    { name: "Wed", calories: 2300, target: 2200 },
    { name: "Thu", calories: 2150, target: 2200 },
    { name: "Fri", calories: 2000, target: 2200 },
    { name: "Sat", calories: 2400, target: 2200 },
    { name: "Sun", calories: 2250, target: 2200 },
  ];

  const monthlyData = [
    { name: "Week 1", calories: 2150, target: 2200 },
    { name: "Week 2", calories: 2180, target: 2200 },
    { name: "Week 3", calories: 2120, target: 2200 },
    { name: "Week 4", calories: 2050, target: 2200 },
  ];

  const getAverageCalories = () => {
    const data = activeTab === "weekly" ? weeklyData : monthlyData;
    const sum = data.reduce((acc, day) => acc + day.calories, 0);
    return Math.round(sum / data.length);
  };

  const getTargetCalories = () => {
    return activeTab === "weekly"
      ? weeklyData[0].target
      : monthlyData[0].target;
  };

  const getDifference = () => {
    const avg = getAverageCalories();
    const target = getTargetCalories();
    return avg - target;
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Diet Adherence</CardTitle>
        <CardDescription>
          Track your calorie intake against your target
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="weekly"
          className="space-y-4"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Average</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getAverageCalories()}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Target</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {getTargetCalories()}
              </p>
            </div>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Difference</p>
              <p
                className={`text-xl font-bold ${
                  getDifference() > 0
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {getDifference() > 0 ? `+${getDifference()}` : getDifference()}
              </p>
            </div>
          </div>
          <TabsContent value="weekly" className="space-y-4">
            <div className="h-[220px]">
              <ChartContainer config={chartConfig}>
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCalories"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorTarget"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[1800, 2600]} />
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    name="Calories Consumed"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Target Calories"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorTarget)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4">
            <div className="h-[220px]">
              <ChartContainer config={chartConfig}>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCaloriesMonthly"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorTargetMonthly"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[1800, 2600]} />
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    name="Calories Consumed"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorCaloriesMonthly)"
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Target Calories"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorTargetMonthly)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
