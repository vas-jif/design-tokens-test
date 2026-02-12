const axios = require('axios');
const fs = require('fs-extra');

async function detectReadyForDev() {
    const FIGMA_PAT = process.env.FIGMA_PAT;
    const FILE_KEY = process.env.FIGMA_FILE_KEY;

    if (!FIGMA_PAT || !FILE_KEY) {
        console.error('Error: FIGMA_PAT and FIGMA_FILE_KEY must be set.');
        return;
    }

    const client = axios.create({
        baseURL: 'https://api.figma.com/v1',
        headers: {
            'X-Figma-Token': FIGMA_PAT
        }
    });

    try {
        console.log(`Polling Figma file ${FILE_KEY} for READY_FOR_DEV nodes...`);
        const response = await client.get(`/files/${FILE_KEY}`);
        const document = response.data.document;

        const readyNodes = [];

        function searchNodes(node) {
            if (node.devStatus && node.devStatus.type === 'READY_FOR_DEV') {
                readyNodes.push({
                    id: node.id,
                    name: node.name,
                    type: node.type
                });
            }

            if (node.children) {
                node.children.forEach(searchNodes);
            }
        }

        searchNodes(document);

        await fs.writeJson('ready_nodes.json', readyNodes, { spaces: 2 });
        console.log(`Found ${readyNodes.length} nodes marked READY_FOR_DEV.`);
        readyNodes.forEach(n => console.log(` - ${n.name} (${n.id})`));

    } catch (error) {
        console.error('Error detecting ready nodes:', error.response ? error.response.data : error.message);
    }
}

detectReadyForDev();
