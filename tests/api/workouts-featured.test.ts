import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/workouts/featured/route"; // Import entire route module
import { db } from "@/lib/prisma";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  db: {
    workoutPlan: {
      findMany: jest.fn(),
    },
  },
}));

// Mock console.error
jest.spyOn(console, "error").mockImplementation(() => {});

describe("GET /api/workouts/featured", () => {
  const mockWorkouts = [
    { id: "w1", name: "Workout 1", noOfUsers: 100 },
    { id: "w2", name: "Workout 2", noOfUsers: 90 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return featured workouts with correct query (200)", async () => {
    (db.workoutPlan.findMany as jest.Mock).mockResolvedValue(mockWorkouts);

    await testApiHandler({
      appHandler, // Directly use imported module
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.workouts).toEqual(mockWorkouts);
        expect(db.workoutPlan.findMany).toHaveBeenCalledWith({
          take: 5,
          orderBy: { noOfUsers: "desc" },
        });
      },
    });
  });

  it("should return 500 on database error", async () => {
    (db.workoutPlan.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await testApiHandler({
      appHandler, // Directly use imported module
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Failed to fetch workouts");
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching workouts:",
          expect.any(Error)
        );
      },
    });
  });
});
