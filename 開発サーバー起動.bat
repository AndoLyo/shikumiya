@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === 開発サーバー起動 (localhost:3000) ===
npm run dev
pause
