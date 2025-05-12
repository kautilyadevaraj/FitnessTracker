import { prisma } from "./jest.setup";

describe("🔐 VerificationToken model", () => {
  it("creates a verification token", async () => {
    const token = await prisma.verificationToken.create({
      data: {
        identifier: "user@test.com",
        token: "verify-123",
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    expect(token.identifier).toBe("user@test.com");
    expect(token.token).toBe("verify-123");
  });

  it("enforces unique [identifier, token] combination", async () => {
    await prisma.verificationToken.create({
      data: {
        identifier: "dup@test.com",
        token: "dup-token",
        expires: new Date(Date.now() + 3600 * 1000),
      },
    });

    await expect(
      prisma.verificationToken.create({
        data: {
          identifier: "dup@test.com",
          token: "dup-token", // same combo
          expires: new Date(Date.now() + 3600 * 1000),
        },
      })
    ).rejects.toThrow();
  });

  it("looks up token by identifier", async () => {
    await prisma.verificationToken.create({
      data: {
        identifier: "lookup@test.com",
        token: "find-me-token",
        expires: new Date(Date.now() + 3600 * 1000),
      },
    });

    const found = await prisma.verificationToken.findFirst({
      where: { identifier: "lookup@test.com" },
    });

    expect(found).not.toBeNull();
    expect(found!.token).toBe("find-me-token");
  });
});
