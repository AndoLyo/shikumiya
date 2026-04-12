# SNS AutoControl タスクスケジューラ登録
# 右クリック → PowerShellで実行（管理者として）

$python = "C:\Users\ryoya\AppData\Local\Programs\Python\Python310\python.exe"
$project = "C:\Users\ryoya\OneDrive\AI\Claude\SNS_AutoControl_App"

Write-Host "=============================="
Write-Host " SNS AutoControl Task Setup"
Write-Host "=============================="

# 常時起動（PC起動時）
Write-Host "`n[1/8] Flask WebUI"
schtasks /create /tn "SNS_Flask_WebUI" /tr "`"$python`" `"$project\app.py`"" /sc onstart /rl highest /f

Write-Host "`n[2/8] Webhook Server"
schtasks /create /tn "SNS_Webhook_Server" /tr "`"$python`" `"$project\run_webhook_setup.py`"" /sc onstart /rl highest /f

# 月1
Write-Host "`n[3/8] Token Refresh (monthly)"
schtasks /create /tn "SNS_Token_Refresh" /tr "`"$python`" `"$project\run_token_refresh.py`"" /sc monthly /d 1 /st 07:00 /f

# 日次
Write-Host "`n[4/8] Research (daily 07:00)"
schtasks /create /tn "SNS_Research" /tr "`"$python`" `"$project\run_research.py`" --account shikumiya_ai" /sc daily /st 07:00 /f

Write-Host "`n[5/8] Writer (daily 08:00)"
schtasks /create /tn "SNS_Writer" /tr "`"$python`" `"$project\run_writer.py`" --account shikumiya_ai --platform threads --batch 10 --use-research --use-analysis" /sc daily /st 08:00 /f

Write-Host "`n[6/8] AutoPost (daily 10:00)"
schtasks /create /tn "SNS_AutoPost" /tr "`"$python`" `"$project\run_auto_post.py`" --platform ig_th" /sc daily /st 10:00 /f

Write-Host "`n[7/8] Fetcher (daily 22:00)"
schtasks /create /tn "SNS_Fetcher" /tr "`"$python`" `"$project\run_fetcher.py`" --account shikumiya_ai" /sc daily /st 22:00 /f

Write-Host "`n[8/8] Analyst (daily 23:00)"
schtasks /create /tn "SNS_Analyst" /tr "`"$python`" `"$project\run_analyst.py`" --account shikumiya_ai" /sc daily /st 23:00 /f

Write-Host "`n=============================="
Write-Host " Done!"
Write-Host "=============================="
Read-Host "Press Enter to close"
