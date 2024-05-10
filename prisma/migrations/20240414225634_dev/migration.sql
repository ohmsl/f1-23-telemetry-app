/*
  Warnings:

  - You are about to drop the column `carSetupId` on the `Lap` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lapTimeInMS" INTEGER NOT NULL,
    "sector1TimeInMS" INTEGER NOT NULL,
    "sector2TimeInMS" INTEGER NOT NULL,
    "sector3TimeInMS" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Lap_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lap" ("createdAt", "id", "lapTimeInMS", "sector1TimeInMS", "sector2TimeInMS", "sector3TimeInMS", "sessionId", "updatedAt") SELECT "createdAt", "id", "lapTimeInMS", "sector1TimeInMS", "sector2TimeInMS", "sector3TimeInMS", "sessionId", "updatedAt" FROM "Lap";
DROP TABLE "Lap";
ALTER TABLE "new_Lap" RENAME TO "Lap";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
