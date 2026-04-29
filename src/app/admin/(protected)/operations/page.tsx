import Link from 'next/link';

import { getAdminAuditOverview } from '@/features/audit/audit-service';
import { getAdminExportOverview } from '@/features/exports/csv-service';

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

function formatMetadata(metadataJson: string | null) {
  if (!metadataJson) {
    return '—';
  }

  try {
    const parsed = JSON.parse(metadataJson) as Record<string, unknown>;
    return Object.entries(parsed)
      .slice(0, 6)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(' · ');
  } catch {
    return metadataJson;
  }
}

export default async function AdminOperationsPage() {
  const [auditOverview, exportOverview] = await Promise.all([
    getAdminAuditOverview(),
    getAdminExportOverview()
  ]);

  return (
    <main style={{ maxWidth: 960, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '2rem' }}>
      <header>
        <h1>Operations</h1>
        <p>Audit logging, CSV export, and backup/restore runbook foundation for admin operations.</p>
        <p>
          Signed in as <strong>{auditOverview.admin.email}</strong> ({auditOverview.admin.role})
        </p>
      </header>

      <section>
        <h2>Audit summary</h2>
        <ul>
          <li>Total audit entries: {auditOverview.stats.auditLogCount}</li>
          <li>Audit entries in the last 24h: {auditOverview.stats.recentAuditLogCount}</li>
        </ul>
      </section>

      <section>
        <h2>Backup and restore runbook</h2>
        <p>Default backup root is intentionally kept outside the repository: <code>../egenlabs-web-platform-backups</code>.</p>
        <ul>
          <li><code>npm run ops:backup:all</code></li>
          <li><code>npm run ops:backup:db</code></li>
          <li><code>npm run ops:backup:storage</code></li>
          <li><code>npm run ops:restore:db -- --file=/path/to/postgres.sql</code></li>
          <li><code>npm run ops:restore:storage -- --file=/path/to/storage.tar.gz</code></li>
        </ul>
        <p>Runbook location: <code>docs/operations-backup-restore.md</code></p>
        <p>Backups and restored artifacts must stay outside Git and outside tracked project files.</p>
      </section>

      <section>
        <h2>CSV exports</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {exportOverview.datasets.map((dataset) => (
            <article key={dataset.key} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.35rem' }}>
              <strong>{dataset.label}</strong>
              <span>Rows: {dataset.rowCount}</span>
              <Link href={`/api/v1/admin/exports/${dataset.key}`}>Download {dataset.fileName}</Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Recent audit entries</h2>
        {auditOverview.logs.length === 0 ? (
          <p>No audit entries recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {auditOverview.logs.map((entry) => (
              <article key={entry.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.35rem' }}>
                <strong>{entry.summary}</strong>
                <span>
                  {entry.actionType} · {entry.entityType} · {entry.entityId ?? '—'}
                </span>
                <span>
                  Actor: {entry.actor.email} · Occurred: {formatDate(entry.occurredAt)}
                </span>
                <span>Metadata: {formatMetadata(entry.metadataJson)}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
