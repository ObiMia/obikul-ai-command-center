@echo off
title Obikul AI - Setup Windows 11 Startup Catch-up Sync
color 0B
echo ==============================================================================
echo  OBIKUL AI COMMAND CENTER - WINDOWS 11 STARTUP SYNC INSTALLER
echo  Designed for Commander Obikul Mia
echo ==============================================================================
echo.
echo Installing background startup trigger...

set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_VBS=%TEMP%\CreateObikulSyncShortcut.vbs

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SHORTCUT_VBS%"
echo sLinkFile = "%STARTUP_DIR%\ObikulAICatchupSync.lnk" >> "%SHORTCUT_VBS%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SHORTCUT_VBS%"
echo oLink.TargetPath = "powershell.exe" >> "%SHORTCUT_VBS%"
echo oLink.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File ""%~dp0windows-sync.ps1""" >> "%SHORTCUT_VBS%"
echo oLink.WorkingDirectory = "%~dp0" >> "%SHORTCUT_VBS%"
echo oLink.Description = "Obikul AI 24/7 Catch-Up Sync Agent" >> "%SHORTCUT_VBS%"
echo oLink.Save >> "%SHORTCUT_VBS%"

cscript /nologo "%SHORTCUT_VBS%"
del "%SHORTCUT_VBS%"

echo.
echo [SUCCESS] Obikul AI Startup Sync has been installed!
echo Whenever you power ON your laptop, Obikul AI will automatically sync
echo all messages handled by the 24/7 Cloud Server and show your notification!
echo.
pause
