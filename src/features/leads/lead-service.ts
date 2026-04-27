import { db } from '@/lib/db';
import { getDownloadPolicyOverview } from '@/features/downloads/download-service';

export const DOWNLOAD_REGISTRATION_CONSENT_KEY = 'DOWNLOAD_REGISTRATION';
export const MARKETING_EMAIL_CONSENT_KEY = 'MARKETING_EMAIL';

export async function getActiveConsentDefinitions() {
  const definitions = await db.consentDefinition.findMany({
    where: {
      isActive: true,
      key: {
        in: [DOWNLOAD_REGISTRATION_CONSENT_KEY, MARKETING_EMAIL_CONSENT_KEY]
      }
    },
    orderBy: [{ key: 'asc' }, { version: 'desc' }]
  });

  const definitionMap = new Map<string, (typeof definitions)[number]>();

  for (const definition of definitions) {
    if (!definitionMap.has(definition.key)) {
      definitionMap.set(definition.key, definition);
    }
  }

  return {
    downloadRegistration: definitionMap.get(DOWNLOAD_REGISTRATION_CONSENT_KEY) ?? null,
    marketingEmail: definitionMap.get(MARKETING_EMAIL_CONSENT_KEY) ?? null
  };
}

export async function getPublicDownloadRegistrationOverview() {
  const [downloadOverview, consentDefinitions] = await Promise.all([
    getDownloadPolicyOverview(),
    getActiveConsentDefinitions()
  ]);

  const combinations = downloadOverview.combinations
    .filter((item) => item.resolution.status === 'ready' && item.policy?.isEnabled && item.activeBuild !== null)
    .map((item) => ({
      id: item.id,
      productId: item.product.id,
      editionId: item.edition.id,
      channelId: item.channel.id,
      productName: item.product.name,
      editionName: item.edition.name,
      channelName: item.channel.name,
      policyId: item.policy?.id ?? null,
      buildId: item.activeBuild?.id ?? null,
      policyMode: item.policy?.mode ?? null,
      requireEmailRegistration: item.policy?.requireEmailRegistration ?? true,
      buildVersion: item.activeBuild?.version ?? null,
      buildNumber: item.activeBuild?.buildNumber ?? null,
      summary: item.resolution.summary
    }));

  return {
    consentDefinitions,
    combinations,
    stats: {
      readyCombinationCount: combinations.length
    }
  };
}

export async function getLeadAdminOverview() {
  const [leadCount, requestCount, grantedMarketingCount, latestDefinitions, leads] = await Promise.all([
    db.lead.count(),
    db.downloadRequest.count({ where: { leadId: { not: null } } }),
    db.consentRecord.count({
      where: {
        definition: { key: MARKETING_EMAIL_CONSENT_KEY },
        granted: true
      }
    }),
    getActiveConsentDefinitions(),
    db.lead.findMany({
      orderBy: { lastSeenAt: 'desc' },
      include: {
        downloadRequests: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            product: true,
            edition: true,
            channel: true,
            policy: true
          }
        },
        consentRecords: {
          where: {
            definition: {
              key: {
                in: [DOWNLOAD_REGISTRATION_CONSENT_KEY, MARKETING_EMAIL_CONSENT_KEY]
              }
            }
          },
          orderBy: { capturedAt: 'desc' },
          include: {
            definition: true
          }
        }
      },
      take: 50
    })
  ]);

  return {
    stats: {
      leadCount,
      requestCount,
      grantedMarketingCount
    },
    latestDefinitions,
    leads: leads.map((lead) => {
      const latestDownloadConsent = lead.consentRecords.find(
        (record) => record.definition.key === DOWNLOAD_REGISTRATION_CONSENT_KEY
      );
      const latestMarketingConsent = lead.consentRecords.find(
        (record) => record.definition.key === MARKETING_EMAIL_CONSENT_KEY
      );

      return {
        ...lead,
        latestDownloadConsent,
        latestMarketingConsent
      };
    })
  };
}
