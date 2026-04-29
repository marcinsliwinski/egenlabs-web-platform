import { headers } from 'next/headers';

import { requireAuthenticatedAdmin, type AuthenticatedAdmin } from '@/features/auth/auth-service';
import { db } from '@/lib/db';

type AuditMetadata = Record<string, unknown>;

type AuditEventInput = {
  admin: AuthenticatedAdmin;
  actionType: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: AuditMetadata;
};

function extractClientIp(forwardedForHeader: string | null): string | undefined {
  if (!forwardedForHeader) {
    return undefined;
  }

  const [firstAddress] = forwardedForHeader.split(',');
  const normalizedAddress = firstAddress?.trim();

  return normalizedAddress ? normalizedAddress : undefined;
}

function serializeMetadata(metadata: AuditMetadata | undefined) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  return JSON.stringify(metadata);
}

export async function logAdminAuditEvent(input: AuditEventInput) {
  try {
    const headerStore = await headers();
    const ipAddress = extractClientIp(headerStore.get('x-forwarded-for'));
    const userAgent = headerStore.get('user-agent') ?? undefined;

    await db.auditLog.create({
      data: {
        actorAdminUserId: input.admin.id,
        actionType: input.actionType,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        summary: input.summary,
        metadataJson: serializeMetadata(input.metadata),
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('Failed to write audit log entry.', error);
  }
}

export async function getAdminAuditOverview() {
  const admin = await requireAuthenticatedAdmin();

  const [auditLogCount, recentAuditLogCount, logs] = await Promise.all([
    db.auditLog.count(),
    db.auditLog.count({
      where: {
        occurredAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    db.auditLog.findMany({
      include: {
        actor: true
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      take: 100
    })
  ]);

  return {
    admin,
    stats: {
      auditLogCount,
      recentAuditLogCount
    },
    logs
  };
}

export async function getAdminAuditSummary() {
  const [auditLogCount, recentAuditLogCount] = await Promise.all([
    db.auditLog.count(),
    db.auditLog.count({
      where: {
        occurredAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    })
  ]);

  return {
    auditLogCount,
    recentAuditLogCount
  };
}
