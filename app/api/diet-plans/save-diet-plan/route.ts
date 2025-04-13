import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to save a diet plan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, duration, meals, mealsPerDay, difficulty, rating, totalCalories } =
      body;

    // Validate input
    if (
      !name ||
      !description ||
      !duration ||
      !meals ||
      !mealsPerDay ||
      !difficulty ||
      !rating ||
      !totalCalories
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Transform meals structure
    const transformedMeals = (
      meals as Array<{ day: number; meals: any[] }>
    ).map((dayPlan) => ({
      day: dayPlan.day,
      meals: dayPlan.meals.map((meal) => meal.name),
    }));

    // Create Prisma-compatible JSON
    const mealsJson: Prisma.InputJsonValue = transformedMeals;

    // Save to database
    const newDietPlan = await db.dietPlan.create({
      data: {
        name,
        description,
        duration,
        meals: mealsJson,
        mealsPerDay,
        difficulty,
        rating,
        userEmail: session.user.email,
        totalCalories
      },
    });

    return NextResponse.json(
      { message: "Diet plan saved successfully!", dietPlan: newDietPlan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving diet plan:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
