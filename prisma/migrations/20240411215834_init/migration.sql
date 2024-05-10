/*
  Warnings:

  - You are about to drop the column `safetyCarStatus` on the `Session` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
