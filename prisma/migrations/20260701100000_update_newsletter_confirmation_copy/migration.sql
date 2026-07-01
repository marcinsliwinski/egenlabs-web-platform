UPDATE "EmailTemplate"
SET "isActive" = FALSE,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'NEWSLETTER_CONFIRMATION';

INSERT INTO "EmailTemplate" (
  "id",
  "key",
  "version",
  "name",
  "subjectTemplate",
  "textBodyTemplate",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES (
  'email_template_newsletter_confirmation_v2',
  'NEWSLETTER_CONFIRMATION',
  2,
  'Newsletter double opt-in confirmation',
  'Potwierdź zapis do newslettera eGen Labs',
  E'Dzień dobry,\n\naby potwierdzić zapis do newslettera eGen Labs, otwórz poniższy link:\n{{confirmationUrl}}\n\nTermin ważności linku: {{confirmationTtlHours}} h. Jeżeli to nie Ty wysłałeś formularz, zignoruj tę wiadomość.\n\nPozdrawiamy,\n{{appName}}',
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("key", "version") DO UPDATE
SET "name" = EXCLUDED."name",
    "subjectTemplate" = EXCLUDED."subjectTemplate",
    "textBodyTemplate" = EXCLUDED."textBodyTemplate",
    "isActive" = TRUE,
    "updatedAt" = CURRENT_TIMESTAMP;
