import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/diet-plans/bulk/route";
import { db } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  db: {
    dietPlan: {
      findMany: jest.fn(),
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});

describe("GET /diet-plans/bulk", () => {
  const mockPlans = [
    { id: "d1", name: "Plan 1", rating: 4.5 },
    { id: "d2", name: "Plan 2", rating: 4.0 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return diet plans ordered by rating", async () => {
    (db.dietPlan.findMany as jest.Mock).mockResolvedValue(mockPlans);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockPlans);
        expect(db.dietPlan.findMany).toHaveBeenCalledWith({
          take: 6,
          orderBy: { rating: "desc" },
        });
      },
    });
  });

  it("should handle database errors", async () => {
    (db.dietPlan.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Internal Server Error");
      },
    });
  });
});
