import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/user/profile/route";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";

// Mock authentication module
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  db: {
    user: { findUnique: jest.fn() },
    physicalFitness: { findUnique: jest.fn() },
    workoutPlan: { findMany: jest.fn() },
    dietPlan: { findMany: jest.fn() },
  },
}));

// Mock console.error to keep test output clean
jest.spyOn(console, "error").mockImplementation(() => {});

describe("GET /api/user/profile", () => {
  const mockUserEmail = "test@example.com";
  const mockUserData = {
    id: "user_123",
    email: mockUserEmail,
    name: "Test User",
  };
  const mockFitnessData = { fitnessLevel: "Intermediate" };
  const mockWorkoutPlans = [{ id: 1, name: "Beginner Plan" }];
  const mockDietPlans = [{ id: 1, name: "Balanced Diet" }];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (db.user.findUnique as jest.Mock).mockResolvedValue(mockUserData);
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(
      mockFitnessData
    );
    (db.workoutPlan.findMany as jest.Mock).mockResolvedValue(mockWorkoutPlans);
    (db.dietPlan.findMany as jest.Mock).mockResolvedValue(mockDietPlans);
  });

  it("should return complete user profile data for authenticated user (200)", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { email: mockUserEmail },
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({
          user: mockUserData,
          physicalFitness: mockFitnessData,
          workoutPlans: mockWorkoutPlans,
          dietPlans: mockDietPlans,
        });

        // Verify database queries
        expect(db.user.findUnique).toHaveBeenCalledWith({
          where: { email: mockUserEmail },
        });
        expect(db.physicalFitness.findUnique).toHaveBeenCalledWith({
          where: { userEmail: mockUserEmail },
        });
        expect(db.workoutPlan.findMany).toHaveBeenCalledWith({
          where: { userEmail: mockUserEmail },
        });
        expect(db.dietPlan.findMany).toHaveBeenCalledWith({
          where: { userEmail: mockUserEmail },
        });
      },
    });
  });

  it("should return 401 for unauthenticated requests", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized");
        expect(db.user.findUnique).not.toHaveBeenCalled();
      },
    });
  });

  it("should handle partial data scenarios", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { email: mockUserEmail },
    });
    (db.physicalFitness.findUnique as jest.Mock).mockResolvedValue(null);
    (db.workoutPlan.findMany as jest.Mock).mockResolvedValue([]);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.physicalFitness).toBeNull();
        expect(data.workoutPlans).toEqual([]);
        expect(data.dietPlans).toEqual(mockDietPlans);
      },
    });
  });

  it("should return 500 on database error", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { email: mockUserEmail },
    });
    (db.user.findUnique as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Internal server error");
        expect(console.error).toHaveBeenCalledWith(
          "Error fetching user profile:",
          expect.any(Error)
        );
      },
    });
  });
});
