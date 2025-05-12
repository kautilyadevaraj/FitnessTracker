import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/onboarding/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

// Mock authentication module
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  db: {
    physicalFitness: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock console.error to keep test output clean
jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/onboarding", () => {
  const mockUserEmail = "test@example.com";
  const validPayload = {
    age: "25",
    gender: "male",
    height: "180",
    weight: "75",
    primaryGoal: "muscle-gain",
    fitnessLevel: "intermediate",
    workoutsPerWeek: "4",
    workoutDuration: "60",
    workoutLocation: "gym",
    additionalInfo: "Some additional info",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { email: mockUserEmail } });
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(null);
    (db.physicalFitness.create as jest.Mock).mockResolvedValue({
      id: 1,
      userEmail: mockUserEmail,
      age: 25,
      gender: "male",
      height: 180,
      weight: 75,
      primaryGoal: "muscle-gain",
      fitnessLevel: "intermediate",
      workoutsPerWeek: 4,
      workoutDuration: 60,
      workoutLocation: "gym",
      additionalInfo: "Some additional info",
    });
  });

  it("should save onboarding data successfully with valid input (201)", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe("Onboarding data saved successfully!");
        expect(data.data).toEqual({
          id: 1,
          userEmail: mockUserEmail,
          age: 25,
          gender: "male",
          height: 180,
          weight: 75,
          primaryGoal: "muscle-gain",
          fitnessLevel: "intermediate",
          workoutsPerWeek: 4,
          workoutDuration: 60,
          workoutLocation: "gym",
          additionalInfo: "Some additional info",
        });
        expect(db.physicalFitness.create).toHaveBeenCalledWith({
          data: {
            userEmail: mockUserEmail,
            age: 25,
            gender: "male",
            height: 180,
            weight: 75,
            primaryGoal: "muscle-gain",
            fitnessLevel: "intermediate",
            workoutsPerWeek: 4,
            workoutDuration: 60,
            workoutLocation: "gym",
            additionalInfo: "Some additional info",
          },
        });
      },
    });
  });

  it("should return 400 for invalid input", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            age: "invalid",
            gender: "invalid",
            height: "0",
            weight: "0",
          }),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toHaveProperty("errors");
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "Unauthorized" });
      },
    });
  });

  it("should return 409 if onboarding data exists", async () => {
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(409);
        expect(await response.json()).toEqual({
          error: "Onboarding data already exists.",
        });
      },
    });
  });

  it("should return 500 on database error", async () => {
    (db.physicalFitness.create as jest.Mock).mockRejectedValueOnce(
      new Error("DB error")
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
          message: "Something went wrong. Please try again.",
        });
      },
    });
  });
});
