import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/user/route";
import { db } from "@/lib/prisma";
import { hash } from "bcrypt";

jest.mock("@/lib/prisma", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

describe("POST /api/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    username: "testuser",
    email: "test@example.com",
    password: "ValidPassword123",
  };

  it("should create user successfully with valid data (201)", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (db.user.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...validPayload,
      password: "hashed_password",
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.user).toEqual({
          id: 1,
          username: "testuser",
          email: "test@example.com",
        });
        expect(data.message).toBe("User created successfully!");
        expect(hash).toHaveBeenCalledWith("ValidPassword123", 10);
      },
    });
  });

  it("should return 409 when email exists", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValueOnce({
      email: validPayload.email,
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
        });

        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.message).toBe("User with this email already exists");
        expect(db.user.create).not.toHaveBeenCalled();
      },
    });
  });

  it("should return 500 for invalid input", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "a", // Invalid: too short
            email: "not-an-email",
            password: "short",
          }),
        });

        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.message).toBe("Something went wrong!");
        expect(db.user.findUnique).not.toHaveBeenCalled();
      },
    });
  });

  it("should return 500 on database error", async () => {
    (db.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error("DB error")
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
        expect(data.message).toBe("Something went wrong!");
      },
    });
  });
});
