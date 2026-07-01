-- Add HTML variants to transactional templates and delivery logs.
ALTER TABLE "EmailTemplate" ADD COLUMN "htmlBodyTemplate" TEXT;
ALTER TABLE "EmailLog" ADD COLUMN "htmlBody" TEXT;

-- Existing template versions remain historical. Their HTML representation is
-- derived without changing the original text template content.
UPDATE "EmailTemplate"
SET "htmlBodyTemplate" =
  $prefix$<!doctype html><html lang="pl"><body><pre style="white-space:pre-wrap;font-family:Arial,sans-serif;">$prefix$
  || replace(
       replace(
         replace(
           replace(
             replace(
               replace("textBodyTemplate", chr(92) || 'n', chr(10)),
               '&',
               '&amp;'
             ),
             '<',
             '&lt;'
           ),
           '>',
           '&gt;'
         ),
         '"',
         '&quot;'
       ),
       '''',
       '&#39;'
     )
  || $suffix$</pre></body></html>$suffix$;

ALTER TABLE "EmailTemplate" ALTER COLUMN "htmlBodyTemplate" SET NOT NULL;

-- Activate new localized text + HTML template versions while preserving history.
UPDATE "EmailTemplate"
SET "isActive" = FALSE,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" IN ('DOWNLOAD_WELCOME', 'DOWNLOAD_LINK', 'NEWSLETTER_CONFIRMATION');

INSERT INTO "EmailTemplate" (
  "id",
  "key",
  "version",
  "name",
  "subjectTemplate",
  "textBodyTemplate",
  "htmlBodyTemplate",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES
(
  'email_template_download_welcome_v2',
  'DOWNLOAD_WELCOME',
  2,
  'Download registration welcome',
  'Rejestracja pobrania {{productName}} została przyjęta',
  $text$Dzień dobry,

przyjęliśmy rejestrację pobrania.

Produkt: {{productName}}
Wydanie: {{editionName}}
Kanał: {{channelName}}
Wersja: {{buildVersion}} (#{{buildNumber}})
Numer zgłoszenia: {{requestId}}

W osobnej wiadomości otrzymasz link umożliwiający pobranie.

Pozdrawiamy,
{{appName}}$text$,
  $html$<!doctype html>
<html lang="pl">
  <body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#17212b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dde3e8;border-radius:12px;">
          <tr><td style="padding:28px;">
            <p style="margin:0 0 8px;font-size:14px;color:#52606d;">eGen Labs</p>
            <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">Rejestracja pobrania została przyjęta</h1>
            <p style="margin:0 0 18px;line-height:1.6;">Dzień dobry, przyjęliśmy rejestrację pobrania.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 20px;">
              <tr><td style="padding:7px 0;color:#52606d;">Produkt</td><td style="padding:7px 0;text-align:right;"><strong>{{productName}}</strong></td></tr>
              <tr><td style="padding:7px 0;color:#52606d;">Wydanie</td><td style="padding:7px 0;text-align:right;">{{editionName}}</td></tr>
              <tr><td style="padding:7px 0;color:#52606d;">Kanał</td><td style="padding:7px 0;text-align:right;">{{channelName}}</td></tr>
              <tr><td style="padding:7px 0;color:#52606d;">Wersja</td><td style="padding:7px 0;text-align:right;">{{buildVersion}} (#{{buildNumber}})</td></tr>
              <tr><td style="padding:7px 0;color:#52606d;">Numer zgłoszenia</td><td style="padding:7px 0;text-align:right;word-break:break-all;">{{requestId}}</td></tr>
            </table>
            <p style="margin:0 0 20px;line-height:1.6;">W osobnej wiadomości otrzymasz link umożliwiający pobranie.</p>
            <p style="margin:0;line-height:1.6;">Pozdrawiamy,<br>{{appName}}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>$html$,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'email_template_download_link_v2',
  'DOWNLOAD_LINK',
  2,
  'Download access email',
  'Pobierz {{productName}}',
  $text$Dzień dobry,

link do pobrania produktu {{productName}} / {{editionName}} / {{channelName}} jest gotowy.

Pobierz:
{{accessUrl}}

Jeżeli przycisk lub link nie działa, skopiuj pełny adres do przeglądarki.

Tryb dostępu: {{policyMode}}
Wersja: {{buildVersion}} (#{{buildNumber}})

Pozdrawiamy,
{{appName}}$text$,
  $html$<!doctype html>
<html lang="pl">
  <body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#17212b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dde3e8;border-radius:12px;">
          <tr><td style="padding:28px;">
            <p style="margin:0 0 8px;font-size:14px;color:#52606d;">eGen Labs</p>
            <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">Pobierz {{productName}}</h1>
            <p style="margin:0 0 22px;line-height:1.6;">Link do pobrania dla wydania {{editionName}} / {{channelName}} jest gotowy.</p>
            <p style="margin:0 0 24px;text-align:center;">
              <a href="{{accessUrl}}" style="display:inline-block;background:#17212b;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:8px;">Pobierz</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#52606d;line-height:1.5;">Jeżeli przycisk nie działa, skopiuj pełny adres do przeglądarki:</p>
            <p style="margin:0 0 22px;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{accessUrl}}" style="color:#1f5f99;">{{accessUrl}}</a></p>
            <p style="margin:0 0 20px;font-size:13px;color:#52606d;line-height:1.6;">Tryb dostępu: {{policyMode}}<br>Wersja: {{buildVersion}} (#{{buildNumber}})</p>
            <p style="margin:0;line-height:1.6;">Pozdrawiamy,<br>{{appName}}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>$html$,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'email_template_newsletter_confirmation_v3',
  'NEWSLETTER_CONFIRMATION',
  3,
  'Newsletter double opt-in confirmation',
  'Potwierdź zapis do newslettera eGen Labs',
  $text$Dzień dobry,

aby potwierdzić zapis do newslettera eGen Labs, użyj poniższego linku.

Potwierdź zapis:
{{confirmationUrl}}

Termin ważności linku: {{confirmationTtlHours}} h.
Jeżeli to nie Ty wysłałeś formularz, zignoruj tę wiadomość.

Pozdrawiamy,
{{appName}}$text$,
  $html$<!doctype html>
<html lang="pl">
  <body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#17212b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dde3e8;border-radius:12px;">
          <tr><td style="padding:28px;">
            <p style="margin:0 0 8px;font-size:14px;color:#52606d;">eGen Labs</p>
            <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;">Potwierdź zapis do newslettera</h1>
            <p style="margin:0 0 22px;line-height:1.6;">Aby zakończyć zapis, potwierdź swój adres e-mail.</p>
            <p style="margin:0 0 24px;text-align:center;">
              <a href="{{confirmationUrl}}" style="display:inline-block;background:#17212b;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:8px;">Potwierdź zapis</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#52606d;line-height:1.5;">Jeżeli przycisk nie działa, skopiuj pełny adres do przeglądarki:</p>
            <p style="margin:0 0 22px;font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{confirmationUrl}}" style="color:#1f5f99;">{{confirmationUrl}}</a></p>
            <p style="margin:0 0 20px;font-size:13px;color:#52606d;line-height:1.6;">Termin ważności linku: {{confirmationTtlHours}} h.<br>Jeżeli to nie Ty wysłałeś formularz, zignoruj tę wiadomość.</p>
            <p style="margin:0;line-height:1.6;">Pozdrawiamy,<br>{{appName}}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>$html$,
  TRUE,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("key", "version") DO UPDATE
SET "name" = EXCLUDED."name",
    "subjectTemplate" = EXCLUDED."subjectTemplate",
    "textBodyTemplate" = EXCLUDED."textBodyTemplate",
    "htmlBodyTemplate" = EXCLUDED."htmlBodyTemplate",
    "isActive" = TRUE,
    "updatedAt" = CURRENT_TIMESTAMP;
