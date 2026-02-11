const axios = require('axios');
require('dotenv').config();

async function testConnection() {
    const url = 'https://kogito.app.n8n.cloud/api/v1/workflows';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDVmZWUxYi05YTJlLTQyODgtYWFhMi04MjdkMDM3MzFmYTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjliZTU3M2NiLWEyZTMtNDhlOC1hYjE1LTIxYzE4YTRlOTRkMCIsImlhdCI6MTc3MDcxNDM2MH0.OqPs7xbTi4a-XAuyU4wBQFD7OAUk6RSINev1rHvqO-U';

    console.log(`Testing connection to: ${url} with Bearer token`);

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Successfully connected to n8n API!');
    } catch (error) {
        console.error('Connection failed (Bearer):', error.response ? error.response.status : error.message);
    }

    console.log(`Testing connection to: ${url} with X-N8N-API-KEY`);
    try {
        const response = await axios.get(url, {
            headers: {
                'X-N8N-API-KEY': token
            }
        });
        console.log('Successfully connected to n8n API!');
    } catch (error) {
        console.error('Connection failed (X-N8N-API-KEY):', error.response ? error.response.status : error.message);
    }
}

testConnection();
