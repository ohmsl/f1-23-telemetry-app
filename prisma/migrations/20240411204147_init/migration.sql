-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sessionType" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "pitSpeedLimit" INTEGER NOT NULL,
    "safetyCarStatus" INTEGER NOT NULL,
    "networkGame" BOOLEAN NOT NULL,
    "forecastAccuracy" INTEGER NOT NULL,
    "aiDifficulty" INTEGER NOT NULL,
    "seasonLinkIdentifier" INTEGER NOT NULL,
    "weekendLinkIdentifier" INTEGER NOT NULL,
    "sessionLinkIdentifier" INTEGER NOT NULL,
    "totalLaps" INTEGER NOT NULL,
    "bestLapNum" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Lap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lapTimeInMS" INTEGER NOT NULL,
    "sector1TimeInMS" INTEGER NOT NULL,
    "sector2TimeInMS" INTEGER NOT NULL,
    "sector3TimeInMS" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "Lap_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
