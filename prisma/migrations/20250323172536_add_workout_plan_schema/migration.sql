/*
  Warnings:

  - You are about to drop the column `accessToEquipment` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `bodyFatPercentage` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `dailyActivity` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `injuries` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `medicalConditions` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `motivationalFactor` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `preferredExercise` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTime` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `previousTraining` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `sleepHours` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `stressLevel` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `targetAreas` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `trainingFrequency` on the `physical_fitness` table. All the data in the column will be lost.
  - You are about to drop the column `workoutSetting` on the `physical_fitness` table. All the data in the column will be lost.
  - Added the required column `workoutDuration` to the `physical_fitness` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutLocation` to the `physical_fitness` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutsPerWeek` to the `physical_fitness` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender` on table `physical_fitness` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "physical_fitness" DROP COLUMN "accessToEquipment",
DROP COLUMN "bodyFatPercentage",
DROP COLUMN "dailyActivity",
DROP COLUMN "injuries",
DROP COLUMN "medicalConditions",
DROP COLUMN "medications",
DROP COLUMN "motivationalFactor",
DROP COLUMN "occupation",
DROP COLUMN "preferredExercise",
DROP COLUMN "preferredTime",
DROP COLUMN "previousTraining",
DROP COLUMN "sleepHours",
DROP COLUMN "stressLevel",
DROP COLUMN "targetAreas",
DROP COLUMN "trainingFrequency",
DROP COLUMN "workoutSetting",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "workoutDuration" INTEGER NOT NULL,
ADD COLUMN     "workoutLocation" TEXT NOT NULL,
ADD COLUMN     "workoutsPerWeek" INTEGER NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" TEXT NOT NULL,
    "routineName" TEXT NOT NULL,
    "noOfExercises" INTEGER NOT NULL,
    "estimatedDuration" TEXT NOT NULL,
    "exercises" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "noOfUsers" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseDetails" (
    "name" TEXT NOT NULL,
    "equipment" TEXT,
    "category" TEXT,
    "targetedAreas" TEXT,
    "videoURL" TEXT,

    CONSTRAINT "ExcerciseDetails_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "test" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "images" BYTEA,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
