/*
  Warnings:

  - You are about to drop the column `anthropicApiKey` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "openrouterApiKey" TEXT,
    "openrouterModel" TEXT NOT NULL DEFAULT 'anthropic/claude-sonnet-5',
    "ayrshareApiKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("ayrshareApiKey", "createdAt", "id", "updatedAt") SELECT "ayrshareApiKey", "createdAt", "id", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
