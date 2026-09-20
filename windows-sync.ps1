<#
==============================================================================
 OBIKUL AI - WINDOWS 11 STARTUP CATCH-UP SYNC AGENT
 Designed for Commander Obikul Mia
==============================================================================
 This script runs when Commander Obikul powers on their Windows laptop.
 It connects to the 24/7 Cloud Background Server, queries all events that
 occurred while the laptop was powered off, and triggers a rich Windows 11
 Native Toast Notification summarizing:
  - Total messages auto-handled
  - Leads captured & rate cards sent
  - High-value deals pending approval
  - Direct link to open the AI Cockpit
==============================================================================
#>

param (
    [string]$ServerUrl = "https://obikul-ai-command-center.onrender.com",
    [int]$RetrySeconds = 5
)

# Output Console Header
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ⚡ OBIKUL AI WINDOWS 11 CATCH-UP SYNC AGENT" -ForegroundColor Green
Write-Host " 👑 Commander: Obikul Mia" -ForegroundColor Yellow
Write-Host " ☁️ Querying Cloud Server: $ServerUrl" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Wait briefly for internet connection if running immediately at startup
Start-Sleep -Seconds 3

try {
    $apiUrl = "$ServerUrl/api/catchup/summary"
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get -TimeoutSec 10 -ErrorAction Stop

    $commander = $response.commander
    $offline = $response.offlineActivity
    $totalEvents = $offline.totalEvents
    $autoReplied = $offline.autoRepliedCount
    $pending = $offline.pendingApprovalCount
    $dealValue = $offline.estimatedDealsValue
    $dealFormatted = "Rs. {0:N0}" -f $dealValue

    Write-Host "[OK] Sync Successful!" -ForegroundColor Green
    Write-Host " -> Messages Processed While Offline: $totalEvents" -ForegroundColor White
    Write-Host " -> Autonomous Auto-Replies: $autoReplied" -ForegroundColor Cyan
    Write-Host " -> Pending Commander Approval: $pending" -ForegroundColor Yellow
    Write-Host " -> Estimated Deal Value Protected: $dealFormatted" -ForegroundColor Green

    # Prepare Toast Notification Text
    $toastTitle = "⚡ Obikul AI: Welcome Back Commander!"
    $toastMessage = "While your laptop was OFF, AI handled $totalEvents messages ($autoReplied auto-replied). Value: $dealFormatted. $pending items pending your review."

    # Windows 10/11 Interactive Toast Notification XML
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] > $null

    $template = @"
<toast activationType="protocol" launch="$ServerUrl">
    <visual>
        <binding template="ToastGeneric">
            <text>$toastTitle</text>
            <text>$toastMessage</text>
            <text placement="attribution">Obikul AI 24/7 Cloud Mission Control</text>
        </binding>
    </visual>
    <actions>
        <action content="🚀 Open Cockpit" arguments="$ServerUrl" activationType="protocol"/>
        <action content="✔ Dismiss" arguments="dismiss" activationType="system"/>
    </actions>
    <audio src="ms-winsoundevent:Notification.Default"/>
</toast>
"@

    $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
    $xml.LoadXml($template)
    $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
    $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("Obikul.AI.CommandCenter")
    $notifier.Show($toast)

    Write-Host "🔔 Windows 11 Native Notification Delivered." -ForegroundColor Green

    # Acknowledge sync with server
    try {
        Invoke-RestMethod -Uri "$ServerUrl/api/catchup/ack" -Method Post -TimeoutSec 5 | Out-Null
    } catch {}

} catch {
    Write-Host "⚠️ Could not connect to Obikul AI Cloud Server ($ServerUrl)." -ForegroundColor Red
    Write-Host "Reason: $($_.Exception.Message)" -ForegroundColor DarkGray
    Write-Host "Make sure your server is running locally ('npm start') or deployed on your cloud URL (Render/Railway)." -ForegroundColor Yellow
}
