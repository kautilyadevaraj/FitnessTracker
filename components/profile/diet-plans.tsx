import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DietPlan, Dish } from "@prisma/client";
import { Utensils, Plus, Star, Calendar } from "lucide-react";
import Link from "next/link";

interface Meals{
  day: number;
  meals: string[];
}

interface DietPlansProps {
  dietPlans: DietPlan[];
}

export function DietPlans({ dietPlans }: DietPlansProps) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-orange-900/20 to-amber-900/20 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Diet Plans
          </CardTitle>
          <CardDescription>Your created meal plans</CardDescription>
        </div>
        <Link href="/diet-plans/generate-dietplan">
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Plan</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dietPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border p-4 hover:bg-accent/50 transition-colors bg-gradient-to-r from-orange-900/10 to-transparent"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {plan.description}
                  </p>
                </div>
                <Badge
                  className={`
                  ${
                    plan.difficulty === "Easy"
                      ? "bg-green-600 hover:bg-green-500"
                      : plan.difficulty === "Medium"
                      ? "bg-amber-600 hover:bg-amber-500"
                      : "bg-red-600 hover:bg-red-500"
                  } border-none`}
                >
                  {plan.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">
                  <Utensils className="h-4 w-4" />
                  <span>{plan.mealsPerDay} meals/day</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  <Calendar className="h-4 w-4" />
                  <span>{plan.duration} days</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {(plan.meals as unknown as Meals[]).map(
                  (meal, index: number) => (
                    <div
                      key={index}
                      className="bg-background/30 backdrop-blur-sm rounded-md p-3 border border-orange-500/20"
                    >
                      <div className="font-medium text-orange-400">
                        Day {meal.day}
                      </div>
                      <ul>
                        {meal.meals.map((dish: String, index: number) => (
                          <li key={index}>{dish}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>

              <div className="flex items-center mt-4 pt-2 border-t border-border/50 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(plan.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1">{plan.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}

          {dietPlans.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Utensils className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>You haven't created any diet plans yet</p>
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                <Plus className="h-4 w-4" />
                Create your first plan
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
