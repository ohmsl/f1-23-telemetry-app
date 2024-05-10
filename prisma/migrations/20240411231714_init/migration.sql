/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lap` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sessionType" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "pitSpeedLimit" INTEGER NOT NULL,
    "networkGame" BOOLEAN NOT NULL,
    "forecastAccuracy" INTEGER NOT NULL,
    "aiDifficulty" INTEGER NOT NULL,
    "seasonLinkIdentifier" INTEGER NOT NULL,
    "weekendLinkIdentifier" INTEGER NOT NULL,
    "sessionLinkIdentifier" INTEGER NOT NULL,
    "totalLaps" INTEGER NOT NULL,
    "bestLapNum" INTEGER NOT NULL
);
INSERT INTO "new_Session" ("aiDifficulty", "bestLapNum", "createdAt", "forecastAccuracy", "id", "networkGame", "pitSpeedLimit", "seasonLinkIdentifier", "sessionDuration", "sessionLinkIdentifier", "sessionType", "totalLaps", "trackId", "updatedAt", "weekendLinkIdentifier") SELECT "aiDifficulty", "bestLapNum", "createdAt", "forecastAccuracy", "id", "networkGame", "pitSpeedLimit", "seasonLinkIdentifier", "sessionDuration", "sessionLinkIdentifier", "sessionType", "totalLaps", "trackId", "updatedAt", "weekendLinkIdentifier" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
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
