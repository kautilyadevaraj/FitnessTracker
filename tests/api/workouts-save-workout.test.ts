import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/workouts/save-workout/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  db: {
    workoutPlan: {
      create: jest.fn(),
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /workouts/save-workout", () => {
  const validPayload = {
    routineName: "Morning Routine",
    noOfExercises: 5,
    estimatedDuration: 45,
    exercises: ["Push-ups"],
    category: "strength",
    calories: 300,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });
  });

  it("should return 201 for valid request", async () => {
    (db.workoutPlan.create as jest.Mock).mockResolvedValue({
      id: "workout_123",
      ...validPayload,
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toMatchObject({
          message: "Workout plan saved successfully!",
        });
      },
    });
  });

  it("should return 400 for missing fields", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
      },
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
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(401);
      },
    });
  });
});
