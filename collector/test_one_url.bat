@echo off
setlocal
cd /d %~dp0
set /p URL="Paste one semnan.moi.ir URL: "
python main.py one "%URL%" --upload
pause
