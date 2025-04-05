import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
      const dietPlans = await db.dietPlan.findMany({
        take: 6,
        orderBy: { rating: "desc" },
      });
      return NextResponse.json(dietPlans.length > 0 ? dietPlans : []);
    }
   catch (error) {
    console.error("Error fetching diet plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
