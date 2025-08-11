-- CreateTable
CREATE TABLE "FormPrompt" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "mainContactGoal" TEXT NOT NULL,
    "commonQuestions" TEXT NOT NULL,
    "valueOffers" TEXT NOT NULL,
    "preferredTone" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "followUpStyle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormChat" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormPrompt_formId_key" ON "FormPrompt"("formId");

-- AddForeignKey
ALTER TABLE "FormPrompt" ADD CONSTRAINT "FormPrompt_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormChat" ADD CONSTRAINT "FormChat_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
