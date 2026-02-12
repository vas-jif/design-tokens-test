const fs = require('fs-extra');

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
        const tokensPath = 'Sources/DesignTokens/designTokens.swift';
        if (!fs.existsSync(tokensPath)) {
            console.error('Error: designTokens.swift not found.');
            return;
        }

        const rawContent = await fs.readFile(tokensPath, 'utf8');
        const lines = rawContent.split('\n');
        let currentEnum = "";
        const colors = {};

        const enumRegex = /public enum (\w+) \{/i;
        const colorRegex = /(?:public\s+)?static let (\w+) = Color\(light: Color\(red: ([\d.]+), green: ([\d.]+), blue: ([\d.]+)\)/;

        lines.forEach(line => {
            const enumMatch = line.match(enumRegex);
            if (enumMatch) {
                currentEnum = enumMatch[1].toLowerCase();
            }

            const colorMatch = line.match(colorRegex);
            if (colorMatch) {
                const colorName = colorMatch[1].toLowerCase();
                // Store with namespace context if needed, but for our simple check
                // let's prioritize the tokens in the Background and Label enums
                if (currentEnum === 'background' || currentEnum === 'label') {
                    colors[colorName] = {
                        r: parseFloat(colorMatch[2]) * 255,
                        g: parseFloat(colorMatch[3]) * 255,
                        b: parseFloat(colorMatch[4]) * 255
                    };
                }
            }
        });

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
        } else {
            console.log('All checked pairs passed WCAG 2.1 AA.');
        }
    } catch (error) {
        console.error('Error auditing compliance:', error);
    }
}

module.exports = { auditCompliance };
if (require.main === module) { auditCompliance(); }
