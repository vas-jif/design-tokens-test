const fs = require('fs-extra');
const path = require('path');

async function transformToSwift() {
    try {
        const data = await fs.readJson('tokens/variables.json');
        const { variables, variableCollections } = data.meta;

        let swiftCode = `import SwiftUI\n\n// Generated Design Tokens for AgentMany\n// Generated on: ${new Date().toISOString()}\n\npublic enum DesignTokens {\n`;

        // Organize by collection
        for (const collectionId in variableCollections) {
            const collection = variableCollections[collectionId];
            const sanitizedCollectionName = sanitizeName(collection.name);

            swiftCode += `    public enum ${sanitizedCollectionName} {\n`;

            // Filter variables for this collection
            const collectionVariables = Object.values(variables).filter(v => v.variableCollectionId === collectionId);

            for (const variable of collectionVariables) {
                const name = sanitizeName(variable.name, true);
                const type = variable.resolvedType;

                // Simplified Mode selection (assuming first mode for now)
                const modes = Object.keys(variable.valuesByMode);
                const value = variable.valuesByMode[modes[0]];

                if (type === 'COLOR') {
                    swiftCode += `        public static let ${name} = Color(red: ${value.r}, green: ${value.g}, blue: ${value.b}, opacity: ${value.a})\n`;
                } else if (type === 'FLOAT') {
                    swiftCode += `        public static let ${name}: CGFloat = ${value}\n`;
                }
            }

            swiftCode += `    }\n\n`;
        }

        swiftCode += `}\n`;

        const outputPath = path.join('Sources', 'DesignTokens', 'designTokens.swift');
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, swiftCode);

        console.log(`Successfully generated Swift tokens at ${outputPath}`);
    } catch (error) {
        console.error('Error transforming tokens:', error);
        process.exit(1);
    }
}

function sanitizeName(name, camelCase = false) {
    let sanitized = name.replace(/[^a-zA-Z0-9]/g, ' ');
    sanitized = sanitized.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');

    if (camelCase) {
        return sanitized.charAt(0).toLowerCase() + sanitized.slice(1);
    }
    return sanitized;
}

transformToSwift();
