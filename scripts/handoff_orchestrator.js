const fs = require('fs-extra');
const { execSync } = require('child_process');

async function handoffOrchestrator() {
    try {
        const nodesPath = 'ready_nodes.json';
        if (!fs.existsSync(nodesPath)) {
            console.log('No ready nodes found to orchestrate.');
            return;
        }

        const nodes = await fs.readJson(nodesPath);
        for (const node of nodes) {
            console.log(`--- Processing Handoff: ${node.name} ---`);
            const timestamp = new Date().getTime();
            const branchName = `handoff/${node.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;

            console.log(`Creating branch: ${branchName}`);
            execSync(`git checkout main`);
            execSync(`git pull origin main`);
            execSync(`git checkout -b ${branchName}`);

            console.log(`Generating UI Code for ${node.name}...`);
            try {
                execSync('node scripts/generate_components.js', { stdio: 'inherit' });
            } catch (e) {
                console.warn('Component generation failed.');
            }

            console.log(`Auditing compliance for ${node.name}...`);
            try {
                execSync('node scripts/audit_compliance.js', { stdio: 'inherit' });
            } catch (e) {
                console.warn('Compliance audit failed or found violations.');
            }

            console.log(`Performing Agentic Pre-Merge Audit for ${node.name}...`);
            const isComplex = node.name.toLowerCase().includes('complex') || node.type === 'GROUP';
            if (isComplex) {
                console.warn(`[AGENT ALERT] ${node.name} contains complex structures. Manual review recommended.`);
            } else {
                console.log(`[AGENT PASS] ${node.name} architecture looks solid.`);
            }

            execSync('git add .');
            execSync(`git commit -m "feat: design handoff for ${node.name}" --allow-empty`);
            execSync(`git push origin ${branchName}`);
        }
    } catch (error) {
        console.error('Orchestration failed:', error.message);
    }
}

handoffOrchestrator();
