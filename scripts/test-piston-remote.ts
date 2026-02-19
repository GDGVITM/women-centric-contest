
const PISTON_URL = 'https://piston-api-gdg.onrender.com/api/v2/execute';

async function testPiston() {
  console.log('🚀 Testing Remote Piston API...');
  try {
    const res = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        version: '*',
        files: [{ content: 'print("Hello from Remote Piston!")' }]
      })
    });

    if (!res.ok) {
        console.error('❌ Failed:', res.status, await res.text());
        return;
    }

    const data = await res.json();
    console.log('✅ Success!');
    console.log('Output:', data.run.stdout);
    
  } catch (err) {
    console.error('❌ Network Error:', err);
  }
}

testPiston();
