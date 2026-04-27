import { createHash, randomBytes } from 'node:crypto';

import {
  DownloadLinkStatus,
  DownloadPolicyMode,
  DownloadRequestStatus,
  EmailLogStatus
} from '@prisma/client';

import { db } from '@/lib/db';
import { emailEnv } from '@/features/email/email-env';

type TemplateKey = 'DOWNLOAD_WELCOME' | 'DOWNLOAD_LINK';

type ActiveTemplate = {
  id: string | null;
  key: TemplateKey;
  version: number;
  subjectTemplate: string;
  textBodyTemplate: string;
};

type IssuanceSuccess = {
  success: true;
  requestId: string;
  downloadLinkId: string;
  accessUrl: string;
};

type IssuanceFailure = {
  success: false;
  requestId: string;
  reason:
    | 'request_not_found'
    | 'download_policy_missing'
    | 'download_policy_disabled'
    | 'active_build_missing'
    | 'email_missing'
    | 'lead_missing'
    | 'temporary_ttl_missing';
};

const FALLBACK_TEMPLATES: Record<TemplateKey, ActiveTemplate> = {
  DOWNLOAD_WELCOME: {
    id: null,
    key: 'DOWNLOAD_WELCOME',
    version: 1,
    subjectTemplate: 'Your {{productName}} registration is recorded',
    textBodyTemplate:
      'Hello,\n\nYour download registration for {{productName}} / {{editionName}} / {{channelName}} has been recorded in the accepted MVP flow.\n\nBuild: {{buildVersion}} (#{{buildNumber}})\nRequest ID: {{requestId}}\n\nThis environment currently uses the transactional email shell in {{transportMode}} mode.\n\nRegards,\n{{appName}}'
  },
  DOWNLOAD_LINK: {
    id: null,
    key: 'DOWNLOAD_LINK',
    version: 1,
    subjectTemplate: 'Your {{productName}} download access shell link',
    textBodyTemplate:
      'Hello,\n\nYour download access shell link for {{productName}} / {{editionName}} / {{channelName}} is ready:\n{{accessUrl}}\n\nPolicy mode: {{policyMode}}\nBuild: {{buildVersion}} (#{{buildNumber}})\n\nThis shell confirms issuance and link validation. Final binary delivery is not enabled yet in this step.\n\nRegards,\n{{appName}}'
  }
};

function normalizeBaseUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function interpolateTemplate(template: string, values: Record<string, string>) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => values[key] ?? '');
}

function buildTemplateValues(input: {
  requestId: string;
  productName: string;
  editionName: string;
  channelName: string;
  buildVersion: string;
  buildNumber: number;
  policyMode: DownloadPolicyMode;
  accessUrl: string;
}) {
  return {
    appName: emailEnv.APP_NAME,
    transportMode: emailEnv.EMAIL_TRANSPORT_MODE,
    requestId: input.requestId,
    productName: input.productName,
    editionName: input.editionName,
    channelName: input.channelName,
    buildVersion: input.buildVersion,
    buildNumber: String(input.buildNumber),
    policyMode: input.policyMode,
    accessUrl: input.accessUrl
  } satisfies Record<string, string>;
}

function createDownloadToken() {
  return randomBytes(24).toString('hex');
}

function createDownloadTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function createPublicSlug() {
  return `dl_${randomBytes(12).toString('hex')}`;
}

function getAccessUrl(input: { token?: string; slug?: string }) {
  const baseUrl = normalizeBaseUrl(emailEnv.APP_URL);
  const searchParams = new URLSearchParams();

  if (input.token) {
    searchParams.set('token', input.token);
  }

  if (input.slug) {
    searchParams.set('slug', input.slug);
  }

  return `${baseUrl}/download/access?${searchParams.toString()}`;
}

