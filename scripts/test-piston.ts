
const BASE_URL = 'https://women-centric-contest-web.onrender.com';

async function testCompile() {
  console.log('🚀 Testing Piston Code Execution...');
  const payload = {
    language: 'python',
    code: 'print("Hello from Render!")',
    stdin: '',
    expectedOutput: 'Hello from Render!'
  };

  try {
    const res = await fetch(`${BASE_URL}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log(`[${res.status}] Response:`, JSON.stringify(data, null, 2));
    
    if (data.stdout && data.stdout.includes('Hello from Render!')) {
        console.log('✅ Piston Execution SUCCESS!');
    } else {
        console.error('❌ Piston Execution FAILED (Output mismatch or error).');
    }

  } catch (error) {
    console.error('FAILED to connect to compile API:', error);
  }
}

testCompile();
