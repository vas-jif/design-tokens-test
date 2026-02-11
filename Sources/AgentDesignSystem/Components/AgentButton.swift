import SwiftUI

/// Generated Component: AgentButton
/// Generated from Figma Component Set: 23:381
/// Generated on: 2026-02-11T06:58:28.249Z

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
        case .medium: return EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16)
        case .small: return EdgeInsets(top: 8, leading: 8, bottom: 8, trailing: 8)
        }
    }
    
    private var minWidthForSize: CGFloat? {
        switch size {
        case .medium: return 44
        case .small: return 32
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
        switch variant {
        case .primary:
            if state == .disabled { return DesignTokens.Miscellaneous.fillbuttondisabled }
            return isPressed ? DesignTokens.Gray.black.opacity(0.8) : DesignTokens.Gray.black
        case .neutral:
            if state == .disabled { return Color.clear }
            return isPressed ? DesignTokens.Gray.gray6 : DesignTokens.Background.secondary
        case .subtle:
            return isPressed ? DesignTokens.Gray.gray6.opacity(0.5) : Color.clear
        }
    }
    
    private var foregroundColor: Color {
        switch variant {
        case .primary: return DesignTokens.Gray.white
        case .neutral, .subtle: 
            if state == .disabled { return DesignTokens.Gray.gray }
            return DesignTokens.Gray.black
        }
    }
    
    private var borderColor: Color {
        switch variant {
        case .neutral: 
            if state == .disabled { return DesignTokens.Gray.gray5 }
            return DesignTokens.Separator.colorseparator
        default: return Color.clear
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
