import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await auth();;
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to save a workout plan." },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Parse request body
    const body = await req.json();
    console.log("Received body : ",body);
    const {
      routineName,
      noOfExercises,
      estimatedDuration,
      exercises,
      category,
      calories
    } = body;

    console.log(body);

    // Validate input
    if (
      !routineName ||
      !noOfExercises ||
      !estimatedDuration ||
      !exercises ||
      !category ||
      !calories
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Save workout plan to database
    const newWorkout = await db.workoutPlan.create({
      data: {
        routineName,
        noOfExercises,
        estimatedDuration,
        exercises,
        noOfUsers: 1, // Assuming a new plan starts with 1 user
        rating: 0, // Default rating
        category,
        userEmail,
        calories
      },
    });

    return NextResponse.json(
      { message: "Workout plan saved successfully!", workout: newWorkout },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving workout plan:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
