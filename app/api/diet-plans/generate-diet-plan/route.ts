import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function GET() {
  return NextResponse.json({ message: "API is working" }, { status: 200 });
}

interface DishDetail {
  name: string;
  calories: number | null;
  carbohydrates: number | null;
  protein: number | null;
  fats: number | null;
  sugar: number | null;
  fibre: string | null;
  sodium: number | null;
  calcium: number | null;
  iron: number | null;
  vitaminC: number | null;
  folate: number | null;
  ingredients: string | null;
}

export async function POST(req: Request) {
  try {
    const input = await req.json();
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;

    const dishes: DishDetail[] = await db.dish.findMany({
      select: {
        name: true,
        calories: true,
        carbohydrates: true,
        protein: true,
        fats: true,
        sugar: true,
        fibre: true,
        sodium: true,
        calcium: true,
        iron: true,
        vitaminC: true,
        folate: true,
        ingredients: true,
      },
    });

    const dishList = dishes
      .map((dish) => {
        return `
Dish Name: ${dish.name}
Calories: ${dish.calories}
Carbohydrates: ${dish.carbohydrates}g
Protein: ${dish.protein}g
Fats: ${dish.fats}g
Sugar: ${dish.sugar}g
Fibre: ${dish.fibre}g
Sodium: ${dish.sodium}mg
Calcium: ${dish.calcium}mg
Iron: ${dish.iron}mg
Vitamin C: ${dish.vitaminC}mg
Folate: ${dish.folate}mcg
Ingredients: ${dish.ingredients}
----------------------------------------`;
      })
      .join("\n");

    const prompt = `Create a personalized diet plan using the following dishes: ${dishList}. This is the user's requirement : ${input}. Structure the response as JSON matching this exact format:  

{  
    'id': 'UUIDv4',  
    'name': 'Plan Name (A nice catchy name or 2 or 3 words)',  
    'description': '7-day description',  
    'duration': 7,  
    'meals': [  
        {  
            'day': 1,  
            'meals': [  
                {  
                    'name': 'Dish Name',  
                    'calories': [exact decimal],  
                    'carbohydrates': [exact decimal],  
                    'protein': [exact decimal],  
                    'fats': [exact decimal],  
                    'sugar': [exact decimal],  
                    'fibre': "[string value]",  
                    'sodium': [exact decimal],  
                    'calcium': [exact decimal],  
                    'iron': [exact decimal],  
                    'vitaminC': [exact decimal],  
                    'folate': [exact decimal],  
                    'ingredients': [comma separated string values (the database has null value but you need to generate the ingredients on your own)]  
                },  
                ... // 3 meals/day  
            ]  
        },  
        ... // 7 days  
    ],  
    'mealsPerDay': 3,  
    'difficulty': 'Easy',  
    'rating': 4.6  
}  

Requirements:  
1. Preserve all nutritional field names in lowercase  
2. Maintain original decimal precision from dish data  
3. Follow exact field order: calories → carbohydrates → protein → fats → sugar → fibre → sodium → calcium → iron → vitaminC → folate  
4. Keep 'fibre' as string (e.g., "2.57")
5. Use UUIDv4 format for id`;

    const result = await generateText({
      model: google("gemini-2.0-flash-lite-preview-02-05"),
      prompt: prompt,
    });

    return NextResponse.json(
      {
        message: "Diet plan generated successfully",
        plan: { userEmail: userEmail, ...result },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
