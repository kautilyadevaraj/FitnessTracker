"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Star, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Loader from "@/components/Loader";

// Sample prompts for users to try
const samplePrompts = [
  "Create a 7-day vegetarian meal plan with high protein options",
  "Design a Mediterranean diet plan for weight loss",
  "I need a low-carb meal plan for diabetes management",
  "Generate a meal plan for muscle building with 2500 calories per day",
];

// Type definitions for the diet plan data structure
interface Meal {
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
  ingredients: string;
}

interface DayMeals {
  day: number;
  meals: Meal[];
}

interface DietPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: DayMeals[];
  mealsPerDay: number;
  difficulty: string;
  rating: number;
  userEmail: string;
  totalCalories: number;
}

export default function FitnessTracker() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [editingMeal, setEditingMeal] = useState<{
    day: number;
    index: number;
    meal: Meal;
  } | null>(null);

  // Function to handle prompt submission
  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/diet-plans/generate-diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prompt }),
      });

      if (!response.ok) throw new Error("Failed to fetch diet plan");

      const data = await response.json();
      if (!data.plan || !data.plan.text)
        throw new Error("Invalid response from API");
      const rawText = data.plan.text;
      const jsonText = rawText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      const parsedPlan: DietPlan = JSON.parse(jsonText);

      setDietPlan(parsedPlan as DietPlan);
      toast.success("Diet plan generated!");
    } catch (error) {
      toast.error(
        (error as string) || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle selecting a sample prompt
  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  // Function to update a meal in the diet plan
  const updateMeal = (day: number, mealIndex: number, updatedMeal: Meal) => {
    if (!dietPlan) return;

    const updatedDietPlan = { ...dietPlan };
    const dayIndex = updatedDietPlan.meals.findIndex((m) => m.day === day);

    if (dayIndex !== -1) {
      updatedDietPlan.meals[dayIndex].meals[mealIndex] = updatedMeal;
      setDietPlan(updatedDietPlan);
    }

    setEditingMeal(null);
  };

  const handleSaveDietPlan = async () => {
    if (!dietPlan) {
      toast.error("No diet plan to save.");
      return;
    }

    try {
      const response = await fetch("/api/diet-plans/save-diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dietPlan),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save diet plan.");
      }

      toast.success("Diet Plan saved successfully!");
    } catch (error) {
      console.error("Error saving diet plan:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container p-6">
        <div className="grid gap-6">
          {isLoading ? (
            <div className="h-[calc(100vh-80px)] w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {!dietPlan ? (
                <div>
                  <div className="flex flex-col items-center text-center p-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                      Diet Plan Generator
                    </h2>
                    <p className="text-muted-foreground max-w-[600px] mt-2">
                      Describe your dietary goals and preferences, and we'll
                      create a personalized meal plan for you.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                    {samplePrompts.map((samplePrompt, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSelectPrompt(samplePrompt)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Try this prompt
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{samplePrompt}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full mx-auto w-full p-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-3xl flex items-center justify-between">
                            {dietPlan.name}
                            <Button
                              onClick={handleSaveDietPlan}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save Diet Plan
                            </Button>
                          </CardTitle>
                          <CardDescription>
                            {dietPlan.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Badge
                            variant={
                              dietPlan.difficulty.toLocaleLowerCase() === "easy"
                                ? "easy"
                                : dietPlan.difficulty.toLocaleLowerCase() ===
                                  "medium"
                                ? "medium"
                                : "hard"
                            }
                          >
                            {dietPlan.difficulty}
                          </Badge>
                          <Badge>{dietPlan.duration} days</Badge>
                          <Badge variant="outline">
                            {dietPlan.rating}{" "}
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 pl-1" />
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="1">
                        <TabsList className="grid grid-cols-7 mb-4">
                          {Array.from({ length: 7 }, (_, i) => (
                            <TabsTrigger key={i} value={(i + 1).toString()}>
                              Day {i + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {Array.from({ length: 7 }, (_, i) => {
                          const day = i + 1;
                          const dayMeals = dietPlan.meals.find(
                            (m) => m.day === day
                          );

                          return (
                            <TabsContent key={i} value={day.toString()}>
                              <div className="grid gap-4 md:grid-cols-3">
                                {dayMeals?.meals.map((meal, mealIndex) => (
                                  <Card key={mealIndex}>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-xl text-green-600 font-semibold">
                                        {meal.name}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                      <div className="flex flex-col gap-2">
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                              Calories
                                            </span>
                                            <span className="text-sm ">
                                              {meal.calories.toFixed(1)} kcal
                                            </span>
                                          </div>
                                          <Progress
                                            value={Math.min(meal.calories)}
                                            max={400}
                                            className="h-2"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                              Carbohydrates
                                            </span>
                                            <span className="text-sm ">
                                              {meal.carbohydrates.toFixed(1)} g
                                            </span>
                                          </div>
                                          <Progress
                                            value={Math.min(meal.carbohydrates)}
                                            max={275}
                                            className="h-2"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                              Protein
                                            </span>
                                            <span className="text-sm ">
                                              {meal.protein.toFixed(1)} g
                                            </span>
                                          </div>
                                          <Progress
                                            value={Math.min(meal.protein)}
                                            max={100}
                                            className="h-2"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                              Fats
                                            </span>
                                            <span className="text-sm ">
                                              {meal.fats.toFixed(1)} g
                                            </span>
                                          </div>
                                          <Progress
                                            value={Math.min(meal.fats)}
                                            max={60}
                                            className="h-2"
                                          />
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium">
                                            Ingredients
                                          </span>
                                          <br />
                                          <p className="text-sm">
                                            {meal.ingredients}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                    <CardFooter>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              setEditingMeal({
                                                day,
                                                index: mealIndex,
                                                meal,
                                              })
                                            }
                                          >
                                            Edit Meal
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Edit Meal</DialogTitle>
                                          </DialogHeader>
                                          {editingMeal && (
                                            <div className="grid gap-4 py-4">
                                              <div className="grid gap-2">
                                                <Label htmlFor="meal-name">
                                                  Meal Name
                                                </Label>
                                                <Input
                                                  id="meal-name"
                                                  value={editingMeal.meal.name}
                                                  onChange={(e) =>
                                                    setEditingMeal({
                                                      ...editingMeal,
                                                      meal: {
                                                        ...editingMeal.meal,
                                                        name: e.target.value,
                                                      },
                                                    })
                                                  }
                                                />
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                  <Label htmlFor="calories">
                                                    Calories
                                                  </Label>
                                                  <Input
                                                    id="calories"
                                                    type="number"
                                                    value={
                                                      editingMeal.meal.calories
                                                    }
                                                    onChange={(e) =>
                                                      setEditingMeal({
                                                        ...editingMeal,
                                                        meal: {
                                                          ...editingMeal.meal,
                                                          calories:
                                                            Number.parseFloat(
                                                              e.target.value
                                                            ),
                                                        },
                                                      })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="carbs">
                                                    Carbs (g)
                                                  </Label>
                                                  <Input
                                                    id="carbs"
                                                    type="number"
                                                    value={
                                                      editingMeal.meal
                                                        .carbohydrates
                                                    }
                                                    onChange={(e) =>
                                                      setEditingMeal({
                                                        ...editingMeal,
                                                        meal: {
                                                          ...editingMeal.meal,
                                                          carbohydrates:
                                                            Number.parseFloat(
                                                              e.target.value
                                                            ),
                                                        },
                                                      })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="protein">
                                                    Protein (g)
                                                  </Label>
                                                  <Input
                                                    id="protein"
                                                    type="number"
                                                    value={
                                                      editingMeal.meal.protein
                                                    }
                                                    onChange={(e) =>
                                                      setEditingMeal({
                                                        ...editingMeal,
                                                        meal: {
                                                          ...editingMeal.meal,
                                                          protein:
                                                            Number.parseFloat(
                                                              e.target.value
                                                            ),
                                                        },
                                                      })
                                                    }
                                                  />
                                                </div>
                                                <div className="grid gap-2">
                                                  <Label htmlFor="fat">
                                                    Fat (g)
                                                  </Label>
                                                  <Input
                                                    id="fat"
                                                    type="number"
                                                    value={
                                                      editingMeal.meal.fats
                                                    }
                                                    onChange={(e) =>
                                                      setEditingMeal({
                                                        ...editingMeal,
                                                        meal: {
                                                          ...editingMeal.meal,
                                                          fats: Number.parseFloat(
                                                            e.target.value
                                                          ),
                                                        },
                                                      })
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              <Button
                                                onClick={() => {
                                                  if (editingMeal) {
                                                    updateMeal(
                                                      editingMeal.day,
                                                      editingMeal.index,
                                                      editingMeal.meal
                                                    );
                                                  }
                                                }}
                                              >
                                                Save Changes
                                              </Button>
                                            </div>
                                          )}
                                        </DialogContent>
                                      </Dialog>
                                    </CardFooter>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>
                          );
                        })}
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 border-t bg-background pt-2">
        <div className="container w-full mx-auto">
          <div className="relative">
            <Textarea
              placeholder="Describe your diet plan requirements..."
              className="min-h-[80px] resize-none pr-16 pb-8"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey === false) {
                  e.preventDefault();
                  handleSubmitPrompt();
                }
              }}
            />
            <Button
              className="absolute bottom-2 right-2"
              size="icon"
              disabled={isLoading || !prompt.trim()}
              onClick={handleSubmitPrompt}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to submit. Shift + Enter for a new line.
          </p>
        </div>
      </div>
    </div>
  );
}
