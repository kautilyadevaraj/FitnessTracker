import { prisma } from "./jest.setup";

describe("📊 WorkoutCompletion model", () => {
  it("logs a workout completion for valid user and workout", async () => {
    const user = await prisma.user.create({
      data: { email: "wcuser@test.com", password: "pw" },
    });

    const workout = await prisma.workoutPlan.create({
      data: {
        routineName: "Morning Cardio",
        noOfExercises: 5,
        estimatedDuration: "30m",
        exercises: [],
        noOfUsers: 0,
        rating: 4.3,
        category: "Cardio",
        calories: 300,
        userEmail: user.email,
      },
    });

    const completion = await prisma.workoutCompletion.create({
      data: {
        userEmail: user.email,
        workoutPlanId: workout.id,
        caloriesBurned: 320,
      },
    });

    expect(completion.caloriesBurned).toBe(320);
    expect(completion.workoutPlanId).toBe(workout.id);
  });

  it("rejects workout completion with invalid user or workout", async () => {
    await expect(
      prisma.workoutCompletion.create({
        data: {
          userEmail: "invalid@test.com",
          workoutPlanId: "nonexistent-id",
          caloriesBurned: 100,
        },
      })
    ).rejects.toThrow();
  });

  it("queries workout completions by user and date", async () => {
    const user = await prisma.user.create({
      data: { email: "wcquery@test.com", password: "pw" },
    });

    const workout = await prisma.workoutPlan.create({
      data: {
        routineName: "Evening HIIT",
        noOfExercises: 6,
        estimatedDuration: "25m",
        exercises: [],
        noOfUsers: 0,
        rating: 4.6,
        category: "HIIT",
        calories: 350,
        userEmail: user.email,
      },
    });

    await prisma.workoutCompletion.create({
      data: {
        userEmail: user.email,
        workoutPlanId: workout.id,
        caloriesBurned: 360,
        completedAt: new Date("2023-10-01T10:00:00Z"),
      },
    });

    const results = await prisma.workoutCompletion.findMany({
      where: {
        userEmail: user.email,
        completedAt: {
          gte: new Date("2023-10-01T00:00:00Z"),
          lt: new Date("2023-10-02T00:00:00Z"),
        },
      },
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].caloriesBurned).toBe(360);
  });
});

describe("📊 DietPlanCompletion model", () => {
  it("logs a diet plan completion for valid user and diet plan", async () => {
    const user = await prisma.user.create({
      data: { email: "dcuser@test.com", password: "pw" },
    });

    const diet = await prisma.dietPlan.create({
      data: {
        name: "Cutting Diet",
        description: "",
        duration: 5,
        meals: [],
        mealsPerDay: 3,
        difficulty: "Easy",
        rating: 4.1,
        totalCalories: 1800,
        userEmail: user.email,
      },
    });

    const completion = await prisma.dietPlanCompletion.create({
      data: {
        userEmail: user.email,
        dietPlanId: diet.id,
        caloriesConsumed: 1750,
      },
    });

    expect(completion.caloriesConsumed).toBe(1750);
    expect(completion.dietPlanId).toBe(diet.id);
  });

  it("rejects diet plan completion with invalid user or plan", async () => {
    await expect(
      prisma.dietPlanCompletion.create({
        data: {
          userEmail: "invalid@test.com",
          dietPlanId: "nonexistent-id",
          caloriesConsumed: 1400,
        },
      })
    ).rejects.toThrow();
  });

  it("queries diet completions by user and date", async () => {
    const user = await prisma.user.create({
      data: { email: "dcquery@test.com", password: "pw" },
    });

    const diet = await prisma.dietPlan.create({
      data: {
        name: "Keto Plan",
        description: "",
        duration: 7,
        meals: [],
        mealsPerDay: 3,
        difficulty: "Medium",
        rating: 4.5,
        totalCalories: 2000,
        userEmail: user.email,
      },
    });

    await prisma.dietPlanCompletion.create({
      data: {
        userEmail: user.email,
        dietPlanId: diet.id,
        caloriesConsumed: 1900,
        completedAt: new Date("2023-11-05T08:30:00Z"),
      },
    });

    const results = await prisma.dietPlanCompletion.findMany({
      where: {
        userEmail: user.email,
        completedAt: {
          gte: new Date("2023-11-05T00:00:00Z"),
          lt: new Date("2023-11-06T00:00:00Z"),
        },
      },
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].caloriesConsumed).toBe(1900);
  });
});

describe("🧨 Cascade Deletes - Completion Records", () => {
  it("deletes user and cascades workout/diet completions", async () => {
    const user = await prisma.user.create({
      data: {
        email: "casccomplete@test.com",
        password: "pw",
        workoutPlans: {
          create: {
            routineName: "Cascade Workout",
            noOfExercises: 3,
            estimatedDuration: "30m",
            exercises: [],
            noOfUsers: 1,
            rating: 4.0,
            category: "HIIT",
            calories: 300,
          },
        },
        dietPlans: {
          create: {
            name: "Cascade Diet",
            description: "",
            duration: 3,
            meals: [],
            mealsPerDay: 3,
            difficulty: "Easy",
            rating: 4.0,
            totalCalories: 1700,
          },
        },
      },
      include: { workoutPlans: true, dietPlans: true },
    });

    await prisma.workoutCompletion.create({
      data: {
        userEmail: user.email,
        workoutPlanId: user.workoutPlans[0].id,
        caloriesBurned: 350,
      },
    });

    await prisma.dietPlanCompletion.create({
      data: {
        userEmail: user.email,
        dietPlanId: user.dietPlans[0].id,
        caloriesConsumed: 1650,
      },
    });

    await prisma.user.delete({ where: { id: user.id } });

    const workoutCompletions = await prisma.workoutCompletion.findMany({
      where: { userEmail: user.email },
    });

    const dietCompletions = await prisma.dietPlanCompletion.findMany({
      where: { userEmail: user.email },
    });

    expect(workoutCompletions.length).toBe(0);
    expect(dietCompletions.length).toBe(0);
  });
});
