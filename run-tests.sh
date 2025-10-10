#!/bin/bash

# Waqf Application - Test Runner Script
# This script sets up and runs the automated test suite

echo "🧪 Waqf Application - Test Suite"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Install Playwright browsers if needed
if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install --with-deps
    echo ""
fi

# Check if server is running on port 8000
if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "⚠️  Local server not running on port 8000"
    echo "   Starting server in background..."
    python -m http.server 8000 > /dev/null 2>&1 &
    SERVER_PID=$!
    echo "   Server started with PID: $SERVER_PID"
    sleep 2
    echo ""
else
    echo "✅ Local server is already running on port 8000"
    echo ""
fi

# Run tests based on argument
case "$1" in
    "headed")
        echo "🚀 Running tests in headed mode (visible browser)..."
        npx playwright test --headed
        ;;
    "ui")
        echo "🚀 Running tests in interactive UI mode..."
        npx playwright test --ui
        ;;
    "debug")
        echo "🔍 Running tests in debug mode..."
        npx playwright test --debug
        ;;
    "chromium")
        echo "🚀 Running tests on Chromium only..."
        npx playwright test --project=chromium
        ;;
    "firefox")
        echo "🚀 Running tests on Firefox only..."
        npx playwright test --project=firefox
        ;;
    "mobile")
        echo "📱 Running tests on mobile devices..."
        npx playwright test --project=mobile-chrome --project=mobile-safari
        ;;
    "report")
        echo "📊 Opening test report..."
        npx playwright show-report
        ;;
    *)
        echo "🚀 Running all tests in headless mode..."
        npx playwright test
        ;;
esac

TEST_EXIT_CODE=$?

echo ""
echo "================================"

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Run 'npm run test:report' to see details."
fi

echo ""
echo "Available commands:"
echo "  ./run-tests.sh          - Run all tests (headless)"
echo "  ./run-tests.sh headed   - Run with visible browser"
echo "  ./run-tests.sh ui       - Run in interactive mode"
echo "  ./run-tests.sh debug    - Run in debug mode"
echo "  ./run-tests.sh chromium - Run on Chromium only"
echo "  ./run-tests.sh firefox  - Run on Firefox only"
echo "  ./run-tests.sh mobile   - Run on mobile devices"
echo "  ./run-tests.sh report   - View test report"
echo ""

# Clean up server if we started it
if [ ! -z "$SERVER_PID" ]; then
    echo "🛑 Stopping local server (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null
fi

exit $TEST_EXIT_CODE

