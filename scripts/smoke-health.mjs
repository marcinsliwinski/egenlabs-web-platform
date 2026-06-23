const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const response = await fetch(`${baseUrl}/api/v1/health`);
const data = await response.json();

if (!response.ok) {
  console.error('Health endpoint returned non-OK status:', response.status, data);
  process.exit(1);
}

if (data.status !== 'ok' || data.database !== 'up') {
  console.error('Unexpected health payload:', data);
  process.exit(1);
}

console.log('Health smoke test passed:', data);
