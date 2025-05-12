import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/user/update/route";
import { db } from "@/lib/prisma";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  db: {
    user: {
      update: jest.fn(),
    },
  },
}));

// Mock console.error to keep test output clean
jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/user/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    id: "user_123",
    name: "Updated Name",
    username: "updated_user",
    email: "updated@example.com",
    image: "https://example.com/new-image.jpg",
  };

  it("should successfully update user with valid data (200)", async () => {
    (db.user.update as jest.Mock).mockResolvedValueOnce(validPayload);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.user).toEqual(validPayload);
        expect(db.user.update).toHaveBeenCalledWith({
          where: { id: "user_123" },
          data: {
            name: "Updated Name",
            username: "updated_user",
            email: "updated@example.com",
            image: "https://example.com/new-image.jpg",
          },
        });
      },
    });
  });

  it("should return 400 when missing required fields", async () => {
    const invalidPayloads = [
      { email: "updated@example.com" }, // Missing id
      { id: "user_123" }, // Missing email
      {}, // Missing both
    ];

    for (const payload of invalidPayloads) {
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          expect(response.status).toBe(400);
          const data = await response.json();
          expect(data.error).toBe("Missing required fields");
          expect(db.user.update).not.toHaveBeenCalled();
        },
      });
    }
  });

  it("should return 500 on database error", async () => {
    (db.user.update as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Internal Server Error");
        expect(console.error).toHaveBeenCalledWith(
          "Update error:",
          expect.any(Error)
        );
      },
    });
  });

  it("should handle partial updates correctly", async () => {
    const partialPayload = {
      id: "user_123",
      email: "partial@example.com",
      name: "Partial Update",
    };

    (db.user.update as jest.Mock).mockResolvedValueOnce({
      ...partialPayload,
      username: null,
      image: null,
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partialPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user).toEqual({
          ...partialPayload,
          username: null,
          image: null,
        });
        expect(db.user.update).toHaveBeenCalledWith({
          where: { id: "user_123" },
          data: {
            email: "partial@example.com",
            name: "Partial Update",
            username: undefined, // or null, depending on your implementation
            image: undefined, // or null
          },
        });
      },
    });
  });
});
