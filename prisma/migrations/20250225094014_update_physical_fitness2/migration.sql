/*
  Warnings:

  - Added the required column `age` to the `physical_fitness` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "physical_fitness" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT;
