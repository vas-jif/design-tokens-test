const axios = require('axios');

async function checkHealth() {
    const urls = [
        'https://kogito.app.n8n.cloud/api/v1/healthz',
        'https://kogito.app.n8n.cloud/api/v1/',
        'https://kogito.app.n8n.cloud/healthz'
    ];

    for (const url of urls) {
        console.log(`Checking: ${url}`);
        try {
            const response = await axios.get(url);
            console.log(`Success: ${url} (Status: ${response.status})`);
        } catch (error) {
            console.error(`Failed: ${url} (Status: ${error.response ? error.response.status : error.message})`);
        }
    }
}

checkHealth();
