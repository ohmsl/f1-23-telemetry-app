-- CreateTable
CREATE TABLE "CarSetup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frontWing" INTEGER NOT NULL,
    "rearWing" INTEGER NOT NULL,
    "onThrottle" INTEGER NOT NULL,
    "offThrottle" INTEGER NOT NULL,
    "frontCamber" INTEGER NOT NULL,
    "rearCamber" INTEGER NOT NULL,
    "frontToe" INTEGER NOT NULL,
    "rearToe" INTEGER NOT NULL,
    "frontSuspension" INTEGER NOT NULL,
    "rearSuspension" INTEGER NOT NULL,
    "frontAntiRollBar" INTEGER NOT NULL,
    "rearAntiRollBar" INTEGER NOT NULL,
    "frontSuspensionHeight" INTEGER NOT NULL,
    "rearSuspensionHeight" INTEGER NOT NULL,
    "brakePressure" INTEGER NOT NULL,
    "brakeBias" INTEGER NOT NULL,
    "frontTyrePressure" INTEGER NOT NULL,
    "rearTyrePressure" INTEGER NOT NULL,
    "ballast" INTEGER NOT NULL,
    "fuelLoad" INTEGER NOT NULL,
    "lapId" TEXT NOT NULL,
    CONSTRAINT "CarSetup_lapId_fkey" FOREIGN KEY ("lapId") REFERENCES "Lap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CarSetup_lapId_key" ON "CarSetup"("lapId");
