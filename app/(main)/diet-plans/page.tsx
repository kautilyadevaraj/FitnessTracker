"use client";
import { Search, Star, Clock, Utensils, BarChart3 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Loader from "@/components/Loader";

import Image1 from "@/public/food_1.jpeg";
import Image2 from "@/public/food_2.jpeg";
import Image3 from "@/public/food_3.jpeg";
import Image4 from "@/public/food_4.jpeg";
import Image5 from "@/public/food_5.jpeg";
import Image6 from "@/public/food_6.jpeg";
import Image7 from "@/public/food_7.jpeg";

const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7];

interface DietPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: any;
  mealsPerDay: number;
  difficulty: string;
  rating: number;
  userEmail: string;
}

const difficultyColors = {
  Easy: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
  Medium: "bg-amber-100 text-amber-800 hover:bg-amber-100/80",
  Hard: "bg-rose-100 text-rose-800 hover:bg-rose-100/80",
};
export default function DietPlansPage() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDietPlans() {
      try {
        const response = await fetch("/api/diet-plans/bulk");
        const data = await response.json();
        setDietPlans(data);
      } catch (error) {
        console.error("Failed to fetch diet plans:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDietPlans();
  }, []);  

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className="flex flex-col space-y-2  rounded-lg mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Discover Diet Plans
          </h1>
          <p className="text-muted-foreground">
            Find the perfect meal plan for your health goals
          </p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full my-2 md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search diet plans..."
              className="w-full pl-8"
            />
          </div>
          <Link href="/diet-plans/generate-dietplan">
            <Button>Create with AI</Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4  p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="weight-loss"
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              Easy
            </TabsTrigger>
            <TabsTrigger
              value="muscle-gain"
              className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
            >
              Medium
            </TabsTrigger>
            <TabsTrigger
              value="wellness"
              className="data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm"
            >
              Hard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans.map((plan, index) => (
                <DietPlanCard key={plan.id} plan={plan} imageIndex={index} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weight-loss" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Easy")
                .map((plan, index) => (
                  <DietPlanCard key={plan.id} plan={plan} imageIndex={index} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="muscle-gain" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Medium")
                .map((plan, index) => (
                  <DietPlanCard key={plan.id} plan={plan} imageIndex={index} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="wellness" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Hard")
                .map((plan, index) => (
                  <DietPlanCard key={plan.id} plan={plan} imageIndex={index} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <div className="flex items-center mb-4">
            <div className="h-8 w-1 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold tracking-tight">
              Trending Diet Plans
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dietPlans.slice(0, 4).map((plan, index) => (
              <TrendingDietPlanCard
                key={plan.id}
                plan={plan}
                imageIndex={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DietPlanCard({
  plan,
  imageIndex,
}: {
  plan: DietPlan;
  imageIndex: number;
}) {
  const imageSrc = images[imageIndex % images.length];
  const difficultyColor =
    difficultyColors[plan.difficulty as keyof typeof difficultyColors];

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={plan.name}
          fill
          className="object-cover"
          priority={imageIndex < 3}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className={`absolute top-2 right-2 ${difficultyColor}`}>
          {plan.difficulty}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{plan.duration} days</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-muted-foreground">Difficulty</span>
              <span className="font-medium">{plan.difficulty}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-muted-foreground">Meals</span>
              <span className="font-medium">{plan.mealsPerDay} per day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">{plan.rating}/5</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/diet-plans/${plan.id}`} className="w-full">
          <Button
            size="sm"
            className="w-full "
          >
            View Diet Plan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function TrendingDietPlanCard({
  plan,
  imageIndex,
}: {
  plan: DietPlan;
  imageIndex: number;
}) {
  const imageSrc = images[imageIndex % images.length];
  const difficultyColor =
    difficultyColors[plan.difficulty as keyof typeof difficultyColors];

  return (
    <Link href={`/diet-plans/${plan.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative h-36 w-full">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={plan.name}
            fill
            className="object-cover"
            priority={imageIndex < 4}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={`absolute bottom-2 right-2 ${difficultyColor}`}>
            {plan.difficulty}
          </Badge>
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 text-amber-400 mr-1" fill="currentColor" />
            {plan.rating}/5
          </div>
        </div>
        <CardHeader className="p-3">
          <CardTitle className="text-base">{plan.name}</CardTitle>
        </CardHeader>
        <CardFooter className="p-3 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{plan.duration} days</span>
            <span className="mx-2">•</span>
            <Utensils className="h-3 w-3 mr-1" />
            <span>{plan.mealsPerDay} meals</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
