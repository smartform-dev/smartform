-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "userResponded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userResponse" TEXT;
