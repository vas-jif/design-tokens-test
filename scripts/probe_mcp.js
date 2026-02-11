const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

async function probeMCP() {
    const url = 'https://kogito.app.n8n.cloud/mcp-server/http';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDVmZWUxYi05YTJlLTQyODgtYWFhMi04MjdkMDM3MzFmYTUiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjliZTU3M2NiLWEyZTMtNDhlOC1hYjE1LTIxYzE4YTRlOTRkMCIsImlhdCI6MTc3MDcxNDM2MH0.OqPs7xbTi4a-XAuyU4wBQFD7OAUk6RSINev1rHvqO-U';

    console.log(`Probing MCP server at: ${url}`);

    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'tools/list',
            id: 2
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            }
        });

        const data = response.data;
        await fs.writeJson('mcp_tools.json', data, { spaces: 2 });
        console.log('Successfully saved MCP tools list to mcp_tools.json');
    } catch (error) {
        console.error('MCP Probe failed:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Response data:', error.response.data);
        }
    }
}

probeMCP();
