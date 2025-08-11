/*
  Warnings:

  - You are about to drop the column `businessName` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `businessType` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `commonQuestions` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `followUpStyle` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `mainContactGoal` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTone` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `productDescription` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `targetAudience` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `valueOffers` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `FormPrompt` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `FormPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Form" DROP CONSTRAINT "Form_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "commonQuestions" TEXT,
ADD COLUMN     "followUpStyle" TEXT,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "mainContactGoal" TEXT,
ADD COLUMN     "preferredTone" TEXT,
ADD COLUMN     "productDescription" TEXT,
ADD COLUMN     "targetAudience" TEXT,
ADD COLUMN     "valueOffers" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "public"."FormPrompt" DROP COLUMN "businessName",
DROP COLUMN "businessType",
DROP COLUMN "commonQuestions",
DROP COLUMN "followUpStyle",
DROP COLUMN "keywords",
DROP COLUMN "mainContactGoal",
DROP COLUMN "preferredTone",
DROP COLUMN "productDescription",
DROP COLUMN "targetAudience",
DROP COLUMN "valueOffers",
DROP COLUMN "websiteUrl",
ADD COLUMN     "context" TEXT,
ADD COLUMN     "prompt" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "image_url" TEXT,
    "profile_image_url" TEXT,
    "ip_address" TEXT,
    "requestedLanguage" TEXT NOT NULL DEFAULT 'english',
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_external_id_key" ON "public"."users"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "public"."users"("id");

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
