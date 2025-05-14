import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/diet-plans/save-diet-plan/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  db: {
    dietPlan: {
      create: jest.fn(),
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/diet-plans/save-diet-plan", () => {
  const validPayload = {
    name: "Test Plan",
    description: "Test Description",
    duration: 7,
    meals: [{ day: 1, meals: [{ name: "Dish 1" }] }],
    mealsPerDay: 3,
    difficulty: "Easy",
    rating: 4.5,
    totalCalories: 2000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });
  });

  it("should save valid diet plan", async () => {
    (db.dietPlan.create as jest.Mock).mockResolvedValue(validPayload);

    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        expect(response.status).toBe(201);
        expect(await response.json()).toHaveProperty("message");
      },
    });
  });

  it("should reject missing fields", async () => {
    await testApiHandler({
      appHandler: appHandler,
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
});
