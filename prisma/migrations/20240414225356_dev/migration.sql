/*
  Warnings:

  - A unique constraint covering the columns `[carSetupId]` on the table `Lap` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lap" ADD COLUMN "carSetupId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lap_carSetupId_key" ON "Lap"("carSetupId");
