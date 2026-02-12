import SwiftUI

/// Generated Handoff Component for Info Popover
/// Figma Node ID: 295:1373
public struct InfoPopover: View {
    public init() {}

    public var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "hand.raised.fill")
                .font(.system(size: 40))
                .foregroundColor(DesignTokens.Color.blue)
            
            Text("Info Popover")
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
    InfoPopover()
        .padding()
}
