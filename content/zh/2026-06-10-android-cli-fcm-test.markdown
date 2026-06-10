---
layout: post
title: "如何在 Android 中使用 CLI 測試發送 FCM 訊息"
date: '2026-06-10 11:30:00 +0800'
image: cover/generated/2026-06-10-android-cli-fcm-test-cover.png
tags:
  - Android
  - Firebase
  - CLI
permalink: /android-cli-fcm-test
categories: Android
excerpt: 本文介紹如何透過 gcloud + curl 呼叫 FCM HTTP API，使用命令列 (CLI) 向單一 Android 裝置發送測試推送訊息。
---

在 Android 開發中，測試 FCM（Firebase Cloud Messaging）推送訊息是常見的需求。雖然 Firebase Console 提供了發送測試訊息的介面，但在開發與自動化測試時，使用命令列（CLI）會更靈活且有效率。

本文將介紹如何透過 **gcloud + curl** 呼叫 FCM HTTP API，向單一裝置發送測試訊息。

---

## 1. 安裝 Google Cloud SDK（macOS）

首先，需要安裝 Google Cloud SDK 以取得存取 Token：

```bash
brew install --cask google-cloud-sdk
```

---

## 2. 登入並設定專案

使用 gcloud 進行身分驗證，並將預設專案設定為您的 Firebase 專案：

```bash
# 會跳出瀏覽器讓你登入
gcloud auth login
gcloud config set project <your-firebase-project-id>
```
your-firebase-project-id可以在網頁後台專案中找到

---

## 3. 取得 FCM Token

在 Android 裝置上啟動 App 並取得 FCM 註冊 Token。您可以透過 adb 篩選相關的 Logcat 輸出：

```bash
adb logcat -s FCMRepository FIMessage | grep -i "FCM Token"
```

複製 Log 中的 Token，並在終端機中設定以下環境變數：

> [!TIP]
> 其實也可以直接在指令中替換變數值。我個人習慣不設定環境變數，因為這個值是會頻繁變動的，設定在環境變數後每次都要重新尋找並修改反而比較繁瑣。

```bash
export FCM_TOKEN="<貼上 token>"
export PROJECT_ID="<your-firebase-project-id>"
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 4. 發送 Data Message

Data Message 會直接傳遞資料給 App 的背景服務，而不會自動彈出通知。

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "data": {
        "key1": "value1",
        "key2": "value2"
      }
    }
  }'
```

---

## 5. 發送 Notification Message

Notification Message 會由系統託管，當 App 在背景時會直接在通知列顯示。

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "notification": {
        "title": "Test Title",
        "body": "Test body message"
      }
    }
  }'
```

---

## 6. 發送 Notification + Data

結合通知與資料，點擊通知後可以根據資料跳轉到指定頁面：

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "notification": {
        "title": "Hello",
        "body": "Tap to open"
      },
      "data": {
        "screen": "home",
        "item_id": "99"
      }
    }
  }'
```

---

## 7. 重新取得 Access Token（過期時）

gcloud 產生的 Access Token 具有時效性（通常為 1 小時）。如果遇到 Token 過期的錯誤，請執行此指令更新環境變數：

```bash
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 8. 驗證裝置 Log

您可以監控 App 接收訊息的 Log，以驗證訊息是否成功送達裝置：

```bash
adb logcat -s FIMessage
```

---

## 9. 權限錯誤時重新登入

如果遇到權限或憑證相關錯誤（例如 `PERMISSION_DENIED`），請重新進行身分驗證與憑證設定：

```bash
gcloud auth login
gcloud auth application-default login
```
