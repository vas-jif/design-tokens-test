const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

async function fetchComponents() {
    const { FIGMA_PAT, FIGMA_FILE_KEY } = process.env;

    if (!FIGMA_PAT || !FIGMA_FILE_KEY) {
        console.error('Error: FIGMA_PAT or FIGMA_FILE_KEY not found in .env');
        process.exit(1);
    }

    try {
        console.log(`Fetching components from file: ${FIGMA_FILE_KEY}...`);
        const response = await axios.get(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
            headers: { 'X-Figma-Token': FIGMA_PAT }
        });

        const components = response.data.components;
        const componentSets = response.data.componentSets;

        await fs.ensureDir('metadata');
        await fs.writeJson('metadata/components.json', { components, componentSets }, { spaces: 2 });

        console.log(`Found ${Object.keys(components || {}).length} individual components and ${Object.keys(componentSets || {}).length} component sets.`);
        console.log('Metadata saved to metadata/components.json');

    } catch (error) {
        console.error('Error fetching components:', error.response ? error.response.data : error.message);
    }
}

fetchComponents();
