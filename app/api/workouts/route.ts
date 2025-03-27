import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    const { workout_id } = body;

    if (!workout_id) {
      return NextResponse.json(
        { message: "Workout ID is required" },
        { status: 400 }
      );
    }

    // Fetch the workout plan from the database
    const workout = await db.workoutPlan.findUnique({
      where: { id: workout_id },
    });

    if (!workout) {
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workout, { status: 200 });
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
