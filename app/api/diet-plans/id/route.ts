import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    const { diet_id } = body;

    const dietPlan = await db.dietPlan.findUnique({
        where: { id: diet_id },
      });

      if (!dietPlan) {
        return NextResponse.json(
          { error: "Diet plan not found" },
          { status: 404 }
        );
      }

      let mealsWithDetails = [];

      if (dietPlan.meals) {
        // Parse meals
        const parsedMeals =
          typeof dietPlan.meals === "string"
            ? JSON.parse(dietPlan.meals)
            : dietPlan.meals;

        for (const day of parsedMeals) {
          const mealDetails = await Promise.all(
            day.meals.map(async (dishName: string) => {
              const dish = await db.dish.findUnique({
                where: { name: dishName },
              });
              return dish ? dish : { name: dishName, error: "Dish not found" };
            })
          );
          mealsWithDetails.push({ day: day.day, meals: mealDetails });
        }
      }
      console.log({ ...dietPlan, meals: mealsWithDetails });
      return NextResponse.json({ ...dietPlan, meals: mealsWithDetails });
    }
   catch (error) {
    console.error("Error fetching Diet Plan:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
