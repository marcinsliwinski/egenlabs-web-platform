import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

type CsvDataset =
  | 'leads'
  | 'consents'
  | 'newsletter-subscriptions'
  | 'contact-inquiries'
  | 'enterprise-interest'
  | 'feature-requests'
  | 'software-demand'
  | 'telemetry';

const DATASET_FILES: Record<CsvDataset, string> = {
  leads: 'leads.csv',
  consents: 'consents.csv',
  'newsletter-subscriptions': 'newsletter-subscriptions.csv',
  'contact-inquiries': 'contact-inquiries.csv',
  'enterprise-interest': 'enterprise-interest.csv',
  'feature-requests': 'feature-requests.csv',
  'software-demand': 'software-demand.csv',
  telemetry: 'desktop-telemetry.csv'
};

const DATASET_LABELS: Record<CsvDataset, string> = {
  leads: 'Leads',
  consents: 'Consent records',
  'newsletter-subscriptions': 'Newsletter subscriptions',
  'contact-inquiries': 'Contact inquiries',
  'enterprise-interest': 'Enterprise interest submissions',
  'feature-requests': 'Desktop feature requests',
  'software-demand': 'Desktop software demand requests',
  telemetry: 'Desktop telemetry events'
};

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  const normalized = String(value).replace(/\r?\n/g, '\\n');

  if (/[",;]/.test(normalized) || normalized.includes('\\n')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

function toCsv(columns: string[], rows: Array<Record<string, unknown>>) {
  const lines = [columns.join(',')];

  for (const row of rows) {
    lines.push(columns.map((column) => escapeCsvValue(row[column])).join(','));
  }

  return lines.join('\n');
}

export async function getAdminExportOverview() {
  const admin = await requireAuthenticatedAdmin();
  const [leadCount, consentCount, newsletterCount, contactInquiryCount, enterpriseInterestCount, featureRequestCount, softwareDemandCount, telemetryEventCount] = await Promise.all([
    db.lead.count(),
    db.consentRecord.count(),
    db.newsletterSubscription.count(),
    db.contactInquiry.count(),
    db.enterpriseInterest.count(),
    db.featureRequest.count(),
    db.softwareDemandRequest.count(),
    db.desktopTelemetryEvent.count()
  ]);

  return {
    admin,
    datasets: [
      { key: 'leads', label: DATASET_LABELS.leads, fileName: DATASET_FILES.leads, rowCount: leadCount },
      { key: 'consents', label: DATASET_LABELS.consents, fileName: DATASET_FILES.consents, rowCount: consentCount },
      { key: 'newsletter-subscriptions', label: DATASET_LABELS['newsletter-subscriptions'], fileName: DATASET_FILES['newsletter-subscriptions'], rowCount: newsletterCount },
      { key: 'contact-inquiries', label: DATASET_LABELS['contact-inquiries'], fileName: DATASET_FILES['contact-inquiries'], rowCount: contactInquiryCount },
      { key: 'enterprise-interest', label: DATASET_LABELS['enterprise-interest'], fileName: DATASET_FILES['enterprise-interest'], rowCount: enterpriseInterestCount },
      { key: 'feature-requests', label: DATASET_LABELS['feature-requests'], fileName: DATASET_FILES['feature-requests'], rowCount: featureRequestCount },
      { key: 'software-demand', label: DATASET_LABELS['software-demand'], fileName: DATASET_FILES['software-demand'], rowCount: softwareDemandCount },
      { key: 'telemetry', label: DATASET_LABELS.telemetry, fileName: DATASET_FILES.telemetry, rowCount: telemetryEventCount }
    ]
  };
}

export async function getCsvExportByDataset(dataset: string) {
  const admin = await requireAuthenticatedAdmin();

  if (admin.role !== 'ADMIN') {
    return {
      success: false as const,
      status: 403,
      body: 'Forbidden'
    };
  }

  switch (dataset as CsvDataset) {
    case 'leads': {
      const rows = await db.lead.findMany({
        orderBy: [{ createdAt: 'desc' }]
      });

      return {
        success: true as const,
        fileName: DATASET_FILES.leads,
        csv: toCsv(['id', 'email', 'firstSeenAt', 'lastSeenAt', 'createdAt', 'updatedAt'], rows)
      };
    }
    case 'consents': {
      const rows = await db.consentRecord.findMany({
        include: {
          lead: true,
          definition: true,
          downloadRequest: true
        },
        orderBy: [{ capturedAt: 'desc' }]
      });

      return {
        success: true as const,
        fileName: DATASET_FILES.consents,
        csv: toCsv(
          ['id', 'leadEmail', 'definitionKey', 'definitionVersion', 'granted', 'source', 'downloadRequestId', 'capturedAt', 'ipAddress', 'userAgent'],
          rows.map((row) => ({
            id: row.id,
            leadEmail: row.lead.email,
            definitionKey: row.definition.key,
            definitionVersion: row.definition.version,
            granted: row.granted,
            source: row.source,
            downloadRequestId: row.downloadRequestId,
            capturedAt: row.capturedAt.toISOString(),
            ipAddress: row.ipAddress,
            userAgent: row.userAgent
          }))
        )
      };
    }
    case 'newsletter-subscriptions': {
      const rows = await db.newsletterSubscription.findMany({
        include: { lead: true },
        orderBy: [{ subscribedAt: 'desc' }]
      });

      return {
        success: true as const,
        fileName: DATASET_FILES['newsletter-subscriptions'],
        csv: toCsv(['id', 'leadEmail', 'source', 'isActive', 'subscribedAt', 'unsubscribedAt', 'createdAt', 'updatedAt'], rows.map((row) => ({
          id: row.id,
          leadEmail: row.lead.email,
          source: row.source,
          isActive: row.isActive,
          subscribedAt: row.subscribedAt.toISOString(),
          unsubscribedAt: row.unsubscribedAt?.toISOString() ?? null,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        })))
      };
    }
    case 'contact-inquiries': {
      const rows = await db.contactInquiry.findMany({ orderBy: [{ createdAt: 'desc' }] });
      return {
        success: true as const,
        fileName: DATASET_FILES['contact-inquiries'],
        csv: toCsv(['id', 'email', 'name', 'company', 'topic', 'message', 'marketingConsentGranted', 'status', 'createdAt', 'updatedAt'], rows.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        })))
      };
    }
    case 'enterprise-interest': {
      const rows = await db.enterpriseInterest.findMany({ orderBy: [{ createdAt: 'desc' }] });
      return {
        success: true as const,
        fileName: DATASET_FILES['enterprise-interest'],
        csv: toCsv(['id', 'email', 'name', 'company', 'role', 'teamSize', 'message', 'marketingConsentGranted', 'status', 'createdAt', 'updatedAt'], rows.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        })))
      };
    }
    case 'feature-requests': {
      const rows = await db.featureRequest.findMany({
        include: { product: true, edition: true, channel: true },
        orderBy: [{ createdAt: 'desc' }]
      });

      return {
        success: true as const,
        fileName: DATASET_FILES['feature-requests'],
        csv: toCsv(['id', 'productKey', 'editionKey', 'channelKey', 'installationId', 'appVersion', 'email', 'title', 'description', 'status', 'createdAt', 'updatedAt'], rows.map((row) => ({
          id: row.id,
          productKey: row.product.key,
          editionKey: row.edition.key,
          channelKey: row.channel.key,
          installationId: row.installationId,
          appVersion: row.appVersion,
          email: row.email,
          title: row.title,
          description: row.description,
          status: row.status,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        })))
      };
    }
    case 'software-demand': {
      const rows = await db.softwareDemandRequest.findMany({
        include: { product: true, edition: true, channel: true },
        orderBy: [{ createdAt: 'desc' }]
      });

      return {
        success: true as const,
        fileName: DATASET_FILES['software-demand'],
        csv: toCsv(['id', 'productKey', 'editionKey', 'channelKey', 'installationId', 'appVersion', 'email', 'company', 'requestedSoftwareName', 'useCase', 'details', 'status', 'createdAt', 'updatedAt'], rows.map((row) => ({
          id: row.id,
          productKey: row.product.key,
          editionKey: row.edition.key,
          channelKey: row.channel.key,
          installationId: row.installationId,
          appVersion: row.appVersion,
          email: row.email,
          company: row.company,
          requestedSoftwareName: row.requestedSoftwareName,
          useCase: row.useCase,
          details: row.details,
          status: row.status,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString()
        })))
      };
    }
    case 'telemetry': {
      const rows = await db.desktopTelemetryEvent.findMany({
        include: { product: true, edition: true, channel: true },
        orderBy: [{ receivedAt: 'desc' }],
        take: 1000
      });

      return {
        success: true as const,
        fileName: DATASET_FILES.telemetry,
        csv: toCsv(['id', 'productKey', 'editionKey', 'channelKey', 'installationId', 'appVersion', 'eventType', 'severity', 'message', 'payloadJson', 'occurredAt', 'receivedAt', 'ipAddress', 'userAgent'], rows.map((row) => ({
          id: row.id,
          productKey: row.product.key,
          editionKey: row.edition.key,
          channelKey: row.channel.key,
          installationId: row.installationId,
          appVersion: row.appVersion,
          eventType: row.eventType,
          severity: row.severity,
          message: row.message,
          payloadJson: row.payloadJson,
          occurredAt: row.occurredAt?.toISOString() ?? null,
          receivedAt: row.receivedAt.toISOString(),
          ipAddress: row.ipAddress,
          userAgent: row.userAgent
        })))
      };
    }
    default:
      return {
        success: false as const,
        status: 404,
        body: 'Export dataset not found'
      };
  }
}
