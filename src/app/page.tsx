import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1rem', display: 'grid', gap: '1rem' }}>
      <h1>eGen Labs Web Platform</h1>
      <p>Foundation bootstrap, registration shell, transactional issuance shell, and final delivery shell are active.</p>
      <p>
        Public MVP registration shell: <Link href="/download/register">open download registration</Link>.
      </p>
      <p>
        Issued link shell: <Link href="/download/access">open download access shell</Link>.
      </p>
    </main>
  );
}
