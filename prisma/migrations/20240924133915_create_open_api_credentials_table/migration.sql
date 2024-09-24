/*
  Warnings:

  - You are about to drop the column `endTime` on the `Short` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Short` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `Short` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Short` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmp_filename` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TagUse" AS ENUM ('TRANSCRIPTION', 'FINE_TUNE');

-- AlterTable
ALTER TABLE "Short" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "tmp_filename" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OpenAiCredentials" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "in_use" BOOLEAN NOT NULL DEFAULT false,
    "tagUse" "TagUse" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAiCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenAiCredentials_api_key_key" ON "OpenAiCredentials"("api_key");
