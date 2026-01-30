#!/bin/bash

# Script to check if Electron is properly installed
echo "Checking Electron installation..."

if [ -f "node_modules/electron/path.txt" ]; then
    echo "✓ Electron path.txt exists"
    cat node_modules/electron/path.txt
else
    echo "✗ Electron path.txt missing - binary download failed"
    echo ""
    echo "To fix this issue:"
    echo "1. Try using a VPN or different network connection"
    echo "2. Or set ELECTRON_MIRROR environment variable:"
    echo "   export ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'"
    echo "   bun install"
    echo ""
    echo "3. Or download manually from:"
    echo "   https://github.com/electron/electron/releases/tag/v40.0.0"
    echo ""
    echo "4. Or use npm instead of bun:"
    echo "   rm -rf node_modules/electron"
    echo "   npm install electron@40.0.0"
fi
