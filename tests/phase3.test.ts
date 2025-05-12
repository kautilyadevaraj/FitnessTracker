import { prisma } from "./jest.setup";

describe("🥗 DietPlan model", () => {
  it("creates a diet plan for a user", async () => {
    const user = await prisma.user.create({
      data: { email: "dietuser@test.com", password: "pw" },
    });

    const plan = await prisma.dietPlan.create({
      data: {
        name: "Low Carb Plan",
        description: "A simple low-carb diet",
        duration: 7,
        meals: [],
        mealsPerDay: 3,
        difficulty: "Medium",
        rating: 4.2,
        totalCalories: 1800,
        userEmail: user.email,
      },
    });

    expect(plan.name).toBe("Low Carb Plan");
    expect(plan.userEmail).toBe(user.email);
  });

  it("rejects diet plan with invalid userEmail", async () => {
    await expect(
      prisma.dietPlan.create({
        data: {
          name: "Invalid Plan",
          description: "Should fail",
          duration: 5,
          meals: [],
          mealsPerDay: 2,
          difficulty: "Easy",
          rating: 3.0,
          totalCalories: 1500,
          userEmail: "fakeuser@test.com",
        },
      })
    ).rejects.toThrow();
  });

  it("updates diet plan meals and totalCalories", async () => {
    const user = await prisma.user.create({
      data: { email: "updateplan@test.com", password: "pw" },
    });

    const plan = await prisma.dietPlan.create({
      data: {
        name: "Editable Plan",
        description: "Initial",
        duration: 3,
        meals: [],
        mealsPerDay: 2,
        difficulty: "Easy",
        rating: 4.0,
        totalCalories: 1200,
        userEmail: user.email,
      },
    });

    const updated = await prisma.dietPlan.update({
      where: { id: plan.id },
      data: {
        meals: [{ name: "Oats", calories: 300 }],
        totalCalories: 1500,
      },
    });

    expect(updated.totalCalories).toBe(1500);
    expect(updated.meals).toEqual([{ name: "Oats", calories: 300 }]);
  });

  it("cascades diet plans when user is deleted", async () => {
    const user = await prisma.user.create({
      data: {
        email: "cascadeplan@test.com",
        password: "pw",
        dietPlans: {
          create: {
            name: "To Be Deleted",
            description: "",
            duration: 5,
            meals: [],
            mealsPerDay: 3,
            difficulty: "Hard",
            rating: 2.5,
            totalCalories: 1600,
          },
        },
      },
      include: { dietPlans: true },
    });

    await prisma.user.delete({ where: { id: user.id } });

    const plans = await prisma.dietPlan.findMany({
      where: { userEmail: user.email },
    });

    expect(plans.length).toBe(0);
  });
});

describe("🥘 Dish model", () => {
  it("inserts a unique dish by name", async () => {
    const dish = await prisma.dish.create({
      data: {
        name: "Grilled Chicken",
        calories: 250,
        protein: 30,
        fats: 10,
        carbohydrates: 0,
      },
    });

    expect(dish.name).toBe("Grilled Chicken");
    expect(dish.protein).toBe(30);
  });

  it("rejects duplicate dish name", async () => {
    await prisma.dish.create({
      data: {
        name: "Tofu Curry",
        calories: 200,
      },
    });

    await expect(
      prisma.dish.create({
        data: {
          name: "Tofu Curry",
          calories: 210,
        },
      })
    ).rejects.toThrow();
  });

  it("updates dish macros and filters by low carb", async () => {
    await prisma.dish.create({
      data: {
        name: "Egg Salad",
        calories: 300,
        protein: 20,
        carbohydrates: 5,
        fats: 25,
      },
    });

    const updated = await prisma.dish.update({
      where: { name: "Egg Salad" },
      data: {
        carbohydrates: 3,
        fats: 22,
      },
    });

    expect(updated.carbohydrates).toBe(3);

    const lowCarbDishes = await prisma.dish.findMany({
      where: {
        carbohydrates: { lt: 10 },
        protein: { gte: 15 },
      },
    });

    expect(lowCarbDishes.find((d) => d.name === "Egg Salad")).toBeDefined();
  });
});
