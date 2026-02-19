
const BASE_URL = 'https://women-centric-contest-web.onrender.com';
const TEAM_CODE = 'T20'; // Use T20 for testing

async function step(name: string, fn: () => Promise<void>) {
    console.log(`\n🔹 [STEP] ${name}...`);
    try {
        await fn();
        console.log(`✅ ${name} Passed`);
    } catch (e: any) {
        console.error(`❌ ${name} Failed:`, e.message);
        process.exit(1);
    }
}

async function fetchJson(path: string, options?: RequestInit) {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText} - ${await res.text()}`);
    }
    return res.json();
}

async function main() {
    console.log(`🚀 Starting Full Game Flow Test for ${TEAM_CODE}`);

    await step('Reset Team Progress', async () => {
        // Requires Admin Secret header if we had an admin API for this, 
        // but for now we'll assume T20 is fresh or rely on the admin reset endpoint.
        // Actually, we can use the admin reset endpoint we just made!
        await fetchJson('/api/admin/reset', {
            method: 'POST',
            body: JSON.stringify({ teamCode: TEAM_CODE })
        });
    });

    await step('Verify Round 1 Start', async () => {
        const res = await fetchJson(`/api/teams/${TEAM_CODE}/members`);
        if (res.currentRound !== 1) throw new Error(`Expected Round 1, got ${res.currentRound}`);
    });

    await step('Join Slots', async () => {
        for (let i = 1; i <= 3; i++) {
            await fetchJson(`/api/teams/${TEAM_CODE}/members`, {
                method: 'POST',
                body: JSON.stringify({ memberNo: i })
            });
        }
    });

    await step('Submit Round 1 for All Members', async () => {
        // Member 1
        await fetchJson('/api/submit', {
            method: 'POST',
            body: JSON.stringify({ teamCode: TEAM_CODE, memberNo: 1, output: '120', code: 'print(120)' })
        });
        // Member 2
        await fetchJson('/api/submit', {
            method: 'POST',
            body: JSON.stringify({ teamCode: TEAM_CODE, memberNo: 2, output: 'True', code: 'print(True)' })
        });
        // Member 3 (Should Trigger Round Update)
        await fetchJson('/api/submit', {
            method: 'POST',
            body: JSON.stringify({ teamCode: TEAM_CODE, memberNo: 3, output: '8', code: 'print(8)' })
        });
    });

    await step('Verify Progression to Round 2', async () => {
        const res = await fetchJson(`/api/teams/${TEAM_CODE}/members`);
        if (res.currentRound !== 2) throw new Error(`Expected Round 2, got ${res.currentRound}`);
    });

    await step('Submit Round 2', async () => {
         // Submitting for all 3 again
         for (let i = 1; i <= 3; i++) {
            await fetchJson('/api/submit', {
                method: 'POST',
                body: JSON.stringify({ teamCode: TEAM_CODE, memberNo: i, output: 'Round 2', code: 'print("Round 2")' })
            });
         }
    });

    await step('Verify Progression to Round 3', async () => {
        const res = await fetchJson(`/api/teams/${TEAM_CODE}/members`);
        if (res.currentRound !== 3) throw new Error(`Expected Round 3, got ${res.currentRound}`);
    });

    await step('Submit Round 3 (Final)', async () => {
        for (let i = 1; i <= 3; i++) {
           await fetchJson('/api/submit', {
               method: 'POST',
               body: JSON.stringify({ teamCode: TEAM_CODE, memberNo: i, output: 'Round 3', code: 'print("Round 3")' })
           });
        }
   });

   await step('Verify Completion (Unlocking Status)', async () => {
        const res = await fetchJson(`/api/teams/${TEAM_CODE}/members`);
        if (res.status !== 'unlocking') throw new Error(`Expected status 'unlocking', got ${res.status}`);
   });

   console.log('\n🎉 TEST COMPLETE: Full 3-Round Cycle Validated!');
}

main();
