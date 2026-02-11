const fs = require('fs-extra');

// WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text.
const MIN_CONTRAST_RATIO = 4.5;

function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(lum1, lum2) {
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

async function auditCompliance() {
    try {
        const tokensPath = 'Sources/AgentDesignSystem/Tokens/DesignTokens.swift';
        if (!fs.existsSync(tokensPath)) {
            console.error('Error: DesignTokens.swift not found.');
            return;
        }

        const content = await fs.readFile(tokensPath, 'utf8');

        // Simple regex to extract Color(red: G, green: G, blue: B)
        // Note: This is a simplified parser for demonstration
        const colorRegex = /static let (\w+) = Color\(light: Color\(red: ([\d.]+), green: ([\d.]+), blue: ([\d.]+)\)/g;
        let match;
        const colors = {};

        while ((match = colorRegex.exec(content)) !== null) {
            colors[match[1]] = {
                r: parseFloat(match[2]) * 255,
                g: parseFloat(match[3]) * 255,
                b: parseFloat(match[4]) * 255
            };
        }

        console.log('--- Design Token Compliance Audit ---');

        const backgrounds = ['primary', 'secondary', 'tertiary'];
        const labels = ['labelprimary', 'labelsecondary', 'labeltertiary'];

        let violations = 0;

        backgrounds.forEach(bgName => {
            const bg = colors[bgName];
            if (!bg) return;
            const bgLum = getLuminance(bg.r, bg.g, bg.b);

            labels.forEach(labelName => {
                const label = colors[labelName];
                if (!label) return;
                const labelLum = getLuminance(label.r, label.g, label.b);

                const ratio = getContrastRatio(bgLum, labelLum);
                const status = ratio >= MIN_CONTRAST_RATIO ? '✅ PASS' : '❌ FAIL';

                if (ratio < MIN_CONTRAST_RATIO) violations++;

                console.log(`[${status}] ${bgName} vs ${labelName}: ${ratio.toFixed(2)}:1`);
            });
        });

        console.log('--------------------------------------');
        if (violations > 0) {
            console.warn(`Found ${violations} accessibility violations.`);
            // process.exit(1); // Could be used to fail CI
        } else {
            console.log('All checked pairs passed WCAG 2.1 AA.');
        }

    } catch (error) {
        console.error('Error auditing compliance:', error);
    }
}

auditCompliance();
