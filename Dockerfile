FROM ubuntu:22.04

# Prevent interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install required tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    # Tauri specific dependencies
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    # Windows Cross-compilation dependencies
    mingw-w64 \
    nsis \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (v20)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add x86_64-pc-windows-gnu

# Configure Cargo for Windows cross-compilation
RUN mkdir -p /root/.cargo && \
    echo "[target.x86_64-pc-windows-gnu]" > /root/.cargo/config.toml && \
    echo "linker = \"x86_64-w64-mingw32-gcc\"" >> /root/.cargo/config.toml

# Fix for AppImage creation inside Docker (FUSE issue)
ENV APPIMAGE_EXTRACT_AND_RUN=1

# Set the working directory
WORKDIR /app

# Copy package files and install npm dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the workspace
COPY . .

# Default command to build the Tauri app
# Note: For cross-compilation or Windows builds, it is recommended to use GitHub Actions 
# or a specific cross-compilation docker image like `messense/rust-musl-cross`.
CMD ["npm", "run", "tauri", "build"]
