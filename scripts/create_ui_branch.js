const { execSync } = require('child_process');
const fs = require('fs-extra');
require('dotenv').config();

async function createUIBranch() {
    try {
        const summaryPath = 'change_summary.txt';
        if (!fs.existsSync(summaryPath)) {
            console.log('No change summary found. Skipping branching.');
            return;
        }

        const summary = await fs.readFile(summaryPath, 'utf8');
        if (summary.includes('No visual changes detected')) {
            console.log('No changes detected in summary. Skipping branching.');
            return;
        }

        // Extract component name from summary if possible, or use a generic timestamp
        // For now, let's use a simple naming convention
        const timestamp = new Date().getTime();
        const branchName = `ui/update-${timestamp}`;

        console.log(`Creating new branch: ${branchName}...`);

        // Check if we are on main
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        if (currentBranch !== 'main') {
            console.log('Switching to main branch first...');
            execSync('git checkout main');
        }

        execSync(`git checkout -b ${branchName}`);
        execSync('git add .');
        execSync(`git commit -m "style: automated ui update ${timestamp}"`);
        execSync(`git push origin ${branchName}`);

        console.log(`Successfully pushed ${branchName} to origin.`);

        // Optional: Return to main
        execSync('git checkout main');

    } catch (error) {
        console.error('Error creating UI branch:', error.message);
    }
}

createUIBranch();
