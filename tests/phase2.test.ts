import { prisma } from "./jest.setup";

describe("🏋️ WorkoutPlan model", () => {
  it("creates a workout plan linked to a user", async () => {
    const user = await prisma.user.create({
      data: { email: "workoutuser@test.com", password: "pw" },
    });

    const plan = await prisma.workoutPlan.create({
      data: {
        routineName: "Full Body Blast",
        noOfExercises: 6,
        estimatedDuration: "45m",
        exercises: [],
        noOfUsers: 0,
        rating: 4.8,
        category: "Strength",
        calories: 500,
        userEmail: user.email,
      },
    });

    expect(plan.routineName).toBe("Full Body Blast");
    expect(plan.userEmail).toBe(user.email);
  });

  it("rejects workout plan with invalid userEmail", async () => {
    await expect(
      prisma.workoutPlan.create({
        data: {
          routineName: "Bad Plan",
          noOfExercises: 3,
          estimatedDuration: "20m",
          exercises: [],
          noOfUsers: 0,
          rating: 3.5,
          category: "Cardio",
          calories: 200,
          userEmail: "nonexistent@test.com",
        },
      })
    ).rejects.toThrow();
  });

  it("updates workout plan rating and number of users", async () => {
    const user = await prisma.user.create({
      data: { email: "updater@test.com", password: "pw" },
    });

    const plan = await prisma.workoutPlan.create({
      data: {
        routineName: "HIIT Extreme",
        noOfExercises: 4,
        estimatedDuration: "30m",
        exercises: [],
        noOfUsers: 1,
        rating: 3.9,
        category: "HIIT",
        calories: 400,
        userEmail: user.email,
      },
    });

    const updated = await prisma.workoutPlan.update({
      where: { id: plan.id },
      data: {
        rating: 4.5,
        noOfUsers: 10,
      },
    });

    expect(updated.rating).toBe(4.5);
    expect(updated.noOfUsers).toBe(10);
  });

  it("fetches workout plans by category", async () => {
    const user = await prisma.user.create({
      data: { email: "category@test.com", password: "pw" },
    });

    await prisma.workoutPlan.createMany({
      data: [
        {
          routineName: "Cardio Rush",
          noOfExercises: 3,
          estimatedDuration: "20m",
          exercises: [],
          noOfUsers: 2,
          rating: 4.0,
          category: "Cardio",
          calories: 250,
          userEmail: user.email,
        },
        {
          routineName: "Strength Stack",
          noOfExercises: 5,
          estimatedDuration: "40m",
          exercises: [],
          noOfUsers: 3,
          rating: 4.7,
          category: "Strength",
          calories: 400,
          userEmail: user.email,
        },
      ],
    });

    const cardioPlans = await prisma.workoutPlan.findMany({
      where: { category: "Cardio" },
    });

    expect(cardioPlans.length).toBeGreaterThanOrEqual(1);
    expect(cardioPlans.every((p) => p.category === "Cardio")).toBe(true);
  });

  it("cascades workout plans on user deletion", async () => {
    const user = await prisma.user.create({
      data: {
        email: "cascadeworkout@test.com",
        password: "pw",
        workoutPlans: {
          create: {
            routineName: "To Be Deleted",
            noOfExercises: 2,
            estimatedDuration: "10m",
            exercises: [],
            noOfUsers: 0,
            rating: 2.0,
            category: "Quick",
            calories: 150,
          },
        },
      },
      include: { workoutPlans: true },
    });

    await prisma.user.delete({ where: { id: user.id } });

    const plans = await prisma.workoutPlan.findMany({
      where: { userEmail: user.email },
    });

    expect(plans.length).toBe(0);
  });
});

describe("🏋️‍♀️ ExerciseDetails model", () => {
  it("creates a new exercise entry", async () => {
    const exercise = await prisma.exerciseDetails.create({
      data: {
        name: "Push-Up",
        equipment: "None",
        category: "Upper Body",
        targetedAreas: "Chest, Triceps",
        videoURL: "https://example.com/pushup",
      },
    });

    expect(exercise.name).toBe("Push-Up");
    expect(exercise.category).toBe("Upper Body");
  });

  it("fetches an exercise and updates targeted areas", async () => {
    await prisma.exerciseDetails.create({
      data: {
        name: "Squat",
        equipment: "Bodyweight",
        category: "Lower Body",
        targetedAreas: "Glutes, Quads",
        videoURL: "https://example.com/squat",
      },
    });

    const updated = await prisma.exerciseDetails.update({
      where: { name: "Squat" },
      data: { targetedAreas: "Glutes, Quads, Hamstrings" },
    });

    expect(updated.targetedAreas).toBe("Glutes, Quads, Hamstrings");
  });
});
