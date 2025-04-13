"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart";

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

export function CalorieBalanceChart() {
  const [activeDay, setActiveDay] = useState<string | null>(null);

  // In a real app, this data would come from your database
  const calorieData = [
    { date: "Mon", consumed: 2100, burned: 320, balance: 2100 - 320 },
    { date: "Tue", consumed: 2050, burned: 280, balance: 2050 - 280 },
    { date: "Wed", consumed: 2300, burned: 0, balance: 2300 - 0 },
    { date: "Thu", consumed: 2150, burned: 350, balance: 2150 - 350 },
    { date: "Fri", consumed: 2000, burned: 410, balance: 2000 - 410 },
    { date: "Sat", consumed: 2400, burned: 0, balance: 2400 - 0 },
    { date: "Sun", consumed: 2250, burned: 390, balance: 2250 - 390 },
  ];

  const handleBarClick = (data: any) => {
    setActiveDay(data.date === activeDay ? null : data.date);
  };

  const getActiveDayData = () => {
    if (!activeDay) return null;
    return calorieData.find((day) => day.date === activeDay);
  };

  const activeDayData = getActiveDayData();

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Calorie Balance</CardTitle>
        <CardDescription>
          Track your calorie intake vs. calories burned
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeDayData && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">{activeDay} Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Consumed</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {activeDayData.consumed} cal
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Burned</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {activeDayData.burned} cal
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Net</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {activeDayData.balance} cal
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="h-[280px]">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={calorieData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent/>}
              />
              <Legend />
              <Bar
                dataKey="consumed"
                name="Calories Consumed"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                animationDuration={1500}
                cursor="pointer"
              />
              <Bar
                dataKey="burned"
                name="Calories Burned"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                animationDuration={1500}
                cursor="pointer"
              />
              <Bar
                dataKey="balance"
                name="Net Calories"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                animationDuration={1500}
                cursor="pointer"
              />
            </BarChart>
          </ChartContainer>
        </div>
        
      </CardContent>
    </Card>
  );
}
