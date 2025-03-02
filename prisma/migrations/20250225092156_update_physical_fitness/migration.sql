/*
  Warnings:

  - You are about to drop the `PhysicalFitness` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhysicalFitness" DROP CONSTRAINT "PhysicalFitness_userId_fkey";

-- DropTable
DROP TABLE "PhysicalFitness";

-- CreateTable
CREATE TABLE "physical_fitness" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bodyFatPercentage" DOUBLE PRECISION,
    "medicalConditions" TEXT,
    "injuries" TEXT,
    "medications" TEXT,
    "occupation" TEXT,
    "dailyActivity" TEXT,
    "sleepHours" INTEGER,
    "stressLevel" TEXT,
    "fitnessLevel" TEXT NOT NULL,
    "trainingFrequency" INTEGER,
    "previousTraining" TEXT,
    "preferredExercise" TEXT,
    "accessToEquipment" TEXT,
    "primaryGoal" TEXT NOT NULL,
    "targetAreas" TEXT,
    "preferredTime" TEXT,
    "workoutSetting" TEXT NOT NULL,
    "motivationalFactor" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "physical_fitness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "physical_fitness_userEmail_key" ON "physical_fitness"("userEmail");

-- AddForeignKey
ALTER TABLE "physical_fitness" ADD CONSTRAINT "physical_fitness_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
