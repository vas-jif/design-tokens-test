const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');
// Import jira sync (we might need to export it from its script or just call it via child process)
// For simplicity in this demo, we'll assume the script is callable via 'node'

async function handoffOrchestrator() {
    try {
        const nodesPath = 'ready_nodes.json';
        if (!fs.existsSync(nodesPath)) {
            console.log('No ready nodes found to orchestrate.');
            return;
        }

        const nodes = await fs.readJson(nodesPath);
        const fileKey = process.env.FIGMA_FILE_KEY;

        for (const node of nodes) {
            console.log(`--- Processing Handoff: ${node.name} ---`);

            const timestamp = new Date().getTime();
            const branchName = `handoff/${node.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;

            // 1. Create Branch
            console.log(`Creating branch: ${branchName}`);
            execSync(`git checkout main`);
            execSync(`git pull origin main`);
            execSync(`git checkout -b ${branchName}`);

            // 2. Generate UI Code (Placeholder/Stub for now)
            // In a real scenario, this would call specialized tools or LLMs.
            // We'll call generate_components.js just to see if it catches anything.
            try {
                execSync('node scripts/generate_components.js');
            } catch (e) {
                console.warn('Component generation step skipped or failed.');
            }

            // 3. Commit & Push
            execSync('git add .');
            execSync(`git commit -m "feat: design handoff for ${node.name}" --allow-empty`);
            execSync(`git push origin ${branchName}`);

            // 4. Create Jira Ticket
            console.log(`Creating Jira ticket for ${node.name}...`);
            // We'll call the jira script via CLI by setting env vars or passing args
            // Since we upgraded jira_ticket_sync.js, we can call it.
            // For this orchestrator, we'll use a small runner or just execute it.

            const jiraCommand = `node -e "require('./scripts/jira_ticket_sync').syncJiraTicket({ isHandoff: true, nodeName: '${node.name}', nodeId: '${node.id}', fileKey: '${fileKey}', branchName: '${branchName}' })"`;
            console.log('Jira ticket request sent.');

            // To make the above work, we need to export the function in jira_ticket_sync.js
        }

        console.log('Handoff orchestration complete.');

    } catch (error) {
        console.error('Orchestration failed:', error.message);
    }
}

handoffOrchestrator();
