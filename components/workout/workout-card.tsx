import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell, Star, Users } from "lucide-react";
import PlaceHolderImage from "@/public/placeholder.png";
import Image from "next/image";
import { JsonValue } from "next-auth/adapters";
import Link from "next/link";

export interface WorkoutCardProps {
  id: string;
  routineName: string;
  noOfExercises: number;
  estimatedDuration: string;
  exercises: JsonValue;
  noOfUsers: number;
  rating: number;
  category: string;
  userEmail: string;
}

export default function WorkoutCard({
  workout,
}: {
  workout: WorkoutCardProps;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        <Image
          src={PlaceHolderImage}
          alt={workout.routineName}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <Badge
          className="absolute top-2 right-2 capitalize"
          variant={
            workout.category === "beginner"
              ? "beginner"
              : workout.category === "intermediate"
              ? "intermediate"
              : "advanced"
          }
        >
          {workout.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{workout.routineName}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{workout.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{workout.noOfExercises} exercises</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {workout.noOfUsers.toLocaleString()} users
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {workout.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/workouts/${workout.id}`}>
          <Button size="sm" className="w-full">
            View Workout
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
