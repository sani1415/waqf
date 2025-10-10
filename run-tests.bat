@echo off
REM Waqf Application - Test Runner Script (Windows)
REM This script sets up and runs the automated test suite

echo.
echo 🧪 Waqf Application - Test Suite
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Install Playwright browsers if needed
if not exist "%USERPROFILE%\AppData\Local\ms-playwright" (
    echo 🌐 Installing Playwright browsers...
    call npx playwright install --with-deps
    echo.
)

REM Check if server is running on port 8000
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Local server not running on port 8000
    echo    Starting server in background...
    start /B python -m http.server 8000
    timeout /t 2 /nobreak >nul
    echo.
) else (
    echo ✅ Local server is already running on port 8000
    echo.
)

REM Run tests based on argument
if "%1"=="headed" (
    echo 🚀 Running tests in headed mode ^(visible browser^)...
    call npx playwright test --headed
) else if "%1"=="ui" (
    echo 🚀 Running tests in interactive UI mode...
    call npx playwright test --ui
) else if "%1"=="debug" (
    echo 🔍 Running tests in debug mode...
    call npx playwright test --debug
) else if "%1"=="chromium" (
    echo 🚀 Running tests on Chromium only...
    call npx playwright test --project=chromium
) else if "%1"=="firefox" (
    echo 🚀 Running tests on Firefox only...
    call npx playwright test --project=firefox
) else if "%1"=="mobile" (
    echo 📱 Running tests on mobile devices...
    call npx playwright test --project=mobile-chrome --project=mobile-safari
) else if "%1"=="report" (
    echo 📊 Opening test report...
    call npx playwright show-report
) else (
    echo 🚀 Running all tests in headless mode...
    call npx playwright test
)

set TEST_EXIT_CODE=%errorlevel%

echo.
echo ================================

if %TEST_EXIT_CODE% equ 0 (
    echo ✅ All tests passed!
) else (
    echo ❌ Some tests failed. Run 'npm run test:report' to see details.
)

echo.
echo Available commands:
echo   run-tests.bat          - Run all tests ^(headless^)
echo   run-tests.bat headed   - Run with visible browser
echo   run-tests.bat ui       - Run in interactive mode
echo   run-tests.bat debug    - Run in debug mode
echo   run-tests.bat chromium - Run on Chromium only
echo   run-tests.bat firefox  - Run on Firefox only
echo   run-tests.bat mobile   - Run on mobile devices
echo   run-tests.bat report   - View test report
echo.

exit /b %TEST_EXIT_CODE%

