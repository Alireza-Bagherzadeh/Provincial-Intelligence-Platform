@echo off
setlocal
cd /d %~dp0
python main.py crawl --upload
pause
