import SwiftUI

/// Generated Component: AgentButton
/// Generated from Figma Component Set: 23:381
/// Generated on: 2026-02-11T05:10:57.547Z

public struct AgentButton: View {
    public enum Variant {
        case primary, neutral, subtle
    }
    
    public enum Size {
        case medium, small
    }
    
    public enum State {
        case `default`, hover, disabled
    }
    
    let variant: Variant
    let size: Size
    let state: State
    let text: String
    let action: () -> Void
    
    public init(
        text: String,
        variant: Variant = .primary,
        size: Size = .medium,
        state: State = .default,
        action: @escaping () -> Void
    ) {
        self.text = text
        self.variant = variant
        self.size = size
        self.state = state
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            Text(text)
                .font(fontForSize)
                .padding(paddingForSize)
                .frame(minWidth: minWidthForSize)
        }
        .buttonStyle(AgentButtonButtonStyle(variant: variant, state: state))
        .disabled(state == .disabled)
    }
    
    private var fontForSize: Font {
        switch size {
        case .medium: return .body
        case .small: return .caption
        }
    }
    
    private var paddingForSize: EdgeInsets {
        switch size {
        case .medium: return EdgeInsets(top: 12, leading: 24, bottom: 12, trailing: 24)
        case .small: return EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16)
        }
    }
    
    private var minWidthForSize: CGFloat? {
        switch size {
        case .medium: return 100
        case .small: return 80
        }
    }
}

private struct AgentButtonButtonStyle: ButtonStyle {
    let variant: AgentButton.Variant
    let state: AgentButton.State
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(backgroundColor(isPressed: configuration.isPressed))
            .foregroundColor(foregroundColor)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(borderColor, lineWidth: 1)
            )
    }
    
    private func backgroundColor(isPressed: Bool) -> Color {
        // This is where DesignTokens are used
        switch variant {
        case .primary:
            if state == .disabled { return Color.gray.opacity(0.3) }
            return isPressed ? Color.blue.opacity(0.8) : Color.blue
        case .neutral:
            return isPressed ? Color.gray.opacity(0.2) : Color.clear
        case .subtle:
            return Color.clear
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .primary: return .white
        case .neutral, .subtle: return .blue
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .neutral: return .blue
        default: return .clear
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        AgentButton(text: "Primary", variant: .primary) {}
        AgentButton(text: "Neutral", variant: .neutral) {}
        AgentButton(text: "Subtle", variant: .subtle) {}
    }
    .padding()
}
