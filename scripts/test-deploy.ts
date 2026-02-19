
const BASE_URL = 'https://women-centric-contest-web.onrender.com';

async function testEndpoint(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  console.log(`Testing ${path}...`);
  try {
    const res = await fetch(url, options);
    console.log(`[${res.status}] ${url}`);
    if (!res.ok) {
        const text = await res.text();
        console.error(`Error Body: ${text.slice(0, 500)}`);
    }
    return res;
  } catch (error) {
    console.error(`FAILED to connect to ${url}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Deployment Verification...');
  
  // 1. Health Check (Landing Page)
  await testEndpoint('/');

  // 2. Admin Login Page
  await testEndpoint('/admin/login');

  // 3. Check Snippets API (Public)
  // Should return error or empty if params missing, but 200/400 is better than 500
  await testEndpoint('/api/snippets?code=T01&member=1');

  // 4. Check Join API (Method Not Allowed for GET, good sign)
  await testEndpoint('/api/teams/join');

  console.log('✅ Verification Complete. Check logs above.');
}

main();
