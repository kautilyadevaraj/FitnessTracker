/*
  Warnings:

  - Added the required column `trainingPreference` to the `PhysicalFitness` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PhysicalFitness" ADD COLUMN     "trainingPreference" TEXT NOT NULL;
