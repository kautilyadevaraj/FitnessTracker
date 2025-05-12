import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/workouts/recent/route";
import { db } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  db: {
    workoutPlan: {
      findMany: jest.fn(),
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("GET /workouts/recent", () => {
  const mockWorkouts = [
    { id: "w1", name: "Workout 1" },
    { id: "w2", name: "Workout 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with recent workouts", async () => {
    (db.workoutPlan.findMany as jest.Mock).mockResolvedValue(mockWorkouts);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.workouts).toEqual(mockWorkouts);
        expect(db.workoutPlan.findMany).toHaveBeenCalledWith({
          take: 6,
        });
      },
    });
  });

  it("should return 500 on database error", async () => {
    (db.workoutPlan.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.message).toBe("Failed to fetch workouts");
      },
    });
  });
});
