<img src="./public/icon.svg" width="100">

# MinD.md

MinD.md is a local-first markdown power tool, equipped with an extensive feature set designed to provide writing flow with zero distractions. Built for performance and privacy.

## Key Features

### Advanced Markdown Rendering

- **GitHub Flavored Markdown (GFM)**: Fully supports classic Markdown syntax, including tables, task lists, and strikethroughs.
- **Math and LaTeX**: Render block and inline mathematical equations using KaTeX.
- **Diagrams as Code**: Automatically renders Mermaid syntax into diagrams, including flowcharts, sequence diagrams, state diagrams, class diagrams, pie charts, and Gantt charts.
- **Callouts and Directives**: Create visually distinct panels for notes, warnings, tips, information, and cautions.
- **Syntax Highlighting**: Real-time syntax highlighting for code blocks using PrismJS.
- **Table of Contents Generation**: Structure your notes with auto-generated table of contents logic.
- **Raw HTML and Sanitization**: Support for rendering embedded HTML with automatic sanitization to prevent XSS.

### Editor Interface

- **Flexible Workspaces**: Toggle between Edit view, Preview view, and Split view to suit your workflow.
- **Cursor Information**: Live tracking of your current line, column, selected characters, and selected words.
- **Word and Character Counts**: Immediate real-time stats updating as you write.

### Note Organization

- **Nested Folders**: Construct deep directory hierarchies to organize notes exactly how you want.
- **Tagging System**: Add, manage, and filter files utilizing extracted tags.
- **Search System**: Fast fuzzy searching implemented via Fuse.js for finding files or tags quickly.
- **Local Persistence**: Notes and folders are saved automatically to the browser local storage, ensuring work is not lost if the session ends.

### Synchronization and Persistence

- **GitHub Sync**: Connect to a remote GitHub repository using a personal access token (PAT) to push and sync individual note files.
- **Auto Synchronization**: Configurable auto-sync interval that actively updates your remote repository in the background at an interval of your choice.

### Customization

- **Plot Appearance Customization**: Override the default color schemes for plots and diagrams by specifying a local JSON configuration.
- **Theme Independent Interface**: An immersive dark mode aesthetic focusing on minimal distractions.

### Export and Sharing Options

- **Markdown Export**: Download notes in standard `.md` format.
- **Text Export**: Export as raw `.txt`.
- **HTML Export**: Export the fully rendered HTML snippet.
- **PDF Export**: Generate well-formatted PDF files directly from the rendered markdown.
- **DOC Export**: Save notes into formats accessible by word processors.

## Screenshot

![About](./website/public/About.png)
![Home](./website/public/Home.png)
![Settings](./website/public/Settings.png)
![Examples](./website/public/Examples.png)

## Getting Started

### Installation

Ensure that you have Node.js installed, then clone the repository and run:

1. \`npm install\` to install all required dependencies.
2. \`npm run dev\` to start the development server.

### Available Scripts

- \`npm run dev\`: Boots the Vite development server.
- \`npm run build\`: Builds the project for production.
- \`npm run preview\`: Previews the production build locally.
- \`npm run lint\`: Executes typescript type checking.

### Building Desktop Executables (macOS, Windows, Linux)

MinD.md uses **Tauri** to create standalone, lightweight native desktop applications for macOS, Windows, and Linux.

#### Prerequisites

1. Install [Node.js](https://nodejs.org/en)
2. Install [Rust](https://www.rust-lang.org/tools/install)
3. For Linux only, you must also install the Tauri system dependencies (like webkit2gtk). See the [Tauri Prerequisites Guide](https://tauri.app/v1/guides/getting-started/prerequisites) for your specific Linux distribution.

#### Development Desktop Mode

To run the application in a desktop window during development:

```bash
npm run tauri dev
```

#### Building the App

To build the executable natively for your operating system, run the following command:

```bash
npm run tauri build
```

##### Building with Docker (Cross-Compilation)

Docker can be used to build binaries in an isolated environment. Our provided Dockerfile is fully configured for **Linux** and **Windows** builds out of the box (utilizing MinGW for Windows cross-compilation). Note that cross-compiling for macOS from a Linux Docker container requires proprietary Apple SDKs and is not supported by this container.

1. Build the baseline Docker image:

```bash
docker build -t mind .
```

2. Run the build inside the container, isolating the node modules. Use the command corresponding to your target operating system:

**For Linux (.AppImage, .deb):**

```bash
docker run --rm -v "${PWD}:/app" -v /app/node_modules -e APPIMAGE_EXTRACT_AND_RUN=1 mind npm run tauri build -- --target x86_64-unknown-linux-gnu
```

**For Windows (.exe, .msi):**

```bash
docker run --rm -v "${PWD}:/app" -v /app/node_modules mind npm run tauri build -- --target x86_64-pc-windows-gnu
```

**For macOS (.app, .dmg):**
*(Requires OSXCross and Apple SDKs; recommended to build natively on a Mac or via GitHub Actions)*

```bash
docker run --rm -v "${PWD}:/app" -v /app/node_modules mind npm run tauri build -- --target x86_64-apple-darwin
```

*(If using the older Windows Command Prompt `cmd.exe` instead of PowerShell, replace `${PWD}` with `%cd%`)*

Once the build completes successfully, you will find your compiled native executables in the `src-tauri/target/release/bundle/` directory.

##### Building with GitHub Actions (Automated Cloud Builds)

We have configured an automated GitHub Actions workflow (`.github/workflows/release.yml`) that builds native installers for **Windows**, **macOS (Intel & Apple Silicon)**, and **Linux** entirely in the cloud.

To trigger the automated build:
1. Commit all your changes and push them to your repository.
2. Tag your release with a version number (e.g., `v1.0.0`) and push the tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. Navigate to the **Actions** tab on your GitHub repository to watch the builders compile your app.
4. Once finished, a new "Release" will be automatically drafted on your GitHub page containing the `.exe`, `.dmg`, and `.AppImage` files ready for download.
