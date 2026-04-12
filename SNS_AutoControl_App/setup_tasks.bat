@echo off
chcp 65001 >nul
echo ==============================
echo  SNS AutoControl タスク登録
echo ==============================

set PYTHON=C:\Users\ryoya\AppData\Local\Programs\Python\Python310\python.exe
set PROJECT=C:\Users\ryoya\OneDrive\AI\Claude\SNS_AutoControl_App

echo.
echo [1/8] Flask WebUI（PC起動時）
schtasks /create /tn "SNS_Flask_WebUI" /tr "\"%PYTHON%\" \"%PROJECT%\app.py\"" /sc onstart /rl highest /f
echo.
echo [2/8] Webhook Server（PC起動時）
schtasks /create /tn "SNS_Webhook_Server" /tr "\"%PYTHON%\" \"%PROJECT%\run_webhook_setup.py\"" /sc onstart /rl highest /f
echo.
echo [3/8] Token Refresh（毎月1日 7:00）
schtasks /create /tn "SNS_Token_Refresh" /tr "\"%PYTHON%\" \"%PROJECT%\run_token_refresh.py\"" /sc monthly /d 1 /st 07:00 /f
echo.
echo [4/8] Research（毎日 7:00）
schtasks /create /tn "SNS_Research" /tr "\"%PYTHON%\" \"%PROJECT%\run_research.py\" --account shikumiya_ai" /sc daily /st 07:00 /f
echo.
echo [5/8] Writer（毎日 8:00）
schtasks /create /tn "SNS_Writer" /tr "\"%PYTHON%\" \"%PROJECT%\run_writer.py\" --account shikumiya_ai --platform threads --batch 10 --use-research --use-analysis" /sc daily /st 08:00 /f
echo.
echo [6/8] AutoPost（毎日 10:00）
schtasks /create /tn "SNS_AutoPost" /tr "\"%PYTHON%\" \"%PROJECT%\run_auto_post.py\" --platform ig_th" /sc daily /st 10:00 /f
echo.
echo [7/8] Fetcher（毎日 22:00）
schtasks /create /tn "SNS_Fetcher" /tr "\"%PYTHON%\" \"%PROJECT%\run_fetcher.py\" --account shikumiya_ai" /sc daily /st 22:00 /f
echo.
echo [8/8] Analyst（毎日 23:00）
schtasks /create /tn "SNS_Analyst" /tr "\"%PYTHON%\" \"%PROJECT%\run_analyst.py\" --account shikumiya_ai" /sc daily /st 23:00 /f

echo.
echo ==============================
echo  登録完了！
echo ==============================
pause