async function getActiveTemplates(): Promise<Record<TemplateKey, ActiveTemplate>> {
  const templates = await db.emailTemplate.findMany({
    where: {
      isActive: true,
      key: {
        in: ['DOWNLOAD_WELCOME', 'DOWNLOAD_LINK']
      }
    },
    orderBy: [{ key: 'asc' }, { version: 'desc' }]
  });

  const templateMap = new Map<string, (typeof templates)[number]>();

  for (const template of templates) {
    if (!templateMap.has(template.key)) {
      templateMap.set(template.key, template);
    }
  }

  return {
    DOWNLOAD_WELCOME: templateMap.get('DOWNLOAD_WELCOME')
      ? {
          id: templateMap.get('DOWNLOAD_WELCOME')!.id,
          key: 'DOWNLOAD_WELCOME',
          version: templateMap.get('DOWNLOAD_WELCOME')!.version,
          subjectTemplate: templateMap.get('DOWNLOAD_WELCOME')!.subjectTemplate,
          textBodyTemplate: templateMap.get('DOWNLOAD_WELCOME')!.textBodyTemplate
        }
      : FALLBACK_TEMPLATES.DOWNLOAD_WELCOME,
    DOWNLOAD_LINK: templateMap.get('DOWNLOAD_LINK')
      ? {
          id: templateMap.get('DOWNLOAD_LINK')!.id,
          key: 'DOWNLOAD_LINK',
          version: templateMap.get('DOWNLOAD_LINK')!.version,
          subjectTemplate: templateMap.get('DOWNLOAD_LINK')!.subjectTemplate,
          textBodyTemplate: templateMap.get('DOWNLOAD_LINK')!.textBodyTemplate
        }
      : FALLBACK_TEMPLATES.DOWNLOAD_LINK
  };
}

function getFailureReasonFromContext(context: {
  policy: { isEnabled: boolean; mode: DownloadPolicyMode; linkTtlMinutes: number | null } | null;
  buildId: string | null;
  email: string | null;
  leadId: string | null;
}) {
  if (!context.policy) {
    return 'download_policy_missing' as const;
  }

  if (!context.policy.isEnabled) {
    return 'download_policy_disabled' as const;
  }

  if (!context.buildId) {
    return 'active_build_missing' as const;
  }

  if (!context.email) {
    return 'email_missing' as const;
  }

  if (!context.leadId) {
    return 'lead_missing' as const;
  }

  if (context.policy.mode === DownloadPolicyMode.TEMPORARY && !context.policy.linkTtlMinutes) {
    return 'temporary_ttl_missing' as const;
  }

  return null;
}

function buildFailureNote(reason: IssuanceFailure['reason']) {
  switch (reason) {
    case 'request_not_found':
      return 'Transactional issuance failed: request not found.';
    case 'download_policy_missing':
      return 'Transactional issuance failed: download policy missing.';
    case 'download_policy_disabled':
      return 'Transactional issuance failed: download policy disabled.';
    case 'active_build_missing':
      return 'Transactional issuance failed: active build missing.';
    case 'email_missing':
      return 'Transactional issuance failed: request email missing.';
    case 'lead_missing':
      return 'Transactional issuance failed: lead record missing.';
    case 'temporary_ttl_missing':
      return 'Transactional issuance failed: temporary policy TTL missing.';
  }
}

async function markDownloadRequestFailed(downloadRequestId: string, reason: IssuanceFailure['reason']) {
  await db.downloadRequest.update({
    where: { id: downloadRequestId },
    data: {
      status: DownloadRequestStatus.FAILED,
      resolvedAt: new Date(),
      notes: buildFailureNote(reason)
    }
  });
}

