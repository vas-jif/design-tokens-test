import SwiftUI

/// Generated Handoff Component for Text Strong
/// Figma Node ID: 228:4291
public struct TextStrong: View {
    public init() {}

    public var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "hand.raised.fill")
                .font(.system(size: 40))
                .foregroundColor(DesignTokens.Color.blue)
            
            Text("Text Strong")
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
    TextStrong()
        .padding()
}
