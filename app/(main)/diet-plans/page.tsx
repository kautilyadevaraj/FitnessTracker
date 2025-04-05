"use client";
import { Search } from "lucide-react";
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
import PlaceholderImage from "@/public/placeholder.png"
import Link from "next/link";

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
      return <div className="text-center py-10">Loading...</div>;
    }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Diet Plans</h1>
          <p className="text-muted-foreground">
            Discover diet plans tailored to your fitness goals and preferences.
          </p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search diet plans..."
              className="w-full pl-8"
            />
          </div>
          <Button>Create with AI</Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weight-loss">Easy</TabsTrigger>
            <TabsTrigger value="muscle-gain">Medium</TabsTrigger>
            <TabsTrigger value="wellness">Hard</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans.map((plan) => (
                <DietPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weight-loss" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Easy")
                .map((plan) => (
                  <DietPlanCard key={plan.id} plan={plan} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="muscle-gain" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Medium")
                .map((plan) => (
                  <DietPlanCard key={plan.id} plan={plan} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="wellness" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dietPlans
                .filter((plan) => plan.difficulty === "Hard")
                .map((plan) => (
                  <DietPlanCard key={plan.id} plan={plan} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Trending Diet Plans
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dietPlans.slice(0,4).map((plan) => (
              <TrendingDietPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DietPlanCard({ plan }: { plan: DietPlan }) {
  return (
    <Card className="overflow-hidden ">
      <div className="relative h-48 w-full">
        <Image
          src={PlaceholderImage}
          alt={plan.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {plan.difficulty === "Easy"
            ? "Easy"
            : plan.difficulty === "Medium"
            ? "Medium"
            : "Hard"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{plan.duration} days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Difficulty</span>
            <span className="font-medium">{plan.difficulty}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Meals</span>
            <span className="font-medium">{plan.mealsPerDay} per day</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Rating</span>
            <span className="font-medium">{plan.rating}/5</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/diet-plans/${plan.id}`} className="w-full">
          <Button size="sm" className="w-full">
            View Diet Plan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function TrendingDietPlanCard({ plan }: { plan: DietPlan }) {
  return (
    <Link href={`/diet-plans/${plan.id}`}>
      <Card className="overflow-hidden">
        <div className="relative h-36 w-full">
          <Image
            src={PlaceholderImage}
            alt={plan.name}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader className="p-3">
          <CardTitle className="text-base">{plan.name}</CardTitle>
        </CardHeader>
        <CardFooter className="p-3 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{plan.rating}/5</span>
            <span className="mx-2">•</span>
            <span>{plan.duration} days</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
