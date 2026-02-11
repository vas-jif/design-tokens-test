const axios = require('axios');

async function detectReadyForDev() {
    const FIGMA_PAT = process.env.FIGMA_PAT;
    const FILE_KEY = process.env.FIGMA_FILE_KEY; // The production file to poll

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
        console.log(`Polling file ${FILE_KEY} for 'READY_FOR_DEV' status...`);

        // Fetch the file content. We use depth=1 to initially find pages/sections.
        // For larger files, we might need a more targeted search.
        const response = await client.get(`/files/${FILE_KEY}?depth=2`);
        const document = response.data.document;

        const readyNodes = [];

        function traverse(node) {
            // Check for devStatus on SECTION or FRAME nodes
            if ((node.type === 'SECTION' || node.type === 'FRAME') &&
                node.devStatus &&
                node.devStatus.type === 'READY_FOR_DEV') {
                readyNodes.push({
                    id: node.id,
                    name: node.name,
                    type: node.type
                });
            }

            if (node.children) {
                node.children.forEach(traverse);
            }
        }

        traverse(document);

        if (readyNodes.length > 0) {
            console.log(`Found ${readyNodes.length} nodes ready for development:`);
            readyNodes.forEach(n => console.log(`- [${n.type}] ${n.name} (ID: ${n.id})`));

            // Output for CI/Orchestrator
            await require('fs-extra').writeJson('ready_nodes.json', readyNodes, { spaces: 2 });
        } else {
            console.log("No nodes currently marked as 'READY_FOR_DEV'.");
        }

    } catch (error) {
        console.error('Error detecting ready for dev status:', error.response ? error.response.data : error.message);
    }
}

detectReadyForDev();
