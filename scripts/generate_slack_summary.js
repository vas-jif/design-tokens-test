const fs = require('fs-extra');

async function generateSlackSummary() {
    try {
        const summaryPath = 'change_summary.txt';
        if (!fs.existsSync(summaryPath)) {
            console.log('No change summary found.');
            return;
        }

        const rawSummary = await fs.readFile(summaryPath, 'utf8');
        const lines = rawSummary.split('\n');

        const blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🎨 AgentMany: Design System Update",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "The design library has been published. Repository has been synchronized with the latest tokens."
                }
            },
            {
                "type": "divider"
            }
        ];

        let currentSection = "";
        let sectionText = "";

        lines.forEach(line => {
            if (line.startsWith('###')) {
                if (sectionText) {
                    blocks.push({
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*${currentSection}*\n${sectionText}`
                        }
                    });
                }
                currentSection = line.replace('###', '').trim();
                sectionText = "";
            } else if (line.trim() && !line.startsWith('#')) {
                sectionText += `• ${line.trim()}\n`;
            }
        });

        if (sectionText) {
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*${currentSection}*\n${sectionText}`
                }
            });
        }

        blocks.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `📅 Generated on ${new Date().toLocaleDateString()} | 🤖 Powered by Antigravity`
                }
            ]
        });

        const output = { blocks };
        await fs.writeJson('slack_payload.json', output, { spaces: 2 });
        console.log('Successfully generated slack_payload.json');

    } catch (error) {
        console.error('Error generating Slack summary:', error);
    }
}

generateSlackSummary();
