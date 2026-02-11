const axios = require('axios');
const fs = require('fs-extra');

async function syncJiraTicket(options = {}) {
    const {
        isHandoff = false,
        nodeName = '',
        nodeId = '',
        fileKey = '',
        branchName = ''
    } = options;

    const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
    const JIRA_EMAIL = process.env.JIRA_EMAIL;
    const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
    const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'DS';

    if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
        console.warn('Jira credentials missing. Running in DRY-RUN mode.');
    }

    try {
        const summaryPath = 'change_summary.txt';
        const changeSummary = fs.existsSync(summaryPath) ? await fs.readFile(summaryPath, 'utf8') : "";

        let title = `🎨 Design System Sync: ${new Date().toLocaleDateString()}`;
        let descriptionText = "The design library was updated. The following tokens were synchronized:\n\n" + changeSummary;

        if (isHandoff) {
            title = `🚀 Handoff: ${nodeName}`;
            const figmaLink = `https://www.figma.com/file/${fileKey}?node-id=${nodeId}`;
            descriptionText = `A new design is ready for development.\n\n` +
                `*Design*: ${nodeName}\n` +
                `*Figma Link*: ${figmaLink}\n` +
                `*Branch*: ${branchName || 'TBD'}\n\n` +
                `Please review the generated UI code and implement the business logic.`;
        }

        const payload = {
            fields: {
                project: { key: JIRA_PROJECT_KEY },
                summary: title,
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", text: descriptionText }]
                        }
                    ]
                },
                issuetype: { name: isHandoff ? "Story" : "Task" },
                labels: isHandoff ? ["handoff", "figma-auto"] : ["design-tokens"]
            }
        };

        if (JIRA_DOMAIN && JIRA_API_TOKEN) {
            const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
            const response = await axios.post(`https://${JIRA_DOMAIN}.atlassian.net/rest/api/3/issue`, payload, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Successfully created Jira ticket: ${response.data.key}`);
        } else {
            console.log('DRY-RUN payload generated:');
            console.log(JSON.stringify(payload, null, 2));
        }

    } catch (error) {
        console.error('Error syncing with Jira:', error.response ? error.response.data : error.message);
    }
}

module.exports = { syncJiraTicket };

// Run if called directly
if (require.main === module) {
    syncJiraTicket();
}
