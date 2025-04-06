// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const user = await db.user.findUnique({
      where: { email: userEmail },
    });

    const physicalFitness = await db.physicalFitness.findUnique({
      where: { userEmail },
    });

    const workoutPlans = await db.workoutPlan.findMany({
      where: { userEmail },
    });

    const dietPlans = await db.dietPlan.findMany({
      where: { userEmail },
    });

    return NextResponse.json({
      user,
      physicalFitness,
      workoutPlans,
      dietPlans,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
