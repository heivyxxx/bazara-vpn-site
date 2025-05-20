@echo off
cd /d %~dp0
git add .
git commit -m "Автокоммит"
git push origin main
pause
