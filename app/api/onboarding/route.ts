import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import * as z from "zod";

const OnboardingSchema = z.object({
  age: z
    .string()
    .refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
      message: "Please enter a valid age.",
    }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender.",
  }),
  height: z
    .string()
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      { message: "Please enter a valid height." }
    ),
  weight: z
    .string()
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      { message: "Please enter a valid weight." }
    ),
  primaryGoal: z.enum(
    [
      "weight-loss",
      "muscle-gain",
      "endurance",
      "flexibility",
      "general-fitness",
    ],
    { required_error: "Please select a primary fitness goal." }
  ),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your current fitness level.",
  }),
  workoutsPerWeek: z
    .string()
    .min(1, { message: "Please select how many workouts per week." }),
  workoutDuration: z
    .string()
    .min(1, { message: "Please select your preferred workout duration." }),
  workoutLocation: z.enum(["home", "gym", "outdoors", "mixed"], {
    required_error: "Please select where you plan to work out.",
  }),
  additionalInfo: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Ensure the user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const body = await req.json();

    // Parse the incoming payload using our schema
    const {
      age,
      gender,
      height,
      weight,
      primaryGoal,
      fitnessLevel,
      workoutsPerWeek,
      workoutDuration,
      workoutLocation,
      additionalInfo,
    } = OnboardingSchema.parse(body);

    // Check if the user already has an onboarding entry
    const existingEntry = await db.physicalFitness.findUnique({
      where: { userEmail: userEmail || "" },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Onboarding data already exists." },
        { status: 409 }
      );
    }

    // Store the onboarding data, converting numeric strings as needed.
    const newFitnessData = await db.physicalFitness.create({
      data: {
        userEmail: userEmail || "",
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        primaryGoal,
        fitnessLevel,
        workoutsPerWeek: Number(workoutsPerWeek),
        workoutDuration: Number(workoutDuration),
        workoutLocation,
        additionalInfo,
      },
    });

    return NextResponse.json(
      { message: "Onboarding data saved successfully!", data: newFitnessData },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
