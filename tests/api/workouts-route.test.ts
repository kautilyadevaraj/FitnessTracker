import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/workouts/route";
import { db } from "@/lib/prisma";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  db: {
    workoutPlan: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock console.error
jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/workout-plan", () => {
  const mockWorkout = {
    id: "workout_123",
    name: "Morning Routine",
    exercises: ["Push-ups", "Squats"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return workout plan with valid ID (200)", async () => {
    (db.workoutPlan.findUnique as jest.Mock).mockResolvedValue(mockWorkout);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workout_id: "workout_123" }),
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(mockWorkout);
        expect(db.workoutPlan.findUnique).toHaveBeenCalledWith({
          where: { id: "workout_123" },
        });
      },
    });
  });

  it("should return 400 when missing workout_id", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
          message: "Workout ID is required",
        });
      },
    });
  });

  it("should return 404 when workout not found", async () => {
    (db.workoutPlan.findUnique as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workout_id: "invalid_id" }),
        });

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({
          message: "Workout not found",
        });
      },
    });
  });

  it("should return 500 on database error", async () => {
    (db.workoutPlan.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workout_id: "workout_123" }),
        });

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
          message: "Internal Server Error",
        });
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching workout:",
          expect.any(Error)
        );
      },
    });
  });
});
