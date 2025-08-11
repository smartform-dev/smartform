DO $$
DECLARE
    form_record RECORD;
    company_id_var UUID;
BEGIN
    FOR form_record IN
        SELECT f.id as form_id, f."ownerId" as owner_id, fp.*
        FROM "Form" f
        JOIN "FormPrompt" fp ON f.id = fp."formId"
        WHERE f."companyId" IS NULL
    LOOP
        -- Create a new company for the form
        INSERT INTO "Company" ("userId", "name", "businessType", "websiteUrl", "productDescription", "targetAudience", "mainContactGoal", "commonQuestions", "valueOffers", "preferredTone", "keywords", "followUpStyle", "createdAt", "updatedAt")
        VALUES (form_record.owner_id, form_record."businessName", form_record."businessType", form_record."websiteUrl", form_record."productDescription", form_record."targetAudience", form_record."mainContactGoal", form_record."commonQuestions", form_record."valueOffers", form_record."preferredTone", form_record."keywords", form_record."followUpStyle", NOW(), NOW())
        RETURNING id INTO company_id_var;

        -- Update the form with the new company id
        UPDATE "Form"
        SET "companyId" = company_id_var
        WHERE id = form_record.form_id;
    END LOOP;
END $$;