export async function issueTransactionalDownloadForRequest(downloadRequestId: string): Promise<IssuanceSuccess | IssuanceFailure> {
  const [templates, existingRequest] = await Promise.all([
    getActiveTemplates(),
    db.downloadRequest.findUnique({
      where: { id: downloadRequestId },
      include: {
        policy: true,
        build: {
          include: {
            assets: true
          }
        },
        lead: true,
        product: true,
        edition: true,
        channel: true,
        links: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        emailLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
  ]);

  if (!existingRequest) {
    return {
      success: false,
      requestId: downloadRequestId,
      reason: 'request_not_found'
    };
  }

  const failureReason = getFailureReasonFromContext({
    policy: existingRequest.policy,
    buildId: existingRequest.buildId,
    email: existingRequest.email,
    leadId: existingRequest.leadId
  });

  if (failureReason) {
    await markDownloadRequestFailed(existingRequest.id, failureReason);

    return {
      success: false,
      requestId: existingRequest.id,
      reason: failureReason
    };
  }

  const build = existingRequest.build!;
  const policy = existingRequest.policy!;
  const now = new Date();

  const reusableLink =
    policy.mode === DownloadPolicyMode.PUBLIC_DIRECT || policy.mode === DownloadPolicyMode.PRIVATE_STATIC
      ? await db.downloadLink.findFirst({
          where: {
            policyId: policy.id,
            buildId: build.id,
            mode: policy.mode,
            status: DownloadLinkStatus.ACTIVE,
            requestId: null,
            publicSlug: {
              not: null
            }
          },
          orderBy: { createdAt: 'desc' }
        })
      : null;

  const rawToken =
    policy.mode === DownloadPolicyMode.ONE_TIME || policy.mode === DownloadPolicyMode.TEMPORARY
      ? createDownloadToken()
      : null;

  const publicSlug =
    policy.mode === DownloadPolicyMode.PUBLIC_DIRECT || policy.mode === DownloadPolicyMode.PRIVATE_STATIC
      ? reusableLink?.publicSlug ?? createPublicSlug()
      : null;

  const accessUrl = getAccessUrl({
    token: rawToken ?? undefined,
    slug: publicSlug ?? undefined
  });

  const templateValues = buildTemplateValues({
    requestId: existingRequest.id,
    productName: existingRequest.product.name,
    editionName: existingRequest.edition.name,
    channelName: existingRequest.channel.name,
    buildVersion: build.version,
    buildNumber: build.buildNumber,
    policyMode: policy.mode,
    accessUrl
  });

  const renderFromTemplate = (template: ActiveTemplate) => ({
    templateId: template.id ?? undefined,
    templateKey: template.key,
    templateVersion: template.version,
    subject: interpolateTemplate(template.subjectTemplate, templateValues),
    textBody: interpolateTemplate(template.textBodyTemplate, templateValues)
  });

  const welcomeEmail = renderFromTemplate(templates.DOWNLOAD_WELCOME);
  const downloadEmail = renderFromTemplate(templates.DOWNLOAD_LINK);

  const result = await db.$transaction(async (transaction) => {
    const downloadLink =
      reusableLink && reusableLink.publicSlug
        ? reusableLink
        : await transaction.downloadLink.create({
            data: {
              policyId: policy.id,
              buildId: build.id,
              requestId:
                policy.mode === DownloadPolicyMode.PUBLIC_DIRECT || policy.mode === DownloadPolicyMode.PRIVATE_STATIC
                  ? undefined
                  : existingRequest.id,
              mode: policy.mode,
              status: DownloadLinkStatus.ACTIVE,
              tokenHash: rawToken ? createDownloadTokenHash(rawToken) : undefined,
              publicSlug: publicSlug ?? undefined,
              expiresAt:
                policy.mode === DownloadPolicyMode.TEMPORARY && policy.linkTtlMinutes
                  ? new Date(now.getTime() + policy.linkTtlMinutes * 60 * 1000)
                  : null
            }
          });

    await transaction.emailLog.createMany({
      data: [
        {
          templateId: welcomeEmail.templateId,
          templateKey: welcomeEmail.templateKey,
          templateVersion: welcomeEmail.templateVersion,
          leadId: existingRequest.leadId!,
          downloadRequestId: existingRequest.id,
          toEmail: existingRequest.email!,
          subject: welcomeEmail.subject,
          textBody: welcomeEmail.textBody,
          status: EmailLogStatus.SENT,
          transportMode: emailEnv.EMAIL_TRANSPORT_MODE,
          sentAt: now
        },
        {
          templateId: downloadEmail.templateId,
          templateKey: downloadEmail.templateKey,
          templateVersion: downloadEmail.templateVersion,
          leadId: existingRequest.leadId!,
          downloadRequestId: existingRequest.id,
          downloadLinkId: downloadLink.id,
          toEmail: existingRequest.email!,
          subject: downloadEmail.subject,
          textBody: downloadEmail.textBody,
          status: EmailLogStatus.SENT,
          transportMode: emailEnv.EMAIL_TRANSPORT_MODE,
          sentAt: now
        }
      ]
    });

    await transaction.downloadRequest.update({
      where: { id: existingRequest.id },
      data: {
        status: DownloadRequestStatus.ISSUED,
        resolvedAt: now,
        notes: reusableLink
          ? 'Transactional download issuance shell completed with a reusable access link.'
          : 'Transactional download issuance shell completed.'
      }
    });

    return {
      downloadLinkId: downloadLink.id,
      accessUrl
    };
  });

  return {
    success: true,
    requestId: existingRequest.id,
    downloadLinkId: result.downloadLinkId,
    accessUrl: result.accessUrl
  };
}

export async function getEmailAdminOverview() {
  const [templates, emailLogs, emailLogCount, sentEmailCount, failedEmailCount, issuedLinkCount] = await Promise.all([
    db.emailTemplate.findMany({
      orderBy: [{ key: 'asc' }, { version: 'desc' }]
    }),
    db.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        template: true,
        lead: true,
        downloadRequest: {
          include: {
            product: true,
            edition: true,
            channel: true
          }
        },
        downloadLink: {
          include: {
            build: {
              include: {
                product: true,
                edition: true,
                channel: true,
                assets: true
              }
            }
          }
        }
      }
    }),
    db.emailLog.count(),
    db.emailLog.count({ where: { status: EmailLogStatus.SENT } }),
    db.emailLog.count({ where: { status: EmailLogStatus.FAILED } }),
    db.downloadLink.count()
  ]);

  return {
    templates,
    emailLogs,
    stats: {
      templateCount: templates.length,
      emailLogCount,
      sentEmailCount,
      failedEmailCount,
      issuedLinkCount
    }
  };
}

