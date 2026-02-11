const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

async function generateComponents() {
    try {
        const configPath = 'config/component-mapping.json';
        const metadataPath = 'metadata/components.json';

        if (!fs.existsSync(configPath) || !fs.existsSync(metadataPath)) {
            console.error('Error: Config or metadata files missing.');
            return;
        }

        const config = await fs.readJson(configPath);
        const metadata = await fs.readJson(metadataPath);

        const timestamp = new Date().toISOString();

        for (const mapping of config.mappings) {
            console.log(`Generating component: ${mapping.swiftuiName}...`);

            const templatePath = mapping.template;
            if (!fs.existsSync(templatePath)) {
                console.warn(`Template not found: ${templatePath}`);
                continue;
            }

            const templateContent = await fs.readFile(templatePath, 'utf8');

            // Render template
            const rendered = ejs.render(templateContent, {
                name: mapping.swiftuiName,
                figmaId: mapping.figmaComponentSetId,
                timestamp: timestamp
            });

            // Updated for Swift Package structure
            const outputPath = path.join('Sources', 'AgentDesignSystem', 'Components', `${mapping.swiftuiName}.swift`);
            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, rendered);

            console.log(`Successfully generated ${outputPath}`);
        }

    } catch (error) {
        console.error('Error generating components:', error);
    }
}

generateComponents();
