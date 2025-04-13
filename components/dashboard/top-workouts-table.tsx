"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export function TopWorkoutsTable() {
  const [sortField, setSortField] = useState("completions");
  const [sortDirection, setSortDirection] = useState("desc");

  // In a real app, this data would come from your database
  const topWorkouts = [
    {
      id: "1",
      name: "Full Body HIIT",
      category: "Cardio",
      completions: 8,
      calories: 450,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Upper Body Strength",
      category: "Strength",
      completions: 6,
      calories: 380,
      rating: 4.5,
    },
    {
      id: "3",
      name: "Core Crusher",
      category: "Strength",
      completions: 5,
      calories: 320,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Leg Day",
      category: "Strength",
      completions: 4,
      calories: 410,
      rating: 4.6,
    },
    {
      id: "5",
      name: "Morning Yoga",
      category: "Flexibility",
      completions: 3,
      calories: 220,
      rating: 4.9,
    },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedWorkouts = [...topWorkouts].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];

    if (sortDirection === "asc") {
      return fieldA < fieldB ? -1 : 1;
    } else {
      return fieldA > fieldB ? -1 : 1;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Top Workouts</CardTitle>
        <CardDescription>Your most completed workout routines</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workout</TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("completions")}
              >
                <div className="flex items-center">
                  Completions
                  {sortField === "completions" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("calories")}
              >
                <div className="flex items-center">
                  Calories
                  {sortField === "calories" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center">
                  Rating
                  {sortField === "rating" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWorkouts.map((workout) => (
              <TableRow
                key={workout.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <TableCell className="font-medium">{workout.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(workout.category)}
                  >
                    {workout.category}
                  </Badge>
                </TableCell>
                <TableCell>{workout.completions}</TableCell>
                <TableCell>{workout.calories}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    {workout.rating}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