export async function resolveIssuedDownloadLinkAccess(input: { token?: string; slug?: string }) {
  const normalizedToken = input.token?.trim();
  const normalizedSlug = input.slug?.trim();

  if (!normalizedToken && !normalizedSlug) {
    return {
      status: 'missing' as const,
      summary: 'Provide a token or slug to inspect an issued download shell link.'
    };
  }

  const downloadLink = await db.downloadLink.findFirst({
    where: normalizedToken
      ? {
          tokenHash: createDownloadTokenHash(normalizedToken)
        }
      : {
          publicSlug: normalizedSlug ?? undefined
        },
    include: {
      policy: true,
      request: {
        include: {
          product: true,
          edition: true,
          channel: true,
          lead: true
        }
      },
      build: {
        include: {
          assets: true,
          product: true,
          edition: true,
          channel: true
        }
      }
    }
  });

  if (!downloadLink) {
    return {
      status: 'not_found' as const,
      summary: 'The requested download shell link does not exist.'
    };
  }

  if (downloadLink.status === DownloadLinkStatus.REVOKED) {
    return {
      status: 'revoked' as const,
      summary: 'This download shell link has been revoked.'
    };
  }

  if (downloadLink.expiresAt && downloadLink.expiresAt <= new Date()) {
    const expiredLink =
      downloadLink.status === DownloadLinkStatus.ACTIVE
        ? await db.downloadLink.update({
            where: { id: downloadLink.id },
            data: {
              status: DownloadLinkStatus.EXPIRED
            },
            include: {
              policy: true,
              request: {
                include: {
                  product: true,
                  edition: true,
                  channel: true,
                  lead: true
                }
              },
              build: {
                include: {
                  assets: true,
                  product: true,
                  edition: true,
                  channel: true
                }
              }
            }
          })
        : downloadLink;

    return {
      status: 'expired' as const,
      summary: 'This download shell link has expired.',
      link: expiredLink
    };
  }

  if (downloadLink.status === DownloadLinkStatus.CONSUMED) {
    return {
      status: 'consumed' as const,
      summary: 'This one-time download shell link has already been consumed.',
      link: downloadLink
    };
  }

  let consumedNow = false;
  let resolvedLink = downloadLink;

  if (downloadLink.mode === DownloadPolicyMode.ONE_TIME && downloadLink.status === DownloadLinkStatus.ACTIVE) {
    resolvedLink = await db.downloadLink.update({
      where: { id: downloadLink.id },
      data: {
        status: DownloadLinkStatus.CONSUMED,
        consumedAt: new Date()
      },
      include: {
        policy: true,
        request: {
          include: {
            product: true,
            edition: true,
            channel: true,
            lead: true
          }
        },
        build: {
          include: {
            assets: true,
            product: true,
            edition: true,
            channel: true
          }
        }
      }
    });

    consumedNow = true;
  }

  return {
    status: 'ready' as const,
    summary:
      downloadLink.mode === DownloadPolicyMode.ONE_TIME
        ? 'One-time download shell link validated. The shell link has now been consumed.'
        : 'Download shell link validated. Final file delivery is not enabled yet in this step.',
    consumedNow,
    link: resolvedLink
  };
}
