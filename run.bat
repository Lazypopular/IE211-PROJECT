@echo off
chcp 65001 > nul
title Smart Energy Management System (Flask Server)
echo ========================================================
echo   ⚡ Smart Energy Management System (IE211)
echo   ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ (Flask)
echo ========================================================
echo.

set "PYTHON_EXE="

:: 1. ลองหาจาก Full path โดยตรง (แน่นอนที่สุด)
if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
)

:: 2. ถ้าไม่เจอ ลองหาจาก py launcher
if "%PYTHON_EXE%"=="" (
    where py >nul 2>&1
    if not errorlevel 1 set "PYTHON_EXE=py"
)

:: 3. ถ้าไม่เจอ ลองหาจาก python ใน PATH
if "%PYTHON_EXE%"=="" (
    where python >nul 2>&1
    if not errorlevel 1 set "PYTHON_EXE=python"
)

if "%PYTHON_EXE%"=="" (
    echo [ERROR] ไม่พบ Python ในเครื่อง กรุณาติดตั้ง Python 3.12 ก่อนใช้งาน
    pause
    exit /b 1
)

echo กำลังรันเซิร์ฟเวอร์ด้วย: %PYTHON_EXE%
echo 👉 เมื่อเริ่มทำงานแล้ว ให้เปิดเบราว์เซอร์ไปที่: http://127.0.0.1:5000
echo.

"%PYTHON_EXE%" app.py

pause
