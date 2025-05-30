import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const workouts = await db.workoutPlan.findMany({
      take: 5,
      orderBy: {
        noOfUsers: "desc", 
      },
    });

    return NextResponse.json({ workouts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}
