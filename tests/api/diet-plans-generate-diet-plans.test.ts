import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/diet-plans/generate-diet-plan/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { generateText } from "ai";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  db: {
    dish: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/diet-plans/generate-diet-plans", () => {
  const mockDishes = [
    {
      name: "Test Dish",
      calories: 500,
      protein: 30,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });
    (db.dish.findMany as jest.Mock).mockResolvedValue(mockDishes);
    (generateText as jest.Mock).mockResolvedValue({
      text: JSON.stringify({ name: "Generated Plan" }),
    });
  });

  it("should generate diet plan", async () => {
    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requirements: "High protein" }),
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toHaveProperty("plan");
      },
    });
  });

  it("should handle AI errors", async () => {
    (generateText as jest.Mock).mockRejectedValue(new Error("AI error"));

    await testApiHandler({
      appHandler: appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requirements: "High protein" }),
        });

        expect(response.status).toBe(500);
      },
    });
  });
});
