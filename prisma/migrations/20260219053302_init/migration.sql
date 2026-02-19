-- CreateTable
CREATE TABLE "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "unlockKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Snippet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setId" INTEGER NOT NULL,
    "memberNo" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    CONSTRAINT "Snippet_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamCode" TEXT NOT NULL,
    "setId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Team_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "memberNo" INTEGER NOT NULL,
    "isJoined" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "output" TEXT,
    "submittedAt" DATETIME,
    CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeyAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "attemptValue" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KeyAttempt_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Round2Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "solutionTitle" TEXT NOT NULL,
    "solutionText" TEXT NOT NULL,
    "keyFeatures" TEXT NOT NULL,
    "dashboardUrl" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Round2Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Set_name_key" ON "Set"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Snippet_setId_memberNo_language_key" ON "Snippet"("setId", "memberNo", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamCode_key" ON "Team"("teamCode");

-- CreateIndex
CREATE UNIQUE INDEX "Member_teamId_memberNo_key" ON "Member"("teamId", "memberNo");

-- CreateIndex
CREATE UNIQUE INDEX "Round2Submission_teamId_key" ON "Round2Submission"("teamId");
