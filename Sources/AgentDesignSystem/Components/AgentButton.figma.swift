import Figma
import SwiftUI

struct AgentButtonConnect: FigmaConnect {
    var component = AgentButton.self
    var figmaNodeUrl = "https://www.figma.com/design/T8cF4aVCf7XUXrPkwjwtea/Design-System?node-id=23-381"
    
    @FigmaString("Text")
    var text: String = "Button"
    
    @FigmaEnum("Variant", mapping: [
        "Primary": .primary,
        "Neutral": .neutral,
        "Subtle": .subtle
    ])
    var variant: AgentButton.Variant = .primary
    
    @FigmaEnum("Size", mapping: [
        "Medium": .medium,
        "Small": .small
    ])
    var size: AgentButton.Size = .medium
    
    var body: some View {
        AgentButton(
            text: self.text,
            variant: self.variant,
            size: self.size,
            action: {}
        )
    }
}
