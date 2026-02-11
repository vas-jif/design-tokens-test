// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AgentDesignSystem",
    platforms: [
        .iOS(.v15),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "AgentDesignSystem",
            targets: ["AgentDesignSystem"]),
    ],
    dependencies: [
        .package(url: "https://github.com/figma/code-connect", branch: "main")
    ],
    targets: [
        .target(
            name: "AgentDesignSystem",
            dependencies: [
                .product(name: "Figma", package: "code-connect")
            ],
            path: "Sources/AgentDesignSystem")
    ]
)
