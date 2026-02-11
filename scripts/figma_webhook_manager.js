const axios = require('axios');

async function manageWebhooks() {
    const FIGMA_PAT = process.env.FIGMA_PAT;
    const TEAM_ID = process.env.FIGMA_TEAM_ID;
    const WEBHOOK_URL = process.env.WEBHOOK_URL; // n8n endpoint

    if (!FIGMA_PAT || !TEAM_ID || !WEBHOOK_URL) {
        console.error('Error: FIGMA_PAT, FIGMA_TEAM_ID, and WEBHOOK_URL must be set in environment.');
        process.exit(1);
    }

    const client = axios.create({
        baseURL: 'https://api.figma.com/v2',
        headers: {
            'X-Figma-Token': FIGMA_PAT
        }
    });

    try {
        console.log('Fetching active webhooks...');
        const listResponse = await client.get('/webhooks');
        const existing = listResponse.data.webhooks.find(w => w.endpoint === WEBHOOK_URL);

        if (existing) {
            console.log(`Webhook already exists: ${existing.id} (${existing.event_type})`);
        } else {
            console.log('Registering new LIBRARY_PUBLISH webhook...');
            const registerResponse = await client.post('/webhooks', {
                event_type: 'LIBRARY_PUBLISH',
                team_id: TEAM_ID,
                endpoint: WEBHOOK_URL,
                passcode: 'agentmany-secret' // Verify this in n8n
            });
            console.log(`Successfully registered webhook: ${registerResponse.data.id}`);
        }
    } catch (error) {
        console.error('Error managing webhooks:', error.response ? error.response.data : error.message);
    }
}

manageWebhooks();
