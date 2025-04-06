"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Clock, ChevronRight, Mail, Leaf, Star } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PlaceholderImage from "@/public/placeholder.png";
import DietPlanPlaceholderImage from "@/public/diet-plan.png";
import { use } from "react";
import Loader from "@/components/Loader";

import Image1 from "@/public/food_1.jpeg";
import Image2 from "@/public/food_2.jpeg";
import Image3 from "@/public/food_3.jpeg";
import Image4 from "@/public/food_4.jpeg";
import Image5 from "@/public/food_5.jpeg";
import Image6 from "@/public/food_6.jpeg";
import Image7 from "@/public/food_7.jpeg";

const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7];

interface MealNutrition {
  name: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fats: number;
  sugar: number;
  fibre: string;
  sodium: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  folate: number;
  ingredients: null | string;
}

interface DietDay {
  day: number;
  meals: MealNutrition[];
}

interface DietPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: DietDay[];
  mealsPerDay: number;
  difficulty: string;
  rating: number;
  userEmail: string;
}

export default function DietPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  // Calculate nutritional totals
  const { averageCalories, averageProtein, averageCarbs, averageFat } =
    useMemo(() => {
      if (!dietPlan)
        return {
          averageCalories: 0,
          averageProtein: 0,
          averageCarbs: 0,
          averageFat: 0,
        };

      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      dietPlan.meals.forEach((day: DietDay) => {
        day.meals.forEach((meal: MealNutrition) => {
          totalCalories += meal.calories;
          totalProtein += meal.protein;
          totalCarbs += meal.carbohydrates;
          totalFat += meal.fats;
        });
      });

      return {
        averageCalories: totalCalories / dietPlan.duration,
        averageProtein: totalProtein / dietPlan.duration,
        averageCarbs: totalCarbs / dietPlan.duration,
        averageFat: totalFat / dietPlan.duration,
      };
    }, [dietPlan]);

  useEffect(() => {
    async function fetchDietPlan() {
      try {
        const res = await fetch("/api/diet-plans/id", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ diet_id: id }),
        });
        if (!res.ok) throw new Error("Failed to fetch workout data");
        const data = await res.json();
        setDietPlan(data);
      } catch (error) {
        console.error("Error fetching diet plan:", error);
      }
    }

    fetchDietPlan();
  }, [id]);

  const [currentDay, setCurrentDay] = useState(1);

  // Calculate daily totals for the current day
  const getDailyTotals = (day: number) => {
    if (!dietPlan) return { calories: 0, carbs: 0, protein: 0, fats: 0 };

    const dayData = dietPlan.meals.find((d: DietDay) => d.day === day);
    if (!dayData) return { calories: 0, carbs: 0, protein: 0, fats: 0 };

    return dayData.meals.reduce(
      (
        acc: { calories: number; carbs: number; protein: number; fats: number },
        meal: MealNutrition
      ) => ({
        calories: acc.calories + meal.calories,
        carbs: acc.carbs + meal.carbohydrates,
        protein: acc.protein + meal.protein,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, carbs: 0, protein: 0, fats: 0 }
    );
  };

  const dailyTotals = getDailyTotals(currentDay);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-amber-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star
            key={i + fullStars + (hasHalfStar ? 1 : 0)}
            className="w-4 h-4 text-amber-400"
          />
        ))}
      </div>
    );
  };

  const goToPreviousDay = () => {
    setCurrentDay((prev) => (prev > 1 ? prev - 1 : dietPlan?.duration || 7));
  };

  const goToNextDay = () => {
    setCurrentDay((prev) => (prev < (dietPlan?.duration || 7) ? prev + 1 : 1));
  };


  if (!dietPlan) return <div className="flex justify-center items-center w-full h-full"><Loader/></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Main Diet Plan Image */}
      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src={DietPlanPlaceholderImage}
          alt="Clean Eating Plan"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{dietPlan.name}</h1>
            <p className="text-white/80 mt-2">{dietPlan.description}</p>
            <div className="flex items-center mt-2 text-sm">
              <Mail className="h-4 w-4 mr-1" />
              <span>Created by: {dietPlan.userEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1 border-2"
              >
                <Leaf className="h-4 w-4 text-emerald-500" />
                <span>{dietPlan.difficulty}</span>
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1 border-2"
              >
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>{dietPlan.duration} Days</span>
              </Badge>
              <div className="flex items-center gap-1">
                {renderStars(dietPlan.rating)}
                <span className="text-sm  ml-1">{dietPlan.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Nutrition Summary */}
        <Card className=" border-2 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-emerald-700">
              Average Nutrition Values
            </CardTitle>
            <CardDescription>
              Average daily nutritional values across the entire plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm ">
                    {averageCalories.toFixed(1)} kcal
                  </span>
                </div>
                <Progress
                  value={Math.min(averageCalories / 20, 100)}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm">{averageCarbs.toFixed(1)}g</span>
                </div>
                <Progress
                  value={Math.min(averageCarbs * 2, 100)}
                  className="h-2 "
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm">{averageProtein.toFixed(1)}g</span>
                </div>
                <Progress
                  value={Math.min(averageProtein * 3, 100)}
                  className="h-2 "
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm">{averageFat.toFixed(1)}g</span>
                </div>
                <Progress
                  value={Math.min(averageFat * 4, 100)}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Nutrition Summary */}
        <Card className=" border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-emerald-700">
              Daily Nutrition Summary
            </CardTitle>
            <CardDescription>
              Day {currentDay} nutritional breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm ">
                    {dailyTotals.calories.toFixed(0)} kcal
                  </span>
                </div>
                <Progress
                  value={Math.min(dailyTotals.calories / 20, 100)}
                  className="h-2 "
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm ">
                    {dailyTotals.carbs.toFixed(1)}g
                  </span>
                </div>
                <Progress
                  value={Math.min(dailyTotals.carbs * 2, 100)}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm">
                    {dailyTotals.protein.toFixed(1)}g
                  </span>
                </div>
                <Progress
                  value={Math.min(dailyTotals.protein * 3, 100)}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm">
                    {dailyTotals.fats.toFixed(1)}g
                  </span>
                </div>
                <Progress
                  value={Math.min(dailyTotals.fats * 4, 100)}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousDay}
          className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Previous Day
        </button>
        <div className="flex space-x-1">
          {Array.from({ length: dietPlan.duration }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentDay(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentDay === i + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={goToNextDay}
          className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          Next Day
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>

      {/* Meals for the day */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Day {currentDay} Meals</h2>

        {dietPlan.meals
          .find((day: DietDay) => day.day === currentDay)
          ?.meals.map((meal: MealNutrition, index: number) => (
            <Card
              key={index}
              className="overflow-hidden border-2 hover:shadow-md transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative h-[200px] md:h-full">
                  <Image
                    src={images[index % images.length]}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-2">
                  <CardHeader className=" pb-3">
                    <CardTitle className="text-lg text-emerald-700">
                      {meal.name}
                    </CardTitle>
                    <CardDescription>Meal {index + 1}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs">Calories</div>
                        <div className="font-medium">
                          {meal.calories.toFixed(1)} kcal
                        </div>
                        <Progress
                          value={Math.min(meal.calories / 2, 100)}
                          className="h-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Carbohydrates</div>
                        <div className="font-medium">
                          {meal.carbohydrates.toFixed(1)}g
                        </div>
                        <Progress
                          value={Math.min(meal.carbohydrates * 3, 100)}
                          className="h-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Protein</div>
                        <div className="font-medium">
                          {meal.protein.toFixed(1)}g
                        </div>
                        <Progress
                          value={Math.min(meal.protein * 5, 100)}
                          className="h-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Fats</div>
                        <div className="font-medium">
                          {meal.fats.toFixed(1)}g
                        </div>
                        <Progress
                          value={Math.min(meal.fats * 5, 100)}
                          className="h-1.5"
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs">Sugar</div>
                        <div className="font-medium">
                          {meal.sugar.toFixed(1)}g
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Fiber</div>
                        <div className="font-medium">
                          {Number.parseFloat(meal.fibre).toFixed(1)}g
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Sodium</div>
                        <div className="font-medium">
                          {meal.sodium.toFixed(1)}mg
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Calcium</div>
                        <div className="font-medium">
                          {meal.calcium.toFixed(1)}mg
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs">Iron</div>
                        <div className="font-medium">
                          {meal.iron.toFixed(1)}mg
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Vitamin C</div>
                        <div className="font-medium">
                          {meal.vitaminC.toFixed(1)}mg
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Folate</div>
                        <div className="font-medium">
                          {meal.folate.toFixed(1)}μg
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
