const axios = require('axios');
require('dotenv').config();

async function testConnection() {
    const { N8N_API_KEY, N8N_BASE_URL } = process.env;
    console.log(`Testing connection to: ${N8N_BASE_URL}`);

    try {
        const response = await axios.get(`${N8N_BASE_URL}/workflows`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY
            }
        });
        console.log('Successfully connected to n8n API!');
        console.log(`Found ${response.data.data.length} workflows.`);
    } catch (error) {
        console.error('Connection failed:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Response data:', error.response.data);
        }
    }
}

testConnection();
