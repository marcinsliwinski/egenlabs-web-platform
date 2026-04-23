const response = await fetch('http://localhost:3000/api/v1/health');
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

