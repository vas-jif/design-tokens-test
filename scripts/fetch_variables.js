const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

async function fetchVariables() {
    const { FIGMA_PAT, FIGMA_FILE_KEY } = process.env;

    if (!FIGMA_PAT || !FIGMA_FILE_KEY) {
        console.error('Error: FIGMA_PAT or FIGMA_FILE_KEY not found in .env');
        process.exit(1);
    }

    console.log(`Fetching variables for file: ${FIGMA_FILE_KEY}...`);

    try {
        const response = await axios.get(
            `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_PAT,
                },
            }
        );

        const data = response.data;
        await fs.ensureDir('tokens');
        await fs.writeJson('tokens/variables.json', data, { spaces: 2 });

        console.log('Successfully saved variables to tokens/variables.json');
    } catch (error) {
        console.error('Error fetching variables:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

fetchVariables();
