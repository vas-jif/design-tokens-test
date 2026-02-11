const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

async function deployWorkflow() {
    const { N8N_API_KEY, N8N_BASE_URL } = process.env;

    if (!N8N_API_KEY || !N8N_BASE_URL) {
        console.error('Error: N8N_API_KEY or N8N_BASE_URL not found in .env');
        process.exit(1);
    }

    try {
        const workflowPath = './workflows/design-tokens-sync.json';
        const workflowData = await fs.readJson(workflowPath);

        console.log(`Deploying workflow to ${N8N_BASE_URL}...`);

        const client = axios.create({
            baseURL: N8N_BASE_URL,
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json',
            },
        });

        // Check if workflow exists to decide create vs update
        const listResponse = await client.get('/workflows');
        const existing = listResponse.data.data.find(w => w.name === workflowData.name);

        let response;
        if (existing) {
            console.log(`Updating existing workflow (ID: ${existing.id})...`);
            response = await client.put(`/workflows/${existing.id}`, workflowData);
        } else {
            console.log('Creating new workflow...');
            response = await client.post('/workflows', workflowData);
        }

        console.log('Successfully deployed n8n workflow!', response.data);
    } catch (error) {
        console.error('Error deploying workflow:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

deployWorkflow();
