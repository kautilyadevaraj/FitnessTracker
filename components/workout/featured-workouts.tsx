"use client";
import { useEffect, useState } from "react";
import { JsonValue } from "next-auth/adapters";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell } from "lucide-react";
import FeaturedWorkoutsSkeleton from "../skeleton/featured-workouts-skeleton";

import Image1 from "@/public/1.png";
import Image2 from "@/public/2.png";
import Image3 from "@/public/3.png";
import Image4 from "@/public/4.png";

const images = [Image1, Image2, Image3, Image4];

interface Workout {
  id: string;
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: JsonValue;
  noOfUsers: number;
  rating: number;
  category: string;
  userEmail: string;
  calories: number;
}

export default function FeaturedWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetch("/api/workouts/featured");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        if(!data.workouts)
          throw new Error("Invalid response from API")
        setWorkouts(data.workouts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchWorkouts();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Workouts</h2>
        <Link
          href="/workouts/featured"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <FeaturedWorkoutsSkeleton />
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {workouts.map((workout, index) => (
              <CarouselItem
                key={workout.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="relative h-[300px] overflow-hidden rounded-xl">
                  <Image
                    src={images[index % images.length]}
                    alt={workout.routineName}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <Badge
                      className="mb-2 capitalize"
                      variant={
                        workout.category.toLowerCase() === "beginner"
                          ? "beginner"
                          : workout.category.toLowerCase() === "intermediate"
                          ? "intermediate"
                          : "advanced"
                      }
                    >
                      {workout.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {workout.routineName}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{workout.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        <span>{workout.noOfExercises} exercises</span>
                      </div>
                    </div>
                    <Link href={`/workouts/${workout.id}`}>
                      <Button size="sm" className="w-full">
                        View Workout
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      )}
    </section>
  );
}
