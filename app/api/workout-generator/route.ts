import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
    try {
        const prompt = await req.json();
        const result = await generateText({
          model: google("gemini-2.0-flash-lite-preview-02-05"),
          prompt: prompt
        });

        console.log(result);

        return NextResponse.json(
          {
            message: "Onboarding data saved successfully!",
            data: result,
          },
          { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
              { message: "Something went wrong. Please try again." },
              { status: 500 }
            );
    }
}
