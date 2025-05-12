import { prisma } from "./jest.setup";

describe("🧑‍💼 User Core Flow", () => {
  it("creates user with email and password", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user1@test.com",
        password: "securepass",
      },
    });
    expect(user.id).toBeDefined();
    expect(user.email).toBe("user1@test.com");
  });

  it("rejects duplicate user email", async () => {
    await prisma.user.create({
      data: { email: "duplicate@test.com", password: "123" },
    });

    await expect(
      prisma.user.create({
        data: { email: "duplicate@test.com", password: "456" },
      })
    ).rejects.toThrow();
  });

  it("updates user profile fields", async () => {
    const user = await prisma.user.create({
      data: { email: "update@test.com", password: "pw" },
    });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: "Updated Name", username: "newuser" },
    });

    expect(updated.name).toBe("Updated Name");
    expect(updated.username).toBe("newuser");
  });
});

describe("🔐 OAuth Accounts", () => {
  it("creates OAuth account for user", async () => {
    const user = await prisma.user.create({
      data: { email: "oauth@test.com", password: "pw" },
    });

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "gh_123",
      },
    });

    expect(account.id).toBeDefined();
    expect(account.provider).toBe("github");
  });

  it("enforces unique [provider, providerAccountId]", async () => {
    const user = await prisma.user.create({
      data: { email: "uniqueaccount@test.com", password: "pw" },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "g123",
      },
    });

    await expect(
      prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "google",
          providerAccountId: "g123", // duplicate
        },
      })
    ).rejects.toThrow();
  });
});

describe("🕒 Sessions", () => {
  it("creates session and retrieves by token", async () => {
    const user = await prisma.user.create({
      data: { email: "session@test.com", password: "pw" },
    });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: "token123",
        expires: new Date(Date.now() + 3600 * 1000),
      },
    });

    const found = await prisma.session.findUnique({
      where: { sessionToken: "token123" },
    });

    expect(found).not.toBeNull();
    expect(found!.userId).toBe(user.id);
  });
});

describe("📈 Physical Fitness", () => {
  it("creates physical fitness profile for user", async () => {
    const user = await prisma.user.create({
      data: { email: "fit@test.com", password: "pw" },
    });

    const fitness = await prisma.physicalFitness.create({
      data: {
        userEmail: user.email,
        height: 175,
        weight: 70,
        age: 25,
        gender: "Male",
        fitnessLevel: "Intermediate",
        primaryGoal: "Muscle Gain",
        workoutDuration: 45,
        workoutLocation: "Gym",
        workoutsPerWeek: 4,
      },
    });

    expect(fitness.userEmail).toBe(user.email);
    expect(fitness.weight).toBe(70);
  });

  it("enforces one-to-one physical fitness per user", async () => {
    const user = await prisma.user.create({
      data: { email: "onetoone@test.com", password: "pw" },
    });

    await prisma.physicalFitness.create({
      data: {
        userEmail: user.email,
        height: 180,
        weight: 80,
        age: 30,
        gender: "Female",
        fitnessLevel: "Beginner",
        primaryGoal: "Weight Loss",
        workoutDuration: 30,
        workoutLocation: "Home",
        workoutsPerWeek: 3,
      },
    });

    await expect(
      prisma.physicalFitness.create({
        data: {
          userEmail: user.email, // duplicate unique
          height: 160,
          weight: 50,
          age: 20,
          gender: "Female",
          fitnessLevel: "Advanced",
          primaryGoal: "Endurance",
          workoutDuration: 60,
          workoutLocation: "Gym",
          workoutsPerWeek: 5,
        },
      })
    ).rejects.toThrow();
  });
});

describe("🧨 Cascade Deletes", () => {
  it("deletes user and cascades to accounts, sessions, fitness", async () => {
    const user = await prisma.user.create({
      data: {
        email: "cascade@test.com",
        password: "pw",
        accounts: {
          create: {
            type: "oauth",
            provider: "discord",
            providerAccountId: "disc_123",
          },
        },
        sessions: {
          create: {
            sessionToken: "cas_token",
            expires: new Date(Date.now() + 3600 * 1000),
          },
        },
        physicalFitness: {
          create: {
            height: 180,
            weight: 70,
            age: 28,
            gender: "Male",
            fitnessLevel: "Advanced",
            primaryGoal: "Cutting",
            workoutDuration: 40,
            workoutLocation: "Gym",
            workoutsPerWeek: 5,
          },
        },
      },
    });

    await prisma.user.delete({ where: { id: user.id } });

    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });
    const session = await prisma.session.findFirst({
      where: { userId: user.id },
    });
    const fitness = await prisma.physicalFitness.findUnique({
      where: { userEmail: user.email },
    });

    expect(account).toBeNull();
    expect(session).toBeNull();
    expect(fitness).toBeNull();
  });
});
