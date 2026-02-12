const fs = require('fs-extra');
const path = require('path');

async function generateComponents() {
    try {
        const nodesPath = 'ready_nodes.json';
        if (!fs.existsSync(nodesPath)) {
            console.log('No ready nodes found to generate.');
            return;
        }

        const nodes = await fs.readJson(nodesPath);
        const outputDir = 'Sources/AgentDesignSystem/Components';
        await fs.ensureDir(outputDir);

        for (const node of nodes) {
            const componentName = node.name.replace(/\s+/g, '');
            const filePath = path.join(outputDir, `${componentName}.swift`);

            const swiftCode = `import SwiftUI

/// Generated Handoff Component for ${node.name}
/// Figma Node ID: ${node.id}
public struct ${componentName}: View {
    public init() {}

    public var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "hand.raised.fill")
                .font(.system(size: 40))
                .foregroundColor(DesignTokens.Color.blue)
            
            Text("${node.name}")
                .font(.headline)
            
            Text("Automated Handoff Stub")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Button(action: {}) {
                Text("Confirm Design")
                    .padding()
                    .background(DesignTokens.Background.primary)
                    .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 5)
    }
}

#Preview {
    ${componentName}()
        .padding()
}
`;

            await fs.writeFile(filePath, swiftCode);
            console.log(`Generated component: ${filePath}`);
        }

    } catch (error) {
        console.error('Error generating components:', error);
    }
}

generateComponents();
