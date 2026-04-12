@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === プロダクションビルド ===
npm run build
pause
