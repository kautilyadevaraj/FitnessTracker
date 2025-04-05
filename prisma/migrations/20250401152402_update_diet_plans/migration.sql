/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "dishes" (
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "fats" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "fibre" TEXT,
    "sodium" DOUBLE PRECISION,
    "calcium" DOUBLE PRECISION,
    "iron" DOUBLE PRECISION,
    "vitaminC" DOUBLE PRECISION,
    "folate" DOUBLE PRECISION,
    "ingredients" TEXT,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "diet_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "meals" JSONB NOT NULL,
    "mealsPerDay" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "diet_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diet_plans" ADD CONSTRAINT "diet_plans_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
