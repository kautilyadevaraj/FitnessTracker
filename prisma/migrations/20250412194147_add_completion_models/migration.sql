/*
  Warnings:

  - Added the required column `totalCalories` to the `diet_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `workout_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diet_plans" ADD COLUMN     "totalCalories" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "workout_plans" ADD COLUMN     "calories" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "workout_completions" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "workoutPlanId" TEXT NOT NULL,
    "caloriesBurned" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_plan_completions" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "dietPlanId" TEXT NOT NULL,
    "caloriesConsumed" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diet_plan_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workout_completions_userEmail_completedAt_idx" ON "workout_completions"("userEmail", "completedAt");

-- CreateIndex
CREATE INDEX "diet_plan_completions_userEmail_completedAt_idx" ON "diet_plan_completions"("userEmail", "completedAt");

-- AddForeignKey
ALTER TABLE "workout_completions" ADD CONSTRAINT "workout_completions_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_completions" ADD CONSTRAINT "workout_completions_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet_plan_completions" ADD CONSTRAINT "diet_plan_completions_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet_plan_completions" ADD CONSTRAINT "diet_plan_completions_dietPlanId_fkey" FOREIGN KEY ("dietPlanId") REFERENCES "diet_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
