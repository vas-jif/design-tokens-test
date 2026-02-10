const fs = require('fs-extra');
const path = require('path');

async function parseAndTransform() {
    try {
        const data = await fs.readJson('tokens/variables.json');
        const tokens = {};

        // Helper to find node by name or pattern
        function findNodes(node, pattern) {
            let results = [];
            if (node.name && node.name.match(pattern)) {
                results.push(node);
            }
            if (node.children) {
                for (const child of node.children) {
                    results = results.concat(findNodes(child, pattern));
                }
            }
            return results;
        }

        console.log('Searching for color cards...');
        const colorCards = findNodes(data.document, /^color-card-/);
        console.log(`Found ${colorCards.length} color cards.`);

        for (const card of colorCards) {
            // Name format: color-card-color/Red
            const tokenPath = card.name.replace('color-card-', '');
            const [category, name] = tokenPath.split('/');

            if (!tokens[category]) tokens[category] = {};

            // Extract Light Mode
            const lightColumn = card.children.find(c => c.name === 'mode-column-Light');
            const darkColumn = card.children.find(c => c.name === 'mode-column-Dark');

            const lightColor = extractColor(lightColumn);
            const darkColor = extractColor(darkColumn);

            if (lightColor) {
                tokens[category][name] = {
                    light: lightColor,
                    dark: darkColor || lightColor // Fallback to light if dark is missing
                };
            }
        }

        await generateSwift(tokens);

    } catch (error) {
        console.error('Error during parse and transform:', error);
    }
}

function extractColor(columnNode) {
    if (!columnNode || !columnNode.children) return null;
    const swatchWrapper = columnNode.children.find(c => c.name === 'swatch-wrapper');
    if (!swatchWrapper || !swatchWrapper.children) return null;
    const swatch = swatchWrapper.children[0];
    if (!swatch || !swatch.fills || !swatch.fills[0] || !swatch.fills[0].color) return null;

    const c = swatch.fills[0].color;
    return {
        r: c.r.toFixed(3),
        g: c.g.toFixed(3),
        b: c.b.toFixed(3),
        a: c.a.toFixed(3)
    };
}

async function generateSwift(tokens) {
    let swiftCode = `import SwiftUI

// Generated Design Tokens for AgentMany
// Generated on: ${new Date().toISOString()}

public enum DesignTokens {
`;

    for (const category in tokens) {
        swiftCode += `    public enum ${sanitize(category)} {\n`;
        for (const name in tokens[category]) {
            const token = tokens[category][name];
            const swiftName = sanitize(name, true);

            // Generate adaptive color using a helper or closure
            swiftCode += `        public static let ${swiftName} = Color(light: Color(red: ${token.light.r}, green: ${token.light.g}, blue: ${token.light.b}), dark: Color(red: ${token.dark.r}, green: ${token.dark.g}, blue: ${token.dark.b}))\n`;
        }
        swiftCode += `    }\n\n`;
    }

    // Add the Color extension for adaptive colors if not already present in project
    swiftCode += `}

// MARK: - Color Extension for Adaptive Colors
extension Color {
    init(light: Color, dark: Color) {
        self.init(uiColor: UIColor { traitCollection in
            switch traitCollection.userInterfaceStyle {
            case .dark:
                return UIColor(dark)
            default:
                return UIColor(light)
            }
        })
    }
}
`;

    const outputPath = path.join('Sources', 'DesignTokens', 'designTokens.swift');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, swiftCode);
    console.log(`Successfully generated Swift tokens at ${outputPath}`);
}

function sanitize(name, camelCase = false) {
    let sanitized = name.replace(/[^a-zA-Z0-9]/g, ' ');
    sanitized = sanitized.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');

    if (camelCase) {
        return sanitized.charAt(0).toLowerCase() + sanitized.slice(1);
    }
    return sanitized;
}

parseAndTransform();
