import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/diet-plans/id/route"; // Adjust path if needed
import { db } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  db: {
    dietPlan: {
      findUnique: jest.fn(),
    },
    dish: {
      findUnique: jest.fn(),
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /diet-plans/id", () => {
  const mockPlan = {
    id: "plan_123",
    meals: JSON.stringify([{ day: 1, meals: ["Dish 1"] }]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (db.dietPlan.findUnique as jest.Mock).mockResolvedValue(mockPlan);
    (db.dish.findUnique as jest.Mock).mockResolvedValue({
      name: "Dish 1",
      calories: 500,
    });
  });

  it("should return enriched diet plan", async () => {
    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diet_id: "plan_123" }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toMatchObject({
          id: "plan_123",
          meals: expect.any(Array),
        });
      },
    });
  });

  it("should handle missing diet plan", async () => {
    (db.dietPlan.findUnique as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diet_id: "invalid_id" }),
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: "Diet plan not found" });
      },
    });
  });

  it("should handle dish not found", async () => {
    (db.dish.findUnique as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diet_id: "plan_123" }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.meals[0].meals[0]).toMatchObject({
          name: "Dish 1",
          error: "Dish not found",
        });
      },
    });
  });

  it("should handle DB errors", async () => {
    (db.dietPlan.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diet_id: "plan_123" }),
        });

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ message: "Internal Server Error" });
      },
    });
  });
});
