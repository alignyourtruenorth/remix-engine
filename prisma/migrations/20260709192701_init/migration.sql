-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "niche" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "voiceNotes" TEXT NOT NULL,
    "signaturePhrases" TEXT NOT NULL,
    "neverUsePhrases" TEXT NOT NULL,
    "offers" TEXT NOT NULL,
    "pillarEntertain" INTEGER NOT NULL DEFAULT 20,
    "pillarEducate" INTEGER NOT NULL DEFAULT 20,
    "pillarRelate" INTEGER NOT NULL DEFAULT 20,
    "pillarTrust" INTEGER NOT NULL DEFAULT 20,
    "pillarSell" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SourcePost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "postedAt" DATETIME NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER,
    "engagementRate" REAL NOT NULL,
    "pillar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RemixDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourcePostId" TEXT,
    "hook" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ayrsharePostId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RemixDraft_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "SourcePost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SourcePost_platform_externalId_key" ON "SourcePost"("platform", "externalId");
