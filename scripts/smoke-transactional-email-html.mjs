import { PrismaClient } from '@prisma/client';

import {
  buildPlainTextHtmlDocument,
  interpolateHtmlTemplate,
  interpolateTextTemplate,
  redactRenderedValue
} from '../src/features/email/email-template.ts';

const prisma = new PrismaClient();
const expectedKeys = ['DOWNLOAD_WELCOME', 'DOWNLOAD_LINK', 'NEWSLETTER_CONFIRMATION'];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  let rejectedLiteralNewline = false;

  try {
    interpolateTextTemplate('Line one\\nLine two', {});
  } catch {
    rejectedLiteralNewline = true;
  }

  assert(rejectedLiteralNewline, 'Text renderer accepted a literal \\n sequence.');

  const templates = await prisma.emailTemplate.findMany({
    where: {
      isActive: true,
      key: { in: expectedKeys }
    },
    orderBy: [{ key: 'asc' }, { version: 'desc' }]
  });
  const activeTemplates = new Map();

  for (const template of templates) {
    assert(!activeTemplates.has(template.key), `Multiple active templates found for ${template.key}.`);
    activeTemplates.set(template.key, template);
  }

  for (const key of expectedKeys) {
    const template = activeTemplates.get(key);
    assert(template, `Active ${key} template is missing.`);
    assert(!template.textBodyTemplate.includes('\\n'), `${key} contains a literal \\n sequence.`);
    assert(template.textBodyTemplate.includes('\n'), `${key} does not contain real newline characters.`);
    assert(template.htmlBodyTemplate.includes('<!doctype html>'), `${key} does not contain a complete HTML document.`);
  }

  const values = {
    appName: 'eGen Labs <script>alert(1)</script>',
    requestId: 'request-123',
    productName: 'Fito Gen & Essentials',
    editionName: 'Essentials',
    channelName: 'Beta',
    buildVersion: '0.0.0-staging-test',
    buildNumber: '900001',
    policyMode: 'TEMPORARY',
    accessUrl: 'https://staging.egenlabs.eu/download/access?token=test&source=email',
    confirmationUrl: 'https://staging.egenlabs.eu/newsletter/confirm?token=test&source=email',
    confirmationTtlHours: '24'
  };

  const downloadHtml = interpolateHtmlTemplate(activeTemplates.get('DOWNLOAD_LINK').htmlBodyTemplate, values);
  assert(downloadHtml.includes('>Pobierz</a>'), 'DOWNLOAD_LINK does not contain the Pobierz button.');
  assert(
    downloadHtml.includes('href="https://staging.egenlabs.eu/download/access?token=test&amp;source=email"'),
    'DOWNLOAD_LINK does not contain an escaped clickable URL.'
  );
  assert(
    downloadHtml.includes('https://staging.egenlabs.eu/download/access?token=test&amp;source=email</a>'),
    'DOWNLOAD_LINK does not contain the full fallback URL.'
  );

  const confirmationHtml = interpolateHtmlTemplate(
    activeTemplates.get('NEWSLETTER_CONFIRMATION').htmlBodyTemplate,
    values
  );
  assert(
    confirmationHtml.includes('>Potwierdź zapis</a>'),
    'NEWSLETTER_CONFIRMATION does not contain the confirmation button.'
  );
  assert(
    confirmationHtml.includes(
      'href="https://staging.egenlabs.eu/newsletter/confirm?token=test&amp;source=email"'
    ),
    'NEWSLETTER_CONFIRMATION does not contain an escaped clickable URL.'
  );
  assert(!confirmationHtml.includes('<script>alert(1)</script>'), 'Dynamic HTML values were not escaped.');
  assert(
    confirmationHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;'),
    'Escaped dynamic HTML value is missing.'
  );

  const redactedConfirmationHtml = redactRenderedValue(
    confirmationHtml,
    values.confirmationUrl,
    '[confirmation link redacted]'
  );
  assert(!redactedConfirmationHtml.includes('token=test'), 'Newsletter confirmation token remained in HTML log content.');

  const historicalHtml = buildPlainTextHtmlDocument('Existing text body <without HTML>.');
  assert(
    historicalHtml.includes('&lt;without HTML&gt;'),
    'Historical resend HTML fallback did not escape plain text.'
  );

  console.log('Transactional email HTML smoke checks passed.');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
