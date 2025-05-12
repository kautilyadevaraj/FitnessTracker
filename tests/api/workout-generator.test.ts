import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/workout-generator/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { generateText } from "ai";

// Mock external dependencies
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  db: {
    physicalFitness: {
      findUnique: jest.fn(),
    },
    exerciseDetails: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

jest.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: () => ({
    // Mock Gemini model response
    "gemini-2.0-flash-lite-preview-02-05": jest.fn(),
  }),
}));

// Mock console.error
jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/workout-generator", () => {
  const mockUserEmail = "test@example.com";
  const mockFitnessData = {
    height: 180,
    weight: 75,
    fitnessLevel: "intermediate",
    primaryGoal: "muscle-gain",
    age: 25,
    gender: "male",
    workoutDuration: 60,
    workoutLocation: "gym",
    workoutsPerWeek: 4,
  };

  const mockExercises = [
    {
      name: "Bench Press",
      equipment: "Barbell",
      targetedAreas: "Chest",
      videoURL: "https://example.com/bench-press",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { email: mockUserEmail },
    });
  });

  it("should return 401 for unauthenticated users", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: "Build muscle" }),
        });

        expect(response.status).toBe(401);
      },
    });
  });

  it("should return 404 if fitness data not found", async () => {
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: "Build muscle" }),
        });

        expect(response.status).toBe(404);
      },
    });
  });

  it("should return 500 if no exercises found", async () => {
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(
      mockFitnessData
    );
    (db.exerciseDetails.findMany as jest.Mock).mockResolvedValue([]);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: "Build muscle" }),
        });

        expect(response.status).toBe(500);
      },
    });
  });

  it("should return 500 on AI generation failure", async () => {
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(
      mockFitnessData
    );
    (db.exerciseDetails.findMany as jest.Mock).mockResolvedValue(mockExercises);
    (generateText as jest.Mock).mockRejectedValue(new Error("AI Error"));

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: "Build muscle" }),
        });

        expect(response.status).toBe(500);
      },
    });
  });
});
