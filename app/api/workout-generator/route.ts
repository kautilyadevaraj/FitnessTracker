import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import * as z from "zod";

// Create the Google Gemini AI model instance
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function GET() {
  return NextResponse.json({ message: "API is working" }, { status: 200 });
}

interface ExerciseDetail {
  name: string;
  equipment: string | null;
  targetedAreas: string | null;
  videoURL: string | null;
}

// Define a schema to validate the user's fitness data from the PhysicalFitness table
const fitnessSchema = z.object({
  height: z.number(),
  weight: z.number(),
  fitnessLevel: z.string(),
  primaryGoal: z.string(),
  age: z.number(),
  gender: z.string(),
  workoutDuration: z.number(),
  workoutLocation: z.string(),
  workoutsPerWeek: z.number(),
});

// The route handler for generating workout plans
export async function POST(req: Request) {
  try {
    const input = await req.json();
    // Fetch the session to get the user's email
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;

    // Query the PhysicalFitness table for the user's fitness data using email as key
    const fitnessData = await db.physicalFitness.findUnique({
      where: { userEmail },
    });

    if (!fitnessData) {
      return NextResponse.json(
        { error: "Fitness data not found for the user." },
        { status: 404 }
      );
    }

    // Validate the retrieved fitness data using zod
    const validatedFitness = fitnessSchema.parse(fitnessData);
    // Query the Exercise table for exercises that match the user's workout location
    const exercises: ExerciseDetail[] = await db.exerciseDetails.findMany({
      where: { category: validatedFitness.workoutLocation },
      select: {
        name: true,
        equipment: true,
        targetedAreas: true,
        videoURL: true,
      },
    });
    // Build a comma-separated list of exercise names for the prompt
    const exerciseList = exercises.map((ex) => ex.name).join(", ");
    const exerciseLinks = exercises.map((ex) => ex.videoURL).join(",");
    // Construct the prompt for Gemini
    const prompt = `Generate a personalized workout plan for a user with the following details:
- Age: ${validatedFitness.age}
- Gender: ${validatedFitness.gender}
- Height: ${validatedFitness.height} cm
- Weight: ${validatedFitness.weight} kg
- Fitness Level: ${validatedFitness.fitnessLevel}
- Primary Goal: ${validatedFitness.primaryGoal}
- Workout Duration: ${validatedFitness.workoutDuration} minutes
- Workouts Per Week: ${validatedFitness.workoutsPerWeek}
- Workout Setting: ${validatedFitness.workoutLocation}

Available exercises for ${validatedFitness.workoutLocation} workouts: ${exerciseList}.
The Links to all the exercises in the same order are: ${exerciseLinks}
Give a good 2-3 word name to the workout.

This is the prompt entered by the user - ${input.preferences}

Return the workout plan as a structured JSON object with the following format:
{
  "routineName": "User's Custom Workout",
  "noOfExercises": <number>,
  "estimatedDuration": "<duration in minutes, eg: 30 mins(no need of seconds)>",
  "category": "<beginner, intermediate or advanced>",
  "exercises": {
      "1": {
          "name": "<Exercise Name>",
          "equipment": "<Equipment Needed>",
          "estimatedTime": "<Estimated Time, eg: 3 mins(no need of seconds)>",
          "repsAndSets": "Number of Reps and Sets",
          "targetedArea": "<Targeted Body Area>",
          "benefits": "<Some benefits - 2 sentences>",
          "videoURL": "<URL>"
      },
      "2": { ... },
      ...
  }
}`;

    // Call Gemini API to generate the workout plan
    const result = await generateText({
      model: google("gemini-2.0-flash-lite-preview-02-05"),
      prompt: prompt,
    });

    return NextResponse.json(
      { message: "Workout plan generated successfully", plan: result},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
