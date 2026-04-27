import Link from 'next/link';

import { getAdminDesktopIntakeOverview } from '@/features/desktop/desktop-service';

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export default async function AdminDesktopIntakePage() {
  const overview = await getAdminDesktopIntakeOverview();
  const { admin } = overview;

  return (
    <main style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Desktop telemetry and feedback intake</h1>
          <p>Review accepted telemetry events, feature requests, and software demand submissions from desktop clients.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/desktop">Back to desktop API</Link>
          <Link href="/admin">Back to admin</Link>
        </div>
      </header>

      <section>
        <p>
          Signed in as <strong>{admin.email}</strong> ({admin.role})
        </p>
        <ul>
          <li>Telemetry events: {overview.stats.telemetryEventCount}</li>
          <li>Error telemetry events: {overview.stats.errorTelemetryCount}</li>
          <li>Feature requests: {overview.stats.featureRequestCount}</li>
          <li>New feature requests: {overview.stats.newFeatureRequestCount}</li>
          <li>Software demand requests: {overview.stats.softwareDemandCount}</li>
          <li>New software demand requests: {overview.stats.newSoftwareDemandCount}</li>
        </ul>
      </section>

      <section>
        <h2>Recent telemetry events</h2>
        {overview.telemetryEvents.length === 0 ? (
          <p>No telemetry events recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.telemetryEvents.map((event) => (
              <article key={event.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{event.eventType}</h3>
                  <p style={{ margin: 0 }}>
                    {event.product.name} / {event.edition.name} / {event.channel.name} · {event.appVersion} · {event.severity}
                  </p>
                </header>
                <p style={{ margin: 0 }}>
                  Installation: {event.installationId ?? '—'} · Occurred: {formatDate(event.occurredAt)} · Received: {formatDate(event.receivedAt)}
                </p>
                <p style={{ margin: 0 }}>Message: {event.message ?? '—'}</p>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: '0.75rem', borderRadius: '8px' }}>
                  {event.payloadJson ?? 'No payload stored.'}
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Recent feature requests</h2>
        {overview.featureRequests.length === 0 ? (
          <p>No feature requests recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.featureRequests.map((request) => (
              <article key={request.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{request.title}</h3>
                  <p style={{ margin: 0 }}>
                    {request.product.name} / {request.edition.name} / {request.channel.name} · {request.status}
                  </p>
                </header>
                <p style={{ margin: 0 }}>
                  App version: {request.appVersion ?? '—'} · Installation: {request.installationId ?? '—'} · Email: {request.email ?? '—'}
                </p>
                <p style={{ margin: 0 }}>Created: {formatDate(request.createdAt)}</p>
                <p style={{ margin: 0 }}>{request.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Recent software demand requests</h2>
        {overview.softwareDemandRequests.length === 0 ? (
          <p>No software demand requests recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {overview.softwareDemandRequests.map((request) => (
              <article key={request.id} style={{ border: '1px solid #dedede', borderRadius: '12px', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
                <header>
                  <h3 style={{ marginBottom: '0.25rem' }}>{request.requestedSoftwareName}</h3>
                  <p style={{ margin: 0 }}>
                    {request.product.name} / {request.edition.name} / {request.channel.name} · {request.status}
                  </p>
                </header>
                <p style={{ margin: 0 }}>
                  Company: {request.company ?? '—'} · Email: {request.email ?? '—'} · App version: {request.appVersion ?? '—'}
                </p>
                <p style={{ margin: 0 }}>Installation: {request.installationId ?? '—'} · Created: {formatDate(request.createdAt)}</p>
                <p style={{ margin: 0 }}>Use case: {request.useCase}</p>
                <p style={{ margin: 0 }}>Details: {request.details ?? '—'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
